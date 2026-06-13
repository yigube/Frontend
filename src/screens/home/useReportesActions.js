import { useEffect } from 'react';

export default function useReportesActions({
  user,
  reportesModalVisible,
  reportesColegioId,
  reportesCursoId,
  reportesMes,
  reportesDia,
  canAdminFilterReportSchools,
  currentYear,
  getCursos,
  getReporteInasistenciaCurso,
  sortCursosForDisplay,
  loadColegios,
  getApiErrorMessage,
  showAppAlert,
  setReportesModalVisible,
  setReportesColegioId,
  setReportesColegioPickerOpen,
  setReportesCursoPickerOpen,
  setReportesMesPickerOpen,
  setReportesDiaPickerOpen,
  setReportesCursos,
  setReportesCursoId,
  setReportesLoading,
  setReportesBootLoading,
  setReportesError,
  setReportesDetalle,
  setReportesMes,
  setReportesDia
}) {
  const pad2 = (value) => String(value).padStart(2, '0');

  const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();

  const loadCursosReporteInasistencia = async (schoolIdParam = null) => {
    const schoolId = Number(schoolIdParam || reportesColegioId || user?.schoolId);
    if (!schoolId) {
      setReportesCursos([]);
      setReportesCursoId(null);
      return [];
    }

    const cursos = await getCursos({ schoolId });
    const ordered = sortCursosForDisplay(cursos);
    setReportesCursos(ordered);
    setReportesCursoId((prev) => {
      const hasPrev = ordered.some((curso) => String(curso.id) === String(prev));
      return hasPrev ? prev : (ordered[0]?.id || null);
    });
    return ordered;
  };

  const openReportesModal = async () => {
    setReportesModalVisible(true);
    setReportesColegioPickerOpen(false);
    setReportesCursoPickerOpen(false);
    setReportesMesPickerOpen(false);
    setReportesDiaPickerOpen(false);
    setReportesError('');
    setReportesDetalle(null);
    setReportesBootLoading(true);
    try {
      if (canAdminFilterReportSchools) {
        const colegios = await loadColegios({
          preferId: reportesColegioId || user?.schoolId || null,
          preferName: user?.schoolName
        });
        const defaultSchoolId = Number(reportesColegioId || user?.schoolId || colegios?.[0]?.id || null) || null;
        setReportesColegioId(defaultSchoolId);
        await loadCursosReporteInasistencia(defaultSchoolId);
      } else {
        const schoolId = Number(user?.schoolId || reportesColegioId || null) || null;
        setReportesColegioId(schoolId);
        await loadCursosReporteInasistencia(schoolId);
      }
    } catch (e) {
      setReportesError(getApiErrorMessage(e, 'No se pudieron cargar los cursos'));
    } finally {
      setReportesBootLoading(false);
    }
  };

  const closeReportesModal = () => {
    setReportesModalVisible(false);
    setReportesColegioPickerOpen(false);
    setReportesCursoPickerOpen(false);
    setReportesMesPickerOpen(false);
    setReportesDiaPickerOpen(false);
    setReportesLoading(false);
    setReportesError('');
    setReportesDetalle(null);
  };

  const resetReportesFilters = () => {
    const today = new Date();
    setReportesMes(today.getMonth() + 1);
    setReportesDia(today.getDate());
    setReportesColegioPickerOpen(false);
    setReportesCursoPickerOpen(false);
    setReportesMesPickerOpen(false);
    setReportesDiaPickerOpen(false);
    setReportesError('');
    setReportesDetalle(null);
  };

  const handleGenerateInasistenciaReport = async () => {
    if (canAdminFilterReportSchools && !reportesColegioId) {
      showAppAlert('Institucion requerida', 'Selecciona una institucion para generar el reporte', 'warning');
      return;
    }
    if (!reportesCursoId) {
      showAppAlert('Curso requerido', 'Selecciona un curso para generar el reporte', 'warning');
      return;
    }

    setReportesLoading(true);
    setReportesError('');
    try {
      const data = await getReporteInasistenciaCurso({
        cursoId: reportesCursoId,
        mes: `${currentYear}-${pad2(reportesMes)}`,
        fecha: `${currentYear}-${pad2(reportesMes)}-${pad2(reportesDia)}`
      });
      setReportesDetalle(data);
    } catch (e) {
      const message = getApiErrorMessage(e, 'No se pudo generar el reporte');
      setReportesError(message);
      setReportesDetalle(null);
    } finally {
      setReportesLoading(false);
    }
  };

  useEffect(() => {
    const maxDay = getDaysInMonth(currentYear, reportesMes);
    if (reportesDia > maxDay) {
      setReportesDia(maxDay);
    }
  }, [currentYear, reportesDia, reportesMes, setReportesDia]);

  useEffect(() => {
    if (!reportesModalVisible || !canAdminFilterReportSchools) return;
    const selectedSchoolId = Number(reportesColegioId);
    if (!Number.isFinite(selectedSchoolId) || selectedSchoolId <= 0) {
      setReportesCursos([]);
      setReportesCursoId(null);
      return;
    }
    (async () => {
      try {
        setReportesBootLoading(true);
        setReportesError('');
        setReportesDetalle(null);
        await loadCursosReporteInasistencia(selectedSchoolId);
      } catch (e) {
        setReportesError(getApiErrorMessage(e, 'No se pudieron cargar los cursos'));
      } finally {
        setReportesBootLoading(false);
      }
    })();
  }, [
    canAdminFilterReportSchools,
    reportesColegioId,
    reportesModalVisible,
    setReportesBootLoading,
    setReportesCursos,
    setReportesCursoId,
    setReportesDetalle,
    setReportesError
  ]);

  return {
    loadCursosReporteInasistencia,
    openReportesModal,
    closeReportesModal,
    resetReportesFilters,
    handleGenerateInasistenciaReport
  };
}
