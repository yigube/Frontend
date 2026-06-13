export const MAX_PERIODS_PER_YEAR = 4;
export const PERIOD_DURATION_DAYS = 70;

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const parsePeriodDateParts = (value, fallbackYear) => {
  const safeFallbackYear = Number.isFinite(Number(fallbackYear)) ? Number(fallbackYear) : new Date().getFullYear();
  if (!value) return { day: 1, month: 1, year: safeFallbackYear, hour: 0, minute: 0, second: 0 };

  const text = String(value || '').trim();
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?/);
  if (match) {
    const [, yearRaw, monthRaw, dayRaw, hourRaw = '00', minuteRaw = '00', secondRaw = '00'] = match;
    const year = parseInt(yearRaw, 10);
    const month = parseInt(monthRaw, 10);
    const day = parseInt(dayRaw, 10);
    const hour = parseInt(hourRaw, 10);
    const minute = parseInt(minuteRaw, 10);
    const second = parseInt(secondRaw, 10);
    return {
      day: Number.isFinite(day) ? day : 1,
      month: Number.isFinite(month) ? month : 1,
      year: Number.isFinite(year) ? year : safeFallbackYear,
      hour: Number.isFinite(hour) ? hour : 0,
      minute: Number.isFinite(minute) ? minute : 0,
      second: Number.isFinite(second) ? second : 0
    };
  }

  const parsed = new Date(text);
  if (!Number.isFinite(parsed.getTime())) {
    return { day: 1, month: 1, year: safeFallbackYear, hour: 0, minute: 0, second: 0 };
  }

  return {
    day: parsed.getUTCDate(),
    month: parsed.getUTCMonth() + 1,
    year: parsed.getUTCFullYear(),
    hour: parsed.getUTCHours(),
    minute: parsed.getUTCMinutes(),
    second: parsed.getUTCSeconds()
  };
};

export const buildPeriodDate = ({ day, month, year, hour = 0, minute = 0 }) => {
  const d = String(day).padStart(2, '0');
  const m = String(month).padStart(2, '0');
  const h = String(hour).padStart(2, '0');
  const min = String(minute).padStart(2, '0');
  return `${year}-${m}-${d}T${h}:${min}:00`;
};

export const formatPeriodDateLabel = (value, monthNames = [], fallbackYear) => {
  const { day, month, year } = parsePeriodDateParts(value, fallbackYear);
  const monthLabel = monthNames[month - 1] || '';
  return `${day} de ${monthLabel} de ${year}`;
};

export const formatPeriodTimeLabel = (value, fallbackYear) => {
  const { hour, minute } = parsePeriodDateParts(value, fallbackYear);
  const hour24 = Number.isFinite(hour) ? hour : 0;
  const minuteValue = Number.isFinite(minute) ? minute : 0;
  const meridiem = hour24 >= 12 ? 'p. m.' : 'a. m.';
  const hour12 = hour24 % 12 || 12;
  return `${String(hour12).padStart(2, '0')}:${String(minuteValue).padStart(2, '0')} ${meridiem}`;
};

export const formatPeriodSummaryLabel = (fechaInicio, fechaFin, monthNames = [], fallbackYear) => (
  `Del ${formatPeriodDateLabel(fechaInicio, monthNames, fallbackYear)} al ${formatPeriodDateLabel(fechaFin, monthNames, fallbackYear)}`
);

export const getPeriodDurationLabel = (fechaInicio, fechaFin, fallbackYear) => {
  const inicio = parsePeriodDateParts(fechaInicio, fallbackYear);
  const fin = parsePeriodDateParts(fechaFin, fallbackYear);
  const startDate = new Date(inicio.year, inicio.month - 1, inicio.day);
  const endDate = new Date(fin.year, fin.month - 1, fin.day);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return '';
  const diffDays = Math.round((endDate - startDate) / DAY_IN_MS) + 1;
  const safeDays = diffDays > 0 ? diffDays : 1;
  return `${safeDays} ${safeDays === 1 ? 'd\u00eda' : 'd\u00edas'}`;
};

export const getPeriodoComparableValue = (value) => {
  if (value instanceof Date) {
    const year = value.getUTCFullYear();
    const month = String(value.getUTCMonth() + 1).padStart(2, '0');
    const day = String(value.getUTCDate()).padStart(2, '0');
    const hour = String(value.getUTCHours()).padStart(2, '0');
    const minute = String(value.getUTCMinutes()).padStart(2, '0');
    const second = String(value.getUTCSeconds()).padStart(2, '0');
    return Number(`${year}${month}${day}${hour}${minute}${second}`);
  }

  const text = String(value || '').trim();
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?/);
  if (match) {
    const [, year, month, day, hour = '00', minute = '00', second = '00'] = match;
    return Number(`${year}${month}${day}${hour}${minute}${second}`);
  }

  const parsed = new Date(text);
  if (!Number.isFinite(parsed.getTime())) return Number.NaN;
  return getPeriodoComparableValue(parsed);
};

export const sortPeriodosByStartDate = (list) => [...(list || [])].sort((a, b) => {
  const aDate = getPeriodoComparableValue(a?.fechaInicio);
  const bDate = getPeriodoComparableValue(b?.fechaInicio);
  if (aDate !== bDate) return aDate - bDate;
  return Number(a?.id || 0) - Number(b?.id || 0);
});

