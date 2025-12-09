import { api } from './api';

export async function getEstudiantes(params = {}) {
  const { data } = await api.get('/estudiantes', { params });
  return data || [];
}
