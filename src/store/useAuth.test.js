jest.mock('../services/auth', () => ({
  loginUser: jest.fn(),
  logoutUser: jest.fn()
}));

jest.mock('../services/tokenStorage', () => ({
  getToken: jest.fn(),
  removeToken: jest.fn()
}));

jest.mock('../services/userStorage', () => ({
  getStoredUser: jest.fn(),
  removeStoredUser: jest.fn(),
  setStoredUser: jest.fn()
}));

import { loginUser } from '../services/auth';
import { getToken } from '../services/tokenStorage';
import { getStoredUser, setStoredUser } from '../services/userStorage';
import { useAuth } from './useAuth';

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.setState({ user: null, loading: false, error: null });
  });

  test('permite entrar offline cuando existe sesion guardada del mismo correo', async () => {
    const networkError = new Error('Network Error');
    networkError.code = 'ERR_NETWORK';
    loginUser.mockRejectedValue(networkError);
    getToken.mockResolvedValue('jwt-token');
    getStoredUser.mockResolvedValue({
      id: 12,
      nombre: 'Valentina',
      email: 'valentina@hotmail.com',
      rol: 'docente',
      schoolId: 3,
      schoolName: 'Colegio Demo'
    });

    const user = await useAuth.getState().login('VALENTINA@hotmail.com', '1234');

    expect(user.email).toBe('valentina@hotmail.com');
    expect(useAuth.getState().user.email).toBe('valentina@hotmail.com');
    expect(setStoredUser).toHaveBeenCalledWith(expect.objectContaining({ email: 'valentina@hotmail.com' }));
  });

  test('muestra mensaje claro si no hay sesion previa para usar offline', async () => {
    const networkError = new Error('Network Error');
    networkError.code = 'ERR_NETWORK';
    loginUser.mockRejectedValue(networkError);
    getToken.mockResolvedValue(null);

    await expect(useAuth.getState().login('valentina@hotmail.com', '1234'))
      .rejects
      .toThrow('Sin conexion. Inicia sesion una vez con internet en este celular antes de usar el modo offline.');

    expect(useAuth.getState().user).toBeNull();
    expect(useAuth.getState().error).toBe('Sin conexion. Inicia sesion una vez con internet en este celular antes de usar el modo offline.');
  });
});
