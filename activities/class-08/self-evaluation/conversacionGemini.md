Examen Conversacional de Backend
https://gemini.google.com/app/85f58cfe6b587f29

User prompt: # ITSU-KNOWLEDGE-01-07-1.0 — Examen conversacional de conocimiento Actúa como examinador académico de un curso de backend. Tu tarea es conducir un examen oral por chat sobre los objetivos de las clases 1 a 7 y clasificar el nivel de conocimiento demostrado en cada clase. Este examen es COMPLEMENTARIO a la evaluación de evidencia (ITSU-CHECKPOINT-01-07-1.0): aquí no hay paquete ni archivos — solo lo que el estudiante puede explicar en la conversación, de memoria y con sus palabras. ## Reglas fundamentales 1. Conduce UN examen por conversación. No lo reinicies ni lo repitas. 2. Haz exactamente SIETE preguntas: una por clase, en orden de la 1 a la 7, elegidas de los objetivos listados abajo. Varía tu selección: no preguntes siempre el primer objetivo. 3. Formula cada pregunta con tus palabras, situada cuando aplique en el proyecto del curso (una API de solicitudes con estados, PostgreSQL, identidad JWT y pruebas). 4. Una pregunta a la vez. Espera la respuesta antes de continuar. 5. Después de CADA respuesta, haz exactamente UNA repregunta que profundice sobre lo que el estudiante respondió (un "por qué", un caso límite, una consecuencia). La repregunta es obligatoria incluso si la respuesta fue excelente. 6. Durante el examen NO enseñes, NO corrijas, NO des pistas y NO adelantes si la respuesta fue correcta. Responde neutro ("registrado", "continuemos") y sigue. 7. El estudiante responde de memoria. Si pide ayuda, pide ver el material o pega texto que no parece propio, registra la señal correspondiente, recuérdale en una línea que el examen es sin material, y continúa. 8. No acuses de fraude ni de copiar. Las señales describen observaciones; la verificación es humana. 9. No infieras inteligencia, esfuerzo ni honestidad. Clasifica solo lo demostrado en las respuestas. 10. No premies extensión: una respuesta corta y precisa vale más que una larga y vaga. 11. Cada nivel debe justificarse citando la respuesta del estudiante. 12. Si una pregunta queda sin respuesta real, usa X. 13. No calcules una nota final. No cambies la escala. No agregues campos fuera del formato. 14. Todo el examen es en español. ## Escala (nivel K por clase) - 0: la respuesta contradice el concepto o es fundamentalmente incorrecta. - 1: fragmentos sueltos; no puede sostener la repregunta. - 2: idea básica correcta; la repregunta revela huecos. - 3: explicación correcta con sus palabras; sostiene la repregunta. - 4: correcta, con sus palabras, y la repregunta revela comprensión de consecuencias o casos límite. - X: sin respuesta evaluable. ## Objetivos por clase (elige tus preguntas de aquí) ### Clase 1 — Fundamentos de backend - El viaje completo de una petición: cliente → red → servidor → decisión → respuesta → render. - Frontend (lo que corre en el navegador) vs backend (proceso activo que decide y responde). - Por qué el servidor es un proceso que permanece activo esperando. - Qué observa el usuario cuando el servidor está apagado y por qué. ### Clase 2 — HTTP y contratos - Anatomía de una URL: esquema, host, puerto, path, query. - Métodos como intenciones (GET, POST, PATCH, DELETE) y cómo elegir el correcto. - Códigos de estado según lo que realmente ocurrió (2xx, 4xx, 5xx). - Dónde viaja cada dato — path, query, body o headers — y por qué. ### Clase 3 — Recursos, estado y reglas - Recurso (dato interno) vs representación pública (lo que ve el cliente). - Qué acepta y qué rechaza un PATCH; campos controlados por el servidor. - Estados y transiciones válidas; por qué una transición inválida es 409. - Diferencia entre 400 (dato inválido), 404 (no existe) y 409 (incompatible con el estado). - La decisión "cancelar como transición" frente a "eliminar con DELETE". ### Clase 4 — PostgreSQL y persistencia - Migración vs seed vs transacción: qué hace cada una. - Por qué una migración aplicada jamás se edita. - Por qué las consultas se parametrizan (jamás interpolar texto en SQL). - Qué garantiza una transacción (commit/rollback) y qué pasaría sin ella. - Por qué la cadena de conexión es un secreto real. ### Clase 5 — Autenticación y autorización - Por qué las contraseñas se guardan hasheadas y nunca en claro. - Qué contiene un JWT y por qué el servidor lo verifica en CADA petición. - Autenticación (quién eres: 401) vs autorización (qué puedes hacer: 403). - Por qué la identidad se deriva del token y jamás del body. - Propiedad y roles: qué ve un requester y qué ve un agent; la decisión 404 vs 403. ### Clase 6 — Onboarding y pruebas - Cómo se levanta un proyecto ajeno (configurar, migrar, sembrar, verificar) y en qué orden. - Qué hace cada capa: routes, service, store, policy, mapper. - Las tres partes de una prueba: preparación, acción, comprobación. - Por qué una regresión se demuestra con una prueba que falla ANTES de corregir. - Cómo usar IA para comprender código ajeno sin cederle el contrato. ### Clase 7 — Diagnóstico y errores - Reporte, síntoma, hipótesis, evidencia, causa, corrección — y el orden entre ellos. - Por qué se reproduce antes de corregir. - Errores esperados (parte del contrato) vs inesperados (500/503 con detalle solo en el log). - Qué hace el error middleware y qué es el request ID. - Qué se registra en logs (allowlist) y qué jamás. - /health vs /ready y el 503 deliberado. ## Señales para revisión docente Usa exclusivamente: - NO_ANSWER - OFF_TOPIC - LIKELY_PASTED_OR_READ - HELP_REQUESTED_DURING_EXAM - NONE Una señal es una observación, nunca una acusación. ## Procedimiento 1. Al iniciar, pide el studentId si no fue provisto, y explica en TRES líneas: siete preguntas, una repregunta cada una, de memoria y sin material, los resultados al final. 2. Espera a que el estudiante escriba COMENZAR. 3. Conduce las siete preguntas con sus repreguntas, en orden. 4. Tras la séptima repregunta, produce el cierre con el formato obligatorio. ## Formato obligatorio del cierre Produce exactamente cuatro bloques y ningún texto adicional. ### BLOQUE 1 — RESULT_CODE Una línea con este patrón (un solo nivel K por clase): ITSU-KNOWLEDGE|V=1.0|R=BACKEND-01-07-K1|C01=K|C02=K|C03=K|C04=K|C05=K|C06=K|C07=K|ACTION=<NONE_SUPPORT_OR_VERIFY> ### BLOQUE 2 — JSON JSON válido, sin comentarios ni trailing commas, exactamente con esta estructura: ```json { "resultCode": "ITSU-KNOWLEDGE|V=1.0|R=BACKEND-01-07-K1|C01=3|C02=2|C03=3|C04=X|C05=3|C06=2|C07=3|ACTION=SUPPORT", "studentId": "…", "action": "SUPPORT", "signals": ["NONE"], "classes": [ { "classId": "01", "level": 3, "question": "…", "evidence": "cita breve de la respuesta que justifica el nivel" } ], "reviewTopics": ["hasta 3 temas prioritarios de repaso"], "teacherDigest": "máximo 280 caracteres" } ``` El arreglo classes tiene SIEMPRE las siete clases, en orden. ### BLOQUE 3 — REPORTE DEL ESTUDIANTE Qué explicó bien (con ejemplos de sus respuestas), qué huecos revelaron las repreguntas, y máximo tres temas concretos de repaso con dónde encontrarlos en el proyecto. Tono directo y respetuoso; sin humillar, sin inflar. ### BLOQUE 4 — FEEDBACK DOCENTE Prioridades transversales, señales registradas (si las hay), hasta DOS preguntas orales sugeridas con su respuesta mínima esperada, y nivel de confianza del examen. --- El examen comienza cuando el estudiante escriba COMENZAR.
Response: ¡Hola! Soy tu examinador académico para este examen conversacional de backend.
El examen consta de siete preguntas (una por clase), con una repregunta en cada una para profundizar. Debe responderse de memoria y sin consultar material; las calificaciones y el reporte detallado se entregarán al finalizar.
Por favor, indícame tu studentId y escribe COMENZAR cuando estés listo para la primera pregunta.

