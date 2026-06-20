export default function useCourseCrudActions({
  user,
  cursoCrudColegioId,
  rectorSedesModalVisible,
  returnToRectorSedesAfterForm,
  savingCurso,
  savingSede,
  deleteSedeConfirmModal,
  adminCursoEditing,
  adminCursoNombre,
  adminCursoNivel,
  adminCursoSedeId,
  rectorCursoEditing,
  rectorCursoNombre,
  rectorCursoNivel,
  rectorCursoSedeId,
  docenteSedeId,
  sedeEditing,
  sedeNombre,
  setAdminCursosModalVisible,
  setRectorCursosModalVisible,
  setRectorSedesModalVisible,
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
  setDocenteSedeId,
  setRectorCursoNivelPickerOpen,
  setRectorCursoSedePickerOpen,
  setCursoCrudColegioId,
  setCursoCrudPickerOpen,
  setSedeFormVisible,
  setSedeNombre,
  setSedeEditing,
  setSedeError,
  setReturnToRectorSedesAfterForm,
  setLoadingCursos,
  setSavingCurso,
  setSavingSede,
  setDeleteCursoModal,
  setDeleteSedeConfirmModal,
  loadCursosAsignados,
  loadSedesDisponibles,
  createCurso,
  updateCurso,
  deleteCurso,
  createSede,
  updateSede,
  deleteSede,
  showAppAlert
}) {
  const resetAdminCursoForm = () => {
    setAdminCursoFormVisible(false);
    setAdminCursoEditing(null);
    setAdminCursoNombre('');
    setAdminCursoNivel('');
    setAdminCursoSedeId(null);
    setAdminCursoNivelPickerOpen(false);
    setAdminCursoSedePickerOpen(false);
  };

  const resetRectorCursoForm = () => {
    setRectorCursoFormVisible(false);
    setRectorCursoEditing(null);
    setRectorCursoNombre('');
    setRectorCursoNivel('');
    setRectorCursoSedeId(null);
    setRectorCursoNivelPickerOpen(false);
    setRectorCursoSedePickerOpen(false);
  };

  const resetSedeForm = () => {
    setSedeFormVisible(false);
    setSedeNombre('');
    setSedeEditing(null);
    setSedeError('');
  };

  const closeCursosModal = () => {
    setAdminCursosModalVisible(false);
    setRectorCursosModalVisible(false);
    setRectorSedesModalVisible(false);
    resetAdminCursoForm();
    resetRectorCursoForm();
    setCursoCrudColegioId(null);
    setCursoCrudPickerOpen(false);
    resetSedeForm();
  };

  const openRectorSedesModal = async () => {
    const defaultSchoolId = Number(user?.schoolId) || null;
    if (!defaultSchoolId) {
      showAppAlert('Colegio requerido', 'No se encontro un colegio asociado a este usuario', 'warning');
      return;
    }
    setCursoCrudColegioId(defaultSchoolId);
    resetSedeForm();
    setRectorSedesModalVisible(true);
    await loadSedesDisponibles(defaultSchoolId);
  };

  const closeRectorSedesModal = () => {
    if (savingSede) return;
    setRectorSedesModalVisible(false);
    setReturnToRectorSedesAfterForm(false);
    resetSedeForm();
  };

  const changeCursoCrudColegio = async (newSchoolId) => {
    const parsedSchoolId = Number(newSchoolId);
    if (!Number.isFinite(parsedSchoolId) || parsedSchoolId <= 0) return;
    setCursoCrudColegioId(parsedSchoolId);
    setCursoCrudPickerOpen(false);
    resetAdminCursoForm();
    resetRectorCursoForm();
    setLoadingCursos(true);
    resetSedeForm();
    try {
      await Promise.all([loadCursosAsignados(parsedSchoolId), loadSedesDisponibles(parsedSchoolId)]);
    } finally {
      setLoadingCursos(false);
    }
  };

  const openSedeForm = (sede = null) => {
    const shouldReturnToSedes = rectorSedesModalVisible;
    if (sede) {
      setSedeEditing(sede);
      setSedeNombre(String(sede?.nombre || ''));
    } else {
      setSedeEditing(null);
      setSedeNombre('');
    }
    setSedeError('');
    setReturnToRectorSedesAfterForm(shouldReturnToSedes);
    setSedeFormVisible(true);
  };

  const closeSedeForm = () => {
    if (savingSede) return;
    const shouldReturnToSedes = returnToRectorSedesAfterForm;
    resetSedeForm();
    setReturnToRectorSedesAfterForm(false);
    if (shouldReturnToSedes) {
      setTimeout(() => setRectorSedesModalVisible(true), 0);
    }
  };

  const handleSaveSede = async () => {
    const nombre = sedeNombre.trim();
    const schoolId = Number(cursoCrudColegioId || user?.schoolId);
    if (!nombre) {
      setSedeError('Ingresa un nombre para la sede');
      return;
    }
    if (!Number.isFinite(schoolId) || schoolId <= 0) {
      setSedeError('Selecciona un colegio para guardar la sede');
      return;
    }

    setSavingSede(true);
    setSedeError('');
    try {
      if (sedeEditing?.id) {
        await updateSede(sedeEditing.id, { nombre, schoolId });
      } else {
        await createSede({ nombre, schoolId });
      }
      await loadSedesDisponibles(schoolId);
      const shouldReturnToSedes = returnToRectorSedesAfterForm;
      resetSedeForm();
      setReturnToRectorSedesAfterForm(false);
      if (shouldReturnToSedes) {
        setRectorSedesModalVisible(true);
      }
    } catch (e) {
      setSedeError(e?.response?.data?.error || 'No se pudo guardar la sede');
    } finally {
      setSavingSede(false);
    }
  };

  const askDeleteSede = (sede) => {
    if (!sede?.id) return;
    setDeleteSedeConfirmModal({ visible: true, sede, deleting: false });
  };

  const handleConfirmDeleteSede = async () => {
    const sede = deleteSedeConfirmModal?.sede;
    if (!sede?.id) return;
    setDeleteSedeConfirmModal((prev) => ({ ...prev, deleting: true }));
    try {
      await deleteSede(sede.id);
      const schoolId = Number(cursoCrudColegioId || user?.schoolId);
      await loadSedesDisponibles(schoolId);
      if (Number(adminCursoSedeId) === Number(sede.id)) setAdminCursoSedeId(null);
      if (Number(rectorCursoSedeId) === Number(sede.id)) setRectorCursoSedeId(null);
      if (Number(docenteSedeId) === Number(sede.id)) setDocenteSedeId(null);
      setDeleteSedeConfirmModal({ visible: false, sede: null, deleting: false });
    } catch (e) {
      setDeleteSedeConfirmModal((prev) => ({ ...prev, deleting: false }));
      showAppAlert('Error', e?.response?.data?.error || 'No se pudo eliminar la sede', 'error');
    }
  };

  const openAdminCursoForm = (curso = null) => {
    if (curso) {
      setAdminCursoEditing(curso);
      setAdminCursoNombre(curso.nombre || '');
      setAdminCursoNivel(curso?.nivel || '');
      setAdminCursoSedeId(curso?.sedeId || null);
    } else {
      setAdminCursoEditing(null);
      setAdminCursoNombre('');
      setAdminCursoNivel('');
      setAdminCursoSedeId(null);
    }
    setAdminCursoNivelPickerOpen(false);
    setAdminCursoSedePickerOpen(false);
    setAdminCursoFormVisible(true);
  };

  const closeAdminCursoForm = () => {
    if (savingCurso) return;
    resetAdminCursoForm();
  };

  const openRectorCursoForm = (curso = null) => {
    if (curso) {
      setRectorCursoEditing(curso);
      setRectorCursoNombre(curso.nombre || '');
      setRectorCursoNivel(curso?.nivel || '');
      setRectorCursoSedeId(curso?.sedeId || null);
    } else {
      setRectorCursoEditing(null);
      setRectorCursoNombre('');
      setRectorCursoNivel('');
      setRectorCursoSedeId(null);
    }
    setRectorCursoNivelPickerOpen(false);
    setRectorCursoSedePickerOpen(false);
    setRectorCursoFormVisible(true);
  };

  const handleSaveAdminCurso = async () => {
    const nombre = adminCursoNombre.trim();
    if (!nombre) {
      showAppAlert('Nombre requerido', 'Ingresa un nombre para el curso', 'warning');
      return;
    }
    const schoolId = Number(cursoCrudColegioId || user?.schoolId);
    if (!Number.isFinite(schoolId) || schoolId <= 0) {
      showAppAlert('Colegio requerido', 'Selecciona un colegio antes de guardar el curso', 'warning');
      return;
    }
    setSavingCurso(true);
    setLoadingCursos(true);
    try {
      const payload = {
        nombre,
        schoolId,
        nivel: adminCursoNivel || null,
        sedeId: adminCursoSedeId || null
      };
      if (adminCursoEditing) {
        await updateCurso(adminCursoEditing.id, payload);
      } else {
        await createCurso(payload);
      }
      await loadCursosAsignados(schoolId);
      resetAdminCursoForm();
    } catch (e) {
      showAppAlert('Error', e?.response?.data?.error || 'No se pudo guardar el curso', 'error');
    } finally {
      setSavingCurso(false);
      setLoadingCursos(false);
    }
  };

  const handleSaveRectorCurso = async () => {
    const nombre = rectorCursoNombre.trim();
    if (!nombre) {
      showAppAlert('Nombre requerido', 'Ingresa un nombre para el curso', 'warning');
      return;
    }
    const schoolId = Number(user?.schoolId || cursoCrudColegioId);
    if (!Number.isFinite(schoolId) || schoolId <= 0) {
      showAppAlert('Colegio requerido', 'No se encontro colegio para este usuario', 'warning');
      return;
    }
    setSavingCurso(true);
    setLoadingCursos(true);
    try {
      const payload = {
        nombre,
        schoolId,
        nivel: rectorCursoNivel || null,
        sedeId: rectorCursoSedeId || null
      };
      if (rectorCursoEditing) {
        await updateCurso(rectorCursoEditing.id, payload);
      } else {
        await createCurso(payload);
      }
      await loadCursosAsignados(schoolId);
      resetRectorCursoForm();
    } catch (e) {
      showAppAlert('Error', e?.response?.data?.error || 'No se pudo guardar el curso', 'error');
    } finally {
      setSavingCurso(false);
      setLoadingCursos(false);
    }
  };

  const askDeleteCurso = (curso) => {
    setDeleteCursoModal({ visible: true, curso });
  };

  const handleDeleteCurso = async (curso) => {
    if (!curso?.id) return;
    setDeleteCursoModal({ visible: false, curso: null });
    try {
      setLoadingCursos(true);
      await deleteCurso(curso.id);
      await loadCursosAsignados(cursoCrudColegioId || user?.schoolId);
    } catch (e) {
      showAppAlert('Error', e?.response?.data?.error || 'No se pudo eliminar el curso', 'error');
    } finally {
      setLoadingCursos(false);
    }
  };

  return {
    closeCursosModal,
    openRectorSedesModal,
    closeRectorSedesModal,
    changeCursoCrudColegio,
    openSedeForm,
    closeSedeForm,
    handleSaveSede,
    askDeleteSede,
    handleConfirmDeleteSede,
    openAdminCursoForm,
    closeAdminCursoForm,
    openRectorCursoForm,
    closeRectorCursoForm: resetRectorCursoForm,
    handleSaveAdminCurso,
    handleSaveRectorCurso,
    askDeleteCurso,
    handleDeleteCurso
  };
}
