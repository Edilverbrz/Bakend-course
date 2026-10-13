// Capa HTTP del módulo de requests: extrae la ruta, la query, el cuerpo y el
// actor autenticado, invoca la operación y responde. No contiene SQL ni reglas
// del dominio — y, desde la clase 7, tampoco try/catch: Express 5 reenvía la
// promesa rechazada del handler al middleware central de errores, que es quien
// se encarga de traducir errores a respuestas.
//
// El parámetro :id se valida AQUÍ, en el borde HTTP, antes de que se ejecute
// cualquier query: un id inválido es una violación del contrato, no un error de
// base de datos.

import express from 'express';
import {
  listRequests,
  getRequest,
  createRequest,
  patchRequest,
  getHistory,
  claimRequest
} from './requests.service.js';
import { parseIdParam } from '../../http/parse-id.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { status, priority } = req.query;
  res.status(200).json(await listRequests(req.auth, { status, priority }));
});

router.get('/:id', async (req, res) => {
  const id = parseIdParam(req.params.id);
  res.status(200).json(await getRequest(req.auth, id));
});

router.get('/:id/history', async (req, res) => {
  const id = parseIdParam(req.params.id);
  res.status(200).json(await getHistory(req.auth, id));
});

router.post('/', async (req, res) => {
  res.status(201).json(await createRequest(req.auth, req.body));
});

// FEATURE-801: an action with a name. No body needed — the agent's
// identity travels in the token, never in the payload.
router.post('/:id/claim', async (req, res) => {
  const id = parseIdParam(req.params.id);
  res.status(200).json(await claimRequest(req.auth, id, req.body));
});

router.patch('/:id', async (req, res) => {
  const id = parseIdParam(req.params.id);
  res.status(200).json(await patchRequest(req.auth, id, req.body));
});

export default router;
