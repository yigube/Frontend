import { Platform } from 'react-native';

const DB_NAME = 'asistencia_local.db';
const TABLE_QUEUE = 'asistencia_queue';
const TABLE_META = 'app_meta';

let dbPromise = null;
const memoryQueue = [];

const isWeb = Platform.OS === 'web';

const nowIso = () => new Date().toISOString();

const normalizePayload = (payload) => {
  const estado = String(payload?.estado || 'presente').toLowerCase();
  return {
    qr: String(payload?.qr || ''),
    cursoId: Number(payload?.cursoId || 0),
    fecha: String(payload?.fecha || ''),
    estado,
    presente: payload?.presente === true || estado === 'presente' || estado === 'tarde',
    tarde: payload?.tarde === true || estado === 'tarde',
    afuera: payload?.afuera === true || estado === 'afuera',
    ausente: payload?.ausente === true || estado === 'ausente'
  };
};

async function getDb() {
  if (isWeb) return null;
  if (dbPromise) return dbPromise;
  dbPromise = (async () => {
    const SQLite = await import('expo-sqlite');
    const db = await SQLite.openDatabaseAsync(DB_NAME);
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS ${TABLE_QUEUE} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        qr TEXT NOT NULL,
        curso_id INTEGER NOT NULL,
        fecha TEXT NOT NULL,
        estado TEXT NOT NULL,
        presente INTEGER NOT NULL DEFAULT 1,
        tarde INTEGER NOT NULL DEFAULT 0,
        afuera INTEGER NOT NULL DEFAULT 0,
        ausente INTEGER NOT NULL DEFAULT 0,
        attempts INTEGER NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'pending',
        last_error TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS ${TABLE_META} (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);
    return db;
  })();
  return dbPromise;
}

export async function queueInit() {
  await getDb();
}

export async function enqueueAsistencia(payload) {
  const p = normalizePayload(payload);
  if (!p.qr || !p.cursoId || !p.fecha) {
    throw new Error('Payload de asistencia invalido para cola local');
  }

  if (isWeb) {
    const id = memoryQueue.length + 1;
    memoryQueue.push({
      id,
      ...p,
      attempts: 0,
      status: 'pending',
      last_error: null,
      created_at: nowIso(),
      updated_at: nowIso()
    });
    return { id };
  }

  const db = await getDb();
  const ts = nowIso();
  const result = await db.runAsync(
    `INSERT INTO ${TABLE_QUEUE}
      (qr, curso_id, fecha, estado, presente, tarde, afuera, ausente, attempts, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 'pending', ?, ?)`,
    [
      p.qr,
      p.cursoId,
      p.fecha,
      p.estado,
      p.presente ? 1 : 0,
      p.tarde ? 1 : 0,
      p.afuera ? 1 : 0,
      p.ausente ? 1 : 0,
      ts,
      ts
    ]
  );
  return { id: result.lastInsertRowId };
}

export async function getPendingAsistencias(limit = 100) {
  if (isWeb) {
    return memoryQueue
      .filter((item) => item.status === 'pending')
      .slice(0, limit);
  }

  const db = await getDb();
  return db.getAllAsync(
    `SELECT *
     FROM ${TABLE_QUEUE}
     WHERE status = 'pending'
     ORDER BY id ASC
     LIMIT ?`,
    [limit]
  );
}

export async function markAsistenciaSynced(id) {
  if (isWeb) {
    const idx = memoryQueue.findIndex((x) => Number(x.id) === Number(id));
    if (idx >= 0) memoryQueue.splice(idx, 1);
    return;
  }

  const db = await getDb();
  await db.runAsync(`DELETE FROM ${TABLE_QUEUE} WHERE id = ?`, [id]);
}

export async function markAsistenciaFailed(id, message) {
  if (isWeb) {
    const item = memoryQueue.find((x) => Number(x.id) === Number(id));
    if (item) {
      item.attempts = Number(item.attempts || 0) + 1;
      item.last_error = message || null;
      item.updated_at = nowIso();
    }
    return;
  }

  const db = await getDb();
  await db.runAsync(
    `UPDATE ${TABLE_QUEUE}
     SET attempts = attempts + 1,
         last_error = ?,
         updated_at = ?
     WHERE id = ?`,
    [String(message || ''), nowIso(), id]
  );
}

export async function getPendingAsistenciasCount() {
  if (isWeb) {
    return memoryQueue.filter((item) => item.status === 'pending').length;
  }

  const db = await getDb();
  const row = await db.getFirstAsync(
    `SELECT COUNT(*) AS total FROM ${TABLE_QUEUE} WHERE status = 'pending'`
  );
  return Number(row?.total || 0);
}
