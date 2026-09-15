# FEATURE-206 — Endpoint de historial de solicitudes

Solicitado por: equipo de producto
Estado: abierto

## Historia

Como usuario autenticado,
quiero leer el historial de una solicitud
para entender cómo ha cambiado con el tiempo.

## Endpoint

```http
GET /requests/:id/history
```

## Representación de referencia

```json
[
  {
    "id": 18,
    "type": "status_changed",
    "fromStatus": "open",
    "toStatus": "in_progress",
    "createdAt": "2026-09-15T18:30:00.000Z"
  },
  {
    "id": 21,
    "type": "priority_changed",
    "fromPriority": "medium",
    "toPriority": "high",
    "createdAt": "2026-09-15T18:45:00.000Z"
  }
]
```

## Reglas

1. Requiere autenticación.
2. Un requester puede leer el historial de SUS PROPIAS solicitudes.
3. Un requester no puede leer el historial de otra persona: se debe mantener
   el contrato EXISTENTE para solicitudes ajenas (no cambiarlo silenciosamente).
4. Un agent puede leer cualquier historial.
5. Una solicitud inexistente responde `404`.
6. Una solicitud sin eventos responde `200` con `[]`.
7. Los eventos se ordenan del más antiguo al más reciente, con una regla estable
   cuando dos eventos comparten la misma marca de tiempo.
8. La respuesta nunca expone contraseñas, hashes, tokens ni secretos.
9. Mantén el formato existente de errores y las responsabilidades actuales; no
   dupliques reglas de autorización ya existentes.

## Fuera del alcance

Paginación, filtros de historial, WebSockets, auditoría avanzada.
