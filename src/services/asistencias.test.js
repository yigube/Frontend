jest.mock('./api', () => ({
  api: { post: jest.fn() }
}));

jest.mock('./asistenciaOfflineQueue', () => ({
  enqueueAsistencia: jest.fn(),
  flushAsistenciaQueue: jest.fn(),
  getAsistenciaQueueCount: jest.fn()
}));

import { api } from './api';
import { registrarAsistencia } from './asistencias';

describe('asistencias service', () => {
  test('registrarAsistencia registra QR y retorna queued=false', async () => {
    api.post.mockResolvedValue({
      data: { message: 'Asistencia registrada', registro: { id: 33 } }
    });

    const result = await registrarAsistencia({
      qr: 'QR-123',
      cursoId: 1,
      fecha: '2026-04-12',
      estado: 'presente'
    });

    expect(api.post).toHaveBeenCalledWith(
      '/asistencias/qr',
      expect.objectContaining({
        qr: 'QR-123',
        cursoId: 1,
        fecha: '2026-04-12',
        estado: 'presente'
      })
    );
    expect(result.queued).toBe(false);
    expect(result.registro.id).toBe(33);
  });
});
