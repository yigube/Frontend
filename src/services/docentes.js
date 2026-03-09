import { api } from './api';

export async function getDocentes(params = {}) {
  const { data } = await api.get('/docentes', { params });
  return data || [];
}

export async function getCursosDisponiblesDocente(params = {}) {
  const cursosMap = new Map();
  const collect = (items = []) => {
    items.forEach((item) => {
      const id = Number(item?.id);
      if (!Number.isFinite(id) || id <= 0) return;
      cursosMap.set(id, item);
    });
  };

  let firstError = null;
  const schoolId = Number(params?.schoolId);

  try {
    if (Number.isFinite(schoolId) && schoolId > 0) {
      const { data } = await api.get(`/colegios/${schoolId}/cursos`);
      collect(data || []);
    }
  } catch (e) {
    firstError = e;
  }

  try {
    const { data } = await api.get('/docentes/cursos-disponibles', { params });
    collect(data || []);
  } catch (e) {
    if (!firstError) firstError = e;
  }

  try {
    const { data } = await api.get('/cursos', { params });
    collect(data || []);
  } catch (e) {
    if (!firstError && cursosMap.size === 0) firstError = e;
  }

  if (cursosMap.size === 0 && firstError) throw firstError;

  return Array.from(cursosMap.values()).sort((a, b) => {
    const aName = String(a?.nombre || '').toLowerCase();
    const bName = String(b?.nombre || '').toLowerCase();
    return aName.localeCompare(bName);
  });
}

export async function createDocente(payload) {
  const { data } = await api.post('/docentes', payload);
  return data;
}

export async function updateDocente(id, payload) {
  const { data } = await api.put(`/docentes/${id}`, payload);
  return data;
}

export async function deleteDocente(id) {
  await api.delete(`/docentes/${id}`);
}
