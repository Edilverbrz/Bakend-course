# Reflexión — Request API (clase 03)

## Aprendizajes clave

### De la clase 02 a la clase 03
- **Filtros**: Entender cómo los query params pueden reducir el conjunto de resultados
- **Actualización parcial (PATCH)**: Diferencia entre PUT (reemplazo completo) y PATCH (modificación selectiva)
- **Máquina de estados**: La importancia de definir transiciones permitidas en aplicaciones reales
- **Formato de error unificado**: Consistencia en las respuestas de error es crucial para clientes API

### Desafíos resueltos
- Implementar filtros sin afectar el rendimiento en bases de datos reales
- Manejar transiciones de estado inválidas gracefully
- Mantener compatibilidad hacia atrás mientras se introducen cambios en el formato de error

## Mejoras identificadas

1. **Cobertura de tests**: Añadir más casos de prueba para transiciones de estado
2. **Documentación**: Mantener el contrato HTTP actualizado con cada cambio
3. **Experiencia del desarrollador**: Los mensajes de error claros reducen significativamente el tiempo de debugging

## Próximos pasos

- Implementar validación en el lado del servidor para transiciones de estado
- Añadir documentación interactiva (Swagger/OpenAPI)
- Considerar persistencia real en lugar de memoria volatile