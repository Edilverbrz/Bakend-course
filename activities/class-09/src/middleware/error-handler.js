// Middleware central de errores: el UNICO sitio donde un error se convierte en
// una respuesta HTTP. Desde la clase 7 reemplaza el patrón por ruta de
// try/catch — Express 5 reenvía aquí los errores lanzados y las promesas
// rechazadas por sí solo.
//
// Se registra DESPUÉS de todas las rutas en app.js (un middleware de error
// solo ve lo que ocurrió antes que él), y Express lo reconoce como manejador
// de errores porque declara exactamente cuatro parámetros.
//
// El contrato de la respuesta nunca cambia con la causa:
//   { "error": { "code", "message" }, "requestId": "..." }
// El mensaje público explica la CATEGORÍA del problema; el detalle interno
// (mensaje real, stack) va al log, vinculado por el requestId.
import { AppError } from '../app-error.js';
import { logger } from '../logging/logger.js';

// La misma tabla que el proyecto usa desde la clase 5: la categoría del
// dominio, no el lanzador, decide el código de estado.
const CATEGORY_STATUS = {
  contract: 400,
  auth: 401,
  forbidden: 403,
  resource: 404,
  domain: 409
};

// Errores cuya causa es que la base de datos no es alcanzable -> 503.
const INFRASTRUCTURE_CODES = ['ECONNREFUSED', 'ENOTFOUND', 'ETIMEDOUT', 'EAI_AGAIN', '57P03'];

function errorBody(code, message, requestId) {
  return { error: { code, message }, requestId };
}

export function errorHandler(error, req, res, next) {
  // Si la respuesta ya comenzó a emitirse en streaming no podemos reescribirla
  // como JSON: delegamos en Express, que cierra la conexión.
  if (res.headersSent) {
    return next(error);
  }

  const id = req.requestId;

  // Errores esperados: forman parte del contrato. El lanzador eligió la
  // categoría, el código y un mensaje público — nada interno viaja dentro de ellos.
  if (error instanceof AppError) {
    res.locals.errorCode = error.code;
    return res.status(CATEGORY_STATUS[error.category] ?? 500)
      .json(errorBody(error.code, error.message, id));
  }

  // Un cuerpo que no es JSON válido es un problema del cliente, no del servidor.
  if (error.type === 'entity.parse.failed') {
    res.locals.errorCode = 'INVALID_JSON';
    return res.status(400)
      .json(errorBody('INVALID_JSON', 'The request body is not valid JSON.', id));
  }

  if (INFRASTRUCTURE_CODES.includes(error.code) || /Connection terminated/i.test(error.message ?? '')) {
    res.locals.errorCode = 'DATABASE_UNAVAILABLE';
    // Suficiente para diagnosticar — nunca la cadena de conexión.
    logger.error('database_unavailable', { requestId: id, code: error.code ?? error.message });
    return res.status(503)
      .json(errorBody('DATABASE_UNAVAILABLE', 'The service cannot access its data store.', id));
  }

  // Errores inesperados: un defecto o un fallo de infraestructura que no hemos
  // clasificado. Respuesta genérica fuera; name, message y stack SOLO dentro
  // del log, localizables con el mismo requestId que recibió el cliente.
  res.locals.errorCode = 'INTERNAL_ERROR';
  logger.error('unexpected_error', {
    requestId: id,
    name: error.name,
    message: error.message,
    stack: error.stack
  });
  return res.status(500)
    .json(errorBody('INTERNAL_ERROR', 'An unexpected error occurred.', id));
}
