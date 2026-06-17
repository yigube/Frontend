const { create } = require('zustand');
import { loginUser, logoutUser } from '../services/auth';
import { getToken, removeToken } from '../services/tokenStorage';
import { getStoredUser, removeStoredUser, setStoredUser } from '../services/userStorage';
import { restoreUserFromSession } from './authSession';

const normalizeEmail = (value = '') => String(value || '').trim().toLowerCase();

const isConnectivityError = (error) => {
  if (!error || error?.response) return false;
  const code = String(error?.code || '').toUpperCase();
  const message = String(error?.message || '').toLowerCase();
  return (
    !code
    || code === 'ERR_NETWORK'
    || code === 'ECONNABORTED'
    || code === 'ENOTFOUND'
    || code === 'EAI_AGAIN'
    || message.includes('network')
  );
};

const restoreOfflineUserForEmail = async (email) => {
  const token = await getToken();
  if (!token) return null;

  const storedUser = await getStoredUser();
  const restoredUser = restoreUserFromSession({ token, storedUser });
  if (!restoredUser) return null;

  const requestedEmail = normalizeEmail(email);
  const restoredEmail = normalizeEmail(restoredUser.email);
  if (requestedEmail && restoredEmail && requestedEmail !== restoredEmail) return null;

  await setStoredUser(restoredUser);
  return restoredUser;
};

export const useAuth = create((set) => ({
  user: null, loading: false, error: null,
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await loginUser(email, password);
      await setStoredUser(data.user);
      set({ user: data.user, loading: false });
      return data.user;
    } catch (e) {
      if (isConnectivityError(e)) {
        const offlineUser = await restoreOfflineUserForEmail(email);
        if (offlineUser) {
          set({ user: offlineUser, loading: false, error: null });
          return offlineUser;
        }

        const offlineMessage = 'Sin conexion. Inicia sesion una vez con internet en este celular antes de usar el modo offline.';
        set({ error: offlineMessage, loading: false });
        throw new Error(offlineMessage);
      }

      const apiError = e?.response?.data?.error || e?.response?.data?.message;
      set({ error: apiError || e.message, loading: false });
      throw e;
    }
  },
  updateUser: (patch = {}) => set((state) => {
    const nextUser = state.user ? { ...state.user, ...patch } : state.user;
    if (nextUser) setStoredUser(nextUser).catch(() => {});
    return { user: nextUser };
  }),
  logout: async () => {
    await logoutUser();
    await removeStoredUser();
    set({ user: null });
  },
  restore: async () => {
    const token = await getToken();
    if (!token) {
      await removeStoredUser();
      set({ user: null });
      return;
    }

    const storedUser = await getStoredUser();
    const restoredUser = restoreUserFromSession({ token, storedUser });
    if (!restoredUser) {
      await removeToken();
      await removeStoredUser();
      set({ user: null });
      return;
    }

    await setStoredUser(restoredUser);
    set({ user: restoredUser, error: null, loading: false });
  }
}));
