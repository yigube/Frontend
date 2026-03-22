import { api } from './api';
import { LOCAL_MODE } from '../config/runtime';
import { localListCursos, localCreateCurso, localUpdateCurso, localDeleteCurso } from './localAcademics';

export async function getCursos(params = {}) {
  if (LOCAL_MODE) return localListCursos(params);
  const { data } = await api.get('/cursos', { params });
  return data || [];
}

export async function getCursosPorColegio(schoolId) {
  const { data } = await api.get(`/colegios/${schoolId}/cursos`);
  return data || [];
}

export async function createCurso(payload) {
  if (LOCAL_MODE) return localCreateCurso(payload);
  const { data } = await api.post('/cursos', payload);
  return data;
}

export async function updateCurso(id, payload) {
  if (LOCAL_MODE) return localUpdateCurso(id, payload);
  const { data } = await api.put(`/cursos/${id}`, payload);
  return data;
}

export async function deleteCurso(id) {
  if (LOCAL_MODE) return localDeleteCurso(id);
  await api.delete(`/cursos/${id}`);
}
