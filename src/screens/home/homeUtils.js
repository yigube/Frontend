export const ALL_MATERIAS_OPTION = '__all_materias__';

const MAX_PERIODS_PER_YEAR = 4;
const PERIOD_DURATION_DAYS = 70;

const getComparableDateKey = (value) => {
  const text = String(value || '').trim();
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) return Number(`${match[1]}${match[2]}${match[3]}`);
  const parsed = new Date(text);
  if (!Number.isFinite(parsed.getTime())) return 0;
  const year = parsed.getUTCFullYear();
  const month = String(parsed.getUTCMonth() + 1).padStart(2, '0');
  const day = String(parsed.getUTCDate()).padStart(2, '0');
  return Number(`${year}${month}${day}`);
};

export const createDefaultPeriodForm = (periodList = []) => {
  const safePeriodList = Array.isArray(periodList) ? periodList : [];
  const latestPeriodo = safePeriodList.length > 0
    ? safePeriodList.reduce((latest, current) => {
        const latestEnd = getComparableDateKey(latest?.fechaFin);
        const currentEnd = getComparableDateKey(current?.fechaFin);
        return currentEnd > latestEnd ? current : latest;
      }, safePeriodList[0])
    : null;
  const latestDateMatch = String(latestPeriodo?.fechaFin || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  let now = latestDateMatch
    ? new Date(Number(latestDateMatch[1]), Number(latestDateMatch[2]) - 1, Number(latestDateMatch[3]))
    : new Date();
  if (latestPeriodo?.fechaFin) now.setDate(now.getDate() + 1);
  const periodsInStartYear = safePeriodList.filter((periodo) => {
    const match = String(periodo?.fechaInicio || periodo?.fechaFin || '').match(/^(\d{4})-/);
    return match && Number(match[1]) === now.getFullYear();
  }).length;
  if (periodsInStartYear >= MAX_PERIODS_PER_YEAR) {
    now = new Date(now.getFullYear() + 1, 0, 1);
  }
  const end = new Date(now);
  end.setDate(end.getDate() + PERIOD_DURATION_DAYS - 1);
  const periodNumber = Math.min(
    safePeriodList.filter((periodo) => {
      const match = String(periodo?.fechaInicio || periodo?.fechaFin || '').match(/^(\d{4})-/);
      return match && Number(match[1]) === now.getFullYear();
    }).length + 1,
    MAX_PERIODS_PER_YEAR
  );
  return {
    nombre: `Periodo ${periodNumber || 1}`,
    startDay: now.getDate(),
    startMonth: now.getMonth() + 1,
    startYear: now.getFullYear(),
    startHour: 0,
    startMinute: 0,
    endDay: end.getDate(),
    endMonth: end.getMonth() + 1,
    endYear: end.getFullYear(),
    endHour: 23,
    endMinute: 59
  };
};

export const getApiErrorMessage = (error, fallback) => {
  const apiError = error?.response?.data?.error;
  if (apiError) return apiError;
  const validationErrors = error?.response?.data?.errors;
  if (Array.isArray(validationErrors) && validationErrors.length > 0) {
    return validationErrors[0]?.msg || fallback;
  }
  return error?.message || fallback;
};

export const normalizeColegioItem = (colegio = {}) => {
  const safeColegio = colegio && typeof colegio === 'object' ? colegio : {};
  const rectorSource = safeColegio?.rector || {};
  const rector = {
    cargo: safeColegio?.rectorCargo || rectorSource?.cargo || null,
    nombre: safeColegio?.rectorNombre || safeColegio?.rector_nombre || rectorSource?.nombre || null,
    apellido: safeColegio?.rectorApellido || safeColegio?.rector_apellido || rectorSource?.apellido || null,
    correo: safeColegio?.rectorCorreo || safeColegio?.rector_correo || rectorSource?.correo || null,
    telefono: safeColegio?.rectorTelefono || safeColegio?.rector_telefono || rectorSource?.telefono || null,
    cedula: safeColegio?.rectorCedula || safeColegio?.rector_cedula || rectorSource?.cedula || null
  };
  return {
    ...safeColegio,
    codigoDane: safeColegio?.codigoDane || safeColegio?.codigo_dane || '',
    rector,
    rectorCargo: rector.cargo || 'rector',
    rectorNombre: rector.nombre || '',
    rectorApellido: rector.apellido || '',
    rectorCorreo: rector.correo || '',
    rectorTelefono: rector.telefono || '',
    rectorCedula: rector.cedula || '',
    rectorTienePassword: Boolean(safeColegio?.rectorTienePassword)
  };
};

export const normalizeSearchText = (value = '') => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .trim();

export const normalizeStudentIdentityKey = (student = {}) => {
  const rawNombres = String(student?.nombres || '').trim();
  const rawApellidos = String(student?.apellidos || '').trim();
  if (rawNombres || rawApellidos) {
    return `${normalizeSearchText(rawNombres).replace(/\s+/g, ' ')}|${normalizeSearchText(rawApellidos).replace(/\s+/g, ' ')}`;
  }
  const fullName = String(student?.nombre || '').trim();
  if (!fullName) return '';
  const parts = fullName.split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return `${normalizeSearchText(fullName).replace(/\s+/g, ' ')}|`;
  const nombres = parts.slice(0, -1).join(' ');
  const apellidos = parts.slice(-1).join(' ');
  return `${normalizeSearchText(nombres).replace(/\s+/g, ' ')}|${normalizeSearchText(apellidos).replace(/\s+/g, ' ')}`;
};

export const normalizeStudentCodeKey = (student = {}) => normalizeSearchText(student?.codigoEstudiante || '');

export const hasDirectivoData = (colegio = {}) => Boolean(
  colegio?.rectorCargo
  || colegio?.rector?.cargo
  || colegio?.rectorNombre
  || colegio?.rectorApellido
  || colegio?.rectorCorreo
  || colegio?.rectorTelefono
  || colegio?.rectorCedula
  || colegio?.rectorTienePassword
);

export const resolveColegioNombre = (colegiosOptions = [], id) => {
  if (!id) return 'Selecciona colegio';
  return (Array.isArray(colegiosOptions) ? colegiosOptions : []).find((colegio) => String(colegio?.id) === String(id))?.nombre || `Colegio ${id}`;
};

export const resolveSedeNombre = (sedesDisponibles = [], sedeId) => {
  const parsedId = Number(sedeId);
  if (!Number.isFinite(parsedId) || parsedId <= 0) return 'Sin sede';
  return (Array.isArray(sedesDisponibles) ? sedesDisponibles : []).find((item) => Number(item?.id) === parsedId)?.nombre || `Sede ${parsedId}`;
};

export const getNivelLabel = (nivel) => {
  if (nivel === 'primaria') return 'Primaria';
  if (nivel === 'secundaria') return 'Secundaria';
  return 'Sin nivel';
};

export const getNivelShortLabel = (nivel) => {
  if (nivel === 'primaria') return 'Pri.';
  if (nivel === 'secundaria') return 'Sec.';
  return 'S/N';
};

export const sortCursosForDisplay = (items = []) => [...items].sort((a, b) => {
  const aName = String(a?.nombre || '').trim();
  const bName = String(b?.nombre || '').trim();
  return aName.localeCompare(bName, undefined, { numeric: true, sensitivity: 'base' });
});

export const buildDocenteMateriasDraft = (cursos = []) => {
  const nextValue = {};
  (Array.isArray(cursos) ? cursos : []).forEach((curso) => {
    nextValue[curso.id] = Array.isArray(curso?.materias) ? curso.materias.join(', ') : '';
  });
  return nextValue;
};

export const syncDocenteMateriasDraftWithCursos = (cursoIds = [], sourceDraft = {}) => {
  const nextValue = {};
  (Array.isArray(cursoIds) ? cursoIds : [])
    .map((id) => Number(id))
    .filter((id) => Number.isInteger(id) && id > 0)
    .forEach((cursoId) => {
      nextValue[cursoId] = sourceDraft?.[cursoId] || '';
    });
  return nextValue;
};

export const parseMateriasTexto = (value) => Array.from(
  new Set(
    String(value || '')
      .split(/[,\n]+/)
      .map((item) => item.trim())
      .filter(Boolean)
  )
);

export const buildDocenteMateriasPorCursoPayload = (cursoIds = [], materiasDraft = {}) => {
  const payload = {};
  (Array.isArray(cursoIds) ? cursoIds : [])
    .map((id) => Number(id))
    .filter((id) => Number.isInteger(id) && id > 0)
    .forEach((cursoId) => {
      payload[cursoId] = parseMateriasTexto(materiasDraft?.[cursoId]);
    });
  return payload;
};

export const normalizeMateriaOption = (value = '') => String(value || '').trim().toLowerCase();

export const getMateriasDisponiblesByCurso = (cursoId, docentePerfilCursos = []) => {
  const curso = (Array.isArray(docentePerfilCursos) ? docentePerfilCursos : []).find((item) => String(item?.id) === String(cursoId));
  const uniques = [];
  const seen = new Set();
  (Array.isArray(curso?.materias) ? curso.materias : [])
    .map((materia) => String(materia || '').trim())
    .filter(Boolean)
    .forEach((materia) => {
      const key = normalizeMateriaOption(materia);
      if (!key || seen.has(key)) return;
      seen.add(key);
      uniques.push(materia);
    });
  return uniques.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
};

export const getEstudianteMateriaOptionsByCurso = (cursoId, docentePerfilCursos = [], estudianteList = []) => {
  const uniques = [];
  const seen = new Set();
  const pushMateria = (materia) => {
    const value = String(materia || '').trim();
    const key = normalizeMateriaOption(value);
    if (!key || seen.has(key)) return;
    seen.add(key);
    uniques.push(value);
  };

  getMateriasDisponiblesByCurso(cursoId, docentePerfilCursos).forEach(pushMateria);
  (Array.isArray(estudianteList) ? estudianteList : []).forEach((estudiante) => {
    (Array.isArray(estudiante?.materias) ? estudiante.materias : []).forEach(pushMateria);
  });

  return uniques.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
};
