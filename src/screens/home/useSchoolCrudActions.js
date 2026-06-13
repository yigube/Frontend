export default function useSchoolCrudActions({
  user,
  savingColegio,
  colegioEditing,
  rectorEditing,
  colegioNombre,
  colegioCodigoDane,
  rectorCargo,
  rectorNombre,
  rectorApellido,
  rectorCorreo,
  rectorTelefono,
  rectorCedula,
  rectorPassword,
  colegioSeleccionado,
  colegiosOptions,
  colegiosScrollRef,
  setColegiosModalVisible,
  setColegiosListModalVisible,
  setColegiosListView,
  setColegioEditing,
  setColegioNombre,
  setColegioCodigoDane,
  setRectorNombre,
  setRectorApellido,
  setRectorCorreo,
  setRectorTelefono,
  setRectorCedula,
  setRectorCargo,
  setRectorPassword,
  setShowRectorPassword,
  setHasRectorPassword,
  setColegiosError,
  setDaneExistsModal,
  setRectoresSearchTerm,
  setRectorEditing,
  setRectorEditModalVisible,
  setDeleteRectorModal,
  setDeleteColegioModal,
  setColegiosLoading,
  setSavingColegio,
  setColegiosList,
  setColegiosOptions,
  setColegioSeleccionado,
  createColegio,
  updateColegio,
  deleteColegio,
  getColegios,
  normalizeColegioItem,
  hideColegiosSuccess,
  showColegiosSuccess,
  getApiErrorMessage,
  showAppAlert
}) {
  const resetColegioFormState = () => {
    setColegioEditing(null);
    setColegioNombre('');
    setColegioCodigoDane('');
    setRectorNombre('');
    setRectorApellido('');
    setRectorCorreo('');
    setRectorTelefono('');
    setRectorCedula('');
    setRectorCargo('rector');
    setRectorPassword('');
    setShowRectorPassword(false);
    setHasRectorPassword(false);
  };

  const loadColegios = async ({ preferId = null, preferName } = {}) => {
    setSavingColegio(true);
    setColegiosError('');
    try {
      const data = await getColegios();
      const normalized = (data || []).map(normalizeColegioItem);
      setColegiosList(normalized);
      const mapped = normalized.map((colegio) => ({ id: colegio.id, nombre: colegio.nombre || `Colegio ${colegio.id}` }));
      const merged = [...mapped];
      if (preferId && !merged.some((option) => String(option.id) === String(preferId))) {
        merged.push({ id: preferId, nombre: preferName || `Colegio ${preferId}` });
      }
      setColegiosOptions(merged);
      const firstId = preferId || merged[0]?.id || null;
      if (!colegioSeleccionado && firstId) {
        setColegioSeleccionado(firstId);
      }
      return merged;
    } catch (e) {
      const message = e?.response?.data?.error || e?.message || 'No se pudieron cargar los colegios';
      setColegiosError(message);
      const fallback = [];
      if (preferId) fallback.push({ id: preferId, nombre: preferName || `Colegio ${preferId}` });
      else if (user?.schoolId) fallback.push({ id: user.schoolId, nombre: user?.schoolName || `Colegio ${user.schoolId}` });
      if (fallback.length) {
        setColegiosOptions((prev) => (prev.length ? prev : fallback));
      }
      return fallback.length ? fallback : colegiosOptions;
    } finally {
      setSavingColegio(false);
    }
  };

  const openColegiosModal = async () => {
    resetColegioFormState();
    setColegiosError('');
    hideColegiosSuccess({ animated: false });
    setColegiosModalVisible(true);
    await loadColegios();
  };

  const closeColegiosModal = () => {
    setColegiosModalVisible(false);
    setColegiosListModalVisible(false);
    resetColegioFormState();
    setColegiosError('');
    hideColegiosSuccess({ animated: false });
  };

  const cancelColegioEdit = () => {
    if (savingColegio) return;
    resetColegioFormState();
    setColegiosModalVisible(false);
  };

  const startEditColegio = (colegio) => {
    const normalized = normalizeColegioItem(colegio);
    setColegiosListModalVisible(false);
    setColegiosModalVisible(true);
    setColegioEditing(normalized);
    setColegioNombre(normalized?.nombre || '');
    setColegioCodigoDane(normalized?.codigoDane || '');
    setRectorNombre('');
    setRectorApellido('');
    setRectorCorreo('');
    setRectorTelefono('');
    setRectorCedula('');
    setRectorCargo('rector');
    setRectorPassword('');
    setShowRectorPassword(false);
    setHasRectorPassword(false);
    setColegiosError('');
    hideColegiosSuccess({ animated: false });
    setTimeout(() => {
      colegiosScrollRef.current?.scrollTo?.({ y: 0, animated: true });
    }, 0);
  };

  const handleSaveColegio = async () => {
    const nombre = colegioNombre.trim();
    const codigoDane = colegioCodigoDane.trim();
    const rectorNombreValue = rectorNombre.trim();
    const rectorApellidoValue = rectorApellido.trim();
    const rectorCorreoValue = rectorCorreo.trim();
    const rectorTelefonoValue = rectorTelefono.trim();
    const rectorCedulaValue = rectorCedula.trim();
    const passwordDraft = rectorPassword.trim();
    const payload = colegioEditing
      ? { nombre, codigoDane }
      : {
          nombre,
          codigoDane,
          rectorCargo,
          rectorNombre: rectorNombreValue,
          rectorApellido: rectorApellidoValue,
          rectorCorreo: rectorCorreoValue,
          rectorTelefono: rectorTelefonoValue,
          rectorCedula: rectorCedulaValue
        };

    if (!colegioEditing && passwordDraft) {
      payload.rectorPassword = passwordDraft;
    }
    if (!nombre) {
      showAppAlert('Nombre requerido', 'Ingresa un nombre para el colegio', 'warning');
      return;
    }
    if (!colegioEditing) {
      if (!codigoDane) {
        showAppAlert('Codigo DANE requerido', 'Ingresa el codigo DANE de la institucion', 'warning');
        return;
      }
      if (!rectorNombreValue) {
        showAppAlert('Nombre requerido', 'Ingresa el nombre del directivo', 'warning');
        return;
      }
      if (!rectorApellidoValue) {
        showAppAlert('Apellido requerido', 'Ingresa el apellido del directivo', 'warning');
        return;
      }
      if (!rectorCorreoValue) {
        showAppAlert('Correo requerido', 'Ingresa el correo del directivo', 'warning');
        return;
      }
      if (!rectorTelefonoValue) {
        showAppAlert('Telefono requerido', 'Ingresa el telefono del directivo', 'warning');
        return;
      }
      if (!rectorCedulaValue) {
        showAppAlert('Cedula requerida', 'Ingresa la cedula del directivo', 'warning');
        return;
      }
      if (!passwordDraft) {
        showAppAlert('Contrasena requerida', 'Ingresa la contrasena del directivo', 'warning');
        return;
      }
    }

    setColegiosLoading(true);
    setColegiosError('');
    hideColegiosSuccess({ animated: false });
    try {
      const successMessage = colegioEditing
        ? 'Datos actualizados correctamente'
        : 'Datos creados correctamente';
      if (colegioEditing) {
        await updateColegio(colegioEditing.id, payload);
      } else {
        await createColegio(payload);
      }
      await loadColegios();
      showColegiosSuccess(successMessage);
      setColegiosListModalVisible(true);
      resetColegioFormState();
    } catch (e) {
      const apiError = getApiErrorMessage(e, 'No se pudo guardar el colegio');
      if (String(apiError).toLowerCase().includes('codigo dane ya existe')) {
        setDaneExistsModal({ visible: true, message: 'El codigo DANE ya existe. Ingresa uno diferente.' });
      } else {
        setColegiosError(apiError);
        showAppAlert('Error', apiError, 'error');
      }
    } finally {
      setColegiosLoading(false);
    }
  };

  const openColegiosListModal = async () => {
    await loadColegios();
    setColegiosListView('colegios');
    setRectoresSearchTerm('');
    setColegiosListModalVisible(true);
  };

  const openRectoresListModal = async () => {
    await loadColegios();
    setColegiosListView('rectores');
    setRectoresSearchTerm('');
    setColegiosListModalVisible(true);
  };

  const closeColegiosListModal = () => {
    setColegiosListModalVisible(false);
    setRectoresSearchTerm('');
  };

  const openRectorEditModal = (rector) => {
    if (!rector?.colegio) return;
    setRectorEditing(rector);
    setRectorCargo((rector?.cargo || 'rector') === 'coordinador' ? 'coordinador' : 'rector');
    setRectorNombre(rector?.nombre || '');
    setRectorApellido(rector?.apellido || '');
    setRectorCorreo(rector?.correo || '');
    setRectorTelefono(rector?.telefono || '');
    setRectorCedula(rector?.cedula || '');
    setRectorPassword('');
    setShowRectorPassword(false);
    setColegiosError('');
    hideColegiosSuccess({ animated: false });
    setRectorEditModalVisible(true);
  };

  const closeRectorEditModal = () => {
    if (savingColegio) return;
    setRectorEditModalVisible(false);
    setRectorEditing(null);
    setRectorNombre('');
    setRectorApellido('');
    setRectorCorreo('');
    setRectorTelefono('');
    setRectorCedula('');
    setRectorCargo('rector');
    setRectorPassword('');
    setShowRectorPassword(false);
    setColegiosError('');
    hideColegiosSuccess({ animated: false });
  };

  const handleSaveRector = async () => {
    if (!rectorEditing?.colegio?.id) return;
    const rectorNombreValue = rectorNombre.trim();
    const rectorApellidoValue = rectorApellido.trim();
    const rectorCorreoValue = rectorCorreo.trim();
    const rectorTelefonoValue = rectorTelefono.trim();
    const rectorCedulaValue = rectorCedula.trim();
    const passwordDraft = rectorPassword.trim();

    if (!rectorNombreValue) {
      showAppAlert('Nombre requerido', 'Ingresa el nombre del directivo', 'warning');
      return;
    }
    if (!rectorApellidoValue) {
      showAppAlert('Apellido requerido', 'Ingresa el apellido del directivo', 'warning');
      return;
    }
    if (!rectorCorreoValue) {
      showAppAlert('Correo requerido', 'Ingresa el correo del directivo', 'warning');
      return;
    }
    if (!rectorTelefonoValue) {
      showAppAlert('Telefono requerido', 'Ingresa el telefono del directivo', 'warning');
      return;
    }
    if (!rectorCedulaValue) {
      showAppAlert('Cedula requerida', 'Ingresa la cedula del directivo', 'warning');
      return;
    }

    setSavingColegio(true);
    setColegiosError('');
    hideColegiosSuccess({ animated: false });
    try {
      const payload = {
        rectorCargo,
        rectorNombre: rectorNombreValue,
        rectorApellido: rectorApellidoValue,
        rectorCorreo: rectorCorreoValue,
        rectorTelefono: rectorTelefonoValue,
        rectorCedula: rectorCedulaValue
      };
      if (passwordDraft) payload.rectorPassword = passwordDraft;
      await updateColegio(rectorEditing.colegio.id, payload);
      await loadColegios();
      showColegiosSuccess('Directivo actualizado correctamente');
      showAppAlert('Listo', 'Directivo actualizado correctamente', 'success');
      setRectorEditModalVisible(false);
      setRectorEditing(null);
      setRectorPassword('');
      setShowRectorPassword(false);
    } catch (e) {
      const apiError = getApiErrorMessage(e, 'No se pudo actualizar el directivo');
      setColegiosError(apiError);
      showAppAlert('Error', apiError, 'error');
    } finally {
      setSavingColegio(false);
    }
  };

  const askDeleteRector = (rector) => {
    setDeleteRectorModal({ visible: true, rector });
  };

  const handleDeleteRector = async (rector) => {
    if (!rector?.colegio?.id) return;
    setDeleteRectorModal({ visible: false, rector: null });
    setColegiosLoading(true);
    try {
      await updateColegio(rector.colegio.id, {
        rectorCargo: '',
        rectorNombre: '',
        rectorApellido: '',
        rectorCorreo: '',
        rectorTelefono: '',
        rectorCedula: ''
      });
      await loadColegios();
      showAppAlert('Listo', 'Directivo eliminado correctamente', 'success');
    } catch (e) {
      showAppAlert('Error', getApiErrorMessage(e, 'No se pudo eliminar el directivo'), 'error');
    } finally {
      setColegiosLoading(false);
    }
  };

  const askDeleteColegio = (colegio) => {
    setDeleteColegioModal({ visible: true, colegio });
  };

  const handleDeleteColegio = async (colegio) => {
    if (!colegio?.id) return;
    setDeleteColegioModal({ visible: false, colegio: null });
    setColegiosLoading(true);
    try {
      await deleteColegio(colegio.id);
      await loadColegios();
    } catch (e) {
      showAppAlert('Error', e?.response?.data?.error || 'No se pudo eliminar el colegio', 'error');
    } finally {
      setColegiosLoading(false);
    }
  };

  return {
    resetColegioFormState,
    loadColegios,
    openColegiosModal,
    closeColegiosModal,
    cancelColegioEdit,
    startEditColegio,
    handleSaveColegio,
    openColegiosListModal,
    openRectoresListModal,
    closeColegiosListModal,
    openRectorEditModal,
    closeRectorEditModal,
    handleSaveRector,
    askDeleteRector,
    handleDeleteRector,
    askDeleteColegio,
    handleDeleteColegio
  };
}
