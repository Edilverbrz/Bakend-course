# Registro de decisiones — Clase 05

## 1. Fuente de identidad: el token, no el body

¿Dónde se guarda la identidad del actor? En el token JWT verificado. El middleware
`authenticate` extrae `userId` y `role` del payload y los deposita en `req.auth`.
El body nunca establece identidad: `createdBy` y `changedBy` salen de `req.auth`,
y si el cliente los envía, el servicio responde `400 SERVER_CONTROLLED_FIELD`.

**Por qué:** confiar en el body para la identidad sería como cerrar la puerta
pero dejar la llave debajo del tapete.

## 2. Lo ajeno responde 404 (no 403)

Cuando Alice consulta `GET /requests/5` (una solicitud de Bob), la respuesta es
`404 REQUEST_NOT_FOUND`, idéntica a la de un ID que no existe. La decisión:
**no revelar existencia**.

**Alternativa descartada:** 403 FORBIDDEN (confirma que el recurso existe,
facilitando enumeración).

**Por qué 404 aquí:** en un sistema de solicitudes interno, ocultar qué solicitudes
existe es preferible. En otro dominio (por ejemplo, un repositorio público) un
403 podría ser más adecuado. La decisión queda documentada en `access-matrix.md`.

## 3. Solicitudes heredadas: visibles solo para agent

Las solicitudes creadas en la clase 3-4 no tienen `created_by` (NULL). Al ser
`created_by` nullable (decisión de la migración 004 por compatibilidad), el filtro
`created_by = $1` en el store de un requester nunca coincide con NULL, por lo que
un requester no las ve. Un agente, al listar todo (sin filtro), las ve.

**Por qué no borrarlas:** preservan el historial del sistema. El validador
inserta una fila heredada por SQL directo para probar este caso.

## 4. Bodies mixtos: todo o nada

Si el body contiene `title` (permitido para el dueño con solicitud abierta)
junto con `priority` (solo para agent), la operación se rechaza con `403 FORBIDDEN`
y **ningún campo se modifica**. No hay actualizaciones parciales.

**Por qué:** aplicar lo permitido y rechazar lo prohibido genera
comportamientos sorpresa. El agente de soporte no debería ver que el título
cambió cuando pidió cambiar la prioridad.

## 5. Error genérico en login: sin pistas

`POST /auth/login` con email inexistente y password incorrecta producen
exactamente la misma respuesta: `401 INVALID_CREDENTIALS` byte a byte idéntico.
Un atacante que intente enumerar emails no puede distinguir "no existe" de
"contraseña incorrecta".

**Alternativa:** respuestas distintas para cada caso (más cómodo, pero un censo
gratuito de cuentas).

## 6. JWT: firmado, no cifrado

El payload del JWT es legible por cualquiera. Por eso no lleva datos sensibles
(como el email o el hash de la password). El campo `sub` (id del usuario) y
`role` son las únicas piezas de identidad. La firma (`HS256`) garantiza que
el contenido no fue alterado; verificarla es lo que construye confianza.
