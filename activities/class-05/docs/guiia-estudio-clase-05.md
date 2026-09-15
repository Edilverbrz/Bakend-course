# Guía de estudio — Clase 05: De una API abierta a un backend con identidad

Resumen de todo lo implementado, cómo funciona y por qué, pensado para repasar
antes de entrar a clase.

---

## 0. Qué hace esta clase (resumen ejecutivo)

El taller parte de una API funcional pero abierta (clase 04) y añade tres
capas que convierten un "cualquiera hace lo que quiera" en un sistema con
**identidad**, **autenticación** y **autorización**:

1. **Identidad** — quién es cada usuario → tabla `users` (clase 04, migración 003)
2. **Autenticación** — cómo se prueba esa identidad → JWT firmado (estación 2)
3. **Autorización** — qué puede hacer cada usuario → middleware + policy (estaciones 6-7)

---

## 1. Los tres conceptos de seguridad (y por qué importan)

### Identidad

Quién eres. Se crea al registrarte (`POST /auth/register`) y se representa
como una fila en la tabla `users`:

| Campo        | Tipo    | Origen        |
| ------------ | ------- | ------------- |
| `id`         | UUID    | PostgreSQL (DEFAULT gen_random_uuid()) |
| `email`      | VARCHAR | Normalizado: trim + lowercase antes de almacenar |
| `role`       | ENUM    | Siempre `requester` al crear; el cliente NUNCA lo controla |
| `password_hash` | TEXT | Generado por `hashPassword()`; nunca sale de la BD |
| `created_at` | TIMESTAMPTZ | Se genera automáticamente |

La identidad se transfiere al backend mediante un **token JWT** en el header
`Authorization: Bearer <token>`.

### Autenticación

Cómo la API confirma que eres quien dices ser. Aquí se usa **JWT con firma
HS256**. El flujo:

1. `POST /auth/login` con email + password → la API verifica la contraseña y
   devuelve un token firmado
2. El cliente envía el token en cada request protegido
3. El middleware `authenticate.js` **verifica** la firma (no solo decodifica)
4. Si es válido: `req.auth = { userId: payload.sub, role: payload.role }`

**Clave:** decodificar un JWT es trivial (cualquiera puede leerlo). Lo que
protege es la **firma**: solo el servidor que firmó puede generar tokens
válidos.

### Autorización

Qué puedes hacer una vez autenticado. Es una capa separada que no depende de
quién seas, sino de tu **rol** y tu **relación con el recurso**. Se evalúa
en `request.policy.js` como funciones puras (sin SQL, sin HTTP):

```
actor是谁 → role + userId
recurso是谁 → request.created_by, request.status
politica = canEditContent(actor, request) → true/false
```

---

## 2. Los roles (exactly 2)

| Rol        | Qué es                                    | Qué puede hacer                                 |
| ---------- | ----------------------------------------- | ----------------------------------------------- |
| `requester`| Estudiante/usuario que reporta problemas  | Crear solicitudes, ver/editar las suyas (solo título/descripción, solo open), ver su perfil |
| `agent`    | Agente de soporte/técnico                 | Ver TODAS las solicitudes, cambiar prioridad, cambiar estado (respetando la máquina), ver cualquier historial |

No hay `admin`. Si el taller lo menciona, es para explicar por qué no lo usamos.

---

## 3. La matriz de acceso (qué puede cada rol, operación por operación)

| Operación                      | Anónimo | Requester            | Agent  |
| ------------------------------ | ------: | -------------------: | -----: |
| `POST /auth/register`          | Sí      | Sí                   | Sí     |
| `POST /auth/login`             | Sí      | Sí                   | Sí     |
| `GET /auth/me`                 | No      | Sí                   | Sí     |
| `GET /requests`                | No      | Solo las suyas       | Todas  |
| `GET /requests/:id`            | No      | Solo las suyas       | Cualquiera |
| `GET /requests/:id/history`    | No      | Solo las suyas       | Cualquiera |
| `POST /requests`               | No      | Sí                   | No     |
| Editar título/descripción      | No      | Solo suya + open     | No     |
| Cambiar prioridad              | No      | No                   | Sí     |
| Cambiar estado                 | No      | No                   | Sí     |

---

## 4. El flujo completo de un request (end-to-end)

### 4.1 Crear cuenta

