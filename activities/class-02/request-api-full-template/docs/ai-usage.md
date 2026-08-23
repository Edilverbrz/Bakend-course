# AI Usage Documentation — Request API Full

## Herramientas de IA Utilizadas

- **Claude (Opencode)**: Asistente de codificación utilizado para analizar la plantilla, completar el contrato HTTP, implementar los endpoints y crear la documentación requerida.

## Prompts Principales

1. **Análisis de la plantilla**: Se solicitó explorar la estructura de `request-api-full-template` para entender la separación de responsabilidades (server.js, app.js, data/requests.js, routes/requests.routes.js) y los TODOs pendientes.

2. **Redacción del contrato HTTP (`docs/http-contract.md`)**: Se pidió completar el contrato ANTES de implementar, definiendo:
   - Descripción del recurso y tabla de campos
   - Tres endpoints con método, ruta, entrada, respuestas de éxito/error
   - Ejemplos JSON realistas
   - Reglas transversales (Content-Type, 404, formato de error, campos ignorados)
   - Decisiones de diseño con justificación

3. **Implementación de `src/routes/requests.routes.js`**: Se solicitó reemplazar los `501 Not Implemented` por lógica real:
   - `GET /` → lista completa (200)
   - `GET /:id` → búsqueda por ID con 404 si no existe
   - `POST /` → validación de title, defaults, 201 Created

4. **Creación de `casos-de-prueba.md`**: Documentar casos de prueba manuales con curl y resultados observados.

5. **Verificación funcional**: Ejecutar el servidor y probar cada endpoint con curl.

## Decisiones de Diseño Tomadas con Asistencia de IA

- **Contrato primero, código después**: Siguiendo la instrucción explícita del README, el contrato HTTP se escribió completamente antes de tocar `requests.routes.js`. Esto forzó claridad en códigos de estado, formato de errores y defaults.
- **Validación de `title` con `.trim()`**: Rechaza strings vacíos o solo espacios, no solo `undefined`/`null`.
- **Defaults explícitos**: `description` → `""`, `priority` → `"medium"`, `status` → `"open"`. Evita `undefined` en respuestas JSON.
- **Uso de `generateId()`**: Delegación al módulo de datos para mantener la responsabilidad de IDs en un solo lugar.
- **Formato de error consistente**: Siempre `{ "error": "mensaje" }` tanto en 400 como en 404.
- **Códigos de estado semánticos**: 200 para lecturas, 201 para creación, 400 para validación, 404 para no encontrado.

## Verificación Humana

Todos los cambios fueron revisados manualmente para:
- Confirmar que la sintaxis ES Modules (`import`/`export`) es correcta en todos los archivos.
- Verificar que los códigos de estado HTTP siguen el contrato escrito y estándares REST.
- Asegurar que la lógica de `generateId()` y `requests.push()` funciona correctamente.
- Validar que el servidor inicia sin errores en Node.js 18+ (`node src/server.js`).
- Probar cada endpoint con curl y confirmar respuestas esperadas (ver `casos-de-prueba.md`).

## Limitaciones y Consideraciones

- **Datos en memoria**: Igual que la versión lite, los datos se pierden al reiniciar (por diseño del ejercicio).
- **Sin validación de `priority`**: El contrato dice "valores válidos: high/medium/low" pero el servidor acepta cualquier string. Esto es intencional por simplicidad (fuera de alcance: validación exhaustiva).
- **Sin sanitización avanzada**: No se escapa HTML ni se previene inyección (contexto educativo, solo JSON).
- **Sin tests automatizados**: La verificación es manual con curl según `casos-de-prueba.md`.
- **Rechazo de sugerencias fuera de alcance**: La IA propuso en algún momento agregar validación de enum para priority, PUT/PATCH/DELETE, o base de datos; todas fueron rechazadas y no se implementaron, quedando anotado aquí.

## Archivos Modificados/Creados por IA

| Archivo | Acción |
|---------|--------|
| `docs/http-contract.md` | Completado totalmente (estaba vacío/plantilla) |
| `src/routes/requests.routes.js` | Implementados los 3 endpoints (reemplazando 501) |
| `ai-usage.md` | Creado (este archivo) |
| `casos-de-prueba.md` | Creado con resultados de curl reales |