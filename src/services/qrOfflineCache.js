import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

const STORAGE_KEY = 'qr_offline_context_v1';
const FILE_NAME = 'qr-offline-context.json';

const canUseLocalStorage = () => (
  Platform.OS === 'web'
  && typeof window !== 'undefined'
  && window?.localStorage
);

const getFileUri = () => {
  if (!FileSystem?.documentDirectory) return null;
  return `${FileSystem.documentDirectory}${FILE_NAME}`;
};

const safeParse = (raw) => {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
};

const readStore = async () => {
  if (canUseLocalStorage()) {
    return safeParse(window.localStorage.getItem(STORAGE_KEY));
  }

  const uri = getFileUri();
  if (!uri) return {};

  try {
    return safeParse(await FileSystem.readAsStringAsync(uri));
  } catch {
    return {};
  }
};

const writeStore = async (store) => {
  const json = JSON.stringify(store && typeof store === 'object' ? store : {});

  if (canUseLocalStorage()) {
    window.localStorage.setItem(STORAGE_KEY, json);
    return;
  }

  const uri = getFileUri();
  if (!uri) return;

  await FileSystem.writeAsStringAsync(uri, json);
};

export const buildQROfflineCacheKey = (user = {}) => {
  const schoolId = user?.schoolId == null ? 'global' : String(user.schoolId);
  const userId = user?.id == null ? String(user?.email || 'anonymous').toLowerCase() : String(user.id);
  return `${schoolId}:${userId}`;
};

export async function saveQROfflineContext(user, context = {}) {
  const key = buildQROfflineCacheKey(user);
  const store = await readStore();
  store[key] = {
    cursos: Array.isArray(context.cursos) ? context.cursos : [],
    docentePerfilCursos: Array.isArray(context.docentePerfilCursos) ? context.docentePerfilCursos : [],
    savedAt: new Date().toISOString()
  };
  await writeStore(store);
  return store[key];
}

export async function getQROfflineContext(user) {
  const key = buildQROfflineCacheKey(user);
  const store = await readStore();
  const context = store[key];
  if (!context || typeof context !== 'object') return null;
  return {
    cursos: Array.isArray(context.cursos) ? context.cursos : [],
    docentePerfilCursos: Array.isArray(context.docentePerfilCursos) ? context.docentePerfilCursos : [],
    savedAt: context.savedAt || null
  };
}