```
Cliente                  Backend
   |                        |
   |-- POST /auth/register ->|
   |   {email, password}     |-- valida: allowlist (solo email+password)
   |                        |-- normaliza email: trim + lowercase
   |                        |-- valida password: 15-128 code points
   |                        |-- hashPassword() -> password_hash
   |                        |-- INSERT INTO users (email, role='requester', password_hash)
   |<-- 201 {id,email,role, createdAt} --|
```

El `role` NUNCA se acepta del body. Si viene → `400 SERVER_CONTROLLED_FIELD`.

### 4.2 Iniciar sesión

```
Cliente                  Backend
   |                        |
   |-- POST /auth/login --->|
   |   {email, password}     |-- findByEmail(normalized)
   |                        |-- verifyPassword(input, stored_hash)
   |                        |-- issueToken(user) -> JWT firmado HS256
   |<-- 200 {accessToken, tokenType, expiresIn:3600} --|
```

Si el email no existe O la password es incorrecta → mismo error exacto:
`401 INVALID_CREDENTIALS`. No se revela cuál falló.

### 4.3 Acceder a un endpoint protegido

```
Cliente                  Middleware              Módulo
   |                        |                       |
   |-- GET /requests ------>|                       |
   |   Authorization: Bearer xxx                    |
   |                        |-- parse header: Bearer <token>
   |                        |-- verifyToken(token): firma, exp, iss, aud
   |                        |-- req.auth = {userId, role}
   |                        |-- next()
   |                        |                       |-- lista requests
   |<-- 200 [array] --------|-----------------------|
```

Sin token o con esquema incorrecto → `401 AUTHENTICATION_REQUIRED`.
Token alterado/vencido/falso → `401 INVALID_TOKEN` (misma respuesta para todos).

### 4.4 Crear una solicitud (requester)

```
Cliente                  Backend
   |                        |
   |-- POST /requests ----->|
   |   Authorization: Bearer xxx
   |   {title, description, priority}
   |                        |-- req.auth = {userId, role: 'requester'}
   |                        |-- rejectServerControlledFields(id, status, createdBy...)
   |                        |-- canCreateRequest(actor) → role==='requester'? OK
   |                        |-- valida title (no vacío), priority (low/medium/high)
   |                        |-- BEGIN TRANSACTION
   |                        |   INSERT ... created_by = actor.userId
   |                        |   INSERT history: null → open, changed_by = actor.userId
   |                        |-- COMMIT
   |<-- 201 {id, title, ... createdBy: "uuid"} --|
```

El `createdBy` proviene del token, NO del body.

### 4.5 Patch: autorización todo-o-nada

Esta es la parte más sutil. El service evalúa TODOS los campos antes de escribir:

```
actor = requester, body = {title: "nuevo", priority: "low"}
                       ┌──────────────────────────────────┐
canEditContent?         │ Sí: title en propia y abierta     │ → OK
canChangePriority?      │ No: requester no puede            │ → FORBIDDEN
                       └──────────────────────────────────┘
Al menos uno falla → 403 + CERO cambios aplicados
```

Si todo fuera permitido:
```
- Ejecuta updateRequest(id, changes)
- Si cambia status → insertStatusHistory(id, old, new, actor.userId)
```

### 4.6 Visibilidad: 404 para lo ajeno

```
GET /requests/5   (alice pide la solicitud 5, que es de bob)

findById(5) → la solicitud SÍ existe en la BD
canViewRequest(alice, row) → row.created_by !== alice.userId → false

Resultado: 404 REQUEST_NOT_FOUND (igual que si el ID no existiera)
```

Esto evita **IDOR** (Insecure Direct Object Reference): el atacante no puede
saber si la solicitud es de otro usuario o simplemente no existe.

---

## 5. JWT: cómo se firma y se verifica

### Payload (lo que lleva el token)

```json
{
  "sub": "uuid-del-usuario",
  "role": "requester",
  "iat": 1789478447,
  "exp": 1789482047,
  "iss": "backend-course-api",
  "aud": "backend-course-client"
}
```

- `sub` = id del usuario (subject)
- `role` = requester o agent
- `iat` = emitted at (issued at)
- `exp` = expiration (iat + 3600 = 1 hora)
- `iss` = issuer (quién lo emitió)
- `aud` = audience (para quién es válido)

### Firma HS256

```
JWT = base64(header) + "." + base64(payload) + "." + HMAC-SHA256(header+"."+payload, SECRET)
```

