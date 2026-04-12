export const ALL_MATERIAS_OPTION = '__all_materias__';

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
  const now = latestDateMatch
    ? new Date(Number(latestDateMatch[1]), Number(latestDateMatch[2]) - 1, Number(latestDateMatch[3]))
    : new Date();
  if (latestPeriodo?.fechaFin) now.setDate(now.getDate() + 1);
  const end = new Date(now);
  end.setDate(end.getDate() + 30);
  return {
    nombre: `Periodo ${safePeriodList.length + 1 || 1}`,
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
