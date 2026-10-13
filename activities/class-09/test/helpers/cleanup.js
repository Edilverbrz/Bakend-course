// Helper de cleanup. Elimina SOLO las filas que creó esta ejecución de tests,
// por sus ids registrados, en orden de dependencia: historial -> peticiones -> usuarios.
// Nunca un DELETE amplio, nunca TRUNCATE — el seed y los datos del estudiante
// deben sobrevivir a cada ejecución de pruebas.
import { pool } from '../../src/database/pool.js';
import { createdUserIds, createdRequestIds } from './test-data.js';

export async function cleanupCreatedData() {
  if (createdRequestIds.length) {
    await pool.query(
      'DELETE FROM request_history WHERE request_id = ANY($1::bigint[])',
      [createdRequestIds]
    );
    await pool.query(
      'DELETE FROM requests WHERE id = ANY($1::bigint[])',
      [createdRequestIds]
    );
    createdRequestIds.length = 0;
  }
  if (createdUserIds.length) {
    await pool.query(
      'DELETE FROM request_history WHERE changed_by = ANY($1::uuid[])',
      [createdUserIds]
    );
    await pool.query(
      'DELETE FROM users WHERE id = ANY($1::uuid[])',
      [createdUserIds]
    );
    createdUserIds.length = 0;
  }
}

export async function closePool() {
  await pool.end();
}
