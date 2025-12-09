import { api } from './api';

export async function seedCursoDocente() {
  const { data } = await api.post('/curso-docentes/seed');
  return data;
}