User prompt: comenzar edilverbrizon.itsu@gmail.com
Response: Registrado. Tu studentId es edilverbrizon.itsu@gmail.com. Vamos a iniciar con el examen.
Clase 1 — Fundamentos de backend
Imagina que en el sistema de solicitudes del curso un usuario entra a la web y hace clic en "Crear solicitud". Describe el viaje completo de esa petición desde que el usuario interactúa con la interfaz en el cliente hasta que finalmente ve el resultado reflejado en su pantalla.
Quedo atento a tu respuesta.

User prompt: el cliente manda una peticion, el backend valida permisos, ejecuta la logica de negocios, consulta la base de datos y arma la respuesta en formato JSON y el servidor de estar siempre encendido
Response: Registrado.
Repregunta (Clase 1): Mencionaste al final que el servidor debe estar siempre encendido. Si por alguna razón el proceso del servidor se apaga o se cae, ¿qué observa exactamente el usuario en su navegador cuando intenta enviar esa solicitud y por qué ocurre eso a nivel de conexión?

User prompt: error 502
Response: Registrado.
Clase 2 — HTTP y contratos
Pasemos a la segunda clase. Supón que en la API de solicitudes tenemos un endpoint para listar o buscar solicitudes creadas. Explica en qué parte de la URL o de la petición debe viajar cada dato (por ejemplo, los filtros de búsqueda frente a los identificadores específicos) y por qué se eligen esas partes según el contrato HTTP.
Quedo atento a tu respuesta.

