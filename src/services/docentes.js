import { api } from './api';

export async function getDocentes(params = {}) {
  const { data } = await api.get('/docentes', { params });
  return data || [];
}
