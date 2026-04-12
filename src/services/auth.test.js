jest.mock('./api', () => ({
  api: { post: jest.fn() }
}));

jest.mock('./tokenStorage', () => ({
  setToken: jest.fn(),
  removeToken: jest.fn()
}));

import { api } from './api';
import { setToken } from './tokenStorage';
import { loginUser } from './auth';

describe('auth service', () => {
  test('loginUser hace POST y persiste token', async () => {
    api.post.mockResolvedValue({
      data: {
        token: 'jwt-token',
        user: { id: 7, rol: 'docente' }
      }
    });

    const data = await loginUser('docente@demo.com', 'secreto');

    expect(api.post).toHaveBeenCalledWith('/auth/login', {
      email: 'docente@demo.com',
      password: 'secreto'
    });
    expect(setToken).toHaveBeenCalledWith('jwt-token');
    expect(data.user.rol).toBe('docente');
  });
});
