import { api } from './api';

export async function registrarAsistencia(payload) {
  const { data } = await api.post('/asistencias/qr', payload);
  return data;
}
