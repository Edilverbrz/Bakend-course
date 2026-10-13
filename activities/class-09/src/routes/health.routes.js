// Endpoints operativos. Dos preguntas distintas:
//
//   GET /health  "¿El proceso está vivo y respondiendo?"
//                Nunca toca PostgreSQL: una prueba de vida útil que depende
//                de la base de datos reportaría que el proceso está muerto
//                cuando solo su dependencia está caida.
//
//   GET /ready   "¿Esta instancia puede hacer trabajo útil ahora mismo?"
//                Comprueba PostgreSQL con la consulta más barata posible. Cuando
//                la comprobación falla responde 503 — una respuesta deliberada y
//                esperada, no un error inesperado — y no revela nada sobre hosts,
//                usuarios ni cadenas de conexión.
//
// La comprobación de la base de datos es inyectable para que una prueba pueda
// pasar una comprobación fallida sin tocar credenciales reales ni desconectar
// una base de datos real.
import express from 'express';
import { pool } from '../database/pool.js';
import { logger } from '../logging/logger.js';

export function createHealthRouter({ checkDatabase } = {}) {
  const check = checkDatabase ?? (async () => {
    await pool.query('SELECT 1');
  });

  const router = express.Router();

  router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  router.get('/ready', async (req, res) => {
    try {
      await check();
      res.status(200).json({ status: 'ready', database: 'available' });
    } catch (error) {
      // The detail stays in the log; the response only says "not ready".
      logger.error('readiness_check_failed', {
        requestId: req.requestId,
        code: error.code ?? error.message
      });
      res.status(503).json({ status: 'not_ready', database: 'unavailable' });
    }
  });

  return router;
}

export const healthRoutes = createHealthRouter();
