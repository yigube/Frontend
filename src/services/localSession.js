import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const USER_KEY = 'local_user';

function hasWebStorage() {
  return typeof window !== 'undefined' && !!window.localStorage;
}

export async function getLocalUser() {
  try {
    let raw = null;
    if (Platform.OS === 'web') {
      if (!hasWebStorage()) return null;
      raw = window.localStorage.getItem(USER_KEY);
    } else {
      raw = await SecureStore.getItemAsync(USER_KEY);
    }
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function setLocalUser(user) {
  const raw = JSON.stringify(user || null);
  try {
    if (Platform.OS === 'web') {
      if (!hasWebStorage()) return;
      window.localStorage.setItem(USER_KEY, raw);
      return;
    }
    await SecureStore.setItemAsync(USER_KEY, raw);
  } catch {}
}

export async function removeLocalUser() {
  try {
    if (Platform.OS === 'web') {
      if (!hasWebStorage()) return;
      window.localStorage.removeItem(USER_KEY);
      return;
    }
    await SecureStore.deleteItemAsync(USER_KEY);
  } catch {}
}

