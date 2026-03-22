import { api } from './api';
import { LOCAL_MODE } from '../config/runtime';
import {
  queueInit,
  enqueueAsistencia,
  getPendingAsistencias,
  markAsistenciaSynced,
  markAsistenciaFailed,
  getPendingAsistenciasCount
} from './sqliteQueue';

export async function registrarAsistencia(payload) {
  await queueInit();
  if (LOCAL_MODE) {
    const queued = await enqueueAsistencia(payload);
    return {
      offline: true,
      queued: true,
      queueId: queued.id,
      message: 'Modo local activo: asistencia guardada en SQLite'
    };
  }
  const { data } = await api.post('/asistencias/qr', payload);
  return { ...data, offline: false };
}

const payloadFromQueueRow = (row) => ({
  qr: row.qr,
  cursoId: Number(row.curso_id),
  fecha: row.fecha,
  estado: row.estado,
  presente: Boolean(row.presente),
  tarde: Boolean(row.tarde),
  afuera: Boolean(row.afuera),
  ausente: Boolean(row.ausente)
});

const shouldQueueError = (e) => {
  if (!e) return false;
  if (!e.response) return true; // sin conectividad / timeout / DNS
  const status = Number(e.response.status || 0);
  return status >= 500;
};

export async function registrarAsistenciaConFallback(payload) {
  try {
    return await registrarAsistencia(payload);
  } catch (e) {
    if (!shouldQueueError(e)) throw e;
    const queued = await enqueueAsistencia(payload);
    return {
      offline: true,
      queued: true,
      queueId: queued.id,
      message: 'Sin conexion. Asistencia guardada localmente y pendiente por sincronizar.'
    };
  }
}

export async function sincronizarAsistenciasPendientes(limit = 100) {
  await queueInit();
  if (LOCAL_MODE) {
    const remaining = await getPendingAsistenciasCount();
    return { synced: 0, failed: 0, remaining };
  }
  const pending = await getPendingAsistencias(limit);
  let synced = 0;
  let failed = 0;

  for (const row of pending) {
    try {
      await api.post('/asistencias/qr', payloadFromQueueRow(row));
      await markAsistenciaSynced(row.id);
      synced += 1;
    } catch (e) {
      const status = Number(e?.response?.status || 0);
      if (status >= 400 && status < 500) {
        // Error funcional: se descarta para no bloquear toda la cola.
        await markAsistenciaSynced(row.id);
        failed += 1;
      } else {
        await markAsistenciaFailed(row.id, e?.response?.data?.error || e?.message || 'sync_error');
        failed += 1;
      }
    }
  }

  const remaining = await getPendingAsistenciasCount();
  return { synced, failed, remaining };
}

export async function contarAsistenciasPendientes() {
  await queueInit();
  return getPendingAsistenciasCount();
}
