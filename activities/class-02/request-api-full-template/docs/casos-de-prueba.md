# Casos de Prueba — Request API Full

> Registro de pruebas manuales ejecutadas con `curl` contra la API corriendo en `http://localhost:3000`.
> Cada caso muestra: comando, resultado esperado, resultado observado, y veredicto (PASS/FAIL).

---

## Configuración previa

```bash
cd request-api-full-template
npm install
node src/server.js
# Server listening on http://localhost:3000
```

Archivos JSON de prueba creados para evitar problemas de escaping en PowerShell:
- `test-valid.json`: body válido completo
- `test-no-title.json`: body sin campo `title`
- `test-empty-title.json`: body con `title` solo espacios

---

## Caso 1 — Listar todas las solicitudes (GET /requests)

**Comando**
```bash
curl -i http://localhost:3000/requests
```

**Resultado esperado**
- Status: `200 OK`
- Content-Type: `application/json; charset=utf-8`
- Body: Array JSON con 3 solicitudes iniciales

**Resultado observado**
```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[{"id":1,"title":"Projector does not turn on","description":"The projector in room 204 shows no image during class.","status":"open","priority":"high"},{"id":2,"title":"Broken chair in the lab","description":"One chair in the computer lab has a loose back rest.","status":"in-progress","priority":"medium"},{"id":3,"title":"Wi-Fi drops in the library","description":"The connection drops every few minutes on the second floor.","status":"open","priority":"low"}]
```

**Veredicto**: ✅ PASS

---

## Caso 2 — Consultar solicitud existente (GET /requests/1)

**Comando**
```bash
curl -i http://localhost:3000/requests/1
```

**Resultado esperado**
- Status: `200 OK`
- Body: Objeto JSON de la solicitud con id=1

**Resultado observado**
```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"id":1,"title":"Projector does not turn on","description":"The projector in room 204 shows no image during class.","status":"open","priority":"high"}
```

**Veredicto**: ✅ PASS

---

## Caso 3 — Consultar solicitud inexistente (GET /requests/999)

**Comando**
```bash
curl -i http://localhost:3000/requests/999
```

**Resultado esperado**
- Status: `404 Not Found`
- Body: `{ "error": "Request not found" }`

**Resultado observado**
```
HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8

{"error":"Request not found"}
```

**Veredicto**: ✅ PASS

---

## Caso 4 — Crear solicitud válida (POST /requests)

**Comando**
```bash
curl -i -X POST http://localhost:3000/requests \
  -H "Content-Type: application/json" \
  -d @test-valid.json
```

**Contenido de `test-valid.json`**
```json
{"title":"Leaking faucet","description":"The faucet in the third floor bathroom leaks.","priority":"medium"}
```

**Resultado esperado**
- Status: `201 Created`
- Body: Objeto JSON de la solicitud creada con `id` auto-generado (4), `status: "open"`

**Resultado observado**
```
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{"id":4,"title":"Leaking faucet","description":"The faucet in the third floor bathroom leaks.","status":"open","priority":"medium"}
```

**Veredicto**: ✅ PASS

---

## Caso 5 — Crear solicitud sin title (POST /requests)

**Comando**
```bash
curl -i -X POST http://localhost:3000/requests \
  -H "Content-Type: application/json" \
  -d @test-no-title.json
```

**Contenido de `test-no-title.json`**
```json
{"description":"No title here"}
```

**Resultado esperado**
- Status: `400 Bad Request`
- Body: `{ "error": "Title is required" }`
- No debe modificarse el array de solicitudes

**Resultado observado**
```
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8

{"error":"Title is required"}
```

**Veredicto**: ✅ PASS

---

## Caso 6 — Crear solicitud con title vacío (POST /requests)

**Comando**
```bash
curl -i -X POST http://localhost:3000/requests \
  -H "Content-Type: application/json" \
  -d @test-empty-title.json
```

**Contenido de `test-empty-title.json`**
```json
{"title":"   ","description":"Only spaces"}
```

**Resultado esperado**
- Status: `400 Bad Request`
- Body: `{ "error": "Title is required" }`
- Validación con `.trim()` rechaza strings solo espacios

**Resultado observado**
```
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8

{"error":"Title is required"}
```

**Veredicto**: ✅ PASS

---

## Caso 7 — Verificar persistencia tras creación (GET /requests)

**Comando**
```bash
curl -i http://localhost:3000/requests
```

**Resultado esperado**
- Status: `200 OK`
- Body: Array con 4 elementos (3 iniciales + 1 creada en Caso 4)

