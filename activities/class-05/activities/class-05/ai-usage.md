# AI usage

Este archivo solo puede tener contenido DESPUÉS del checkpoint
`class-05-access-design` (matriz + contrato + amenazas completos).

## My design before AI

Antes del checkpoint resolví la estación 0 (infraestructura: `.env`, migraciones,
seed) y el diseño de acceso (matriz de roles, contrato de errores y casos
adversariales), apoyándome en el validador oficial del taller como
especificación ejecutable.

## What I asked

- Implementar las estaciones 2 a 8 del taller en el backend existente
  (autenticación, propiedad, autorización, máquina de estados) sin romper el
  contrato que verifica el validador.
- Integrar los dos zips descargables de la página (`request-api-v5-starter.zip`
  y `request-frontend-starter.zip`) para respetar la estructura pedida por el
  profesor.

## What the AI proposed

- La separación en capas ya existente en el repo (store → mapper → policy → service
  → routes) y la ubicación de cada nueva pieza: token en `auth`, middleware de
  autenticación, política de solicitudes como funciones puras.
- Que `req.auth` (usuario + rol, desde el token verificado) sea la ÚNICA fuente
  de identidad y que `createdBy`/`changedBy` nunca lleguen del body.
- Representar recursos ajenos con el MISMO `404` que los inexistentes para no
  filtrar existencia (IDOR).
- Misma respuesta única para todo fallo de login (`INVALID_CREDENTIALS`) y un
  solo código para cualquier token inválido.
- Respetar el helper `password.js` del starter en lugar de reescribir el hash.

## What I accepted

- El flujo actor-primero en el service (autenticación y autorización antes que
  cualquier consulta).
- La máquina de estados aplicada también al `agent` (solo prioridad y estado,
  jamás contenido; sin saltos de estado).
- El filtro de propiedad en SQL (`WHERE created_by = $1`), lo que excluye de
  forma natural las solicitudes heredadas para los requester.
- Mantener el DTO público sin datos sensibles (`mapUserRow` descarta el hash).

## What I rejected

- Unificar el error de login en "credenciales inválidas" como breve sustituto de
  respuestas distintas; el validador exige comparar byte a byte, así que la
  indistinción es obligada (no un extra).
- Desarrollar la entrega 05A/05B del frontend: esta sesión cubrió el backend; el
  starter quedó integrado, instalado y con variables de entorno, listo para
  retomarlo en la siguiente sesión.
- Renombrar/reescribir la infraestructura compartida del repo (pool, transaction,
  respond-error): se reutilizó sin cambios salvo el uso previsto.

## Security mistakes I detected

Pasos del validador que simulaban exactamente los ataques del `threat-cases.md`:

1. Registro con `role` inyectado → estaba devolviendo lo que el body decía;
   el allowlist estricto lo convirtió en `400 SERVER_CONTROLLED_FIELD`.
2. `createdBy` / `status` / `changedBy` enviados en POST/PATCH → mismo
   tratamiento de campo controlado, cero confianza en el body.
3. IDOR (usuario pide la solicitud ajena) → `404` idéntico al inexistente.
4. Token con payload manipulado/firma falsa/vencido → `401 INVALID_TOKEN`
   uniforme sin revelar el motivo.
5. Cambio de prioridad por requester → `403 FORBIDDEN`.
6. Transiciones ilegales y estados terminales → `409` con el código correcto.

## How I verified the implementation

- `npm run db:check`: conexión y versionado de migraciones.
- `npm run validate:class-05 -- --stage <estación>`: las 8 estaciones en verde.
- `npm run validate:class-05` (boss battle): **12/12 dos veces consecutivas**
  (debe pasar dos veces seguidas).
- Pruebas manuales con `curl` sobre el server real: registro, login, `/me`,
  creación de solicitudes, aislamiento requester, permisos de agent y semántica
  401/403/404/409 verificadas de extremo a extremo.

## What I still do not understand

- La infraestructura de la maestría no incluye servidor de refresh tokens ni
  revocación: el ciclo de vida es `exp` a 1 hora. Entiendo el WHY del taller
  (simplicidad + validador byte a byte), pero a revisar en producción.
- Cómo el validador detecta el estado "terminal": probablemente compara con la
  misma máquina de estados del taller; me gustaría ver su fuente completa, no
  solo el resultado booleano, para confirmar el trazo real.