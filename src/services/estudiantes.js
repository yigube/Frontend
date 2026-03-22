import { api } from './api';

export async function getEstudiantes(params = {}) {
  const { data } = await api.get('/estudiantes', { params });
  return data || [];
}

export async function createEstudiante(payload) {
  const { data } = await api.post('/estudiantes', payload);
  return data;
}
