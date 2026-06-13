export default function useCourseModalBootstrap({
  user,
  setColegiosOptions,
  setCursoCrudColegioId,
  setLoadingCursos,
  setAdminCursosModalVisible,
  setRectorCursosModalVisible,
  setAdminCursoFormVisible,
  setAdminCursoEditing,
  setAdminCursoNombre,
  setAdminCursoNivel,
  setAdminCursoSedeId,
  setAdminCursoNivelPickerOpen,
  setAdminCursoSedePickerOpen,
  setRectorCursoFormVisible,
  setRectorCursoEditing,
  setRectorCursoNombre,
  setRectorCursoNivel,
  setRectorCursoSedeId,
  setRectorCursoNivelPickerOpen,
  setRectorCursoSedePickerOpen,
  setCursoCrudPickerOpen,
  setSedeFormVisible,
  setRectorSedesModalVisible,
  setSedeNombre,
  setSedeEditing,
  setSedeError,
  loadColegios,
  loadCursosAsignados,
  loadSedesDisponibles,
  showAppAlert
}) {
  const resetAdminCursoBootstrapState = () => {
    setAdminCursoFormVisible(false);
    setAdminCursoEditing(null);
    setAdminCursoNombre('');
    setAdminCursoNivel('');
    setAdminCursoSedeId(null);
    setAdminCursoNivelPickerOpen(false);
    setAdminCursoSedePickerOpen(false);
    setCursoCrudPickerOpen(false);
    setSedeFormVisible(false);
    setRectorSedesModalVisible(false);
    setSedeNombre('');
    setSedeEditing(null);
    setSedeError('');
  };

  const resetRectorCursoBootstrapState = () => {
    setRectorCursoFormVisible(false);
    setRectorCursoEditing(null);
    setRectorCursoNombre('');
    setRectorCursoNivel('');
    setRectorCursoSedeId(null);
    setRectorCursoNivelPickerOpen(false);
    setRectorCursoSedePickerOpen(false);
    setCursoCrudPickerOpen(false);
    setSedeFormVisible(false);
    setSedeNombre('');
    setSedeEditing(null);
    setSedeError('');
  };

  const openAdminCursosModal = async () => {
    resetAdminCursoBootstrapState();
    setLoadingCursos(true);
    try {
      const userSchoolOption = user?.schoolId ? [{ id: user.schoolId, nombre: user?.schoolName || `Colegio ${user.schoolId}` }] : [];
      setColegiosOptions(userSchoolOption);
      const colegios = await loadColegios({ preferId: user?.schoolId, preferName: user?.schoolName });
      const defaultSchoolId = user?.schoolId || colegios?.[0]?.id || null;
      setCursoCrudColegioId(defaultSchoolId);
      await Promise.all([loadCursosAsignados(defaultSchoolId), loadSedesDisponibles(defaultSchoolId)]);
      setAdminCursosModalVisible(true);
    } catch (e) {
      showAppAlert('Error', e?.response?.data?.error || 'No se pudieron cargar los cursos', 'error');
    } finally {
      setLoadingCursos(false);
    }
  };

  const openRectorCursosModal = async () => {
    resetRectorCursoBootstrapState();
    setLoadingCursos(true);
    try {
      const defaultSchoolId = Number(user?.schoolId) || null;
      if (!defaultSchoolId) {
        showAppAlert('Colegio requerido', 'No se encontro un colegio asociado a este usuario', 'warning');
        return;
      }
      setColegiosOptions([{ id: defaultSchoolId, nombre: user?.schoolName || `Colegio ${defaultSchoolId}` }]);
      setCursoCrudColegioId(defaultSchoolId);
      await Promise.all([loadCursosAsignados(defaultSchoolId), loadSedesDisponibles(defaultSchoolId)]);
      setRectorCursosModalVisible(true);
    } catch (e) {
      showAppAlert('Error', e?.response?.data?.error || 'No se pudieron cargar los cursos', 'error');
    } finally {
      setLoadingCursos(false);
    }
  };

  return {
    openAdminCursosModal,
    openRectorCursosModal
  };
}
