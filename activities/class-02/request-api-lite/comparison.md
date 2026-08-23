# Comparativa: class-02/server.js vs request-api-lite/server.js

## Resumen Ejecutivo

| Aspecto | class-02/server.js (Original) | class-02/server.js (Corregido) | request-api-lite/server.js |
|---------|-------------------------------|--------------------------------|----------------------------|
| **Puerto** | 8800 | **3000** ✓ | 3000 |
| **Endpoints** | 2 (GET/:id, POST) | **3 (GET/all, GET/:id, POST)** ✓ | 3 |
| **Almacenamiento** | Ninguno (hardcoded) | **Array en memoria con seed** ✓ | Array en memoria con seed |
| **Modelo de datos** | {id, status} | **{id, title, description, status, priority}** ✓ | Completo |
| **Auto-incremento ID** | No (hardcoded 43) | **Sí (nextId)** ✓ | Sí |
| **Validación POST** | No | **Sí (title requerido)** ✓ | No |
| **Error 404** | No | **Sí** ✓ | No (devuelve 200 con error) |
| **Status 201 Created** | Sí | **Sí** ✓ | No (usa 200) |
| **Comentarios** | No | **Sí (cada corrección)** ✓ | Mínimos |

## Análisis Detallado por Categorías

### 1. Configuración Básica

| Característica | Original (class-02) | Corregido (class-02) | Lite |
|----------------|---------------------|----------------------|------|
| Puerto | 8800 | **3000** | 3000 |
| ES Modules | ✓ | ✓ | ✓ |
| express.json() | ✓ | ✓ | ✓ |

**Observación**: El puerto 3000 es estándar para desarrollo. La versión corregida alinea con la versión lite.

### 2. Almacenamiento y Modelo de Datos

#### Original (class-02/server.js)
```javascript
// SIN almacenamiento - respuesta hardcoded
app.get("/requests/:id", (request, response) => {
  const requestId = Number(request.params.id);
  response.status(200).json({
    id: requestId,
    status: "open",  // Siempre "open", sin title, description, priority
  });
});

app.post("/requests", (request, response) => {
  response.status(201).json({
    id: 43,  // Hardcoded!
    title: requestData.title,
    status: "open",
  });
});
```

#### Corregido (class-02/server.js) & Lite (request-api-lite/server.js)
```javascript
// AMBOS: Almacenamiento en memoria con seed data
const requests = [
  { id: 1, title: "...", description: "...", status: "open", priority: "high" },
  { id: 2, title: "...", description: "...", status: "in-progress", priority: "medium" },
  { id: 3, title: "...", description: "...", status: "open", priority: "low" }
];
let nextId = 4;
```

**Diferencia clave**: La versión corregida adopta el modelo completo de la versión lite.

### 3. Endpoints

| Endpoint | Original | Corregido | Lite | Estado |
|----------|----------|-----------|------|--------|
| `GET /getRequests` | ❌ | ✅ | ✅ | **Agregado en corregido** |
| `GET /requests/:id` | ✅ (básico) | ✅ (completo + 404) | ✅ (sin 404) | **Mejorado en corregido** |
| `POST /requests` | ✅ (incompleto) | ✅ (validado + 201) | ✅ (sin validar + 200) | **Mejorado en corregido** |

### 4. Manejo de Errores HTTP

#### GET /requests/:id - Recurso no encontrado

| Versión | Código | Body | Correcto? |
|---------|--------|------|-----------|
| Original | 200 | `{id: N, status: "open"}` | ❌ (devuelve éxito con ID inexistente) |
| Lite | 200 | `{error: "Request not found"}` | ❌ (código incorrecto) |
| **Corregido** | **404** | `{error: "Request not found"}` | ✅ |

#### POST /requests - Validación

| Versión | title requerido | priority default | Código éxito |
|---------|-----------------|------------------|--------------|
| Original | No | N/A | 201 |
| Lite | No (undefined) | No (undefined) | 200 ❌ |
| **Corregido** | **Sí (400 si falta)** | **Sí ("medium")** | **201 ✅** |

