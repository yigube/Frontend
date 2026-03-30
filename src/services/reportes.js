import { api } from './api';

export async function getDashboardReportes(params = {}) {
  const { data } = await api.get('/reportes/dashboard', { params });
  return data;
}

export async function getReporteInasistenciaCurso(params = {}) {
  const { data } = await api.get('/reportes/curso-inasistencias', { params });
  return data;
}
