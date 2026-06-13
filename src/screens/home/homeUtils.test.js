import {
  buildDocenteMateriasDraft,
  buildDocenteMateriasPorCursoPayload,
  getEstudianteMateriaOptionsByCurso,
  getMateriasDisponiblesByCurso,
  getNivelLabel,
  getNivelShortLabel,
  normalizeMateriaOption,
  parseMateriasTexto,
  resolveColegioNombre,
  resolveSedeNombre,
  sortCursosForDisplay,
  syncDocenteMateriasDraftWithCursos
} from './homeUtils';

describe('homeUtils', () => {
  test('resuelve nombres de colegio y sede con fallbacks', () => {
    expect(resolveColegioNombre([{ id: 5, nombre: 'La Integrada' }], 5)).toBe('La Integrada');
    expect(resolveColegioNombre([], null)).toBe('Selecciona colegio');
    expect(resolveSedeNombre([{ id: 2, nombre: 'Simon Bolivar' }], 2)).toBe('Simon Bolivar');
    expect(resolveSedeNombre([], null)).toBe('Sin sede');
  });

  test('resuelve etiquetas de nivel', () => {
    expect(getNivelLabel('primaria')).toBe('Primaria');
    expect(getNivelLabel('secundaria')).toBe('Secundaria');
    expect(getNivelLabel('otro')).toBe('Sin nivel');
    expect(getNivelShortLabel('primaria')).toBe('Pri.');
    expect(getNivelShortLabel('secundaria')).toBe('Sec.');
    expect(getNivelShortLabel('otro')).toBe('S/N');
  });

  test('ordena cursos para mostrar con criterio numerico', () => {
    const ordered = sortCursosForDisplay([
      { nombre: '10 01' },
      { nombre: '6 02' },
      { nombre: '6 01' }
    ]);
    expect(ordered.map((item) => item.nombre)).toEqual(['6 01', '6 02', '10 01']);
  });

  test('normaliza y deduplica materias por curso', () => {
    const docentePerfilCursos = [
      {
        id: 9,
        materias: ['Matematicas', ' ciencias ', 'matematicas', '']
      }
    ];

    expect(normalizeMateriaOption(' Ciencias ')).toBe('ciencias');
    expect(getMateriasDisponiblesByCurso(9, docentePerfilCursos)).toEqual(['ciencias', 'Matematicas']);
  });

  test('combina materias del curso y del listado de estudiantes sin duplicados', () => {
    const docentePerfilCursos = [
      {
        id: 7,
        materias: ['Matematicas', 'Ingles']
      }
    ];
    const estudianteList = [
      { materias: ['Sociales', 'matematicas'] },
      { materias: ['Ingles', 'Artistica'] }
    ];

    expect(getEstudianteMateriaOptionsByCurso(7, docentePerfilCursos, estudianteList)).toEqual([
      'Artistica',
      'Ingles',
      'Matematicas',
      'Sociales'
    ]);
  });

  test('prepara materias actuales al abrir edicion docente', () => {
    const cursosAsignados = [
      { id: 6, materias: ['Matematicas', 'Sociales'] },
      { id: 9, materias: ['Ingles'] }
    ];

    expect(buildDocenteMateriasDraft(cursosAsignados)).toEqual({
      6: 'Matematicas, Sociales',
      9: 'Ingles'
    });
  });

  test('sincroniza materias cuando se editan cursos del docente', () => {
    const draft = {
      6: 'Matematicas, Sociales',
      9: 'Ingles',
      10: 'Artistica'
    };

    expect(syncDocenteMateriasDraftWithCursos([9, 10], draft)).toEqual({
      9: 'Ingles',
      10: 'Artistica'
    });
  });

  test('construye payload de materias por curso para guardar docente', () => {
    const draft = {
      6: 'Matematicas, Sociales\nMatematicas',
      9: ' Ingles, Ciencias '
    };

    expect(parseMateriasTexto(draft[6])).toEqual(['Matematicas', 'Sociales']);
    expect(buildDocenteMateriasPorCursoPayload([6, 9], draft)).toEqual({
      6: ['Matematicas', 'Sociales'],
      9: ['Ingles', 'Ciencias']
    });
  });
});
