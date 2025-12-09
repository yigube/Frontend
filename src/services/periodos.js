import { api } from './api';

export async function getPeriodos() {
  const { data } = await api.get('/periodos');
  return data;
}

export async function createPeriodo(payload) {
  const { data } = await api.post('/periodos', payload);
  return data;
}

export async function updatePeriodo(id, payload) {
  const { data } = await api.put(`/periodos/${id}`, payload);
  return data;
}

export async function deletePeriodo(id) {
  const { data } = await api.delete(`/periodos/${id}`);
  return data;
}
