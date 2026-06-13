import useReportesActions from './useReportesActions';

export default function useHomeReportActions({
  user,
  reportesState,
  feedback,
  services,
  derived,
  academicActions
}) {
  const reportesActions = useReportesActions({
    ...reportesState,
    user,
    canAdminFilterReportSchools: derived.canAdminFilterReportSchools,
    currentYear: derived.currentYear,
    getCursos: services.getCursos,
    getReporteInasistenciaCurso: services.getReporteInasistenciaCurso,
    sortCursosForDisplay: services.sortCursosForDisplay,
    loadColegios: academicActions.schoolActions.loadColegios,
    getApiErrorMessage: services.getApiErrorMessage,
    showAppAlert: feedback.showAppAlert
  });

  return {
    reportesActions
  };
}
