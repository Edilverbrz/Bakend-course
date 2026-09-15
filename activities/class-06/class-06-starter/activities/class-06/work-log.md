# Bitácora de trabajo de la clase 06

## Entorno

¿Qué configuré?
Configuré el entorno del proyecto con Node, dependencias, variables de entorno y la base de datos. También ejecuté el doctor del taller para validar el entorno y luego aplicué las migraciones y el seed del proyecto.

¿Qué comando confirmó que funcionó?
`npm run class-06:doctor` confirmó que el entorno estaba listo. Luego validé la base con `npm run db:migrate` y `npm run db:seed`, y finalmente ejecuté `npm test` para comprobar que la suite estaba en verde.

## Flujo de la solicitud

¿Dónde entra la solicitud?
La solicitud entra en la aplicación desde `src/app.js`, donde se montan los routers y se aplica la autenticación antes de llegar a las rutas de requests.

¿Dónde se comprueba la autenticación?
La autenticación se valida en `src/middleware/authenticate.js`. Este middleware revisa el header `Authorization: Bearer <token>` y verifica el JWT antes de continuar.

¿Dónde se comprueba la autorización?
La autorización se evalúa en `src/modules/requests/request.policy.js`. Ahí se definen reglas como: los agentes pueden ver todo, los requesters solo ven sus propias solicitudes y solo pueden editar sus own request mientras estén abiertos.

¿Dónde se accede a PostgreSQL?
La base de datos se accede desde `src/modules/requests/requests.store.js`, donde se ejecutan las consultas SQL con el pool de PostgreSQL.

## Error corregido

¿Qué estaba pasando?
Cuando un filtro válido de colección no tenía coincidencias, el backend devolvía `404` en lugar de `200` con `[]`. Eso estaba rompiendo el contrato de colecciones: un conjunto vacío no es un recurso inexistente.

¿Qué debería ocurrir?
`GET /requests?status=closed` con un usuario que no tiene solicitudes cerradas debería devolver `200 OK` y `[]`.

¿Qué archivo modifiqué?
La corrección se hace en `src/modules/requests/requests.service.js`, donde `listRequests` estaba lanzando `REQUEST_NOT_FOUND` cuando la colección estaba vacía.

¿Qué prueba protege este comportamiento?
La validación del taller en `scripts/validate-class-06.js` y la especificación del ticket `tickets/BUG-106.md` protegen este comportamiento.

## Funcionalidad implementada

¿Qué hace GET /requests/:id/history?
Devuelve el historial completo de cambios de una solicitud específica, mostrando eventos como cambios de estado o de prioridad.

¿Quién puede usarlo?
Un requester puede leer el historial solo de sus propias solicitudes. Un agent puede leer el historial de cualquier solicitud. Si el request no existe o no pertenece a ese usuario, se responde con `404` para mantener el contrato existente.

¿Cómo se ordena el resultado?
Se ordena cronológicamente desde el evento más antiguo al más reciente, usando `ORDER BY created_at, id` en la consulta del historial.

## Prueba explicada

Elige una prueba.
Elijo la prueba “Owner can read history”.

¿Qué datos prepara?
Prepara un escenario con una solicitud creada por un usuario y varios eventos de historial asociados a ese request.

¿Qué acción realiza?
Ejecuta `GET /requests/:id/history` con el token del propietario.

¿Qué comprueba?
Comprueba que la respuesta sea `200`, que el cuerpo sea un array y que contenga al menos 3 eventos.

¿Qué regla protege?
Protege la regla de que el dueño de una solicitud puede consultar su historial y que el historial se registra correctamente.

## Asistencia de IA

¿Qué ayudó a entender la IA?
La IA me ayudó a comprender la separación entre autenticación y autorización, y a visualizar cómo se registra el historial en `request_history`.

¿Qué código ayudó a producir?
Ayudó a producir la lógica del endpoint de historial, la política de permisos y la ordenación del historial en `src/modules/requests/requests.service.js` y `src/modules/requests/requests.store.js`.

¿Qué verifiqué yo mismo?
Verifiqué que la ruta estuviera detrás del middleware de autenticación, que la política usara `canViewRequest` y que el historial estuviera ordenado por fecha. También comprobé que un request ajeno o inexistente devolviera `404`.

¿Qué sugerencia fue incorrecta o incompleta?
Una sugerencia incorrecta habría sido permitir que cualquier requester viera el historial de cualquier solicitud. También habría sido devolver `200` para un request ajeno. La implementación correcta respeta la política y el contrato de privacidad.

## Duda restante

¿Qué parte todavía no entiendo?
Me gustaría profundizar más en cómo se manejan los eventos del historial en transacciones y cómo se estandariza la serialización de cada tipo de evento (`fromStatus`, `toStatus`, `fromPriority`, `toPriority`) para evitar errores futuros.
