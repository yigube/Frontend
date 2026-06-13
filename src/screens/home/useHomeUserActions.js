import useChangePasswordActions from './useChangePasswordActions';
import useDocenteCrudActions from './useDocenteCrudActions';
import useDocentePasswordReset from './useDocentePasswordReset';

export default function useHomeUserActions({
  user,
  updateUser,
  isAdmin,
  schoolState,
  courseState,
  docenteState,
  feedback,
  services,
  derived,
  academicActions
}) {
  const docenteActions = useDocenteCrudActions({
    ...docenteState,
    user,
    isAdmin,
    colegioSeleccionado: schoolState.colegioSeleccionado,
    loadingCursos: courseState.loadingCursos,
    getDocentes: services.getDocentes,
    createDocente: services.createDocente,
    updateDocente: services.updateDocente,
    deleteDocente: services.deleteDocente,
    getCursosPorColegio: services.getCursosPorColegio,
    getCursosDisponiblesDocente: services.getCursosDisponiblesDocente,
    sortCursosForDisplay: services.sortCursosForDisplay,
    loadSedesDisponibles: academicActions.loadSedesDisponibles,
    loadColegios: academicActions.schoolActions.loadColegios,
    resolveColegioNombre: services.resolveColegioNombre,
    getApiErrorMessage: services.getApiErrorMessage,
    showAppAlert: feedback.showAppAlert,
    showPeriodStatusModal: feedback.showPeriodStatusModal,
    setColegioPickerOpen: schoolState.setColegioPickerOpen,
    setColegiosOptions: schoolState.setColegiosOptions,
    setLoadingCursos: courseState.setLoadingCursos,
    setColegioSeleccionado: schoolState.setColegioSeleccionado
  });

  const handleResetDocentePassword = useDocentePasswordReset({
    user,
    docenteColegioId: docenteState.docenteColegioId,
    resetDocentePassword: services.resetDocentePassword,
    loadDocentesActual: docenteActions.loadDocentesActual,
    showResetPasswordFeedbackModal: feedback.showResetPasswordFeedbackModal
  }).handleResetDocentePassword;

  const passwordActions = useChangePasswordActions({
    user,
    updateUser,
    onSuccess: feedback.showPeriodStatusModal
  });

  return {
    docenteActions,
    passwordActions,
    handleResetDocentePassword
  };
}
