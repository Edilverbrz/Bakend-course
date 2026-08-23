# AI Usage Documentation

## Herramientas de IA Utilizadas

- **Claude (Opencode)**: Asistente de codificación utilizado para analizar, comparar y mejorar el código del servidor Express.

## Prompts Principales

1. **Análisis de código existente**: Se solicitó comparar dos implementaciones de `server.js` (la versión básica en `class-02/server.js` y la versión completa en `request-api-lite/server.js`) para identificar diferencias, carencias y oportunidades de mejora.

2. **Refactorización y corrección**: Se pidió modificar el `server.js` principal incorporando las mejores prácticas de la versión "lite", incluyendo:
   - Almacenamiento en memoria con datos iniciales
   - Endpoint GET `/getRequests` para listar todas las solicitudes
   - Manejo de errores HTTP apropiados (404, 400)
   - Validación de campos requeridos
   - Auto-incremento de IDs
   - Códigos de estado HTTP correctos (201 para creación)

## Decisiones de Diseño Tomadas con Asistencia de IA

- **Puerto unificado**: Se cambió el puerto de 8800 a 3000 para consistencia con la versión lite y convenciones comunes.
- **Estructura de datos completa**: Se adoptó el modelo de datos completo (id, title, description, status, priority) en lugar del modelo mínimo original.
- **Validación de entrada**: Se agregó validación básica para el campo `title` en POST `/requests`.
- **Manejo de errores RESTful**: Implementación de respuestas 404 para recursos no encontrados y 400 para datos inválidos.
- **Comentarios explicativos**: Cada corrección incluye un comentario explicando el porqué del cambio.

## Verificación Humana

Todos los cambios fueron revisados manualmente para:
- Confirmar que la sintaxis ES Modules es correcta (`import`/`export`)
- Verificar que los códigos de estado HTTP siguen estándares REST
- Asegurar que la lógica de auto-incremento de IDs funciona correctamente
- Validar que el servidor inicia sin errores en Node.js 18+

## Limitaciones y Consideraciones

- Los datos persisten solo en memoria (se pierden al reiniciar el servidor), igual que en la versión original lite.
- No se implementaron tests automatizados (fuera del alcance de esta actividad).
- No se agregó paginación ni filtrado en `/getRequests` (mantiene simplicidad educativa).