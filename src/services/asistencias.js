import { api } from './api';
import { enqueueAsistencia, flushAsistenciaQueue, getAsistenciaQueueCount } from './asistenciaOfflineQueue';

const isTemporaryConnectivityError = (error) => {
  if (!error) return false;
  if (error?.response) return false;
  const code = String(error?.code || '').toUpperCase();
  return (
    !code
    || code === 'ERR_NETWORK'
    || code === 'ECONNABORTED'
    || code === 'ENOTFOUND'
    || code === 'EAI_AGAIN'
  );
};

export async function registrarAsistencia(payload, { allowQueue = true } = {}) {
  try {
    const { data } = await api.post('/asistencias/qr', payload);
    return { ...data, queued: false };
  } catch (error) {
    if (allowQueue && isTemporaryConnectivityError(error)) {
      const queuedCount = await enqueueAsistencia(payload);
      return {
        queued: true,
        queuedCount,
        message: 'Registro guardado en cola para sincronizar'
      };
    }
    throw error;
  }
}

export async function syncAsistenciasPendientes() {
  return flushAsistenciaQueue(async (payload) => {
    await api.post('/asistencias/qr', payload);
  });
}

export async function getAsistenciasPendientesCount() {
  return getAsistenciaQueueCount();
}
