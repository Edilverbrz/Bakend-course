// Logger de peticiones: una línea estructurada por cada petición terminada,
// cualquiera que sea su resultado. Registra una ALLOWLIST explícita de campos —
// method, path, status, duration, requestId y userId cuando se ejecutó la
// autenticación. Nunca registra cabeceras, cuerpos, tokens ni query strings: lo
// que no esté en la lista no llega al log.
//
// Separación de responsabilidades con el manejador de errores:
//   - este middleware registra que la petición TERMINÓ (todas las peticiones);
//   - el manejador de errores registra el DETALLE interno de los errores
//     inesperados.
// Se encuentran a través del mismo requestId, para que una línea encuentre a la
// otra.
import { logger } from '../logging/logger.js';

export function requestLogger(req, res, next) {
  const startedAt = process.hrtime.bigint();

  // 'finish' fires when the response has been handed to the socket — the
  // only moment the final status code is known.
  res.on('finish', () => {
    const durationMs = Number((process.hrtime.bigint() - startedAt) / 1_000_000n);

    const fields = {
      requestId: req.requestId,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      durationMs
    };
    if (req.auth?.userId) fields.userId = req.auth.userId;
    if (res.locals.errorCode) fields.errorCode = res.locals.errorCode;

    if (res.statusCode >= 500) {
      logger.error('request_failed', fields);
    } else {
      logger.info('request_completed', fields);
    }
  });

  next();
}
