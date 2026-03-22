import { api } from './api';
import { LOCAL_MODE } from '../config/runtime';
import {
  localListEstudiantes,
  localCreateEstudiante,
  localCreateEstudiantesLote,
  localUpdateEstudiante,
  localDeleteEstudiante
} from './localAcademics';

export async function getEstudiantes(params = {}) {
  if (LOCAL_MODE) return localListEstudiantes(params);
  const { data } = await api.get('/estudiantes', { params });
  return data || [];
}

export async function createEstudiante(payload) {
  if (LOCAL_MODE) return localCreateEstudiante(payload);
  const { data } = await api.post('/estudiantes', payload);
  return data;
}

export async function createEstudiantesLote(payload) {
  if (LOCAL_MODE) return localCreateEstudiantesLote(payload);
  const { data } = await api.post('/estudiantes/lote', payload);
  return data;
}

export async function updateEstudiante(id, payload) {
  if (LOCAL_MODE) return localUpdateEstudiante(id, payload);
  const { data } = await api.put(`/estudiantes/${id}`, payload);
  return data;
}

export async function deleteEstudiante(id) {
  if (LOCAL_MODE) return localDeleteEstudiante(id);
  const { data } = await api.delete(`/estudiantes/${id}`);
  return data;
}
