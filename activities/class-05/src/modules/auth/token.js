// ============================================================================
// Token issuance and verification for the workshop JWT.
//
// Claims the contract requires:
//   sub  -> user id            iat -> issued at
//   role -> requester | agent  exp -> iat + TOKEN_TTL_SECONDS (1 hour)
//   iss  -> backend-course-api aud -> backend-course-client
//
// Rule of the station: decoding lets you read; VERIFYING lets you trust.
// jwtVerify must check signature, algorithm, issuer, audience and expiry.
// The token is signed, NOT encrypted: put nothing sensitive in the payload.
// ============================================================================
import 'dotenv/config';
import { SignJWT, jwtVerify } from 'jose';

// Fail early: an API that signs tokens with an empty secret is worse
// than an API that refuses to start.
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required.');
}

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);
const ALGORITHM = 'HS256';
const ISSUER = process.env.JWT_ISSUER ?? 'backend-course-api';
const AUDIENCE = process.env.JWT_AUDIENCE ?? 'backend-course-client';

export const TOKEN_TTL_SECONDS = Number(process.env.JWT_TTL_SECONDS ?? 3600);

export async function issueToken(user) {
  const issuedAt = Math.floor(Date.now() / 1000);
  return await new SignJWT({ role: user.role })
    .setProtectedHeader({ alg: ALGORITHM, typ: 'JWT' })
    .setSubject(user.id)
    .setIssuedAt(issuedAt)
    .setExpirationTime(issuedAt + TOKEN_TTL_SECONDS)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .sign(SECRET_KEY);
}

export async function verifyToken(token) {
  // jwtVerify validates the signature, the algorithm and (when told) the
  // issuer and audience; exp is enforced automatically. A failure means
  // "not a trustworthy identity", regardless of which check failed.
  const { payload } = await jwtVerify(token, SECRET_KEY, {
    algorithms: [ALGORITHM],
    issuer: ISSUER,
    audience: AUDIENCE
  });
  return payload;
}