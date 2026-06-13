import { useEffect } from 'react';
import { Platform } from 'react-native';
import {
  buildDocenteMateriasDraft,
  buildDocenteMateriasPorCursoPayload,
  parseMateriasTexto,
  syncDocenteMateriasDraftWithCursos
} from './homeUtils';

export default function useDocenteCrudActions({
  user,
  isAdmin,
  colegioSeleccionado,
  docenteColegioId,
  docenteEditing,
  docenteForm,
  docenteNivel,
  docenteSedeId,
  docenteCursos,
  docenteCursosDisponibles,
  returnToDocenteListAfterEdit,
  adminDocenteEditModalVisible,
  docenteCrudModalVisible,
  docenteCrudListModalVisible,
  loadingCursos,
  getDocentes,
  createDocente,
  updateDocente,
  deleteDocente,
  getCursosPorColegio,
  getCursosDisponiblesDocente,
  sortCursosForDisplay,
  loadSedesDisponibles,
  loadColegios,
  resolveColegioNombre,
  getApiErrorMessage,
  showAppAlert,
  showPeriodStatusModal,
  docenteCrudSchoolRef,
  docenteMateriasDraftRef,
  docenteCursosReturnTargetRef,
  setDocentesLoading,
  setDocenteError,
  setDocentesError,
  setDocentes,
  setDocenteEditing,
  setDocenteForm,
  setDocenteNivel,
  setDocenteSedeId,
  setDocenteNivelPickerOpen,
  setDocenteSedePickerOpen,
  setShowDocentePassword,
  setDocenteCursos,
  setDocenteCursosDisponibles,
  setDocenteColegioId,
  setDocenteColegioPickerOpen,
  setAdminDocentesSearchTerm,
  setColegioPickerOpen,
  setColegiosOptions,
  setDocenteCrudModalVisible,
  setLoadingCursos,
  setDocenteNivelModalVisible,
  setDocenteCursosModalVisible,
  setAdminDocenteEditModalVisible,
  setReturnToDocenteListAfterEdit,
  setDocenteCrudListModalVisible,
  setDocentesModalVisible,
  setDocentesSearchTerm,
  setDocentesSearchOpen,
  setDeleteDocenteModal,
  setSavingDocente,
  setDocenteMateriasDraft,
  setColegioSeleccionado
}) {
  const setDocenteMateriasState = (nextValue) => {
    docenteMateriasDraftRef.current = nextValue;
    setDocenteMateriasDraft(nextValue);
  };

  const resetDocenteFormState = () => {
    setDocenteEditing(null);
    setDocenteForm({ nombre: '', email: '', password: '' });
    setDocenteNivel('');
    setDocenteSedeId(null);
    setDocenteNivelPickerOpen(false);
    setDocenteSedePickerOpen(false);
    setShowDocentePassword(false);
    setDocenteCursos([]);
    setDocenteError('');
    setDocenteMateriasState({});
  };

  const loadDocentesActual = async (schoolIdParam = null) => {
    setDocentesLoading(true);
    setDocenteError('');
    try {
      const params = schoolIdParam ? { schoolId: schoolIdParam } : {};
      const data = await getDocentes(params);
      setDocentes(data);
      return data;
    } catch (e) {
      const message = e?.response?.data?.error || e?.message || 'No se pudieron cargar los docentes';
      setDocenteError(message);
      setDocentesError(message);
      return [];
    } finally {
      setDocentesLoading(false);
    }
  };

  const openDocenteCrudModal = async () => {
    resetDocenteFormState();
    setDocenteCursosDisponibles([]);
    setDocenteColegioId(user?.schoolId || null);
    setDocenteColegioPickerOpen(false);
    setAdminDocentesSearchTerm('');
    setColegioPickerOpen(false);
    setColegiosOptions(user?.schoolId ? [{ id: user.schoolId, nombre: user?.schoolName || `Colegio ${user.schoolId}` }] : []);
    setDocenteCrudModalVisible(true);
    setLoadingCursos(true);
    try {
      const colegios = await loadColegios({ preferId: user?.schoolId, preferName: user?.schoolName });
      const defaultSchool = user?.schoolId || docenteColegioId || colegioSeleccionado || colegios?.[0]?.id || null;
      setDocenteColegioId(defaultSchool);
      docenteCrudSchoolRef.current = Number(defaultSchool) || null;
      await Promise.all([
        loadCursosDisponiblesDocente(defaultSchool),
        loadDocentesActual(defaultSchool),
        loadSedesDisponibles(defaultSchool)
      ]);
    } finally {
      setLoadingCursos(false);
    }
  };

  const closeDocenteCrudModal = () => {
    setDocenteCrudModalVisible(false);
    setDocenteCrudListModalVisible(false);
    setDocenteColegioPickerOpen(false);
    setDocenteNivelPickerOpen(false);
    setDocenteSedePickerOpen(false);
    resetDocenteFormState();
    setDocenteCursosDisponibles([]);
    setDocenteNivelModalVisible(false);
    setDocenteCursosModalVisible(false);
    setDocenteColegioId(null);
    setDocenteError('');
    setAdminDocentesSearchTerm('');
    docenteCrudSchoolRef.current = null;
  };

  const openDocenteNivelConfigModal = () => {
    docenteCursosReturnTargetRef.current = null;
    setDocenteCrudModalVisible(false);
    setAdminDocenteEditModalVisible(false);
    setDocenteCursosModalVisible(false);
    setDocenteNivelModalVisible(true);
  };

  const closeDocenteNivelConfigModal = () => {
    setDocenteNivelModalVisible(false);
    setTimeout(() => setDocenteCrudModalVisible(true), 0);
  };

  const openDocenteCursosConfigModal = (returnTarget = 'create') => {
    docenteCursosReturnTargetRef.current = returnTarget;
    setDocenteCrudModalVisible(false);
    setAdminDocenteEditModalVisible(false);
    setDocenteNivelModalVisible(false);
    setTimeout(() => setDocenteCursosModalVisible(true), 0);
  };

  const closeDocenteCursosConfigModal = () => {
    const returnTarget = docenteCursosReturnTargetRef.current;
    setDocenteCursosModalVisible(false);
    setTimeout(() => {
      if (returnTarget === 'edit') {
        setAdminDocenteEditModalVisible(true);
      } else {
        setDocenteCrudModalVisible(true);
      }
    }, 0);
  };

  const returnToDocenteCrudListModal = async (schoolIdParam = null) => {
    const targetSchoolId = Number(schoolIdParam || docenteColegioId || user?.schoolId);
    if (Number.isFinite(targetSchoolId) && targetSchoolId > 0) {
      await loadDocentesActual(targetSchoolId);
      setDocenteColegioId(targetSchoolId);
      docenteCrudSchoolRef.current = targetSchoolId;
    }
    setDocenteCrudModalVisible(false);
    setDocenteCrudListModalVisible(true);
    resetDocenteFormState();
    setDocenteCursosDisponibles([]);
    setDocenteNivelModalVisible(false);
    setDocenteCursosModalVisible(false);
    setDocenteColegioPickerOpen(false);
  };

  const openDocenteCrudListModal = async (schoolIdParam = null) => {
    const targetSchoolId = Number(schoolIdParam || docenteColegioId || user?.schoolId);
    setDocentesSearchTerm('');
    setDocentesSearchOpen(false);
    setDocenteColegioPickerOpen(false);
    if (Number.isFinite(targetSchoolId) && targetSchoolId > 0) {
      await loadDocentesActual(targetSchoolId);
      setDocenteColegioId(targetSchoolId);
      docenteCrudSchoolRef.current = targetSchoolId;
    }
    setDocenteCrudListModalVisible(true);
  };

  const closeDocenteCrudListModal = () => {
    setDocenteCrudListModalVisible(false);
    setDocenteColegioPickerOpen(false);
    setDocenteNivelPickerOpen(false);
    setDocenteSedePickerOpen(false);
    setDocentesSearchTerm('');
    setDocentesSearchOpen(false);
  };

  const loadCursosDisponiblesDocente = async (schoolIdParam = null) => {
    const parsedSchoolId = Number(schoolIdParam || docenteColegioId || user?.schoolId);
    if (!Number.isFinite(parsedSchoolId) || parsedSchoolId <= 0) {
      setDocenteCursosDisponibles([]);
      return [];
    }
    const targetSchoolId = parsedSchoolId;
    try {
      let cursos = [];
      try {
        cursos = await getCursosPorColegio(parsedSchoolId);
      } catch {
        cursos = await getCursosDisponiblesDocente({ schoolId: parsedSchoolId });
      }
      if (Number(docenteCrudSchoolRef.current) !== targetSchoolId) return [];
      const orderedCursos = sortCursosForDisplay(cursos || []);
      setDocenteError('');
      setDocenteCursosDisponibles(orderedCursos);
      return orderedCursos;
    } catch (e) {
      if (Number(docenteCrudSchoolRef.current) === targetSchoolId) {
        setDocenteCursosDisponibles([]);
        setDocenteError(e?.response?.data?.error || e?.message || 'No se pudieron cargar los cursos');
      }
      return [];
    }
  };

  useEffect(() => {
    const parsedSchoolId = Number(docenteColegioId);
    if (!docenteCrudModalVisible || !Number.isFinite(parsedSchoolId) || parsedSchoolId <= 0) return;
    docenteCrudSchoolRef.current = parsedSchoolId;
    loadCursosDisponiblesDocente(parsedSchoolId);
    loadDocentesActual(parsedSchoolId);
    loadSedesDisponibles(parsedSchoolId);
  }, [docenteCrudModalVisible, docenteColegioId]);

  useEffect(() => {
    const parsedSchoolId = Number(docenteColegioId);
    if (!docenteCrudListModalVisible || !Number.isFinite(parsedSchoolId) || parsedSchoolId <= 0) return;
    loadDocentesActual(parsedSchoolId);
  }, [docenteColegioId, docenteCrudListModalVisible]);

  const handleSelectDocenteCrudColegio = async (colegioId) => {
    setDocenteColegioId(colegioId);
    setDocenteColegioPickerOpen(false);
    resetDocenteFormState();
    await loadSedesDisponibles(colegioId);
  };

  const sanitizeDocenteNombreInput = (value = '') => String(value || '')
    .replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/^\s+/g, '');

  const normalizeDocenteEmailInput = (value = '') => String(value || '')
    .replace(/\s+/g, '')
    .toLowerCase();

  const syncDocenteMateriasWithCursos = (cursoIds = [], sourceDraft = docenteMateriasDraftRef.current) => {
    const nextValue = syncDocenteMateriasDraftWithCursos(cursoIds, sourceDraft);
    setDocenteMateriasState(nextValue);
    return nextValue;
  };

  const updateDocenteMateriaDraft = (cursoId, value) => {
    const nextValue = {
      ...docenteMateriasDraftRef.current,
      [cursoId]: value
    };
    setDocenteMateriasState(nextValue);
  };

  const commitDocenteMateriaDraft = (cursoId, maybeText) => {
    if (typeof maybeText !== 'string') return;
    updateDocenteMateriaDraft(cursoId, maybeText);
  };

  const buildMateriasPorCursoPayload = (cursoIds = docenteCursos) => {
    return buildDocenteMateriasPorCursoPayload(cursoIds, docenteMateriasDraftRef.current);
  };

  const flushActiveInputBeforeDocenteSave = async () => {
    if (Platform.OS !== 'web') return;
    const activeElement = typeof document !== 'undefined' ? document.activeElement : null;
    if (activeElement && typeof activeElement.blur === 'function') {
      activeElement.blur();
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  };

  const toggleDocenteCurso = (cursoId) => {
    setDocenteCursos((prev) => {
      const next = prev.includes(cursoId)
        ? prev.filter((id) => id !== cursoId)
        : [...prev, cursoId];
      syncDocenteMateriasWithCursos(next);
      return next;
    });
  };

  const openAdminDocenteEditModal = async (docente, options = {}) => {
    setDocenteEditing(docente);
    setDocenteForm({ nombre: docente.nombre || '', email: docente.email || '', password: '' });
    setDocenteNivel(docente?.nivel || '');
    setDocenteSedeId(docente?.sedeId || null);
    setDocenteNivelPickerOpen(false);
    setDocenteSedePickerOpen(false);
    setShowDocentePassword(false);
    setDocenteError('');
    const targetSchoolId = Number(docente.schoolId || docenteColegioId || user?.schoolId || null);
    if (Number.isFinite(targetSchoolId) && targetSchoolId > 0) {
      setDocenteColegioId(targetSchoolId);
      docenteCrudSchoolRef.current = targetSchoolId;
    }
    setReturnToDocenteListAfterEdit(Boolean(options.returnToList));
    setAdminDocenteEditModalVisible(true);
    setLoadingCursos(true);
    try {
      const [, docentesActualizados] = await Promise.all([
        loadCursosDisponiblesDocente(targetSchoolId),
        loadDocentesActual(targetSchoolId),
        loadSedesDisponibles(targetSchoolId)
      ]);
      const docenteActualizado = (docentesActualizados || []).find((item) => String(item?.id) === String(docente?.id)) || docente;
      const cursosAsignados = (docenteActualizado.cursos || []).map((curso) => curso.id);
      const materiasDraft = buildDocenteMateriasDraft(docenteActualizado.cursos || []);
      setDocenteEditing(docenteActualizado);
      setDocenteCursos(cursosAsignados);
      syncDocenteMateriasWithCursos(cursosAsignados, materiasDraft);
    } finally {
      setLoadingCursos(false);
    }
  };

  const closeAdminDocenteEditModal = () => {
    const shouldReturnToList = returnToDocenteListAfterEdit;
    setAdminDocenteEditModalVisible(false);
    setReturnToDocenteListAfterEdit(false);
    resetDocenteFormState();
    if (shouldReturnToList) {
      setDocenteCrudListModalVisible(true);
      const schoolId = Number(docenteColegioId || user?.schoolId || null);
      if (Number.isFinite(schoolId) && schoolId > 0) {
        loadDocentesActual(schoolId);
      }
    }
  };

  const handleSaveDocente = async () => {
    const editingDocenteSnapshot = docenteEditing;
    const editingDocenteId = Number(editingDocenteSnapshot?.id);
    const isEditingDocente = Number.isInteger(editingDocenteId) && editingDocenteId > 0;
    await flushActiveInputBeforeDocenteSave();
    const selectedCursoIds = [...docenteCursos];
    const nombre = docenteForm.nombre.trim();
    const email = normalizeDocenteEmailInput(docenteForm.email);
    const password = docenteForm.password;
    const docenteNombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+(?:\s+[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*$/;

    setDocenteError('');

    if (isEditingDocente && loadingCursos) {
      setDocenteError('Espera a que terminen de cargar los cursos del docente');
      return;
    }
    if (!email || (!isEditingDocente && !password)) {
      setDocenteError('Correo y contrasena son requeridos para crear un docente');
      return;
    }
    if ((!isEditingDocente && password.length < 4) || (isEditingDocente && password && password.length < 4)) {
      setDocenteError('La contrasena debe tener minimo 4 caracteres');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setDocenteError('Ingresa un correo valido');
      return;
    }
    if (!nombre) {
      setDocenteError('Nombre requerido');
      return;
    }
    if (!docenteNombreRegex.test(nombre)) {
      setDocenteError('El nombre solo puede contener letras y espacios');
      return;
    }
    if (!docenteNivel) {
      setDocenteError('Selecciona el nivel docente antes de crear el docente');
      return;
    }
    if (!docenteSedeId) {
      setDocenteError('Selecciona la sede del docente antes de crear el docente');
      return;
    }
    if (selectedCursoIds.length === 0) {
      setDocenteError('Asigna al menos un curso antes de crear el docente');
      return;
    }

    const cursosSinMaterias = selectedCursoIds.filter(
      (cursoId) => parseMateriasTexto(docenteMateriasDraftRef.current?.[cursoId]).length === 0
    );
    if (cursosSinMaterias.length > 0) {
      const cursosSinMateriasLabel = cursosSinMaterias
        .map((cursoId) => docenteCursosDisponibles.find((curso) => String(curso?.id) === String(cursoId))?.nombre || `Curso ${cursoId}`)
        .join(', ');
      setDocenteError(`Ingresa al menos una materia por curso: ${cursosSinMateriasLabel}`);
      return;
    }

    const payload = {
      nombre,
      email,
      cursoIds: selectedCursoIds,
      schoolId: docenteColegioId || user?.schoolId,
      nivel: docenteNivel || null,
      sedeId: docenteSedeId || null,
      materiasPorCurso: buildMateriasPorCursoPayload(selectedCursoIds)
    };
    if (isEditingDocente) {
      if (password) payload.password = password;
    } else {
      payload.password = password;
    }

    setSavingDocente(true);
    try {
      let savedDocente = null;
      if (isEditingDocente) {
        savedDocente = await updateDocente(editingDocenteId, payload);
      } else {
        savedDocente = await createDocente(payload);
      }
      await loadDocentesActual(payload.schoolId);
      if (isEditingDocente) {
        const shouldReturnToList = returnToDocenteListAfterEdit;
        const cursosActualizados = (savedDocente?.cursos || []).map((curso) => curso.id);
        const materiasDraft = buildDocenteMateriasDraft(savedDocente?.cursos || []);
        setDocenteEditing(savedDocente || editingDocenteSnapshot);
        setDocenteCursos(cursosActualizados.length ? cursosActualizados : selectedCursoIds);
        syncDocenteMateriasWithCursos(
          cursosActualizados.length ? cursosActualizados : selectedCursoIds,
          materiasDraft
        );
        showPeriodStatusModal('Docente actualizado');
        if (isAdmin && adminDocenteEditModalVisible) {
          setAdminDocenteEditModalVisible(false);
          setReturnToDocenteListAfterEdit(false);
          resetDocenteFormState();
          if (shouldReturnToList) {
            await returnToDocenteCrudListModal(payload.schoolId);
          }
        } else {
          await returnToDocenteCrudListModal(payload.schoolId);
        }
      } else {
        resetDocenteFormState();
        showPeriodStatusModal('Docente creado');
      }
      return savedDocente;
    } catch (e) {
      const rawMessage = getApiErrorMessage(e, 'No se pudo guardar el docente');
      const message = String(rawMessage).toLowerCase().includes('validation')
        ? 'No se pudo guardar. Verifica que el correo no este en uso'
        : rawMessage;
      setDocenteError(message);
      showAppAlert('Error', message, 'error');
    } finally {
      setSavingDocente(false);
    }
  };

  const askDeleteDocente = (docente) => {
    setDeleteDocenteModal({ visible: true, docente });
  };

  const handleDeleteDocente = async (docente) => {
    if (!docente?.id) return;
    setDeleteDocenteModal({ visible: false, docente: null });
    setDocentesLoading(true);
    try {
      await deleteDocente(docente.id);
      if (String(docenteEditing?.id) === String(docente.id)) {
        resetDocenteFormState();
      }
      await loadDocentesActual(docenteColegioId || user?.schoolId);
    } catch (e) {
      showAppAlert('Error', e?.response?.data?.error || 'No se pudo eliminar el docente', 'error');
    } finally {
      setDocentesLoading(false);
    }
  };

  const loadDocentesColegio = async (schoolIdValue = null) => {
    const schoolId = schoolIdValue || colegioSeleccionado || user?.schoolId || undefined;
    if (!schoolId) {
      setDocentes([]);
      setDocentesError('Selecciona un colegio primero');
      return;
    }
    setDocentesSearchTerm('');
    setDocentesSearchOpen(false);
    setDocentesLoading(true);
    setDocentesError('');
    try {
      const data = await getDocentes({ schoolId });
      setDocentes(data);
      setColegioSeleccionado(schoolId);
      setColegiosOptions((prev) => {
        const exists = prev.some((option) => String(option.id) === String(schoolId));
        if (exists) return prev;
        const nombre = data[0]?.schoolName || data[0]?.colegio?.nombre || resolveColegioNombre(schoolId);
        return [...prev, { id: schoolId, nombre }];
      });
    } catch (e) {
      setDocentesError(e?.response?.data?.error || e?.message || 'No se pudieron cargar los docentes');
    } finally {
      setDocentesLoading(false);
    }
  };

  const openDocentesModal = async () => {
    setDocentesModalVisible(false);
    await openDocenteCrudListModal(user?.schoolId || colegioSeleccionado || null);
  };

  const closeDocentesModal = () => {
    setDocentesModalVisible(false);
    setDocentesSearchTerm('');
    setDocentesSearchOpen(false);
    setDocentesError('');
    setColegioSeleccionado(null);
    setColegioPickerOpen(false);
    setColegiosOptions([]);
  };

  return {
    loadDocentesActual,
    openDocenteCrudModal,
    closeDocenteCrudModal,
    openDocenteNivelConfigModal,
    closeDocenteNivelConfigModal,
    openDocenteCursosConfigModal,
    closeDocenteCursosConfigModal,
    returnToDocenteCrudListModal,
    openDocenteCrudListModal,
    closeDocenteCrudListModal,
    loadCursosDisponiblesDocente,
    resetDocenteFormState,
    handleSelectDocenteCrudColegio,
    sanitizeDocenteNombreInput,
    normalizeDocenteEmailInput,
    updateDocenteMateriaDraft,
    commitDocenteMateriaDraft,
    parseMateriasTexto,
    toggleDocenteCurso,
    openAdminDocenteEditModal,
    closeAdminDocenteEditModal,
    handleSaveDocente,
    askDeleteDocente,
    handleDeleteDocente,
    loadDocentesColegio,
    openDocentesModal,
    closeDocentesModal
  };
}
