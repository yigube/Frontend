import { getTabScreenNamesForRole } from './tabConfig';

describe('getTabScreenNamesForRole', () => {
  test('admin ve tabs administrativas', () => {
    expect(getTabScreenNamesForRole('admin')).toEqual(['Inicio', 'Cursos', 'Reportes']);
  });

  test('rector ve tabs de gestion sin QR ni estudiantes', () => {
    expect(getTabScreenNamesForRole('rector')).toEqual(['Inicio', 'Cursos', 'Reportes']);
  });

  test('coordinador ve tabs de gestion sin QR ni estudiantes', () => {
    expect(getTabScreenNamesForRole('coordinador')).toEqual(['Inicio', 'Cursos', 'Reportes']);
  });

  test('docente ve tabs operativas completas', () => {
    expect(getTabScreenNamesForRole('docente')).toEqual(['Inicio', 'Cursos', 'Estudiantes', 'Reportes', 'QR']);
  });

  test('rol desconocido cae en tabs de gestion basicas', () => {
    expect(getTabScreenNamesForRole(undefined)).toEqual(['Inicio', 'Cursos', 'Reportes']);
  });
});
