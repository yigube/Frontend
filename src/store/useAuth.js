const { create } = require('zustand');
import { loginUser, logoutUser } from '../services/auth';
import { getToken } from '../services/tokenStorage';

export const useAuth = create((set) => ({
  user: null, loading: false, error: null,
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await loginUser(email, password);
      set({ user: data.user, loading: false });
      return data.user;
    } catch (e) {
      const apiError = e?.response?.data?.error || e?.response?.data?.message;
      set({ error: apiError || e.message, loading: false });
      throw e;
    }
  },
  logout: async () => { await logoutUser(); set({ user: null }); },
  restore: async () => { const token = await getToken(); if(!token) set({ user: null }); }
}));
