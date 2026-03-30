import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, Modal, Pressable, TextInput, Platform } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
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
  const [docentesSearchTerm, setDocentesSearchTerm] = useState('');
  const [docentesSearchOpen, setDocentesSearchOpen] = useState(false);
  const [colegioSeleccionado, setColegioSeleccionado] = useState(null);
  const [colegiosOptions, setColegiosOptions] = useState([]);
  const [colegioPickerOpen, setColegioPickerOpen] = useState(false);
  const [colegiosLoading, setColegiosLoading] = useState(false);
  const [colegiosModalVisible, setColegiosModalVisible] = useState(false);
  const [colegiosListModalVisible, setColegiosListModalVisible] = useState(false);
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
  const [docenteCrudListModalVisible, setDocenteCrudListModalVisible] = useState(false);
  const [docenteForm, setDocenteForm] = useState({ nombre: '', email: '', password: '' });
  const [docenteCursos, setDocenteCursos] = useState([]);
  const [docenteCursosDisponibles, setDocenteCursosDisponibles] = useState([]);
  const [docenteColegioId, setDocenteColegioId] = useState(null);
  const [docenteEditing, setDocenteEditing] = useState(null);
  const [savingDocente, setSavingDocente] = useState(false);
  const [docenteError, setDocenteError] = useState('');
  const [docenteMateriasDraft, setDocenteMateriasDraft] = useState({});
  const [deleteDocenteModal, setDeleteDocenteModal] = useState({ visible: false, docente: null });
  const [docentePerfilCursos, setDocentePerfilCursos] = useState([]);
  const [docentePerfilLoading, setDocentePerfilLoading] = useState(false);
  const [docentePerfilError, setDocentePerfilError] = useState('');
  const docenteCrudSchoolRef = useRef(null);
  const docenteMateriasDraftRef = useRef({});
  const colegiosScrollRef = useRef(null);
  const createDefaultPeriodForm = (periodList = periodos) => {
    const getComparableDateKey = (value) => {
      const text = String(value || '').trim();
      const match = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (match) return Number(`${match[1]}${match[2]}${match[3]}`);
      const parsed = new Date(text);
      if (!Number.isFinite(parsed.getTime())) return 0;
      const year = parsed.getUTCFullYear();
      const month = String(parsed.getUTCMonth() + 1).padStart(2, '0');
      const day = String(parsed.getUTCDate()).padStart(2, '0');
      return Number(`${year}${month}${day}`);
    };
    const safePeriodList = Array.isArray(periodList) ? periodList : [];
    const latestPeriodo = safePeriodList.length > 0
      ? safePeriodList.reduce((latest, current) => {
          const latestEnd = getComparableDateKey(latest?.fechaFin);
          const currentEnd = getComparableDateKey(current?.fechaFin);
          return currentEnd > latestEnd ? current : latest;
        }, safePeriodList[0])
      : null;
    const latestDateMatch = String(latestPeriodo?.fechaFin || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
    const now = latestDateMatch
      ? new Date(Number(latestDateMatch[1]), Number(latestDateMatch[2]) - 1, Number(latestDateMatch[3]))
      : new Date();
    if (latestPeriodo?.fechaFin) now.setDate(now.getDate() + 1);
    const end = new Date(now);
    end.setDate(end.getDate() + 30);
    return {
      nombre: `Periodo ${safePeriodList.length + 1 || 1}`,
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
  const normalizeColegioItem = (colegio = {}) => {
    const rectorSource = colegio?.rector || {};
    const rector = {
      cargo: colegio?.rectorCargo || rectorSource?.cargo || null,
      nombre: colegio?.rectorNombre || colegio?.rector_nombre || rectorSource?.nombre || null,
      apellido: colegio?.rectorApellido || colegio?.rector_apellido || rectorSource?.apellido || null,
      correo: colegio?.rectorCorreo || colegio?.rector_correo || rectorSource?.correo || null,
      telefono: colegio?.rectorTelefono || colegio?.rector_telefono || rectorSource?.telefono || null,
      cedula: colegio?.rectorCedula || colegio?.rector_cedula || rectorSource?.cedula || null
    };
    return {
      ...colegio,
      codigoDane: colegio?.codigoDane || colegio?.codigo_dane || '',
      rector,
      rectorCargo: rector.cargo || 'rector',
      rectorNombre: rector.nombre || '',
      rectorApellido: rector.apellido || '',
      rectorCorreo: rector.correo || '',
      rectorTelefono: rector.telefono || '',
      rectorCedula: rector.cedula || '',
      rectorTienePassword: Boolean(colegio?.rectorTienePassword)
    };
  };
  const normalizeSearchText = (value = '') => String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

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
    if (!iso) return { day: 1, month: 1, year: currentYear, hour: 0, minute: 0, second: 0 };
    const text = String(iso || '').trim();
    const match = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?/);
    if (match) {
      const [, yearRaw, monthRaw, dayRaw, hourRaw = '00', minuteRaw = '00', secondRaw = '00'] = match;
      const year = parseInt(yearRaw, 10);
      const month = parseInt(monthRaw, 10);
      const day = parseInt(dayRaw, 10);
      const hour = parseInt(hourRaw, 10);
      const minute = parseInt(minuteRaw, 10);
      const second = parseInt(secondRaw, 10);
      return {
        day: Number.isFinite(day) ? day : 1,
        month: Number.isFinite(month) ? month : 1,
        year: Number.isFinite(year) ? year : currentYear,
        hour: Number.isFinite(hour) ? hour : 0,
        minute: Number.isFinite(minute) ? minute : 0,
        second: Number.isFinite(second) ? second : 0
      };
    }

    const parsed = new Date(text);
    if (!Number.isFinite(parsed.getTime())) {
      return { day: 1, month: 1, year: currentYear, hour: 0, minute: 0, second: 0 };
    }
    return {
      day: parsed.getUTCDate(),
      month: parsed.getUTCMonth() + 1,
      year: parsed.getUTCFullYear(),
      hour: parsed.getUTCHours(),
      minute: parsed.getUTCMinutes(),
      second: parsed.getUTCSeconds()
    };
  };

  const buildDate = ({ day, month, year, hour = 0, minute = 0 }) => {
    const d = String(day).padStart(2, '0');
    const m = String(month).padStart(2, '0');
    const h = String(hour).padStart(2, '0');
    const min = String(minute).padStart(2, '0');
    return `${year}-${m}-${d}T${h}:${min}:00`;
  };

  const formatPeriodDate = (iso) => {
    const { day, month, year } = parseDateParts(iso);
    const monthLabel = monthNames[month - 1] || '';
    return `${day} de ${monthLabel} de ${year}`;
  };

  const formatPeriodTime = (iso) => {
    const { hour, minute } = parseDateParts(iso);
    const hour24 = Number.isFinite(hour) ? hour : 0;
    const minuteValue = Number.isFinite(minute) ? minute : 0;
    const meridiem = hour24 >= 12 ? 'p. m.' : 'a. m.';
    const hour12 = hour24 % 12 || 12;
    return `${String(hour12).padStart(2, '0')}:${String(minuteValue).padStart(2, '0')} ${meridiem}`;
  };

  const formatPeriodSummary = (fechaInicio, fechaFin) => `Del ${formatPeriodDate(fechaInicio)} al ${formatPeriodDate(fechaFin)}`;

  const getPeriodDurationLabel = (fechaInicio, fechaFin) => {
    const inicio = parseDateParts(fechaInicio);
    const fin = parseDateParts(fechaFin);
    const startDate = new Date(inicio.year, inicio.month - 1, inicio.day);
    const endDate = new Date(fin.year, fin.month - 1, fin.day);
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return '';
    const diffDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const safeDays = diffDays > 0 ? diffDays : 1;
    return `${safeDays} ${safeDays === 1 ? 'día' : 'días'}`;
  };

  const getPeriodoComparableValue = (value) => {
    if (value instanceof Date) {
      const year = value.getUTCFullYear();
      const month = String(value.getUTCMonth() + 1).padStart(2, '0');
      const day = String(value.getUTCDate()).padStart(2, '0');
      const hour = String(value.getUTCHours()).padStart(2, '0');
      const minute = String(value.getUTCMinutes()).padStart(2, '0');
      const second = String(value.getUTCSeconds()).padStart(2, '0');
      return Number(`${year}${month}${day}${hour}${minute}${second}`);
    }

    const text = String(value || '').trim();
    const match = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?/);
    if (match) {
      const [, year, month, day, hour = '00', minute = '00', second = '00'] = match;
      return Number(`${year}${month}${day}${hour}${minute}${second}`);
    }

    const parsed = new Date(text);
    if (!Number.isFinite(parsed.getTime())) return Number.NaN;
    return getPeriodoComparableValue(parsed);
  };

  const getPeriodoRangeError = (fechaInicio, fechaFin) => {
    const startValue = getPeriodoComparableValue(fechaInicio);
    const endValue = getPeriodoComparableValue(fechaFin);
    if (!Number.isFinite(startValue) || !Number.isFinite(endValue)) return 'Las fechas del periodo no son validas';
    if (startValue >= endValue) return 'La fecha de inicio debe ser anterior a la fecha de fin';
    return '';
  };

  const getPeriodoSequenceError = (fechaInicio, fechaFin) => {
    const startValue = getPeriodoComparableValue(fechaInicio);
    const endValue = getPeriodoComparableValue(fechaFin);
    if (!Number.isFinite(startValue) || !Number.isFinite(endValue)) return '';

    const otherPeriodos = (periodos || []).filter((item) => String(item?.id) !== String(editingPeriodo?.id || ''));
    if (!otherPeriodos.length) return '';

    const overlapping = otherPeriodos.find((item) => {
      const itemStart = getPeriodoComparableValue(item?.fechaInicio);
      const itemEnd = getPeriodoComparableValue(item?.fechaFin);
      return startValue <= itemEnd && endValue >= itemStart;
    });
    if (overlapping) {
      return `Las fechas se cruzan con ${overlapping.nombre}. Un periodo posterior debe iniciar despues de que termine el anterior`;
    }

    if (!editingPeriodo) {
      const latestPeriodo = otherPeriodos.reduce((latest, current) => {
        const latestEnd = getPeriodoComparableValue(latest?.fechaFin);
        const currentEnd = getPeriodoComparableValue(current?.fechaFin);
        return currentEnd > latestEnd ? current : latest;
      }, otherPeriodos[0]);
      const latestEnd = getPeriodoComparableValue(latestPeriodo?.fechaFin);
      if (startValue <= latestEnd) {
        return `El nuevo periodo debe iniciar despues de que termine ${latestPeriodo?.nombre || 'el ultimo periodo registrado'}`;
      }
    }

    return '';
  };

  const loadPeriodos = async () => {
    try {
      const data = await getPeriodos();
      const ordered = sortPeriodos(data);
      setPeriodos(ordered);
      return ordered;
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.error || 'No se pudieron cargar los periodos');
      return [];
    }
  };

  useEffect(() => { loadPeriodos(); }, []);
  useEffect(() => () => clearPeriodStatusTimeout(), []);

  const sortPeriodos = (list) => [...(list || [])].sort((a, b) => {
    const aDate = getPeriodoComparableValue(a?.fechaInicio);
    const bDate = getPeriodoComparableValue(b?.fechaInicio);
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
        startDay: ini.day, startMonth: ini.month, startYear: ini.year, startHour: ini.hour, startMinute: ini.minute,
        endDay: fin.day, endMonth: fin.month, endYear: fin.year, endHour: fin.hour, endMinute: fin.minute
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
    const rangeError = getPeriodoRangeError(payload.fechaInicio, payload.fechaFin);
    if (rangeError) {
      setPeriodFeedback({ type: 'error', message: rangeError });
      Alert.alert('Error', rangeError);
      return;
    }
    const sequenceError = getPeriodoSequenceError(payload.fechaInicio, payload.fechaFin);
    if (sequenceError) {
      setPeriodFeedback({ type: 'error', message: sequenceError });
      Alert.alert('Error', sequenceError);
      return;
    }
    setPeriodFeedback({ type: '', message: '' });
    setSavingPeriodo(true);
    try {
      if (editingPeriodo) {
        await updatePeriodo(editingPeriodo.id, payload);
        const loaded = await loadPeriodos();
        showPeriodStatusModal('Periodo actualizado');
        setEditingPeriodo(null);
        setPeriodForm(createDefaultPeriodForm(loaded));
      } else {
        await createPeriodo(payload);
        const loaded = await loadPeriodos();
        showPeriodStatusModal('Periodo creado');
        setPeriodForm(createDefaultPeriodForm(loaded));
      }
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
      setEditingPeriodo(null);
      setPeriodForm(createDefaultPeriodForm(finalList));
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
    const ordered = sortCursosForDisplay(cursos);
    setCursosAsignados(ordered);
    return ordered;
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
    setColegiosListModalVisible(false);
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
    const normalized = normalizeColegioItem(colegio);
    setColegiosListModalVisible(false);
    setColegioEditing(normalized);
    setColegioNombre(normalized?.nombre || '');
    setColegioCodigoDane(normalized?.codigoDane || '');
    setRectorNombre(normalized?.rectorNombre || '');
    setRectorApellido(normalized?.rectorApellido || '');
    setRectorCorreo(normalized?.rectorCorreo || '');
    setRectorTelefono(normalized?.rectorTelefono || '');
    setRectorCedula(normalized?.rectorCedula || '');
    setRectorCargo((normalized?.rectorCargo || 'rector') === 'coordinador' ? 'coordinador' : 'rector');
    setRectorPassword('');
    setShowRectorPassword(false);
    setHasRectorPassword(Boolean(normalized?.rectorTienePassword));
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

  const openColegiosListModal = async () => {
    await loadColegios();
    setColegiosListModalVisible(true);
  };

  const closeColegiosListModal = () => {
    setColegiosListModalVisible(false);
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

  const loadDocentePerfilMaterias = async () => {
    if (!isDocente || !user?.schoolId) {
      setDocentePerfilCursos([]);
      setDocentePerfilError('');
      return;
    }

    setDocentePerfilLoading(true);
    setDocentePerfilError('');
    try {
      const data = await getDocentes({ schoolId: user.schoolId });
      const byId = (data || []).find((docente) => String(docente?.id) === String(user?.id));
      const byEmail = (data || []).find(
        (docente) => String(docente?.email || '').toLowerCase() === String(user?.email || '').toLowerCase()
      );
      const currentDocente = byId || byEmail || null;
      setDocentePerfilCursos(Array.isArray(currentDocente?.cursos) ? currentDocente.cursos : []);
    } catch (e) {
      setDocentePerfilCursos([]);
      setDocentePerfilError(e?.response?.data?.error || e?.message || 'No se pudieron cargar tus materias');
    } finally {
      setDocentePerfilLoading(false);
    }
  };

  useEffect(() => {
    if (!isDocente) {
      setDocentePerfilCursos([]);
      setDocentePerfilError('');
      return;
    }
    loadDocentePerfilMaterias();
  }, [isDocente, user?.id, user?.email, user?.schoolId]);

  useFocusEffect(
    React.useCallback(() => {
      if (!isDocente) return undefined;
      loadDocentePerfilMaterias();
      return undefined;
    }, [isDocente, user?.id, user?.email, user?.schoolId])
  );

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
    docenteMateriasDraftRef.current = {};
    setDocenteMateriasDraft({});
    setDocenteCursosDisponibles([]);
    setDocenteColegioId(user?.schoolId || null);
    setDocenteError('');
    setColegioPickerOpen(false);
    setColegiosOptions(user?.schoolId ? [{ id: user.schoolId, nombre: user?.schoolName || `Colegio ${user.schoolId}` }] : []);
    setDocenteCrudModalVisible(true);
    setLoadingCursos(true);
    try {
      const colegios = await loadColegios({ preferId: user?.schoolId, preferName: user?.schoolName });
      const defaultSchool = user?.schoolId || colegioSeleccionado || colegios?.[0]?.id || null;
      setDocenteColegioId(defaultSchool);
      docenteCrudSchoolRef.current = Number(defaultSchool) || null;
      await Promise.all([loadCursosDisponiblesDocente(defaultSchool), loadDocentesActual(defaultSchool)]);
    } finally {
      setLoadingCursos(false);
    }
  };

  const closeDocenteCrudModal = () => {
    setDocenteCrudModalVisible(false);
    setDocenteCrudListModalVisible(false);
    setDocenteEditing(null);
    setDocenteForm({ nombre: '', email: '', password: '' });
    setDocenteCursos([]);
    docenteMateriasDraftRef.current = {};
    setDocenteMateriasDraft({});
    setDocenteCursosDisponibles([]);
    setDocenteColegioId(null);
    setDocenteError('');
    docenteCrudSchoolRef.current = null;
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
    setDocenteEditing(null);
    setDocenteForm({ nombre: '', email: '', password: '' });
    setDocenteCursos([]);
    docenteMateriasDraftRef.current = {};
    setDocenteMateriasDraft({});
    setDocenteCursosDisponibles([]);
    setDocenteError('');
  };

  const openDocenteCrudListModal = async () => {
    const targetSchoolId = Number(docenteColegioId || user?.schoolId);
    if (Number.isFinite(targetSchoolId) && targetSchoolId > 0) {
      await loadDocentesActual(targetSchoolId);
    }
    setDocenteCrudListModalVisible(true);
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
  }, [docenteCrudModalVisible, docenteColegioId]);

  const setDocenteMateriasState = (nextValue) => {
    docenteMateriasDraftRef.current = nextValue;
    setDocenteMateriasDraft(nextValue);
  };

  const docenteNombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+(?:\s+[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*$/;
  const sanitizeDocenteNombreInput = (value = '') => String(value || '')
    .replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/^\s+/g, '');
  const normalizeDocenteEmailInput = (value = '') => String(value || '')
    .replace(/\s+/g, '')
    .toLowerCase();

  const buildDocenteMateriasDraft = (cursos = []) => {
    const nextValue = {};
    (cursos || []).forEach((curso) => {
      nextValue[curso.id] = Array.isArray(curso?.materias) ? curso.materias.join(', ') : '';
    });
    return nextValue;
  };

  const syncDocenteMateriasWithCursos = (cursoIds = [], sourceDraft = docenteMateriasDraftRef.current) => {
    const nextValue = {};
    (cursoIds || [])
      .map((id) => Number(id))
      .filter((id) => Number.isInteger(id) && id > 0)
      .forEach((cursoId) => {
        nextValue[cursoId] = sourceDraft?.[cursoId] || '';
      });
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

  const parseMateriasTexto = (value) => Array.from(
    new Set(
      String(value || '')
        .split(/[,\n]+/)
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );

  const buildMateriasPorCursoPayload = (cursoIds = docenteCursos) => {
    const payload = {};
    (cursoIds || [])
      .map((id) => Number(id))
      .filter((id) => Number.isInteger(id) && id > 0)
      .forEach((cursoId) => {
        payload[cursoId] = parseMateriasTexto(docenteMateriasDraftRef.current?.[cursoId]);
      });
    return payload;
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
      const cursosAsignados = (docente.cursos || []).map((c) => c.id);
      const materiasDraft = buildDocenteMateriasDraft(docente.cursos || []);
      setDocenteCursos(cursosAsignados);
      syncDocenteMateriasWithCursos(cursosAsignados, materiasDraft);
    } finally {
      setLoadingCursos(false);
    }
  };

  const handleSaveDocente = async () => {
    const editingDocenteSnapshot = docenteEditing;
    const editingDocenteId = Number(editingDocenteSnapshot?.id);
    const isEditingDocente = Number.isInteger(editingDocenteId) && editingDocenteId > 0;
    await flushActiveInputBeforeDocenteSave();
    const selectedCursoIds = [...docenteCursos];
    const nombreInput = docenteForm.nombre.trim();
    const email = normalizeDocenteEmailInput(docenteForm.email);
    const password = docenteForm.password;
    const nombre = nombreInput;

    setDocenteError('');

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
    const payload = {
      nombre,
      email,
      cursoIds: selectedCursoIds,
      schoolId: docenteColegioId || user?.schoolId,
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
        const cursosActualizados = (savedDocente?.cursos || []).map((curso) => curso.id);
        const materiasDraft = buildDocenteMateriasDraft(savedDocente?.cursos || []);
        setDocenteEditing(savedDocente || editingDocenteSnapshot);
        setDocenteCursos(cursosActualizados.length ? cursosActualizados : selectedCursoIds);
        syncDocenteMateriasWithCursos(cursosActualizados.length ? cursosActualizados : selectedCursoIds, materiasDraft);
        showPeriodStatusModal('Docente actualizado');
        await returnToDocenteCrudListModal(payload.schoolId);
      } else {
        setDocenteForm({ nombre: '', email: '', password: '' });
        setDocenteCursos([]);
        setDocenteMateriasState({});
        setDocenteEditing(null);
        showPeriodStatusModal('Docente creado');
      }
      return savedDocente;
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
      if (String(docenteEditing?.id) === String(docente.id)) {
        setDocenteEditing(null);
        setDocenteForm({ nombre: '', email: '', password: '' });
        setDocenteCursos([]);
        setDocenteMateriasState({});
        setDocenteError('');
      }
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
      const normalized = (data || []).map(normalizeColegioItem);
      setColegiosList(normalized);
      const mapped = normalized.map(c => ({ id: c.id, nombre: c.nombre || `Colegio ${c.id}` }));
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
    setDocentesSearchTerm('');
    setDocentesSearchOpen(false);
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
    setDocentesSearchTerm('');
    setDocentesSearchOpen(false);
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
    setDocentesSearchTerm('');
    setDocentesSearchOpen(false);
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
  const docentesSearchNormalized = normalizeSearchText(docentesSearchTerm);
  const docentesFiltrados = docentesSearchNormalized
    ? docentes.filter((docente) => normalizeSearchText(docente?.nombre || '').includes(docentesSearchNormalized))
    : docentes;
  const docentesSearchSuggestions = docentesSearchNormalized
    ? docentesFiltrados.slice(0, 6)
    : [];

  const resolveColegioNombre = (id) => {
    if (!id) return 'Selecciona colegio';
    return colegiosOptions.find(c => String(c.id) === String(id))?.nombre || `Colegio ${id}`;
  };

  const sortCursosForDisplay = (items = []) => [...items].sort((a, b) => {
    const aName = String(a?.nombre || '').trim();
    const bName = String(b?.nombre || '').trim();
    return aName.localeCompare(bName, undefined, { numeric: true, sensitivity: 'base' });
  });

  const colegioSeleccionadoNombre = resolveColegioNombre(colegioSeleccionado);

  return (
    <ScreenBackground contentStyle={styles.content}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.mainColumn}>
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
              {!isAdmin ? (
                <>
                  <View style={styles.infoDivider} />
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Colegio</Text>
                    <Text style={styles.infoValue}>{user?.schoolName || user?.schoolId || 'No asignado'}</Text>
                  </View>
                </>
              ) : null}
            </View>
          </View>

          <View style={[styles.actionGrid, isRectorCoordinador && styles.actionGridRector]}>
            {isDocente ? (
              <>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#22c55e' }]} onPress={() => navigation.navigate('QR', { scanMode: 'all' })}>
                  <View style={styles.btnRow}>
                    <Ionicons name="qr-code-outline" size={18} color="#fff" />
                    <Text style={styles.actionBtnText}>Escanear QR</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#f59e0b' }]} onPress={() => navigation.navigate('QR', { scanMode: 'absent-only' })}>
                  <View style={styles.btnRow}>
                    <Ionicons name="scan-outline" size={18} color="#fff" />
                    <Text style={[styles.actionBtnText, styles.actionBtnTextCompact]}>Escanear ausentes</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#a78bfa' }]} onPress={openEstudiantesModal}>
                  <View style={styles.btnRow}>
                    <Ionicons name="people-outline" size={18} color="#fff" />
                    <Text style={[styles.actionBtnText, styles.actionBtnTextCompact]}>Ver estudiantes</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#0ea5e9' }]} onPress={openCreateEstudianteModal}>
                  <View style={styles.btnRow}>
                    <Ionicons name="person-add-outline" size={18} color="#fff" />
                    <Text style={[styles.actionBtnText, styles.actionBtnTextCompact]}>Agregar estudiantes</Text>
                  </View>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {!isAdmin && !isRectorCoordinador ? (
                  <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#22c55e' }]} onPress={() => navigation.navigate('QR', { scanMode: 'all' })}>
                    <View style={styles.btnRow}>
                      <Ionicons name="qr-code-outline" size={18} color="#fff" />
                      <Text style={styles.actionBtnText}>Escanear QR</Text>
                    </View>
                  </TouchableOpacity>
                ) : null}
                {canManageCourses ? (
                  <TouchableOpacity style={[styles.actionBtn, isRectorCoordinador && styles.actionBtnRector, { backgroundColor: '#38bdf8' }]} onPress={openCursosModal}>
                    <View style={styles.btnRow}>
                      <Ionicons name="book-outline" size={18} color="#fff" />
                      <Text style={[styles.actionBtnText, isRectorCoordinador && styles.actionBtnTextCompact]}>{isRectorCoordinador ? 'Gestionar cursos' : 'Crear cursos'}</Text>
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
                  <TouchableOpacity style={[styles.actionBtn, isRectorCoordinador && styles.actionBtnRector, { backgroundColor: '#14b8a6' }]} onPress={openDocenteCrudModal}>
                    <View style={styles.btnRow}>
                      <Ionicons name="person-add-outline" size={18} color="#fff" />
                      <Text style={[styles.actionBtnText, isRectorCoordinador && styles.actionBtnTextCompact]}>{isRectorCoordinador ? 'Gestionar docentes' : 'Crear docentes'}</Text>
                    </View>
                  </TouchableOpacity>
                ) : null}
                {isRectorCoordinador ? (
                  <TouchableOpacity style={[styles.actionBtn, styles.actionBtnRector, { backgroundColor: '#2563eb' }]} onPress={openDocentesModal}>
                    <View style={styles.btnRow}>
                      <Ionicons name="people-outline" size={18} color="#fff" />
                      <Text style={[styles.actionBtnText, styles.actionBtnTextCompact]}>Ver docentes</Text>
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
                {isRectorCoordinador && canManagePeriods ? (
                  <TouchableOpacity style={[styles.actionBtn, styles.actionBtnRector, { backgroundColor: '#7c3aed' }]} onPress={() => openPeriodModal()}>
                    <View style={styles.btnRow}>
                      <Ionicons name="calendar-outline" size={18} color="#fff" />
                      <Text style={[styles.actionBtnText, styles.actionBtnTextCompact]}>Gestionar periodos</Text>
                    </View>
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity style={[styles.actionBtn, isRectorCoordinador && styles.actionBtnRector, { backgroundColor: '#f97316' }]} onPress={() => openQuickModal('reportes')}>
                  <View style={styles.btnRow}>
                    <Ionicons name="bar-chart-outline" size={18} color="#fff" />
                    <Text style={[styles.actionBtnText, isRectorCoordinador && styles.actionBtnTextCompact]}>{isRectorCoordinador ? 'Ver reportes' : 'Reportes'}</Text>
                  </View>
                </TouchableOpacity>
                {isRectorCoordinador ? (
                  <TouchableOpacity style={[styles.actionBtn, styles.actionBtnRector, styles.logoutActionBtn]} onPress={logout} activeOpacity={0.85}>
                    <View style={styles.btnRow}>
                      <Ionicons name="log-out-outline" size={18} color="#fff" />
                      <Text style={[styles.actionBtnText, styles.actionBtnTextCompact]}>Cerrar sesion</Text>
                    </View>
                  </TouchableOpacity>
                ) : null}
                {!isRectorCoordinador && canManagePeriods ? (
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

          {isDocente ? (
            <View style={styles.dataBox}>
              <View style={styles.courseActionsRow}>
                <Text style={styles.dataTitle}>Mis cursos y materias</Text>
                {docentePerfilLoading ? <Text style={styles.dataBullet}>Cargando...</Text> : null}
              </View>
              {docentePerfilError ? <Text style={[styles.dataBullet, { color: '#fca5a5' }]}>{docentePerfilError}</Text> : null}
              {!docentePerfilLoading && !docentePerfilError && docentePerfilCursos.length === 0 ? (
                <Text style={styles.dataBullet}>No tienes materias asignadas</Text>
              ) : (
                docentePerfilCursos.map((curso) => (
                  <View key={`mis-materias-${curso.id}`} style={{ gap: 2, marginBottom: 6 }}>
                    <Text style={styles.dataItem}>Curso: {curso.nombre || `Curso ${curso.id}`}</Text>
                    {Array.isArray(curso.materias) && curso.materias.length > 0 ? (
                      <Text style={styles.dataBullet}>Materias: {curso.materias.join(', ')}</Text>
                    ) : (
                      <Text style={styles.dataBullet}>Materias: sin asignar</Text>
                    )}
                  </View>
                ))
              )}
            </View>
          ) : null}

          {!isRectorCoordinador ? (
            <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.85}>
              <View style={styles.btnRow}>
                <Ionicons name="log-out-outline" size={18} color="#fff" />
                <Text style={styles.logoutText}>Cerrar sesion</Text>
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>

      <Modal
        transparent
        animationType="slide"
        visible={estudianteCreateModalVisible}
        onRequestClose={closeCreateEstudianteModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, styles.sharedActionModalCard]}>
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
          <View style={[styles.modalCard, styles.periodModalCard]}>
            <ScrollView contentContainerStyle={[styles.modalContent, styles.periodModalContent]} showsVerticalScrollIndicator={false}>
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

              <TouchableOpacity style={[styles.periodBtn, styles.periodSaveBtn, savingPeriodo && { opacity: 0.6 }]} onPress={handleSavePeriod} disabled={savingPeriodo}>
                <View style={styles.btnRow}>
                  <Ionicons name="save-outline" size={14} color="#fff" />
                  <Text style={[styles.periodBtnText, styles.periodSaveBtnText]}>{savingPeriodo ? 'Guardando...' : editingPeriodo ? 'Actualizar periodo' : 'Guardar periodo'}</Text>
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
                <View key={p.id} style={[styles.periodItemRow, styles.periodCard]}>
                  <View style={styles.periodContent}>
                    <View style={styles.periodHeadingRow}>
                      <Text style={styles.periodName}>{p.nombre}</Text>
                    </View>
                    <Text style={styles.periodRange}>{formatPeriodSummary(p.fechaInicio, p.fechaFin)}</Text>
                    <View style={styles.periodDateGrid}>
                      <View style={styles.periodDateCard}>
                        <Text style={styles.periodDateLabel}>Inicio</Text>
                        <Text style={styles.periodDateValue}>{formatPeriodDate(p.fechaInicio)}</Text>
                        <Text style={styles.periodDateTime}>Hora: {formatPeriodTime(p.fechaInicio)}</Text>
                      </View>
                      <View style={styles.periodDateCard}>
                        <Text style={styles.periodDateLabel}>Fin</Text>
                        <Text style={styles.periodDateValue}>{formatPeriodDate(p.fechaFin)}</Text>
                        <Text style={styles.periodDateTime}>Hora: {formatPeriodTime(p.fechaFin)}</Text>
                      </View>
                    </View>
                    <View style={styles.periodFooterRow}>
                      <View style={styles.periodDurationChip}>
                        <Text style={styles.periodDurationText}>{getPeriodDurationLabel(p.fechaInicio, p.fechaFin)}</Text>
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
                    {p.actualizado ? <Text style={styles.periodMeta}>Actualizado: {formatPeriodDate(p.actualizado)}</Text> : null}
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
          <View style={[styles.modalCard, styles.cursoModalCard]}>
            <ScrollView
              contentContainerStyle={[styles.modalContent, styles.cursoModalContent]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
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
                  sortCursosForDisplay(cursosAsignados).map((c) => (
                    <View key={c.id} style={[styles.courseRow, styles.courseCardRow]}>
                      <View style={styles.courseRowContent}>
                        <Text style={styles.courseRowTitle}>{c.nombre}</Text>
                        {c.grado ? <Text style={styles.dataBullet}>Grado: {c.grado}</Text> : null}
                      </View>
                      {canManageCourses ? (
                        <View style={styles.courseRowActions}>
                          <TouchableOpacity style={[styles.smallBtn, styles.courseActionBtn, styles.updateBtn]} onPress={() => openCursoForm(c)}>
                            <View style={styles.btnRow}>
                              <Ionicons name="create-outline" size={14} color="#e5e7eb" />
                              <Text style={styles.smallBtnText}>Editar</Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.smallBtn, styles.courseActionBtn, styles.deleteBtn]} onPress={() => askDeleteCurso(c)}>
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
            </ScrollView>
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
          <View style={[styles.modalCard, styles.colegioModalCard]}>
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
                  style={[styles.smallBtn, styles.outlineBtn, savingColegio && { opacity: 0.6 }]}
                  onPress={openColegiosListModal}
                  disabled={savingColegio}
                >
                  <View style={styles.btnRow}>
                    <Ionicons name="list-outline" size={14} color="#e5e7eb" />
                    <Text style={styles.smallBtnText}>Mostrar colegios</Text>
                  </View>
                </TouchableOpacity>
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
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="slide"
        visible={colegiosListModalVisible}
        onRequestClose={closeColegiosListModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, styles.colegioListModalCard]}>
            <View style={styles.modalHeader}>
              <Text style={styles.periodTitle}>Colegios en el sistema</Text>
              <Pressable onPress={closeColegiosListModal} style={styles.closeBtn}>
                <View style={styles.btnRow}><Ionicons name="close-outline" size={16} color="#e5e7eb" /><Text style={styles.closeBtnText}>Cerrar</Text></View>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.dataBox}>
                <View style={styles.courseActionsRow}>
                  <Text style={styles.dataTitle}>Colegios registrados</Text>
                  {colegiosLoading ? <Text style={styles.dataBullet}>Cargando...</Text> : null}
                </View>
                {colegiosList.length === 0 && !colegiosLoading ? (
                  <Text style={styles.dataBullet}>- Aun no hay colegios registrados</Text>
                ) : (
                  colegiosList.map((c) => {
                    const colegio = normalizeColegioItem(c);
                    const cargoValue = (colegio?.rectorCargo || 'rector').toLowerCase();
                    const cargoLabel = cargoValue === 'coordinador' ? 'Coordinador' : 'Rector';
                    const hasRectorData = Boolean(
                      colegio?.rectorCargo
                      || colegio?.rector?.cargo
                      || colegio?.rectorNombre
                      || colegio?.rectorApellido
                      || colegio?.rectorCorreo
                      || colegio?.rectorTelefono
                      || colegio?.rectorCedula
                      || colegio?.rectorTienePassword
                    );
                    return (
                      <View key={colegio.id} style={[styles.courseRow, isEditingColegio && String(colegioEditing?.id) === String(colegio.id) && styles.courseRowActive]}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.dataItem}>- {colegio.nombre || `Colegio ${colegio.id}`}</Text>
                          {colegio.codigoDane ? <Text style={styles.dataBullet}>Codigo DANE: {colegio.codigoDane}</Text> : null}
                          {hasRectorData ? <Text style={styles.dataBullet}>Cargo directivo: {cargoLabel}</Text> : null}
                          {hasRectorData ? <Text style={styles.dataBullet}>Nombre: {colegio.rectorNombre || 'No registrado'}</Text> : null}
                          {hasRectorData ? <Text style={styles.dataBullet}>Apellido: {colegio.rectorApellido || 'No registrado'}</Text> : null}
                          {hasRectorData ? <Text style={styles.dataBullet}>Correo: {colegio.rectorCorreo || 'No registrado'}</Text> : null}
                          {hasRectorData ? <Text style={styles.dataBullet}>Telefono: {colegio.rectorTelefono || 'No registrado'}</Text> : null}
                          {hasRectorData ? <Text style={styles.dataBullet}>Cedula: {colegio.rectorCedula || 'No registrado'}</Text> : null}
                          {hasRectorData ? <Text style={styles.dataBullet}>Contrasena configurada: {colegio.rectorTienePassword ? 'Si' : 'No'}</Text> : null}
                        </View>
                        <View style={styles.courseRowActions}>
                          <TouchableOpacity style={[styles.smallBtn, styles.updateBtn]} onPress={() => startEditColegio(colegio)}>
                            <View style={styles.btnRow}>
                              <Ionicons name="create-outline" size={14} color="#e5e7eb" />
                              <Text style={styles.smallBtnText}>Editar</Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.smallBtn, styles.deleteBtn]} onPress={() => askDeleteColegio(colegio)}>
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
          <View style={[styles.modalCard, styles.docenteCrudModalCard]}>
            <View style={styles.modalHeader}>
              <Text style={styles.periodTitle}>Gestionar docentes</Text>
              <Pressable onPress={closeDocenteCrudModal} style={styles.closeBtn}>
                <View style={styles.btnRow}><Ionicons name="close-outline" size={16} color="#e5e7eb" /><Text style={styles.closeBtnText}>Cerrar</Text></View>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.courseForm}>
              <Text style={styles.fieldLabel}>{docenteEditing ? 'Editar docente' : 'Nuevo docente'}</Text>

              <TextInput
                style={styles.courseInput}
                placeholder="Nombre completo"
                placeholderTextColor="#9ca3af"
                value={docenteForm.nombre}
                onChangeText={(txt) => setDocenteForm(prev => ({ ...prev, nombre: sanitizeDocenteNombreInput(txt) }))}
              />
              <TextInput
                style={styles.courseInput}
                placeholder="Correo"
                placeholderTextColor="#9ca3af"
                autoCapitalize="none"
                keyboardType="email-address"
                value={docenteForm.email}
                onChangeText={(txt) => setDocenteForm(prev => ({ ...prev, email: normalizeDocenteEmailInput(txt) }))}
              />
              <TextInput
                style={styles.courseInput}
                placeholder={docenteEditing ? 'Nueva contraseña (opcional)' : 'Contraseña'}
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
                  sortCursosForDisplay(docenteCursosDisponibles).map(c => {
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

              {docenteCursos.length > 0 ? (
                <View style={styles.dataBox}>
                  <View style={styles.courseActionsRow}>
                    <Text style={styles.dataTitle}>Materias por curso</Text>
                    <Text style={styles.dataBullet}>Separa varias materias con coma</Text>
                  </View>
                  {sortCursosForDisplay(
                    docenteCursos.map((cursoId) => (
                      docenteCursosDisponibles.find((curso) => String(curso.id) === String(cursoId))
                      || docenteEditing?.cursos?.find((curso) => String(curso.id) === String(cursoId))
                      || { id: cursoId, nombre: `Curso ${cursoId}` }
                    ))
                  ).map((curso) => (
                    <View key={`docente-materia-${curso.id}`} style={styles.materiaCursoGroup}>
                      <Text style={styles.docenteCursoChipTitle}>{curso.nombre || `Curso ${curso.id}`}</Text>
                      <TextInput
                        style={styles.courseInput}
                        placeholder="Ej: Matematicas, Fisica, Quimica"
                        placeholderTextColor="#9ca3af"
                        value={docenteMateriasDraft?.[curso.id] || ''}
                        onChangeText={(txt) => updateDocenteMateriaDraft(curso.id, txt)}
                        onBlur={(e) => commitDocenteMateriaDraft(curso.id, e?.nativeEvent?.text ?? e?.target?.value)}
                      />
                    </View>
                  ))}
                  {!docenteEditing ? (
                    <Text style={styles.dataBullet}>Las materias se guardan cuando creas o actualizas el docente.</Text>
                  ) : null}
                </View>
              ) : null}

              {docenteError ? <Text style={[styles.errorText, { marginTop: 4 }]}>{docenteError}</Text> : null}

              <View style={styles.courseFormActions}>
                <TouchableOpacity
                  style={[styles.smallBtn, styles.infoBtn, (docentesLoading || docenteEditing) && { opacity: 0.6 }]}
                  onPress={openDocenteCrudListModal}
                  disabled={docentesLoading || !!docenteEditing}
                >
                  <View style={styles.btnRow}>
                    <Ionicons name="people-outline" size={14} color="#e5e7eb" />
                    <Text style={styles.smallBtnText}>{docentesLoading ? 'Cargando...' : 'Mostrar docentes'}</Text>
                  </View>
                </TouchableOpacity>
                {docenteEditing ? (
                  <TouchableOpacity
                    style={[styles.smallBtn, styles.outlineBtn, savingDocente && { opacity: 0.6 }]}
                    onPress={() => {
                      if (savingDocente) return;
                      setDocenteEditing(null);
                      setDocenteForm({ nombre: '', email: '', password: '' });
                      setDocenteCursos([]);
                      setDocenteMateriasState({});
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
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="slide"
        visible={docenteCrudListModalVisible}
        onRequestClose={() => setDocenteCrudListModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, styles.docentesModalCard]}>
            <View style={styles.modalHeader}>
              <Text style={styles.periodTitle}>Docentes del colegio</Text>
              <Pressable onPress={() => setDocenteCrudListModalVisible(false)} style={styles.closeBtn}>
                <View style={styles.btnRow}><Ionicons name="close-outline" size={16} color="#e5e7eb" /><Text style={styles.closeBtnText}>Cerrar</Text></View>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.fieldLabel}>Colegio: <Text style={styles.dataValue}>{resolveColegioNombre(docenteColegioId || user?.schoolId)}</Text></Text>
              <View style={styles.dataBox}>
                <View style={styles.courseActionsRow}>
                  <Text style={styles.dataTitle}>Docentes del colegio</Text>
                  {docentesLoading ? <Text style={styles.dataBullet}>Cargando...</Text> : null}
                </View>
                {docentes.length === 0 && !docentesLoading ? (
                  <Text style={styles.dataBullet}>- Aun no hay docentes</Text>
                ) : (
                  docentes.map((d) => (
                    <View key={d.id} style={styles.docenteSummaryCard}>
                      <View style={styles.docenteSummaryTopRow}>
                        <View style={styles.docenteSummaryHeader}>
                          <Text style={styles.docenteSummaryName}>{d.nombre || d.email || `Docente ${d.id}`}</Text>
                          {d.email ? <Text style={styles.docenteSummaryEmail}>{d.email}</Text> : null}
                        </View>
                        <View style={styles.docenteSummaryActions}>
                          <TouchableOpacity
                            style={[styles.smallBtn, styles.updateBtn]}
                            onPress={() => {
                              setDocenteCrudListModalVisible(false);
                              startEditDocente(d);
                            }}
                          >
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
                      <View style={styles.docenteCursoList}>
                        {d.cursos && d.cursos.length ? (
                          sortCursosForDisplay(d.cursos).map((c) => (
                            <View key={c.id} style={styles.docenteCursoChip}>
                              <Text style={styles.docenteCursoChipTitle}>{c.nombre || `Curso ${c.id}`}</Text>
                              <Text style={styles.docenteCursoChipMeta}>
                                {Array.isArray(c.materias) && c.materias.length ? `Materias: ${c.materias.join(', ')}` : 'Sin materias asignadas'}
                              </Text>
                            </View>
                          ))
                        ) : (
                          <View style={styles.docenteCursoChipEmpty}>
                            <Text style={styles.docenteCursoChipMeta}>Sin cursos asignados</Text>
                          </View>
                        )}
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
          <View style={[styles.modalCard, styles.sharedActionModalCard]}>
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
          <View style={[styles.modalCard, styles.docentesModalCard]}>
            <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
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

                <View style={styles.docentesSearchBox}>
                  <Text style={styles.fieldLabel}>Buscar docente</Text>
                  <View style={styles.docentesSearchInputWrap}>
                    <Ionicons name="search-outline" size={16} color="#94a3b8" />
                    <TextInput
                      style={styles.docentesSearchInput}
                      placeholder="Escribe nombre o apellido"
                      placeholderTextColor="#94a3b8"
                      value={docentesSearchTerm}
                      onFocus={() => setDocentesSearchOpen(true)}
                      onChangeText={(text) => {
                        setDocentesSearchTerm(text);
                        setDocentesSearchOpen(Boolean(text.trim()));
                      }}
                    />
                    {docentesSearchTerm ? (
                      <Pressable
                        onPress={() => {
                          setDocentesSearchTerm('');
                          setDocentesSearchOpen(false);
                        }}
                        style={styles.docentesSearchClearBtn}
                      >
                        <Ionicons name="close-circle" size={16} color="#94a3b8" />
                      </Pressable>
                    ) : null}
                  </View>

                  {docentesSearchOpen && docentesSearchNormalized ? (
                    <View style={styles.docentesSearchSuggestions}>
                      {docentesSearchSuggestions.length > 0 ? (
                        docentesSearchSuggestions.map((docente) => (
                          <TouchableOpacity
                            key={`suggestion-${docente.id}`}
                            style={styles.docentesSearchSuggestionItem}
                            onPress={() => {
                              setDocentesSearchTerm(docente?.nombre || '');
                              setDocentesSearchOpen(false);
                            }}
                          >
                            <Text style={styles.docentesSearchSuggestionName}>{docente?.nombre || `Docente ${docente?.id}`}</Text>
                            {docente?.email ? (
                              <Text style={styles.docentesSearchSuggestionMeta}>{docente.email}</Text>
                            ) : null}
                          </TouchableOpacity>
                        ))
                      ) : (
                        <Text style={styles.docentesSearchEmpty}>No hay coincidencias</Text>
                      )}
                    </View>
                  ) : null}
                </View>

                <View style={styles.docentesOverviewSection}>
                  <Text style={styles.dataTitle}>Docentes y cursos</Text>
                  {docentesLoading ? (
                    <Text style={styles.dataBullet}>Cargando docentes...</Text>
                  ) : docentes.length === 0 ? (
                    <Text style={styles.dataBullet}>- Sin docentes para este colegio</Text>
                  ) : docentesFiltrados.length === 0 ? (
                    <Text style={styles.dataBullet}>- No hay docentes que coincidan con la busqueda</Text>
                  ) : (
                    docentesFiltrados.map((d) => (
                      <View key={d.id} style={styles.docenteSummaryCard}>
                        <View style={styles.docenteSummaryHeader}>
                          <Text style={styles.docenteSummaryName}>{d.nombre || d.email || `Docente ${d.id}`}</Text>
                          {d.email ? <Text style={styles.docenteSummaryEmail}>{d.email}</Text> : null}
                        </View>
                        <View style={styles.docenteCursoList}>
                          {d.cursos && d.cursos.length > 0 ? (
                            sortCursosForDisplay(d.cursos).map((c) => (
                              <View key={c.id} style={styles.docenteCursoChip}>
                                <Text style={styles.docenteCursoChipTitle}>
                                  {c.nombre}{c.grado ? ` ${c.grado}` : ''}
                                </Text>
                                <Text style={styles.docenteCursoChipMeta}>
                                  {Array.isArray(c.materias) && c.materias.length ? `Materias: ${c.materias.join(', ')}` : 'Sin materias asignadas'}
                                </Text>
                              </View>
                            ))
                          ) : (
                            <View style={styles.docenteCursoChipEmpty}>
                              <Text style={styles.docenteCursoChipMeta}>Sin cursos asignados</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    ))
                  )}
                </View>
              </View>
            </ScrollView>
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
          <View style={[styles.modalCard, styles.quickInfoModalCard]}>
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
                <Text key={p.id} style={styles.dataBullet}>- {p.nombre}: {formatPeriodSummary(p.fechaInicio, p.fechaFin)}</Text>
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

const SHARED_ACTION_MODAL = {
  width: Platform.OS === 'web' ? '32%' : '92%',
  maxWidth: 500,
  maxHeight: '76%',
  alignSelf: 'center'
};

const styles = StyleSheet.create({
  content: { flex: 1 },
  scroll: { flexGrow: 1, padding: 20, paddingBottom: 28 },
  mainColumn: { width: '100%', alignSelf: 'stretch', gap: 16 },
  hero: { width: '100%', height: 170, borderRadius: 18, overflow: 'hidden', backgroundColor: '#111827', marginTop: 0, alignSelf: 'center', shadowColor: '#000', shadowOpacity: 0.28, shadowOffset: { width: 0, height: 8 }, shadowRadius: 12, elevation: 5, alignItems: 'center', justifyContent: 'center' },
  logo: { width: '100%', height: '100%' },
  infoCard: { flexDirection: 'row', alignItems: 'center', width: '100%', alignSelf: 'stretch', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 18, paddingVertical: 10, paddingHorizontal: 12, gap: 10, borderWidth: 1, borderColor: 'rgba(56,189,248,0.4)', shadowColor: '#000', shadowOpacity: 0.25, shadowOffset: { width: 0, height: 6 }, shadowRadius: 10, elevation: 6, marginTop: -12 },
  infoAvatar: { width: 42, height: 42, borderRadius: 12, backgroundColor: 'rgba(56,189,248,0.18)', borderWidth: 1, borderColor: 'rgba(56,189,248,0.6)', alignItems: 'center', justifyContent: 'center' },
  infoAvatarText: { color: '#e0f2fe', fontWeight: '900', fontSize: 18 },
  infoBody: { flex: 1, gap: 6 },
  infoHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  infoLabelStrong: { color: '#e0f2fe', fontWeight: '800', fontSize: 13, letterSpacing: 0.4 },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: 'rgba(34,197,94,0.18)', borderWidth: 1, borderColor: 'rgba(34,197,94,0.45)' },
  statusPillText: { color: '#bbf7d0', fontWeight: '700', fontSize: 11 },
  infoItem: { gap: 2 },
  infoDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.12)' },
  infoLabel: { color: '#cbd5e1', fontWeight: '700', fontSize: 11, letterSpacing: 0.4, textTransform: 'uppercase' },
  infoValue: { color: '#fff', fontWeight: '800', fontSize: 15, letterSpacing: 0.2 },
  actionGrid: { width: '100%', alignSelf: 'stretch', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10, columnGap: 10, marginTop: 0 },
  actionGridRector: { gap: 12 },
  btnRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionBtn: { width: '48.8%', borderRadius: 14, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 4 }, shadowRadius: 6, elevation: 3 },
  actionBtnFull: { width: '100%' },
  actionBtnRector: { width: '48.8%' },
  actionBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  actionBtnTextCompact: { fontSize: 13, flexShrink: 1, textAlign: 'center' },
  logoutActionBtn: { backgroundColor: '#ef4444' },
  periodBtn: { marginTop: 10, borderRadius: 14, paddingVertical: 14, alignItems: 'center', backgroundColor: '#7c3aed', shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 4 }, shadowRadius: 6, elevation: 3 },
  periodBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  periodSaveBtn: { alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 10, minWidth: 168, borderRadius: 12, marginTop: 8 },
  periodSaveBtnText: { fontSize: 13.5 },
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
  sharedActionModalCard: { ...SHARED_ACTION_MODAL },
  modalCardWide: { ...SHARED_ACTION_MODAL },
  periodModalCard: { ...SHARED_ACTION_MODAL },
  cursoModalCard: { ...SHARED_ACTION_MODAL },
  docenteCrudModalCard: { ...SHARED_ACTION_MODAL, marginTop: -12 },
  docentesModalCard: { ...SHARED_ACTION_MODAL },
  quickInfoModalCard: { ...SHARED_ACTION_MODAL },
  colegioModalCard: { ...SHARED_ACTION_MODAL },
  colegioListModalCard: { ...SHARED_ACTION_MODAL },
  modalContent: { padding: 16, gap: 12 },
  periodModalContent: { padding: 14, gap: 10 },
  cursoModalContent: { padding: 14, gap: 10 },
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
  periodCard: { padding: 14, borderRadius: 14, backgroundColor: 'rgba(15,23,42,0.55)', borderWidth: 1, borderColor: 'rgba(148,163,184,0.16)', borderBottomWidth: 1, borderBottomColor: 'rgba(148,163,184,0.16)', marginTop: 8 },
  periodContent: { flex: 1, gap: 8 },
  periodHeadingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  periodName: { color: '#fff', fontWeight: '900', fontSize: 15 },
  periodRange: { color: '#cbd5e1', fontSize: 12.5, lineHeight: 18 },
  periodDateGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  periodDateCard: { minWidth: 150, flexGrow: 1, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, backgroundColor: 'rgba(30,41,59,0.9)', borderWidth: 1, borderColor: 'rgba(99,102,241,0.22)' },
  periodDateLabel: { color: '#94a3b8', fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  periodDateValue: { color: '#f8fafc', fontSize: 13, fontWeight: '800', marginTop: 4 },
  periodDateTime: { color: '#cbd5e1', fontSize: 11.5, fontWeight: '700', marginTop: 4 },
  periodFooterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' },
  periodDurationChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: 'rgba(99,102,241,0.16)', borderWidth: 1, borderColor: 'rgba(129,140,248,0.3)' },
  periodDurationText: { color: '#c7d2fe', fontSize: 11, fontWeight: '900' },
  periodMeta: { color: '#a5f3fc', fontSize: 12, marginTop: 2 },
  periodActions: { flexDirection: 'row', gap: 8, alignSelf: 'stretch', flexWrap: 'wrap', justifyContent: 'flex-end' },
  smallBtn: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10 },
  updateBtn: { backgroundColor: 'rgba(56,189,248,0.2)', borderWidth: 1, borderColor: 'rgba(56,189,248,0.5)' },
  deleteBtn: { backgroundColor: 'rgba(239,68,68,0.18)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.5)' },
  smallBtnText: { color: '#e5e7eb', fontWeight: '700', fontSize: 12 },
  emptyText: { color: '#cbd5e1', textAlign: 'center', marginTop: 8 },
  dataBox: { width: '100%', alignSelf: 'stretch', marginTop: 10, padding: 12, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', gap: 4 },
  dataTitle: { color: '#e5e7eb', fontWeight: '800', marginBottom: 2 },
  dataItem: { color: '#cbd5e1' },
  dataValue: { color: '#fff', fontWeight: '800' },
  dataBullet: { color: '#cbd5e1', fontSize: 12 },
  docentesSearchBox: { marginTop: 10, gap: 6 },
  docentesSearchInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.04)'
  },
  docentesSearchInput: { flex: 1, color: '#fff', paddingVertical: 10 },
  docentesSearchClearBtn: { padding: 2 },
  docentesSearchSuggestions: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(15,23,42,0.96)',
    overflow: 'hidden'
  },
  docentesSearchSuggestionItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)'
  },
  docentesSearchSuggestionName: { color: '#f8fafc', fontWeight: '700', fontSize: 13.5 },
  docentesSearchSuggestionMeta: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  docentesSearchEmpty: { color: '#94a3b8', fontSize: 12.5, paddingHorizontal: 12, paddingVertical: 10 },
  docentesOverviewSection: { marginTop: 6, width: '100%', alignSelf: 'stretch' },
  docenteSummaryCard: { padding: 12, borderRadius: 14, backgroundColor: 'rgba(15,23,42,0.55)', borderWidth: 1, borderColor: 'rgba(148,163,184,0.16)', marginTop: 10, gap: 10 },
  docenteSummaryTopRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  docenteSummaryHeader: { gap: 4 },
  docenteSummaryActions: { flexDirection: 'row', gap: 8, alignSelf: 'flex-start' },
  docenteSummaryName: { color: '#f8fafc', fontSize: 16, fontWeight: '800' },
  docenteSummaryEmail: { color: '#94a3b8', fontSize: 13 },
  docenteCursoList: { gap: 8 },
  docenteCursoChip: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, backgroundColor: 'rgba(30,41,59,0.9)', borderWidth: 1, borderColor: 'rgba(96,165,250,0.2)', gap: 4 },
  docenteCursoChipEmpty: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, backgroundColor: 'rgba(30,41,59,0.5)', borderWidth: 1, borderColor: 'rgba(148,163,184,0.16)' },
  docenteCursoChipTitle: { color: '#e2e8f0', fontSize: 14, fontWeight: '700' },
  docenteCursoChipMeta: { color: '#cbd5e1', fontSize: 12, lineHeight: 18 },
  courseActionsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  courseForm: { marginBottom: 10, gap: 8 },
  courseInput: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: '#fff', backgroundColor: 'rgba(255,255,255,0.08)' },
  materiaCursoGroup: { gap: 6, marginTop: 8 },
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
  courseFormActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap' },
  outlineBtn: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)', backgroundColor: 'transparent' },
  infoBtn: { backgroundColor: 'rgba(59,130,246,0.18)', borderWidth: 1, borderColor: 'rgba(96,165,250,0.45)' },
  createBtn: { backgroundColor: 'rgba(16,185,129,0.25)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.6)' },
  courseRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  courseCardRow: { paddingHorizontal: 8, paddingVertical: 8, borderRadius: 12, backgroundColor: 'rgba(15,23,42,0.38)', borderWidth: 1, borderColor: 'rgba(148,163,184,0.14)', borderBottomWidth: 1, borderBottomColor: 'rgba(148,163,184,0.14)', marginBottom: 6 },
  courseRowContent: { flex: 1, minWidth: 0, gap: 2, paddingRight: 2 },
  courseRowTitle: { color: '#f8fafc', fontSize: 15, fontWeight: '800' },
  courseRowActive: { backgroundColor: 'rgba(56,189,248,0.08)', borderRadius: 10, paddingHorizontal: 8 },
  courseRowActions: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end', alignSelf: 'center' },
  courseActionBtn: { paddingHorizontal: 8, paddingVertical: 7 },
  pickerList: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.03)', marginBottom: 8 },
  pickerItem: { paddingHorizontal: 12, paddingVertical: 10 },
  pickerItemActive: { backgroundColor: 'rgba(16,185,129,0.18)' },
  errorText: { color: '#fca5a5' },
  dropdownList: { marginTop: 6, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.04)' },
  dropdownItem: { paddingHorizontal: 12, paddingVertical: 10 },
  dropdownItemSelected: { backgroundColor: 'rgba(56,189,248,0.12)' },
  linkBtn: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: 'rgba(59,130,246,0.15)', borderWidth: 1, borderColor: 'rgba(59,130,246,0.4)' },
  linkBtnText: { color: '#bfdbfe', fontWeight: '700', fontSize: 12 },
  logoutBtn: { width: '100%', alignSelf: 'stretch', marginTop: 8, borderRadius: 14, paddingVertical: 15, alignItems: 'center', backgroundColor: '#ef4444', shadowColor: '#000', shadowOpacity: 0.25, shadowOffset: { width: 0, height: 5 }, shadowRadius: 8, elevation: 4 },
  logoutText: { color: '#fff', fontWeight: '800', letterSpacing: 0.3 }
});




