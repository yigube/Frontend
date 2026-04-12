import { api } from './api';

const isRouteNotFound = (error) => Number(error?.response?.status) === 404;

const SEDE_ROUTE_VARIANTS = [
  '/sedes',
  '/crud/sedes',
  '/api/sedes',
  '/api/crud/sedes',
];

async function withRouteVariants(requestFactory) {
  let lastError = null;

  for (const route of SEDE_ROUTE_VARIANTS) {
    try {
      return await requestFactory(route);
    } catch (error) {
      if (!isRouteNotFound(error)) throw error;
      lastError = error;
    }
  }

  throw lastError || new Error('No fue posible resolver una ruta de sedes');
}

export async function getSedes(params = {}) {
  const response = await withRouteVariants((route) => api.get(route, { params }));
  const { data } = response;
  return data || [];
}

export async function createSede(payload) {
  const response = await withRouteVariants((route) => api.post(route, payload));
  const { data } = response;
  return data;
}

export async function updateSede(id, payload) {
  const response = await withRouteVariants((route) => api.put(`${route}/${id}`, payload));
  const { data } = response;
  return data;
}

export async function deleteSede(id) {
  await withRouteVariants((route) => api.delete(`${route}/${id}`));
}
