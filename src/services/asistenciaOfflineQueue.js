import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

const STORAGE_KEY = 'asistencia_pending_queue_v1';
const FILE_NAME = 'asistencia-pending-queue.json';
const CLIENT_REQUEST_ID_MAX_LENGTH = 120;
const BASE_RETRY_DELAY_MS = 30 * 1000;
const MAX_RETRY_DELAY_MS = 30 * 60 * 1000;

const canUseLocalStorage = () => (
  Platform.OS === 'web'
  && typeof window !== 'undefined'
  && window?.localStorage
);

const getFileUri = () => {
  if (!FileSystem?.documentDirectory) return null;
  return `${FileSystem.documentDirectory}${FILE_NAME}`;
};

const safeParseQueue = (value) => {
  try {
    const parsed = JSON.parse(String(value || '[]'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const generateClientRequestId = () => {
  const randomPart = `${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
  return `att-${randomPart}`.slice(0, CLIENT_REQUEST_ID_MAX_LENGTH);
};

const normalizeClientRequestId = (value) => String(value || '')
  .trim()
  .slice(0, CLIENT_REQUEST_ID_MAX_LENGTH);

const normalizePayload = (payload = {}) => {
  const safePayload = payload && typeof payload === 'object' ? payload : {};
  const clientRequestId = normalizeClientRequestId(safePayload.clientRequestId) || generateClientRequestId();
  return { ...safePayload, clientRequestId };
};

const getRetryDelayMs = (attempts = 0) => Math.min(
  MAX_RETRY_DELAY_MS,
  BASE_RETRY_DELAY_MS * (2 ** Math.max(0, Number(attempts || 0)))
);

const normalizeQueueItem = (item = {}) => {
  const payload = normalizePayload(item?.payload || item);
  return {
    id: String(item?.id || payload.clientRequestId || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`),
    createdAt: item?.createdAt || new Date().toISOString(),
    attempts: Number(item?.attempts || 0),
    lastAttemptAt: item?.lastAttemptAt || null,
    lastError: item?.lastError || '',
    nextRetryAt: item?.nextRetryAt || null,
    payload
  };
};

const getErrorMessage = (error) => String(
  error?.response?.data?.error
  || error?.response?.data?.message
  || error?.message
  || 'No se pudo sincronizar'
).trim();

const isReadyForRetry = (item, now = Date.now()) => {
  if (!item?.nextRetryAt) return true;
  const retryTime = new Date(item.nextRetryAt).getTime();
  return !Number.isFinite(retryTime) || retryTime <= now;
};

const readQueue = async () => {
  if (canUseLocalStorage()) {
    return safeParseQueue(window.localStorage.getItem(STORAGE_KEY));
  }

  const fileUri = getFileUri();
  if (!fileUri) return [];

  try {
    const content = await FileSystem.readAsStringAsync(fileUri);
    return safeParseQueue(content);
  } catch {
    return [];
  }
};

const writeQueue = async (queue) => {
  const safeQueue = Array.isArray(queue) ? queue : [];
  const json = JSON.stringify(safeQueue);

  if (canUseLocalStorage()) {
    window.localStorage.setItem(STORAGE_KEY, json);
    return;
  }

  const fileUri = getFileUri();
  if (!fileUri) return;

  await FileSystem.writeAsStringAsync(fileUri, json);
};

const buildQueueItem = (payload = {}) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  createdAt: new Date().toISOString(),
  attempts: 0,
  lastAttemptAt: null,
  lastError: '',
  nextRetryAt: null,
  payload: normalizePayload(payload)
});

export async function enqueueAsistencia(payload) {
  const queue = (await readQueue()).map(normalizeQueueItem);
  const item = buildQueueItem(payload);
  const existingIndex = queue.findIndex((queuedItem) => (
    normalizeClientRequestId(queuedItem?.payload?.clientRequestId)
    && normalizeClientRequestId(queuedItem?.payload?.clientRequestId) === normalizeClientRequestId(item?.payload?.clientRequestId)
  ));
  if (existingIndex >= 0) {
    queue[existingIndex] = {
      ...queue[existingIndex],
      payload: {
        ...queue[existingIndex].payload,
        ...item.payload
      }
    };
  } else {
    queue.push(item);
  }
  await writeQueue(queue);
  return queue.length;
}

export async function getAsistenciaQueue() {
  return (await readQueue()).map(normalizeQueueItem);
}

export async function getAsistenciaQueueCount() {
  const queue = await getAsistenciaQueue();
  return queue.length;
}

export async function getAsistenciaQueueStatus() {
  const queue = await getAsistenciaQueue();
  const lastAttemptItem = [...queue]
    .filter((item) => item.lastAttemptAt)
    .sort((left, right) => new Date(right.lastAttemptAt).getTime() - new Date(left.lastAttemptAt).getTime())[0] || null;
  const lastErrorItem = [...queue]
    .filter((item) => item.lastError)
    .sort((left, right) => new Date(right.lastAttemptAt || right.createdAt).getTime() - new Date(left.lastAttemptAt || left.createdAt).getTime())[0] || null;
  const nextRetryItem = [...queue]
    .filter((item) => item.nextRetryAt)
    .sort((left, right) => new Date(left.nextRetryAt).getTime() - new Date(right.nextRetryAt).getTime())[0] || null;

  return {
    pending: queue.length,
    oldestCreatedAt: queue[0]?.createdAt || null,
    lastAttemptAt: lastAttemptItem?.lastAttemptAt || null,
    lastError: lastErrorItem?.lastError || '',
    nextRetryAt: nextRetryItem?.nextRetryAt || null
  };
}

export async function flushAsistenciaQueue(sendFn) {
  if (typeof sendFn !== 'function') return { sent: 0, pending: 0, dropped: 0, failed: 0, nextRetryAt: null, lastError: '' };

  const queue = await getAsistenciaQueue();
  if (!queue.length) return { sent: 0, pending: 0, dropped: 0, failed: 0, nextRetryAt: null, lastError: '' };
  await writeQueue(queue);

  let sent = 0;
  let dropped = 0;
  let processed = 0;
  let failed = 0;
  let lastError = '';
  let nextRetryAt = null;
  const now = Date.now();

  for (let index = 0; index < queue.length; index += 1) {
    const item = queue[index];
    if (!isReadyForRetry(item, now)) {
      nextRetryAt = item.nextRetryAt;
      break;
    }
    try {
      await sendFn(item?.payload || {});
      sent += 1;
      processed += 1;
    } catch (error) {
      const status = Number(error?.response?.status || 0);
      const unrecoverable = [400, 401, 403, 404, 422].includes(status) || status === 409;
      const temporary = !error?.response || status >= 500;

      if (unrecoverable) {
        dropped += 1;
        processed += 1;
        continue;
      }

      lastError = getErrorMessage(error);
      if (temporary) {
        const attempts = Number(item.attempts || 0) + 1;
        nextRetryAt = new Date(Date.now() + getRetryDelayMs(attempts - 1)).toISOString();
        queue[index] = {
          ...item,
          attempts,
          lastAttemptAt: new Date().toISOString(),
          lastError,
          nextRetryAt
        };
        failed += 1;
        break;
      }
      break;
    }
  }

  const pendingQueue = queue.slice(processed);
  await writeQueue(pendingQueue);
  const status = await getAsistenciaQueueStatus();
  return {
    sent,
    pending: pendingQueue.length,
    dropped,
    failed,
    nextRetryAt: nextRetryAt || status.nextRetryAt,
    lastError: lastError || status.lastError
  };
}
