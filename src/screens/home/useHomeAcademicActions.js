import useCourseCrudActions from './useCourseCrudActions';
import useCourseModalBootstrap from './useCourseModalBootstrap';
import useDocenteCourseAssignmentActions from './useDocenteCourseAssignmentActions';
import useEstudianteCrudActions from './useEstudianteCrudActions';
import usePeriodCrudActions from './usePeriodCrudActions';
import useSchoolDataLoaders from './useSchoolDataLoaders';
import useSchoolCrudActions from './useSchoolCrudActions';

export default function useHomeAcademicActions({
  user,
  schoolState,
  courseState,
  docenteState,
  docenteCourseAssignmentState,
  estudianteState,
  periodState,
  feedback,
  schoolSuccess,
  services,
  derived,
  setters
}) {
  const { loadCursosAsignados, loadSedesDisponibles } = useSchoolDataLoaders({
    user,
    getCursos: services.getCursos,
    getSedes: services.getSedes,
    sortCursosForDisplay: services.sortCursosForDisplay,
    setCursosAsignados: setters.setCursosAsignados,
    setSedesDisponibles: setters.setSedesDisponibles,
    setSedesLoading: setters.setSedesLoading
  });

  const schoolActions = useSchoolCrudActions({
    ...schoolState,
    user,
    createColegio: services.createColegio,
    updateColegio: services.updateColegio,
    deleteColegio: services.deleteColegio,
    getColegios: services.getColegios,
    normalizeColegioItem: services.normalizeColegioItem,
    hideColegiosSuccess: schoolSuccess.hideColegiosSuccess,
    showColegiosSuccess: schoolSuccess.showColegiosSuccess,
    getApiErrorMessage: services.getApiErrorMessage,
    showAppAlert: feedback.showAppAlert
  });

  const courseActions = useCourseCrudActions({
    ...courseState,
    user,
    deleteSedeConfirmModal: feedback.deleteSedeConfirmModal,
    docenteSedeId: docenteState.docenteSedeId,
    setDocenteSedeId: docenteState.setDocenteSedeId,
    setDeleteSedeConfirmModal: feedback.setDeleteSedeConfirmModal,
    loadCursosAsignados,
    loadSedesDisponibles,
    createCurso: services.createCurso,
    updateCurso: services.updateCurso,
    deleteCurso: services.deleteCurso,
    createSede: services.createSede,
    updateSede: services.updateSede,
    deleteSede: services.deleteSede,
    showAppAlert: feedback.showAppAlert
  });

  const courseBootstrap = useCourseModalBootstrap({
    user,
    setColegiosOptions: schoolState.setColegiosOptions,
    setCursoCrudColegioId: courseState.setCursoCrudColegioId,
    setLoadingCursos: courseState.setLoadingCursos,
    setAdminCursosModalVisible: courseState.setAdminCursosModalVisible,
    setRectorCursosModalVisible: courseState.setRectorCursosModalVisible,
    setAdminCursoFormVisible: courseState.setAdminCursoFormVisible,
    setAdminCursoEditing: courseState.setAdminCursoEditing,
    setAdminCursoNombre: courseState.setAdminCursoNombre,
    setAdminCursoNivel: courseState.setAdminCursoNivel,
    setAdminCursoSedeId: courseState.setAdminCursoSedeId,
    setAdminCursoNivelPickerOpen: courseState.setAdminCursoNivelPickerOpen,
    setAdminCursoSedePickerOpen: courseState.setAdminCursoSedePickerOpen,
    setRectorCursoFormVisible: courseState.setRectorCursoFormVisible,
    setRectorCursoEditing: courseState.setRectorCursoEditing,
    setRectorCursoNombre: courseState.setRectorCursoNombre,
    setRectorCursoNivel: courseState.setRectorCursoNivel,
    setRectorCursoSedeId: courseState.setRectorCursoSedeId,
    setRectorCursoNivelPickerOpen: courseState.setRectorCursoNivelPickerOpen,
    setRectorCursoSedePickerOpen: courseState.setRectorCursoSedePickerOpen,
    setCursoCrudPickerOpen: courseState.setCursoCrudPickerOpen,
    setSedeFormVisible: courseState.setSedeFormVisible,
    setRectorSedesModalVisible: courseState.setRectorSedesModalVisible,
    setSedeNombre: courseState.setSedeNombre,
    setSedeEditing: courseState.setSedeEditing,
    setSedeError: courseState.setSedeError,
    loadColegios: schoolActions.loadColegios,
    loadCursosAsignados,
    loadSedesDisponibles,
    showAppAlert: feedback.showAppAlert
  });

  const periodActions = usePeriodCrudActions({
    ...periodState,
    user,
    canAdminFilterPeriodSchools: derived.canAdminFilterPeriodSchools,
    currentYear: derived.currentYear,
    monthNames: derived.monthNames,
    createDefaultPeriodForm: services.createDefaultPeriodForm,
    buildPeriodFormFromPeriodo: services.buildPeriodFormFromPeriodo,
    buildNormalizedPeriodoNameUpdates: services.buildNormalizedPeriodoNameUpdates,
    buildPeriodPayloadFromForm: services.buildPeriodPayloadFromForm,
    getPeriodoRangeError: services.getPeriodoRangeError,
    getPeriodoSequenceError: derived.getPeriodoSequenceError,
    sortPeriodos: services.sortPeriodos,
    getApiErrorMessage: services.getApiErrorMessage,
    loadColegios: schoolActions.loadColegios,
    getPeriodos: services.getPeriodos,
    createPeriodo: services.createPeriodo,
    updatePeriodo: services.updatePeriodo,
    deletePeriodo: services.deletePeriodo,
    showAppAlert: feedback.showAppAlert,
    showPeriodStatusModal: feedback.showPeriodStatusModal,
    clearPeriodStatusTimeout: feedback.clearPeriodStatusTimeout
  });

  const estudianteActions = useEstudianteCrudActions({
    ...estudianteState,
    user,
    colegioSeleccionado: schoolState.colegioSeleccionado,
    cursoSeleccionado: estudianteState.cursoSeleccionado,
    cursosAsignados: setters.cursosAsignados,
    estudiantes: estudianteState.estudiantes,
    estudiantesFiltrados: derived.estudiantesFiltrados,
    estudianteCreateMateriasDisponibles: derived.estudianteCreateMateriasDisponibles,
    estudianteMateriaFiltro: estudianteState.estudianteMateriaFiltro,
    estudiantesColegioId: estudianteState.estudiantesColegioId,
    deleteEstudianteConfirmModal: estudianteState.deleteEstudianteConfirmModal,
    downloadingQrZip: estudianteState.downloadingQrZip,
    downloadingTemplate: estudianteState.downloadingTemplate,
    cursoSeleccionadoNombre: derived.cursoSeleccionadoNombre,
    getEstudiantes: services.getEstudiantes,
    createEstudiante: services.createEstudiante,
    createEstudiantesLote: services.createEstudiantesLote,
    updateEstudiante: services.updateEstudiante,
    deleteEstudiante: services.deleteEstudiante,
    loadCursosAsignados,
    loadColegios: schoolActions.loadColegios,
    resolveColegioNombre: services.resolveColegioNombre,
    normalizeMateriaOption: services.normalizeMateriaOption,
    getMateriasDisponiblesByCurso: services.getMateriasDisponiblesByCurso,
    getEstudianteMateriaOptionsByCurso: services.getEstudianteMateriaOptionsByCurso,
    normalizeStudentCodeKey: services.normalizeStudentCodeKey,
    normalizeStudentIdentityKey: services.normalizeStudentIdentityKey,
    ALL_MATERIAS_OPTION: services.ALL_MATERIAS_OPTION,
    getApiErrorMessage: services.getApiErrorMessage,
    showAppAlert: feedback.showAppAlert,
    showEstudianteDeleteSuccessModal: feedback.showEstudianteDeleteSuccessModal,
    showUploadTemplateSuccessModal: feedback.showUploadTemplateSuccessModal,
    clearUploadTemplateSuccessTimeout: feedback.clearUploadTemplateSuccessTimeout,
    setLoadingCursos: courseState.setLoadingCursos,
    setColegiosOptions: schoolState.setColegiosOptions,
    setQrZipErrorModal: feedback.setQrZipErrorModal,
    setQrZipDownloadModal: feedback.setQrZipDownloadModal,
    setUploadTemplateSuccessModal: feedback.setUploadTemplateSuccessModal,
    setDeleteEstudianteConfirmModal: estudianteState.setDeleteEstudianteConfirmModal
  });

  const docenteCourseAssignmentActions = useDocenteCourseAssignmentActions({
    ...docenteCourseAssignmentState,
    user,
    getDocentes: services.getDocentes,
    getCursosDisponiblesDocente: services.getCursosDisponiblesDocente,
    updateDocente: services.updateDocente,
    loadColegios: schoolActions.loadColegios,
    showAppAlert: feedback.showAppAlert,
    setDocentes: docenteState.setDocentes,
    setCursosAsignados: setters.setCursosAsignados,
    setDocentesError: docenteState.setDocentesError,
    setLoadingCursos: courseState.setLoadingCursos,
    setColegiosOptions: schoolState.setColegiosOptions
  });

  return {
    loadCursosAsignados,
    loadSedesDisponibles,
    schoolActions,
    courseActions,
    courseBootstrap,
    periodActions,
    estudianteActions,
    docenteCourseAssignmentActions
  };
}
