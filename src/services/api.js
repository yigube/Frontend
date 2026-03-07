import axios from 'axios';
import { getToken } from './tokenStorage';

export const API_URL = 'http://192.168.1.247:4000';

export const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(async (config) => {
  try {
    const token = await getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {}
  return config;
});
