// ============================================================================
// Auth use cases: register, login and current user.
//
// Contracts (see docs/http-contract.md and activities/class-05/auth-contract.md):
//
//   register(body) -> { id, email, role: 'requester', createdAt }
//     * allowlist: only email and password may arrive. Any server-controlled
//       field present in the body (role, id, createdAt, updatedAt, createdBy,
//       passwordHash) -> 400 SERVER_CONTROLLED_FIELD. Reject explicitly —
//       never ignore silently.
//     * email: required, basic format, normalized (trim + lowercase) BEFORE
//       storing -> 400 INVALID_EMAIL otherwise.
//     * password: 15..128 characters (code points: Unicode and spaces
//       allowed, no arbitrary composition rules) -> 400 INVALID_PASSWORD.
//       NEVER log it.
//     * duplicate email -> 409 ACCOUNT_CANNOT_BE_CREATED (generic on purpose,
//       does not confirm the account exists). pg raises error.code '23505'.
//     * store ONLY the hash produced by hashPassword — never the password.
//
//   login(body) -> { accessToken, tokenType: 'Bearer', expiresIn }
//     * EVERY failure (unknown email, wrong password, missing fields) answers
//       the SAME 401 INVALID_CREDENTIALS 'Email or password is incorrect.' —
//       identical bytes, no clues.
//
//   getCurrentUser(actor) -> { id, email, role }
//     * actor comes from req.auth once the middleware verified the token.
//       Never return password material of any kind.
// ============================================================================
import { AppError } from '../../app-error.js';
import {
  hashPassword,
  verifyPassword,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH
} from './password.js';
import { issueToken, TOKEN_TTL_SECONDS } from './token.js';
import { findByEmail, findById, insertUser } from '../users/users.store.js';
import { mapUserRow } from '../users/user.mapper.js';

const SERVER_CONTROLLED_FIELDS = ['role', 'id', 'createdAt', 'updatedAt', 'createdBy', 'passwordHash'];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function register(body) {
  const input = body ?? {};

  // Allowlist: anything the client did not send cannot be smuggled in.
  for (const field of SERVER_CONTROLLED_FIELDS) {
    if (field in input) {
      throw new AppError('contract', 'SERVER_CONTROLLED_FIELD',
        `The field "${field}" is controlled by the server and cannot be provided.`);
    }
  }

  const email = typeof input.email === 'string'
    ? input.email.trim().toLowerCase()
    : '';
  if (!email || !EMAIL_PATTERN.test(email)) {
    throw new AppError('contract', 'INVALID_EMAIL', 'A valid email is required.');
  }

  // Code points, not UTF-16 units: a 15-emoji password is genuinely long.
  const password = input.password;
  const passwordLength = typeof password === 'string' ? [...password].length : 0;
  if (typeof password !== 'string'
    || passwordLength < PASSWORD_MIN_LENGTH
    || passwordLength > PASSWORD_MAX_LENGTH) {
    throw new AppError('contract', 'INVALID_PASSWORD',
      `The password must be between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters.`);
  }

  // Station 3: derive BEFORE persisting. The plain password only exists in
  // memory for these few milliseconds — it is never written anywhere.
  const passwordHash = await hashPassword(password);

  let row;
  try {
    row = await insertUser({ email, passwordHash });
  } catch (error) {
    // unique_violation on users.email -> 409, generic on purpose.
    if (error.code === '23505') {
      throw new AppError('domain', 'ACCOUNT_CANNOT_BE_CREATED',
        'The account cannot be created with the supplied information.');
    }
    throw error;
  }

  return mapUserRow(row);
}

export async function login(body) {
  const { email, password } = body ?? {};
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  const user = await findByEmail(normalizedEmail);
  const verified = !!user
    && typeof password === 'string'
    && await verifyPassword(password, user.password_hash);

  // One byte-identical answer for every failure: enumerating emails must
  // get nothing back.
  if (!verified) {
    throw new AppError('auth', 'INVALID_CREDENTIALS', 'Email or password is incorrect.');
  }

  const accessToken = await issueToken(user);
  return {
    accessToken,
    tokenType: 'Bearer',
    expiresIn: TOKEN_TTL_SECONDS
  };
}

export async function getCurrentUser(actor) {
  const user = await findById(actor.userId);
  if (!user) {
    // A verified token for a deleted account: no identity anymore.
    throw new AppError('resource', 'USER_NOT_FOUND', 'The authenticated account no longer exists.');
  }
  return {
    id: user.id,
    email: user.email,
    role: user.role
  };
}