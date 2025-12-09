import { api } from './api';

export async function getColegios(params = {}) {
  const { data } = await api.get('/colegios', { params });
  return data || [];
}
