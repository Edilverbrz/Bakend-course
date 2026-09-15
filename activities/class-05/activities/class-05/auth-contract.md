# Contrato de autenticación — Request API v5

Documenta ANTES de implementar. Para cada endpoint: método, ruta, ¿público o
protegido?, body permitido, respuesta de éxito (código + forma) y CADA error
(código HTTP + `error.code`).

---

## POST /auth/register

- **Acceso:** público.
- **Body permitido (allowlist estricta):** solo `email` y `password`.

  ```json
  { "email": "usuario@ejemplo.com", "password": "password de 15+ caracteres" }
  ```

- **Normalización:** `email` → `trim + lowercase` antes de almacenar.
- **Password:** 15–128 caracteres (puntos de código; Unicode y espacios OK).

- **Respuesta de éxito (201 Created):**

  ```json
  {
    "id": "uuid-del-usuario",
    "email": "usuario@ejemplo.com",
    "role": "requester",
    "createdAt": "2026-09-08T12:00:00.000Z"
  }
  ```

- **Errores:**
  - `400` — `SERVER_CONTROLLED_FIELD` (rol, id, createdAt, updatedAt,
    createdBy o passwordHash en el body)
  - `400` — `INVALID_EMAIL`
  - `400` — `INVALID_PASSWORD`
  - `409` — `ACCOUNT_CANNOT_BE_CREATED` (email duplicado; genérico, no
    confirma que la cuenta exista)

---

## POST /auth/login

- **Acceso:** público.
- **Body permitido:** `email` y `password`.
- **Respuesta de éxito (200 OK):** el token NUNCA se emite en el registro;
  solo en el login.

  ```json
  {
    "accessToken": "<jwt-firmado>",
    "tokenType": "Bearer",
    "expiresIn": 3600
  }
  ```

- **Errores (todos idénticos, byte a byte):**
  - `401` — `INVALID_CREDENTIALS` — "Email or password is incorrect."
    - email inexistente y password incorrecta responden EXACTO igual:
      no hay enumeración de cuentas.
    - email no normalizado o campos faltantes también caen aquí.

---

## GET /auth/me

- **Acceso:** protegido (`Authorization: Bearer <token>`).
- **Body:** sin cuerpo.
- **Respuesta de éxito (200 OK):**

  ```json
  {
    "id": "uuid-del-usuario",
    "email": "usuario@ejemplo.com",
    "role": "requester"
  }
  ```

- **Errores:**
  - `401` — `AUTHENTICATION_REQUIRED` (sin header o esquema distinto de Bearer)
  - `401` — `INVALID_TOKEN` (alterado, vencido, otra firma, otra aud/iss —
    una sola respuesta, no dice cuál control falló)
  - `404` — `USER_NOT_FOUND` (cuenta borrada tras emitir el token)

---

## Semántica de errores (criterio, no ejemplos)

¿Cuándo responde tu API `401`? ¿`403`? ¿`404` (aunque el recurso exista)?
¿`409`?

- **`401`** — "No sé quién eres": no existe identidad confiable.
  Sin token, esquema no-Bearer, token inválido o vencido → `AUTHENTICATION_REQUIRED`
  o `INVALID_TOKEN`. Login fallido → `INVALID_CREDENTIALS`.

- **`403`** — "Sé quién eres; esto no": actor identificado y operación
  prohibida para su rol o su relación con el recurso.
  Ej.: requester cambia prioridad → `FORBIDDEN`.

- **`404`** — "Para ti, no existe": recurso inexistente **o ajeno cuya
  existencia no conviene revelar**. Misma respuesta exacta en ambos casos:
  `REQUEST_NOT_FOUND`, idéntico para `/requests/999` y para la solicitud de Bob
  vista por Alice. Es una **decisión de diseño** (no revelar existencia), no un
  accidente.

- **`409`** — "Existe, pero choca": conflicto con el estado del recurso.
  - email duplicado → `ACCOUNT_CANNOT_BE_CREATED`
  - transición ilegal → `INVALID_STATUS_TRANSITION`
  - estado terminal → `REQUEST_IN_TERMINAL_STATUS`