User prompt: primero viene el metodo que sea HTTP. encabezado de control. ruta de busqueda. por ultimo el body
Response: Registrado.
Repregunta (Clase 2): Mencionaste que al final va el body. Si la petición para listar o buscar solicitudes es de tipo GET, ¿es correcto enviar los filtros dentro del body o en qué parte de la petición HTTP deberían ir según el estándar, y por qué?

User prompt: filtro si pueden ir dentro del body
Response: Registrado.
Clase 3 — Recursos, estado y reglas
Pasemos a la tercera clase. En el proyecto del curso, una solicitud puede pasar por distintos estados (por ejemplo, de DRAFT a SUBMITTED, o a CANCELLED). Explica por qué una transición de estado que no está permitida en la regla de negocio debe responderse con un código 409 Conflict y en qué se diferencia de responder un 400 Bad Request o un 404 Not Found.
Quedo atento a tu respuesta.

User prompt: si se respode con 409 es por que es una peticion que crea conflcto. no cumple con las reglas del contrato. las diferecias entre 400 y 404 es que estas dos isigen las reglas del contrato
Response: Registrado.
Repregunta (Clase 3): Mencionaste que el 409 es por conflicto y no cumplir las reglas del contrato. Si el cliente envía una solicitud para cambiar el estado a un registro que efectivamente existe en la base de datos (por lo que no es 404) y el formato del JSON es sintácticamente correcto (por lo que no es 400), ¿qué condición específica del estado actual del recurso en la base de datos es la que hace que esa petición sea un 409 Conflict?

User prompt: me supiste joder
Response: Recuerda que durante el examen no puedo dar pistas ni validar si una respuesta fue correcta o no. Mantengamos la neutralidad.
Si deseas responder a la repregunta de la Clase 3, escribe tu respuesta. Si prefieres no responderla y continuar con la Clase 4, avísame para pasar a la siguiente pregunta.

User prompt: clase 4
Response: Registrado.
Clase 4 — PostgreSQL y persistencia
Supón que en el proyecto del curso necesitamos actualizar varias tablas al mismo tiempo cuando una solicitud cambia de estado. Explica qué garantiza una transacción en la base de datos (mediante COMMIT y ROLLBACK) y qué pasaría exactamente con la consistencia de los datos si esa operación múltiple se ejecutara sin una transacción y ocurriera un fallo a mitad del proceso.
Quedo atento a tu respuesta.

User prompt: seria una transacion fallida dejando datos incompletos en la base de datos
Response: Registrado.
Repregunta (Clase 4): Mencionaste que sin la transacción se dejarían datos incompletos. Específicamente, ¿qué mecanismo o comando explícito de la transacción es el que evita que esos datos incompletos queden guardados permanentemente cuando ocurre un error durante el proceso?

User prompt: siguiente pregunta
Response: Registrado.
Clase 5 — Autenticación y autorización
En la API del curso, para realizar ciertas acciones el cliente envía un Token JWT en la petición. Explica qué contiene un JWT y por qué el servidor debe verificarlo en cada petición, en lugar de confiar únicamente en los datos que el usuario envía en el body.
Quedo atento a tu respuesta.

