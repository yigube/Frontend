import { api } from './api';
import { enqueueAsistencia, flushAsistenciaQueue, getAsistenciaQueueCount } from './asistenciaOfflineQueue';
const CLIENT_REQUEST_ID_MAX_LENGTH = 120;

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

const generateClientRequestId = () => {
  const cryptoRandom = globalThis?.crypto?.randomUUID?.();
  if (cryptoRandom) return String(cryptoRandom).slice(0, CLIENT_REQUEST_ID_MAX_LENGTH);
  const fallback = `att-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
  return fallback.slice(0, CLIENT_REQUEST_ID_MAX_LENGTH);
};

const withClientRequestId = (payload = {}) => {
  const safePayload = payload && typeof payload === 'object' ? payload : {};
  const existing = String(safePayload.clientRequestId || '').trim().slice(0, CLIENT_REQUEST_ID_MAX_LENGTH);
  return {
    ...safePayload,
    clientRequestId: existing || generateClientRequestId()
  };
};

export async function registrarAsistencia(payload, { allowQueue = true } = {}) {
  const safePayload = withClientRequestId(payload);
  try {
    const { data } = await api.post('/asistencias/qr', safePayload);
    return { ...data, queued: false };
  } catch (error) {
    if (allowQueue && isTemporaryConnectivityError(error)) {
      const queuedCount = await enqueueAsistencia(safePayload);
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
    await api.post('/asistencias/qr', withClientRequestId(payload));
  });
}

export async function getAsistenciasPendientesCount() {
  return getAsistenciaQueueCount();
}
