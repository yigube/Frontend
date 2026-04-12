const { create } = require('zustand');
import { loginUser, logoutUser } from '../services/auth';
import { getToken, removeToken } from '../services/tokenStorage';
import { getStoredUser, removeStoredUser, setStoredUser } from '../services/userStorage';
import { restoreUserFromSession } from './authSession';

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
