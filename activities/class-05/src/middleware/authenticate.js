// ============================================================================
// Authentication middleware: establishes WHO the actor is, nothing more.
// What the actor may DO is authorization and lives in the module policies.
//
// Contract:
//   * read the Authorization header; require exactly the Bearer scheme
//     ("Basic ...", a bare token or an empty Bearer are not identities)
//     -> 401 AUTHENTICATION_REQUIRED;
//   * verify the token with verifyToken (never just decode it);
//     any verification failure (altered, expired, wrong issuer/audience)
//     -> 401 INVALID_TOKEN — one same answer, the response never explains
//     which check failed;
//   * on success, build the ONLY trusted source of identity:
//       req.auth = { userId: payload.sub, role: payload.role }
//     and call next().
//
// Errors are answered here with respondError (middlewares do not reach the
// router's try/catch).
// ============================================================================
import { AppError } from '../app-error.js';
import { respondError } from '../http/respond-error.js';
import { verifyToken } from '../modules/auth/token.js';

export async function authenticate(req, res, next) {
  const header = req.headers.authorization;

  // Missing header or the wrong scheme: there is no identity at all.
  const [scheme, token, ...extra] = typeof header === 'string' ? header.split(' ') : [];
  if (scheme !== 'Bearer' || !token || extra.length > 0) {
    return respondError(res, new AppError('auth', 'AUTHENTICATION_REQUIRED',
      'A valid Bearer token is required to access this resource.'));
  }

  try {
    const payload = await verifyToken(token);
    // The verified payload, not the header, is the only trusted identity.
    req.auth = {
      userId: payload.sub,
      role: payload.role
    };
    return next();
  } catch {
    // Altered, expired, forged, wrong audience... one same answer. Telling
    // which check failed hands an attacker a map of the verification.
    return respondError(res, new AppError('auth', 'INVALID_TOKEN',
      'The provided token is not valid.'));
  }
}