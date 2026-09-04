# Contrato HTTP — Request API (clase 03)

> Este contrato incluye los endpoints de la clase 02 más las nuevas funcionalidades de la clase 03:
> filtros, actualización parcial, máquina de estados y formato de error unificado.

## Recurso

Una **solicitud de mantenimiento** (`request`): un problema reportado que el equipo debe
atender.

### Forma del recurso

| Campo         | Tipo   | Obligatorio | Quién lo asigna | Notas                                  |
| ------------- | ------ | ----------- | --------------- | -------------------------------------- |
| `id`          | number | sí          | servidor        | secuencial, generado con `generateId()` |
| `title`       | string | sí          | cliente         | no puede estar vacío                   |
| `description` | string | no          | cliente         | `""` si no se envía                    |
| `status`      | string | sí          | servidor        | siempre `open` al crear                |
| `priority`    | string | no          | cliente         | `medium` si no se envía                |

## Endpoint 1 — Listar solicitudes

| Elemento            | Valor                                  |
| ------------------- | -------------------------------------- |
| Método              | `GET`                                  |
| Ruta                | `/requests`                            |
| Entrada             | query params opcionales: `status`, `priority`, `title` |
| Respuesta de éxito  | `200` con el arreglo (puede ser `[]`)  |
| Respuestas de error | ninguna prevista                       |

Los filtros disponibles:
- `status`: filtrar por estado (open, in_progress, resolved, closed, cancelled)
- `priority`: filtrar por prioridad (high, medium, low)
- `title`: filtrar por título (búsqueda parcial)

## Endpoint 2 — Consultar una solicitud

| Elemento            | Valor                                   |
| ------------------- | --------------------------------------- |
| Método              | `GET`                                   |
| Ruta                | `/requests/:id`                         |
| Entrada             | `id` numérico en el path                |
| Respuesta de éxito  | `200` con la solicitud                  |
| Respuestas de error | `404` si no existe                      |

## Endpoint 3 — Crear una solicitud

| Elemento            | Valor                                              |
| ------------------- | -------------------------------------------------- |
| Método              | `POST`                                             |
| Ruta                | `/requests`                                        |
| Entrada             | body JSON con `title` (obligatorio), `description`, `priority` |
| Respuesta de éxito  | `201` con la solicitud creada                      |
| Respuestas de error | `400` si falta el `title` o está vacío             |

## Endpoint 4 — Actualizar una solicitud (parcial)

| Elemento            | Valor                                   |
| ------------------- | --------------------------------------- |
| Método              | `PATCH`                                 |
| Ruta                | `/requests/:id`                         |
| Entrada             | body JSON con los campos a actualizar   |
| Respuesta de éxito  | `200` con la solicitud actualizada      |
| Respuestas de error | `404` si no existe, `400` si el body está vacío |

## Endpoint 5 — Eliminar una solicitud

| Elemento            | Valor                                   |
| ------------------- | --------------------------------------- |
| Método              | `DELETE`                                |
| Ruta                | `/requests/:id`                         |
| Entrada             | `id` numérico en el path                |
| Respuesta de éxito  | `204` sin contenido                     |
| Respuestas de error | `404` si no existe                      |

## Formato de error unificado

**Antes (clase 02):** `{ "error": "mensaje" }`

**Después (clase 03):** `{ "error": { "code": "...", "message": "..." } }`

Códigos de error comunes:
- `VALIDATION_ERROR`: datos de entrada inválidos
- `NOT_FOUND`: recurso no encontrado
- `INTERNAL_ERROR`: error interno del servidor

## Reglas transversales

1. Todas las respuestas devuelven `Content-Type: application/json`.
2. Una ruta que no existe responde `404`.
3. El formato de error evoluciona a `{ "error": { "code": "...", "message": "..." } }`.
4. El servidor ignora los campos que el cliente no controla (`id`, `status` al crear).
5. Las transiciones de estado deben seguir la máquina de estados: open → in_progress → resolved → closed (o cancelled).
