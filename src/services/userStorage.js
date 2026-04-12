import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const USER_KEY = 'auth_user';

function hasWebStorage() {
  return typeof window !== 'undefined' && !!window.sessionStorage;
}

export async function getStoredUser() {
  if (Platform.OS === 'web') {
    if (!hasWebStorage()) return null;
    try {
      const raw = window.sessionStorage.getItem(USER_KEY) || window.localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
  try {
    const raw = await SecureStore.getItemAsync(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function setStoredUser(user) {
  const raw = JSON.stringify(user || null);
  if (Platform.OS === 'web') {
    if (!hasWebStorage()) return;
    try {
      window.sessionStorage.setItem(USER_KEY, raw);
      window.localStorage.removeItem(USER_KEY);
    } catch {}
    return;
  }
  try {
    await SecureStore.setItemAsync(USER_KEY, raw);
  } catch {}
}

export async function removeStoredUser() {
  if (Platform.OS === 'web') {
    if (!hasWebStorage()) return;
    try {
      window.sessionStorage.removeItem(USER_KEY);
      window.localStorage.removeItem(USER_KEY);
    } catch {}
    return;
  }
  try {
    await SecureStore.deleteItemAsync(USER_KEY);
  } catch {}
}
