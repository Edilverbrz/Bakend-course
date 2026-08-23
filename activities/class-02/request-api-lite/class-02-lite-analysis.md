# Análisis de Request API Lite (class-02)

## Resumen General

`request-api-lite` es una API REST minimalista construida con **Express.js** para gestionar solicitudes de mantenimiento. Diseñada con fines educativos, demuestra los conceptos fundamentales de una API CRUD sin dependencias externas complejas (sin base de datos, sin autenticación, sin validación robusta).

## Arquitectura y Estructura

### Tecnologías
- **Node.js 18+** (ES Modules nativo)
- **Express.js 5.x** (framework web minimalista)
- **Almacenamiento en memoria** (array de JavaScript)

### Estructura del Proyecto
```
request-api-lite/
├── server.js          # Único archivo de lógica (todo en uno)
├── package.json       # Configuración y dependencias
├── README.md          # Documentación de uso
└── *.md               # Archivos de análisis (este archivo, comparison.md, ai-usage.md)
```

## Modelo de Datos

Cada solicitud (request) tiene la siguiente estructura:

```json
{
  "id": 1,                    // Number - Identificador único auto-incremental
  "title": "string",          // String - Título obligatorio
  "description": "string",    // String - Descripción opcional
  "status": "open",           // String - Estado: "open" | "in-progress" | "closed"
  "priority": "high"          // String - Prioridad: "high" | "medium" | "low"
}
```

**Datos iniciales (seed)**: 3 solicitudes predefinidas con IDs 1, 2, 3.

## Endpoints Implementados

| Método | Ruta | Descripción | Código Éxito | Código Error |
|--------|------|-------------|--------------|--------------|
| GET | `/getRequests` | Lista todas las solicitudes | 200 | - |
| GET | `/requests/:id` | Obtiene una solicitud por ID | 200 | 404 (no encontrado) |
| POST | `/requests` | Crea nueva solicitud | 200* | 400 (validación) |

> *Nota: La versión original usa 200 en lugar de 201 para creación. Esto se corrigió en la versión mejorada.

## Análisis Detallado por Componente

### 1. Almacenamiento en Memoria (`requests` array + `nextId`)

**Ventajas:**
- Simplicidad extrema: cero configuración
- Ideal para prototipos y aprendizaje
- Respuesta instantánea (sin I/O de disco/red)

**Desventajas:**
- **Pérdida total de datos al reiniciar** el proceso
- No escala: un solo proceso, memoria limitada
- No soporta concurrencia real (race conditions en `nextId++`)
- No hay persistencia ni respaldo

### 2. Endpoint `GET /getRequests`

```javascript
app.get('/getRequests', (req, res) => {
  res.json(requests);
});
```

- Devuelve el array completo sin paginación
- No permite filtrado, ordenación ni búsqueda
- Expone todos los datos (sin control de acceso)

### 3. Endpoint `GET /requests/:id`

```javascript
app.get('/requests/:id', (req, res) => {
  const id = Number(req.params.id);
  const request = requests.find((item) => item.id === id);

  if (!request) {
    return res.json({ error: 'Request not found' }); // ⚠️ Debería ser 404
  }

  res.json(request);
});
```

**Problemas detectados:**
- **Código de estado incorrecto**: Devuelve 200 OK con `{ error: ... }` en lugar de 404 Not Found
- Conversión `Number()` implícita: `"abc"` → `NaN`, no encuentra coincidencia → 404 (comportamiento aceptable pero implícito)

### 4. Endpoint `POST /requests`

```javascript
app.post('/requests', (req, res) => {
  const newRequest = {
    id: nextId,
    title: req.body.title,
    description: req.body.description,
    status: 'open',
    priority: req.body.priority
  };

  nextId = nextId + 1;
  requests.push(newRequest);

  res.status(200).json(newRequest); // ⚠️ Debería ser 201 Created
});
```

**Problemas detectados:**
- **Sin validación**: `title`, `description`, `priority` pueden ser `undefined`
- **Código de estado incorrecto**: 200 en lugar de 201 Created
- **Prioridad sin default**: Si no se envía `priority`, queda `undefined`
- **Race condition**: `nextId++` no es atómico (problema bajo carga concurrente)

## Fortalezas del Diseño Actual

1. **Código legible y autocontenido**: Todo en un archivo, fácil de leer y modificar
2. **Convenciones REST básicas**: Nombres de rutas plurales, uso de parámetros de ruta
3. **Middleware `express.json()`**: Parseo automático de JSON en body
4. **Datos semilla realistas**: Ejemplos con diferentes status y priority
5. **Documentación clara**: README con ejemplos curl funcionales

## Debilidades y Deuda Técnica

| Categoría | Problema | Severidad |
|-----------|----------|-----------|
| **HTTP Semantics** | Códigos de estado incorrectos (200 vs 404, 200 vs 201) | Alta |
| **Validación** | Sin validación de entrada en POST | Alta |
| **Persistencia** | Datos volátiles en memoria | Media (por diseño educativo) |
| **Concurrencia** | Race condition en `nextId` | Media |
| **Escalabilidad** | Sin paginación en listado | Baja |
| **Seguridad** | Sin sanitización, rate limiting, CORS configurado | Baja (contexto educativo) |
| **Testing** | Sin tests unitarios ni de integración | Media |

## Mejoras Propuestas (Implementadas en server.js principal)

1. **Corregir códigos de estado HTTP**: 404 para no encontrado, 201 para creado
2. **Agregar validación básica**: `title` requerido, defaults para campos opcionales
3. **Agregar endpoint `/getRequests`**: Falta en la versión básica original
4. **Comentarios explicativos**: Documentar cada decisión de corrección
5. **Unificar puerto**: Usar 3000 consistentemente

## Conclusión

`request-api-lite` cumple su objetivo pedagógico: mostrar la estructura mínima de una API Express con operaciones CRUD básicas. Sin embargo, tiene **fallos semánticos HTTP importantes** (códigos de estado) y **carece de validación básica** que la hacen inadecuada para uso real. Las correcciones aplicadas en `class-02/server.js` elevan la calidad del código a un nivel "producción educativa" manteniendo la simplicidad arquitectónica.