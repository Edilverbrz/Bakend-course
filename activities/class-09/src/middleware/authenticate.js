// Middleware de autenticación: establece QUIÉN es el actor y nada más. No
// decide lo que el actor puede hacer — eso es la autorización, y vive en
// las políticas de los módulos.
//
// Desde la clase 7 no responde errores por sí mismo: lanza una excepción y
// Express 5 la reenvía al middleware central de errores. Un único punto de
// traducción para toda la aplicación.
import { AppError } from '../app-error.js';
import { verifyToken } from '../modules/auth/token.js';

const ROLES = ['requester', 'agent'];

export async function authenticate(req, res, next) {
  const header = req.headers.authorization;
  // The scheme must be exactly Bearer: "Basic ..." or a bare token is
  // not a trustworthy identity.
  if (typeof header !== 'string' || !header.startsWith('Bearer ')) {
    throw new AppError('auth', 'AUTHENTICATION_REQUIRED',
      'This operation requires a Bearer token.');
  }
  const token = header.slice('Bearer '.length).trim();
  if (token === '') {
    throw new AppError('auth', 'AUTHENTICATION_REQUIRED',
      'This operation requires a Bearer token.');
  }

  let payload;
  try {
    payload = await verifyToken(token);
  } catch {
    // Altered, expired, wrong issuer/audience/signature: same answer.
    // The response never explains which check failed.
    throw new AppError('auth', 'INVALID_TOKEN',
      'The token is invalid or has expired.');
  }

  if (typeof payload.sub !== 'string' || !ROLES.includes(payload.role)) {
    throw new AppError('auth', 'INVALID_TOKEN',
      'The token is invalid or has expired.');
  }

  // The only trusted source of identity for the rest of the request.
  req.auth = { userId: payload.sub, role: payload.role };
  next();
}
