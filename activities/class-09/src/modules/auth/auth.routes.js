// Capa HTTP del módulo de auth: extrae el cuerpo, invoca el servicio y
// responde. Sin SQL, sin criptografía, sin detalles internos del token — y sin
// try/catch: los errores fluyen al middleware central de errores.
import express from 'express';
import { register, login, getCurrentUser } from './auth.service.js';
import { authenticate } from '../../middleware/authenticate.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  res.status(201).json(await register(req.body));
});

router.post('/login', async (req, res) => {
  res.status(200).json(await login(req.body));
});

// /auth/me está protegido: responde "¿quién cree el servidor que soy?".
router.get('/me', authenticate, async (req, res) => {
  res.status(200).json(await getCurrentUser(req.auth));
});

export default router;
