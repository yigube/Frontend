import { api } from './api';
import * as SecureStore from 'expo-secure-store';
export async function loginUser(email, password){ const { data } = await api.post('/auth/login',{ email, password }); await SecureStore.setItemAsync('token', data.token); return data; }
export async function logoutUser(){ await SecureStore.deleteItemAsync('token'); }
