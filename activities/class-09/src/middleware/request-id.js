// Middleware de ID de petición: cada solicitud recibe un identificador que
// viaja con ella — a los logs, a las respuestas de error y de vuelta al
// cliente en la cabecera X-Request-Id. Identifica la PETICIÓN, no al usuario:
// no es un secreto y nunca debe ser el JWT.
//
// Un cliente puede proponer su propio id (útil cuando un frontend quiere
// correlacionar sus logs con los nuestros), pero solo se acepta un formato
// limitado y sencillo. Cualquier otro — demasiado largo, caracteres extraños,
// saltos de línea — se reemplaza y nunca se confía en él: las cabeceras son
// entrada del cliente como cualquier otra.
import { randomUUID } from 'node:crypto';

const ACCEPTED_EXTERNAL_ID = /^[A-Za-z0-9._-]{1,64}$/;

export function requestId(req, res, next) {
  const provided = req.headers['x-request-id'];

  req.requestId = (typeof provided === 'string' && ACCEPTED_EXTERNAL_ID.test(provided))
    ? provided
    : `req_${randomUUID()}`;

  res.set('X-Request-Id', req.requestId);
  next();
}
