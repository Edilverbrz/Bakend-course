# Autoevaluación asistida por IA — checkpoint 1-7



> Este reporte es un insumo de la evaluación del curso: el docente lo
> revisa junto con tu evidencia y puede verificarlo oralmente. Si no
> estás de acuerdo con algo, cuestiónalo con argumentos en la
> metacognición.

## Metadata de mi ejecución

* Modelo utilizado: [COMPLETAR]
* Fecha: [COMPLETAR]
* Commit evaluado: [COMPLETAR]
* ¿Necesité el prompt de reparación?: [no / sí, una vez / MODEL_FORMAT_FAILURE]

## BLOQUE 1 — RESULT_CODE

ITSU-PROGRESS|V=1.0|R=BACKEND-01-07-R1|STATUS=PARTIAL|C01=3-3-X-1|C02=3-3-X-1|C03=3-2-X-1|C04=3-3-X-1|C05=3-3-2-1|C06=3-3-3-2|C07=3-3-1-2|ACTION=VERIFY

## BLOQUE 2 — JSON

```json
[PEGAR EL JSON COMPLETO]
```
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "protocolVersion": "ITSU-CHECKPOINT-01-07-1.0",
  "rubricVersion": "BACKEND-01-07-R1",
  "status": "PARTIAL",
  "action": "VERIFY",
  "studentId": "edilverbrizon.itsu@gamil.com",
  "modelReportedByStudent": "No especificado",
  "classes": [
    {
      "classId": "01",
      "title": "Fundamentos de backend",
      "levels": {
        "knowledge": 3,
        "practice": 3,
        "verification": "X",
        "explanation": 1
      },
      "confidence": "medium",
      "evidence": [
        {
          "artifact": "activities/class-01/README.md",
          "reference": "Líneas 1-25"
        },
        {
          "artifact": "activities/class-01/broken-servers/reporte/soluciones.md",
          "reference": "Muestra de reportes de fallos corregidos"
        }
      ],
      "strength": "Estructura clara de servidor HTTP nativo con endpoints de salud e información declarados.",
      "gap": "Cuestionario diagnóstico sin responder ([COMPLETAR]) y falta de salida de validación automatizada.",
      "nextAction": "Responder las preguntas del cuestionario con tus propias palabras y verificar la ejecución del servidor."
    },
    {
      "classId": "02",
      "title": "HTTP y contratos",
      "levels": {
        "knowledge": 3,
        "practice": 3,
        "verification": "X",
        "explanation": 1
      },
      "confidence": "medium",
      "evidence": [
        {
          "artifact": "activities/class-02/request-api-full-template/docs/http-contract.md",
          "reference": "Definición del recurso maintenance request y endpoints"
        }
      ],
      "strength": "Documentación explícita del contrato HTTP con definición clara de campos y estados iniciales.",
      "gap": "Ausencia de respuestas en el cuestionario final e inexistencia de registros de validación en consola.",
      "nextAction": "Completar la pregunta conceptual del cuestionario para la clase 02 y ejecutar casos de prueba de contrato."
    },
    {
      "classId": "03",
      "title": "Recursos, estado y reglas",
      "levels": {
        "knowledge": 3,
        "practice": 2,
        "verification": "X",
        "explanation": 1
      },
      "confidence": "medium",
      "evidence": [
        {
          "artifact": "activities/class-03/request-api-v3-starter/docs/resource-model.md",
          "reference": "Esquema del recurso y mapa de transiciones"
        },
        {
          "artifact": "activities/class-03/request-api-v3-starter/src/routes/requests.routes.js.txt",
          "reference": "Archivo guardado con extensión .txt"
        }
      ],
      "strength": "Modelo de recursos y mapa de transiciones bien estructurado con reglas de negocio claras.",
      "gap": "El archivo de rutas figura con extensión .txt en lugar de .js, y la pregunta del cuestionario no fue completada.",
      "nextAction": "Renombrar y asegurar el archivo de rutas como .js válido y argumentar las transiciones de estado en el cuestionario."
    },
    {
      "classId": "04",
      "title": "PostgreSQL y persistencia",
      "levels": {
        "knowledge": 3,
        "practice": 3,
        "verification": "X",
        "explanation": 1
      },
      "confidence": "medium",
      "evidence": [
        {
          "artifact": "activities/class-05/database/migrations/001_create_requests.sql",
          "reference": "Archivos SQL de migración"
        },
        {
          "artifact": "activities/class-06/scripts/seed.js",
          "reference": "Script de poblamiento de base de datos"
        }
      ],
      "strength": "Diseño relacional consistente con archivos de migración estructurados y scripts de datos iniciales.",
      "gap": "Sin respuestas en la pregunta sobre transacciones/migraciones del cuestionario ni evidencia aislada de ejecución SQL.",
      "nextAction": "Explicar la diferencia entre migración, seed y transacción en el cuestionario diagnóstico."
    },
    {
      "classId": "05",
      "title": "Autenticación y autorización",
      "levels": {
        "knowledge": 3,
        "practice": 3,
        "verification": 2,
        "explanation": 1
      },
      "confidence": "high",
      "evidence": [
        {
          "artifact": "activities/class-05/activities/class-05/auth-contract.md",
          "reference": "Contrato de autenticación POST /auth/register y GET /auth/me"
        },
        {
          "artifact": "activities/class-05/activities/class-05/validation-evidence.md",
          "reference": "Texto guardado de validación de etapas 5/5 y 3/3"
        }
      ],
      "strength": "Matriz de acceso, contratos de autenticación y casos de amenaza bien documentados e implementados.",
      "gap": "Pregunta conceptual sobre autenticación vs autorización omitida en la sección del cuestionario.",
      "nextAction": "Redactar en el cuestionario la distinción técnica entre autenticación, autorización y verificación de firma JWT."
    },
    {
      "classId": "06",
      "title": "Onboarding y pruebas",
      "levels": {
        "knowledge": 3,
        "practice": 3,
        "verification": 3,
        "explanation": 2
      },
      "confidence": "high",
      "evidence": [
        {
          "artifact": "activities/class-06/activities/class-06/work-log.md",
          "reference": "Bitácora de flujo de solicitud y corrección de error 404 en colecciones vacías"
        },
        {
          "artifact": "activities/class-06/activities/class-06/validation-evidence.txt",
          "reference": "Salida de test runner: 13 pruebas pasadas con 0 fallos"
        }
      ],
      "strength": "Suite de 13 pruebas automatizadas ejecutadas con éxito y bitácora de trabajo detallada que explica correcciones de código.",
      "gap": "No se completó la pregunta específica del cuestionario sobre estructuración de pruebas AAA y prevención de regresiones.",
      "nextAction": "Tomar un test de la suite de la clase 06 y detallar sus etapas de preparación, acción y aserción en el cuestionario."
    },
    {
      "classId": "07",
      "title": "Diagnóstico y errores",
      "levels": {
        "knowledge": 3,
        "practice": 3,
        "verification": 1,
        "explanation": 2
      },
      "confidence": "medium",
      "evidence": [
        {
          "artifact": "activities/class-07/activities/class-07/incident-report.md",
          "reference": "Análisis y reproducción del incidente 701 (Invalid request id)"
        },
        {
          "artifact": "activities/class-07/activities/class-07/validation-evidence.txt",
          "reference": "Plantilla del validador guardada sin los resultados reales de ejecución"
        }
      ],
      "strength": "Investigación y reporte estructurado de incidentes con diferenciación clara de comportamiento esperado vs actual.",
      "gap": "El archivo validation-evidence.txt contiene la plantilla base sin pegar el log real de 'npm run validate:class-07'.",
      "nextAction": "Ejecutar la validación final de la clase 07 y reemplazar el texto plantilla con el log completo de salida."
    }
  ],
  "progressPattern": {
    "label": "uneven",
    "explanation": "Existe un desarrollo sólido de código, arquitectura y documentación técnica entre las clases 01 a 07, respaldado por pruebas verdes en la clase 06. Sin embargo, el cuestionario diagnóstico no fue respondido ([COMPLETAR]) y la evidencia de ejecución final en la clase 07 quedó en estado de plantilla."
  },
  "priorityConceptGaps": [
    "Falta de articulación propia de los conceptos teóricos en el cuestionario diagnóstico del paquete.",
    "Omisión del reporte de ejecución real del validador automatizado para la Clase 07.",
    "Presencia de archivo con extensión errónea (requests.routes.js.txt en clase 03) que requiere verificación de importación."
  ],
  "studentNextSteps": [
    "Completar cada una de las 7 preguntas del Cuestionario Diagnóstico (remplazando [COMPLETAR] por explicaciones propias de 3 a 6 líneas).",
    "Ejecutar `npm run validate:class-07` en el entorno y pegar el resultado completo en `activities/class-07/activities/class-07/validation-evidence.txt`.",
    "Verificar que la ruta `requests.routes.js` en la clase 03 tenga la extensión adecuada `.js` y sea importada correctamente."
  ],
  "teacherFeedback": {
    "supportPriority": "medium",
    "focusClassIds": ["03", "07"],
    "topicsToReinforce": [
      "Verificación de firmas JWT frente a la decodificación en cliente/servidor.",
      "Manejo de rutas y nomenclatura de archivos en Node.js.",
      "Diferenciación entre salud (health) y disponibilidad (readiness) en diagnóstico de servidores."
    ],
    "oralVerificationRecommended": true,
    "oralQuestions": [
      "¿Por qué no es suficiente con decodificar el payload de un token JWT en el backend y qué paso de seguridad adicional realiza la librería al verificarlo?",
      "En el incidente INC-701 de la clase 07, ¿cuál fue la causa raíz identificada para que `/requests/not-a-number` devolviera un error 500 y cómo se corrigió a 400?",
      "¿Qué diferencia existe en las respuestas que debe dar un endpoint cuando se busca una colección filtrada sin resultados versus un ID individual que no existe?"
    ],
    "integrityReview": "recommended",
    "integritySignals": [
      "TEST_OUTPUT_MISSING",
      "EXPLANATION_NOT_GROUNDED"
    ],
    "reviewReason": "El cuestionario diagnóstico obligatorio se entregó completamente con la etiqueta [COMPLETAR], impidiendo evaluar la apropiación conceptual directa. Adicionalmente, la evidencia de validación de la clase 07 contiene el texto plantilla sin la salida de ejecución real.",
    "teacherDigest": "Implementaciones prácticas y contratos muy completos hasta C07 con suite C06 en verde. Sin embargo, se requiere verificación oral por la falta de respuestas en el cuestionario diagnóstico y la ausencia del log de validación final en la clase 07."
  }
}

