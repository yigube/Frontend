import { getTabScreenNamesForRole } from './tabConfig';

describe('getTabScreenNamesForRole', () => {
  test('admin ve tabs administrativas', () => {
    expect(getTabScreenNamesForRole('admin')).toEqual(['Inicio', 'Cursos', 'Reportes']);
  });

  test('docente ve tabs operativas completas', () => {
    expect(getTabScreenNamesForRole('docente')).toEqual(['Inicio', 'Cursos', 'Estudiantes', 'Reportes', 'QR']);
  });
});
