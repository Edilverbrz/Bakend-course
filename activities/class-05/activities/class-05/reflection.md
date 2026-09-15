# Reflexión — Clase 05

Responde con tus palabras al cerrar el taller:

1. ¿Qué diferencia hay entre identidad, autenticación y autorización?

   **Identidad** es quién eres; se establece cuando la API te reconoce como un
   usuario concreto (el `id` y el `role` en el token). **Autenticación** es el
   mecanismo que prueba esa identidad: aquí es un JWT con firma HS256; si la
   firma no coincide o el token venció, la API no confía. **Autorización** viene
   después: una vez autenticado, la API decide si ese usuario concreto tiene
   derecho a hacer esa operación concreto (el `request.policy.js` contra la
   máquina de estados).

2. ¿Por qué `createdBy` y `changedBy` nunca llegan desde el body?

   Porque son atributos de la API, no del cliente. Si un request los enviara,
   podría forzar `createdBy` para hacerse pasar por otro usuario o alterar el
   `changedBy` del historial para falsificar quién realizó un cambio. Ambos
   provienen del token verificado (`req.auth`), la única fuente fiable de
   identidad en cada request. Los campos controlados siempre se rechazan con
   `400 SERVER_CONTROLLED_FIELD` sin silenciar el intento.

3. ¿Qué diferencia hay entre `401` y `403`? ¿Y por qué a veces `404`?

   `401` = "No sé quién eres": falta token, esquema incorrecto, token
   inválido/vencido. `403` = "Sé quién eres, pero no puedes": identidad
   confirmada y operación prohibida para tu rol o relación con el recurso.
   `404` = "Para ti no existe" se usa deliberadamente en dos situaciones: el
   recurso no existe realmente, o existe pero pertenece a otro usuario y no
   queremos revelar su existencia (prevenir IDOR). Ambas son idénticas en
   respuesta para que el cliente no pueda distinguirlas.

4. ¿Por qué decodificar un JWT no permite confiar en él?

   Porque decodificar solo lee el payload; no verifica la firma. Cualquiera
   puede modificar campos del payload (role, sub, exp) y volver a codificarlo
   en base64. La confianza viene de la verificación de la firma con la clave
   secreta del servidor (`jwtVerify` de jose): solo si la firma es válida se
   puede confiar en el contenido. Decodificar sin verificar es un vector de
   ataque.

5. ¿Por qué el `agent` sigue sujeto a la máquina de estados?

   Porque la máquina de estados no es un control de permisos, sino una regla de
   integridad de datos. Nadie, por muy privilegiado que sea, debería poder mover
   una solicitud de `open` a `closed` directamente; eso saltaría `in_progress`
   y `resolved`, rompiendo la historia de atención. El agent tiene más
   operaciones que el requester (prioridad y estado), pero no puede saltar
   estados: `open→resolved` o `open→closed` siempre darán `409`.

6. ¿Qué intentó romper el validador y qué limitación conserva esta solución?

   El validador simula exactamente los 14 ataques del `threat-cases.md`:
   inyección de campos controlados, IDOR, tokens manipulados/vencidos, bodies
   mixtos, enumeración de cuentas y transiciones ilegales. Todo eso quedó
   bloqueado. La limitación que conservamos es la deJWTs sin revocación: el
   token vive 1 hora y no hay refresh. Si un token se compromete, solo queda
   esperar que venza. En producción se necesitaría un servidor de refresh tokens
   o una lista de revocación, pero eso no es parte de esta sesión.