## BLOQUE 3 — Reporte del estudiante

Panorama general
Has realizado un trabajo práctico y de diseño técnico sumamente completo a lo largo de los contenidos de las Clases 01 a 07. La estructura de tus repositorios demuestra una clara comprensión de la organización modular con Express, diseño de contratos HTTP, definición de esquemas de bases de datos relacionales en PostgreSQL y construcción de middleware para autenticación y autorización con JWT.

Fortalezas demostradas
Diseño de contratos y seguridad: Documentación precisa y exhaustiva en los archivos auth-contract.md y http-contract.md, aplicando restricción estricta de atributos (allowlist) y normalización de entradas.

Calidad en pruebas integrales: La suite de pruebas automatizadas en la Clase 06 muestra un desempeño impecable con 13 pruebas superadas exitosamente (13 pass, 0 fail).

Análisis de incidentes: Gran capacidad diagnóstica en la Clase 07, articulando la reproducción técnica y la separación de hechos vs. hipótesis en incident-report.md.

Temas que necesitan refuerzo
Consolidación teórica explícita: Debes asegurar la redacción con tus propias palabras de los conceptos clave (diferencia entre autenticación/autorización, ciclo de vida de peticiones HTTP y gestión de transacciones).

Verificación de evidencia de ejecución: Asegurar que los logs resultantes de los validadores se guarden adecuadamente antes de hacer el cierre de las actividades.

