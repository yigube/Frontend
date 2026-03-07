import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'token';

function hasWebStorage() {
  return typeof window !== 'undefined' && !!window.localStorage;
}

export async function getToken() {
  if (Platform.OS === 'web') {
    if (!hasWebStorage()) return null;
    try {
      return window.localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setToken(token) {
  if (Platform.OS === 'web') {
    if (!hasWebStorage()) return;
    try {
      window.localStorage.setItem(TOKEN_KEY, token);
    } catch {}
    return;
  }
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch {}
}

export async function removeToken() {
  if (Platform.OS === 'web') {
    if (!hasWebStorage()) return;
    try {
      window.localStorage.removeItem(TOKEN_KEY);
    } catch {}
    return;
  }
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {}
}
