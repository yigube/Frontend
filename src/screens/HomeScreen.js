import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, Modal, Pressable, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../store/useAuth';
import ScreenBackground from '../components/ScreenBackground';
import { getPeriodos, createPeriodo, updatePeriodo, deletePeriodo } from '../services/periodos';
import { getCursos, createCurso, updateCurso, deleteCurso } from '../services/cursos';
import { getEstudiantes } from '../services/estudiantes';
import { getDocentes, createDocente, updateDocente, deleteDocente } from '../services/docentes';
import { getColegios, createColegio, updateColegio, deleteColegio } from '../services/colegios';

export default function HomeScreen() {
  const logout = useAuth(s => s.logout);
  const user = useAuth(s => s.user);
  const canManageCourses = ['admin', 'rector', 'coordinador'].includes(user?.rol);
  const navigation = useNavigation();
  const teacherInitial = (user?.email?.[0] || 'D').toUpperCase();
  const [periodos, setPeriodos] = useState([]);
  const [periodModalVisible, setPeriodModalVisible] = useState(false);
  const [editingPeriodo, setEditingPeriodo] = useState(null);
  const [savingPeriodo, setSavingPeriodo] = useState(false);
  const [quickModal, setQuickModal] = useState(null);
  const [cursoDocModalVisible, setCursoDocModalVisible] = useState(false);
  const [cursosAsignados, setCursosAsignados] = useState([]);
  const [cursoDocColegioId, setCursoDocColegioId] = useState(null);
  const [cursoDocPickerOpen, setCursoDocPickerOpen] = useState(false);
  const [mostrarAsignadorCursoDoc, setMostrarAsignadorCursoDoc] = useState(false);
  const [cursoDocCursos, setCursoDocCursos] = useState([]);
  const [asignacionCursosDocente, setAsignacionCursosDocente] = useState({});
  const [savingAsignacionDocenteId, setSavingAsignacionDocenteId] = useState(null);
  const cursoDocSchoolRef = useRef(null);
  const [cursosModalVisible, setCursosModalVisible] = useState(false);
  const [loadingCursos, setLoadingCursos] = useState(false);
  const [cursoFormVisible, setCursoFormVisible] = useState(false);
  const [cursoNombre, setCursoNombre] = useState('');
  const [cursoEditing, setCursoEditing] = useState(null);
  const [savingCurso, setSavingCurso] = useState(false);
  const [estudiantesModalVisible, setEstudiantesModalVisible] = useState(false);
  const [estudiantes, setEstudiantes] = useState([]);
  const [estudiantesLoading, setEstudiantesLoading] = useState(false);
  const [estudiantesError, setEstudiantesError] = useState('');
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [cursoPickerOpen, setCursoPickerOpen] = useState(false);
  const [docentesModalVisible, setDocentesModalVisible] = useState(false);
  const [docentes, setDocentes] = useState([]);
  const [docentesLoading, setDocentesLoading] = useState(false);
  const [docentesError, setDocentesError] = useState('');
  const [colegioSeleccionado, setColegioSeleccionado] = useState(null);
  const [colegiosOptions, setColegiosOptions] = useState([]);
  const [colegioPickerOpen, setColegioPickerOpen] = useState(false);
  const [colegiosLoading, setColegiosLoading] = useState(false);
  const [colegiosModalVisible, setColegiosModalVisible] = useState(false);
  const [colegiosList, setColegiosList] = useState([]);
  const [colegioNombre, setColegioNombre] = useState('');
  const [colegioEditing, setColegioEditing] = useState(null);
  const [savingColegio, setSavingColegio] = useState(false);
  const [colegiosError, setColegiosError] = useState('');
  const [docenteCrudModalVisible, setDocenteCrudModalVisible] = useState(false);
  const [docenteForm, setDocenteForm] = useState({ nombre: '', email: '', password: '' });
  const [docenteCursos, setDocenteCursos] = useState([]);
  const [docenteCursosDisponibles, setDocenteCursosDisponibles] = useState([]);
  const [docenteColegioId, setDocenteColegioId] = useState(null);
  const [docenteEditing, setDocenteEditing] = useState(null);
  const [savingDocente, setSavingDocente] = useState(false);
  const [docenteError, setDocenteError] = useState('');
  const docenteCrudSchoolRef = useRef(null);
  const [periodForm, setPeriodForm] = useState({
    nombre: 'Periodo 1',
    startDay: 1, startMonth: 1, startYear: 2025, startHour: 0, startMinute: 0,
    endDay: 30, endMonth: 1, endYear: 2025, endHour: 23, endMinute: 59
  });

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 6 }, (_, i) => 2025 + i);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const monthNames = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

  const parseDateParts = (iso) => {
    if (!iso) return { day: 1, month: 1, year: 2025 };
    const [datePart] = iso.split('T');
    const [year, month, day] = datePart.split('-').map(n => parseInt(n, 10));
    return {
      day: Number.isFinite(day) ? day : 1,
      month: Number.isFinite(month) ? month : 1,
      year: Number.isFinite(year) ? year : 2025
    };
  };

  const buildDate = ({ day, month, year, hour = 0, minute = 0 }) => {
    const d = String(day).padStart(2, '0');
    const m = String(month).padStart(2, '0');
    const h = String(hour).padStart(2, '0');
    const min = String(minute).padStart(2, '0');
    return `${year}-${m}-${d}T${h}:${min}:00`;
  };

  const loadPeriodos = async () => {
    try {
      const data = await getPeriodos();
      setPeriodos(data);
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.error || 'No se pudieron cargar los periodos');
    }
  };

  useEffect(() => { loadPeriodos(); }, []);

  const openPeriodModal = (periodo = null) => {
    if (periodo) {
      const ini = parseDateParts(periodo.fechaInicio);
      const fin = parseDateParts(periodo.fechaFin);
      setPeriodForm({
        nombre: periodo.nombre || '',
        startDay: ini.day, startMonth: ini.month, startYear: ini.year, startHour: 0, startMinute: 0,
        endDay: fin.day, endMonth: fin.month, endYear: fin.year, endHour: 23, endMinute: 59
      });
      setEditingPeriodo(periodo);
    } else {
      setPeriodForm({
        nombre: `Periodo ${periodos.length + 1 || 1}`,
        startDay: 1, startMonth: 1, startYear: 2025, startHour: 0, startMinute: 0,
        endDay: 30, endMonth: 1, endYear: 2025, endHour: 23, endMinute: 59
      });
      setEditingPeriodo(null);
    }
    setPeriodModalVisible(true);
  };

  const handleSavePeriod = async () => {
    const nombre = periodForm.nombre.trim() || `Periodo ${periodos.length + 1 || 1}`;
    const payload = {
      nombre,
      fechaInicio: buildDate({
        day: periodForm.startDay, month: periodForm.startMonth, year: periodForm.startYear, hour: periodForm.startHour, minute: periodForm.startMinute
      }),
      fechaFin: buildDate({
        day: periodForm.endDay, month: periodForm.endMonth, year: periodForm.endYear, hour: periodForm.endHour, minute: periodForm.endMinute
      }),
      activo: true
    };
    setSavingPeriodo(true);
    try {
      if (editingPeriodo) {
        await updatePeriodo(editingPeriodo.id, payload);
      } else {
        await createPeriodo(payload);
      }
      await loadPeriodos();
      setPeriodModalVisible(false);
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.error || 'No se pudo guardar el periodo');
    } finally {
      setSavingPeriodo(false);
    }
  };

  const handleDeletePeriod = async (id) => {
    Alert.alert('Eliminar periodo', 'Quieres eliminar este periodo?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletePeriodo(id);
            await loadPeriodos();
          } catch (e) {
            Alert.alert('Error', e?.response?.data?.error || 'No se pudo eliminar');
          }
        }
      }
    ]);
  };

  const startSelect = (key, value) => setPeriodForm(prev => ({ ...prev, [key]: value }));
  const cycleValue = (key, list) => {
    setPeriodForm(prev => {
      const current = prev[key];
      const idx = list.indexOf(current);
      const next = list[(idx + 1) % list.length];
      return { ...prev, [key]: next };
    });
  };
  const adjustValue = (key, list, delta) => {
    setPeriodForm(prev => {
      const current = prev[key];
      const idx = list.indexOf(current);
      const next = list[(idx + delta + list.length) % list.length];
      return { ...prev, [key]: next };
    });
  };

  const openQuickModal = (key) => {
    const map = {
      estudiantes: { title: 'Estudiantes', desc: 'Consulta o administra tu lista de estudiantes.', action: () => navigation.navigate('Estudiantes') },
      reportes: { title: 'Reportes', desc: 'Genera reportes de asistencia y descargas.', action: () => navigation.navigate('Reportes') }
    };
    setQuickModal(map[key] || null);
  };

  const loadCursosAsignados = async (schoolIdParam = null) => {
    const params = schoolIdParam ? { schoolId: schoolIdParam } : {};
    const cursos = await getCursos(params);
    setCursosAsignados(cursos);
    return cursos;
  };

  const openCursosModal = async () => {
    setCursoFormVisible(false);
    setCursoEditing(null);
    setCursoNombre('');
    setLoadingCursos(true);
    try {
      await loadCursosAsignados();
      setCursosModalVisible(true);
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.error || 'No se pudieron cargar los cursos');
    } finally {
      setLoadingCursos(false);
    }
  };

  const closeCursosModal = () => {
    setCursosModalVisible(false);
    setCursoFormVisible(false);
    setCursoEditing(null);
    setCursoNombre('');
  };

  const loadEstudiantesPorCurso = async (cursoId) => {
    if (!cursoId) {
      setEstudiantes([]);
      setEstudiantesError('');
      return;
    }
    setEstudiantesLoading(true);
    setEstudiantesError('');
    try {
      const data = await getEstudiantes({ cursoId });
      setEstudiantes(data);
    } catch (e) {
      setEstudiantesError(e?.response?.data?.error || e?.message || 'No se pudieron cargar los estudiantes');
    } finally {
      setEstudiantesLoading(false);
    }
  };

  const openEstudiantesModal = async () => {
    setEstudiantesModalVisible(true);
    setCursoPickerOpen(false);
    setEstudiantesError('');
    try {
      setLoadingCursos(true);
      const cursos = await loadCursosAsignados();
      const firstId = (cursos && cursos[0]?.id) || null;
      setCursoSeleccionado(firstId);
      await loadEstudiantesPorCurso(firstId);
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.error || 'No se pudieron cargar los cursos/estudiantes');
    } finally {
      setLoadingCursos(false);
    }
  };

  const closeEstudiantesModal = () => {
    setEstudiantesModalVisible(false);
    setCursoPickerOpen(false);
    setCursoSeleccionado(null);
    setEstudiantes([]);
    setEstudiantesError('');
  };

  const closeCursosModalDocente = () => {
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

  const openColegiosModal = async () => {
    setColegioEditing(null);
    setColegioNombre('');
    setColegiosError('');
    setColegiosModalVisible(true);
    await loadColegios();
  };

  const closeColegiosModal = () => {
    setColegiosModalVisible(false);
    setColegioEditing(null);
    setColegioNombre('');
    setColegiosError('');
  };

  const startEditColegio = (colegio) => {
    setColegioEditing(colegio);
    setColegioNombre(colegio?.nombre || '');
  };

  const handleSaveColegio = async () => {
    const nombre = colegioNombre.trim();
    if (!nombre) return Alert.alert('Nombre requerido', 'Ingresa un nombre para el colegio');
    setSavingColegio(true);
    try {
      if (colegioEditing) {
        await updateColegio(colegioEditing.id, { nombre });
      } else {
        await createColegio({ nombre });
      }
      await loadColegios();
      setColegioEditing(null);
      setColegioNombre('');
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.error || 'No se pudo guardar el colegio');
    } finally {
      setSavingColegio(false);
    }
  };

  const handleDeleteColegio = (colegio) => {
    Alert.alert('Eliminar colegio', `Vas a eliminar "${colegio.nombre || 'este colegio'}"`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          setColegiosLoading(true);
          try {
            await deleteColegio(colegio.id);
            await loadColegios();
          } catch (e) {
            Alert.alert('Error', e?.response?.data?.error || 'No se pudo eliminar el colegio');
          } finally {
            setColegiosLoading(false);
          }
        }
      }
    ]);
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

  const buildAsignacionesDocenteMap = (docs = []) => {
    const map = {};
    docs.forEach((d) => {
      map[d.id] = (d.cursos || []).map(c => c.id);
    });
    return map;
  };

  const mergeAsignacionesDocente = (docs = []) => {
    const nextMap = buildAsignacionesDocenteMap(docs);
    setAsignacionCursosDocente(prev => ({ ...prev, ...nextMap }));
  };

  const loadCursoDocDataExact = async (schoolId) => {
    const targetSchoolId = Number(schoolId);
    if (!Number.isFinite(targetSchoolId) || targetSchoolId <= 0) return { cursos: [], docs: [] };
    setLoadingCursos(true);
    setDocentesError('');
    try {
      const [cursos, docs] = await Promise.all([
        getCursos({ schoolId: targetSchoolId }),
        getDocentes({ schoolId: targetSchoolId })
      ]);
      if (Number(cursoDocSchoolRef.current) !== targetSchoolId) return { cursos: [], docs: [] };
      setCursoDocCursos(cursos || []);
      setDocentes(docs || []);
      mergeAsignacionesDocente(docs || []);
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

  const loadDataCursoDocBySchool = async (schoolId) => {
    return loadCursoDocDataExact(schoolId);
  };

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
    const userSchoolOption = user?.schoolId ? [{ id: user.schoolId, nombre: user?.schoolName || `Colegio ${user.schoolId}` }] : [];
    setColegiosOptions(userSchoolOption);
    const colegios = await loadColegios({ preferId: user?.schoolId, preferName: user?.schoolName });
    const defaultSchoolId = user?.schoolId || colegios?.[0]?.id || null;
    if (defaultSchoolId) {
      await changeCursoDocColegio(defaultSchoolId);
    }
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
        ? current.filter(id => id !== cursoId)
        : [...current, cursoId];
      return { ...prev, [docenteId]: next };
    });
  };

  const guardarAsignacionDocente = async (docenteId) => {
    const cursoIds = asignacionCursosDocente[docenteId] || [];
    const schoolId = Number(cursoDocColegioId);
    if (!Number.isFinite(schoolId) || schoolId <= 0) return;
    setSavingAsignacionDocenteId(docenteId);
    try {
      await updateDocente(docenteId, { cursoIds, schoolId });
      await loadCursoDocDataExact(schoolId);
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.error || 'No se pudo guardar la asignacion');
    } finally {
      setSavingAsignacionDocenteId(null);
    }
  };

  const openDocenteCrudModal = async () => {
    setDocenteEditing(null);
    setDocenteForm({ nombre: '', email: '', password: '' });
    setDocenteCursos([]);
    setDocenteCursosDisponibles([]);
    setDocenteColegioId(user?.schoolId || null);
    setDocenteError('');
    setColegioPickerOpen(false);
    setColegiosOptions(user?.schoolId ? [{ id: user.schoolId, nombre: user?.schoolName || `Colegio ${user.schoolId}` }] : []);
    setDocenteCrudModalVisible(true);
    setLoadingCursos(true);
    try {
      const colegios = await loadColegios({ preferId: user?.schoolId, preferName: user?.schoolName });
      const defaultSchool = user?.schoolId || colegios?.[0]?.id || null;
      setDocenteColegioId(defaultSchool);
      docenteCrudSchoolRef.current = Number(defaultSchool) || null;
      await Promise.all([loadCursosDisponiblesDocente(defaultSchool), loadDocentesActual(defaultSchool)]);
    } finally {
      setLoadingCursos(false);
    }
  };

  const closeDocenteCrudModal = () => {
    setDocenteCrudModalVisible(false);
    setDocenteEditing(null);
    setDocenteForm({ nombre: '', email: '', password: '' });
    setDocenteCursos([]);
    setDocenteCursosDisponibles([]);
    setDocenteColegioId(null);
    setDocenteError('');
    docenteCrudSchoolRef.current = null;
  };

  const loadCursosDisponiblesDocente = async (schoolIdParam = null) => {
    const parsedSchoolId = Number(schoolIdParam || docenteColegioId || user?.schoolId);
    if (!Number.isFinite(parsedSchoolId) || parsedSchoolId <= 0) {
      setDocenteCursosDisponibles([]);
      return [];
    }
    const targetSchoolId = parsedSchoolId;
    const cursos = await getCursos({ schoolId: parsedSchoolId });
    if (Number(docenteCrudSchoolRef.current) !== targetSchoolId) return [];
    setDocenteCursosDisponibles(cursos || []);
    return cursos || [];
  };

  const toggleDocenteCurso = (cursoId) => {
    setDocenteCursos(prev => prev.includes(cursoId) ? prev.filter(id => id !== cursoId) : [...prev, cursoId]);
  };

  const changeDocenteColegio = async (newId) => {
    const parsedSchoolId = Number(newId);
    if (!Number.isFinite(parsedSchoolId) || parsedSchoolId <= 0) return;
    setDocenteColegioId(parsedSchoolId);
    setDocenteCursos([]);
    setDocenteCursosDisponibles([]);
    docenteCrudSchoolRef.current = parsedSchoolId;
    setLoadingCursos(true);
    try {
      await Promise.all([loadCursosDisponiblesDocente(parsedSchoolId), loadDocentesActual(parsedSchoolId)]);
    } finally {
      setLoadingCursos(false);
    }
  };

  const startEditDocente = async (docente) => {
    setDocenteEditing(docente);
    setDocenteForm({ nombre: docente.nombre || '', email: docente.email || '', password: '' });
    const targetSchoolId = Number(docente.schoolId || user?.schoolId || null);
    setDocenteColegioId(targetSchoolId);
    docenteCrudSchoolRef.current = Number.isFinite(targetSchoolId) ? targetSchoolId : null;
    setDocenteCrudModalVisible(true);
    setLoadingCursos(true);
    try {
      await loadCursosDisponiblesDocente(targetSchoolId);
      await loadDocentesActual(targetSchoolId);
      setDocenteCursos((docente.cursos || []).map(c => c.id));
    } finally {
      setLoadingCursos(false);
    }
  };

  const handleSaveDocente = async () => {
    const nombre = docenteForm.nombre.trim();
    const email = docenteForm.email.trim();
    const password = docenteForm.password;
    if (!nombre || !email || (!docenteEditing && !password)) {
      return Alert.alert('Faltan datos', 'Nombre, correo y contraseÃ±a son requeridos para crear un docente');
    }
    const payload = { nombre, email, cursoIds: docenteCursos, schoolId: docenteColegioId || user?.schoolId };
    if (docenteEditing) {
      if (password) payload.password = password;
    } else {
      payload.password = password;
    }

    setSavingDocente(true);
    try {
      if (docenteEditing) {
        await updateDocente(docenteEditing.id, payload);
      } else {
        await createDocente(payload);
      }
      await loadDocentesActual();
      setDocenteForm({ nombre: '', email: '', password: '' });
      setDocenteCursos([]);
      setDocenteEditing(null);
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.error || 'No se pudo guardar el docente');
    } finally {
      setSavingDocente(false);
    }
  };

  const handleDeleteDocente = (docente) => {
    Alert.alert('Eliminar docente', `Vas a eliminar "${docente.nombre || docente.email || 'este docente'}"`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          setDocentesLoading(true);
          try {
            await deleteDocente(docente.id);
            await loadDocentesActual();
          } catch (e) {
            Alert.alert('Error', e?.response?.data?.error || 'No se pudo eliminar el docente');
          } finally {
            setDocentesLoading(false);
          }
        }
      }
    ]);
  };

  const loadColegios = async ({ preferId = null, preferName } = {}) => {
    setColegiosLoading(true);
    setColegiosError('');
    try {
      const data = await getColegios();
      setColegiosList(data || []);
      const mapped = data.map(c => ({ id: c.id, nombre: c.nombre || `Colegio ${c.id}` }));
      let merged = [];
      setColegiosOptions(prev => {
        merged = [...prev];
        const addIfMissing = (item) => {
          if (!item?.id) return;
          if (!merged.some(o => String(o.id) === String(item.id))) merged.push(item);
        };
        mapped.forEach(addIfMissing);
        if (preferId) addIfMissing({ id: preferId, nombre: preferName || `Colegio ${preferId}` });
        return merged;
      });
      const firstId = preferId || merged[0]?.id || null;
      if (!colegioSeleccionado && firstId) {
        setColegioSeleccionado(firstId);
      }
      return merged;
    } catch (e) {
      const message = e?.response?.data?.error || e?.message || 'No se pudieron cargar los colegios';
      setDocentesError(message);
      setColegiosError(message);
      const fallback = [];
      if (preferId) fallback.push({ id: preferId, nombre: preferName || `Colegio ${preferId}` });
      else if (user?.schoolId) fallback.push({ id: user.schoolId, nombre: user?.schoolName || `Colegio ${user.schoolId}` });
      if (fallback.length) setColegiosOptions(prev => (prev.length ? prev : fallback));
      return fallback.length ? fallback : colegiosOptions;
    } finally {
      setColegiosLoading(false);
    }
  };

  const loadDocentesColegio = async (schoolIdValue = null) => {
    const schoolId = schoolIdValue || colegioSeleccionado || user?.schoolId || undefined;
    if (!schoolId) {
      setDocentes([]);
      setDocentesError('Selecciona un colegio primero');
      return;
    }
    setDocentesLoading(true);
    setDocentesError('');
    try {
      const data = await getDocentes({ schoolId });
      setDocentes(data);
      setColegioSeleccionado(schoolId);
      setColegiosOptions(prev => {
        const exists = prev.some(opt => String(opt.id) === String(schoolId));
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
    const userSchoolOption = user?.schoolId ? [{ id: user.schoolId, nombre: user?.schoolName || `Colegio ${user.schoolId}` }] : [];
    setColegiosOptions(userSchoolOption);
    setDocentesModalVisible(true);
    setColegioPickerOpen(false);
    setDocentesError('');
    const defaultSchool = user?.schoolId || colegioSeleccionado || '';
    const options = await loadColegios({ preferId: defaultSchool, preferName: user?.schoolName });
    const selectedId = defaultSchool || (options && options[0]?.id) || null;
    setColegioSeleccionado(selectedId || null);
    await loadDocentesColegio(selectedId);
  };

  const closeDocentesModal = () => {
    setDocentesModalVisible(false);
    setColegioPickerOpen(false);
    setDocentesError('');
    setColegioSeleccionado(null);
    setColegiosOptions([]);
  };

  const openCursoForm = (curso = null) => {
    if (curso) {
      setCursoEditing(curso);
      setCursoNombre(curso.nombre || '');
    } else {
      setCursoEditing(null);
      setCursoNombre('');
    }
    setCursoFormVisible(true);
  };

  const handleSaveCurso = async () => {
    const nombre = cursoNombre.trim();
    if (!nombre) return Alert.alert('Nombre requerido', 'Ingresa un nombre para el curso');
    setSavingCurso(true);
    setLoadingCursos(true);
    try {
      if (cursoEditing) {
        await updateCurso(cursoEditing.id, { nombre });
      } else {
        await createCurso({ nombre });
      }
      await loadCursosAsignados();
      setCursoFormVisible(false);
      setCursoEditing(null);
      setCursoNombre('');
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.error || 'No se pudo guardar el curso');
    } finally {
      setSavingCurso(false);
      setLoadingCursos(false);
    }
  };

  const handleDeleteCurso = (curso) => {
    Alert.alert('Eliminar curso', `Vas a eliminar "${curso.nombre}"`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            setLoadingCursos(true);
            await deleteCurso(curso.id);
            await loadCursosAsignados();
          } catch (e) {
            Alert.alert('Error', e?.response?.data?.error || 'No se pudo eliminar el curso');
          } finally {
            setLoadingCursos(false);
          }
        }
      }
    ]);
  };

  const cursoSeleccionadoNombre = cursoSeleccionado
    ? (cursosAsignados.find(c => c.id === cursoSeleccionado)?.nombre || 'Curso sin nombre')
    : 'Selecciona curso';

  const resolveColegioNombre = (id) => {
    if (!id) return 'Selecciona colegio';
    return colegiosOptions.find(c => String(c.id) === String(id))?.nombre || `Colegio ${id}`;
  };

  const colegioSeleccionadoNombre = resolveColegioNombre(colegioSeleccionado);

  return (
    <ScreenBackground contentStyle={styles.content}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image source={require('../assets/edusac-header.png')} style={styles.logo} resizeMode="contain" />
        </View>

      <View style={styles.infoCard}>
        <View style={styles.infoAvatar}>
          <Text style={styles.infoAvatarText}>{teacherInitial}</Text>
        </View>
        <View style={styles.infoBody}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoLabelStrong}>Perfil de usuario</Text>
              <View style={styles.statusPill}>
                <Text style={styles.statusPillText}>Activo</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Usuario</Text>
              <Text style={styles.infoValue}>{user?.email || 'Sin correo'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Rol</Text>
              <Text style={styles.infoValue}>{user?.rol || 'Sin rol'}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Colegio</Text>
              <Text style={styles.infoValue}>{user?.schoolName || user?.schoolId || 'No asignado'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionGrid}>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#22c55e' }]} onPress={() => navigation.navigate('QR')}>
            <View style={styles.btnRow}>
              <Ionicons name="qr-code-outline" size={18} color="#fff" />
              <Text style={styles.actionBtnText}>Escanear QR</Text>
            </View>
          </TouchableOpacity>
        {canManageCourses ? (
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#38bdf8' }]} onPress={openCursosModal}>
          <View style={styles.btnRow}>
            <Ionicons name="book-outline" size={18} color="#fff" />
            <Text style={styles.actionBtnText}>Crear cursos</Text>
          </View>
        </TouchableOpacity>
        ) : null}
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#a78bfa' }]} onPress={openEstudiantesModal}>
          <View style={styles.btnRow}>
            <Ionicons name="people-outline" size={18} color="#fff" />
            <Text style={styles.actionBtnText}>Estudiantes</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#10b981' }]} onPress={openDocentesModal}>
          <View style={styles.btnRow}>
            <Ionicons name="school-outline" size={18} color="#fff" />
            <Text style={styles.actionBtnText}>Docentes</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#14b8a6' }]} onPress={openDocenteCrudModal}>
          <View style={styles.btnRow}>
            <Ionicons name="person-add-outline" size={18} color="#fff" />
            <Text style={styles.actionBtnText}>Crear docentes</Text>
          </View>
        </TouchableOpacity>
      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#facc15' }]} onPress={openColegiosModal}>
        <View style={styles.btnRow}>
          <Ionicons name="business-outline" size={18} color="#111" />
          <Text style={[styles.actionBtnText, { color: '#111' }]}>Crear colegios</Text>
        </View>
      </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#f97316' }]} onPress={() => openQuickModal('reportes')}>
          <View style={styles.btnRow}>
            <Ionicons name="bar-chart-outline" size={18} color="#fff" />
            <Text style={styles.actionBtnText}>Reportes</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#7c3aed' }]} onPress={() => openPeriodModal()}>
          <View style={styles.btnRow}>
            <Ionicons name="calendar-outline" size={18} color="#fff" />
            <Text style={styles.actionBtnText}>Activar periodos</Text>
          </View>
        </TouchableOpacity>
        {canManageCourses ? (
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#0ea5e9' }]}
            onPress={openCursoDocentesModal}
          >
            <View style={styles.btnRow}>
              <Ionicons name="folder-open-outline" size={18} color="#fff" />
              <Text style={styles.actionBtnText}>Cursos docentes</Text>
            </View>
          </TouchableOpacity>
        ) : null}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.85}>
          <View style={styles.btnRow}>
            <Ionicons name="log-out-outline" size={18} color="#fff" />
            <Text style={styles.logoutText}>Cerrar sesion</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <Modal transparent animationType="slide" visible={periodModalVisible} onRequestClose={() => setPeriodModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={styles.periodTitle}>{editingPeriodo ? 'Editar periodo' : 'Crear periodo'}</Text>
                <Pressable onPress={() => setPeriodModalVisible(false)} style={styles.closeBtn}>
                  <View style={styles.btnRow}><Ionicons name="close-outline" size={16} color="#e5e7eb" /><Text style={styles.closeBtnText}>Cerrar</Text></View>
                </Pressable>
              </View>

              <Text style={styles.fieldLabel}>Nombre</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. Periodo 1"
                placeholderTextColor="#9ca3af"
                value={periodForm.nombre}
                onChangeText={(txt) => setPeriodForm(prev => ({ ...prev, nombre: txt }))}
              />

              <View style={{ gap: 10 }}>
                <Text style={styles.fieldLabel}>Inicio</Text>
                <View style={styles.inlineRow}>
                  <View style={styles.stepper}>
                    <TouchableOpacity style={styles.stepperBtn} onPress={() => adjustValue('startDay', days, -1)}>
                      <Text style={styles.stepperText}>-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.selectBox} onPress={() => cycleValue('startDay', days)}>
                      <Text style={styles.selectText}>{String(periodForm.startDay).padStart(2, '0')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.stepperBtn} onPress={() => adjustValue('startDay', days, 1)}>
                      <Text style={styles.stepperText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.stepper}>
                    <TouchableOpacity style={styles.stepperBtn} onPress={() => adjustValue('startMonth', months, -1)}>
                      <Text style={styles.stepperText}>-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.selectBox} onPress={() => cycleValue('startMonth', months)}>
                      <Text style={styles.selectText}>{monthNames[periodForm.startMonth - 1]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.stepperBtn} onPress={() => adjustValue('startMonth', months, 1)}>
                      <Text style={styles.stepperText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.stepper}>
                    <TouchableOpacity style={styles.stepperBtn} onPress={() => adjustValue('startYear', years, -1)}>
                      <Text style={styles.stepperText}>-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.selectBox} onPress={() => cycleValue('startYear', years)}>
                      <Text style={styles.selectText}>{periodForm.startYear}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.stepperBtn} onPress={() => adjustValue('startYear', years, 1)}>
                      <Text style={styles.stepperText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.selectBox} onPress={() => cycleValue('startHour', hours)}>
                    <Text style={styles.selectText}>{String(periodForm.startHour).padStart(2, '0')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.selectBox} onPress={() => cycleValue('startMinute', minutes)}>
                    <Text style={styles.selectText}>{String(periodForm.startMinute).padStart(2, '0')}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ gap: 10 }}>
                <Text style={styles.fieldLabel}>Fin</Text>
                <View style={styles.inlineRow}>
                  <View style={styles.stepper}>
                    <TouchableOpacity style={styles.stepperBtn} onPress={() => adjustValue('endDay', days, -1)}>
                      <Text style={styles.stepperText}>-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.selectBox} onPress={() => cycleValue('endDay', days)}>
                      <Text style={styles.selectText}>{String(periodForm.endDay).padStart(2, '0')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.stepperBtn} onPress={() => adjustValue('endDay', days, 1)}>
                      <Text style={styles.stepperText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.stepper}>
                    <TouchableOpacity style={styles.stepperBtn} onPress={() => adjustValue('endMonth', months, -1)}>
                      <Text style={styles.stepperText}>-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.selectBox} onPress={() => cycleValue('endMonth', months)}>
                      <Text style={styles.selectText}>{monthNames[periodForm.endMonth - 1]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.stepperBtn} onPress={() => adjustValue('endMonth', months, 1)}>
                      <Text style={styles.stepperText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.stepper}>
                    <TouchableOpacity style={styles.stepperBtn} onPress={() => adjustValue('endYear', years, -1)}>
                      <Text style={styles.stepperText}>-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.selectBox} onPress={() => cycleValue('endYear', years)}>
                      <Text style={styles.selectText}>{periodForm.endYear}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.stepperBtn} onPress={() => adjustValue('endYear', years, 1)}>
                      <Text style={styles.stepperText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.selectBox} onPress={() => cycleValue('endHour', hours)}>
                    <Text style={styles.selectText}>{String(periodForm.endHour).padStart(2, '0')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.selectBox} onPress={() => cycleValue('endMinute', minutes)}>
                    <Text style={styles.selectText}>{String(periodForm.endMinute).padStart(2, '0')}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={[styles.periodBtn, savingPeriodo && { opacity: 0.6 }]} onPress={handleSavePeriod} disabled={savingPeriodo}>
                <View style={styles.btnRow}>
                  <Ionicons name="save-outline" size={16} color="#fff" />
                  <Text style={styles.periodBtnText}>{savingPeriodo ? 'Guardando...' : editingPeriodo ? 'Actualizar periodo' : 'Guardar periodo'}</Text>
                </View>
              </TouchableOpacity>

              <View style={[styles.periodItemRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.periodTitle}>Lista</Text>
              </View>
              {periodos.map(p => (
                <View key={p.id} style={styles.periodItemRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.periodName}>{p.nombre}</Text>
                    <Text style={styles.periodRange}>{p.fechaInicio} - {p.fechaFin}</Text>
                    {p.actualizado ? <Text style={styles.periodMeta}>Actualizado: {p.actualizado}</Text> : null}
                  </View>
                  <View style={styles.periodActions}>
                    <TouchableOpacity style={[styles.smallBtn, styles.updateBtn]} onPress={() => openPeriodModal(p)}>
                      <View style={styles.btnRow}>
                        <Ionicons name="create-outline" size={14} color="#e5e7eb" />
                        <Text style={styles.smallBtnText}>Editar</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.smallBtn, styles.deleteBtn]} onPress={() => handleDeletePeriod(p.id)}>
                      <View style={styles.btnRow}>
                        <Ionicons name="trash-outline" size={14} color="#e5e7eb" />
                        <Text style={styles.smallBtnText}>Eliminar</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              {periodos.length === 0 ? <Text style={styles.emptyText}>Sin periodos activos</Text> : null}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="slide"
        visible={cursosModalVisible}
        onRequestClose={closeCursosModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.periodTitle}>Cursos</Text>
              <Pressable onPress={closeCursosModal} style={styles.closeBtn}>
                <View style={styles.btnRow}><Ionicons name="close-outline" size={16} color="#e5e7eb" /><Text style={styles.closeBtnText}>Cerrar</Text></View>
              </Pressable>
            </View>

            {canManageCourses ? (
              <View style={styles.courseActionsRow}>
                <TouchableOpacity style={[styles.smallBtn, styles.createBtn]} onPress={() => openCursoForm()}>
                  <View style={styles.btnRow}>
                    <Ionicons name="add-outline" size={14} color="#e5e7eb" />
                    <Text style={styles.smallBtnText}>Nuevo</Text>
                  </View>
                </TouchableOpacity>
                {loadingCursos ? <Text style={styles.dataBullet}>Cargando...</Text> : null}
              </View>
            ) : null}

            {canManageCourses && cursoFormVisible ? (
              <View style={styles.courseForm}>
                <Text style={styles.fieldLabel}>{cursoEditing ? 'Actualizar curso' : 'Nuevo curso'}</Text>
                <TextInput
                  style={styles.courseInput}
                  placeholder="Nombre del curso"
                  placeholderTextColor="#9ca3af"
                  value={cursoNombre}
                  editable={!savingCurso}
                  onChangeText={setCursoNombre}
                />
                <View style={styles.courseFormActions}>
                  <TouchableOpacity
                    style={[styles.smallBtn, styles.outlineBtn, savingCurso && { opacity: 0.6 }]}
                    onPress={() => { if (!savingCurso) { setCursoFormVisible(false); setCursoEditing(null); setCursoNombre(''); } }}
                    disabled={savingCurso}
                  >
                    <View style={styles.btnRow}>
                      <Ionicons name="close-outline" size={14} color="#e5e7eb" />
                      <Text style={styles.smallBtnText}>Cancelar</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.smallBtn, styles.createBtn, savingCurso && { opacity: 0.6 }]}
                    onPress={async () => {
                      await handleSaveCurso();
                      await loadCursosAsignados();
                    }}
                    disabled={savingCurso}
                  >
                    <View style={styles.btnRow}>
                      <Ionicons name="save-outline" size={14} color="#e5e7eb" />
                      <Text style={styles.smallBtnText}>{savingCurso ? 'Guardando...' : 'Guardar'}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}

            <View style={styles.dataBox}>
              <Text style={styles.dataTitle}>Lista</Text>
              {loadingCursos ? (
                <Text style={styles.dataBullet}>Cargando cursos...</Text>
              ) : cursosAsignados.length === 0 ? (
                <Text style={styles.dataBullet}>- No hay cursos</Text>
              ) : (
                cursosAsignados.map((c) => (
                  <View key={c.id} style={styles.courseRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.dataItem}>- {c.nombre}</Text>
                      {c.grado ? <Text style={styles.dataBullet}>Grado: {c.grado}</Text> : null}
                    </View>
                    {canManageCourses ? (
                    <View style={styles.courseRowActions}>
                      <TouchableOpacity style={[styles.smallBtn, styles.updateBtn]} onPress={() => openCursoForm(c)}>
                        <View style={styles.btnRow}>
                          <Ionicons name="create-outline" size={14} color="#e5e7eb" />
                          <Text style={styles.smallBtnText}>Editar</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.smallBtn, styles.deleteBtn]} onPress={() => handleDeleteCurso(c)}>
                        <View style={styles.btnRow}>
                          <Ionicons name="trash-outline" size={14} color="#e5e7eb" />
                          <Text style={styles.smallBtnText}>Eliminar</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    ) : null}
                  </View>
                ))
              )}
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="slide"
        visible={colegiosModalVisible}
        onRequestClose={closeColegiosModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.periodTitle}>Colegios</Text>
              <Pressable onPress={closeColegiosModal} style={styles.closeBtn}>
                <View style={styles.btnRow}><Ionicons name="close-outline" size={16} color="#e5e7eb" /><Text style={styles.closeBtnText}>Cerrar</Text></View>
              </Pressable>
            </View>

            <View style={styles.courseForm}>
              <Text style={styles.fieldLabel}>{colegioEditing ? 'Editar colegio' : 'Nuevo colegio'}</Text>
              <TextInput
                style={styles.courseInput}
                placeholder="Nombre del colegio"
                placeholderTextColor="#9ca3af"
                value={colegioNombre}
                editable={!savingColegio}
                onChangeText={setColegioNombre}
              />
              {colegiosError ? <Text style={[styles.dataBullet, { color: '#fca5a5' }]}>{colegiosError}</Text> : null}
              <View style={styles.courseFormActions}>
                {colegioEditing ? (
                  <TouchableOpacity
                    style={[styles.smallBtn, styles.outlineBtn, savingColegio && { opacity: 0.6 }]}
                    onPress={() => {
                      if (savingColegio) return;
                      setColegioEditing(null);
                      setColegioNombre('');
                    }}
                    disabled={savingColegio}
                  >
                    <View style={styles.btnRow}>
                      <Ionicons name="close-outline" size={14} color="#e5e7eb" />
                      <Text style={styles.smallBtnText}>Cancelar edicion</Text>
                    </View>
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                  style={[styles.smallBtn, styles.createBtn, savingColegio && { opacity: 0.6 }]}
                  onPress={handleSaveColegio}
                  disabled={savingColegio}
                >
                  <View style={styles.btnRow}>
                    <Ionicons name="save-outline" size={14} color="#e5e7eb" />
                    <Text style={styles.smallBtnText}>{savingColegio ? 'Guardando...' : colegioEditing ? 'Actualizar' : 'Crear'}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.dataBox}>
              <View style={styles.courseActionsRow}>
                <Text style={styles.dataTitle}>Colegios en el sistema</Text>
                {colegiosLoading ? <Text style={styles.dataBullet}>Cargando...</Text> : null}
              </View>
              {colegiosList.length === 0 && !colegiosLoading ? (
                <Text style={styles.dataBullet}>- AÃºn no hay colegios registrados</Text>
              ) : (
                colegiosList.map((c) => (
                  <View key={c.id} style={styles.courseRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.dataItem}>- {c.nombre || `Colegio ${c.id}`}</Text>
                      {c.direccion ? <Text style={styles.dataBullet}>DirecciÃ³n: {c.direccion}</Text> : null}
                    </View>
                    <View style={styles.courseRowActions}>
                      <TouchableOpacity style={[styles.smallBtn, styles.updateBtn]} onPress={() => startEditColegio(c)}>
                        <View style={styles.btnRow}>
                          <Ionicons name="create-outline" size={14} color="#e5e7eb" />
                          <Text style={styles.smallBtnText}>Editar</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.smallBtn, styles.deleteBtn]} onPress={() => handleDeleteColegio(c)}>
                        <View style={styles.btnRow}>
                          <Ionicons name="trash-outline" size={14} color="#e5e7eb" />
                          <Text style={styles.smallBtnText}>Eliminar</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="slide"
        visible={docenteCrudModalVisible}
        onRequestClose={closeDocenteCrudModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, styles.modalCardWide]}>
            <View style={styles.modalHeader}>
              <Text style={styles.periodTitle}>Gestionar docentes</Text>
              <Pressable onPress={closeDocenteCrudModal} style={styles.closeBtn}>
                <View style={styles.btnRow}><Ionicons name="close-outline" size={16} color="#e5e7eb" /><Text style={styles.closeBtnText}>Cerrar</Text></View>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.courseForm}>
              <Text style={styles.fieldLabel}>{docenteEditing ? 'Editar docente' : 'Nuevo docente'}</Text>
              <Text style={styles.fieldLabel}>Colegio</Text>
              {colegiosOptions.length > 0 ? (
                <TouchableOpacity
                  style={[styles.selectBox, { marginBottom: 8 }]}
                  onPress={() => setColegioPickerOpen(prev => !prev)}
                  disabled={savingDocente || loadingCursos}
                >
                  <Text style={styles.selectText}>
                    {colegiosLoading
                      ? 'Cargando colegios...'
                      : resolveColegioNombre(docenteColegioId || user?.schoolId)}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.selectBox, { marginBottom: 8 }]}
                  disabled
                >
                  <Text style={styles.selectText}>{resolveColegioNombre(docenteColegioId || user?.schoolId)}</Text>
                </TouchableOpacity>
              )}

              {colegioPickerOpen && colegiosOptions.length > 0 ? (
                <View style={styles.pickerList}>
                  {colegiosOptions.map(c => (
                    <TouchableOpacity
                      key={c.id}
                      style={[styles.pickerItem, String(docenteColegioId) === String(c.id) && styles.pickerItemActive]}
                      onPress={async () => {
                        setColegioPickerOpen(false);
                        await changeDocenteColegio(c.id);
                      }}
                    >
                      <Text style={styles.dataItem}>{c.nombre || `Colegio ${c.id}`}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null}

              <TextInput
                style={styles.courseInput}
                placeholder="Nombre completo"
                placeholderTextColor="#9ca3af"
                value={docenteForm.nombre}
                onChangeText={(txt) => setDocenteForm(prev => ({ ...prev, nombre: txt }))}
              />
              <TextInput
                style={styles.courseInput}
                placeholder="Correo"
                placeholderTextColor="#9ca3af"
                autoCapitalize="none"
                keyboardType="email-address"
                value={docenteForm.email}
                onChangeText={(txt) => setDocenteForm(prev => ({ ...prev, email: txt }))}
              />
              <TextInput
                style={styles.courseInput}
                placeholder={docenteEditing ? 'Nueva contraseÃ±a (opcional)' : 'ContraseÃ±a'}
                placeholderTextColor="#9ca3af"
                secureTextEntry
                value={docenteForm.password}
                onChangeText={(txt) => setDocenteForm(prev => ({ ...prev, password: txt }))}
              />

              <Text style={styles.fieldLabel}>Asignar cursos</Text>
              <View style={styles.dataBox}>
                {loadingCursos ? (
                  <Text style={styles.dataBullet}>Cargando cursos...</Text>
                ) : docenteCursosDisponibles.length === 0 ? (
                  <Text style={styles.dataBullet}>No hay cursos para asignar</Text>
                ) : (
                  docenteCursosDisponibles.map(c => {
                    const checked = docenteCursos.includes(c.id);
                    return (
                      <Pressable
                        key={c.id}
                        style={[styles.pickerItem, { flexDirection: 'row', alignItems: 'center', gap: 10 }, checked && styles.pickerItemActive]}
                        onPress={() => toggleDocenteCurso(c.id)}
                      >
                        <Ionicons name={checked ? 'checkbox-outline' : 'square-outline'} size={16} color="#e5e7eb" />
                        <Text style={styles.dataItem}>{c.nombre}</Text>
                      </Pressable>
                    );
                  })
                )}
              </View>

              {docenteError ? <Text style={[styles.errorText, { marginTop: 4 }]}>{docenteError}</Text> : null}

              <View style={styles.courseFormActions}>
                {docenteEditing ? (
                  <TouchableOpacity
                    style={[styles.smallBtn, styles.outlineBtn, savingDocente && { opacity: 0.6 }]}
                    onPress={() => {
                      if (savingDocente) return;
                      setDocenteEditing(null);
                      setDocenteForm({ nombre: '', email: '', password: '' });
                      setDocenteCursos([]);
                    }}
                    disabled={savingDocente}
                  >
                    <View style={styles.btnRow}>
                      <Ionicons name="close-outline" size={14} color="#e5e7eb" />
                      <Text style={styles.smallBtnText}>Cancelar edicion</Text>
                    </View>
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                  style={[styles.smallBtn, styles.createBtn, savingDocente && { opacity: 0.6 }]}
                  onPress={handleSaveDocente}
                  disabled={savingDocente}
                >
                  <View style={styles.btnRow}>
                    <Ionicons name="save-outline" size={14} color="#e5e7eb" />
                    <Text style={styles.smallBtnText}>{savingDocente ? 'Guardando...' : docenteEditing ? 'Actualizar' : 'Crear'}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.dataBox}>
              <View style={styles.courseActionsRow}>
                <Text style={styles.dataTitle}>Docentes del colegio</Text>
                {docentesLoading ? <Text style={styles.dataBullet}>Cargando...</Text> : null}
              </View>
              {docentes.length === 0 && !docentesLoading ? (
                <Text style={styles.dataBullet}>- AÃºn no hay docentes</Text>
              ) : (
                docentes.map((d) => (
                  <View key={d.id} style={styles.courseRow}>
                    <View style={{ flex: 1, gap: 4 }}>
                      <Text style={styles.dataItem}>- {d.nombre || d.email || `Docente ${d.id}`}</Text>
                      {d.email ? <Text style={styles.dataBullet}>{d.email}</Text> : null}
                      {d.cursos && d.cursos.length ? (
                        <Text style={styles.dataBullet}>Cursos: {d.cursos.map(c => c.nombre).join(', ')}</Text>
                      ) : (
                        <Text style={styles.dataBullet}>Sin cursos asignados</Text>
                      )}
                    </View>
                    <View style={styles.courseRowActions}>
                      <TouchableOpacity style={[styles.smallBtn, styles.updateBtn]} onPress={() => startEditDocente(d)}>
                        <View style={styles.btnRow}>
                          <Ionicons name="create-outline" size={14} color="#e5e7eb" />
                          <Text style={styles.smallBtnText}>Editar</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.smallBtn, styles.deleteBtn]} onPress={() => handleDeleteDocente(d)}>
                        <View style={styles.btnRow}>
                          <Ionicons name="trash-outline" size={14} color="#e5e7eb" />
                          <Text style={styles.smallBtnText}>Eliminar</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="slide"
        visible={cursoDocModalVisible}
        onRequestClose={closeCursosModalDocente}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, styles.modalCardWide]}>
            <View style={styles.modalHeader}>
              <Text style={styles.periodTitle}>Asignar cursos a docentes</Text>
              <Pressable onPress={closeCursosModalDocente} style={styles.closeBtn}>
                <View style={styles.btnRow}><Ionicons name="close-outline" size={16} color="#e5e7eb" /><Text style={styles.closeBtnText}>Cerrar</Text></View>
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.fieldLabel}>Colegio</Text>
              <TouchableOpacity
                style={[styles.selectBoxFull]}
                onPress={() => setCursoDocPickerOpen(prev => !prev)}
                disabled={loadingCursos || colegiosLoading}
              >
                <Text style={styles.selectText}>{resolveColegioNombre(cursoDocColegioId || user?.schoolId)}</Text>
              </TouchableOpacity>

              {cursoDocPickerOpen && colegiosOptions.length > 0 ? (
                <View style={styles.pickerList}>
                  {colegiosOptions.map(c => (
                    <TouchableOpacity
                      key={c.id}
                      style={[styles.pickerItem, String(cursoDocColegioId) === String(c.id) && styles.pickerItemActive]}
                      onPress={async () => {
                        await changeCursoDocColegio(c.id);
                      }}
                    >
                      <Text style={styles.dataItem}>{c.nombre || `Colegio ${c.id}`}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null}

              {docentesError ? <Text style={styles.errorText}>{docentesError}</Text> : null}

              {!mostrarAsignadorCursoDoc ? (
                <View style={styles.dataBox}>
                  <Text style={styles.dataBullet}>Selecciona un colegio para habilitar "Asignar cursos a docentes".</Text>
                </View>
              ) : null}

              {mostrarAsignadorCursoDoc ? (
                <View style={styles.dataBox}>
                  <View style={styles.courseActionsRow}>
                    <Text style={styles.dataTitle}>Asignar cursos a docentes</Text>
                    <Ionicons name="checkmark-done-outline" size={18} color="#a7f3d0" />
                  </View>
                  {loadingCursos ? (
                    <Text style={styles.dataBullet}>Cargando docentes y cursos...</Text>
                  ) : docentes.length === 0 ? (
                    <Text style={styles.dataBullet}>No hay docentes para este colegio</Text>
                  ) : (
                    docentes.map((d) => (
                      <View key={d.id} style={styles.periodItemRow}>
                        <View style={{ flex: 1, gap: 6 }}>
                          <Text style={styles.dataItem}>{d.nombre || d.email || `Docente ${d.id}`}</Text>
                          {d.email ? <Text style={styles.dataBullet}>{d.email}</Text> : null}

                          <View style={styles.dataBox}>
                            {cursoDocCursos.length === 0 ? (
                              <Text style={styles.dataBullet}>No hay cursos disponibles</Text>
                            ) : (
                              cursoDocCursos.map((c) => {
                                const checked = (asignacionCursosDocente[d.id] || []).includes(c.id);
                                return (
                                  <Pressable
                                    key={`${d.id}-${c.id}`}
                                    style={[styles.pickerItem, { flexDirection: 'row', alignItems: 'center', gap: 10 }, checked && styles.pickerItemActive]}
                                    onPress={() => toggleCursoDocenteAsignacion(d.id, c.id)}
                                  >
                                    <Ionicons name={checked ? 'checkbox-outline' : 'square-outline'} size={16} color="#e5e7eb" />
                                    <Text style={styles.dataItem}>{c.nombre}</Text>
                                  </Pressable>
                                );
                              })
                            )}
                          </View>

                          <TouchableOpacity
                            style={[styles.smallBtn, styles.createBtn, savingAsignacionDocenteId === d.id && { opacity: 0.6 }]}
                            onPress={() => guardarAsignacionDocente(d.id)}
                            disabled={savingAsignacionDocenteId === d.id}
                          >
                            <View style={styles.btnRow}>
                              <Ionicons name="save-outline" size={14} color="#e5e7eb" />
                              <Text style={styles.smallBtnText}>{savingAsignacionDocenteId === d.id ? 'Guardando...' : 'Guardar asignacion'}</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  )}
                </View>
              ) : null}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="slide"
        visible={estudiantesModalVisible}
        onRequestClose={closeEstudiantesModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.periodTitle}>Estudiantes por curso</Text>
              <Pressable onPress={closeEstudiantesModal} style={styles.closeBtn}>
                <View style={styles.btnRow}><Ionicons name="close-outline" size={16} color="#e5e7eb" /><Text style={styles.closeBtnText}>Cerrar</Text></View>
              </Pressable>
            </View>

            <Text style={styles.fieldLabel}>Selecciona un curso</Text>
            <Pressable style={styles.selectBoxFull} onPress={() => setCursoPickerOpen(prev => !prev)}>
              <Text style={styles.selectText}>{cursoSeleccionadoNombre}</Text>
            </Pressable>
            {cursoPickerOpen ? (
              <View style={styles.dropdownList}>
                {loadingCursos ? <Text style={styles.dataBullet}>Cargando cursos...</Text> : null}
                {cursosAsignados.length === 0 ? (
                  <Text style={styles.dataBullet}>No tienes cursos asignados</Text>
                ) : (
                  cursosAsignados.map(c => (
                    <Pressable
                      key={c.id}
                      style={[styles.dropdownItem, cursoSeleccionado === c.id && styles.dropdownItemSelected]}
                      onPress={async () => {
                        setCursoSeleccionado(c.id);
                        setCursoPickerOpen(false);
                        await loadEstudiantesPorCurso(c.id);
                      }}
                    >
                      <Text style={styles.dataItem}>{c.nombre}</Text>
                    </Pressable>
                  ))
                )}
              </View>
            ) : null}

            <View style={styles.dataBox}>
              <Text style={styles.dataTitle}>Estudiantes</Text>
              {estudiantesLoading ? (
                <Text style={styles.dataBullet}>Cargando estudiantes...</Text>
              ) : estudiantesError ? (
                <Text style={[styles.dataBullet, { color: '#fca5a5' }]}>{estudiantesError}</Text>
              ) : estudiantes.length === 0 ? (
                <Text style={styles.dataBullet}>No hay estudiantes asignados</Text>
              ) : (
                estudiantes.map((e) => (
                  <View key={e.id} style={styles.courseRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.dataItem}>- {e.nombre || `${e.nombres || ''} ${e.apellidos || ''}`.trim()}</Text>
                      {e.documento ? <Text style={styles.dataBullet}>ID: {e.documento}</Text> : null}
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="slide"
        visible={docentesModalVisible}
        onRequestClose={closeDocentesModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.periodTitle}>Docentes del colegio</Text>
              <Pressable onPress={closeDocentesModal} style={styles.closeBtn}>
                <View style={styles.btnRow}><Ionicons name="close-outline" size={16} color="#e5e7eb" /><Text style={styles.closeBtnText}>Cerrar</Text></View>
              </Pressable>
            </View>

            <Text style={styles.fieldLabel}>Colegio: <Text style={styles.dataValue}>{colegioSeleccionadoNombre}</Text></Text>
            <View style={styles.dataBox}>
              <Text style={styles.fieldLabel}>Selecciona colegio</Text>
              {colegiosOptions.length > 0 ? (
                <TouchableOpacity
                  style={[styles.selectBox, { marginBottom: 8 }]}
                  onPress={() => setColegioPickerOpen(prev => !prev)}
                  disabled={docentesLoading || colegiosLoading}
                >
                  <Text style={styles.selectText}>
                    {colegiosLoading
                      ? 'Cargando colegios...'
                      : colegioSeleccionadoNombre}
                  </Text>
                </TouchableOpacity>
              ) : null}

              {colegioPickerOpen && colegiosOptions.length > 0 ? (
                <View style={styles.pickerList}>
                  {colegiosOptions.map(c => (
                    <TouchableOpacity
                      key={c.id}
                      style={[styles.pickerItem, String(colegioSeleccionado) === String(c.id) && styles.pickerItemActive]}
                      onPress={async () => {
                        setColegioPickerOpen(false);
                        setColegioSeleccionado(c.id);
                        await loadDocentesColegio(c.id);
                      }}
                    >
                      <Text style={styles.dataItem}>{c.nombre || `Colegio ${c.id}`}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null}

              {docentesError ? <Text style={styles.errorText}>{docentesError}</Text> : null}

              <View style={{ marginTop: 6 }}>
                <Text style={styles.dataTitle}>Docentes y cursos</Text>
                {docentesLoading ? (
                  <Text style={styles.dataBullet}>Cargando docentes...</Text>
                ) : docentes.length === 0 ? (
                  <Text style={styles.dataBullet}>- Sin docentes para este colegio</Text>
                ) : (
                  docentes.map((d) => (
                    <View key={d.id} style={styles.courseRow}>
                      <View style={{ flex: 1, gap: 2 }}>
                        <Text style={styles.dataItem}>- {d.nombre || d.email || `Docente ${d.id}`}</Text>
                        {d.email ? <Text style={styles.dataBullet}>Email: {d.email}</Text> : null}
                        {d.cursos && d.cursos.length > 0 ? (
                          <View style={{ marginTop: 4, gap: 2 }}>
                            {d.cursos.map((c) => (
                              <Text key={c.id} style={styles.dataBullet}>- {c.nombre}{c.grado ? ` (Grado: ${c.grado})` : ''}</Text>
                            ))}
                          </View>
                        ) : (
                          <Text style={styles.dataBullet}>Sin cursos asignados</Text>
                        )}
                      </View>
                    </View>
                  ))
                )}
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="fade"
        visible={!!quickModal}
        onRequestClose={() => setQuickModal(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.periodTitle}>{quickModal?.title || ''}</Text>
              <Pressable onPress={() => setQuickModal(null)} style={styles.closeBtn}>
                <View style={styles.btnRow}><Ionicons name="close-outline" size={16} color="#e5e7eb" /><Text style={styles.closeBtnText}>Cerrar</Text></View>
              </Pressable>
            </View>
            <Text style={styles.fieldLabel}>{quickModal?.desc || ''}</Text>

            <View style={styles.dataBox}>
              <Text style={styles.dataTitle}>Datos</Text>
              <Text style={styles.dataItem}>Docente: <Text style={styles.dataValue}>{user?.email || 'N/D'}</Text></Text>
              <Text style={styles.dataItem}>Colegio: <Text style={styles.dataValue}>{user?.schoolName || user?.schoolId || 'No asignado'}</Text></Text>
              <Text style={styles.dataItem}>Periodos activos: <Text style={styles.dataValue}>{periodos.length}</Text></Text>
              {periodos.slice(0, 3).map(p => (
                <Text key={p.id} style={styles.dataBullet}>- {p.nombre}: {p.fechaInicio} -> {p.fechaFin}</Text>
              ))}
              {periodos.length === 0 ? <Text style={styles.dataBullet}>- Sin periodos cargados</Text> : null}
            </View>

            <TouchableOpacity
              style={[styles.periodBtn, { marginTop: 12 }]}
              onPress={() => { quickModal?.action?.(); setQuickModal(null); }}
            >
              <View style={styles.btnRow}>
                <Ionicons name="arrow-forward-outline" size={16} color="#fff" />
                <Text style={styles.periodBtnText}>Ir</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 28, alignItems: 'stretch', gap: 16 },
  hero: { width: '100%', aspectRatio: 1, maxHeight: 260, borderRadius: 18, overflow: 'hidden', backgroundColor: '#111827', marginTop: 0, alignSelf: 'center', shadowColor: '#000', shadowOpacity: 0.28, shadowOffset: { width: 0, height: 8 }, shadowRadius: 12, elevation: 5, alignItems: 'center', justifyContent: 'center' },
  logo: { width: '100%', height: '100%' },
  infoCard: { flexDirection: 'row', alignItems: 'center', width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 18, padding: 16, gap: 14, borderWidth: 1, borderColor: 'rgba(56,189,248,0.4)', shadowColor: '#000', shadowOpacity: 0.25, shadowOffset: { width: 0, height: 6 }, shadowRadius: 10, elevation: 6, marginTop: -16 },
  infoAvatar: { width: 54, height: 54, borderRadius: 16, backgroundColor: 'rgba(56,189,248,0.18)', borderWidth: 1, borderColor: 'rgba(56,189,248,0.6)', alignItems: 'center', justifyContent: 'center' },
  infoAvatarText: { color: '#e0f2fe', fontWeight: '900', fontSize: 22 },
  infoBody: { flex: 1, gap: 12 },
  infoHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  infoLabelStrong: { color: '#e0f2fe', fontWeight: '800', fontSize: 13, letterSpacing: 0.4 },
  statusPill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, backgroundColor: 'rgba(34,197,94,0.18)', borderWidth: 1, borderColor: 'rgba(34,197,94,0.45)' },
  statusPillText: { color: '#bbf7d0', fontWeight: '700', fontSize: 12 },
  infoItem: { gap: 6 },
  infoDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.12)' },
  infoLabel: { color: '#cbd5e1', fontWeight: '700', fontSize: 12, letterSpacing: 0.5, textTransform: 'uppercase' },
  infoValue: { color: '#fff', fontWeight: '800', fontSize: 17, letterSpacing: 0.2 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 0 },
  btnRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionBtn: { flexBasis: '48%', borderRadius: 14, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 4 }, shadowRadius: 6, elevation: 3 },
  actionBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  periodBtn: { marginTop: 10, borderRadius: 14, paddingVertical: 14, alignItems: 'center', backgroundColor: '#7c3aed', shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 4 }, shadowRadius: 6, elevation: 3 },
  periodBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#0f172a', borderRadius: 16, padding: 0, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', maxHeight: '90%', width: '100%', alignSelf: 'center' },
  modalCardWide: { maxHeight: '92%' },
  modalContent: { padding: 16, gap: 12 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  closeBtn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 10 },
  closeBtnText: { color: '#e5e7eb', fontWeight: '700' },
  fieldLabel: { color: '#cbd5e1', fontWeight: '700', fontSize: 13 },
  input: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, color: '#fff', backgroundColor: 'rgba(255,255,255,0.04)' },
  inlineRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  selectBox: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.05)', minWidth: 64, alignItems: 'center' },
  selectBoxFull: { paddingHorizontal: 12, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.05)', minWidth: 64 },
  selectText: { color: '#e5e7eb', fontWeight: '800' },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stepperBtn: { width: 32, height: 36, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.04)' },
  stepperText: { color: '#e5e7eb', fontWeight: '800', fontSize: 16 },
  periodTitle: { color: '#e5e7eb', fontWeight: '800', fontSize: 14, marginBottom: 4 },
  periodItemRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  periodName: { color: '#fff', fontWeight: '800', fontSize: 14 },
  periodRange: { color: '#cbd5e1', fontSize: 12, marginTop: 2 },
  periodMeta: { color: '#a5f3fc', fontSize: 12, marginTop: 2 },
  periodActions: { flexDirection: 'row', gap: 8 },
  smallBtn: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10 },
  updateBtn: { backgroundColor: 'rgba(56,189,248,0.2)', borderWidth: 1, borderColor: 'rgba(56,189,248,0.5)' },
  deleteBtn: { backgroundColor: 'rgba(239,68,68,0.18)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.5)' },
  smallBtnText: { color: '#e5e7eb', fontWeight: '700', fontSize: 12 },
  emptyText: { color: '#cbd5e1', textAlign: 'center', marginTop: 8 },
  dataBox: { marginTop: 10, padding: 12, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', gap: 4 },
  dataTitle: { color: '#e5e7eb', fontWeight: '800', marginBottom: 2 },
  dataItem: { color: '#cbd5e1' },
  dataValue: { color: '#fff', fontWeight: '800' },
  dataBullet: { color: '#cbd5e1', fontSize: 12 },
  courseActionsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  courseForm: { marginBottom: 10, gap: 8 },
  courseInput: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: '#fff', backgroundColor: 'rgba(255,255,255,0.08)' },
  courseFormActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  outlineBtn: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)', backgroundColor: 'transparent' },
  createBtn: { backgroundColor: 'rgba(16,185,129,0.25)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.6)' },
  courseRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  courseRowActions: { flexDirection: 'row', gap: 8 },
  pickerList: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.03)', marginBottom: 8 },
  pickerItem: { paddingHorizontal: 12, paddingVertical: 10 },
  pickerItemActive: { backgroundColor: 'rgba(16,185,129,0.18)' },
  errorText: { color: '#fca5a5' },
  dropdownList: { marginTop: 6, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.04)' },
  dropdownItem: { paddingHorizontal: 12, paddingVertical: 10 },
  dropdownItemSelected: { backgroundColor: 'rgba(56,189,248,0.12)' },
  linkBtn: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: 'rgba(59,130,246,0.15)', borderWidth: 1, borderColor: 'rgba(59,130,246,0.4)' },
  linkBtnText: { color: '#bfdbfe', fontWeight: '700', fontSize: 12 },
  logoutBtn: { marginTop: 8, borderRadius: 14, paddingVertical: 15, alignItems: 'center', backgroundColor: '#ef4444', shadowColor: '#000', shadowOpacity: 0.25, shadowOffset: { width: 0, height: 5 }, shadowRadius: 8, elevation: 4 },
  logoutText: { color: '#fff', fontWeight: '800', letterSpacing: 0.3 }
});