### 5. Auto-incremento de IDs

| Versión | Implementación | Problema |
|---------|----------------|----------|
| Original | `id: 43` (hardcoded) | Siempre devuelve 43 |
| Lite | `nextId = nextId + 1` | Funciona, pero race condition |
| **Corregido** | `nextId = nextId + 1` | Igual que lite (aceptable para educativo) |

### 6. Calidad de Código y Documentación

| Aspecto | Original | Corregido | Lite |
|---------|----------|-----------|------|
| Comentarios explicativos | 0 | **7 comentarios** (cada corrección) | 1 (solo seed data) |
| Nombrado consistente | `request`/`response` | `req`/`res` (estándar) | `req`/`res` |
| Validación de entrada | ❌ | ✅ | ❌ |
| Semántica HTTP correcta | Parcial | **Completa** | Parcial |

## Matriz de Decisiones de Corrección

| # | Cambio | Justificación | Origen |
|---|--------|---------------|--------|
| 1 | Puerto 8800 → 3000 | Estándar de desarrollo, consistencia con lite | Lite |
| 2 | Agregar array `requests` + seed | Persistencia mínima entre requests, datos realistas | Lite |
| 3 | Agregar `nextId` auto-incremental | IDs únicos realistas, no hardcoded | Lite |
| 4 | Agregar `GET /getRequests` | Operación CRUD básica faltante (Read all) | Lite |
| 5 | Modelo completo (title, desc, status, priority) | Paridad funcional con lite | Lite |
| 6 | Validar `title` en POST (400) | Prevenir datos inválidos, buena práctica | Mejora propia |
| 7 | Default `priority: "medium"` | Evitar undefined, UX consistente | Mejora propia |
| 8 | Default `description: ""` | Evitar undefined | Mejora propia |
| 9 | Retornar 404 en GET/:id no encontrado | Semántica HTTP correcta (RFC 7231) | Corrección de lite |
| 10 | Retornar 201 en POST exitoso | Semántica HTTP correcta (RFC 7231) | Corrección de lite |
| 11 | Comentarios `// CORRECCIÓN:` en cada cambio | Trazabilidad educativa, auditoría | Requerimiento tarea |

## Métricas de Código

| Métrica | Original | Corregido | Lite |
|---------|----------|-----------|------|
| Líneas de código | 27 | **48** | 67 |
| Endpoints | 2 | **3** | 3 |
| Comentarios | 0 | **7** | 1 |
| Manejo errores | 0 | **2** (404, 400) | 0 |
| Validaciones | 0 | **1** | 0 |

## Conclusiones

### La versión corregida (class-02/server.js) es **superior a ambas versiones originales**:

1. **Combina lo mejor de ambos mundos**: Estructura completa de lite + correcciones semánticas HTTP
2. **Agrega validación básica** que ninguna de las dos tenía
3. **Documenta cada decisión** con comentarios explicativos (requerimiento de la tarea)
4. **Mantiene simplicidad educativa**: Un solo archivo, sin dependencias extra, en memoria

### La versión lite (request-api-lite/server.js) tiene **bugs semánticos HTTP**:
- Devuelve 200 OK en lugar de 404 Not Found
- Devuelve 200 OK en lugar de 201 Created
- Sin validación de entrada

### La versión original (class-02/server.js) era **incompleta**:
- Sin almacenamiento real
- Solo 2 endpoints (falta listar todos)
- IDs hardcoded
- Modelo de datos mínimo

## Recomendación

Para uso educativo continuado, **usar la versión corregida** como base. Para producción real, se necesitaría:
- Base de datos persistente (SQL/NoSQL)
- Validación robusta (zod, joi)
- Autenticación/autorización
- Tests automatizados
- Paginación, filtrado, ordenación
- Rate limiting, CORS, helmet
- Logging y monitoreo