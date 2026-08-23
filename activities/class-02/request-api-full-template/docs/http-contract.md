# Contrato HTTP — Request API Full

> **Plantilla para completar.** Escribe este documento **antes** de implementar los
> manejadores. El contrato es la promesa que hace tu API; el código es la manera de cumplirla.
> Si primero escribes el código y después el contrato, estarás documentando lo que salió, no
> lo que decidiste.

## Recurso

Una **solicitud de mantenimiento** (`request`) representa un reporte de incidencia en instalaciones
(por ejemplo: proyector roto, silla dañada, Wi-Fi inestable). Cada solicitud tiene un identificador
único, título, descripción, estado actual y nivel de prioridad.

### Forma del recurso

| Campo         | Tipo   | Obligatorio | Quién lo asigna | Notas |
| ------------- | ------ | ----------- | --------------- | ----- |
| `id`          | number | Sí          | Servidor        | Auto-incremental via `generateId()` |
| `title`       | string | Sí          | Cliente         | No puede estar vacío o ser solo espacios |
| `description` | string | No          | Cliente         | Si no se envía, se guarda como string vacío `""` |
| `status`      | string | Sí          | Servidor        | Siempre `"open"` al crear |
| `priority`    | string | No          | Cliente         | Valores válidos: `"high"`, `"medium"`, `"low"`. Default: `"medium"` |

---

## Endpoint 1 — Listar solicitudes

| Elemento              | Valor |
| --------------------- | ----- |
| Método                | `GET` |
| Ruta                  | `/requests` |
| Entrada               | Ninguna (sin query params, sin body) |
| Respuesta de éxito    | `200 OK` con array JSON de solicitudes (vacío si no hay ninguna) |
| Respuestas de error   | Ninguna prevista para este endpoint |

**Ejemplo de respuesta**

```json
[
  {
    "id": 1,
    "title": "Projector does not turn on",
    "description": "The projector in room 204 shows no image during class.",
    "status": "open",
    "priority": "high"
  },
  {
    "id": 2,
    "title": "Broken chair in the lab",
    "description": "One chair in the computer lab has a loose back rest.",
    "status": "in-progress",
    "priority": "medium"
  }
]
```

---

## Endpoint 2 — Consultar una solicitud

| Elemento              | Valor |
| --------------------- | ----- |
| Método                | `GET` |
| Ruta                  | `/requests/:id` |
| Entrada               | Parámetro de ruta `id` (string, se convierte a number) |
| Respuesta de éxito    | `200 OK` con el objeto solicitud como JSON |
| Respuestas de error   | `404 Not Found` si no existe: `{ "error": "Request not found" }` |

**Ejemplo de respuesta (éxito)**

```json
{
  "id": 1,
  "title": "Projector does not turn on",
  "description": "The projector in room 204 shows no image during class.",
  "status": "open",
  "priority": "high"
}
```

**Ejemplo de respuesta (error)**

```json
{
  "error": "Request not found"
}
```

---

## Endpoint 3 — Crear una solicitud

| Elemento              | Valor |
| --------------------- | ----- |
| Método                | `POST` |
| Ruta                  | `/requests` |
| Entrada               | Body JSON con `title` (obligatorio), `description` (opcional), `priority` (opcional) |
| Respuesta de éxito    | `201 Created` con el objeto solicitud creado como JSON |
| Respuestas de error   | `400 Bad Request` si falta `title` o está vacío: `{ "error": "Title is required" }` |

**Ejemplo de body de la petición**

```json
{
  "title": "Leaking faucet",
  "description": "The faucet in the third floor bathroom leaks.",
  "priority": "medium"
}
```

**Ejemplo de respuesta (éxito)**

```json
{
  "id": 4,
  "title": "Leaking faucet",
  "description": "The faucet in the third floor bathroom leaks.",
  "status": "open",
  "priority": "medium"
}
```

**Ejemplo de respuesta (error de validación)**

```json
{
  "error": "Title is required"
}
```

---

## Reglas transversales

Responde en una línea cada una:

1. ¿Qué `Content-Type` devuelven todas las respuestas?
   - `application/json; charset=utf-8` (añadido automáticamente por `res.json()` de Express)

2. ¿Qué estado corresponde a una ruta que no existe en esta API?
   - `404 Not Found` (manejado por Express automáticamente para rutas no declaradas)

3. ¿Qué forma tiene siempre un cuerpo de error?
   - Objeto JSON con una única propiedad `error` de tipo string: `{ "error": "mensaje descriptivo" }`

4. ¿Qué campos ignora el servidor si el cliente los envía en el body?
   - `id` (se genera en servidor), `status` (siempre `"open"` al crear), cualquier campo adicional no definido en el modelo

---

## Decisiones que tomaste y por qué

- **201 Created en POST**: Es el código semántico correcto para creación exitosa de recurso (RFC 7231), en lugar de 200 OK.
- **404 con body `{ error: ... }`**: Consistencia con el formato de error definido; el 404 solo se usa cuando el recurso no existe, no para errores de validación.
- **Defaults en creación**: `description` → `""`, `priority` → `"medium"`, `status` → `"open"`. Simplifica el cliente y evita `undefined` en la respuesta.
- **Validación de title**: Se rechaza si falta, es `null`, `undefined`, o string vacío/solo espacios. `trim()` + check de longitud.
- **No se permite sobrescribir `id` ni `status`**: Seguridad básica para mantener integridad del recurso.
- **Sin paginación en GET /requests**: Requisito explícito fuera de alcance; el dataset es pequeño (memoria).