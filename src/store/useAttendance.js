const { create } = require('zustand');
import { getSocket } from '../services/socket';

export const useAttendance = create((set) => ({
  lastEvent: null,
  lastEventName: null,
  status: 'idle',
  subscribe: async () => {
    set({ status: 'connecting' });
    const socket = await getSocket();
    const handler = (eventName) => (data) => set({ lastEvent: data, lastEventName: eventName, status: 'listening' });
    const handleLegacy = handler('attendance:created');
    const handleCurrent = handler('asistencia:registrada');
    socket.off('attendance:created');
    socket.off('asistencia:registrada');
    socket.on('attendance:created', handleLegacy);
    socket.on('asistencia:registrada', handleCurrent);
    set({ status: 'listening' });
    return () => {
      socket.off('attendance:created', handleLegacy);
      socket.off('asistencia:registrada', handleCurrent);
      set({ status: 'idle' });
    };
  }
}));
