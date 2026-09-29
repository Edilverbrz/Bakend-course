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
ITSU-KNOWLEDGE|V=1.0|R=BACKEND-01-07-K1|C01=1|C02=0|C03=1|C04=1|C05=0|C06=2|C07=2|ACTION=SUPPORT

## BLOQUE 2 — JSON

```json
[PEGAR EL JSON COMPLETO]
```
{
  "resultCode": "ITSU-KNOWLEDGE|V=1.0|R=BACKEND-01-07-K1|C01=1|C02=0|C03=1|C04=1|C05=0|C06=2|C07=2|ACTION=SUPPORT",
  "studentId": "edilverbrizon.itsu@gmail.com",
  "action": "SUPPORT",
  "signals": ["NONE"],
  "classes": [
    {
      "classId": "01",
      "level": 1,
      "question": "Describe el viaje completo de una petición desde el cliente hasta la respuesta.",
      "evidence": "Mencionó validad permisos, ejecuta lógica, consulta DB y arma JSON, pero ante la repregunta afirmó que el servidor apagado da 'error 502'."
    },
    {
      "classId": "02",
      "level": 0,
      "question": "Explica dónde viaja cada dato según el contrato HTTP.",
      "evidence": "Afirmó erróneamente en la repregunta que en las peticiones GET los filtros 'si pueden ir dentro del body'."
    },
    {
      "classId": "03",
      "level": 1,
      "question": "Explica por qué una transición no permitida es 409 Conflict y diferencia de 400 y 404.",
      "evidence": "Mencionó que 409 es por petición que crea conflicto, pero no pudo responder qué condición del estado actual lo provoca ('me supiste joder')."
    },
    {
      "classId": "04",
      "level": 1,
      "question": "Explica qué garantiza una transacción (COMMIT/ROLLBACK) y qué pasa sin ella.",
      "evidence": "Identificó que sin transacción quedan datos incompletos, pero pasó a la siguiente pregunta al indagar sobre el mecanismo explícito (ROLLBACK)."
    },
    {
      "classId": "05",
      "level": 0,
      "question": "Explica qué contiene un JWT y por qué se verifica en cada petición.",
      "evidence": "Contradijo el concepto afirmando que el JWT es un 'token secreto que permite enlazar el backend con la base de datos' y que la identidad se saca del body."
    },
    {
      "classId": "06",
      "level": 2,
      "question": "Explica el orden de pasos para levantar un proyecto backend ajeno.",
      "evidence": "Explicó la secuencia básica (descargar, npm install, npm run dev) e incluyó la noción de migraciones antes de ejecutar, aunque con imprecisiones en el flujo."
    },
    {
      "classId": "07",
      "level": 2,
      "question": "Explica por qué reproducir el error antes de corregir y diferencia error esperado vs inesperado.",
      "evidence": "Explicó bien la necesidad de reproducir porque el cliente no sabe explicarlo y la diferencia entre regla de negocio y error inesperado, aunque la repregunta reveló huecos sobre seguridad y logs."
    }
  ],
  "reviewTopics": [
    "Contrato HTTP y especificación GET (Clase 2)",
    "Concepto y estructura de JWT / Manejo de Identidad (Clase 5)",
    "Ciclo de vida de Base de Datos: Transacciones y Migraciones (Clase 4)"
  ],
  "teacherDigest": "El estudiante demuestra intuición sobre diagnóstico y flujo básico de proyectos, pero presenta inconsistencias teóricas graves en conceptos fundamentales como HTTP GET body, la naturaleza de JWT e identidad, e invalidez de estados en PostgreSQL."
}

## BLOQUE 3 — Reporte del estudiante

REPORTE DEL ESTUDIANTE
Demostraste una noción pragmática en la Clase 7 (Diagnóstico) al explicar la necesidad de reproducir un error antes de intervenir el código debido a que los reportes de usuario suelen ser ambiguos, así como en la Clase 6 (Onboarding) al reconocer el flujo operativo básico para levantar un entorno (npm install, configuración y ejecución).

Sin embargo, las repreguntas y preguntas teóricas revelaron brechas conceptuales críticas en los fundamentos del backend:

HTTP y Contratos (Clase 2): Afirmar que se pueden enviar filtros en el body de un GET viola el estándar HTTP y los contratos REST.

Autenticación e Identidad (Clase 5): Confundiste la función de un JWT con una clave de conexión a la base de datos y mencionaste que la identidad se extrae del body, lo cual representa una vulnerabilidad crítica de seguridad.

Persistencia y Estado (Clases 3 y 4): Faltó precisión sobre la atomicidad en transacciones (ROLLBACK) y la diferencia entre errores sintácticos (400) y de reglas de estado de negocio (409).

Temas prioritarios de repaso:

Estándar HTTP / Métodos y Parámetros: Revisar en la API del proyecto cómo se estructuran los query params para búsquedas y por qué GET no lleva body.

Estructura y Validación de JWT: Revisar la capa de middlewares de autenticación del proyecto para observar cómo se extrae el token del header Authorization y se valida la identidad.

Manejo de Transacciones y Estados: Revisar en los servicios del proyecto la ejecución de bloques de transacción para entender el comportamiento de un rollback ante fallos.

## BLOQUE 4 — Feedback docente

FEEDBACK DOCENTE
Prioridades transversales: Reforzar la teoría sobre la separación de capas en arquitectura REST (contrato de transporte HTTP vs. persistencia) y profundizar en los pilares de seguridad e identidad en APIs web.

Señales registradas: NONE

Preguntas orales sugeridas para verificación:

¿Por qué un cliente no debe enviar el ID o rol del usuario en el body de una petición autenticada, y cómo lo obtiene el servidor de forma segura?

Respuesta mínima esperada: El servidor debe extraer la identidad de un token firmado (JWT) enviado en los headers de la petición para evitar la suplantación de identidad (impersonación).

¿Qué ocurre exactamente a nivel de base de datos cuando se ejecuta un ROLLBACK en medio de una transacción?

Respuesta mínima esperada: Se revierten todos los cambios realizados desde el BEGIN TRANSACTION, dejando la base de datos en el estado exacto previo a la operación para garantizar la consistencia (atomicidad).

Nivel de confianza del examen: Alto. Examen completado con 7 preguntas y 7 repreguntas respondidas directamente por el estudiante.

## Mi lectura del reporte (metacognición — esto SÍ lo escribes tú)

* ¿Estoy de acuerdo con el reporte?

  [si]

* ¿Qué criterio considero incorrecto?

  [Ninguna]

* ¿Qué evidencia adicional aportaría?

  Añadiría la salida real del validador de la Clase 07 `npm run validate:class-07`

* ¿Qué recomendación voy a seguir?

  Voy a cerrar los vacíos teóricos del cuestionario con respuestas propias en cada clase, ejecutar y guardar la evidencia final del validador de la Clase 07, y revisar la estructura de archivos de la Clase 03 para asegurar que no quede ningún artefacto con extensión incorrecta ni rutas rotas. Así terminaré con un cierre más sólido y respaldado por comprobación real.
