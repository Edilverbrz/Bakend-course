// Reglas del dominio para el ciclo de vida de la petición. Sin cambios desde
// la clase 03: las reglas del dominio puro no dependen de dónde viva la data.

export const STATUSES = ['open', 'in_progress', 'resolved', 'closed', 'cancelled'];

export const TERMINAL_STATUSES = ['closed', 'cancelled'];

const ALLOWED_TRANSITIONS = {
  open: ['in_progress', 'cancelled'],
  in_progress: ['resolved', 'cancelled'],
  resolved: ['in_progress', 'closed'],
  closed: [],
  cancelled: []
};

export function isValidStatus(status) {
  return STATUSES.includes(status);
}

export function isTerminal(status) {
  return TERMINAL_STATUSES.includes(status);
}

export function canTransition(from, to) {
  return (ALLOWED_TRANSITIONS[from] ?? []).includes(to);
}
