// Política de autorización para el módulo de requests. Funciones puras sobre
// un actor y (cuando aplica) una representación de una petición: sin SQL, sin
// HTTP. El middleware establece QUIÉN es el actor; estas funciones deciden QUÉ
// puede hacer; el servicio se queda con las reglas del caso de uso.
//
// Matriz de acceso del taller (línea base fija — el validador depende de ella):
//   listar todas las peticiones ........ agent
//   listar propias .................... requester (filtrado en SQL, no en JS)
//   ver / historial .................... agent: cualquiera · requester: solo propias
//   crear ............................. requester
//   editar título/descripción .......... requester, propia y mientras esté abierta
//   cambiar prioridad .................. agent
//   cambiar estado ..................... agent (sigue aplicándose la máquina de estados)
//   reclamar ........................... agent, petición abierta y sin asignar

export function canListAllRequests(actor) {
  return actor.role === 'agent';
}

export function canViewRequest(actor, request) {
  if (actor.role === 'agent') return true;
  return request.createdBy === actor.userId;
}

export function canViewHistory(actor, request) {
  return canViewRequest(actor, request);
}

export function canCreateRequest(actor) {
  return actor.role === 'requester';
}

export function canEditContent(actor, request) {
  return actor.role === 'requester'
    && request.createdBy === actor.userId
    && request.status === 'open';
}

export function canChangePriority(actor) {
  return actor.role === 'agent';
}

export function canChangeStatus(actor) {
  return actor.role === 'agent';
}

// FEATURE-801. Claim has THREE distinct denial reasons and each one maps
// to a different HTTP answer, so this policy returns an explicit result
// instead of a bare boolean: { allowed: true } or { allowed: false, reason }.
//
//   NOT_AGENT        -> the actor's role cannot claim (403)
//   ALREADY_ASSIGNED -> someone is responsible already (409)
//   NOT_OPEN         -> the lifecycle does not allow claiming (409)
//
// The policy stays pure: it never touches PostgreSQL, never reads a JWT
// and never builds HTTP errors — that is why it can be tested with plain
// objects and zero infrastructure.
export function canClaimRequest({ actor, request }) {
  if (actor.role !== 'agent') {
    return { allowed: false, reason: 'NOT_AGENT' };
  }
  if (request.assignedTo) {
    return { allowed: false, reason: 'ALREADY_ASSIGNED' };
  }
  if (request.status !== 'open') {
    return { allowed: false, reason: 'NOT_OPEN' };
  }
  return { allowed: true };
}
