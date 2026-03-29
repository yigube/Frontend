import { api } from './api';

export async function registrarAsistencia(payload) {
  const { data } = await api.post('/asistencias/qr', payload);
  return data;
}

export async function getAusentesCurso(params = {}) {
  const { data } = await api.get('/asistencias/ausentes', { params });
  return data;
}