El `JWT_SECRET` está en `.env`. Sin él, nadie puede firmar tokens válidos.

### Verificación (jose jwtVerify)

`jwtVerify(token, key, {algorithms:['HS256'], issuer, audience})` verifica:
1. La firma → ¿fue firmado con esta clave?
2. El algoritmo → ¿es HS256? (previene "algorithm confusion")
3. El issuer → ¿fue emitido por este servidor?
4. El audience → ¿es para este cliente?
5. La expiración → ¿ya venció? (exp < now)

Si CUALQUIERA falla → `401 INVALID_TOKEN`. No se dice cuál falló.

---

## 6. La máquina de estados (intacta para TODOS los roles)

```
            ┌─────────────┐
            │    open      │──── cancelled (terminal)
            └──────┬───────┘
                   │
                   ▼
         ┌─────────────────┐
         │  in_progress    │──── cancelled (terminal)
         └────────┬────────┘
                  │
                  ▼
         ┌─────────────────┐
         │   resolved      │
         └────────┬────────┘
                  │
                  ▼
         ┌─────────────────┐
         │    closed       │ (terminal)
         └─────────────────┘

Transiciones permitidas:
  open       → in_progress, cancelled
  in_progress → resolved, cancelled
  resolved   → in_progress, closed
  closed     → nada (terminal)
  cancelled  → nada (terminal)
```

**Todos**, incluido el agent, están sujetos a la máquina. Nadie puede:
- Cerrar directamente desde `open` → `409 INVALID_STATUS_TRANSITION`
- Modificar un request en estado terminal → `409 REQUEST_IN_TERMINAL_STATUS`

---

## 7. El mapper: qué sale y qué queda dentro

### `mapUserRow(row) → {id, email, role}`
**NO incluye** `password_hash`. El hash nunca cruza la capa HTTP.

### `mapRequestRow(row) → {id, title, description, priority, status, createdAt, updatedAt, createdBy}`
El DTO público no incluye `created_by` interno (se usa internamente para
comparar con `req.auth.userId`). Nota: en esta implementación `createdBy`
(es el nombre de la columna en el DTO) SÍ se retorna porque el validador
lo espera para comprobar el aislamiento.

### `mapHistoryRow(row) → {id, requestId, from, to, changedAt, changedBy}`
Incluye `changedBy` (el UUID del usuario que hizo el cambio).

---

## 8. Códigos de error del sistema (contrato completo)

### Categorías de AppError → HTTP

| Categoría   | HTTP | Cuándo                                      |
| ----------- | ---: | ------------------------------------------- |
| `contract`  | 400  | Body inválido, campos controlados, filtros   |
| `auth`      | 401  | Sin identidad, login fallido, token malo     |
| `forbidden` | 403  | Identidad correcta, operación prohibida      |
| `resource`  | 404  | No existe o es ajeno (IDOR)                  |
| `domain`    | 409  | Conflicto con estado (duplicado, transición) |

### Todos los códigos específicos

| Código                      | HTTP | Categoría | Descripción breve                           |
| --------------------------- | ---: | --------- | ------------------------------------------- |
| `SERVER_CONTROLLED_FIELD`   | 400  | contract  | Campo servidor en el body (role, id, createdBy…) |
| `INVALID_EMAIL`             | 400  | contract  | Email vacío o formato inválido              |
| `INVALID_PASSWORD`          | 400  | contract  | Password fuera de 15-128 code points        |
| `TITLE_REQUIRED`            | 400  | contract  | Título vacío o ausente                      |
| `NO_UPDATABLE_FIELDS`       | 400  | contract  | PATCH sin campos válidos                    |
| `INVALID_PRIORITY`          | 400  | contract  | Prioridad no es low/medium/high             |
| `INVALID_STATUS`            | 400  | contract  | Estado no es open/in_progress/resolved/closed/cancelled |
| `INVALID_FILTER`            | 400  | contract  | Filtro con valor inválido                   |
| `AUTHENTICATION_REQUIRED`   | 401  | auth      | Sin header o esquema no-Bearer              |
| `INVALID_TOKEN`             | 401  | auth      | Token alterado, vencido, firma falsa, issuer/aud incorrecto |
| `INVALID_CREDENTIALS`       | 401  | auth      | Login fallido (email o password)            |
| `FORBIDDEN`                 | 403  | forbidden | Operación no permitida para el actor        |
| `REQUEST_NOT_FOUND`         | 404  | resource  | No existe o es ajeno                        |
| `USER_NOT_FOUND`            | 404  | resource  | Cuenta eliminada tras emitir el token       |
| `INVALID_STATUS_TRANSITION` | 409  | domain    | Transición no permitida en la máquina       |
| `REQUEST_IN_TERMINAL_STATUS`| 409  | domain    | Request en estado terminal (closed/cancelled)|
| `ACCOUNT_CANNOT_BE_CREATED` | 409  | domain    | Email duplicado (genérico, no revela)       |

