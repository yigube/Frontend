import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, Modal, Pressable, TextInput, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../store/useAuth';
import ScreenBackground from '../components/ScreenBackground';
import { getPeriodos, createPeriodo, updatePeriodo, deletePeriodo } from '../services/periodos';
import { getCursos, getCursosPorColegio, createCurso, updateCurso, deleteCurso } from '../services/cursos';
import { getEstudiantes, createEstudiante, createEstudiantesLote, updateEstudiante, deleteEstudiante } from '../services/estudiantes';
import { getDocentes, getCursosDisponiblesDocente, createDocente, updateDocente, deleteDocente } from '../services/docentes';
import { getColegios, createColegio, updateColegio, deleteColegio } from '../services/colegios';

export default function HomeScreen() {
  const logout = useAuth(s => s.logout);
  const user = useAuth(s => s.user);
  const isAdmin = user?.rol === 'admin';
  const isDocente = user?.rol === 'docente';
  const isRectorCoordinador = ['rector', 'coordinador'].includes(user?.rol);
  const canManageCourses = ['admin', 'rector', 'coordinador'].includes(user?.rol);
  const canManagePeriods = ['admin', 'rector', 'coordinador'].includes(user?.rol);
  const navigation = useNavigation();
  const teacherInitial = (user?.email?.[0] || 'D').toUpperCase();
  const [periodos, setPeriodos] = useState([]);
  const [periodModalVisible, setPeriodModalVisible] = useState(false);
  const [editingPeriodo, setEditingPeriodo] = useState(null);
  const [savingPeriodo, setSavingPeriodo] = useState(false);
  const [periodFeedback, setPeriodFeedback] = useState({ type: '', message: '' });
  const [periodStatusModal, setPeriodStatusModal] = useState({ visible: false, message: '' });
  const [deletePeriodModal, setDeletePeriodModal] = useState({ visible: false, id: null });
  const periodStatusTimeoutRef = useRef(null);
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
  const [deleteCursoModal, setDeleteCursoModal] = useState({ visible: false, curso: null });
  const [cursoCrudColegioId, setCursoCrudColegioId] = useState(null);
  const [cursoCrudPickerOpen, setCursoCrudPickerOpen] = useState(false);
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
  const [estudiantesColegioId, setEstudiantesColegioId] = useState(null);
  const [estudiantesColegioPickerOpen, setEstudiantesColegioPickerOpen] = useState(false);
  const [estudianteCreateModalVisible, setEstudianteCreateModalVisible] = useState(false);
  const [estudianteCreateCursoId, setEstudianteCreateCursoId] = useState(null);
  const [estudianteCreateCursoPickerOpen, setEstudianteCreateCursoPickerOpen] = useState(false);
  const [estudianteCreateForm, setEstudianteCreateForm] = useState({ nombres: '', apellidos: '', qr: '', codigoEstudiante: '' });
  const [selectedCsvFile, setSelectedCsvFile] = useState(null);
  const [uploadedStudents, setUploadedStudents] = useState([]);
  const [estudianteCreateError, setEstudianteCreateError] = useState('');
  const [savingEstudiante, setSavingEstudiante] = useState(false);
  const [estudianteEditing, setEstudianteEditing] = useState(null);
  const [estudianteEditForm, setEstudianteEditForm] = useState({ nombres: '', apellidos: '', qr: '', codigoEstudiante: '' });
  const [savingEstudianteEdit, setSavingEstudianteEdit] = useState(false);
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
  const [colegioCodigoDane, setColegioCodigoDane] = useState('');
  const [rectorNombre, setRectorNombre] = useState('');
  const [rectorApellido, setRectorApellido] = useState('');
  const [rectorCorreo, setRectorCorreo] = useState('');
  const [rectorTelefono, setRectorTelefono] = useState('');
  const [rectorCedula, setRectorCedula] = useState('');
  const [rectorCargo, setRectorCargo] = useState('rector');
  const [rectorPassword, setRectorPassword] = useState('');
  const [showRectorPassword, setShowRectorPassword] = useState(false);
  const [hasRectorPassword, setHasRectorPassword] = useState(false);
  const [deleteColegioModal, setDeleteColegioModal] = useState({ visible: false, colegio: null });
  const [daneExistsModal, setDaneExistsModal] = useState({ visible: false, message: '' });
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
  const [deleteDocenteModal, setDeleteDocenteModal] = useState({ visible: false, docente: null });
  const docenteCrudSchoolRef = useRef(null);
  const colegiosScrollRef = useRef(null);
  const createDefaultPeriodForm = () => {
    const now = new Date();
    const end = new Date(now);
    end.setDate(end.getDate() + 30);
    return {
      nombre: `Periodo ${periodos.length + 1 || 1}`,
      startDay: now.getDate(),
      startMonth: now.getMonth() + 1,
      startYear: now.getFullYear(),
      startHour: 0,
      startMinute: 0,
      endDay: end.getDate(),
      endMonth: end.getMonth() + 1,
      endYear: end.getFullYear(),
      endHour: 23,
      endMinute: 59
    };
  };
  const [periodForm, setPeriodForm] = useState(() => createDefaultPeriodForm());
  const isEditingColegio = Boolean(colegioEditing?.id);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - 2 + i);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const monthNames = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const getApiErrorMessage = (e, fallback) => {
    const apiError = e?.response?.data?.error;
    if (apiError) return apiError;
    const validationErrors = e?.response?.data?.errors;
    if (Array.isArray(validationErrors) && validationErrors.length > 0) {
      return validationErrors[0]?.msg || fallback;
    }
    return e?.message || fallback;
  };

  const clearPeriodStatusTimeout = () => {
    if (!periodStatusTimeoutRef.current) return;
    clearTimeout(periodStatusTimeoutRef.current);
    periodStatusTimeoutRef.current = null;
  };

  const showPeriodStatusModal = (message) => {
    clearPeriodStatusTimeout();
    setPeriodStatusModal({ visible: true, message });
    periodStatusTimeoutRef.current = setTimeout(() => {
      setPeriodStatusModal({ visible: false, message: '' });
      periodStatusTimeoutRef.current = null;
    }, 2000);
  };

  const parseDateParts = (iso) => {
    if (!iso) return { day: 1, month: 1, year: currentYear };
    const [datePart] = iso.split('T');
    const [year, month, day] = datePart.split('-').map(n => parseInt(n, 10));
    return {
      day: Number.isFinite(day) ? day : 1,
      month: Number.isFinite(month) ? month : 1,
      year: Number.isFinite(year) ? year : currentYear
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
      return data;
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.error || 'No se pudieron cargar los periodos');
      return [];
    }
  };

  useEffect(() => { loadPeriodos(); }, []);
  useEffect(() => () => clearPeriodStatusTimeout(), []);

  const sortPeriodos = (list) => [...(list || [])].sort((a, b) => {
    const aDate = new Date(a?.fechaInicio || 0).getTime();
    const bDate = new Date(b?.fechaInicio || 0).getTime();
    if (aDate !== bDate) return aDate - bDate;
    return Number(a?.id || 0) - Number(b?.id || 0);
  });

  const normalizePeriodosNames = async (list) => {
    const ordered = sortPeriodos(list);
    const updates = ordered
      .map((p, idx) => ({ id: p.id, nombre: `Periodo ${idx + 1}`, currentName: (p.nombre || '').trim() }))
      .filter((item) => item.currentName !== item.nombre)
      .map((item) => updatePeriodo(item.id, { nombre: item.nombre }));
    if (updates.length > 0) await Promise.all(updates);
    return updates.length;
  };

  const openPeriodModal = (periodo = null) => {
    setPeriodFeedback({ type: '', message: '' });
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
      setPeriodForm(createDefaultPeriodForm());
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
    setPeriodFeedback({ type: '', message: '' });
    setSavingPeriodo(true);
    try {
      if (editingPeriodo) {
        await updatePeriodo(editingPeriodo.id, payload);
        showPeriodStatusModal('Periodo actualizado');
        setEditingPeriodo(null);
        setPeriodForm(createDefaultPeriodForm());
      } else {
        await createPeriodo(payload);
        showPeriodStatusModal('Periodo creado');
      }
      await loadPeriodos();
    } catch (e) {
      setPeriodFeedback({ type: 'error', message: e?.response?.data?.error || 'No se pudo guardar el periodo' });
      Alert.alert('Error', e?.response?.data?.error || 'No se pudo guardar el periodo');
    } finally {
      setSavingPeriodo(false);
    }
  };

  const askDeletePeriod = (id) => {
    setDeletePeriodModal({ visible: true, id });
  };

  const handleDeletePeriod = async (id) => {
    if (!id) return;
    setDeletePeriodModal({ visible: false, id: null });
    try {
      await deletePeriodo(id);
      const loaded = await loadPeriodos();
      const normalizedCount = await normalizePeriodosNames(loaded);
      const finalList = normalizedCount > 0 ? await loadPeriodos() : loaded;
      const ordered = sortPeriodos(finalList);
      const first = ordered[0];
      setEditingPeriodo(null);
      if (first) {
        const ini = parseDateParts(first.fechaInicio);
        const fin = parseDateParts(first.fechaFin);
        setPeriodForm({
          nombre: `Periodo ${ordered.length + 1}`,
          startDay: ini.day,
          startMonth: ini.month,
          startYear: ini.year,
          startHour: 0,
          startMinute: 0,
          endDay: fin.day,
          endMonth: fin.month,
          endYear: fin.year,
          endHour: 23,
          endMinute: 59
        });
      } else {
        const now = new Date();
        const end = new Date(now);
        end.setDate(end.getDate() + 30);
        setPeriodForm({
          nombre: 'Periodo 1',
          startDay: now.getDate(),
          startMonth: now.getMonth() + 1,
          startYear: now.getFullYear(),
          startHour: 0,
          startMinute: 0,
          endDay: end.getDate(),
          endMonth: end.getMonth() + 1,
          endYear: end.getFullYear(),
          endHour: 23,
          endMinute: 59
        });
      }
    } catch (e) {
      Alert.alert('Error', getApiErrorMessage(e, 'No se pudo eliminar'));
    }
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
    setCursoCrudPickerOpen(false);
    setLoadingCursos(true);
    try {
      const userSchoolOption = user?.schoolId ? [{ id: user.schoolId, nombre: user?.schoolName || `Colegio ${user.schoolId}` }] : [];
      setColegiosOptions(userSchoolOption);
      const colegios = await loadColegios({ preferId: user?.schoolId, preferName: user?.schoolName });
      const defaultSchoolId = user?.schoolId || colegios?.[0]?.id || null;
      setCursoCrudColegioId(defaultSchoolId);
      await loadCursosAsignados(defaultSchoolId);
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
    setCursoCrudColegioId(null);
    setCursoCrudPickerOpen(false);
  };

  const changeCursoCrudColegio = async (newSchoolId) => {
    const parsedSchoolId = Number(newSchoolId);
    if (!Number.isFinite(parsedSchoolId) || parsedSchoolId <= 0) return;
    setCursoCrudColegioId(parsedSchoolId);
    setCursoCrudPickerOpen(false);
    setCursoFormVisible(false);
    setCursoEditing(null);
    setCursoNombre('');
    setLoadingCursos(true);
    try {
      await loadCursosAsignados(parsedSchoolId);
    } finally {
      setLoadingCursos(false);
    }
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
    setEstudiantesColegioPickerOpen(false);
    setEstudiantesError('');
    try {
      setLoadingCursos(true);
      const userSchoolOption = user?.schoolId ? [{ id: user.schoolId, nombre: user?.schoolName || `Colegio ${user.schoolId}` }] : [];
      setColegiosOptions(userSchoolOption);
      const defaultSchool = user?.schoolId || colegioSeleccionado || null;
      const options = await loadColegios({ preferId: defaultSchool, preferName: user?.schoolName });
      const selectedSchoolId = defaultSchool || options?.[0]?.id || null;
      setEstudiantesColegioId(selectedSchoolId);
      const cursos = await loadCursosAsignados(selectedSchoolId);
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
    setEstudiantesColegioPickerOpen(false);
    setEstudiantesColegioId(null);
    setCursoSeleccionado(null);
    setEstudiantes([]);
    setEstudiantesError('');
    setEstudianteEditing(null);
    setEstudianteEditForm({ nombres: '', apellidos: '', qr: '', codigoEstudiante: '' });
  };

  const changeEstudiantesColegio = async (newSchoolId) => {
    const parsedSchoolId = Number(newSchoolId);
    if (!Number.isFinite(parsedSchoolId) || parsedSchoolId <= 0) return;
    setEstudiantesColegioId(parsedSchoolId);
    setEstudiantesColegioPickerOpen(false);
    setCursoPickerOpen(false);
    setEstudianteEditing(null);
    setEstudianteEditForm({ nombres: '', apellidos: '', qr: '', codigoEstudiante: '' });
    setLoadingCursos(true);
    try {
      const cursos = await loadCursosAsignados(parsedSchoolId);
      const firstId = (cursos && cursos[0]?.id) || null;
      setCursoSeleccionado(firstId);
      await loadEstudiantesPorCurso(firstId);
    } finally {
      setLoadingCursos(false);
    }
  };

  const startEditEstudiante = (estudiante) => {
    setEstudianteEditing(estudiante?.id || null);
    setEstudianteEditForm({
      nombres: estudiante?.nombres || '',
      apellidos: estudiante?.apellidos || '',
      qr: estudiante?.qr || '',
      codigoEstudiante: estudiante?.codigoEstudiante || ''
    });
  };

  const cancelEditEstudiante = () => {
    setEstudianteEditing(null);
    setEstudianteEditForm({ nombres: '', apellidos: '', qr: '', codigoEstudiante: '' });
  };

  const handleUpdateEstudiante = async (id) => {
    const nombres = (estudianteEditForm.nombres || '').trim();
    const apellidos = (estudianteEditForm.apellidos || '').trim();
    const qr = (estudianteEditForm.qr || '').trim();
    const codigoEstudiante = (estudianteEditForm.codigoEstudiante || '').trim();
    if (!nombres || !apellidos || !qr) {
      Alert.alert('Campos requeridos', 'Completa nombres, apellidos y QR');
      return;
    }
    setSavingEstudianteEdit(true);
    try {
      await updateEstudiante(id, { nombres, apellidos, qr, codigoEstudiante });
      await loadEstudiantesPorCurso(cursoSeleccionado);
      cancelEditEstudiante();
      Alert.alert('Listo', 'Estudiante actualizado');
    } catch (e) {
      Alert.alert('Error', getApiErrorMessage(e, 'No se pudo actualizar el estudiante'));
    } finally {
      setSavingEstudianteEdit(false);
    }
  };

  const askDeleteEstudiante = (estudiante) => {
    Alert.alert(
      'Eliminar estudiante',
      `Vas a eliminar a "${estudiante?.nombres || ''} ${estudiante?.apellidos || ''}". Esta accion no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEstudiante(estudiante?.id);
              await loadEstudiantesPorCurso(cursoSeleccionado);
              if (String(estudianteEditing) === String(estudiante?.id)) cancelEditEstudiante();
              Alert.alert('Listo', 'Estudiante eliminado');
            } catch (e) {
              Alert.alert('Error', getApiErrorMessage(e, 'No se pudo eliminar el estudiante'));
            }
          }
        }
      ]
    );
  };

  const parseCsvRows = (csvText) => {
    const normalized = String(csvText || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const lines = normalized.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const idxNombres = headers.indexOf('nombres');
    const idxApellidos = headers.indexOf('apellidos');
    const idxQr = headers.indexOf('qr');
    const idxCodigo = headers.indexOf('codigoestudiante');
    if (idxNombres < 0 || idxApellidos < 0 || idxQr < 0) return [];
    return lines.slice(1).map((line) => {
      const cols = line.split(',').map((c) => c.trim());
      return {
        nombres: cols[idxNombres] || '',
        apellidos: cols[idxApellidos] || '',
        qr: cols[idxQr] || '',
        codigoEstudiante: idxCodigo >= 0 ? (cols[idxCodigo] || '') : ''
      };
    }).filter((row) => row.nombres && row.apellidos && row.qr);
  };

  const openCreateEstudianteModal = async () => {
    setEstudianteCreateModalVisible(true);
    setEstudianteCreateCursoPickerOpen(false);
    setEstudianteCreateError('');
    setEstudianteCreateForm({ nombres: '', apellidos: '', qr: '', codigoEstudiante: '' });
    setSelectedCsvFile(null);
    setUploadedStudents([]);
    setLoadingCursos(true);
    try {
      const schoolId = user?.schoolId || null;
      const cursos = await loadCursosAsignados(schoolId);
      setEstudianteCreateCursoId(cursos?.[0]?.id || null);
    } catch (e) {
      setEstudianteCreateError(e?.response?.data?.error || 'No se pudieron cargar los cursos');
    } finally {
      setLoadingCursos(false);
    }
  };

  const closeCreateEstudianteModal = () => {
    setEstudianteCreateModalVisible(false);
    setEstudianteCreateCursoPickerOpen(false);
    setEstudianteCreateError('');
    setEstudianteCreateCursoId(null);
    setEstudianteCreateForm({ nombres: '', apellidos: '', qr: '', codigoEstudiante: '' });
    setSelectedCsvFile(null);
    setUploadedStudents([]);
    setSavingEstudiante(false);
  };

  const handleImportCsv = async () => {
    setEstudianteCreateError('');
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.csv,text/csv';
      input.onchange = async (event) => {
        const file = event?.target?.files?.[0];
        if (!file) return;
        const content = await file.text();
        const dotIdx = file.name.lastIndexOf('.');
        const ext = dotIdx >= 0 ? file.name.slice(dotIdx + 1).toLowerCase() : '';
        setSelectedCsvFile({ name: file.name, ext, content });
      };
      input.click();
      return;
    }

    try {
      const DocumentPicker = await import('expo-document-picker');
      const FileSystem = await import('expo-file-system');
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/csv', 'text/comma-separated-values', 'text/plain'],
        copyToCacheDirectory: true,
        multiple: false
      });
      if (result.canceled) return;
      const file = result.assets?.[0];
      if (!file?.uri) return;
      const content = await FileSystem.readAsStringAsync(file.uri);
      const name = file.name || file.uri.split('/').pop() || 'archivo.csv';
      const dotIdx = name.lastIndexOf('.');
      const ext = dotIdx >= 0 ? name.slice(dotIdx + 1).toLowerCase() : '';
      setSelectedCsvFile({ name, ext, content });
    } catch (e) {
      setEstudianteCreateError('No se pudo abrir el selector de archivos del dispositivo.');
    }
  };

  const handleUploadCsv = async () => {
    const cursoId = Number(estudianteCreateCursoId);
    if (!Number.isFinite(cursoId) || cursoId <= 0) {
      setEstudianteCreateError('Selecciona un curso antes de subir el archivo');
      return;
    }
    if (!selectedCsvFile?.content) {
      setEstudianteCreateError('Primero selecciona un archivo CSV');
      return;
    }
    const estudiantes = parseCsvRows(selectedCsvFile.content);
    if (!estudiantes.length) {
      setEstudianteCreateError('CSV invalido. Encabezados requeridos: nombres,apellidos,qr,codigoEstudiante');
      return;
    }
    setSavingEstudiante(true);
    setEstudianteCreateError('');
    try {
      const data = await createEstudiantesLote({ cursoId, estudiantes });
      setUploadedStudents(Array.isArray(data?.students) ? data.students : estudiantes);
      Alert.alert('Listo', `Se cargaron ${data?.created || estudiantes.length} estudiantes`);
    } catch (e) {
      setEstudianteCreateError(getApiErrorMessage(e, 'No se pudo subir el archivo CSV'));
    } finally {
      setSavingEstudiante(false);
    }
  };

  const handleCreateEstudiante = async () => {
    const nombres = (estudianteCreateForm.nombres || '').trim();
    const apellidos = (estudianteCreateForm.apellidos || '').trim();
    const qr = (estudianteCreateForm.qr || '').trim();
    const codigoEstudiante = (estudianteCreateForm.codigoEstudiante || '').trim();
    const cursoId = Number(estudianteCreateCursoId);
    if (!nombres || !apellidos || !qr) {
      setEstudianteCreateError('Completa nombres, apellidos y QR');
      return;
    }
    if (!Number.isFinite(cursoId) || cursoId <= 0) {
      setEstudianteCreateError('Selecciona un curso');
      return;
    }
    setSavingEstudiante(true);
    setEstudianteCreateError('');
    try {
      await createEstudiante({ nombres, apellidos, qr, codigoEstudiante, cursoId });
      Alert.alert('Listo', 'Estudiante agregado correctamente');
      closeCreateEstudianteModal();
    } catch (e) {
      setEstudianteCreateError(getApiErrorMessage(e, 'No se pudo agregar el estudiante'));
    } finally {
      setSavingEstudiante(false);
    }
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
    setColegiosError('');
    setColegiosModalVisible(true);
    await loadColegios();
  };

  const closeColegiosModal = () => {
    setColegiosModalVisible(false);
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
    setColegiosError('');
  };

  const startEditColegio = (colegio) => {
    setColegioEditing(colegio);
    setColegioNombre(colegio?.nombre || '');
    setColegioCodigoDane(colegio?.codigoDane || colegio?.codigo_dane || '');
    setRectorNombre(colegio?.rectorNombre || colegio?.rector_nombre || '');
    setRectorApellido(colegio?.rectorApellido || colegio?.rector_apellido || '');
    setRectorCorreo(colegio?.rectorCorreo || colegio?.rector_correo || '');
    setRectorTelefono(colegio?.rectorTelefono || colegio?.rector_telefono || '');
    setRectorCedula(colegio?.rectorCedula || colegio?.rector_cedula || '');
    setRectorCargo((colegio?.rectorCargo || colegio?.rector?.cargo || 'rector') === 'coordinador' ? 'coordinador' : 'rector');
    setRectorPassword('');
    setShowRectorPassword(false);
    setHasRectorPassword(Boolean(colegio?.rectorTienePassword));
    setColegiosError('');
    setTimeout(() => {
      colegiosScrollRef.current?.scrollTo?.({ y: 0, animated: true });
    }, 0);
  };

  const handleSaveColegio = async () => {
    const nombre = colegioNombre.trim();
    const codigoDane = colegioCodigoDane.trim();
    const passwordDraft = rectorPassword.trim();
    const payload = {
      nombre,
      codigoDane,
      rectorCargo,
      rectorNombre: rectorNombre.trim(),
      rectorApellido: rectorApellido.trim(),
      rectorCorreo: rectorCorreo.trim(),
      rectorTelefono: rectorTelefono.trim(),
      rectorCedula: rectorCedula.trim()
    };
    if (passwordDraft) {
      payload.rectorPassword = passwordDraft;
    }
    if (!nombre) return Alert.alert('Nombre requerido', 'Ingresa un nombre para el colegio');
    setSavingColegio(true);
    setColegiosError('');
    try {
      if (colegioEditing) {
        await updateColegio(colegioEditing.id, payload);
      } else {
        await createColegio(payload);
      }
      await loadColegios();
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
    } catch (e) {
      const apiError = getApiErrorMessage(e, 'No se pudo guardar el colegio');
      if (String(apiError).toLowerCase().includes('codigo dane ya existe')) {
        setDaneExistsModal({ visible: true, message: 'El codigo DANE ya existe. Ingresa uno diferente.' });
      } else {
        setColegiosError(apiError);
        Alert.alert('Error', apiError);
      }
    } finally {
      setSavingColegio(false);
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
      Alert.alert('Error', e?.response?.data?.error || 'No se pudo eliminar el colegio');
    } finally {
      setColegiosLoading(false);
    }
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
    try {
      let cursos = [];
      try {
        cursos = await getCursosPorColegio(parsedSchoolId);
      } catch {
        cursos = await getCursosDisponiblesDocente({ schoolId: parsedSchoolId });
      }
      if (Number(docenteCrudSchoolRef.current) !== targetSchoolId) return [];
      setDocenteError('');
      setDocenteCursosDisponibles(cursos || []);
      return cursos || [];
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
  }, [docenteCrudModalVisible, docenteColegioId]);

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
    const nombreInput = docenteForm.nombre.trim();
    const email = docenteForm.email.trim();
    const password = docenteForm.password;
    const nombreInferido = email.includes('@') ? email.split('@')[0] : '';
    const nombre = nombreInput || nombreInferido;

    setDocenteError('');

    if (!email || (!docenteEditing && !password)) {
      setDocenteError('Correo y contrasena son requeridos para crear un docente');
      return;
    }

    if ((!docenteEditing && password.length < 4) || (docenteEditing && password && password.length < 4)) {
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
      await loadDocentesActual(payload.schoolId);
      setDocenteForm({ nombre: '', email: '', password: '' });
      setDocenteCursos([]);
      setDocenteEditing(null);
    } catch (e) {
      const rawMessage = getApiErrorMessage(e, 'No se pudo guardar el docente');
      const message = String(rawMessage).toLowerCase().includes('validation')
        ? 'No se pudo guardar. Verifica que el correo no este en uso'
        : rawMessage;
      setDocenteError(message);
      Alert.alert('Error', message);
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
      await loadDocentesActual(docenteColegioId || user?.schoolId);
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.error || 'No se pudo eliminar el docente');
    } finally {
      setDocentesLoading(false);
    }
  };

  const loadColegios = async ({ preferId = null, preferName } = {}) => {
    setColegiosLoading(true);
    setColegiosError('');
    try {
      const data = await getColegios();
      setColegiosList(data || []);
      const mapped = data.map(c => ({ id: c.id, nombre: c.nombre || `Colegio ${c.id}` }));
      const merged = [...mapped];
      if (preferId && !merged.some(o => String(o.id) === String(preferId))) {
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
    const schoolId = Number(cursoCrudColegioId || user?.schoolId);
    if (!Number.isFinite(schoolId) || schoolId <= 0) {
      return Alert.alert('Colegio requerido', 'Selecciona un colegio antes de guardar el curso');
    }
    setSavingCurso(true);
    setLoadingCursos(true);
    try {
      if (cursoEditing) {
        await updateCurso(cursoEditing.id, { nombre, schoolId });
      } else {
        await createCurso({ nombre, schoolId });
      }
      await loadCursosAsignados(schoolId);
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
      Alert.alert('Error', e?.response?.data?.error || 'No se pudo eliminar el curso');
    } finally {
      setLoadingCursos(false);
    }
  };

  const cursoSeleccionadoNombre = cursoSeleccionado
    ? (cursosAsignados.find(c => c.id === cursoSeleccionado)?.nombre || 'Curso sin nombre')
    : 'Selecciona curso';
  const estudianteCreateCursoNombre = estudianteCreateCursoId
    ? (cursosAsignados.find(c => c.id === estudianteCreateCursoId)?.nombre || 'Curso sin nombre')
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
          {isDocente ? (
            <>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#22c55e' }]} onPress={() => navigation.navigate('QR')}>
                <View style={styles.btnRow}>
                  <Ionicons name="qr-code-outline" size={18} color="#fff" />
                  <Text style={styles.actionBtnText}>Escanear QR</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#0ea5e9' }]} onPress={openCreateEstudianteModal}>
                <View style={styles.btnRow}>
                  <Ionicons name="person-add-outline" size={18} color="#fff" />
                  <Text style={[styles.actionBtnText, styles.actionBtnTextCompact]}>Agregar estudiantes</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.actionBtnFull, { backgroundColor: '#a78bfa' }]} onPress={openEstudiantesModal}>
                <View style={styles.btnRow}>
                  <Ionicons name="people-outline" size={18} color="#fff" />
                  <Text style={styles.actionBtnText}>Ver estudiantes por curso</Text>
                </View>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {!isAdmin && !isRectorCoordinador ? (
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#22c55e' }]} onPress={() => navigation.navigate('QR')}>
                  <View style={styles.btnRow}>
                    <Ionicons name="qr-code-outline" size={18} color="#fff" />
                    <Text style={styles.actionBtnText}>Escanear QR</Text>
                  </View>
                </TouchableOpacity>
              ) : null}
              {canManageCourses ? (
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#38bdf8' }]} onPress={openCursosModal}>
                  <View style={styles.btnRow}>
                    <Ionicons name="book-outline" size={18} color="#fff" />
                    <Text style={styles.actionBtnText}>Crear cursos</Text>
                  </View>
                </TouchableOpacity>
              ) : null}
              {!isAdmin && !isRectorCoordinador ? (
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#a78bfa' }]} onPress={openEstudiantesModal}>
                  <View style={styles.btnRow}>
                    <Ionicons name="people-outline" size={18} color="#fff" />
                    <Text style={styles.actionBtnText}>Estudiantes</Text>
                  </View>
                </TouchableOpacity>
              ) : null}
              {canManageCourses ? (
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#14b8a6' }]} onPress={openDocenteCrudModal}>
                  <View style={styles.btnRow}>
                    <Ionicons name="person-add-outline" size={18} color="#fff" />
                    <Text style={styles.actionBtnText}>Crear docentes</Text>
                  </View>
                </TouchableOpacity>
              ) : null}
              {isAdmin ? (
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#facc15' }]} onPress={openColegiosModal}>
                  <View style={styles.btnRow}>
                    <Ionicons name="business-outline" size={18} color="#111" />
                    <Text style={[styles.actionBtnText, { color: '#111' }]}>Crear colegios</Text>
                  </View>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#f97316' }]} onPress={() => openQuickModal('reportes')}>
                <View style={styles.btnRow}>
                  <Ionicons name="bar-chart-outline" size={18} color="#fff" />
                  <Text style={styles.actionBtnText}>Reportes</Text>
                </View>
              </TouchableOpacity>
              {canManagePeriods ? (
                <TouchableOpacity style={[styles.actionBtn, isAdmin && styles.actionBtnFull, { backgroundColor: '#7c3aed' }]} onPress={() => openPeriodModal()}>
                  <View style={styles.btnRow}>
                    <Ionicons name="calendar-outline" size={18} color="#fff" />
                    <Text style={styles.actionBtnText}>Activar periodos</Text>
                  </View>
                </TouchableOpacity>
              ) : null}
            </>
          )}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.85}>
          <View style={styles.btnRow}>
            <Ionicons name="log-out-outline" size={18} color="#fff" />
            <Text style={styles.logoutText}>Cerrar sesion</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        transparent
        animationType="slide"
        visible={estudianteCreateModalVisible}
        onRequestClose={closeCreateEstudianteModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.periodTitle}>Agregar estudiante</Text>
              <Pressable onPress={closeCreateEstudianteModal} style={styles.closeBtn}>
                <View style={styles.btnRow}><Ionicons name="close-outline" size={16} color="#e5e7eb" /><Text style={styles.closeBtnText}>Cerrar</Text></View>
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={styles.fieldLabel}>Curso</Text>
              <TouchableOpacity
                style={[styles.selectBoxFull, { marginBottom: 6 }]}
                onPress={() => setEstudianteCreateCursoPickerOpen(prev => !prev)}
                disabled={loadingCursos || savingEstudiante}
              >
                <Text style={styles.selectText}>{loadingCursos ? 'Cargando cursos...' : estudianteCreateCursoNombre}</Text>
              </TouchableOpacity>
              {estudianteCreateCursoPickerOpen ? (
                <View style={styles.dropdownList}>
                  {cursosAsignados.length === 0 ? (
                    <Text style={[styles.dataBullet, { padding: 12 }]}>No hay cursos disponibles</Text>
                  ) : (
                    cursosAsignados.map((c) => (
                      <TouchableOpacity
                        key={c.id}
                        style={[styles.dropdownItem, String(estudianteCreateCursoId) === String(c.id) && styles.dropdownItemSelected]}
                        onPress={() => {
                          setEstudianteCreateCursoId(c.id);
                          setEstudianteCreateCursoPickerOpen(false);
                        }}
                      >
                        <Text style={styles.selectText}>{c.nombre || `Curso ${c.id}`}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              ) : null}

              <TextInput
                style={styles.courseInput}
                placeholder="Nombres"
                placeholderTextColor="#9ca3af"
                value={estudianteCreateForm.nombres}
                editable={!savingEstudiante}
                onChangeText={(v) => setEstudianteCreateForm(prev => ({ ...prev, nombres: v }))}
              />
              <TextInput
                style={styles.courseInput}
                placeholder="Apellidos"
                placeholderTextColor="#9ca3af"
                value={estudianteCreateForm.apellidos}
                editable={!savingEstudiante}
                onChangeText={(v) => setEstudianteCreateForm(prev => ({ ...prev, apellidos: v }))}
              />
              <TextInput
                style={styles.courseInput}
                placeholder="Codigo QR"
                placeholderTextColor="#9ca3af"
                value={estudianteCreateForm.qr}
                editable={!savingEstudiante}
                onChangeText={(v) => setEstudianteCreateForm(prev => ({ ...prev, qr: v }))}
              />
              <TextInput
                style={styles.courseInput}
                placeholder="Codigo del estudiante"
                placeholderTextColor="#9ca3af"
                value={estudianteCreateForm.codigoEstudiante}
                editable={!savingEstudiante}
                onChangeText={(v) => setEstudianteCreateForm(prev => ({ ...prev, codigoEstudiante: v }))}
              />
              <TouchableOpacity
                style={[styles.smallBtn, styles.outlineBtn, savingEstudiante && { opacity: 0.6 }]}
                onPress={handleImportCsv}
                disabled={savingEstudiante}
              >
                <View style={styles.btnRow}>
                  <Ionicons name="document-attach-outline" size={14} color="#e5e7eb" />
                  <Text style={styles.smallBtnText}>Seleccionar archivo</Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.dataBullet}>CSV encabezados: nombres,apellidos,qr,codigoEstudiante</Text>
              {selectedCsvFile ? (
                <Text style={styles.dataBullet}>
                  Archivo: {selectedCsvFile.name} {selectedCsvFile.ext ? `(.${selectedCsvFile.ext})` : ''}
                </Text>
              ) : (
                <Text style={styles.dataBullet}>Archivo: no seleccionado</Text>
              )}
              <TouchableOpacity
                style={[styles.smallBtn, styles.createBtn, savingEstudiante && { opacity: 0.6 }]}
                onPress={handleUploadCsv}
                disabled={savingEstudiante}
              >
                <View style={styles.btnRow}>
                  <Ionicons name="cloud-upload-outline" size={14} color="#e5e7eb" />
                  <Text style={styles.smallBtnText}>{savingEstudiante ? 'Subiendo...' : 'Subir archivo'}</Text>
                </View>
              </TouchableOpacity>
              {estudianteCreateError ? <Text style={[styles.dataBullet, { color: '#fca5a5' }]}>{estudianteCreateError}</Text> : null}
              {uploadedStudents.length > 0 ? (
                <View style={styles.dataBox}>
                  <Text style={styles.dataTitle}>Estudiantes cargados</Text>
                  {uploadedStudents.map((s, idx) => (
                    <Text key={`${s.id || 'new'}-${idx}`} style={styles.dataBullet}>
                      - {s.nombres} {s.apellidos} | QR: {s.qr}{s.codigoEstudiante ? ` | Codigo: ${s.codigoEstudiante}` : ''}
                    </Text>
                  ))}
                </View>
              ) : null}
              <View style={styles.courseFormActions}>
                <TouchableOpacity
                  style={[styles.smallBtn, styles.createBtn, savingEstudiante && { opacity: 0.6 }]}
                  onPress={handleCreateEstudiante}
                  disabled={savingEstudiante}
                >
                  <View style={styles.btnRow}>
                    <Ionicons name="save-outline" size={14} color="#e5e7eb" />
                    <Text style={styles.smallBtnText}>{savingEstudiante ? 'Guardando...' : 'Guardar estudiante'}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

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
              {periodFeedback.type === 'error' && periodFeedback.message ? (
                <Text style={periodFeedback.type === 'error' ? styles.feedbackError : styles.feedbackSuccess}>
                  {periodFeedback.message}
                </Text>
              ) : null}

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
                    <TouchableOpacity style={[styles.smallBtn, styles.deleteBtn]} onPress={() => askDeletePeriod(p.id)}>
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

            {canManageCourses ? (
              <View style={{ marginBottom: 10 }}>
                <Text style={styles.fieldLabel}>Colegio</Text>
                <TouchableOpacity
                  style={[styles.selectBoxFull, { marginTop: 6 }]}
                  onPress={() => setCursoCrudPickerOpen(prev => !prev)}
                  disabled={loadingCursos || colegiosLoading}
                >
                  <Text style={styles.selectText}>{resolveColegioNombre(cursoCrudColegioId || user?.schoolId)}</Text>
                </TouchableOpacity>
                {cursoCrudPickerOpen && colegiosOptions.length > 0 ? (
                  <View style={styles.pickerList}>
                    {colegiosOptions.map(c => (
                      <TouchableOpacity
                        key={c.id}
                        style={[styles.pickerItem, String(cursoCrudColegioId) === String(c.id) && styles.pickerItemActive]}
                        onPress={async () => {
                          await changeCursoCrudColegio(c.id);
                        }}
                      >
                        <Text style={styles.dataItem}>{c.nombre || `Colegio ${c.id}`}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : null}
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
                    onPress={handleSaveCurso}
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
                      <TouchableOpacity style={[styles.smallBtn, styles.deleteBtn]} onPress={() => askDeleteCurso(c)}>
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
            <ScrollView
              ref={colegiosScrollRef}
              contentContainerStyle={styles.modalContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.periodTitle}>Colegios</Text>
                <Pressable onPress={closeColegiosModal} style={styles.closeBtn}>
                  <View style={styles.btnRow}><Ionicons name="close-outline" size={16} color="#e5e7eb" /><Text style={styles.closeBtnText}>Cerrar</Text></View>
                </Pressable>
              </View>

            <View style={styles.courseForm}>
              <Text style={styles.fieldLabel}>{isEditingColegio ? 'Editar colegio' : 'Nuevo colegio'}</Text>
              {isEditingColegio ? (
                <Text style={styles.dataBullet}>
                  Editando: {colegioEditing?.nombre || `Colegio ${colegioEditing?.id}`}
                </Text>
              ) : null}
              <TextInput
                style={styles.courseInput}
                placeholder="Nombre del colegio"
                placeholderTextColor="#9ca3af"
                value={colegioNombre}
                editable={!savingColegio}
                onChangeText={setColegioNombre}
              />
              <TextInput
                style={styles.courseInput}
                placeholder="Codigo DANE de la institucion"
                placeholderTextColor="#9ca3af"
                value={colegioCodigoDane}
                editable={!savingColegio}
                onChangeText={setColegioCodigoDane}
                autoCapitalize="characters"
              />
              <TextInput
                style={styles.courseInput}
                placeholder={`Nombre del ${rectorCargo === 'coordinador' ? 'coordinador' : 'rector'}`}
                placeholderTextColor="#9ca3af"
                value={rectorNombre}
                editable={!savingColegio}
                onChangeText={setRectorNombre}
              />
              <TextInput
                style={styles.courseInput}
                placeholder={`Apellido del ${rectorCargo === 'coordinador' ? 'coordinador' : 'rector'}`}
                placeholderTextColor="#9ca3af"
                value={rectorApellido}
                editable={!savingColegio}
                onChangeText={setRectorApellido}
              />
              <TextInput
                style={styles.courseInput}
                placeholder={`Correo del ${rectorCargo === 'coordinador' ? 'coordinador' : 'rector'}`}
                placeholderTextColor="#9ca3af"
                value={rectorCorreo}
                editable={!savingColegio}
                onChangeText={setRectorCorreo}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.courseInput}
                placeholder={`Telefono del ${rectorCargo === 'coordinador' ? 'coordinador' : 'rector'}`}
                placeholderTextColor="#9ca3af"
                value={rectorTelefono}
                editable={!savingColegio}
                onChangeText={setRectorTelefono}
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.courseInput}
                placeholder={`Cedula del ${rectorCargo === 'coordinador' ? 'coordinador' : 'rector'}`}
                placeholderTextColor="#9ca3af"
                value={rectorCedula}
                editable={!savingColegio}
                onChangeText={setRectorCedula}
                keyboardType="numeric"
              />
              <View style={styles.passwordInputWrap}>
                <TextInput
                  style={[styles.courseInput, styles.passwordInput]}
                  placeholder={isEditingColegio
                    ? `Nueva contrasena del ${rectorCargo === 'coordinador' ? 'coordinador' : 'rector'} (opcional)`
                    : `Contrasena del ${rectorCargo === 'coordinador' ? 'coordinador' : 'rector'}`}
                  placeholderTextColor="#9ca3af"
                  value={rectorPassword}
                  editable={!savingColegio}
                  onChangeText={setRectorPassword}
                  secureTextEntry={!showRectorPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.passwordEyeBtn}
                  onPress={() => setShowRectorPassword((prev) => !prev)}
                  disabled={savingColegio}
                >
                  <Ionicons name={showRectorPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#e5e7eb" />
                </TouchableOpacity>
              </View>
              {isEditingColegio && hasRectorPassword && !rectorPassword ? (
                <Text style={styles.dataBullet}>Este usuario directivo ya tiene contrasena configurada. Escribe una nueva solo si deseas cambiarla.</Text>
              ) : null}
              <Text style={styles.fieldLabel}>Cargo del directivo</Text>
              <View style={styles.inlineRow}>
                <TouchableOpacity
                  style={[styles.smallBtn, styles.outlineBtn, rectorCargo === 'rector' && styles.pickerItemActive, savingColegio && { opacity: 0.6 }]}
                  onPress={() => setRectorCargo('rector')}
                  disabled={savingColegio}
                >
                  <View style={styles.btnRow}>
                    <Ionicons name="school-outline" size={14} color="#e5e7eb" />
                    <Text style={styles.smallBtnText}>Rector</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.smallBtn, styles.outlineBtn, rectorCargo === 'coordinador' && styles.pickerItemActive, savingColegio && { opacity: 0.6 }]}
                  onPress={() => setRectorCargo('coordinador')}
                  disabled={savingColegio}
                >
                  <View style={styles.btnRow}>
                    <Ionicons name="people-outline" size={14} color="#e5e7eb" />
                    <Text style={styles.smallBtnText}>Coordinador</Text>
                  </View>
                </TouchableOpacity>
              </View>
              {colegiosError ? <Text style={[styles.dataBullet, { color: '#fca5a5' }]}>{colegiosError}</Text> : null}
              <View style={styles.courseFormActions}>
                {isEditingColegio ? (
                  <TouchableOpacity
                    style={[styles.smallBtn, styles.outlineBtn, savingColegio && { opacity: 0.6 }]}
                    onPress={() => {
                      if (savingColegio) return;
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
                    <Text style={styles.smallBtnText}>{savingColegio ? 'Guardando...' : isEditingColegio ? 'Guardar cambios' : 'Crear'}</Text>
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
                colegiosList.map((c) => {
                  const cargoValue = (c?.rectorCargo || c?.rector?.cargo || 'rector').toLowerCase();
                  const cargoLabel = cargoValue === 'coordinador' ? 'Coordinador' : 'Rector';
                  return (
                    <View key={c.id} style={[styles.courseRow, isEditingColegio && String(colegioEditing?.id) === String(c.id) && styles.courseRowActive]}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.dataItem}>- {c.nombre || `Colegio ${c.id}`}</Text>
                        {(c.codigoDane || c.codigo_dane) ? <Text style={styles.dataBullet}>Codigo DANE: {c.codigoDane || c.codigo_dane}</Text> : null}
                        {(c.rectorNombre || c.rector_nombre || c.rectorApellido || c.rector_apellido) ? (
                          <Text style={styles.dataBullet}>
                            {cargoLabel}: {[c.rectorNombre || c.rector_nombre, c.rectorApellido || c.rector_apellido].filter(Boolean).join(' ')}
                          </Text>
                        ) : null}
                        <Text style={styles.dataBullet}>Rol: {cargoLabel.toLowerCase()}</Text>
                        {(c.rectorCorreo || c.rector_correo) ? <Text style={styles.dataBullet}>Correo {cargoLabel.toLowerCase()}: {c.rectorCorreo || c.rector_correo}</Text> : null}
                        {(c.rectorTelefono || c.rector_telefono) ? <Text style={styles.dataBullet}>Telefono {cargoLabel.toLowerCase()}: {c.rectorTelefono || c.rector_telefono}</Text> : null}
                        {(c.rectorCedula || c.rector_cedula) ? <Text style={styles.dataBullet}>Cedula {cargoLabel.toLowerCase()}: {c.rectorCedula || c.rector_cedula}</Text> : null}
                        {c.direccion ? <Text style={styles.dataBullet}>DirecciÃ³n: {c.direccion}</Text> : null}
                      </View>
                    <View style={styles.courseRowActions}>
                      <TouchableOpacity style={[styles.smallBtn, styles.updateBtn]} onPress={() => startEditColegio(c)}>
                        <View style={styles.btnRow}>
                          <Ionicons name="create-outline" size={14} color="#e5e7eb" />
                          <Text style={styles.smallBtnText}>Editar</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.smallBtn, styles.deleteBtn]} onPress={() => askDeleteColegio(c)}>
                        <View style={styles.btnRow}>
                          <Ionicons name="trash-outline" size={14} color="#e5e7eb" />
                          <Text style={styles.smallBtnText}>Eliminar</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
                })
              )}
            </View>
            </ScrollView>
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
                      <TouchableOpacity style={[styles.smallBtn, styles.deleteBtn]} onPress={() => askDeleteDocente(d)}>
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

            <Text style={styles.fieldLabel}>Selecciona colegio</Text>
            <Pressable
              style={styles.selectBoxFull}
              onPress={() => setEstudiantesColegioPickerOpen(prev => !prev)}
            >
              <Text style={styles.selectText}>
                {resolveColegioNombre(estudiantesColegioId)}
              </Text>
            </Pressable>
            {estudiantesColegioPickerOpen ? (
              <View style={styles.dropdownList}>
                {colegiosLoading ? <Text style={styles.dataBullet}>Cargando colegios...</Text> : null}
                {colegiosOptions.length === 0 ? (
                  <Text style={styles.dataBullet}>No hay colegios disponibles</Text>
                ) : (
                  colegiosOptions.map(c => (
                    <Pressable
                      key={c.id}
                      style={[styles.dropdownItem, String(estudiantesColegioId) === String(c.id) && styles.dropdownItemSelected]}
                      onPress={async () => {
                        await changeEstudiantesColegio(c.id);
                      }}
                    >
                      <Text style={styles.dataItem}>{c.nombre || `Colegio ${c.id}`}</Text>
                    </Pressable>
                  ))
                )}
              </View>
            ) : null}

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
                        setEstudianteEditing(null);
                        setEstudianteEditForm({ nombres: '', apellidos: '', qr: '', codigoEstudiante: '' });
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
                      {String(estudianteEditing) === String(e.id) ? (
                        <View style={[styles.courseForm, { marginBottom: 0 }]}>
                          <TextInput
                            style={styles.courseInput}
                            value={estudianteEditForm.nombres}
                            onChangeText={(value) => setEstudianteEditForm((prev) => ({ ...prev, nombres: value }))}
                            placeholder="Nombres"
                            placeholderTextColor="#94a3b8"
                            editable={!savingEstudianteEdit}
                          />
                          <TextInput
                            style={styles.courseInput}
                            value={estudianteEditForm.apellidos}
                            onChangeText={(value) => setEstudianteEditForm((prev) => ({ ...prev, apellidos: value }))}
                            placeholder="Apellidos"
                            placeholderTextColor="#94a3b8"
                            editable={!savingEstudianteEdit}
                          />
                          <TextInput
                            style={styles.courseInput}
                            value={estudianteEditForm.qr}
                            onChangeText={(value) => setEstudianteEditForm((prev) => ({ ...prev, qr: value }))}
                            placeholder="Codigo QR"
                            placeholderTextColor="#94a3b8"
                            editable={!savingEstudianteEdit}
                          />
                          <TextInput
                            style={styles.courseInput}
                            value={estudianteEditForm.codigoEstudiante}
                            onChangeText={(value) => setEstudianteEditForm((prev) => ({ ...prev, codigoEstudiante: value }))}
                            placeholder="Codigo del estudiante"
                            placeholderTextColor="#94a3b8"
                            editable={!savingEstudianteEdit}
                          />
                        </View>
                      ) : (
                        <>
                          <Text style={styles.dataItem}>- {e.nombre || `${e.nombres || ''} ${e.apellidos || ''}`.trim()}</Text>
                          {e.codigoEstudiante ? <Text style={styles.dataBullet}>Codigo: {e.codigoEstudiante}</Text> : null}
                          {e.qr ? <Text style={styles.dataBullet}>QR: {e.qr}</Text> : null}
                        </>
                      )}
                    </View>
                    <View style={styles.courseRowActions}>
                      {String(estudianteEditing) === String(e.id) ? (
                        <>
                          <TouchableOpacity
                            style={[styles.smallBtn, styles.outlineBtn, savingEstudianteEdit && { opacity: 0.6 }]}
                            onPress={cancelEditEstudiante}
                            disabled={savingEstudianteEdit}
                          >
                            <View style={styles.btnRow}>
                              <Ionicons name="close-outline" size={14} color="#e5e7eb" />
                              <Text style={styles.smallBtnText}>Cancelar</Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.smallBtn, styles.createBtn, savingEstudianteEdit && { opacity: 0.6 }]}
                            onPress={() => handleUpdateEstudiante(e.id)}
                            disabled={savingEstudianteEdit}
                          >
                            <View style={styles.btnRow}>
                              <Ionicons name="save-outline" size={14} color="#e5e7eb" />
                              <Text style={styles.smallBtnText}>{savingEstudianteEdit ? 'Guardando...' : 'Guardar'}</Text>
                            </View>
                          </TouchableOpacity>
                        </>
                      ) : (
                        <>
                          <TouchableOpacity style={[styles.smallBtn, styles.updateBtn]} onPress={() => startEditEstudiante(e)}>
                            <View style={styles.btnRow}>
                              <Ionicons name="create-outline" size={14} color="#e5e7eb" />
                              <Text style={styles.smallBtnText}>Actualizar</Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.smallBtn, styles.deleteBtn]} onPress={() => askDeleteEstudiante(e)}>
                            <View style={styles.btnRow}>
                              <Ionicons name="trash-outline" size={14} color="#e5e7eb" />
                              <Text style={styles.smallBtnText}>Eliminar</Text>
                            </View>
                          </TouchableOpacity>
                        </>
                      )}
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

      <Modal
        transparent
        animationType="fade"
        visible={periodStatusModal.visible}
        onRequestClose={() => {
          clearPeriodStatusTimeout();
          setPeriodStatusModal({ visible: false, message: '' });
        }}
      >
        <View style={styles.statusModalBackdrop}>
          <View style={styles.statusModalCard}>
            <Ionicons name="checkmark-circle-outline" size={22} color="#22c55e" />
            <Text style={styles.statusModalText}>{periodStatusModal.message}</Text>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="fade"
        visible={deletePeriodModal.visible}
        onRequestClose={() => setDeletePeriodModal({ visible: false, id: null })}
      >
        <View style={styles.statusModalBackdrop}>
          <View style={styles.deleteModalCard}>
            <View style={styles.deleteModalIconWrap}>
              <Ionicons name="warning-outline" size={24} color="#ef4444" />
            </View>
            <Text style={styles.deleteModalTitle}>Eliminar periodo</Text>
            <Text style={styles.deleteModalText}>Esta accion no se puede deshacer. Se reorganizaran los periodos restantes.</Text>
            <View style={styles.deleteModalActions}>
              <TouchableOpacity
                style={styles.deleteModalCancelBtn}
                onPress={() => setDeletePeriodModal({ visible: false, id: null })}
              >
                <Text style={styles.deleteModalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteModalConfirmBtn}
                onPress={() => handleDeletePeriod(deletePeriodModal.id)}
              >
                <Text style={styles.deleteModalConfirmText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="fade"
        visible={deleteColegioModal.visible}
        onRequestClose={() => setDeleteColegioModal({ visible: false, colegio: null })}
      >
        <View style={styles.statusModalBackdrop}>
          <View style={styles.deleteModalCard}>
            <View style={styles.deleteModalIconWrap}>
              <Ionicons name="warning-outline" size={24} color="#ef4444" />
            </View>
            <Text style={styles.deleteModalTitle}>Eliminar colegio</Text>
            <Text style={styles.deleteModalText}>
              Vas a eliminar "{deleteColegioModal?.colegio?.nombre || 'este colegio'}". Esta accion no se puede deshacer.
            </Text>
            <View style={styles.deleteModalActions}>
              <TouchableOpacity
                style={styles.deleteModalCancelBtn}
                onPress={() => setDeleteColegioModal({ visible: false, colegio: null })}
              >
                <Text style={styles.deleteModalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteModalConfirmBtn}
                onPress={() => handleDeleteColegio(deleteColegioModal.colegio)}
              >
                <Text style={styles.deleteModalConfirmText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="fade"
        visible={deleteCursoModal.visible}
        onRequestClose={() => setDeleteCursoModal({ visible: false, curso: null })}
      >
        <View style={styles.statusModalBackdrop}>
          <View style={styles.deleteModalCard}>
            <View style={styles.deleteModalIconWrap}>
              <Ionicons name="warning-outline" size={24} color="#ef4444" />
            </View>
            <Text style={styles.deleteModalTitle}>Eliminar curso</Text>
            <Text style={styles.deleteModalText}>
              Vas a eliminar "{deleteCursoModal?.curso?.nombre || 'este curso'}". Esta accion no se puede deshacer.
            </Text>
            <View style={styles.deleteModalActions}>
              <TouchableOpacity
                style={styles.deleteModalCancelBtn}
                onPress={() => setDeleteCursoModal({ visible: false, curso: null })}
              >
                <Text style={styles.deleteModalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteModalConfirmBtn}
                onPress={() => handleDeleteCurso(deleteCursoModal.curso)}
              >
                <Text style={styles.deleteModalConfirmText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="fade"
        visible={deleteDocenteModal.visible}
        onRequestClose={() => setDeleteDocenteModal({ visible: false, docente: null })}
      >
        <View style={styles.statusModalBackdrop}>
          <View style={styles.deleteModalCard}>
            <View style={styles.deleteModalIconWrap}>
              <Ionicons name="warning-outline" size={24} color="#ef4444" />
            </View>
            <Text style={styles.deleteModalTitle}>Eliminar docente</Text>
            <Text style={styles.deleteModalText}>
              Vas a eliminar "{deleteDocenteModal?.docente?.nombre || deleteDocenteModal?.docente?.email || 'este docente'}". Esta accion no se puede deshacer.
            </Text>
            <View style={styles.deleteModalActions}>
              <TouchableOpacity
                style={styles.deleteModalCancelBtn}
                onPress={() => setDeleteDocenteModal({ visible: false, docente: null })}
              >
                <Text style={styles.deleteModalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteModalConfirmBtn}
                onPress={() => handleDeleteDocente(deleteDocenteModal.docente)}
              >
                <Text style={styles.deleteModalConfirmText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="fade"
        visible={daneExistsModal.visible}
        onRequestClose={() => setDaneExistsModal({ visible: false, message: '' })}
      >
        <View style={styles.statusModalBackdrop}>
          <View style={styles.deleteModalCard}>
            <View style={styles.deleteModalIconWrap}>
              <Ionicons name="alert-circle-outline" size={24} color="#ef4444" />
            </View>
            <Text style={styles.deleteModalTitle}>Codigo DANE duplicado</Text>
            <Text style={styles.deleteModalText}>{daneExistsModal.message}</Text>
            <View style={styles.deleteModalActions}>
              <TouchableOpacity
                style={styles.deleteModalConfirmBtn}
                onPress={() => setDaneExistsModal({ visible: false, message: '' })}
              >
                <Text style={styles.deleteModalConfirmText}>Entendido</Text>
              </TouchableOpacity>
            </View>
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
  actionBtnFull: { flexBasis: '100%' },
  actionBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  actionBtnTextCompact: { fontSize: 13, flexShrink: 1, textAlign: 'center' },
  periodBtn: { marginTop: 10, borderRadius: 14, paddingVertical: 14, alignItems: 'center', backgroundColor: '#7c3aed', shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 4 }, shadowRadius: 6, elevation: 3 },
  periodBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  feedbackSuccess: { color: '#bbf7d0', fontWeight: '700', fontSize: 13, marginTop: 6 },
  feedbackError: { color: '#fecaca', fontWeight: '700', fontSize: 13, marginTop: 6 },
  statusModalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  statusModalCard: { minWidth: 260, maxWidth: '90%', borderRadius: 14, paddingVertical: 16, paddingHorizontal: 18, backgroundColor: '#0f172a', borderWidth: 1, borderColor: 'rgba(34,197,94,0.45)', flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusModalText: { color: '#dcfce7', fontWeight: '800', fontSize: 16 },
  deleteModalCard: { width: '100%', maxWidth: 360, borderRadius: 16, padding: 18, backgroundColor: '#111827', borderWidth: 1, borderColor: 'rgba(239,68,68,0.45)', alignItems: 'center' },
  deleteModalIconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(239,68,68,0.15)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.45)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  deleteModalTitle: { color: '#fee2e2', fontWeight: '900', fontSize: 18, marginBottom: 6 },
  deleteModalText: { color: '#fecaca', textAlign: 'center', fontSize: 13, lineHeight: 18 },
  deleteModalActions: { flexDirection: 'row', gap: 10, marginTop: 16, width: '100%' },
  deleteModalCancelBtn: { flex: 1, borderRadius: 10, paddingVertical: 11, alignItems: 'center', backgroundColor: 'rgba(148,163,184,0.15)', borderWidth: 1, borderColor: 'rgba(148,163,184,0.35)' },
  deleteModalConfirmBtn: { flex: 1, borderRadius: 10, paddingVertical: 11, alignItems: 'center', backgroundColor: '#dc2626', borderWidth: 1, borderColor: '#ef4444' },
  deleteModalCancelText: { color: '#e2e8f0', fontWeight: '800' },
  deleteModalConfirmText: { color: '#fff', fontWeight: '900' },
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
  passwordInputWrap: { position: 'relative', justifyContent: 'center' },
  passwordInput: { paddingRight: 44 },
  passwordEyeBtn: {
    position: 'absolute',
    right: 10,
    height: 28,
    width: 28,
    alignItems: 'center',
    justifyContent: 'center'
  },
  courseFormActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  outlineBtn: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)', backgroundColor: 'transparent' },
  createBtn: { backgroundColor: 'rgba(16,185,129,0.25)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.6)' },
  courseRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  courseRowActive: { backgroundColor: 'rgba(56,189,248,0.08)', borderRadius: 10, paddingHorizontal: 8 },
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




