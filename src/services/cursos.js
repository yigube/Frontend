import { api } from './api';

export async function getCursos(params = {}) {
  const { data } = await api.get('/cursos', { params });
  return data || [];
}

export async function getCursosPorColegio(schoolId) {
  const { data } = await api.get(`/colegios/${schoolId}/cursos`);
  return data || [];
}

export async function createCurso(payload) {
  const { data } = await api.post('/cursos', payload);
  return data;
}

export async function updateCurso(id, payload) {
  const { data } = await api.put(`/cursos/${id}`, payload);
  return data;
}

export async function deleteCurso(id) {
  await api.delete(`/cursos/${id}`);
}