Evolución entre clases
Se observa una progresión positiva desde el servidor HTTP nativo inicial (Clase 01) hasta una arquitectura profesional dividida en módulos con persistenia SQL, validación de políticas de acceso (Clase 05/06) y manejo centralizado de errores (Clase 07).

Tres prioridades inmediatas
Responde con tus palabras las 7 preguntas del cuestionario diagnóstico al final del archivo de evidencia.

Ejecutar el script npm run validate:class-07 y guardar la salida completa en el archivo activities/class-07/activities/class-07/validation-evidence.txt.

Revisar la carpeta de la Clase 03 para confirmar que los archivos de rutas tengan la extensión .js correcta.

Preguntas para comprobar comprensión
Clase 05: ¿Por qué un servidor nunca debe confiar en los datos contenidos dentro de un JWT sin antes verificar su firma con la clave secreta?

Clase 06: ¿Por qué una búsqueda por filtros en un recurso de colección que no encuentra coincidencias debe responder un status 200 OK con [] y no un 404 Not Found?

Clase 07: ¿Cuál es la diferencia operativa entre un probe de health (salud básica) y uno de readiness (listo para recibir tráfico) en una aplicación backend?

Evidencia faltante
Respuestas del cuestionario diagnóstico (se encuentran en estado [COMPLETAR]).