**Infraestructura** (no son AppError):
| `DATABASE_UNAVAILABLE`      | 503  | —         | BD inalcanzable                             |
| `INTERNAL_ERROR`            | 500  | —         | Error inesperado (nunca detalles)           |

---

## 9. El patrón de errores: por qué son genéricos

### Login: `401 INVALID_CREDENTIALS` siempre igual

```javascript
// auth.service.js
if (!verified) {
  throw new AppError('auth', 'INVALID_CREDENTIALS',
    'Email or password is incorrect.');
}
```

Si el email no existe → la misma respuesta.
Si la password está mal → la misma respuesta.
Si falta el body → la misma respuesta.

**Por qué:** si el error fuera "email no encontrado" vs "password incorrecta",
un atacante podría enumerar cuentas válidas probando emails.

### IDOR: `404 REQUEST_NOT_FOUND` para lo ajeno

```javascript
if (!row || !policy.canViewRequest(actor, row)) {
  throw new AppError('resource', 'REQUEST_NOT_FOUND', ...);
}
```

Si el request no existe → 404.
Si existe pero es de otro usuario → 404.
**Por qué:** si la respuesta fuera "403 Forbidden", el atacante sabría que la
solicitud existe y a quién pertenece. `404` es indistinguible de "no existe".

### Token: `401 INVALID_TOKEN` uniforme

```javascript
// authenticate.js — el catch cubre TODO
catch {
  return respondError(res, new AppError('auth', 'INVALID_TOKEN',
    'The provided token is not valid.'));
}
```

Token expirado → la misma respuesta.
Token alterado → la misma respuesta.
Token firmado con otra clave → la misma respuesta.
**Por qué:** si la respuesta dijera "token expirado" vs "firma inválida", el
atacante sabría qué verificar.

---

## 10. Campos controlados por el servidor

### Registro (`POST /auth/register`)

El body solo puede tener `email` y `password`. Si llega `role`, `id`,
`passwordHash` o cualquier otro → `400 SERVER_CONTROLLED_FIELD`.

### Creación (`POST /requests`)

El body solo puede tener `title`, `description`, `priority`. Si llega `id`,
`status`, `createdBy`, `createdAt`, `updatedAt` o `changedBy` → `400 SERVER_CONTROLLED_FIELD`.

### Actualización (`PATCH /requests/:id`)

`id`, `createdBy`, `createdAt`, `updatedAt`, `changedBy` siempre rechazados.
`status` SÍ se permite (el agent gestiona el flujo), a diferencia de POST.

**Por qué `changedBy` nunca se acepta:** si el cliente lo controlara, podría
falsificar quién realizó un cambio en el historial.

---

## 11. La transacción: por qué importa

Toda operación de escritura que modifique el estado usa una transacción
PostgreSQL:

```javascript
const row = await withTransaction(async (client) => {
  const current = await findById(id, client);  // SELECT FOR UPDATE implícito
  // ... validaciones ...
  const updated = await updateRequest(id, changes, client);
  if (statusChanges) {
    await insertStatusHistory(id, oldStatus, newStatus, actor.userId, client);
  }
  return updated;
});
```

**Por qué:** si el `updateRequest` funciona pero el `insertStatusHistory` falla,
sin transacción tendríamos un request actualizado pero sin historial. La
transacción asegura atomicidad: todo succeeds o todo falla.

---

## 12. Las solicitudes heredadas (legadas)

Las migraciones 001-002 crearon solicitudes sin `created_by` (la columna no
existía). La migración 004 la agregó como NULL-able.

¿Quién las ve? **Solo el agent.**

