import { Platform } from 'react-native';

const DB_NAME = 'asistencia_local.db';
const TABLE_CURSOS = 'cursos_local';
const TABLE_ESTUDIANTES = 'estudiantes_local';

const isWeb = Platform.OS === 'web';

let dbPromise = null;
const mem = {
  cursoSeq: 1,
  estSeq: 1,
  cursos: [],
  estudiantes: []
};

const normalizeText = (value) => String(value || '').trim();

async function getDb() {
  if (isWeb) return null;
  if (dbPromise) return dbPromise;
  dbPromise = (async () => {
    const SQLite = await import('expo-sqlite');
    const db = await SQLite.openDatabaseAsync(DB_NAME);
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS ${TABLE_CURSOS} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        school_id INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS ${TABLE_ESTUDIANTES} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombres TEXT NOT NULL,
        apellidos TEXT NOT NULL,
        qr TEXT,
        codigo_estudiante TEXT,
        curso_id INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    const first = await db.getFirstAsync(`SELECT id FROM ${TABLE_CURSOS} LIMIT 1`);
    if (!first) {
      const now = new Date().toISOString();
      const c = await db.runAsync(
        `INSERT INTO ${TABLE_CURSOS} (nombre, school_id, created_at, updated_at) VALUES (?, 1, ?, ?)`,
        ['Curso Local', now, now]
      );
      const cursoId = c.lastInsertRowId;
      await db.runAsync(
        `INSERT INTO ${TABLE_ESTUDIANTES} (nombres, apellidos, qr, codigo_estudiante, curso_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['Estudiante', 'Demo', 'QR-LOCAL-1', 'LOC-1', cursoId, now, now]
      );
    }
    return db;
  })();
  return dbPromise;
}

const mapCurso = (row) => ({ id: row.id, nombre: row.nombre, schoolId: row.school_id });
const mapEst = (row) => ({
  id: row.id,
  nombres: row.nombres,
  apellidos: row.apellidos,
  nombre: `${row.nombres || ''} ${row.apellidos || ''}`.trim(),
  qr: row.qr || '',
  codigoEstudiante: row.codigo_estudiante || '',
  cursoId: row.curso_id
});

function ensureMemorySeed() {
  if (mem.cursos.length > 0) return;
  const now = new Date().toISOString();
  const curso = { id: mem.cursoSeq++, nombre: 'Curso Local', school_id: 1, created_at: now, updated_at: now };
  mem.cursos.push(curso);
  mem.estudiantes.push({
    id: mem.estSeq++,
    nombres: 'Estudiante',
    apellidos: 'Demo',
    qr: 'QR-LOCAL-1',
    codigo_estudiante: 'LOC-1',
    curso_id: curso.id,
    created_at: now,
    updated_at: now
  });
}

export async function localListCursos(params = {}) {
  if (isWeb) {
    ensureMemorySeed();
    const q = normalizeText(params?.q).toLowerCase();
    const list = q
      ? mem.cursos.filter((c) => c.nombre.toLowerCase().includes(q))
      : mem.cursos;
    return list.map(mapCurso);
  }

  const db = await getDb();
  const q = normalizeText(params?.q);
  const rows = q
    ? await db.getAllAsync(`SELECT * FROM ${TABLE_CURSOS} WHERE nombre LIKE ? ORDER BY id DESC`, [`%${q}%`])
    : await db.getAllAsync(`SELECT * FROM ${TABLE_CURSOS} ORDER BY id DESC`);
  return rows.map(mapCurso);
}

export async function localCreateCurso(payload) {
  const nombre = normalizeText(payload?.nombre);
  if (!nombre) throw new Error('Nombre requerido');
  const now = new Date().toISOString();

  if (isWeb) {
    ensureMemorySeed();
    const row = { id: mem.cursoSeq++, nombre, school_id: 1, created_at: now, updated_at: now };
    mem.cursos.push(row);
    return mapCurso(row);
  }

  const db = await getDb();
  const r = await db.runAsync(
    `INSERT INTO ${TABLE_CURSOS} (nombre, school_id, created_at, updated_at) VALUES (?, 1, ?, ?)`,
    [nombre, now, now]
  );
  return { id: r.lastInsertRowId, nombre, schoolId: 1 };
}

export async function localUpdateCurso(id, payload) {
  const targetId = Number(id);
  const nombre = normalizeText(payload?.nombre);
  if (!targetId || !nombre) throw new Error('Datos invalidos');
  const now = new Date().toISOString();

  if (isWeb) {
    ensureMemorySeed();
    const idx = mem.cursos.findIndex((c) => Number(c.id) === targetId);
    if (idx < 0) throw new Error('Curso no encontrado');
    mem.cursos[idx] = { ...mem.cursos[idx], nombre, updated_at: now };
    return mapCurso(mem.cursos[idx]);
  }

  const db = await getDb();
  await db.runAsync(`UPDATE ${TABLE_CURSOS} SET nombre = ?, updated_at = ? WHERE id = ?`, [nombre, now, targetId]);
  return { id: targetId, nombre };
}

export async function localDeleteCurso(id) {
  const targetId = Number(id);
  if (!targetId) throw new Error('ID invalido');

  if (isWeb) {
    ensureMemorySeed();
    mem.cursos = mem.cursos.filter((c) => Number(c.id) !== targetId);
    mem.estudiantes = mem.estudiantes.filter((e) => Number(e.curso_id) !== targetId);
    return;
  }

  const db = await getDb();
  await db.runAsync(`DELETE FROM ${TABLE_ESTUDIANTES} WHERE curso_id = ?`, [targetId]);
  await db.runAsync(`DELETE FROM ${TABLE_CURSOS} WHERE id = ?`, [targetId]);
}

export async function localListEstudiantes(params = {}) {
  if (isWeb) {
    ensureMemorySeed();
    const cursoId = Number(params?.cursoId || 0);
    const list = cursoId
      ? mem.estudiantes.filter((e) => Number(e.curso_id) === cursoId)
      : mem.estudiantes;
    return list.map(mapEst);
  }

  const db = await getDb();
  const cursoId = Number(params?.cursoId || 0);
  const rows = cursoId
    ? await db.getAllAsync(`SELECT * FROM ${TABLE_ESTUDIANTES} WHERE curso_id = ? ORDER BY id DESC`, [cursoId])
    : await db.getAllAsync(`SELECT * FROM ${TABLE_ESTUDIANTES} ORDER BY id DESC`);
  return rows.map(mapEst);
}

export async function localCreateEstudiante(payload) {
  const nombres = normalizeText(payload?.nombres);
  const apellidos = normalizeText(payload?.apellidos);
  const qr = normalizeText(payload?.qr);
  const codigoEstudiante = normalizeText(payload?.codigoEstudiante);
  const cursoId = Number(payload?.cursoId || 0);
  if (!nombres || !apellidos || !cursoId) throw new Error('Datos invalidos');
  const now = new Date().toISOString();

  if (isWeb) {
    ensureMemorySeed();
    const row = {
      id: mem.estSeq++,
      nombres,
      apellidos,
      qr,
      codigo_estudiante: codigoEstudiante,
      curso_id: cursoId,
      created_at: now,
      updated_at: now
    };
    mem.estudiantes.push(row);
    return mapEst(row);
  }

  const db = await getDb();
  const r = await db.runAsync(
    `INSERT INTO ${TABLE_ESTUDIANTES} (nombres, apellidos, qr, codigo_estudiante, curso_id, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [nombres, apellidos, qr || null, codigoEstudiante || null, cursoId, now, now]
  );
  return { id: r.lastInsertRowId, nombres, apellidos, qr, codigoEstudiante, cursoId };
}

export async function localCreateEstudiantesLote(payload) {
  const cursoId = Number(payload?.cursoId || 0);
  const estudiantes = Array.isArray(payload?.estudiantes) ? payload.estudiantes : [];
  if (!cursoId || estudiantes.length === 0) throw new Error('Datos invalidos');
  const created = [];
  for (const item of estudiantes) {
    const row = await localCreateEstudiante({ ...item, cursoId });
    created.push(row);
  }
  return { created: created.length, students: created };
}

export async function localUpdateEstudiante(id, payload) {
  const targetId = Number(id);
  if (!targetId) throw new Error('ID invalido');
  const now = new Date().toISOString();
  const patch = {
    nombres: normalizeText(payload?.nombres),
    apellidos: normalizeText(payload?.apellidos),
    qr: normalizeText(payload?.qr),
    codigoEstudiante: normalizeText(payload?.codigoEstudiante),
    cursoId: Number(payload?.cursoId || 0)
  };

  if (isWeb) {
    ensureMemorySeed();
    const idx = mem.estudiantes.findIndex((e) => Number(e.id) === targetId);
    if (idx < 0) throw new Error('Estudiante no encontrado');
    const prev = mem.estudiantes[idx];
    mem.estudiantes[idx] = {
      ...prev,
      nombres: patch.nombres || prev.nombres,
      apellidos: patch.apellidos || prev.apellidos,
      qr: patch.qr || prev.qr,
      codigo_estudiante: patch.codigoEstudiante || prev.codigo_estudiante,
      curso_id: patch.cursoId || prev.curso_id,
      updated_at: now
    };
    return mapEst(mem.estudiantes[idx]);
  }

  const db = await getDb();
  const prev = await db.getFirstAsync(`SELECT * FROM ${TABLE_ESTUDIANTES} WHERE id = ?`, [targetId]);
  if (!prev) throw new Error('Estudiante no encontrado');
  await db.runAsync(
    `UPDATE ${TABLE_ESTUDIANTES}
     SET nombres = ?, apellidos = ?, qr = ?, codigo_estudiante = ?, curso_id = ?, updated_at = ?
     WHERE id = ?`,
    [
      patch.nombres || prev.nombres,
      patch.apellidos || prev.apellidos,
      patch.qr || prev.qr,
      patch.codigoEstudiante || prev.codigo_estudiante,
      patch.cursoId || prev.curso_id,
      now,
      targetId
    ]
  );
  return { id: targetId };
}

export async function localDeleteEstudiante(id) {
  const targetId = Number(id);
  if (!targetId) throw new Error('ID invalido');

  if (isWeb) {
    ensureMemorySeed();
    mem.estudiantes = mem.estudiantes.filter((e) => Number(e.id) !== targetId);
    return;
  }

  const db = await getDb();
  await db.runAsync(`DELETE FROM ${TABLE_ESTUDIANTES} WHERE id = ?`, [targetId]);
}