Log real de ejecución del validador de la Clase 07 en validation-evidence.txt.

## BLOQUE 4 — Feedback docente

Temas con mayor riesgo conceptual
Diferencia entre autenticación, autorización y firma: Riesgo de asumir que decodificar la información de un token implica que este es válido, sin comprender el rol de la clave secreta en la firma simétrica.

Semántica REST de colecciones vs. recursos individuales: Confusión común entre el retorno de colecciones vacías (200 OK + []) y la inexistencia de un recurso por ID (404 Not Found).

Evidencia contradictoria o insuficiente
Cuestionario omitido: El bloque del cuestionario diagnóstico en el archivo de evidencia contiene las marcas [COMPLETAR] en las 7 preguntas, lo cual impide evaluar el nivel de apropiación teórica (dimensión E).

Log de validación no adjuntado: En la Clase 07, validation-evidence.txt contiene únicamente las instrucciones del taller y no la salida del proceso de validación.

Artefacto inusual en Clase 03: Se identificó la presencia de src/routes/requests.routes.js.txt, lo que sugiere un posible renombrado pendiente o archivo de respaldo.

Clases que conviene reforzar
Clase 03: Revisar extensiones de archivos y mapa de transiciones de estado.

Clase 07: Confirmar la corrida completa de las pruebas de diagnóstico y recolección de métricas/logs.

Verificación oral recomendada
Se recomienda realizar una breve validación oral enfocada en el flujo de autenticación/autorización y la resolución de incidentes de código.

Preguntas priorizadas y respuesta mínima esperada
Pregunta: ¿Por qué no se debe responder 404 cuando una búsqueda filtrada en un endpoint de colección devuelve cero resultados?

Respuesta esperada: La colección filtrada existe como recurso; al no haber coincidencias, la representación correcta es una lista vacía [] con código HTTP 200 OK. El 404 se reserva para cuando la ruta o el recurso individual no existen.

Pregunta: Si un usuario envía un JWT modificado en su payload, ¿en qué parte de la canalización (pipeline) de Express falla la petición y por qué?

Respuesta esperada: Falla en el middleware de autenticación al momento de llamar a la verificación de firma con la clave secreta (JWT_SECRET), respondiendo 401 Unauthorized antes de llegar a los controladores de rutas.

Pregunta: ¿Cuál es la causa del error 500 al consultar /requests/not-a-number y cómo debe manejarse correctamente?

Respuesta esperada: El identificador no pudo castearse a un tipo numérico/UUID válido en la consulta SQL, lanzando una excepción no capturada en la base de datos. Se soluciona validando la entrada en la capa de la ruta/middleware devolviendo 400 Bad Request (INVALID_REQUEST_ID).

---

## Mi lectura del reporte (metacognición — esto SÍ lo escribes tú)

* ¿Estoy de acuerdo con el reporte?

  [si]

* ¿Qué criterio considero incorrecto?

  [Ninguna]

* ¿Qué evidencia adicional aportaría?

  Añadiría la salida real del validador de la Clase 07 (`npm run validate:class-07`

* ¿Qué recomendación voy a seguir?

  Voy a cerrar los vacíos teóricos del cuestionario con respuestas propias en cada clase, ejecutar y guardar la evidencia final del validador de la Clase 07, y revisar la estructura de archivos de la Clase 03 para asegurar que no quede ningún artefacto con extensión incorrecta ni rutas rotas. Así terminaré con un cierre más sólido y respaldado por comprobación real.
