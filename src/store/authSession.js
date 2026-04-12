const base64UrlToBase64 = (value = '') => String(value || '')
  .replace(/-/g, '+')
  .replace(/_/g, '/')
  .padEnd(Math.ceil(String(value || '').length / 4) * 4, '=');

const decodeBase64 = (value = '') => {
  const text = String(value || '');
  if (!text) return '';
  if (typeof globalThis !== 'undefined' && typeof globalThis.atob === 'function') {
    return globalThis.atob(text);
  }
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(text, 'base64').toString('utf-8');
  }
  return '';
};

export const decodeJwtPayload = (token = '') => {
  const safeToken = String(token || '').trim();
  const parts = safeToken.split('.');
  if (parts.length < 2) return null;
  try {
    const payloadJson = decodeBase64(base64UrlToBase64(parts[1]));
    const payload = JSON.parse(payloadJson);
    return payload && typeof payload === 'object' ? payload : null;
  } catch {
    return null;
  }
};

export const normalizeStoredUser = (value) => {
  if (!value || typeof value !== 'object') return null;
  if (!value.id || !value.rol) return null;
  return {
    id: value.id,
    nombre: value.nombre || '',
    email: value.email || '',
    rol: value.rol,
    schoolId: value.schoolId ?? null,
    schoolName: value.schoolName || '',
    mustChangePassword: Boolean(value.mustChangePassword)
  };
};

export const buildUserFromToken = (token) => {
  const payload = decodeJwtPayload(token);
  if (!payload?.id || !payload?.rol) return null;
  return {
    id: payload.id,
    nombre: payload.nombre || '',
    email: payload.email || '',
    rol: payload.rol,
    schoolId: payload.schoolId ?? null,
    schoolName: payload.schoolName || '',
    mustChangePassword: false
  };
};

export const restoreUserFromSession = ({ token, storedUser }) => {
  const safeStored = normalizeStoredUser(storedUser);
  if (safeStored) return safeStored;
  return buildUserFromToken(token);
};
