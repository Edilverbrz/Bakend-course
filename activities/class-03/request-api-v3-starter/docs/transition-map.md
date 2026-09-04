# Mapa de Transiciones — Request API (clase 03)

## Diagrama de estados

```
      open
     / | | \
    /  | |  \
   v   v v   v
in_progress resolved cancelled
    |           |
    |           v
    |        closed
    |           ^
    |           |
    v           |
  cancelled-----/
```

## Tabla de transiciones permitidas

| De | A | Justificación |
| -- | - | ------------- |
| open | in_progress | Comenzar a trabajar en la solicitud |
| open | resolved | Marcar como resuelta sin iniciar trabajo |
| open | closed | Cerrar solicitud inmediatamente |
| open | cancelled | Cancelar solicitud antes de iniciar |
| in_progress | resolved | Completar el trabajo en progreso |
| in_progress | closed | Cerrar después de completar |
| in_progress | cancelled | Cancelar trabajo en progreso |
| resolved | closed | Cerrar solicitud resuelta |
| cancelled | closed | Cerrar solicitud cancelada |

## Transiciones NO permitidas

| De | A | Razón |
| -- | - | ----- |
| cualquier | open | Solo al crear un recurso nuevo |
| resolved | in_progress | No se puede deshacer una resolución |
| closed | any | Estado final, no hay retorno |
| cancelled | in_progress | No se puede reactivar una cancelada |

## Implementación del middleware de validación

```javascript
// Ejemplo conceptual
function validateStateTransition(from, to) {
  const allowed = {
    open: ['in_progress', 'resolved', 'closed', 'cancelled'],
    in_progress: ['resolved', 'closed', 'cancelled'],
    resolved: ['closed'],
    cancelled: ['closed']
  };
  
  return allowed[from] && allowed[from].includes(to);
}
```