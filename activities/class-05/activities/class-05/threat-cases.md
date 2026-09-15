# Casos adversariales — Request API v5

Al menos ocho ataques que tu implementación deberá resistir, con el resultado
exacto esperado (código HTTP + `error.code`). Piensa como quien NO respeta tu
frontend: registro con `role`, `createdBy` inventado, IDs ajenos, tokens
editados o vencidos, bodies mixtos, headers extraños…

1. Registro con `role: "agent"` inyectado en el body
   → `400 SERVER_CONTROLLED_FIELD`
2. Registro con campos de servidor (`id`, `passwordHash`, `createdAt`,
   `createdBy`) en el body
   → `400 SERVER_CONTROLLED_FIELD`
3. IDOR: un requester pide `GET /requests/:id` de una solicitud ajena
   → `404 REQUEST_NOT_FOUND`, IDÉNTICO a un ID inexistente (no revela existencia)
4. Endpoint protegido sin header `Authorization`
   → `401 AUTHENTICATION_REQUIRED`
5. Token JWT firmado con una clave falsa o con el payload manipulado
   (decodificar no verifica)
   → `401 INVALID_TOKEN`
6. Token JWT válidamente firmado pero cuya `exp` ya venció
   → `401 INVALID_TOKEN` (misma respuesta, no dice que venció)
7. Requester autenticado intenta cambiar prioridad o estado de una solicitud
   → `403 FORBIDDEN`
8. Body mixto en PATCH: `title` (permitido al dueño) + `priority` (solo agent)
   → `403 FORBIDDEN` y CERO cambios aplicados (todo-o-nada)
9. Agent intenta `open → closed`
   → `409 INVALID_STATUS_TRANSITION` (los roles nunca saltan la máquina de estados)
10. POST /requests con `createdBy` o `status` en el body
    → `400 SERVER_CONTROLLED_FIELD`
11. PATCH con `changedBy` en el body (forjar el actor del historial)
    → `400 SERVER_CONTROLLED_FIELD`
12. Registro de un email ya existente (enumeración de cuentas)
    → `409 ACCOUNT_CANNOT_BE_CREATED`, genérico, sin confirmar la cuenta
13. Login con email inexistente vs password incorrecta — respuestas idénticas
    → `401 INVALID_CREDENTIALS` byte a byte iguales
14. PATCH sobre una solicitud en estado terminal (`closed`/`cancelled`)
    → `409 REQUEST_IN_TERMINAL_STATUS`