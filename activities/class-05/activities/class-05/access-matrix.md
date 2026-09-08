# Matriz de acceso — Request API v5

Dos roles exactos: `requester` y `agent`. Sin `admin`.

Completa cada celda con `Sí`, `No`, `Propias` o `Propia y abierta`.
La matriz puede discutirse, pero la implementación converge en la baseline
del taller (lámina Contrato fijo).

| Operación | Anónimo | Requester | Agent |
| --------- | ------: | --------: | ----: |
| `POST /auth/register` | `Sí` | `Sí` | `Sí` |
| `POST /auth/login` | `Sí` | `Sí` | `Sí` |
| `GET /auth/me` | 'no' | `Sí` | `Sí` |
| `GET /requests` | 'no' | 'Propias' | 'si' |
| `GET /requests/:id` | 'no' | 'propias' | 'si' |
| `GET /requests/:id/history` | 'no' | 'Propias' | 'si' |
| `POST /requests` | 'no' | 'si' | 'no' |
| Editar título/descripción | 'no' | 'Propia y abierta' | 'no' |
| Cambiar prioridad | 'no' | 'no' | 'si' |
| Cambiar estado | 'no' | 'no' | 'si' |

## Campos controlados por el servidor
reguistro: 400 SERVER_CONTROLLED_FIELD 
- role 
- id
- createdAt
- passwordHash

solicitud: 400 SERVER_CONTROLLED_FIELD 
- createBy
- status
- id 

actualizacion sulicitud: 400 SERVER_CONTROLLED_FIELD
- updateAt
- changedBy

## Solicitudes heredadas

¿Quién ve las solicitudes sin propietario (`created_by IS NULL`)? ¿Por qué?

Agentes:
el cliente no puedo tener acceso a los reguistro