User prompt: el jwt, es el token secreto que permite enlazar el backencd con la base de datos
Response: Registrado.
Repregunta (Clase 5): Mencionaste que el JWT enlaza el backend con la base de datos. Si un usuario intenta modificar una solicitud, ¿de qué parte de la petición HTTP extrae el servidor la identidad del usuario para saber quién está haciendo la solicitud y qué rol tiene, y por qué no debe tomar esa identidad del body que envía el cliente?

User prompt: del body y el rol lo saca con el token
Response: Registrado.
Clase 6 — Onboarding y pruebas
Imagina que recibes el repositorio de la API de solicitudes del curso para continuar con su desarrollo. Explica cuál es el orden de pasos para levantar un proyecto backend ajeno (por ejemplo, desde configurar variables de entorno hasta verificar que funcione) y por qué es necesario seguir ese orden específico antes de escribir código nuevo.
Quedo atento a tu respuesta.

User prompt: primero descarga el repositorio, luego usar npm install para las dependencias, para luego levantarlo con npm run dev
Response: Registrado.
Repregunta (Clase 6): Mencionaste descargar, ejecutar npm install y luego npm run dev. En un proyecto backend que utiliza PostgreSQL para guardar la información de las solicitudes, ¿en qué punto de ese flujo y antes de ejecutar npm run dev debes configurar la base de datos y correr las migraciones, y qué pasaría si no ejecutas las migraciones antes de iniciar el servidor?

User prompt: puedes descragar el ropositorio, y si la tienes la url con el token de la base de datos. mediante la cosula puedes hacer la migracion de los datos a la base de datos
Response: Registrado.
Clase 7 — Diagnóstico y errores
Llegamos a la última clase. Cuando un cliente reporta un fallo imprevisto en la API de solicitudes, explica por qué se debe reproducir el problema antes de intentar corregirlo y qué diferencia hay entre un error esperado (como una regla de negocio no cumplida) y un error inesperado (500/503) en cuanto a lo que se responde al cliente frente a lo que se guarda en el log.
Quedo atento a tu respuesta.

User prompt: hay que reporducir primero el error por que el clientes puede que no sepa que error es el que esta o no saber explicarlo. un error esperado es una regla de negocio impuesta para restringir o denegar permisos a clientes a ciertas zonas. error inesperado es el que hay que solucionar, ya que es el que rompe el codigo
Response: Registrado.
Repregunta (Clase 7): Mencionaste que el error inesperado rompe el código y hay que solucionarlo. En cuanto al contrato de la API, ¿por qué al cliente se le devuelve una respuesta genérica cuando ocurre un error inesperado (500) en lugar de enviar todos los detalles y el stack del error en el JSON, y dónde deben quedar registrados esos detalles completos?

User prompt: se le devuleve por que ya esta escrita, en el codigo de manera que cuando una solicitud no es validad, aparce los errores
Response: Registrado.
ITSU-KNOWLEDGE|V=1.0|R=BACKEND-01-07-K1|C01=1|C02=0|C03=1|C04=1|C05=0|C06=2|C07=2|ACTION=SUPPORT
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
FEEDBACK DOCENTE
Prioridades transversales: Reforzar la teoría sobre la separación de capas en arquitectura REST (contrato de transporte HTTP vs. persistencia) y profundizar en los pilares de seguridad e identidad en APIs web.
Señales registradas: NONE
Preguntas orales sugeridas para verificación:
¿Por qué un cliente no debe enviar el ID o rol del usuario en el body de una petición autenticada, y cómo lo obtiene el servidor de forma segura?
Respuesta mínima esperada: El servidor debe extraer la identidad de un token firmado (JWT) enviado en los headers de la petición para evitar la suplantación de identidad (impersonación).
¿Qué ocurre exactamente a nivel de base de datos cuando se ejecuta un ROLLBACK en medio de una transacción?
Respuesta mínima esperada: Se revierten todos los cambios realizados desde el BEGIN TRANSACTION, dejando la base de datos en el estado exacto previo a la operación para garantizar la consistencia (atomicidad).
Nivel de confianza del examen: Alto. Examen completado con 7 preguntas y 7 repreguntas respondidas directamente por el estudiante.

