// Logger estructurado mínimo: una línea JSON por evento, escrita en stdout
// (info) o stderr (error). Sin archivos, sin servicios externos: el objetivo
// de esta clase es decidir QUÉ registrar, no aprender una librería de logging.
//
// Cada línea lleva marca de tiempo, nivel y nombre del evento; el llamador
// añade solo los campos que ha elegido deliberadamente. Nada aquí lee la
// petición, por lo que nada puede filtrar una cabecera o un cuerpo por error.

function line(level, event, fields = {}) {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    event,
    ...fields
  });
}

export const logger = {
  info(event, fields) {
    console.log(line('info', event, fields));
  },
  error(event, fields) {
    console.error(line('error', event, fields));
  }
};
