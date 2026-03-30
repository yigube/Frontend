import { api } from './api';

export async function getDashboardReportes(params = {}) {
  const { data } = await api.get('/reportes/dashboard', { params });
  return data;
}
