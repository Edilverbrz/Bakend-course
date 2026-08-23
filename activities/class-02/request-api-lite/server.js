import express from "express";

const PORT = 3000;
const app = express();
app.use(express.json());

// Maintenance requests are kept in memory, so they reset every time the server restarts.
// CORRECCIÓN: Se agrega almacenamiento en memoria para persistencia de datos entre requests
const requests = [
  {
    id: 1,
    title: "Projector does not turn on",
    description: "The projector in room 204 shows no image during class.",
    status: "open",
    priority: "high",
  },
  {
    id: 2,
    title: "Broken chair in the lab",
    description: "One chair in the computer lab has a loose back rest.",
    status: "in-progress",
    priority: "medium",
  },
  {
    id: 3,
    title: "Wi-Fi drops in the library",
    description: "The connection drops every few minutes on the second floor.",
    status: "open",
    priority: "low",
  },
];

let nextId = 4;

// CORRECCIÓN: Se agrega endpoint GET /getRequests para listar todas las solicitudes
app.get("/getRequests", (req, res) => {
  res.json(requests);
});

app.get("/requests/:id", (req, res) => {
  const id = Number(req.params.id);
  const request = requests.find((item) => item.id === id);

  // CORRECCIÓN: Se agrega manejo de error 404 cuando no se encuentra la solicitud
  if (!request) {
    return res.status(404).json({ error: "Request not found" });
  }

  res.json(request);
});

app.post("/requests", (req, res) => {
  // CORRECCIÓN: Se valida que title sea requerido
  if (!req.body || !req.body.title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const newRequest = {
    id: nextId,
    title: req.body.title,
    description: req.body.description || "",
    status: "open",
    priority: req.body.priority || "medium",
  };

  nextId = nextId + 1;
  requests.push(newRequest);

  // CORRECCIÓN: Se usa status 201 (Created) en lugar de 200 para creación exitosa
  res.status(201).json(newRequest);
});

const server = app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});