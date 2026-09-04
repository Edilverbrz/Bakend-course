# Casos de prueba — Request API (clase 03)

## Endpoint GET /requests

| Caso | Descripción | Parámetros | Expected |
|------|-------------|------------|----------|
| TC01 | Listar todas las solicitudes | none | `200` + array de solicitudes |
| TC02 | Listar con filtro por status | `?status=open` | `200` + solo solicitudes open |
| TC03 | Listar con filtro por priority | `?priority=high` | `200` + solo solicitudes high |
| TC04 | Listar con filtro por título | `?title=projector` | `200` + solicitudes que contienen "projector" |

## Endpoint GET /requests/:id

| Caso | Descripción | Expected |
|------|-------------|----------|
| TC05 | Consultar solicitud existente | `200` + solicitud |
| TC06 | Consultar solicitud inexistente | `404` + error formateado |

## Endpoint POST /requests

| Caso | Descripción | Expected |
|------|-------------|----------|
| TC07 | Crear solicitud válida | `201` + solicitud creada |
| TC08 | Crear sin title | `400` + `{ "error": { "code": "VALIDATION_ERROR", "message": "Title is required" } }` |
| TC09 | Crear con title vacío | `400` + `{ "error": { "code": "VALIDATION_ERROR", "message": "Title is required" } }` |

## Endpoint PATCH /requests/:id

| Caso | Descripción | Expected |
|------|-------------|----------|
| TC10 | Actualizar estado a in_progress | `200` + solicitud actualizada |
| TC11 | Actualizar con campos inválidos | `400` + error formatado |
| TC12 | Actualizar solicitud inexistente | `404` + error formatado |

## Endpoint DELETE /requests/:id

| Caso | Descripción | Expected |
|------|-------------|----------|
| TC13 | Eliminar solicitud existente | `204` sin contenido |
| TC14 | Eliminar solicitud inexistente | `404` + error formatado |

## Máquina de estados

Las transiciones permitidas son:
- `open` → `in_progress`
- `open` → `resolved`
- `open` → `closed`
- `open` → `cancelled`
- `in_progress` → `resolved`
- `in_progress` → `closed`
- `in_progress` → `cancelled`
- `resolved` → `closed`
- `cancelled` → `closed`

Transiciones no permitidas: cualquier estado → `open` (solo al crear).