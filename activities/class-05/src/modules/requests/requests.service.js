// ============================================================================
// Use cases for requests. Station 6 establishes actor-first signatures;
// station 7 applies pure policies before any write.
//
// New error category: AppError('forbidden', 'FORBIDDEN', ...) -> 403.
//
// Patch contract (mixed bodies):
//   If the body mixes an allowed field (title) with a forbidden one
//   (priority for a requester), the ENTIRE operation is rejected with 403
//   and zero data is mutated. Partial updates are never silently applied.
//
// Create contract (server-controlled fields):
//   id, createdBy, createdAt, updatedAt, changedBy, status -> 400
//   SERVER_CONTROLLED_FIELD. A request is born open; status cannot be
//   supplied at creation time.
//
// Visibility:
//   A foreign request (or its history) returns the SAME 404 as a missing
//   one. Revealing existence is a design choice documented in station 1.
// ============================================================================

import { withTransaction } from '../../database/transaction.js';
import {
  findAll,
  findById,
  insertRequest,
  updateRequest,
  insertStatusHistory,
  findHistory
} from './requests.store.js';
import { mapRequestRow, mapHistoryRow } from './request.mapper.js';
import { STATUSES, isValidStatus, isTerminal, canTransition } from './request-status.js';
import { AppError } from '../../app-error.js';
import * as policy from './request.policy.js';

const PRIORITIES = ['low', 'medium', 'high'];
const UPDATABLE_FIELDS = ['title', 'description', 'priority', 'status'];

// Fields the client may never set, regardless of operation.
const SERVER_CONTROLLED_FIELDS = ['id', 'createdBy', 'createdAt', 'updatedAt', 'changedBy'];

// Status at creation is also server-controlled (a request is born open).
const CREATE_SERVER_CONTROLLED_FIELDS = [...SERVER_CONTROLLED_FIELDS, 'status'];

function assertValidPriority(priority) {
  if (!PRIORITIES.includes(priority)) {
    throw new AppError('contract', 'INVALID_PRIORITY',
      `Unknown priority "${priority}". Valid values: ${PRIORITIES.join(', ')}.`);
  }
}

function rejectServerControlledFields(input, fields) {
  for (const field of fields) {
    if (input && field in input) {
      throw new AppError('contract', 'SERVER_CONTROLLED_FIELD',
        `The field "${field}" is controlled by the server and cannot be provided.`);
    }
  }
}

// ---------------------------------------------------------------------------
// Read operations
// ---------------------------------------------------------------------------

export async function listRequests(actor, filters = {}) {
  if (filters.status !== undefined && !isValidStatus(filters.status)) {
    throw new AppError('contract', 'INVALID_FILTER',
      `Unknown status "${filters.status}". Valid values: ${STATUSES.join(', ')}.`);
  }
  if (filters.priority !== undefined && !PRIORITIES.includes(filters.priority)) {
    throw new AppError('contract', 'INVALID_FILTER',
      `Unknown priority "${filters.priority}". Valid values: ${PRIORITIES.join(', ')}.`);
  }

  // Scope: requester sees only their own rows; agent sees the whole table.
  // The filter lives in SQL — foreign rows never pass through this process.
  const scope = {};
  if (actor.role === 'requester') {
    scope.createdBy = actor.userId;
  }
  const rows = await findAll({ ...filters, ...scope });
  return rows.map(mapRequestRow);
}

export async function getRequest(actor, id) {
  const row = await findById(id);
  if (!row || !policy.canViewRequest(actor, row)) {
    // Same code and message for missing and foreign: existence must not
    // be revealed. Station 1 documents the reason.
    throw new AppError('resource', 'REQUEST_NOT_FOUND', `Request ${id} does not exist.`);
  }
  return mapRequestRow(row);
}

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------

export async function createRequest(actor, input) {
  rejectServerControlledFields(input, CREATE_SERVER_CONTROLLED_FIELDS);

  if (!policy.canCreateRequest(actor)) {
    throw new AppError('forbidden', 'FORBIDDEN',
      'Agents do not create requests; they address them.');
  }

  const { title, description, priority } = input ?? {};

  if (typeof title !== 'string' || title.trim() === '') {
    throw new AppError('contract', 'TITLE_REQUIRED',
      'A request needs a non-empty title.');
  }
  if (priority !== undefined) assertValidPriority(priority);

  // Creation is a unit of work: the request AND its birth history
  // (NULL -> open) happen together or not at all.
  const row = await withTransaction(async (client) => {
    const created = await insertRequest({
      title: title.trim(),
      description: typeof description === 'string' ? description : null,
      priority: priority ?? 'medium',
      createdBy: actor.userId
    }, client);

    // The birth history records the authenticated creator as changed_by.
    await insertStatusHistory(created.id, null, created.status, actor.userId, client);

    return created;
  });

  return mapRequestRow(row);
}

// ---------------------------------------------------------------------------
// Patch
// ---------------------------------------------------------------------------

export async function patchRequest(actor, id, body) {
  // Server-controlled fields on PATCH: createdBy, id, etc. Status is
  // allowed (agents manage workflow) — unlike on POST.
  rejectServerControlledFields(body, SERVER_CONTROLLED_FIELDS);

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

  // Read, authorize, write and record history — all with the same client,
  // as one atomic unit of work.
  const row = await withTransaction(async (client) => {
    const current = await findById(id, client);
    if (!current || !policy.canViewRequest(actor, current)) {
      throw new AppError('resource', 'REQUEST_NOT_FOUND', `Request ${id} does not exist.`);
    }

    // All-or-nothing authorization: evaluate every present field before
    // writing anything. A mixed body (allowed + forbidden) changes nothing.
    const wantsContent = changes.title !== undefined || changes.description !== undefined;
    const wantsPriority = changes.priority !== undefined;
    const wantsStatus = changes.status !== undefined;

    if (
      (wantsContent && !policy.canEditContent(actor, current))
      || (wantsPriority && !policy.canChangePriority(actor))
      || (wantsStatus && !policy.canChangeStatus(actor))
    ) {
      throw new AppError('forbidden', 'FORBIDDEN',
        'You are not allowed to perform this change.');
    }

    // Domain rules (class 3-4) bind EVERY role — agent included.
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

    if (statusChanges) {
      await insertStatusHistory(id, current.status, changes.status, actor.userId, client);
    }

    return updated;
  });

  return mapRequestRow(row);
}

// ---------------------------------------------------------------------------
// History
// ---------------------------------------------------------------------------

export async function getHistory(actor, id) {
  const request = await findById(id);
  if (!request || !policy.canViewHistory(actor, request)) {
    throw new AppError('resource', 'REQUEST_NOT_FOUND', `Request ${id} does not exist.`);
  }
  const rows = await findHistory(id);
  return rows.map(mapHistoryRow);
}