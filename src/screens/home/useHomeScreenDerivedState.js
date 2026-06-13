import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  ALL_MATERIAS_OPTION,
  hasDirectivoData,
  normalizeColegioItem,
  normalizeSearchText,
  resolveColegioNombre,
  resolveSedeNombre
} from './homeUtils';
import {
  formatPeriodDateLabel,
  formatPeriodSummaryLabel,
  formatPeriodTimeLabel,
  getPeriodDurationLabel as getPeriodDurationLabelBase,
  getPeriodoSequenceError as getPeriodoSequenceErrorBase
} from './periodUtils';

export default function useHomeScreenDerivedState({
  user,
  isAdmin,
  isDocente,
  isRectorCoordinador,
  isMobileApp,
  styles,
  periodos,
  editingPeriodo,
  cursosAsignados,
  cursoSeleccionado,
  estudianteCreateCursoId,
  estudiantes,
  estudianteMateriaFiltro,
  reportesCursos,
  reportesCursoId,
  reportesMes,
  docentes,
  adminDocentesSearchTerm,
  docentesSearchTerm,
  colegioSeleccionado,
  colegiosList,
  rectoresSearchTerm,
  colegiosOptions,
  sedesDisponibles,
  reportesColegioId,
  getDocentes,
  getMateriasDisponiblesByCurso,
  getEstudianteMateriaOptionsByCurso,
  normalizeMateriaOption
}) {
  const [docentePerfilCursos, setDocentePerfilCursos] = useState([]);
  const [docentePerfilLoading, setDocentePerfilLoading] = useState(false);
  const [docentePerfilError, setDocentePerfilError] = useState('');

  const currentYear = new Date().getFullYear();
  const monthNames = useMemo(
    () => ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    []
  );
  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const years = useMemo(() => Array.from({ length: 6 }, (_, i) => currentYear - 2 + i), [currentYear]);
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const minutes = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);
  const pad2 = useCallback((value) => String(value).padStart(2, '0'), []);
  const getDaysInMonth = useCallback((year, month) => new Date(year, month, 0).getDate(), []);

  const reportMonthOptions = useMemo(
    () => months.map((month) => ({ value: month, label: `${monthNames[month - 1]} ${currentYear}` })),
    [months, monthNames, currentYear]
  );
  const reportDayOptions = useMemo(
    () => Array.from({ length: getDaysInMonth(currentYear, reportesMes) }, (_, index) => index + 1),
    [currentYear, getDaysInMonth, reportesMes]
  );

  const loadDocentePerfilMaterias = useCallback(async () => {
    if (!isDocente || !user?.schoolId) {
      setDocentePerfilCursos([]);
      setDocentePerfilError('');
      return;
    }

    setDocentePerfilLoading(true);
    setDocentePerfilError('');
    try {
      const data = await getDocentes({ schoolId: user.schoolId });
      const byId = (data || []).find((docente) => String(docente?.id) === String(user?.id));
      const byEmail = (data || []).find(
        (docente) => String(docente?.email || '').toLowerCase() === String(user?.email || '').toLowerCase()
      );
      const currentDocente = byId || byEmail || null;
      setDocentePerfilCursos(Array.isArray(currentDocente?.cursos) ? currentDocente.cursos : []);
    } catch (e) {
      setDocentePerfilCursos([]);
      setDocentePerfilError(e?.response?.data?.error || e?.message || 'No se pudieron cargar tus materias');
    } finally {
      setDocentePerfilLoading(false);
    }
  }, [getDocentes, isDocente, user?.email, user?.id, user?.schoolId]);

  useEffect(() => {
    if (!isDocente) {
      setDocentePerfilCursos([]);
      setDocentePerfilError('');
      return;
    }
    loadDocentePerfilMaterias();
  }, [isDocente, loadDocentePerfilMaterias]);

  useFocusEffect(
    React.useCallback(() => {
      if (!isDocente) return undefined;
      loadDocentePerfilMaterias();
      return undefined;
    }, [isDocente, loadDocentePerfilMaterias])
  );

  const formatPeriodDate = useCallback(
    (value) => formatPeriodDateLabel(value, monthNames, currentYear),
    [currentYear, monthNames]
  );
  const formatPeriodTime = useCallback(
    (value) => formatPeriodTimeLabel(value, currentYear),
    [currentYear]
  );
  const formatPeriodSummary = useCallback(
    (fechaInicio, fechaFin) => formatPeriodSummaryLabel(fechaInicio, fechaFin, monthNames, currentYear),
    [currentYear, monthNames]
  );
  const getPeriodDurationLabel = useCallback(
    (fechaInicio, fechaFin) => getPeriodDurationLabelBase(fechaInicio, fechaFin, currentYear),
    [currentYear]
  );
  const getPeriodoSequenceError = useCallback(
    (fechaInicio, fechaFin) => getPeriodoSequenceErrorBase({
      fechaInicio,
      fechaFin,
      periodos,
      editingPeriodo,
      fallbackYear: currentYear,
      monthNames
    }),
    [currentYear, editingPeriodo, monthNames, periodos]
  );

  const cursoSeleccionadoNombre = useMemo(
    () => (cursoSeleccionado
      ? (cursosAsignados.find((c) => c.id === cursoSeleccionado)?.nombre || 'Curso sin nombre')
      : 'Selecciona curso'),
    [cursoSeleccionado, cursosAsignados]
  );
  const estudianteCreateCursoNombre = useMemo(
    () => (estudianteCreateCursoId
      ? (cursosAsignados.find((c) => c.id === estudianteCreateCursoId)?.nombre || 'Curso sin nombre')
      : 'Selecciona curso'),
    [cursosAsignados, estudianteCreateCursoId]
  );
  const estudianteCreateMateriasDisponibles = useMemo(
    () => (estudianteCreateCursoId ? getMateriasDisponiblesByCurso(estudianteCreateCursoId, docentePerfilCursos) : []),
    [docentePerfilCursos, estudianteCreateCursoId, getMateriasDisponiblesByCurso]
  );
  const estudiantesMateriasDisponibles = useMemo(
    () => (cursoSeleccionado ? getEstudianteMateriaOptionsByCurso(cursoSeleccionado, docentePerfilCursos, estudiantes) : []),
    [cursoSeleccionado, docentePerfilCursos, estudiantes, getEstudianteMateriaOptionsByCurso]
  );
  const estudiantesFiltrados = useMemo(
    () => (estudianteMateriaFiltro !== ALL_MATERIAS_OPTION
      ? estudiantes.filter((estudiante) => (
          Array.isArray(estudiante?.materias)
          && estudiante.materias.some((materia) => normalizeMateriaOption(materia) === normalizeMateriaOption(estudianteMateriaFiltro))
        ))
      : estudiantes),
    [estudianteMateriaFiltro, estudiantes, normalizeMateriaOption]
  );
  const reportesCursoNombre = useMemo(
    () => (reportesCursoId
      ? (reportesCursos.find((curso) => String(curso.id) === String(reportesCursoId))?.nombre || 'Curso sin nombre')
      : 'Selecciona curso'),
    [reportesCursoId, reportesCursos]
  );

  const mobileActionBtnStyle = isMobileApp ? styles.actionBtnMobile : null;
  const mobileActionTextStyle = isMobileApp ? styles.actionBtnTextMobile : null;
  const mobileBtnRowStyle = isMobileApp ? styles.btnRowMobile : null;
  const mobileDocenteRowStyle = isDocente && isMobileApp ? styles.btnRowMobileStacked : null;
  const mobileDocenteTextStyle = isDocente && isMobileApp ? styles.actionBtnTextMobileStacked : null;
  const mobileLongLabelRowStyle = (isRectorCoordinador || isAdmin) && isMobileApp ? styles.btnRowMobileStacked : null;
  const mobileLongLabelTextStyle = (isRectorCoordinador || isAdmin) && isMobileApp ? styles.actionBtnTextMobileStacked : null;
  const mobileGridLogoutRowStyle = isDocente ? mobileDocenteRowStyle : mobileLongLabelRowStyle;
  const mobileGridLogoutTextStyle = isDocente ? mobileDocenteTextStyle : mobileLongLabelTextStyle;
  const mobileColegioControlsRowStyle = isMobileApp ? styles.colegioControlsRowMobile : null;
  const mobileColegioControlBtnStyle = isMobileApp ? styles.colegioControlBtnMobile : null;
  const mobileColegioControlRowStyle = isMobileApp ? styles.colegioControlBtnRowMobile : null;
  const mobileColegioControlTextStyle = isMobileApp ? styles.colegioControlBtnTextMobile : null;
  const showMobileGridLogout = isMobileApp && !isRectorCoordinador && !isDocente && !isAdmin;

  const docenteMateriasAsignadasTotal = useMemo(
    () => docentePerfilCursos.reduce(
      (total, curso) => total + (Array.isArray(curso?.materias) ? curso.materias.length : 0),
      0
    ),
    [docentePerfilCursos]
  );

  const docentesSearchNormalized = normalizeSearchText(docentesSearchTerm);
  const docentesFiltrados = useMemo(
    () => (docentesSearchNormalized
      ? docentes.filter((docente) => normalizeSearchText(docente?.nombre || '').includes(docentesSearchNormalized))
      : docentes),
    [docentes, docentesSearchNormalized]
  );
  const docentesSearchSuggestions = docentesSearchNormalized ? docentesFiltrados.slice(0, 6) : [];

  const adminDocentesSearchNormalized = normalizeSearchText(adminDocentesSearchTerm);
  const adminDocentesFiltrados = useMemo(
    () => (adminDocentesSearchNormalized
      ? docentes.filter((docente) => {
          const nombre = normalizeSearchText(docente?.nombre || '');
          const correo = normalizeSearchText(docente?.email || '');
          const cursosText = normalizeSearchText(
            Array.isArray(docente?.cursos)
              ? docente.cursos.map((curso) => curso?.nombre || `curso ${curso?.id || ''}`).join(' ')
              : ''
          );
          const materiasText = normalizeSearchText(
            Array.isArray(docente?.cursos)
              ? docente.cursos.flatMap((curso) => (Array.isArray(curso?.materias) ? curso.materias : [])).join(' ')
              : ''
          );
          const blob = `${nombre} ${correo} ${cursosText} ${materiasText}`;
          return blob.includes(adminDocentesSearchNormalized);
        })
      : docentes),
    [adminDocentesSearchNormalized, docentes]
  );

  const rectoresSearchNormalized = normalizeSearchText(rectoresSearchTerm);
  const rectoresRegistrados = useMemo(
    () => (colegiosList || [])
      .map((item) => normalizeColegioItem(item))
      .filter((colegio) => hasDirectivoData(colegio))
      .map((colegio) => {
        const cargoValue = (colegio?.rectorCargo || 'rector').toLowerCase();
        const cargoLabel = cargoValue === 'coordinador' ? 'Coordinador' : 'Rector';
        const nombreCompleto = [colegio?.rectorNombre, colegio?.rectorApellido].filter(Boolean).join(' ').trim();
        return {
          id: colegio.id,
          cargo: cargoValue,
          cargoLabel,
          nombreCompleto,
          nombre: colegio?.rectorNombre || '',
          apellido: colegio?.rectorApellido || '',
          colegioNombre: colegio?.nombre || `Colegio ${colegio?.id}`,
          correo: colegio?.rectorCorreo || '',
          telefono: colegio?.rectorTelefono || '',
          cedula: colegio?.rectorCedula || '',
          colegio
        };
      }),
    [colegiosList]
  );
  const rectoresFiltrados = useMemo(
    () => (rectoresSearchNormalized
      ? rectoresRegistrados.filter((rector) => {
          const blob = normalizeSearchText(
            `${rector?.nombreCompleto || ''} ${rector?.colegioNombre || ''} ${rector?.correo || ''} ${rector?.telefono || ''} ${rector?.cedula || ''} ${rector?.cargoLabel || ''}`
          );
          return blob.includes(rectoresSearchNormalized);
        })
      : rectoresRegistrados),
    [rectoresRegistrados, rectoresSearchNormalized]
  );

  const resolveColegioNombreForView = useCallback((id) => resolveColegioNombre(colegiosOptions, id), [colegiosOptions]);
  const resolveSedeNombreForView = useCallback((id) => resolveSedeNombre(sedesDisponibles, id), [sedesDisponibles]);
  const colegioSeleccionadoNombre = resolveColegioNombreForView(colegioSeleccionado);
  const reportesColegioNombre = resolveColegioNombreForView(reportesColegioId || user?.schoolId);

  return {
    docentePerfilCursos,
    docentePerfilLoading,
    docentePerfilError,
    docenteMateriasAsignadasTotal,
    days,
    months,
    currentYear,
    years,
    hours,
    minutes,
    monthNames,
    pad2,
    reportMonthOptions,
    reportDayOptions,
    formatPeriodDate,
    formatPeriodTime,
    formatPeriodSummary,
    getPeriodDurationLabel,
    getPeriodoSequenceError,
    cursoSeleccionadoNombre,
    estudianteCreateCursoNombre,
    estudianteCreateMateriasDisponibles,
    estudiantesMateriasDisponibles,
    estudiantesFiltrados,
    reportesCursoNombre,
    mobileActionBtnStyle,
    mobileActionTextStyle,
    mobileBtnRowStyle,
    mobileDocenteRowStyle,
    mobileDocenteTextStyle,
    mobileLongLabelRowStyle,
    mobileLongLabelTextStyle,
    mobileGridLogoutRowStyle,
    mobileGridLogoutTextStyle,
    mobileColegioControlsRowStyle,
    mobileColegioControlBtnStyle,
    mobileColegioControlRowStyle,
    mobileColegioControlTextStyle,
    showMobileGridLogout,
    docentesSearchNormalized,
    docentesFiltrados,
    docentesSearchSuggestions,
    adminDocentesFiltrados,
    rectoresRegistrados,
    rectoresFiltrados,
    resolveColegioNombreForView,
    resolveSedeNombreForView,
    colegioSeleccionadoNombre,
    reportesColegioNombre
  };
}
