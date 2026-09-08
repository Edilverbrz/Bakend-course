# Contrato de autenticación — Request API v5

Documenta ANTES de implementar. Para cada endpoint: método, ruta, ¿público o
protegido?, body permitido, respuesta de éxito (código + forma) y CADA error
(código HTTP + `error.code`).

## POST /auth/register
Acceso: Público.
Body permitido: { "email": "usuario@ejemplo.com", "password": "123456" }.
Respuesta de éxito (201 Created):
{
  "user": {
    "id": "<userId>",
    "email": "usuario@ejemplo.com",
    "role": "requester",
    "createdAt": "2026-09-08T12:00:00.000Z"
  },
  "accessToken": "<jwt>",
  "expiresIn": 3600
}
Errores:
400 Bad Request — VALIDATION_ERROR
400 Bad Request — SERVER_CONTROLLED_FIELD
409 Conflict — ACCOUNT_CANNOT_BE_CREATED

## POST /auth/login
Acceso: Público.
Body permitido: { "email": "usuario@ejemplo.com", "password": "123456" }.
Respuesta de éxito (200 OK):
{
  "user": {
    "id": "<userId>",
    "email": "usuario@ejemplo.com",
    "role": "requester",
    "createdAt": "2026-09-08T12:00:00.000Z"
  },
  "accessToken": "<jwt>",
  "expiresIn": 3600
}
Errores:
400 Bad Request — VALIDATION_ERROR
401 Unauthorized — INVALID_CREDENTIALS

## GET /auth/me
Acceso: Protegido.
Body: sin cuerpo (no permitido).
Respuesta de éxito (200 OK):
{
  "id": "<userId>",
  "email": "usuario@ejemplo.com",
  "role": "requester",
  "createdAt": "2026-09-08T12:00:00.000Z"
}
Errores:
401 Unauthorized — TOKEN_MISSING
401 Unauthorized — TOKEN_EXPIRED
401 Unauthorized — TOKEN_INVALID
404 Not Found — USER_NOT_FOUND

## Semántica de errores

¿Cuándo responde tu API `401`? ¿Cuándo `403`? ¿Cuándo `404` aunque el recurso
exista? ¿Cuándo `409`? Escribe el criterio, no solo ejemplos.

401 NO AUTORIZADO

GET /auth/me enviando la cabecera Authorization: Bearer token_vencido_o_malformado.

POST /auth/login con la contraseña incorrecta para el correo ingresado.

403 PROIBIDO 

DELETE /requests/123 realizado por un usuario con rol "requester" en una ruta que exige rol "admin".

GET /admin/dashboard intentado por cualquier usuario no autenticado como personal administrativo.

404 Not Found (aunque el recurso exista)

GET /requests/88 donde la solicitud #88 le pertenece al usuario usr_A, pero la consulta la hace el usuario usr_B.

PATCH /requests/88 cuando el usuario usr_B intenta modificar el estado de un ticket que no creó ni tiene asignado.

409 CREO CONFLICTO

POST /auth/register enviando el body {"email": "existente@ejemplo.com", "password": "123"} cuando ese correo ya está registrado.

POST /requests/123/claim cuando dos agentes intentan tomar la misma solicitud sin propietario simultáneamente y el sistema detecta colisión.