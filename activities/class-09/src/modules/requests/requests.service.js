// Capa de coordinación para el módulo de requests. Desde la clase 5 cada
// operación recibe al actor autenticado: el servicio aplica la política del
// módulo, conserva las reglas del caso de uso de las clases 3-4 y define
// unidades de trabajo. Sin SQL, sin códigos HTTP.

import { withTransaction } from '../../database/transaction.js';
import {
  findAll,
  findById,
  insertRequest,
  updateRequest,
  assignRequest,
  insertHistoryEvent,
  findHistory
} from './requests.store.js';
import { mapRequestRow, mapHistoryEventRow } from './request.mapper.js';
import { STATUSES, isValidStatus, isTerminal, canTransition } from './request-status.js';
import {
  canListAllRequests,
  canViewRequest,
  canViewHistory,
  canCreateRequest,
  canEditContent,
  canChangePriority,
  canChangeStatus,
  canClaimRequest
} from './request.policy.js';
import { AppError } from '../../app-error.js';

const PRIORITIES = ['low', 'medium', 'high'];
const UPDATABLE_FIELDS = ['title', 'description', 'priority', 'status'];

// Campos que el servidor controla en las peticiones. Enviarlos es una
// violación del contrato, respondida explícitamente — nunca ignorada en
// silencio.
const SERVER_CONTROLLED_FIELDS = ['id', 'createdBy', 'createdAt', 'updatedAt', 'changedBy', 'assignedTo'];

// Un recurso ajeno responde exactamente como si faltara: mismo estado,
// mismo código, mismo mensaje. Una respuesta distinta confirmaría que existe.
function notFound(id) {
  return new AppError('resource', 'REQUEST_NOT_FOUND', `Request ${id} does not exist.`);
}

function forbidden(message) {
  return new AppError('forbidden', 'FORBIDDEN', message);
}

function rejectServerControlledFields(body, extra = []) {
  for (const field of [...SERVER_CONTROLLED_FIELDS, ...extra]) {
    if (body && field in body) {
      throw new AppError('contract', 'SERVER_CONTROLLED_FIELD',
        `The field "${field}" is controlled by the server.`);
    }
  }
}

// Primera defensa: la aplicación valida el contrato ANTES de que se ejecute
// cualquier SQL. PostgreSQL mantiene su restricción CHECK como segunda defensa
// — protege la integridad aunque esta línea desaparezca en algún momento.
function assertValidPriority(priority) {
  if (!PRIORITIES.includes(priority)) {
    throw new AppError('contract', 'INVALID_PRIORITY',
      'Priority must be low, medium or high.');
  }
}

export async function listRequests(actor, filters) {
  if (filters.status !== undefined && !isValidStatus(filters.status)) {
    throw new AppError('contract', 'INVALID_FILTER',
      `Unknown status "${filters.status}". Valid values: ${STATUSES.join(', ')}.`);
  }
  if (filters.priority !== undefined && !PRIORITIES.includes(filters.priority)) {
    throw new AppError('contract', 'INVALID_FILTER',
      `Unknown priority "${filters.priority}". Valid values: ${PRIORITIES.join(', ')}.`);
  }

  // Los agents ven toda la colección; los requesters ven la suya, limitada en
  // el SQL mismo — el WHERE vive en el store, no en JavaScript.
  const scope = canListAllRequests(actor)
    ? filters
    : { ...filters, createdBy: actor.userId };

  const rows = await findAll(scope);
  return rows.map(mapRequestRow);
}

export async function getRequest(actor, id) {
  const row = await findById(id);
  if (!row) throw notFound(id);

  // TEMP(REQ-442): la comprobación de visibilidad está desactivada mientras
  // support compara informes duplicados entre requesters. Rehabilitarla tras la auditoría.
  return mapRequestRow(row);
}

export async function createRequest(actor, input) {
  if (!canCreateRequest(actor)) {
    throw forbidden('Only requesters can create requests.');
  }

  // status también está controlado por el servidor en la creación: una petición
  // nace abierta.
  rejectServerControlledFields(input, ['status']);

  const { title, description, priority } = input ?? {};

  if (typeof title !== 'string' || title.trim() === '') {
    throw new AppError('contract', 'TITLE_REQUIRED', 'A request needs a non-empty title.');
  }
  if (priority !== undefined) assertValidPriority(priority);

  // La creación es una unidad de trabajo: la petición Y su historial inicial
  // (NULL -> open) ocurren juntos o no ocurren. El propietario y el actor del
  // historial provienen de la identidad autenticada.
  const row = await withTransaction(async (client) => {
    const created = await insertRequest({
      title: title.trim(),
      description: typeof description === 'string' ? description : null,
      priority: priority ?? 'medium',
      createdBy: actor.userId
    }, client);
    await insertHistoryEvent({
      requestId: created.id,
      type: 'status_changed',
      fromStatus: null,
      toStatus: created.status,
      changedBy: actor.userId
    }, client);
    return created;
  });

  return mapRequestRow(row);
}

