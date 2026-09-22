# Informe de incidentes de la clase 07

Completa cada sección MIENTRAS investigas. Separa hechos de
interpretaciones: un "creo que" pertenece a Hipótesis, no a Evidencia.

## Estado inicial

¿Qué comando confirmó el estado inicial?
`npm run class-07:doctor`

## Incidente 701

### Informe

> Un integrador está construyendo enlaces hacia solicitudes y algunos de sus
> enlaces devuelven error 500. Dice que 'a veces funciona y a veces no'.

### Reproducción

[INC-701] Invalid request id
Request:  GET /requests/not-a-number  (as ana)
Expected: 400 INVALID_REQUEST_ID
Actual:   400 INVALID_REQUEST_ID
[INC-701] RESOLVED

### Resultado esperado

`400 Bad Request`

```json
{
	"error": {
		"code": "INVALID_REQUEST_ID",
		"message": "Request id must be a positive integer."
	},
	"requestId": "req_..."
}
```

### Resultado real

`500 Internal Server Error`

```json
{
	"error": {
		"code": "INTERNAL_ERROR",
		"message": "An unexpected error occurred."
	}
}
```

La reproducción oficial informó: `Actual: 500 INTERNAL_ERROR`. El terminal del
servidor mostró el error técnico de PostgreSQL.

### Hipótesis

1. **Más probable:** el identificador se convierte a número sin validar el
	valor completo. Se comprueba revisando dónde se lee `req.params.id` y
	probando también `12abc`, `1.5`, `0` y `-3`.
2. **Posible:** la consulta SQL recibe un valor inválido y PostgreSQL lanza un
	error no controlado. Se comprueba observando la consulta y verificando si la
	base de datos se consulta antes de responder `400`.

### Evidencia

* `npm run incidents:reproduce` reprodujo el incidente: `GET
	/requests/not-a-number` esperaba `400 INVALID_REQUEST_ID` y obtuvo `500
	INTERNAL_ERROR`.
* En `src/modules/requests/requests.routes.js`, la ruta `GET /:id` transforma
	el valor con `Number(req.params.id)` y lo envía a `getRequest` sin validar el
	formato ni que sea positivo.
* `getRequest` llama a `findById(id)`, y `src/modules/requests/requests.store.js`
	usa ese valor en `WHERE id = $1`; el valor inválido puede alcanzar SQL antes
	de producir una respuesta de contrato.
* `src/http/respond-error.js` convierte el error no tipado en `500 INTERNAL_ERROR`
	y oculta los detalles técnicos al cliente.

### Causa confirmada

La ruta convierte `not-a-number` en `NaN` mediante `Number(...)` y no valida el
parámetro antes de llamar al servicio. El valor inválido llega a PostgreSQL y su
error no está tipado como un error de contrato; el manejador lo traduce a un
`500` genérico, aunque el contrato exige rechazarlo antes con `400
INVALID_REQUEST_ID`.

### Corrección

Implementada en `src/modules/requests/requests.routes.js`: se agregó
`parseRequestId`, que valida el valor textual antes de convertirlo y consultar
la base de datos. Solo acepta enteros positivos seguros (`^[1-9]\\d*$`); para
cualquier otro valor lanza `AppError` con código `INVALID_REQUEST_ID`. Los
identificadores válidos siguen llegando al servicio, por lo que se conserva el
`404 REQUEST_NOT_FOUND` cuando la solicitud no existe.

### Prueba de regresión

Se completaron las pruebas de `test/errors.test.js` para comprobar que:

* `GET /requests/not-a-number` devuelve `400 INVALID_REQUEST_ID` y no `500`.
* `12abc`, `1.5`, `0` y `-3` reciben la misma respuesta, sin ejecutar SQL.
* `GET /requests/999999999` continúa devolviendo `404 REQUEST_NOT_FOUND`.

Las tres pruebas pasan después de la validación en la ruta; los cuatro casos de
INC-702 y del manejador central continúan pendientes y permanecen como `todo`.

## Incidente 702

### Informe

### Reproducción

### Resultado esperado

### Resultado real

### Hipótesis

### Evidencia

### Causa confirmada

### Corrección

### Prueba de regresión

## Flujo del error

¿Dónde se crea el error?
¿Cómo llega al middleware de errores?
¿Qué se devuelve al cliente?
¿Qué queda únicamente en el registro del servidor?

## ID de solicitud

¿Cómo demostré que la respuesta y el registro pertenecen a la misma solicitud?

## Asistencia de IA

¿Qué me ayudó a comprender la IA?
¿Qué hipótesis propuso?
¿Cómo la verifiqué?
¿Qué sugerencia estaba incompleta o era incorrecta?

## Duda pendiente

¿Qué parte todavía no comprendo?
