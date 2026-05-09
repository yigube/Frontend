import {
  SESSION_INACTIVITY_LIMIT_MS,
  getNextInactivityDelay,
  hasSessionExpired
} from './inactivitySession';

describe('inactivitySession', () => {
  test('marca la sesion como expirada despues de 15 minutos sin actividad', () => {
    const lastActivityAt = 1000;
    const now = lastActivityAt + SESSION_INACTIVITY_LIMIT_MS;

    expect(hasSessionExpired(lastActivityAt, now)).toBe(true);
  });

  test('mantiene activa la sesion antes del limite', () => {
    const lastActivityAt = 1000;
    const now = lastActivityAt + SESSION_INACTIVITY_LIMIT_MS - 1;

    expect(hasSessionExpired(lastActivityAt, now)).toBe(false);
  });

  test('calcula el tiempo restante antes del cierre automatico', () => {
    const lastActivityAt = 1000;
    const now = lastActivityAt + 60 * 1000;

    expect(getNextInactivityDelay(lastActivityAt, now)).toBe(14 * 60 * 1000);
  });
});