export async function patchRequest(actor, id, body) {
  rejectServerControlledFields(body);

  const changes = {};
  for (const field of UPDATABLE_FIELDS) {
    if (body?.[field] !== undefined) changes[field] = body[field];
  }

  if (Object.keys(changes).length === 0) {
    throw new AppError('contract', 'NO_UPDATABLE_FIELDS',
      `The body must include at least one of: ${UPDATABLE_FIELDS.join(', ')}.`);
  }
  if (changes.title !== undefined && (typeof changes.title !== 'string' || changes.title.trim() === '')) {
    throw new AppError('contract', 'TITLE_REQUIRED', 'The title cannot be empty.');
  }
  if (changes.priority !== undefined) assertValidPriority(changes.priority);
  if (changes.status !== undefined && !isValidStatus(changes.status)) {
    throw new AppError('contract', 'INVALID_STATUS',
      `Unknown status "${changes.status}". Valid values: ${STATUSES.join(', ')}.`);
  }
  if (changes.title !== undefined) changes.title = changes.title.trim();

  // Lee, autoriza contra el estado ACTUAL, valida, escribe y registra el
  // historial — todo con el mismo cliente, como una sola unidad de trabajo.
  const row = await withTransaction(async (client) => {
    const current = await findById(id, client);
    if (!current) throw notFound(id);

    const request = mapRequestRow(current);
    if (!canViewRequest(actor, request)) throw notFound(id);

    // La autorización es todo o nada: un cuerpo que mezcle un cambio permitido
    // y otro prohibido se rechaza completo. Sin sorpresas parciales.
    const wantsContent = changes.title !== undefined || changes.description !== undefined;
    const wantsPriority = changes.priority !== undefined;
    const wantsStatus = changes.status !== undefined;

    if (wantsContent && !canEditContent(actor, request)) {
      throw forbidden('Only the owner can edit title and description, and only while the request is open.');
    }
    if (wantsPriority && !canChangePriority(actor)) {
      throw forbidden('Only agents can change the priority.');
    }
    if (wantsStatus && !canChangeStatus(actor)) {
      throw forbidden('Only agents can change the status.');
    }

    // Las reglas de las clases 3-4 siguen aplicándose — a todos los roles.
    if (isTerminal(current.status)) {
      throw new AppError('domain', 'REQUEST_IN_TERMINAL_STATUS',
        `Request ${id} is ${current.status} and can no longer be modified.`);
    }

    const statusChanges = changes.status !== undefined && changes.status !== current.status;
    if (statusChanges && !canTransition(current.status, changes.status)) {
      throw new AppError('domain', 'INVALID_STATUS_TRANSITION',
        `A request cannot move from ${current.status} to ${changes.status}.`);
    }

    const updated = await updateRequest(id, changes, client);
    // El actor del historial es la identidad autenticada — changedBy nunca puede
    // llegar desde el cuerpo. Cada tipo de cambio deja su propio evento.
    if (statusChanges) {
      await insertHistoryEvent({
        requestId: id,
        type: 'status_changed',
        fromStatus: current.status,
        toStatus: changes.status,
        changedBy: actor.userId
      }, client);
    }
    if (changes.priority !== undefined && changes.priority !== current.priority) {
      await insertHistoryEvent({
        requestId: id,
        type: 'priority_changed',
        fromPriority: current.priority,
        toPriority: changes.priority,
        changedBy: actor.userId
      }, client);
    }
    return updated;
  });

  return mapRequestRow(row);
}

export async function getHistory(actor, id) {
  const row = await findById(id);
  if (!row) throw notFound(id);

  const request = mapRequestRow(row);
  if (!canViewHistory(actor, request)) throw notFound(id);

  const rows = await findHistory(id);
  return rows.map(mapHistoryEventRow);
}

// FEATURE-801 · Claim: una ACCIÓN de negocio, no una actualización genérica
// de campo. El servicio coordina: obtener, aplicar la política, pedir al store
// una operación consistente y traducir denegaciones a errores de aplicación.
// Nunca lee params ni headers, y assignedTo NUNCA viene del cliente — la
// identidad del actor es la única fuente.
export async function claimRequest(actor, id, body) {
  // Un endpoint de acción no toma cuerpo. Si alguien envía campos controlados
  // por el servidor de todas formas, el contrato responde explícitamente en vez
  // de ignorarlos.
  rejectServerControlledFields(body, ['status']);

  return withTransaction(async (client) => {
    const current = await findById(id, client);
    if (!current) throw notFound(id);

    const request = mapRequestRow(current);
    const verdict = canClaimRequest({ actor, request });

    if (!verdict.allowed) {
      if (verdict.reason === 'NOT_AGENT') {
        throw forbidden('Only agents can claim requests.');
      }
      if (verdict.reason === 'ALREADY_ASSIGNED') {
        throw new AppError('domain', 'REQUEST_ALREADY_ASSIGNED',
          'The request is already assigned.');
      }
      throw new AppError('domain', 'REQUEST_NOT_CLAIMABLE',
        `Request ${id} is ${request.status} and can no longer be claimed.`);
    }

    // Assignment and history live or die together: same transaction.
    const updated = await assignRequest({ id, assignedTo: actor.userId }, client);
    await insertHistoryEvent({
      requestId: id,
      type: 'request_claimed',
      fromStatus: current.status,
      toStatus: 'in_progress',
      changedBy: actor.userId
    }, client);

    return mapRequestRow(updated);
  });
}
