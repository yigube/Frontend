import {
  buildPeriodFormFromPeriodo,
  buildNormalizedPeriodoNameUpdates,
  buildPeriodPayloadFromForm,
  getPeriodDurationLabel,
  getPeriodoRangeError,
  getPeriodoSequenceError,
  parsePeriodDateParts,
  sortPeriodosByStartDate
} from './periodUtils';

const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

describe('periodUtils', () => {
  it('parsea fechas ISO con hora y minuto', () => {
    expect(parsePeriodDateParts('2026-06-06T23:59:00', 2026)).toEqual({
      day: 6,
      month: 6,
      year: 2026,
      hour: 23,
      minute: 59,
      second: 0
    });
  });

  it('calcula duracion inclusiva de 10 semanas como 70 dias', () => {
    expect(getPeriodDurationLabel('2026-06-06T00:00:00', '2026-08-14T23:59:00', 2026)).toBe('70 d\u00edas');
  });

  it('rechaza rangos donde inicio no es anterior a fin', () => {
    expect(getPeriodoRangeError('2026-06-06T00:00:00', '2026-06-06T00:00:00')).toBe('La fecha de inicio debe ser anterior a la fecha de fin');
  });

  it('exige que un nuevo periodo inicie al dia siguiente del anterior', () => {
    const periodos = [
      { id: 1, nombre: 'Periodo 1', fechaInicio: '2026-01-01T00:00:00', fechaFin: '2026-03-11T23:59:00' }
    ];

    expect(getPeriodoSequenceError({
      fechaInicio: '2026-03-13T00:00:00',
      fechaFin: '2026-05-21T23:59:00',
      periodos,
      fallbackYear: 2026,
      monthNames
    })).toContain('El nuevo periodo debe iniciar el 12 de marzo de 2026');
  });

  it('permite crear el siguiente periodo cuando inicia al dia siguiente', () => {
    const periodos = [
      { id: 1, nombre: 'Periodo 1', fechaInicio: '2026-01-01T00:00:00', fechaFin: '2026-03-11T23:59:00' }
    ];

    expect(getPeriodoSequenceError({
      fechaInicio: '2026-03-12T00:00:00',
      fechaFin: '2026-05-20T23:59:00',
      periodos,
      fallbackYear: 2026,
      monthNames
    })).toBe('');
  });

  it('rechaza edicion de periodo cuando se cruza con otro periodo', () => {
    const periodos = [
      { id: 1, nombre: 'Periodo 1', fechaInicio: '2026-01-01T00:00:00', fechaFin: '2026-03-11T23:59:00' },
      { id: 2, nombre: 'Periodo 2', fechaInicio: '2026-03-12T00:00:00', fechaFin: '2026-05-20T23:59:00' }
    ];

    expect(getPeriodoSequenceError({
      fechaInicio: '2026-03-10T00:00:00',
      fechaFin: '2026-05-18T23:59:00',
      periodos,
      editingPeriodo: periodos[1],
      fallbackYear: 2026,
      monthNames
    })).toContain('Las fechas se cruzan con Periodo 1');
  });

  it('limita la creacion a 4 periodos por anio', () => {
    const periodos = [
      { id: 1, nombre: 'Periodo 1', fechaInicio: '2026-01-01T00:00:00', fechaFin: '2026-03-11T23:59:00' },
      { id: 2, nombre: 'Periodo 2', fechaInicio: '2026-03-12T00:00:00', fechaFin: '2026-05-20T23:59:00' },
      { id: 3, nombre: 'Periodo 3', fechaInicio: '2026-05-21T00:00:00', fechaFin: '2026-07-29T23:59:00' },
      { id: 4, nombre: 'Periodo 4', fechaInicio: '2026-07-30T00:00:00', fechaFin: '2026-10-07T23:59:00' }
    ];

    expect(getPeriodoSequenceError({
      fechaInicio: '2026-10-08T00:00:00',
      fechaFin: '2026-12-16T23:59:00',
      periodos,
      fallbackYear: 2026,
      monthNames
    })).toBe('Solo se permiten 4 periodos por a\u00f1o');
  });

  it('ordena periodos por fecha de inicio y luego por id', () => {
    const periodos = [
      { id: 3, nombre: 'Periodo 3', fechaInicio: '2026-03-12T00:00:00' },
      { id: 2, nombre: 'Periodo 2', fechaInicio: '2026-01-01T00:00:00' },
      { id: 1, nombre: 'Periodo 1', fechaInicio: '2026-01-01T00:00:00' }
    ];

    expect(sortPeriodosByStartDate(periodos).map((periodo) => periodo.id)).toEqual([1, 2, 3]);
  });

  it('genera solo las actualizaciones de nombres necesarias', () => {
    const periodos = [
      { id: 20, nombre: 'Segundo', fechaInicio: '2026-03-12T00:00:00' },
      { id: 10, nombre: 'Periodo 1', fechaInicio: '2026-01-01T00:00:00' }
    ];

    expect(buildNormalizedPeriodoNameUpdates(periodos)).toEqual([
      { id: 20, nombre: 'Periodo 2', currentName: 'Segundo' }
    ]);
  });

  it('construye el payload de guardado desde el formulario', () => {
    const payload = buildPeriodPayloadFromForm({
      startDay: 6,
      startMonth: 6,
      startYear: 2026,
      startHour: 8,
      startMinute: 30,
      endDay: 14,
      endMonth: 8,
      endYear: 2026,
      endHour: 23,
      endMinute: 59
    }, { nombre: 'Periodo 2', schoolId: 5 });

    expect(payload).toEqual({
      nombre: 'Periodo 2',
      fechaInicio: '2026-06-06T08:30:00',
      fechaFin: '2026-08-14T23:59:00',
      activo: true,
      schoolId: 5
    });
  });

  it('convierte un periodo guardado al formulario de edicion', () => {
    expect(buildPeriodFormFromPeriodo({
      nombre: 'Periodo 2',
      fechaInicio: '2026-06-06T08:30:00',
      fechaFin: '2026-08-14T23:59:00'
    }, 2026)).toEqual({
      nombre: 'Periodo 2',
      startDay: 6,
      startMonth: 6,
      startYear: 2026,
      startHour: 8,
      startMinute: 30,
      endDay: 14,
      endMonth: 8,
      endYear: 2026,
      endHour: 23,
      endMinute: 59
    });
  });
});
