import buildHomeAcademicViewConfig from './buildHomeAcademicViewConfig';
import buildHomeReportViewConfig from './buildHomeReportViewConfig';
import buildHomeUserViewConfig from './buildHomeUserViewConfig';
import useHomeScreenViewConfig from './useHomeScreenViewConfig';
import useHomeScreenViewProps from './useHomeScreenViewProps';

describe('home view composition', () => {
  test('buildHomeAcademicViewConfig expone props clave de estudiantes, periodos y cursos', () => {
    const openCreateEstudianteModal = jest.fn();
    const changeEstudiantesColegio = jest.fn();
    const closePeriodModal = jest.fn();
    const handleSaveAdminCurso = jest.fn();

    const app = { styles: { token: 'styles' } };
    const schoolState = {
      colegiosLoading: true,
      colegiosOptions: [{ label: 'La Integrada', value: 5 }]
    };
    const courseState = {
      loadingCursos: false,
      adminCursosModalVisible: true,
      rectorCursosModalVisible: false,
      cursoCrudColegioId: 5,
      cursoCrudPickerOpen: true,
      setCursoCrudPickerOpen: jest.fn(),
      savingSede: false,
      sedeFormVisible: true,
      sedeForm: { nombre: 'Principal' },
      adminCursoFormVisible: true,
      adminCursoEditing: { id: 9 },
      adminCursoNombre: '6 02',
      setAdminCursoNombre: jest.fn(),
      adminCursoNivel: 'secundaria',
      setAdminCursoNivel: jest.fn(),
      adminCursoNivelPickerOpen: false,
      setAdminCursoNivelPickerOpen: jest.fn(),
      adminCursoSedeId: 2,
      setAdminCursoSedeId: jest.fn(),
      adminCursoSedePickerOpen: false,
      setAdminCursoSedePickerOpen: jest.fn(),
      rectorCursoFormVisible: false,
      rectorCursoEditing: null,
      rectorCursoNombre: '',
      setRectorCursoNombre: jest.fn(),
      rectorCursoNivel: '',
      setRectorCursoNivel: jest.fn(),
      rectorCursoNivelPickerOpen: false,
      setRectorCursoNivelPickerOpen: jest.fn(),
      rectorCursoSedeId: null,
      setRectorCursoSedeId: jest.fn(),
      rectorCursoSedePickerOpen: false,
      setRectorCursoSedePickerOpen: jest.fn(),
      savingCurso: true,
      sedeEditing: null,
      sedeNombre: 'Bloque A',
      setSedeNombre: jest.fn(),
      sedeError: ''
    };
    const estudianteState = {
      estudianteCreateModalVisible: true,
      savingEstudiante: false,
      estudianteCreateCursoPickerOpen: false,
      setEstudianteCreateCursoPickerOpen: jest.fn(),
      estudianteCreateCursoId: 9,
      estudianteCreateMaterias: ['Matematicas'],
      estudianteCreateForm: { nombre: 'Ana' },
      setEstudianteCreateForm: jest.fn(),
      selectedCsvFile: null,
      downloadingTemplate: false,
      estudianteCreateError: '',
      uploadedStudents: [],
      estudiantesModalVisible: true,
      estudiantesColegioId: 5,
      setEstudiantesColegioPickerOpen: jest.fn(),
      estudiantesColegioPickerOpen: false,
      setCursoPickerOpen: jest.fn(),
      cursoPickerOpen: true,
      cursoSeleccionado: 9,
      setEstudianteMateriaPickerOpen: jest.fn(),
      estudianteMateriaPickerOpen: false,
      estudianteMateriaFiltro: 'Todas',
      downloadingQrZip: false,
      estudiantesLoading: false,
      estudiantesError: '',
      qrZipProgress: 0,
      estudianteEditing: { id: 1 },
      estudianteEditForm: { nombre: 'Ana' },
      setEstudianteEditForm: jest.fn(),
      savingEstudianteEdit: false
    };
    const periodState = {
      periodModalVisible: true,
      periodModalScrollRef: { current: null },
      editingPeriodo: { id: 7 },
      periodSchoolId: 5,
      periodSchoolPickerOpen: false,
      setPeriodSchoolPickerOpen: jest.fn(),
      setPeriodSchoolId: jest.fn(),
      setEditingPeriodo: jest.fn(),
      periodForm: { nombre: 'Periodo 1' },
      setPeriodForm: jest.fn(),
      periodos: [{ id: 7, nombre: 'Periodo 1' }],
      periodFeedback: '',
      setPeriodFeedback: jest.fn(),
      savingPeriodo: false
    };
    const docenteState = {
      docentePanelModalVisible: true,
      NIVEL_OPTIONS: [{ label: 'Secundaria', value: 'secundaria' }]
    };
    const derived = {
      docentePerfilLoading: false,
      docentePerfilError: '',
      docentePerfilCursos: [{ id: 9, nombre: '6 02' }],
      docenteMateriasAsignadasTotal: 3,
      estudianteCreateCursoNombre: '6 02',
      cursosAsignados: [{ id: 9, nombre: '6 02' }],
      estudianteCreateMateriasDisponibles: ['Matematicas'],
      normalizeMateriaOption: (value) => value,
      resolveColegioNombreForView: () => 'La Integrada',
      cursoSeleccionadoNombre: '6 02',
      estudiantesMateriasDisponibles: ['Matematicas'],
      ALL_MATERIAS_OPTION: 'Todas',
      estudiantesFiltrados: [{ id: 1 }],
      canAdminFilterPeriodSchools: true,
      days: [1, 2],
      months: [6, 7],
      years: [2026],
      hours: [8, 9],
      minutes: [0, 30],
      monthNames: ['junio'],
      formatPeriodSummary: () => 'Periodo 1',
      formatPeriodDate: () => '06/06/2026',
      formatPeriodTime: () => '08:00',
      getPeriodDurationLabel: () => '70 dias',
      sedesLoading: false,
      sedesDisponibles: [{ id: 2, nombre: 'Simon Bolivar' }],
      sortCursosForDisplay: (items) => items,
      getNivelLabel: () => 'Secundaria',
      resolveSedeNombreForView: () => 'Simon Bolivar',
      NIVEL_OPTIONS: [{ label: 'Secundaria', value: 'secundaria' }]
    };
    const handlers = {
      estudiantes: {
        openCreateEstudianteModal,
        closeCreateEstudianteModal: jest.fn(),
        changeEstudianteCreateCurso: jest.fn(),
        toggleEstudianteCreateMateria: jest.fn(),
        handleImportCsv: jest.fn(),
        downloadExcelTemplate: jest.fn(),
        handleCreateEstudiante: jest.fn(),
        closeEstudiantesModal: jest.fn(),
        changeEstudiantesColegio,
        selectCursoEstudiantes: jest.fn(),
        downloadEstudiantesQrZip: jest.fn(),
        toggleEstudianteEditMateria: jest.fn(),
        handleUpdateEstudiante: jest.fn(),
        cancelEditEstudiante: jest.fn(),
        startEditEstudiante: jest.fn(),
        askDeleteEstudiante: jest.fn(),
        handleConfirmDeleteEstudiante: jest.fn()
      },
      periodos: {
        closePeriodModal,
        adjustValue: jest.fn(),
        cycleValue: jest.fn(),
        handleSavePeriod: jest.fn(),
        openPeriodModal: jest.fn(),
        askDeletePeriod: jest.fn()
      },
      cursos: {
        closeCursosModal: jest.fn(),
        openAdminCursoForm: jest.fn(),
        changeCursoCrudColegio: jest.fn(),
        openSedeForm: jest.fn(),
        askDeleteSede: jest.fn(),
        askDeleteCurso: jest.fn(),
        closeAdminCursoForm: jest.fn(),
        handleSaveAdminCurso,
        openRectorCursoForm: jest.fn(),
        closeRectorCursoForm: jest.fn(),
        handleSaveRectorCurso: jest.fn(),
        closeSedeForm: jest.fn(),
        handleSaveSede: jest.fn()
      }
    };

    const view = buildHomeAcademicViewConfig({
      app,
      schoolState,
      courseState,
      estudianteState,
      periodState,
      docenteState,
      derived,
      handlers
    });

    expect(view.docentePanel.openCreateEstudianteModal).toBe(openCreateEstudianteModal);
    expect(view.estudiantesList.changeEstudiantesColegio).toBe(changeEstudiantesColegio);
    expect(view.periodos.closePeriodModal).toBe(closePeriodModal);
    expect(view.cursos.adminCursoFormProps.styles).toBe(app.styles);
    expect(view.cursos.adminCursoFormProps.handleSaveAdminCurso).toBe(handleSaveAdminCurso);
    expect(view.cursos.sedeFormProps.handleSaveSede).toBe(handlers.cursos.handleSaveSede);
  });

  test('buildHomeUserViewConfig y buildHomeReportViewConfig conservan wiring de handlers y derivados', () => {
    const handleSaveColegio = jest.fn();
    const openAdminDocenteEditModal = jest.fn();
    const handleGenerateInasistenciaReport = jest.fn();
    const handleDeleteDocente = jest.fn();

    const schoolState = {
      colegiosLoading: false,
      colegiosOptions: [{ label: 'La Integrada', value: 5 }],
      colegiosModalVisible: true,
      deleteColegioModal: { visible: false, colegio: null },
      setDeleteColegioModal: jest.fn(),
      deleteRectorModal: { visible: false, rector: null },
      setDeleteRectorModal: jest.fn(),
      daneExistsModal: { visible: false, message: '' },
      setDaneExistsModal: jest.fn()
    };
    const courseState = {
      deleteCursoModal: { visible: false, curso: null },
      setDeleteCursoModal: jest.fn()
    };
    const schoolUi = {
      isEditingColegio: true,
      colegiosSuccess: 'ok',
      colegioSuccessAnim: { current: null }
    };
    const docenteState = {
      docentesModalVisible: true,
      adminDocenteEditModalVisible: true,
      deleteDocenteModal: { visible: false, docente: null },
      setDeleteDocenteModal: jest.fn()
    };
    const estudianteState = {
      deleteEstudianteConfirmModal: { visible: false, estudiante: null, deleting: false },
      setDeleteEstudianteConfirmModal: jest.fn(),
      estudiantesExistentesModal: { visible: false, students: [], created: 0 },
      setEstudiantesExistentesModal: jest.fn()
    };
    const periodState = {
      deletePeriodModal: { visible: false, id: null },
      setDeletePeriodModal: jest.fn()
    };
    const reportesState = {
      reportesModalVisible: true
    };
    const passwordState = {
      forcePasswordChangeVisible: true,
      closeManualChangePasswordModal: jest.fn(),
      handleSubmitForcedPasswordChange: jest.fn()
    };
    const feedbackState = {
      successModalVisible: true
    };
    const derived = {
      mobileColegioControlsRowStyle: { gap: 8 },
      mobileColegioControlBtnStyle: { minWidth: 90 },
      mobileColegioControlRowStyle: { justifyContent: 'center' },
      mobileColegioControlTextStyle: { fontSize: 12 },
      rectoresRegistrados: [{ id: 1 }],
      rectoresFiltrados: [{ id: 2 }],
      normalizeColegioItem: jest.fn((colegio) => colegio),
      NIVEL_OPTIONS: [{ label: 'Primaria', value: 'primaria' }],
      resolveSedeNombreForView: () => 'Simon Bolivar',
      getNivelLabel: () => 'Primaria',
      getNivelShortLabel: () => 'Pri.',
      canAdminFilterDocenteSchools: true,
      sortCursosForDisplay: (items) => items,
      resolveColegioNombreForView: () => 'La Integrada',
      docentesSearchNormalized: 'ana',
      docentesSearchSuggestions: ['Ana'],
      docentesFiltrados: [{ id: 3 }],
      adminDocentesFiltrados: [{ id: 4 }],
      colegioSeleccionadoNombre: 'La Integrada',
      pad2: (value) => String(value).padStart(2, '0'),
      currentYear: 2026,
      reportesColegioNombre: 'La Integrada',
      reportesCursoNombre: '6 02',
      canAdminFilterReportSchools: true,
      monthNames: ['junio'],
      reportMonthOptions: [6],
      reportDayOptions: [8]
    };
    const handlers = {
      colegios: {
        handleSaveColegio,
        cancelColegioEdit: jest.fn(),
        openRectorEditModal: jest.fn(),
        askDeleteRector: jest.fn(),
        startEditColegio: jest.fn(),
        askDeleteColegio: jest.fn(),
        closeColegiosModal: jest.fn(),
        closeColegiosListModal: jest.fn(),
        handleDeleteColegio: jest.fn(),
        handleDeleteRector: jest.fn()
      },
      docentes: {
        handleResetDocentePassword: jest.fn(),
        openAdminDocenteEditModal,
        askDeleteDocente: jest.fn(),
        sanitizeDocenteNombreInput: jest.fn(),
        normalizeDocenteEmailInput: jest.fn(),
        resetDocenteFormState: jest.fn(),
        openDocenteNivelConfigModal: jest.fn(),
        openDocenteCursosConfigModal: jest.fn(),
        handleSaveDocente: jest.fn(),
        closeAdminDocenteEditModal: jest.fn(),
        parseMateriasTexto: jest.fn(),
        closeDocenteCrudListModal: jest.fn(),
        loadDocentesColegio: jest.fn(),
        handleSelectDocenteCrudColegio: jest.fn(),
        updateDocenteMateriaDraft: jest.fn(),
        commitDocenteMateriaDraft: jest.fn(),
        toggleDocenteCurso: jest.fn(),
        closeDocenteNivelConfigModal: jest.fn(),
        closeDocenteCursosConfigModal: jest.fn(),
        closeDocenteCrudModal: jest.fn(),
        closeDocentesModal: jest.fn(),
        handleDeleteDocente
      },
      reportes: {
        handleGenerateInasistenciaReport,
        resetReportesFilters: jest.fn(),
        closeReportesModal: jest.fn()
      },
      periodos: {
        handleDeletePeriod: jest.fn()
      },
      cursos: {
        handleDeleteCurso: jest.fn(),
        handleConfirmDeleteSede: jest.fn()
      },
      estudiantes: {
        handleConfirmDeleteEstudiante: jest.fn()
      }
    };

    const userView = buildHomeUserViewConfig({
      schoolState,
      schoolUi,
      docenteState,
      derived,
      handlers
    });
    const reportView = buildHomeReportViewConfig({
      schoolState,
      courseState,
      docenteState,
      estudianteState,
      periodState,
      reportesState,
      passwordState,
      feedbackState,
      derived,
      handlers
    });

    expect(userView.colegios.handleSaveColegio).toBe(handleSaveColegio);
    expect(userView.colegios.normalizeColegioItem).toBe(derived.normalizeColegioItem);
    expect(userView.docentes.openAdminDocenteEditModal).toBe(openAdminDocenteEditModal);
    expect(userView.docentes.getNivelShortLabel()).toBe('Pri.');
    expect(reportView.reportes.handleGenerateInasistenciaReport).toBe(handleGenerateInasistenciaReport);
    expect(reportView.globalModals.handleDeleteDocente).toBe(handleDeleteDocente);
    expect(reportView.globalModals.closeManualChangePasswordModal).toBe(passwordState.closeManualChangePasswordModal);
    expect(reportView.globalModals.deletePeriodModal.visible).toBe(false);
  });

  test('useHomeScreenViewConfig une app, rolePanel y dominios en una sola configuracion', () => {
    const payload = {
      app: { user: { nombre: 'Admin' } },
      rolePanelInput: { openMenu: jest.fn() },
      schoolState: { colegiosLoading: false, colegiosOptions: [] },
      schoolUi: { isEditingColegio: false, colegiosSuccess: '', colegioSuccessAnim: null },
      courseState: {
        loadingCursos: false,
        adminCursosModalVisible: false,
        rectorCursosModalVisible: false,
        cursoCrudColegioId: null,
        cursoCrudPickerOpen: false,
        setCursoCrudPickerOpen: jest.fn(),
        savingSede: false,
        sedeFormVisible: false,
        sedeForm: {},
        adminCursoFormVisible: false,
        adminCursoEditing: null,
        adminCursoNombre: '',
        setAdminCursoNombre: jest.fn(),
        adminCursoNivel: '',
        setAdminCursoNivel: jest.fn(),
        adminCursoNivelPickerOpen: false,
        setAdminCursoNivelPickerOpen: jest.fn(),
        adminCursoSedeId: null,
        setAdminCursoSedeId: jest.fn(),
        adminCursoSedePickerOpen: false,
        setAdminCursoSedePickerOpen: jest.fn(),
        rectorCursoFormVisible: false,
        rectorCursoEditing: null,
        rectorCursoNombre: '',
        setRectorCursoNombre: jest.fn(),
        rectorCursoNivel: '',
        setRectorCursoNivel: jest.fn(),
        rectorCursoNivelPickerOpen: false,
        setRectorCursoNivelPickerOpen: jest.fn(),
        rectorCursoSedeId: null,
        setRectorCursoSedeId: jest.fn(),
        rectorCursoSedePickerOpen: false,
        setRectorCursoSedePickerOpen: jest.fn(),
        savingCurso: false,
        sedeEditing: null,
        sedeNombre: '',
        setSedeNombre: jest.fn(),
        sedeError: ''
      },
      docenteState: {
        docentePanelModalVisible: false,
        NIVEL_OPTIONS: [],
        docentesModalVisible: false
      },
      estudianteState: {
        estudianteCreateModalVisible: false,
        savingEstudiante: false,
        estudianteCreateCursoPickerOpen: false,
        setEstudianteCreateCursoPickerOpen: jest.fn(),
        estudianteCreateCursoId: null,
        estudianteCreateMaterias: [],
        estudianteCreateForm: {},
        setEstudianteCreateForm: jest.fn(),
        selectedCsvFile: null,
        downloadingTemplate: false,
        estudianteCreateError: '',
        uploadedStudents: [],
        estudiantesModalVisible: false,
        estudiantesColegioId: null,
        setEstudiantesColegioPickerOpen: jest.fn(),
        estudiantesColegioPickerOpen: false,
        setCursoPickerOpen: jest.fn(),
        cursoPickerOpen: false,
        cursoSeleccionado: null,
        setEstudianteMateriaPickerOpen: jest.fn(),
        estudianteMateriaPickerOpen: false,
        estudianteMateriaFiltro: '',
        downloadingQrZip: false,
        estudiantesLoading: false,
        estudiantesError: '',
        qrZipProgress: 0,
        estudianteEditing: null,
        estudianteEditForm: {},
        setEstudianteEditForm: jest.fn(),
        savingEstudianteEdit: false
      },
      periodState: {
        periodModalVisible: false,
        periodModalScrollRef: { current: null },
        editingPeriodo: null,
        periodSchoolId: null,
        periodSchoolPickerOpen: false,
        setPeriodSchoolPickerOpen: jest.fn(),
        setPeriodSchoolId: jest.fn(),
        setEditingPeriodo: jest.fn(),
        periodForm: {},
        setPeriodForm: jest.fn(),
        periodos: [],
        periodFeedback: '',
        setPeriodFeedback: jest.fn(),
        savingPeriodo: false
      },
      reportesState: { reportesModalVisible: false },
      passwordState: {
        closeManualChangePasswordModal: jest.fn(),
        handleSubmitForcedPasswordChange: jest.fn()
      },
      feedbackState: {},
      derived: {
        docentePerfilLoading: false,
        docentePerfilError: '',
        docentePerfilCursos: [],
        docenteMateriasAsignadasTotal: 0,
        estudianteCreateCursoNombre: '',
        cursosAsignados: [],
        estudianteCreateMateriasDisponibles: [],
        normalizeMateriaOption: (value) => value,
        resolveColegioNombreForView: () => '',
        cursoSeleccionadoNombre: '',
        estudiantesMateriasDisponibles: [],
        ALL_MATERIAS_OPTION: 'Todas',
        estudiantesFiltrados: [],
        canAdminFilterPeriodSchools: false,
        days: [],
        months: [],
        years: [],
        hours: [],
        minutes: [],
        monthNames: [],
        formatPeriodSummary: () => '',
        formatPeriodDate: () => '',
        formatPeriodTime: () => '',
        getPeriodDurationLabel: () => '',
        sedesLoading: false,
        sedesDisponibles: [],
        sortCursosForDisplay: (items) => items,
        getNivelLabel: () => '',
        resolveSedeNombreForView: () => '',
        mobileColegioControlsRowStyle: {},
        mobileColegioControlBtnStyle: {},
        mobileColegioControlRowStyle: {},
        mobileColegioControlTextStyle: {},
        rectoresRegistrados: [],
        rectoresFiltrados: [],
        NIVEL_OPTIONS: [],
        getNivelShortLabel: () => '',
        canAdminFilterDocenteSchools: false,
        docentesSearchNormalized: '',
        docentesSearchSuggestions: [],
        docentesFiltrados: [],
        adminDocentesFiltrados: [],
        colegioSeleccionadoNombre: '',
        pad2: (value) => String(value).padStart(2, '0'),
        currentYear: 2026,
        reportesColegioNombre: '',
        reportesCursoNombre: '',
        canAdminFilterReportSchools: false,
        reportMonthOptions: [],
        reportDayOptions: []
      },
      handlers: {
        estudiantes: {
          openCreateEstudianteModal: jest.fn(),
          closeCreateEstudianteModal: jest.fn(),
          changeEstudianteCreateCurso: jest.fn(),
          toggleEstudianteCreateMateria: jest.fn(),
          handleImportCsv: jest.fn(),
          downloadExcelTemplate: jest.fn(),
          handleCreateEstudiante: jest.fn(),
          closeEstudiantesModal: jest.fn(),
          changeEstudiantesColegio: jest.fn(),
          selectCursoEstudiantes: jest.fn(),
          downloadEstudiantesQrZip: jest.fn(),
          toggleEstudianteEditMateria: jest.fn(),
          handleUpdateEstudiante: jest.fn(),
          cancelEditEstudiante: jest.fn(),
          startEditEstudiante: jest.fn(),
          askDeleteEstudiante: jest.fn(),
          handleConfirmDeleteEstudiante: jest.fn()
        },
        periodos: {
          closePeriodModal: jest.fn(),
          adjustValue: jest.fn(),
          cycleValue: jest.fn(),
          handleSavePeriod: jest.fn(),
          openPeriodModal: jest.fn(),
          askDeletePeriod: jest.fn(),
          handleDeletePeriod: jest.fn()
        },
        cursos: {
          closeCursosModal: jest.fn(),
          openAdminCursoForm: jest.fn(),
          changeCursoCrudColegio: jest.fn(),
          openSedeForm: jest.fn(),
          askDeleteSede: jest.fn(),
          askDeleteCurso: jest.fn(),
          closeAdminCursoForm: jest.fn(),
          handleSaveAdminCurso: jest.fn(),
          openRectorCursoForm: jest.fn(),
          closeRectorCursoForm: jest.fn(),
          handleSaveRectorCurso: jest.fn(),
          closeSedeForm: jest.fn(),
          handleSaveSede: jest.fn(),
          handleDeleteCurso: jest.fn(),
          handleConfirmDeleteSede: jest.fn()
        },
        colegios: {
          handleSaveColegio: jest.fn(),
          cancelColegioEdit: jest.fn(),
          openRectorEditModal: jest.fn(),
          askDeleteRector: jest.fn(),
          startEditColegio: jest.fn(),
          askDeleteColegio: jest.fn(),
          closeColegiosModal: jest.fn(),
          closeColegiosListModal: jest.fn(),
          handleDeleteColegio: jest.fn(),
          handleDeleteRector: jest.fn()
        },
        docentes: {
          handleResetDocentePassword: jest.fn(),
          openAdminDocenteEditModal: jest.fn(),
          askDeleteDocente: jest.fn(),
          sanitizeDocenteNombreInput: jest.fn(),
          normalizeDocenteEmailInput: jest.fn(),
          resetDocenteFormState: jest.fn(),
          openDocenteNivelConfigModal: jest.fn(),
          openDocenteCursosConfigModal: jest.fn(),
          handleSaveDocente: jest.fn(),
          closeAdminDocenteEditModal: jest.fn(),
          parseMateriasTexto: jest.fn(),
          closeDocenteCrudListModal: jest.fn(),
          loadDocentesColegio: jest.fn(),
          handleSelectDocenteCrudColegio: jest.fn(),
          updateDocenteMateriaDraft: jest.fn(),
          commitDocenteMateriaDraft: jest.fn(),
          toggleDocenteCurso: jest.fn(),
          closeDocenteNivelConfigModal: jest.fn(),
          closeDocenteCursosConfigModal: jest.fn(),
          closeDocenteCrudModal: jest.fn(),
          closeDocentesModal: jest.fn(),
          handleDeleteDocente: jest.fn()
        },
        reportes: {
          handleGenerateInasistenciaReport: jest.fn(),
          resetReportesFilters: jest.fn(),
          closeReportesModal: jest.fn()
        }
      }
    };

    const view = useHomeScreenViewConfig(payload);

    expect(view.app).toBe(payload.app);
    expect(view.rolePanel).toEqual(payload.rolePanelInput);
    expect(view.docentePanel).toBeDefined();
    expect(view.colegios).toBeDefined();
    expect(view.reportes).toBeDefined();
    expect(view.globalModals).toBeDefined();
  });

  test('useHomeScreenViewProps agrega props globales a paneles y modales', () => {
    const app = {
      styles: { token: 'styles' },
      user: { nombre: 'Ana' },
      teacherInitial: 'A',
      isAdmin: true,
      isDocente: false,
      isRectorCoordinador: true,
      canManageCourses: true,
      canManagePeriods: true,
      isMobileApp: true,
      logout: jest.fn()
    };

    const result = useHomeScreenViewProps({
      app,
      rolePanel: { openMenu: jest.fn() },
      docentePanel: { modal: 'docente' },
      estudiantesCreate: { modal: 'create' },
      estudiantesList: { modal: 'list' },
      periodos: { modal: 'periodos' },
      cursos: { modal: 'cursos' },
      colegios: { modal: 'colegios' },
      docentes: { modal: 'docentes' },
      reportes: { modal: 'reportes' },
      globalModals: { feedback: true }
    });

    expect(result.rolePanelProps.styles).toBe(app.styles);
    expect(result.rolePanelProps.teacherInitial).toBe('A');
    expect(result.rolePanelProps.logout).toBe(app.logout);
    expect(result.modalProps.periodosProps.isRectorCoordinador).toBe(true);
    expect(result.modalProps.globalModalsProps.logout).toBe(app.logout);
    expect(result.modalProps.colegiosProps.modal).toBe('colegios');
    expect(result.modalProps.reportesProps.modal).toBe('reportes');
  });
});
