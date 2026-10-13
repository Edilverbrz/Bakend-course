// Validación del parámetro de ruta :id — en el borde HTTP, que es el primer
// sitio donde se conoce el valor. Un id de petición es un entero positivo
// escrito completo: nada más puede llegar a SQL.
//
// ¿Por qué no Number() o parseInt()? Number('abc') devuelve NaN (y NaN dentro
// de una query produce un error de PostgreSQL, no un 400), y parseInt('12abc')
// acepta silenciosamente '12abc' como 12 — un id que el cliente nunca envió.
// Un patrón estricto rechaza texto, decimales, cero, negativos y la cadena
// vacía, y responde con el contrato en lugar de un error interno.
import { AppError } from '../app-error.js';

// 1-18 dígitos, sin cero inicial: cómodamente dentro de BIGINT. Valores más
// largos no son identificadores que esta API haya emitido.
const POSITIVE_INTEGER = /^[1-9][0-9]{0,17}$/;

export function parseIdParam(raw) {
  if (typeof raw !== 'string' || !POSITIVE_INTEGER.test(raw)) {
    throw new AppError('contract', 'INVALID_REQUEST_ID',
      'Request id must be a positive integer.');
  }
  return Number(raw);
}
