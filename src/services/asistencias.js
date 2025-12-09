import { api } from './api'; export async function registrarAsistencia(payload){ const { data } = await api.post('/asistencias', payload); return data; }
