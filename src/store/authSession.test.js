import { buildUserFromToken, restoreUserFromSession } from './authSession';

const createFakeToken = (payload) => {
  const header = { alg: 'none', typ: 'JWT' };
  const toBase64Url = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  return `${toBase64Url(header)}.${toBase64Url(payload)}.`;
};

describe('authSession', () => {
  test('prioriza usuario almacenado al restaurar sesion', () => {
    const storedUser = {
      id: 1,
      nombre: 'Ana',
      email: 'ana@demo.com',
      rol: 'docente',
      schoolId: 10,
      schoolName: 'Colegio Demo',
      mustChangePassword: true
    };

    const restored = restoreUserFromSession({ token: 'invalid.token', storedUser });
    expect(restored).toEqual(storedUser);
  });

  test('reconstruye usuario desde token cuando no hay usuario almacenado', () => {
    const token = createFakeToken({
      id: 9,
      nombre: 'Rector Uno',
      rol: 'rector',
      schoolId: 22,
      schoolName: 'Norte'
    });

    expect(buildUserFromToken(token)).toEqual({
      id: 9,
      nombre: 'Rector Uno',
      email: '',
      rol: 'rector',
      schoolId: 22,
      schoolName: 'Norte',
      mustChangePassword: false
    });
  });
});
