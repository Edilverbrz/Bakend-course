// Middleware de no encontrado: se ejecuta solo cuando ninguna ruta coincide
// con la petición. En lugar de la página HTML por defecto de Express, reenvía
// un error tipado para que el manejador central responda con el mismo contrato
// JSON que todo lo demás. El mensaje es intencionalmente genérico: devolver la
// ruta solicitada reflejaría entrada arbitraria del cliente en la respuesta.
import { AppError } from '../app-error.js';

export function notFound(req, res, next) {
  next(new AppError('resource', 'ROUTE_NOT_FOUND', 'The requested path does not exist.'));
}
