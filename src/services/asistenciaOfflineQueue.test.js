jest.mock('react-native', () => ({
  Platform: { OS: 'android' }
}));

jest.mock('expo-file-system', () => ({
  documentDirectory: 'file://test/',
  readAsStringAsync: jest.fn(async () => global.__offlineQueueContent || '[]'),
  writeAsStringAsync: jest.fn(async (_uri, value) => {
    global.__offlineQueueContent = value;
  })
}));

import {
  enqueueAsistencia,
  flushAsistenciaQueue,
  getAsistenciaQueue,
  getAsistenciaQueueStatus
} from './asistenciaOfflineQueue';

describe('asistenciaOfflineQueue', () => {
  beforeEach(() => {
    global.__offlineQueueContent = '[]';
    jest.useFakeTimers().setSystemTime(new Date('2026-06-12T10:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('evita duplicar el mismo clientRequestId en la cola', async () => {
    await enqueueAsistencia({ qr: 'QR-1', cursoId: 1, clientRequestId: 'req-1' });
    const count = await enqueueAsistencia({ qr: 'QR-1', cursoId: 2, clientRequestId: 'req-1' });
    const queue = await getAsistenciaQueue();

    expect(count).toBe(1);
    expect(queue).toHaveLength(1);
    expect(queue[0].payload.cursoId).toBe(2);
    expect(queue[0].payload.clientRequestId).toBe('req-1');
  });

  test('guarda ultimo error y proximo reintento cuando falla temporalmente', async () => {
    await enqueueAsistencia({ qr: 'QR-2', cursoId: 1, clientRequestId: 'req-2' });

    const result = await flushAsistenciaQueue(async () => {
      const error = new Error('Sin conexion');
      error.code = 'ERR_NETWORK';
      throw error;
    });
    const queue = await getAsistenciaQueue();
    const status = await getAsistenciaQueueStatus();

    expect(result.sent).toBe(0);
    expect(result.failed).toBe(1);
    expect(result.pending).toBe(1);
    expect(queue[0].attempts).toBe(1);
    expect(queue[0].lastError).toBe('Sin conexion');
    expect(queue[0].nextRetryAt).toBeTruthy();
    expect(status.lastError).toBe('Sin conexion');
    expect(status.nextRetryAt).toBe(queue[0].nextRetryAt);
  });

  test('descarta errores irrecuperables para no bloquear la cola', async () => {
    await enqueueAsistencia({ qr: 'QR-3', cursoId: 1, clientRequestId: 'req-3' });

    const result = await flushAsistenciaQueue(async () => {
      const error = new Error('No autorizado');
      error.response = { status: 403, data: { error: 'No autorizado' } };
      throw error;
    });
    const queue = await getAsistenciaQueue();

    expect(result.dropped).toBe(1);
    expect(result.pending).toBe(0);
    expect(queue).toHaveLength(0);
  });
});
