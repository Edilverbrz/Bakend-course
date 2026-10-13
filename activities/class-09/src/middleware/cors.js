// Política CORS para la entrega del frontend (05A). Un único origen explícito
// desde el entorno — nunca "*": esta API responde solo a navegadores que
// conocemos, con cabeceras de credenciales que hemos elegido.
import 'dotenv/config';

const ALLOWED_ORIGIN = process.env.FRONTEND_ORIGIN;

export function corsPolicy(req, res, next) {
  const origin = req.headers.origin;

  if (ALLOWED_ORIGIN && origin === ALLOWED_ORIGIN) {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  }

  // Preflight requests end here: they ask for permission, not for data.
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
}
