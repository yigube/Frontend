import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const DEFAULT_PORT = 4000;
const LOCAL_ANDROID = `http://10.0.2.2:${DEFAULT_PORT}`;
const LOCAL_DESKTOP = `http://localhost:${DEFAULT_PORT}`;

function resolveApiUrl() {
  // 1) .env (expo-inline-dotenv) tiene prioridad para builds o entornos especiales
  if (process.env.API_URL) return process.env.API_URL;

  // 2) En modo dev, toma la IP LAN que expo usa para servir el bundle
  const hostUri = Constants.expoConfig?.hostUri || Constants.expoGoConfig?.hostUri;
  const host = hostUri?.replace(/^(https?:\/\/|exp:\/\/)/, '').split(':')[0];
  if (host) return `http://${host}:${DEFAULT_PORT}`;

  // 3) Fallbacks locales por plataforma
  return Platform.OS === 'android' ? LOCAL_ANDROID : LOCAL_DESKTOP;
}

export const API_URL = resolveApiUrl();

export const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {}
  return config;
});
