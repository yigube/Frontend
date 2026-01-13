import { api } from './api';

export async function getColegios(params = {}) {
  const { data } = await api.get('/colegios', { params });
  return data || [];
}

export async function createColegio(payload) {
  const { data } = await api.post('/colegios', payload);
  return data;
}

export async function updateColegio(id, payload) {
  const { data } = await api.put(`/colegios/${id}`, payload);
  return data;
}

export async function deleteColegio(id) {
  await api.delete(`/colegios/${id}`);
}
