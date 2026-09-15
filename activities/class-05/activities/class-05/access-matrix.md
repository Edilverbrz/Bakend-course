# Matriz de acceso — Request API v5

Dos roles exactos: `requester` y `agent`. Sin `admin`.

Celdas: `Sí` · `No` · `Propias` · `Propia` · `Propia y abierta`.
La matriz puede discutirse, pero la implementación converge en la baseline
del taller (lámina Contrato fijo). Cada celda dudosa queda justificada en
`decision-log.md`.

| Operación | Anónimo | Requester | Agent |
| --------- | ------: | --------: | ----: |
| `POST /auth/register` | `Sí` | `Sí` | `Sí` |
| `POST /auth/login` | `Sí` | `Sí` | `Sí` |
| `GET /auth/me` | `No` | `Sí` | `Sí` |
| `GET /requests` | `No` | `Propias` | `Sí` |
| `GET /requests/:id` | `No` | `Propias` | `Sí` |
| `GET /requests/:id/history` | `No` | `Propias` | `Sí` |
| `POST /requests` | `No` | `Sí` | `No` |
| Editar título/descripción | `No` | `Propia y abierta` | `No` |
| Cambiar prioridad | `No` | `No` | `Sí` |
| Cambiar estado | `No` | `No` | `Sí` |

## Campos controlados por el servidor

Si el cliente los envía, la API responde `400 SERVER_CONTROLLED_FIELD` —
nunca se ignoran en silencio.

Registro (`POST /auth/register`):

- `role`
- `id`
- `createdAt`
- `updatedAt`
- `createdBy`
- `passwordHash`

Creación de solicitud (`POST /requests`):

- `id`
- `status` (nace `open`; el estado no se elige al crear)
- `createdBy`
- `createdAt`
- `updatedAt`
- `changedBy`

Actualización de solicitud (`PATCH /requests/:id`):

- `id`
- `createdBy`
- `createdAt`
- `updatedAt`
- `changedBy`

Selects: la política no depende del body; `createdBy` y `changedBy` provienen
siempre del token autenticado (`req.auth`).

## Solicitudes heredadas

¿Quién ve las solicitudes sin propietario (`created_by IS NULL`)? ¿Por qué?

Solo `agent`.

**Por qué:** las solicitudes creadas en las clases 3-4 no tienen dueño (la
columna es nullable por compatibilidad, no por descuido). Un requester filtra
por `created_by = <su id>`, y NULL nunca coincide con un id: una solicitud sin
dueño no es "de nadie en particular", y mostrarle a un requester que existe
ahí una solicitud que no puede ver infringiría la regla de no revelar la
existencia de lo ajeno.

## Semántica de códigos

- `401` — no sé quién eres: sin token, token inválido/vencido, o login fallido.
- `403` — sé quién eres, esto no: actor identificado y operación prohibida.
- `404` — para ti no existe: recurso inexistente o ajeno cuya existencia no
  conviene revelar (misma respuesta exacta).
- `409` — existe, pero choca: conflicto con el estado del recurso (duplicados,
  transiciones ilegales, terminales).