export const buildNormalizedPeriodoNameUpdates = (list) => (
  sortPeriodosByStartDate(list)
    .map((periodo, idx) => ({
      id: periodo.id,
      nombre: `Periodo ${idx + 1}`,
      currentName: (periodo.nombre || '').trim()
    }))
    .filter((item) => item.currentName !== item.nombre)
);

export const buildPeriodPayloadFromForm = (periodForm, { nombre, schoolId }) => ({
  nombre,
  fechaInicio: buildPeriodDate({
    day: periodForm.startDay,
    month: periodForm.startMonth,
    year: periodForm.startYear,
    hour: periodForm.startHour,
    minute: periodForm.startMinute
  }),
  fechaFin: buildPeriodDate({
    day: periodForm.endDay,
    month: periodForm.endMonth,
    year: periodForm.endYear,
    hour: periodForm.endHour,
    minute: periodForm.endMinute
  }),
  activo: true,
  schoolId
});

export const buildPeriodFormFromPeriodo = (periodo, fallbackYear) => {
  const ini = parsePeriodDateParts(periodo?.fechaInicio, fallbackYear);
  const fin = parsePeriodDateParts(periodo?.fechaFin, fallbackYear);
  return {
    nombre: periodo?.nombre || '',
    startDay: ini.day,
    startMonth: ini.month,
    startYear: ini.year,
    startHour: ini.hour,
    startMinute: ini.minute,
    endDay: fin.day,
    endMonth: fin.month,
    endYear: fin.year,
    endHour: fin.hour,
    endMinute: fin.minute
  };
};

const getPeriodoLocalDate = (value, fallbackYear) => {
  const { day, month, year } = parsePeriodDateParts(value, fallbackYear);
  const date = new Date(year, month - 1, day);
  return Number.isFinite(date.getTime()) ? date : null;
};

const addPeriodoDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const isSamePeriodoDay = (left, right) => (
  left?.getFullYear() === right?.getFullYear()
  && left?.getMonth() === right?.getMonth()
  && left?.getDate() === right?.getDate()
);

export const getPeriodoRangeError = (fechaInicio, fechaFin) => {
  const startValue = getPeriodoComparableValue(fechaInicio);
  const endValue = getPeriodoComparableValue(fechaFin);
  if (!Number.isFinite(startValue) || !Number.isFinite(endValue)) return 'Las fechas del periodo no son validas';
  if (startValue >= endValue) return 'La fecha de inicio debe ser anterior a la fecha de fin';
  return '';
};

export const getPeriodoSequenceError = ({
  fechaInicio,
  fechaFin,
  periodos = [],
  editingPeriodo = null,
  fallbackYear,
  monthNames = []
}) => {
  const startValue = getPeriodoComparableValue(fechaInicio);
  const endValue = getPeriodoComparableValue(fechaFin);
  if (!Number.isFinite(startValue) || !Number.isFinite(endValue)) return '';

  const startDate = getPeriodoLocalDate(fechaInicio, fallbackYear);
  const endDate = getPeriodoLocalDate(fechaFin, fallbackYear);
  if (!startDate || !endDate) return '';

  const durationDays = Math.round((endDate - startDate) / DAY_IN_MS) + 1;
  if (durationDays !== PERIOD_DURATION_DAYS) {
    return 'Cada periodo debe durar exactamente 10 semanas';
  }

  const otherPeriodos = (periodos || []).filter((item) => String(item?.id) !== String(editingPeriodo?.id || ''));
  const startYear = startDate.getFullYear();
  const periodosInStartYear = otherPeriodos.filter((item) => {
    const itemStartDate = getPeriodoLocalDate(item?.fechaInicio, fallbackYear);
    return itemStartDate?.getFullYear() === startYear;
  });

  if (!editingPeriodo && periodosInStartYear.length >= MAX_PERIODS_PER_YEAR) {
    return `Solo se permiten ${MAX_PERIODS_PER_YEAR} periodos por a\u00f1o`;
  }
  if (!otherPeriodos.length) return '';

  const overlapping = otherPeriodos.find((item) => {
    const itemStart = getPeriodoComparableValue(item?.fechaInicio);
    const itemEnd = getPeriodoComparableValue(item?.fechaFin);
    return startValue <= itemEnd && endValue >= itemStart;
  });
  if (overlapping) {
    return `Las fechas se cruzan con ${overlapping.nombre}. Un periodo posterior debe iniciar despues de que termine el anterior`;
  }

  if (!editingPeriodo) {
    const latestPeriodoInYear = periodosInStartYear.reduce((latest, current) => {
      const latestEnd = getPeriodoComparableValue(latest?.fechaFin);
      const currentEnd = getPeriodoComparableValue(current?.fechaFin);
      return currentEnd > latestEnd ? current : latest;
    }, periodosInStartYear[0]);
    if (latestPeriodoInYear) {
      const latestEndDate = getPeriodoLocalDate(latestPeriodoInYear?.fechaFin, fallbackYear);
      const expectedStart = latestEndDate ? addPeriodoDays(latestEndDate, 1) : null;
      if (expectedStart && !isSamePeriodoDay(startDate, expectedStart)) {
        return `El nuevo periodo debe iniciar el ${formatPeriodDateLabel(buildPeriodDate({
          day: expectedStart.getDate(),
          month: expectedStart.getMonth() + 1,
          year: expectedStart.getFullYear()
        }), monthNames, fallbackYear)}, despues de que termine ${latestPeriodoInYear?.nombre || 'el ultimo periodo registrado'}`;
      }
    }
  }

  return '';
};
