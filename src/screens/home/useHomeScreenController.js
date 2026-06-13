import { useState } from 'react';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../store/useAuth';
import useCourseCrudState from './useCourseCrudState';
import useDocenteCourseAssignmentState from './useDocenteCourseAssignmentState';
import useEstudianteCrudState from './useEstudianteCrudState';
import useDocenteCrudState from './useDocenteCrudState';
import useHomeFeedbackState from './useHomeFeedbackState';
import usePeriodCrudState from './usePeriodCrudState';
import useReportesState from './useReportesState';
import useHomeScreenDomainActions from './useHomeScreenDomainActions';
import useHomeScreenViewConfig from './useHomeScreenViewConfig';
import useSchoolCrudState from './useSchoolCrudState';
import useSchoolSuccessFeedback from './useSchoolSuccessFeedback';
import useAttendanceRealtimeRefresh from './useAttendanceRealtimeRefresh';
import useHomeScreenDerivedState from './useHomeScreenDerivedState';
import useHomeScreenViewProps from './useHomeScreenViewProps';
import { styles } from './homeStyles';
import { getPeriodos, createPeriodo, updatePeriodo, deletePeriodo } from '../../services/periodos';
import { getCursos, getCursosPorColegio, createCurso, updateCurso, deleteCurso } from '../../services/cursos';
import { getEstudiantes, createEstudiante, createEstudiantesLote, updateEstudiante, deleteEstudiante } from '../../services/estudiantes';
import { getDocentes, getCursosDisponiblesDocente, createDocente, updateDocente, deleteDocente, resetDocentePassword } from '../../services/docentes';
import { getColegios, createColegio, updateColegio, deleteColegio } from '../../services/colegios';
import { getSedes, createSede, updateSede, deleteSede } from '../../services/sedes';
import { getReporteInasistenciaCurso } from '../../services/reportes';
import {
  ALL_MATERIAS_OPTION,
  createDefaultPeriodForm,
  getEstudianteMateriaOptionsByCurso,
  getApiErrorMessage,
  getMateriasDisponiblesByCurso,
  getNivelLabel,
  getNivelShortLabel,
  normalizeMateriaOption,
  normalizeColegioItem,
  normalizeStudentCodeKey,
  normalizeStudentIdentityKey,
  resolveColegioNombre,
  sortCursosForDisplay
} from './homeUtils';
import {
  buildPeriodFormFromPeriodo,
  buildNormalizedPeriodoNameUpdates,
  buildPeriodPayloadFromForm,
  getPeriodoRangeError,
  sortPeriodosByStartDate as sortPeriodos
} from './periodUtils';

