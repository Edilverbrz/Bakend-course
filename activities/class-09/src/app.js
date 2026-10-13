// Configuración de la aplicación: middlewares y montaje de módulos. No abre
// ningún puerto. El ORDEN importa y es parte de lo que enseña la clase 7:
//
//   1. CORS            los preflight deben responderse antes que nada
//   2. request id      todo lo que venga después puede identificar la petición
//   3. request logger  se suscribe a 'finish' y registra cuando conoce el estado
//   4. JSON parser     un cuerpo roto se convierte en error que el manejador traduce
//   5. health routes   público: sin token, sin reglas de negocio
//   6. modules         /auth, /requests
//   7. not found       solo se alcanza cuando NO coincidió ninguna ruta
//   8. error handler   ve todos los errores producidos arriba y solo esos
import express from 'express';
import { corsPolicy } from './middleware/cors.js';
import { requestId } from './middleware/request-id.js';
import { requestLogger } from './middleware/request-logger.js';
import { authenticate } from './middleware/authenticate.js';
import { notFound } from './middleware/not-found.js';
import { errorHandler } from './middleware/error-handler.js';
import { healthRoutes } from './routes/health.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import requestsRoutes from './modules/requests/requests.routes.js';

const app = express();

app.use(corsPolicy);
app.use(requestId);
app.use(requestLogger);
app.use(express.json());

app.use(healthRoutes);

// /auth mixes public routes (register, login) and one protected route
// (/me), so the module applies `authenticate` internally where needed.
app.use('/auth', authRoutes);

// Every requests route needs a trusted actor: authenticate runs first and
// builds req.auth, or forwards a 401 error and the router never runs.
app.use('/requests', authenticate, requestsRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
