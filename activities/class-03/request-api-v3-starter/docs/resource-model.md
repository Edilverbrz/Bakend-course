# Modelo de Recurso — Request API (clase 03)

## Esquema completo del recurso `request`

```json
{
  "id": 1,
  "title": "String - obligatorio, no vacío",
  "description": "String - opcional, vacío por defecto",
  "status": "String - obligatorio al crear, siempre 'open'",
  "priority": "String - opcional, 'medium' por defecto",
  "createdAt": "Date - automático al crear",
  "updatedAt": "Date - actualizado en PATCH"
}
```

## Estados y transiciones

| Estado actual | Estados permitidos | Acción |
| ------------- | ------------------ | ------ |
| `open` | `in_progress`, `resolved`, `closed`, `cancelled` | Solicitud nueva |
| `in_progress` | `resolved`, `closed`, `cancelled` | Trabajo en curso |
| `resolved` | `closed` | Problema solucionado |
| `closed` | - | Estado final |
| `cancelled` | `closed` | Solicitud cancelada |

## Validaciones de negocio

1. **Title**: Required, min 1 character, max 200 characters
2. **Priority**: Si proporcionado, debe ser 'high', 'medium' o 'low'
3. **Status transitions**: Solo las transiciones definidas en la máquina de estados son permitidas
4. **Id**: Generado server-side, nunca enviado por el cliente
5. **createdAt/updatedAt**: Timestamps automáticos, formateado en ISO 8601

## Relaciones

- Un `request` pertenece a un `department` (en extensiones futuras)
- Un `request` puede tener múltiples `comments` (en extensiones futuras)