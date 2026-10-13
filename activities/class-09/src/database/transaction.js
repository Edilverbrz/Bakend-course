// Ejecuta una unidad de trabajo dentro de una única transacción. Cada query
// dentro de la unidad DEBE usar el cliente pasado a `work`: pool.query() puede
// obtener otra conexión y escapar silenciosamente de la transacción.
import { pool } from "./pool.js";

export async function withTransaction(work) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await work(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    // Reverting is not hiding: the caller still needs to answer the request.
    throw error;
  } finally {
    // Always return the loan — releasing gives the connection back to the
    // pool; it does not close the database.
    client.release();
  }
}
