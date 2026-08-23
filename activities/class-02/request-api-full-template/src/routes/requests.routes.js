import express from 'express';
import { requests, generateId } from '../data/requests.js';

const router = express.Router();

// This router is mounted at /requests in app.js, so '/' here means GET /requests.

router.get('/', (req, res) => {
  // TODO: return the full list of requests with status 200.
  // The body must be a JSON array, even when the list is empty.
  res.status(200).json(requests);
});

router.get('/:id', (req, res) => {
  // TODO: find the request whose id matches req.params.id (it arrives as a string).
  // Found     -> 200 with the request object as JSON.
  // Not found -> 404 with a JSON body such as { "error": "Request not found" }.
  const id = Number(req.params.id);
  const request = requests.find((item) => item.id === id);

  if (!request) {
    return res.status(404).json({ error: 'Request not found' });
  }

  res.status(200).json(request);
});

router.post('/', (req, res) => {
  // TODO: create a request from req.body.
  // Missing or blank title -> 400 with { "error": "Title is required" } and no data change.
  // Valid input            -> 201 with the created request as JSON.
  // Use generateId() for the id, set status to 'open', and push the object into requests.
  const title = req.body?.title?.trim();

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newRequest = {
    id: generateId(),
    title,
    description: req.body?.description ?? '',
    status: 'open',
    priority: req.body?.priority ?? 'medium',
  };

  requests.push(newRequest);

  res.status(201).json(newRequest);
});

export default router;