export default function useHomeScreenController() {
  const NIVEL_OPTIONS = [
    { value: 'primaria', label: 'Primaria' },
    { value: 'secundaria', label: 'Secundaria' }
  ];

  const logout = useAuth(s => s.logout);
  const user = useAuth(s => s.user);
  const updateUser = useAuth(s => s.updateUser);
  const navigation = useNavigation();

  const isAdmin = user?.rol === 'admin';
  const isDocente = user?.rol === 'docente';
  const isRectorCoordinador = ['rector', 'coordinador'].includes(user?.rol);
  const isMobileApp = Platform.OS !== 'web';
  const canManageCourses = ['admin', 'rector', 'coordinador'].includes(user?.rol);
  const canManagePeriods = ['admin', 'rector', 'coordinador'].includes(user?.rol);
  const teacherInitial = (user?.email?.[0] || 'D').toUpperCase();

  const [cursosAsignados, setCursosAsignados] = useState([]);
  const [sedesDisponibles, setSedesDisponibles] = useState([]);
  const [sedesLoading, setSedesLoading] = useState(false);

  const periodState = usePeriodCrudState();
  const courseState = useCourseCrudState();
  const docenteCourseAssignmentState = useDocenteCourseAssignmentState();
  const schoolState = useSchoolCrudState();
  const estudianteState = useEstudianteCrudState(ALL_MATERIAS_OPTION);
  const docenteState = useDocenteCrudState();
  const reportesState = useReportesState();

  const schoolSuccess = useSchoolSuccessFeedback();
  const feedbackState = useHomeFeedbackState();

  const isEditingColegio = Boolean(schoolState.colegioEditing?.id);
  const canAdminFilterPeriodSchools = isAdmin && !user?.schoolId;
  const canAdminFilterReportSchools = isAdmin && !user?.schoolId;
  const canAdminFilterDocenteSchools = isAdmin;

  const derivedState = useHomeScreenDerivedState({
    user,
    isAdmin,
    isDocente,
    isRectorCoordinador,
    isMobileApp,
    styles,
    periodos: periodState.periodos,
    editingPeriodo: periodState.editingPeriodo,
    cursosAsignados,
    cursoSeleccionado: estudianteState.cursoSeleccionado,
    estudianteCreateCursoId: estudianteState.estudianteCreateCursoId,
    estudiantes: estudianteState.estudiantes,
    estudianteMateriaFiltro: estudianteState.estudianteMateriaFiltro,
    reportesCursos: reportesState.reportesCursos,
    reportesCursoId: reportesState.reportesCursoId,
    reportesMes: reportesState.reportesMes,
    docentes: docenteState.docentes,
    adminDocentesSearchTerm: docenteState.adminDocentesSearchTerm,
    docentesSearchTerm: docenteState.docentesSearchTerm,
    colegioSeleccionado: schoolState.colegioSeleccionado,
    colegiosList: schoolState.colegiosList,
    rectoresSearchTerm: schoolState.rectoresSearchTerm,
    colegiosOptions: schoolState.colegiosOptions,
    sedesDisponibles,
    reportesColegioId: reportesState.reportesColegioId,
    getDocentes,
    getMateriasDisponiblesByCurso,
    getEstudianteMateriaOptionsByCurso,
    normalizeMateriaOption
  });

  const services = {
    ALL_MATERIAS_OPTION,
    buildNormalizedPeriodoNameUpdates,
    buildPeriodFormFromPeriodo,
    buildPeriodPayloadFromForm,
    createColegio,
    createCurso,
    createDefaultPeriodForm,
    createDocente,
    createEstudiante,
    createEstudiantesLote,
    createPeriodo,
    createSede,
    deleteColegio,
    deleteCurso,
    deleteDocente,
    deleteEstudiante,
    deletePeriodo,
    deleteSede,
    getApiErrorMessage,
    getColegios,
    getCursos,
    getCursosDisponiblesDocente,
    getCursosPorColegio,
    getDocentes,
    getEstudiantes,
    getEstudianteMateriaOptionsByCurso,
    getMateriasDisponiblesByCurso,
    getPeriodos,
    getPeriodoRangeError,
    getReporteInasistenciaCurso,
    getSedes,
    normalizeColegioItem,
    normalizeMateriaOption,
    normalizeStudentCodeKey,
    normalizeStudentIdentityKey,
    resolveColegioNombre,
    resetDocentePassword,
    sortCursosForDisplay,
    sortPeriodos,
    updateColegio,
    updateCurso,
    updateDocente,
    updateEstudiante,
    updatePeriodo,
    updateSede
  };

  const derived = {
    ...derivedState,
    NIVEL_OPTIONS,
    ALL_MATERIAS_OPTION,
    getNivelLabel,
    getNivelShortLabel,
    normalizeMateriaOption,
    normalizeColegioItem,
    normalizeStudentCodeKey,
    normalizeStudentIdentityKey,
    resolveColegioNombre,
    sortCursosForDisplay,
    canAdminFilterPeriodSchools,
    canAdminFilterDocenteSchools,
    canAdminFilterReportSchools,
    cursosAsignados,
    sedesDisponibles,
    sedesLoading
  };

  const setters = {
    cursosAsignados,
    setCursosAsignados,
    setSedesDisponibles,
    setSedesLoading
  };

  const domainActions = useHomeScreenDomainActions({
    user,
    updateUser,
    isAdmin,
    schoolState,
    courseState,
    docenteState,
    docenteCourseAssignmentState,
    estudianteState,
    periodState,
    reportesState,
    feedback: feedbackState,
    schoolSuccess,
    services,
    derived,
    setters
  });

  useAttendanceRealtimeRefresh({
    userId: user?.id,
    userSchoolId: user?.schoolId,
    estudiantesModalVisible: estudianteState.estudiantesModalVisible,
    cursoSeleccionado: estudianteState.cursoSeleccionado,
    reportesModalVisible: reportesState.reportesModalVisible,
    reportesCursoId: reportesState.reportesCursoId,
    loadEstudiantesPorCurso: domainActions.estudianteActions.loadEstudiantesPorCurso,
    handleGenerateInasistenciaReport: domainActions.reportesActions.handleGenerateInasistenciaReport
  });

  const viewConfig = useHomeScreenViewConfig({
    app: {
      styles,
      user,
      teacherInitial,
      isAdmin,
      isDocente,
      isRectorCoordinador,
      canManageCourses,
      canManagePeriods,
      isMobileApp,
      logout
    },
    rolePanelInput: {
      showMobileGridLogout: derived.showMobileGridLogout,
      mobileActionBtnStyle: derived.mobileActionBtnStyle,
      mobileActionTextStyle: derived.mobileActionTextStyle,
      mobileBtnRowStyle: derived.mobileBtnRowStyle,
      mobileDocenteRowStyle: derived.mobileDocenteRowStyle,
      mobileDocenteTextStyle: derived.mobileDocenteTextStyle,
      mobileLongLabelRowStyle: derived.mobileLongLabelRowStyle,
      mobileLongLabelTextStyle: derived.mobileLongLabelTextStyle,
      mobileGridLogoutRowStyle: derived.mobileGridLogoutRowStyle,
      mobileGridLogoutTextStyle: derived.mobileGridLogoutTextStyle,
      navigation,
      openEstudiantesModal: domainActions.estudianteActions.openEstudiantesModal,
      setDocentePanelModalVisible: docenteState.setDocentePanelModalVisible,
      openManualChangePasswordModal: domainActions.passwordActions.openManualChangePasswordModal,
      openRectorCursosModal: domainActions.courseBootstrap.openRectorCursosModal,
      openRectorSedesModal: domainActions.courseActions.openRectorSedesModal,
      openDocenteCrudModal: domainActions.docenteActions.openDocenteCrudModal,
      openDocentesModal: domainActions.docenteActions.openDocentesModal,
      openColegiosModal: domainActions.schoolActions.openColegiosModal,
      openColegiosListModal: domainActions.schoolActions.openColegiosListModal,
      openRectoresListModal: domainActions.schoolActions.openRectoresListModal,
      openPeriodManagerModal: domainActions.periodActions.openPeriodManagerModal,
      openReportesModal: domainActions.reportesActions.openReportesModal
    },
    schoolState,
    schoolUi: {
      isEditingColegio,
      colegiosSuccess: schoolSuccess.colegiosSuccess,
      colegioSuccessAnim: schoolSuccess.colegioSuccessAnim
    },
    courseState,
    docenteState: { ...docenteState, NIVEL_OPTIONS },
    estudianteState,
    periodState,
    reportesState,
    passwordState: {
      ...domainActions.passwordActions
    },
    feedbackState: {
      ...feedbackState
    },
    derived,
    handlers: {
      estudiantes: {
        ...domainActions.estudianteActions
      },
      periodos: {
        ...domainActions.periodActions
      },
      cursos: {
        ...domainActions.courseActions,
        ...domainActions.courseBootstrap
      },
      colegios: {
        ...domainActions.schoolActions
      },
      docentes: {
        ...domainActions.docenteActions,
        handleResetDocentePassword: domainActions.handleResetDocentePassword
      },
      reportes: {
        ...domainActions.reportesActions
      }
    }
  });

  const { rolePanelProps, modalProps } = useHomeScreenViewProps(viewConfig);

  return {
    rolePanelProps,
    modalProps
  };
}
