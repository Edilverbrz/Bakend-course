# Casos adversariales — Request API v5

Describe al menos ocho ataques que tu implementación deberá resistir, con el
resultado exacto esperado (código HTTP + `error.code`). Piensa como quien NO
respeta tu frontend: registro con `role`, `createdBy` inventado, IDs ajenos,
tokens editados o vencidos, bodies mixtos, headers extraños…
1. Registro con "role": "agent" o "admin" inyectado en el body
   -> 400 SERVER_CONTROLLED_FIELD

2. Intentar asignar o sobreescribir "createdBy" o "userId" al crear un recurso
   -> 400 SERVER_CONTROLLED_FIELD

3. Acceder a un recurso ajeno mediante IDOR (ej. GET/PATCH /requests/:id de otro usuario)
   -> 404 NOT_FOUND

4. Petición a endpoint protegido sin enviar el header Authorization
   -> 401 TOKEN_MISSING

5. Enviar un token JWT firmado con una clave falsa o con payload manipulado
   -> 401 TOKEN_INVALID

6. Petición con un token JWT cuya fecha de expiración (`exp`) ya pasó
   -> 401 TOKEN_EXPIRED

7. Usuario autenticado con rol "user" intentando acceder a una ruta exclusiva de "agent"/"admin"
   -> 403 FORBIDDEN

8. Inyección de propiedades no permitidas o tipos de datos incorrectos en el body (ej. payload mixto o malformado)
   -> 400 INVALID_PAYLOAD