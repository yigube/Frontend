import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { loginUser, logoutUser } from '../services/auth';

export const useAuth = create((set) => ({
  user: null, loading: false, error: null,
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await loginUser(email, password);
      set({ user: data.user, loading: false });
      return data.user;
    } catch (e) {
      set({ error: e?.response?.data?.message || e.message, loading: false });
      throw e;
    }
  },
  logout: async () => { await logoutUser(); set({ user: null }); },
  restore: async () => { const token = await SecureStore.getItemAsync('token'); if(!token) set({ user: null }); }
}));
