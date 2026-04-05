import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

const STORAGE_KEY = 'asistencia_pending_queue_v1';
const FILE_NAME = 'asistencia-pending-queue.json';

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
  payload
});

export async function enqueueAsistencia(payload) {
  const queue = await readQueue();
  queue.push(buildQueueItem(payload));
  await writeQueue(queue);
  return queue.length;
}

export async function getAsistenciaQueue() {
  return readQueue();
}

export async function getAsistenciaQueueCount() {
  const queue = await readQueue();
  return queue.length;
}

export async function flushAsistenciaQueue(sendFn) {
  if (typeof sendFn !== 'function') return { sent: 0, pending: 0, dropped: 0 };

  const queue = await readQueue();
  if (!queue.length) return { sent: 0, pending: 0, dropped: 0 };

  let sent = 0;
  let dropped = 0;
  let processed = 0;

  for (let index = 0; index < queue.length; index += 1) {
    const item = queue[index];
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

      if (temporary) break;
      break;
    }
  }

  const pendingQueue = queue.slice(processed);
  await writeQueue(pendingQueue);
  return { sent, pending: pendingQueue.length, dropped };
}

