jest.mock('react-native', () => ({
  Platform: { OS: 'android' }
}));

jest.mock('expo-file-system', () => ({
  documentDirectory: 'file://test/',
  readAsStringAsync: jest.fn(async () => global.__qrOfflineCacheContent || '{}'),
  writeAsStringAsync: jest.fn(async (_uri, value) => {
    global.__qrOfflineCacheContent = value;
  })
}));

import {
  buildQROfflineCacheKey,
  getQROfflineContext,
  saveQROfflineContext
} from './qrOfflineCache';

describe('qrOfflineCache', () => {
  beforeEach(() => {
    global.__qrOfflineCacheContent = '{}';
  });

  test('construye una llave estable por colegio y usuario', () => {
    expect(buildQROfflineCacheKey({ id: 7, schoolId: 4 })).toBe('4:7');
    expect(buildQROfflineCacheKey({ email: 'Docente@Demo.com', schoolId: null })).toBe('global:docente@demo.com');
  });

  test('guarda y recupera cursos y materias del docente', async () => {
    const user = { id: 2, schoolId: 4 };
    await saveQROfflineContext(user, {
      cursos: [{ id: 10, nombre: '6 02' }],
      docentePerfilCursos: [{ id: 10, materias: ['Matematicas'] }]
    });

    const cached = await getQROfflineContext(user);

    expect(cached.cursos).toEqual([{ id: 10, nombre: '6 02' }]);
    expect(cached.docentePerfilCursos).toEqual([{ id: 10, materias: ['Matematicas'] }]);
    expect(cached.savedAt).toBeTruthy();
  });

  test('retorna null cuando no hay datos guardados para el usuario', async () => {
    await saveQROfflineContext({ id: 2, schoolId: 4 }, { cursos: [{ id: 10 }] });

    await expect(getQROfflineContext({ id: 3, schoolId: 4 })).resolves.toBeNull();
  });
});
