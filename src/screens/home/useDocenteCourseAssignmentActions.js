export default function useDocenteCourseAssignmentActions({
  user,
  cursoDocColegioId,
  asignacionCursosDocente,
  getDocentes,
  getCursosDisponiblesDocente,
  updateDocente,
  loadColegios,
  showAppAlert,
  cursoDocSchoolRef,
  setCursoDocModalVisible,
  setCursoDocPickerOpen,
  setCursoDocColegioId,
  setMostrarAsignadorCursoDoc,
  setCursoDocCursos,
  setDocentes,
  setCursosAsignados,
  setAsignacionCursosDocente,
  setSavingAsignacionDocenteId,
  setDocentesError,
  setLoadingCursos,
  setColegiosOptions
}) {
  const buildAsignacionesDocenteMap = (docs = []) => {
    const map = {};
    docs.forEach((docente) => {
      map[docente.id] = (docente.cursos || []).map((curso) => curso.id);
    });
    return map;
  };

  const mergeAsignacionesDocente = (docs = []) => {
    const nextMap = buildAsignacionesDocenteMap(docs);
    setAsignacionCursosDocente((prev) => ({ ...prev, ...nextMap }));
  };

  const loadCursoDocDataExact = async (schoolId) => {
    const targetSchoolId = Number(schoolId);
    if (!Number.isFinite(targetSchoolId) || targetSchoolId <= 0) return { cursos: [], docs: [] };
    setLoadingCursos(true);
    setDocentesError('');
    try {
      const [cursosResult, docsResult] = await Promise.allSettled([
        getCursosDisponiblesDocente({ schoolId: targetSchoolId }),
        getDocentes({ schoolId: targetSchoolId })
      ]);
      const cursos = cursosResult.status === 'fulfilled' ? (cursosResult.value || []) : [];
      const docs = docsResult.status === 'fulfilled' ? (docsResult.value || []) : [];
      if (Number(cursoDocSchoolRef.current) !== targetSchoolId) return { cursos: [], docs: [] };
      setCursoDocCursos(cursos || []);
      setDocentes(docs || []);
      mergeAsignacionesDocente(docs || []);

      if (docsResult.status === 'rejected' || cursosResult.status === 'rejected') {
        const cursosError = cursosResult.status === 'rejected' ? cursosResult.reason : null;
        const docsError = docsResult.status === 'rejected' ? docsResult.reason : null;
        const message = docsError?.response?.data?.error
          || cursosError?.response?.data?.error
          || docsError?.message
          || cursosError?.message
          || 'No se pudieron cargar todos los datos';
        setDocentesError(message);
      }

      return { cursos: cursos || [], docs: docs || [] };
    } catch (e) {
      setCursoDocCursos([]);
      setDocentes([]);
      setDocentesError(e?.response?.data?.error || e?.message || 'No se pudieron cargar cursos/docentes');
      return { cursos: [], docs: [] };
    } finally {
      setLoadingCursos(false);
    }
  };

  const loadDataCursoDocBySchool = async (schoolId) => loadCursoDocDataExact(schoolId);

  const openCursoDocentesModal = async () => {
    setCursoDocModalVisible(true);
    setCursoDocPickerOpen(false);
    setCursoDocColegioId(null);
    setMostrarAsignadorCursoDoc(false);
    setCursoDocCursos([]);
    setDocentes([]);
    setCursosAsignados([]);
    setAsignacionCursosDocente({});
    setDocentesError('');
    cursoDocSchoolRef.current = null;
    const userSchoolOption = user?.schoolId
      ? [{ id: user.schoolId, nombre: user?.schoolName || `Colegio ${user.schoolId}` }]
      : [];
    setColegiosOptions(userSchoolOption);
    const colegios = await loadColegios({ preferId: user?.schoolId, preferName: user?.schoolName });
    const defaultSchoolId = user?.schoolId || colegios?.[0]?.id || null;
    if (defaultSchoolId) {
      await changeCursoDocColegio(defaultSchoolId);
    }
  };

  const closeCursoDocentesModal = () => {
    setCursoDocModalVisible(false);
    setCursoDocPickerOpen(false);
    setCursoDocColegioId(null);
    setMostrarAsignadorCursoDoc(false);
    setCursoDocCursos([]);
    setDocentes([]);
    setCursosAsignados([]);
    setAsignacionCursosDocente({});
    setSavingAsignacionDocenteId(null);
    cursoDocSchoolRef.current = null;
  };

  const changeCursoDocColegio = async (newSchoolId) => {
    const targetSchoolId = Number(newSchoolId);
    if (!Number.isFinite(targetSchoolId) || targetSchoolId <= 0) return;
    cursoDocSchoolRef.current = targetSchoolId;
    setCursoDocColegioId(targetSchoolId);
    setCursoDocPickerOpen(false);
    setMostrarAsignadorCursoDoc(true);
    await loadDataCursoDocBySchool(targetSchoolId);
  };

  const toggleCursoDocenteAsignacion = (docenteId, cursoId) => {
    setAsignacionCursosDocente((prev) => {
      const current = prev[docenteId] || [];
      const next = current.includes(cursoId)
        ? current.filter((id) => id !== cursoId)
        : [...current, cursoId];
      return { ...prev, [docenteId]: next };
    });
  };

  const guardarAsignacionDocente = async (docenteId) => {
    const cursoIdsToSave = asignacionCursosDocente[docenteId] || [];
    const schoolId = Number(cursoDocColegioId);
    if (!Number.isFinite(schoolId) || schoolId <= 0) return;
    setSavingAsignacionDocenteId(docenteId);
    try {
      await updateDocente(docenteId, { cursoIds: cursoIdsToSave, schoolId });
      await loadCursoDocDataExact(schoolId);
    } catch (e) {
      showAppAlert('Error', e?.response?.data?.error || 'No se pudo guardar la asignacion', 'error');
    } finally {
      setSavingAsignacionDocenteId(null);
    }
  };

  return {
    openCursoDocentesModal,
    closeCursoDocentesModal,
    changeCursoDocColegio,
    toggleCursoDocenteAsignacion,
    guardarAsignacionDocente,
    loadCursoDocDataExact
  };
}