**Resultado observado**
```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[{"id":1,"title":"Projector does not turn on","description":"The projector in room 204 shows no image during class.","status":"open","priority":"high"},{"id":2,"title":"Broken chair in the lab","description":"One chair in the computer lab has a loose back rest.","status":"in-progress","priority":"medium"},{"id":3,"title":"Wi-Fi drops in the library","description":"The connection drops every few minutes on the second floor.","status":"open","priority":"low"},{"id":4,"title":"Leaking faucet","description":"The faucet in the third floor bathroom leaks.","status":"open","priority":"medium"}]
```

**Veredicto**: ✅ PASS

---

## Casos adicionales de borde (exploratorios)

### Caso 8 — POST sin description ni priority (solo title)

**Comando**
```bash
curl -i -X POST http://localhost:3000/requests \
  -H "Content-Type: application/json" \
  -d '{"title":"Minimal request"}'
```

**Resultado observado**
```
HTTP/1.1 201 Created
{"id":5,"title":"Minimal request","description":"","status":"open","priority":"medium"}
```

**Veredicto**: ✅ PASS (defaults funcionan: description="", priority="medium")

---

### Caso 9 — POST con priority personalizado

**Comando**
```bash
curl -i -X POST http://localhost:3000/requests \
  -H "Content-Type: application/json" \
  -d '{"title":"Urgent issue","priority":"high"}'
```

**Resultado observado**
```
HTTP/1.1 201 Created
{"id":6,"title":"Urgent issue","description":"","status":"open","priority":"high"}
```

**Veredicto**: ✅ PASS (priority respeta valor enviado)

---

### Caso 10 — GET /requests/0 (ID inválido)

**Comando**
```bash
curl -i http://localhost:3000/requests/0
```

**Resultado observado**
```
HTTP/1.1 404 Not Found
{"error":"Request not found"}
```

**Veredicto**: ✅ PASS (Number("0") = 0, no existe en array)

---

### Caso 11 — GET /requests/abc (ID no numérico)

**Comando**
```bash
curl -i http://localhost:3000/requests/abc
```

**Resultado observado**
```
HTTP/1.1 404 Not Found
{"error":"Request not found"}
```

**Veredicto**: ✅ PASS (Number("abc") = NaN, no coincide con ningún id)

---

### Caso 12 — Ruta inexistente (GET /unknown)

**Comando**
```bash
curl -i http://localhost:3000/unknown
```

**Resultado observado**
```
HTTP/1.1 404 Not Found
{"error":"Cannot GET /unknown"}
```

**Veredicto**: ✅ PASS (Express maneja rutas no declaradas con 404 automático)

---

## Resumen de resultados

| # | Caso | Expected | Observed | Veredicto |
|---|------|----------|----------|-----------|
| 1 | GET /requests | 200, array 3 items | 200, array 3 items | ✅ PASS |
| 2 | GET /requests/1 | 200, object id=1 | 200, object id=1 | ✅ PASS |
| 3 | GET /requests/999 | 404, error | 404, error | ✅ PASS |
| 4 | POST válido | 201, created object | 201, created object | ✅ PASS |
| 5 | POST sin title | 400, error | 400, error | ✅ PASS |
| 6 | POST title vacío | 400, error | 400, error | ✅ PASS |
| 7 | GET /requests post-create | 200, array 4 items | 200, array 4 items | ✅ PASS |
| 8 | POST solo title | 201, defaults aplicados | 201, defaults aplicados | ✅ PASS |
| 9 | POST priority custom | 201, priority="high" | 201, priority="high" | ✅ PASS |
| 10 | GET /requests/0 | 404 | 404 | ✅ PASS |
| 11 | GET /requests/abc | 404 | 404 | ✅ PASS |
| 12 | GET /unknown | 404 | 404 | ✅ PASS |

**Total: 12/12 PASS**

---

## Notas

- Todos los códigos de estado coinciden con el contrato HTTP definido en `docs/http-contract.md`.
- El formato de error es consistente: `{ "error": "mensaje" }` en todos los casos de error (400, 404).
- Los defaults (`description=""`, `priority="medium"`, `status="open"`) se aplican correctamente.
- La validación de `title` con `.trim()` rechaza correctamente strings vacíos o solo espacios.
- Los datos persisten en memoria mientras el servidor corre (verificado en Caso 7).
- No se implementaron endpoints fuera de alcance (PUT, PATCH, DELETE, paginación, auth, BD).