const { create } = require('zustand');
import { getSocket } from '../services/socket';

export const useAttendance = create((set) => ({
  lastEvent: null,
  status: 'idle',
  subscribe: async () => {
    set({ status: 'connecting' });
    const socket = await getSocket();
    const handler = (data) => set({ lastEvent: data, status: 'listening' });
    socket.off('attendance:created');
    socket.on('attendance:created', handler);
    set({ status: 'listening' });
    return () => {
      socket.off('attendance:created', handler);
      set({ status: 'idle' });
    };
  }
}));
