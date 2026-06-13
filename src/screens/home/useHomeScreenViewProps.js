export default function useHomeScreenViewProps({
  app,
  rolePanel,
  docentePanel,
  estudiantesCreate,
  estudiantesList,
  periodos,
  cursos,
  colegios,
  docentes,
  reportes,
  globalModals
}) {
  const rolePanelProps = {
    styles: app.styles,
    user: app.user,
    teacherInitial: app.teacherInitial,
    isAdmin: app.isAdmin,
    isDocente: app.isDocente,
    isRectorCoordinador: app.isRectorCoordinador,
    canManageCourses: app.canManageCourses,
    canManagePeriods: app.canManagePeriods,
    isMobileApp: app.isMobileApp,
    logout: app.logout,
    ...rolePanel
  };

  const modalProps = {
    styles: app.styles,
    user: app.user,
    isAdmin: app.isAdmin,
    isMobileApp: app.isMobileApp,
    docentePanelProps: docentePanel,
    estudiantesCreateProps: estudiantesCreate,
    estudiantesListProps: estudiantesList,
    periodosProps: {
      isRectorCoordinador: app.isRectorCoordinador,
      ...periodos
    },
    cursosProps: cursos,
    colegiosProps: colegios,
    docentesProps: docentes,
    reportesProps: reportes,
    globalModalsProps: {
      logout: app.logout,
      ...globalModals
    }
  };

  return { rolePanelProps, modalProps };
}
