import { api } from './api';

export async function getDocentes(params = {}) {
  const { data } = await api.get('/docentes', { params });
  return data || [];
}

export async function createDocente(payload) {
  const { data } = await api.post('/docentes', payload);
  return data;
}

export async function updateDocente(id, payload) {
  const { data } = await api.put(`/docentes/${id}`, payload);
  return data;
}

export async function deleteDocente(id) {
  await api.delete(`/docentes/${id}`);
}
