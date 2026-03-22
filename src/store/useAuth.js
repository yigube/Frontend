const { create } = require('zustand');
import { loginUser, logoutUser } from '../services/auth';
import { getToken } from '../services/tokenStorage';
import { LOCAL_MODE } from '../config/runtime';
import { getLocalUser, setLocalUser, removeLocalUser } from '../services/localSession';

const buildLocalUser = (email) => {
  const normalizedEmail = String(email || 'local@offline.app').trim().toLowerCase() || 'local@offline.app';
  const isAdmin = normalizedEmail.includes('admin');
  const isRector = normalizedEmail.includes('rector');
  const isCoordinador = normalizedEmail.includes('coordinador') || normalizedEmail.includes('coordinador');
  const rol = isAdmin ? 'admin' : (isRector ? 'rector' : (isCoordinador ? 'coordinador' : 'docente'));
  return {
    id: 1,
    nombre: 'Usuario Local',
    email: normalizedEmail,
    rol,
    schoolId: 1,
    schoolName: 'Colegio Local'
  };
};

export const useAuth = create((set) => ({
  user: null, loading: false, error: null,
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      if (LOCAL_MODE) {
        const user = buildLocalUser(email);
        await setLocalUser(user);
        set({ user, loading: false });
        return user;
      }
      const data = await loginUser(email, password);
      set({ user: data.user, loading: false });
      return data.user;
    } catch (e) {
      const apiError = e?.response?.data?.error || e?.response?.data?.message;
      set({ error: apiError || e.message, loading: false });
      throw e;
    }
  },
  logout: async () => {
    if (LOCAL_MODE) {
      await removeLocalUser();
      set({ user: null });
      return;
    }
    await logoutUser();
    set({ user: null });
  },
  restore: async () => {
    if (LOCAL_MODE) {
      const localUser = await getLocalUser();
      if (localUser) {
        set({ user: localUser });
        return;
      }
      const defaultUser = buildLocalUser('admin.local@offline.app');
      await setLocalUser(defaultUser);
      set({ user: defaultUser });
      return;
    }
    const token = await getToken();
    if (!token) set({ user: null });
  }
}));