¿Por qué? En SQL:
```sql
-- Para requester (filtrado en requests.store.js):
WHERE created_by = $1   -- $1 = UUID del requester

-- NULL != UUID, así que las legadas NUNCA aparecen para un requester
-- (la comparación SQL: NULL = algo → UNKNOWN → se excluye del WHERE)
```

El agent no tiene filtro de `created_by` (ve todo), así que las legadas
aparecen en su lista con `createdBy: null`.

---

## 13. Validación del taller: comandos y estructura

### Cómo se valida

```bash
# Una estación individual
npm run validate:class-05 -- --stage setup
npm run validate:class-05 -- --stage register

# Integral: todas las estaciones (debe pasar 12/12 dos veces seguidas)
npm run validate:class-05
```

### Las 8 estaciones y qué verifican

| Estación       | Qué verifica                                              |
| -------------- | --------------------------------------------------------- |
| `setup`        | .env con DATABASE_URL + JWT_SECRET, migraciones, seed.sql, scripts/ |
| `access-design`| access-matrix.md, auth-contract.md, threat-cases.md completos |
| `register`     | POST /auth/register funciona + role no aceptado del body |
| `password`     | hashPassword se usa antes de persistir, hash no sale nunca |
| `login`        | Token emitido + claims correctos (sub, role, exp, iss, aud) |
| `authentication`| Endpoints protegidos rechazan sin token y con token malo |
| `ownership`    | Requester solo ve sus solicitudes, legadas solo agent     |
| `authorization`| Agent no puede editar contenido, máquina de estados respetada |

### El boss battle

El boss battle corre TODOS los tests de una sola vez: 12 asserts.
**Debe pasar dos veces seguidas** para completar el taller.

---

## 14. Archivos clave del proyecto (para estudiar el código)

| Archivo                                   | Qué hace                                      |
| ----------------------------------------- | --------------------------------------------- |
| `src/modules/auth/token.js`               | issueToken() y verifyToken() con jose         |
| `src/modules/auth/auth.service.js`        | register, login, getCurrentUser               |
| `src/modules/auth/password.js`            | hashPassword/verifyPassword (NO se toca)      |
| `src/middleware/authenticate.js`          | Header → req.auth (identidad única confiable) |
| `src/modules/requests/request.policy.js`  | 7 funciones puras de autorización             |
| `src/modules/requests/requests.service.js`| Actor-primero, todo-o-nada, transacciones     |
| `src/modules/requests/request-status.js`  | Máquina de estados (canTransition)            |
| `src/modules/requests/requests.store.js`  | SQL: filtro createdBy en WHERE, created_by    |
| `src/modules/requests/request.mapper.js`  | mapRequestRow, mapHistoryRow                  |
| `src/http/respond-error.js`               | Categoría AppError → código HTTP              |
| `src/app-error.js`                        | AppError(category, code, message)             |

---

## 15. Qué intentó romper el validador (simulación de ataques)

| Ataque                                               | Resultado esperado                                |
| ---------------------------------------------------- | ------------------------------------------------- |
| Registro con `role: "agent"` en el body               | `400 SERVER_CONTROLLED_FIELD`                     |
| Requester pide `GET /requests/:id` de solicitud ajena | `404 REQUEST_NOT_FOUND`                           |
| Endpoint protegido sin header `Authorization`          | `401 AUTHENTICATION_REQUIRED`                     |
| Token con payload manipulado                          | `401 INVALID_TOKEN`                               |
| Token con firma falsa                                 | `401 INVALID_TOKEN`                               |
| Token vencido                                         | `401 INVALID_TOKEN`                               |
| Requester cambia prioridad                            | `403 FORBIDDEN`                                   |
| Body mixto (title + priority) por requester            | `403 FORBIDDEN` + cero cambios                    |
| Agent: `open → closed`                               | `409 INVALID_STATUS_TRANSITION`                   |
| Registro con email duplicado                          | `409 ACCOUNT_CANNOT_BE_CREATED` (genérico)        |
| Login con email inexistente vs password mala           | `401 INVALID_CREDENTIALS` (byte a byte iguales)   |
| `POST /requests` con `createdBy` o `status`           | `400 SERVER_CONTROLLED_FIELD`                     |
| `PATCH` sobre request en estado terminal               | `409 REQUEST_IN_TERMINAL_STATUS`                  |
| `PATCH` con `changedBy` para forzar actor              | `400 SERVER_CONTROLLED_FIELD`                     |

---

## 16. Cosas que SÍ se tocaron y cosas que NO

