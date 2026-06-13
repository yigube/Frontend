export default function useSchoolDataLoaders({
  user,
  getCursos,
  getSedes,
  sortCursosForDisplay,
  setCursosAsignados,
  setSedesDisponibles,
  setSedesLoading
}) {
  const loadCursosAsignados = async (schoolIdParam = null) => {
    const params = schoolIdParam ? { schoolId: schoolIdParam } : {};
    const cursos = await getCursos(params);
    const ordered = sortCursosForDisplay(cursos);
    setCursosAsignados(ordered);
    return ordered;
  };

  const loadSedesDisponibles = async (schoolIdParam = null) => {
    const parsedSchoolId = Number(schoolIdParam || user?.schoolId);
    if (!Number.isFinite(parsedSchoolId) || parsedSchoolId <= 0) {
      setSedesDisponibles([]);
      return [];
    }
    setSedesLoading(true);
    try {
      const data = await getSedes({ schoolId: parsedSchoolId });
      const ordered = [...(data || [])].sort((a, b) => {
        const aName = String(a?.nombre || '').trim();
        const bName = String(b?.nombre || '').trim();
        return aName.localeCompare(bName, undefined, { sensitivity: 'base' });
      });
      setSedesDisponibles(ordered);
      return ordered;
    } catch {
      setSedesDisponibles([]);
      return [];
    } finally {
      setSedesLoading(false);
    }
  };

  return {
    loadCursosAsignados,
    loadSedesDisponibles
  };
}
