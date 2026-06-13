import { useEffect } from 'react';

export default function usePeriodCrudActions({
  user,
  periodos,
  periodSchoolId,
  periodModalVisible,
  editingPeriodo,
  periodForm,
  canAdminFilterPeriodSchools,
  currentYear,
  monthNames,
  periodModalScrollRef,
  createDefaultPeriodForm,
  buildPeriodFormFromPeriodo,
  buildNormalizedPeriodoNameUpdates,
  buildPeriodPayloadFromForm,
  getPeriodoRangeError,
  getPeriodoSequenceError,
  sortPeriodos,
  getApiErrorMessage,
  loadColegios,
  getPeriodos,
  createPeriodo,
  updatePeriodo,
  deletePeriodo,
  showAppAlert,
  showPeriodStatusModal,
  clearPeriodStatusTimeout,
  setPeriodos,
  setPeriodSchoolId,
  setPeriodSchoolPickerOpen,
  setPeriodFeedback,
  setEditingPeriodo,
  setPeriodForm,
  setPeriodModalVisible,
  setSavingPeriodo,
  setDeletePeriodModal
}) {
  const getPeriodManagedSchoolId = (explicitSchoolId = null) => {
    const parsedExplicit = Number(explicitSchoolId);
    if (Number.isFinite(parsedExplicit) && parsedExplicit > 0) return parsedExplicit;

    if (!canAdminFilterPeriodSchools) {
      const userSchool = Number(user?.schoolId);
      if (Number.isFinite(userSchool) && userSchool > 0) return userSchool;
    }

    const selectedSchool = Number(periodSchoolId);
    if (Number.isFinite(selectedSchool) && selectedSchool > 0) return selectedSchool;
    return null;
  };

  const loadPeriodos = async ({ schoolId = null, silent = false } = {}) => {
    try {
      const managedSchoolId = getPeriodManagedSchoolId(schoolId);
      const params = managedSchoolId ? { schoolId: managedSchoolId } : {};
      const data = await getPeriodos(params);
      const ordered = sortPeriodos(data);
      setPeriodos(ordered);
      return ordered;
    } catch (e) {
      if (!silent) {
        showAppAlert('Error', e?.response?.data?.error || 'No se pudieron cargar los periodos', 'error');
      }
      return [];
    }
  };

  const normalizePeriodosNames = async (list) => {
    const updates = buildNormalizedPeriodoNameUpdates(list)
      .map((item) => updatePeriodo(item.id, { nombre: item.nombre }));
    if (updates.length > 0) await Promise.all(updates);
    return updates.length;
  };

  useEffect(() => { loadPeriodos(); }, []);
  useEffect(() => () => clearPeriodStatusTimeout(), []);

  const openPeriodManagerModal = async () => {
    setPeriodFeedback({ type: '', message: '' });
    setEditingPeriodo(null);
    setPeriodSchoolPickerOpen(false);

    let managedSchoolId = getPeriodManagedSchoolId();
    if (canAdminFilterPeriodSchools) {
      const options = await loadColegios({
        preferId: periodSchoolId || user?.schoolId || null,
        preferName: user?.schoolName
      });
      const defaultSchoolId = managedSchoolId || Number(options?.[0]?.id) || null;
      setPeriodSchoolId(defaultSchoolId || null);
      managedSchoolId = getPeriodManagedSchoolId(defaultSchoolId);
      if (!managedSchoolId) {
        setPeriodos([]);
        setPeriodForm(createDefaultPeriodForm([]));
        setPeriodModalVisible(true);
        return;
      }
    }

    const loaded = await loadPeriodos({ schoolId: managedSchoolId, silent: true });
    setPeriodForm(createDefaultPeriodForm(loaded));
    setPeriodModalVisible(true);
  };

  const openPeriodModal = (periodo = null) => {
    setPeriodFeedback({ type: '', message: '' });
    setPeriodSchoolPickerOpen(false);
    if (periodo) {
      setPeriodForm(buildPeriodFormFromPeriodo(periodo, currentYear));
      setEditingPeriodo(periodo);
    } else {
      setPeriodForm(createDefaultPeriodForm(periodos));
      setEditingPeriodo(null);
    }
    setPeriodModalVisible(true);
    if (periodo) {
      setTimeout(() => {
        periodModalScrollRef.current?.scrollTo({ y: 0, animated: true });
      }, 120);
    }
  };

  const closePeriodModal = () => {
    setPeriodModalVisible(false);
    setPeriodSchoolPickerOpen(false);
    setEditingPeriodo(null);
    setPeriodFeedback({ type: '', message: '' });
  };

  const handleSavePeriod = async () => {
    const managedSchoolId = getPeriodManagedSchoolId();
    if (!managedSchoolId) {
      const message = 'Selecciona un colegio para gestionar periodos';
      setPeriodFeedback({ type: 'error', message });
      showAppAlert('Error', message, 'error');
      return;
    }
    const nombre = periodForm.nombre.trim() || `Periodo ${periodos.length + 1 || 1}`;
    const payload = buildPeriodPayloadFromForm(periodForm, { nombre, schoolId: managedSchoolId });
    const rangeError = getPeriodoRangeError(payload.fechaInicio, payload.fechaFin);
    if (rangeError) {
      setPeriodFeedback({ type: 'error', message: rangeError });
      showAppAlert('Error', rangeError, 'error');
      return;
    }
    const sequenceError = getPeriodoSequenceError(payload.fechaInicio, payload.fechaFin);
    if (sequenceError) {
      setPeriodFeedback({ type: 'error', message: sequenceError });
      showAppAlert('Error', sequenceError, 'error');
      return;
    }
    setPeriodFeedback({ type: '', message: '' });
    setSavingPeriodo(true);
    try {
      if (editingPeriodo) {
        await updatePeriodo(editingPeriodo.id, payload);
        const loaded = await loadPeriodos({ schoolId: managedSchoolId });
        showPeriodStatusModal('Periodo actualizado');
        setEditingPeriodo(null);
        setPeriodForm(createDefaultPeriodForm(loaded));
      } else {
        await createPeriodo(payload);
        const loaded = await loadPeriodos({ schoolId: managedSchoolId });
        showPeriodStatusModal('Periodo creado');
        setPeriodForm(createDefaultPeriodForm(loaded));
      }
    } catch (e) {
      const message = e?.response?.data?.error || 'No se pudo guardar el periodo';
      setPeriodFeedback({ type: 'error', message });
      showAppAlert('Error', message, 'error');
    } finally {
      setSavingPeriodo(false);
    }
  };

  const askDeletePeriod = (id) => {
    setDeletePeriodModal({ visible: true, id });
  };

  const handleDeletePeriod = async (id) => {
    if (!id) return;
    const managedSchoolId = getPeriodManagedSchoolId();
    setDeletePeriodModal({ visible: false, id: null });
    try {
      await deletePeriodo(id);
      const loaded = await loadPeriodos({ schoolId: managedSchoolId });
      const normalizedCount = await normalizePeriodosNames(loaded);
      const finalList = normalizedCount > 0 ? await loadPeriodos({ schoolId: managedSchoolId }) : loaded;
      setEditingPeriodo(null);
      setPeriodForm(createDefaultPeriodForm(finalList));
    } catch (e) {
      showAppAlert('Error', getApiErrorMessage(e, 'No se pudo eliminar'), 'error');
    }
  };

  useEffect(() => {
    if (!periodModalVisible || !canAdminFilterPeriodSchools || editingPeriodo) return;
    const managedSchoolId = getPeriodManagedSchoolId();
    if (!managedSchoolId) {
      setPeriodos([]);
      setPeriodForm(createDefaultPeriodForm([]));
      return;
    }
    (async () => {
      const loaded = await loadPeriodos({ schoolId: managedSchoolId, silent: true });
      setPeriodForm(createDefaultPeriodForm(loaded));
    })();
  }, [periodModalVisible, periodSchoolId, canAdminFilterPeriodSchools, editingPeriodo]);

  const startSelect = (key, value) => setPeriodForm((prev) => ({ ...prev, [key]: value }));

  const cycleValue = (key, list) => {
    setPeriodForm((prev) => {
      const current = prev[key];
      const idx = list.indexOf(current);
      const next = list[(idx + 1) % list.length];
      return { ...prev, [key]: next };
    });
  };

  const adjustValue = (key, list, delta) => {
    setPeriodForm((prev) => {
      const current = prev[key];
      const idx = list.indexOf(current);
      const next = list[(idx + delta + list.length) % list.length];
      return { ...prev, [key]: next };
    });
  };

  return {
    getPeriodManagedSchoolId,
    loadPeriodos,
    openPeriodManagerModal,
    openPeriodModal,
    closePeriodModal,
    handleSavePeriod,
    askDeletePeriod,
    handleDeletePeriod,
    startSelect,
    cycleValue,
    adjustValue
  };
}
