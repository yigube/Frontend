import { api } from './api';

export async function getEstudiantes(params = {}) {
  const { data } = await api.get('/estudiantes', { params });
  return data || [];
}

export async function createEstudiante(payload) {
  const { data } = await api.post('/estudiantes', payload);
  return data;
}

export async function createEstudiantesLote(payload) {
  const { data } = await api.post('/estudiantes/lote', payload);
  return data;
}

export async function updateEstudiante(id, payload) {
  const { data } = await api.put(`/estudiantes/${id}`, payload);
  return data;
}

export async function deleteEstudiante(id) {
  const { data } = await api.delete(`/estudiantes/${id}`);
  return data;
}