### Sí se implementó
- Registro con allowlist estricta
- Login genérico
- JWT firmado con jose (HS256, 1h, issuer/audience estrictos)
- Middleware de autenticación Bearer
- Creación de solicitudes con actor-first
- Aislamiento requester en SQL (WHERE created_by = $1)
- Visibilidad 404 para recursos ajenos (IDOR)
- Policy: funciones puras sobre actor + request
- Todo-o-nada en PATCH (mixed bodies → 403)
- Historial con changed_by desde token, no body
- Mapeo de errores AppError → HTTP

### NO se implementó (no es parte de la sesión)
- Refresh tokens (el token vive 1 hora y punto)
- Servidor de revocación de tokens
- Roles adicionales (admin, manager)
- Paginación de resultados
- Rates/limits
- Frontend funcional (el starter quedó listo para la entrega 05A/05B)

---

## 17. Puntos de confusión comunes (preguntas frecuentes)

**¿Por qué no se puede simplemente mirar el token para saber si es válido?**
Porque decodificar es solo Base64. Cualquiera puede cambiar el payload y
volver a codificar. La verificación de firma es lo que aporta seguridad.

**¿Por qué `404` en vez de `403` para recursos ajenos?**
Porque `403` te dice "esto existe pero no puedes". `404` te dice "no existe",
y si el recurso SÍ existe, el cliente no puede saberlo. Es la diferencia
entre "no tengo permiso" (revela existencia) y "no hay nada aquí" (no revela).

**¿Por qué el agent no puede crear solicitudes?**
Porque la matriz de acceso del taller lo define así: el agent gestiona, el
requester reporta. No es una limitación técnica sino una decisión de diseño
del sistema.

**¿Por qué la máquina de estados aplica al agent también?**
Porque la máquina es integridad de datos, no permisos. Un `agent` tiene
permiso para cambiar el estado (el campo), pero no puede saltarse los
estados (`open→closed` directamente). La integridad no distingue roles.

**¿Por qué `hashPassword` se invoca ANTES del INSERT?**
Porque la password en texto plano solo debe existir en memoria durante los
milisegundos que tarda la función. Si el INSERT falla, el hash se pierde
(no hay problema: no se guardó nada sensible). Si hasheamos después del
INSERT, habría un momento en que la password en texto plano está en la BD
(brecha de seguridad).

**¿Por qué `AUTHENTICATION_REQUIRED` y `INVALID_TOKEN` son dos códigos
distintos?**
`AUTHENTICATION_REQUIRED` = no intentaste autenticarte (sin header).
`INVALID_TOKEN` = intentaste pero falló (token malo/vencido). Ambos son 401,
pero el código ayuda al desarrollador del frontend a saber si redirigir a
login (requiere intento) o si el token almacenado está corrupto.

---

## 18. Comandos útiles para repasar

```bash
# Verificar conexión a BD
npm run db:check

# Correr una estación (reemplaza <nombre>)
npm run validate:class-05 -- --stage setup
npm run validate:class-05 -- --stage access-design
npm run validate:class-05 -- --stage register
npm run validate:class-05 -- --stage password
npm run validate:class-05 -- --stage login
npm run validate:class-05 -- --stage authentication
npm run validate:class-05 -- --stage ownership
npm run validate:class-05 -- --stage authorization

# Boss battle completo (12/12, dos veces seguidas)
npm run validate:class-05

# Arrancar el servidor manualmente (para probar con curl)
node src/server.js

# Probar login con curl
curl -X POST http://localhost:3000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"alice@example.com","password":"mi password muy segura 12345"}'

# Probar con token
curl http://localhost:3000/requests \
  -H 'Authorization: Bearer <token>'
```

---

## 19. Resumen: las 5 ideas para llevar a clase

1. **Identidad ≠ Autenticación ≠ Autorización:** quién soy → cómo lo pruebo → qué puedo hacer.
2. **El body NUNCA es fuente de verdad para campos de seguridad:** `createdBy`, `changedBy`, `role` siempre provienen del token verificado.
3. **404 para lo ajeno es una decisión de diseño deliberada:** prevenir IDOR, no un accidente.
4. **Todos están sujetos a la máquina de estados:** el agent tiene más permisos, pero no puede saltarse reglas de integridad.
5. **Los errores genéricos no son error:** son la única forma de no filtrar información al atacante.