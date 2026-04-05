import { api } from './api';
import { removeToken, setToken } from './tokenStorage';

export async function loginUser(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  await setToken(data.token);
  return data;
}

export async function logoutUser() {
  await removeToken();
}

export async function changeMyPassword(currentPassword, newPassword) {
  const { data } = await api.post('/auth/change-password', { currentPassword, newPassword });
  return data;
}

export async function requestPasswordReset(email) {
  const { data } = await api.post('/auth/reset-password', { email });
  return data;
}
