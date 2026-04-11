import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, Modal, Pressable, TextInput, Platform, Animated } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../store/useAuth';
import ScreenBackground from '../components/ScreenBackground';
import { getPeriodos, createPeriodo, updatePeriodo, deletePeriodo } from '../services/periodos';
import { getCursos, getCursosPorColegio, createCurso, updateCurso, deleteCurso } from '../services/cursos';
import { getEstudiantes, createEstudiante, createEstudiantesLote, updateEstudiante, deleteEstudiante } from '../services/estudiantes';
import { getDocentes, getCursosDisponiblesDocente, createDocente, updateDocente, deleteDocente, resetDocentePassword } from '../services/docentes';
import { getColegios, createColegio, updateColegio, deleteColegio } from '../services/colegios';
import { getReporteInasistenciaCurso } from '../services/reportes';
import { useAttendance } from '../store/useAttendance';
import { changeMyPassword } from '../services/auth';

const ALL_MATERIAS_OPTION = '__all_materias__';

export default function HomeScreen() {
  const logout = useAuth(s => s.logout);
  const user = useAuth(s => s.user);
  const updateUser = useAuth(s => s.updateUser);
  const isAdmin = user?.rol === 'admin';
  const isDocente = user?.rol === 'docente';
  const isRectorCoordinador = ['rector', 'coordinador'].includes(user?.rol);
  const isMobileApp = Platform.OS !== 'web';
  const canManageCourses = ['admin', 'rector', 'coordinador'].includes(user?.rol);
  const canManagePeriods = ['admin', 'rector', 'coordinador'].includes(user?.rol);
  const navigation = useNavigation();
  const subscribeAttendance = useAttendance((s) => s.subscribe);
  const attendanceLastEvent = useAttendance((s) => s.lastEvent);
  const teacherInitial = (user?.email?.[0] || 'D').toUpperCase();
  const [periodos, setPeriodos] = useState([]);
  const [periodModalVisible, setPeriodModalVisible] = useState(false);
  const [periodSchoolId, setPeriodSchoolId] = useState(null);
  const [periodSchoolPickerOpen, setPeriodSchoolPickerOpen] = useState(false);
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
  const [adminCursosModalVisible, setAdminCursosModalVisible] = useState(false);
  const [rectorCursosModalVisible, setRectorCursosModalVisible] = useState(false);
  const [deleteCursoModal, setDeleteCursoModal] = useState({ visible: false, curso: null });
  const [cursoCrudColegioId, setCursoCrudColegioId] = useState(null);
  const [cursoCrudPickerOpen, setCursoCrudPickerOpen] = useState(false);
  const [loadingCursos, setLoadingCursos] = useState(false);
  const [adminCursoFormVisible, setAdminCursoFormVisible] = useState(false);
  const [adminCursoNombre, setAdminCursoNombre] = useState('');
  const [adminCursoEditing, setAdminCursoEditing] = useState(null);
  const [rectorCursoFormVisible, setRectorCursoFormVisible] = useState(false);
  const [rectorCursoNombre, setRectorCursoNombre] = useState('');
  const [rectorCursoEditing, setRectorCursoEditing] = useState(null);
  const [savingCurso, setSavingCurso] = useState(false);
  const [estudiantesModalVisible, setEstudiantesModalVisible] = useState(false);
  const [estudiantes, setEstudiantes] = useState([]);
  const [estudiantesLoading, setEstudiantesLoading] = useState(false);
  const [estudiantesError, setEstudiantesError] = useState('');
  const [downloadingQrZip, setDownloadingQrZip] = useState(false);
  const [deleteEstudianteConfirmModal, setDeleteEstudianteConfirmModal] = useState({ visible: false, estudiante: null, deleting: false });
  const [estudianteDeleteSuccessModal, setEstudianteDeleteSuccessModal] = useState({ visible: false, message: '' });
  const estudianteDeleteSuccessTimeoutRef = useRef(null);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [cursoPickerOpen, setCursoPickerOpen] = useState(false);
  const [estudianteMateriaFiltro, setEstudianteMateriaFiltro] = useState(ALL_MATERIAS_OPTION);
  const [estudianteMateriaPickerOpen, setEstudianteMateriaPickerOpen] = useState(false);
  const [estudiantesColegioId, setEstudiantesColegioId] = useState(null);
  const [estudiantesColegioPickerOpen, setEstudiantesColegioPickerOpen] = useState(false);
  const [estudianteCreateModalVisible, setEstudianteCreateModalVisible] = useState(false);
  const [estudianteCreateCursoId, setEstudianteCreateCursoId] = useState(null);
  const [estudianteCreateCursoPickerOpen, setEstudianteCreateCursoPickerOpen] = useState(false);
  const [estudianteCreateForm, setEstudianteCreateForm] = useState({ nombres: '', apellidos: '' });
  const [estudianteCreateMaterias, setEstudianteCreateMaterias] = useState([]);
  const [selectedCsvFile, setSelectedCsvFile] = useState(null);
  const [uploadedStudents, setUploadedStudents] = useState([]);
  const [estudianteCreateError, setEstudianteCreateError] = useState('');
  const [savingEstudiante, setSavingEstudiante] = useState(false);
  const [estudianteEditing, setEstudianteEditing] = useState(null);
  const [estudianteEditForm, setEstudianteEditForm] = useState({ nombres: '', apellidos: '', qr: '', codigoEstudiante: '', materias: [] });
  const [savingEstudianteEdit, setSavingEstudianteEdit] = useState(false);
  const [docentesModalVisible, setDocentesModalVisible] = useState(false);
  const [docentePanelModalVisible, setDocentePanelModalVisible] = useState(false);
  const [docentes, setDocentes] = useState([]);
  const [docentesLoading, setDocentesLoading] = useState(false);
  const [docentesError, setDocentesError] = useState('');
  const [adminDocentesSearchTerm, setAdminDocentesSearchTerm] = useState('');
  const [docentesSearchTerm, setDocentesSearchTerm] = useState('');
  const [docentesSearchOpen, setDocentesSearchOpen] = useState(false);
  const [colegioSeleccionado, setColegioSeleccionado] = useState(null);
  const [colegiosOptions, setColegiosOptions] = useState([]);
  const [colegioPickerOpen, setColegioPickerOpen] = useState(false);
  const [colegiosLoading, setColegiosLoading] = useState(false);
  const [reportesModalVisible, setReportesModalVisible] = useState(false);
  const [reportesColegioId, setReportesColegioId] = useState(null);
  const [reportesColegioPickerOpen, setReportesColegioPickerOpen] = useState(false);
  const [reportesCursos, setReportesCursos] = useState([]);
  const [reportesCursoId, setReportesCursoId] = useState(null);
  const [reportesCursoPickerOpen, setReportesCursoPickerOpen] = useState(false);
  const [reportesMes, setReportesMes] = useState(new Date().getMonth() + 1);
  const [reportesMesPickerOpen, setReportesMesPickerOpen] = useState(false);
  const [reportesDia, setReportesDia] = useState(new Date().getDate());
  const [reportesDiaPickerOpen, setReportesDiaPickerOpen] = useState(false);
  const [reportesLoading, setReportesLoading] = useState(false);
  const [reportesBootLoading, setReportesBootLoading] = useState(false);
  const [reportesError, setReportesError] = useState('');
  const [reportesDetalle, setReportesDetalle] = useState(null);
  const [colegiosModalVisible, setColegiosModalVisible] = useState(false);
  const [colegiosListModalVisible, setColegiosListModalVisible] = useState(false);
  const [colegiosList, setColegiosList] = useState([]);
  const [colegiosListView, setColegiosListView] = useState('colegios');
  const [rectoresSearchTerm, setRectoresSearchTerm] = useState('');
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
  const [colegiosSuccess, setColegiosSuccess] = useState('');
  const colegioSuccessAnim = useRef(new Animated.Value(0)).current;
  const colegiosSuccessTimerRef = useRef(null);
  const [docenteCrudModalVisible, setDocenteCrudModalVisible] = useState(false);
  const [adminDocenteEditModalVisible, setAdminDocenteEditModalVisible] = useState(false);
  const [docenteCrudListModalVisible, setDocenteCrudListModalVisible] = useState(false);
  const [docenteForm, setDocenteForm] = useState({ nombre: '', email: '', password: '' });
  const [showDocentePassword, setShowDocentePassword] = useState(false);
  const [docenteCursos, setDocenteCursos] = useState([]);
  const [docenteCursosDisponibles, setDocenteCursosDisponibles] = useState([]);
  const [docenteColegioId, setDocenteColegioId] = useState(null);
  const [docenteColegioPickerOpen, setDocenteColegioPickerOpen] = useState(false);
  const [docenteAccessPreviewById, setDocenteAccessPreviewById] = useState({});
  const [docenteEditing, setDocenteEditing] = useState(null);
  const [savingDocente, setSavingDocente] = useState(false);
  const [docenteError, setDocenteError] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [manualChangePasswordModalVisible, setManualChangePasswordModalVisible] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState('');
  const [changePasswordForm, setChangePasswordForm] = useState({ current: '', next: '', confirm: '' });
  const [showChangeCurrentPassword, setShowChangeCurrentPassword] = useState(false);
  const [showChangeNextPassword, setShowChangeNextPassword] = useState(false);
  const [showChangeConfirmPassword, setShowChangeConfirmPassword] = useState(false);
  const [resetPasswordFeedbackModal, setResetPasswordFeedbackModal] = useState({ visible: false, title: '', message: '' });
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
  const canAdminFilterPeriodSchools = isAdmin && !user?.schoolId;
  const canAdminFilterReportSchools = isAdmin && !user?.schoolId;
  const canAdminFilterDocenteSchools = isAdmin;

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - 2 + i);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const monthNames = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const pad2 = (value) => String(value).padStart(2, '0');
  const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();
  const reportMonthOptions = months.map((month) => ({
    value: month,
    label: `${monthNames[month - 1]} ${currentYear}`
  }));
  const reportDayOptions = Array.from({ length: getDaysInMonth(currentYear, reportesMes) }, (_, index) => index + 1);
  const reportMonthKey = `${currentYear}-${pad2(reportesMes)}`;
  const reportSelectedDate = `${reportMonthKey}-${pad2(reportesDia)}`;
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
    const safeColegio = colegio && typeof colegio === 'object' ? colegio : {};
    const rectorSource = safeColegio?.rector || {};
    const rector = {
      cargo: safeColegio?.rectorCargo || rectorSource?.cargo || null,
      nombre: safeColegio?.rectorNombre || safeColegio?.rector_nombre || rectorSource?.nombre || null,
      apellido: safeColegio?.rectorApellido || safeColegio?.rector_apellido || rectorSource?.apellido || null,
      correo: safeColegio?.rectorCorreo || safeColegio?.rector_correo || rectorSource?.correo || null,
      telefono: safeColegio?.rectorTelefono || safeColegio?.rector_telefono || rectorSource?.telefono || null,
      cedula: safeColegio?.rectorCedula || safeColegio?.rector_cedula || rectorSource?.cedula || null
    };
    return {
      ...safeColegio,
      codigoDane: safeColegio?.codigoDane || safeColegio?.codigo_dane || '',
      rector,
      rectorCargo: rector.cargo || 'rector',
      rectorNombre: rector.nombre || '',
      rectorApellido: rector.apellido || '',
      rectorCorreo: rector.correo || '',
      rectorTelefono: rector.telefono || '',
      rectorCedula: rector.cedula || '',
      rectorTienePassword: Boolean(safeColegio?.rectorTienePassword)
    };
  };
  const normalizeSearchText = (value = '') => String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
  const hasDirectivoData = (colegio = {}) => Boolean(
    colegio?.rectorCargo
    || colegio?.rector?.cargo
    || colegio?.rectorNombre
    || colegio?.rectorApellido
    || colegio?.rectorCorreo
    || colegio?.rectorTelefono
    || colegio?.rectorCedula
    || colegio?.rectorTienePassword
  );

  const clearPeriodStatusTimeout = () => {
    if (!periodStatusTimeoutRef.current) return;
    clearTimeout(periodStatusTimeoutRef.current);
    periodStatusTimeoutRef.current = null;
  };

  const clearColegiosSuccessTimer = () => {
    if (!colegiosSuccessTimerRef.current) return;
    clearTimeout(colegiosSuccessTimerRef.current);
    colegiosSuccessTimerRef.current = null;
  };

  const clearEstudianteDeleteSuccessTimeout = () => {
    if (!estudianteDeleteSuccessTimeoutRef.current) return;
    clearTimeout(estudianteDeleteSuccessTimeoutRef.current);
    estudianteDeleteSuccessTimeoutRef.current = null;
  };

  const hideColegiosSuccess = ({ animated = true } = {}) => {
    clearColegiosSuccessTimer();
    if (!colegiosSuccess) return;
    if (!animated) {
      colegioSuccessAnim.setValue(0);
      setColegiosSuccess('');
      return;
    }
    Animated.timing(colegioSuccessAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true
    }).start(() => setColegiosSuccess(''));
  };

  const showColegiosSuccess = (message) => {
    clearColegiosSuccessTimer();
    setColegiosSuccess(message);
    colegioSuccessAnim.setValue(0);
    Animated.timing(colegioSuccessAnim, {
      toValue: 1,
      duration: 260,
      useNativeDriver: true
    }).start();
    colegiosSuccessTimerRef.current = setTimeout(() => {
      hideColegiosSuccess({ animated: true });
    }, 2800);
  };

  const showPeriodStatusModal = (message) => {
    clearPeriodStatusTimeout();
    setPeriodStatusModal({ visible: true, message });
    periodStatusTimeoutRef.current = setTimeout(() => {
      setPeriodStatusModal({ visible: false, message: '' });
      periodStatusTimeoutRef.current = null;
    }, 2000);
  };

  const showEstudianteDeleteSuccessModal = (message) => {
    clearEstudianteDeleteSuccessTimeout();
    setEstudianteDeleteSuccessModal({ visible: true, message });
    estudianteDeleteSuccessTimeoutRef.current = setTimeout(() => {
      setEstudianteDeleteSuccessModal({ visible: false, message: '' });
      estudianteDeleteSuccessTimeoutRef.current = null;
    }, 2200);
  };

  const clearChangePasswordForm = () => {
    setChangePasswordForm({ current: '', next: '', confirm: '' });
    setShowChangeCurrentPassword(false);
    setShowChangeNextPassword(false);
    setShowChangeConfirmPassword(false);
    setChangePasswordError('');
  };

  const openManualChangePasswordModal = () => {
    clearChangePasswordForm();
    setManualChangePasswordModalVisible(true);
  };

  const closeManualChangePasswordModal = () => {
    if (changingPassword) return;
    if (user?.mustChangePassword) return;
    setManualChangePasswordModalVisible(false);
    clearChangePasswordForm();
  };

  const handleResetDocentePassword = async (docente) => {
    if (!docente?.id) return;
    try {
      const data = await resetDocentePassword(docente.id);
      await loadDocentesActual(docenteColegioId || user?.schoolId);
      setResetPasswordFeedbackModal({
        visible: true,
        title: 'Clave restablecida',
        message: data?.message || 'Se envio una clave temporal al correo del docente.'
      });
    } catch (e) {
      setResetPasswordFeedbackModal({
        visible: true,
        title: 'Error',
        message: e?.response?.data?.error || e?.message || 'No se pudo restablecer la clave'
      });
    }
  };

  const handleSubmitForcedPasswordChange = async () => {
    if (changingPassword) return;
    const current = String(changePasswordForm.current || '').trim();
    const next = String(changePasswordForm.next || '').trim();
    const confirm = String(changePasswordForm.confirm || '').trim();

    if (!current || !next || !confirm) {
      setChangePasswordError('Completa todos los campos');
      return;
    }
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
    if (!strongPasswordRegex.test(next)) {
      setChangePasswordError('La nueva clave debe tener minimo 8 caracteres, mayuscula, minuscula, numero y caracter especial');
      return;
    }
    if (next !== confirm) {
      setChangePasswordError('La confirmacion no coincide con la nueva clave');
      return;
    }
    setChangingPassword(true);
    try {
      await changeMyPassword(current, next);
      updateUser({ mustChangePassword: false });
      setChangePasswordModalVisible(false);
      setManualChangePasswordModalVisible(false);
      clearChangePasswordForm();
      showPeriodStatusModal('Clave actualizada');
    } catch (e) {
      setChangePasswordError(e?.response?.data?.error || e?.message || 'No se pudo actualizar la clave');
    } finally {
      setChangingPassword(false);
    }
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
      if (!silent) Alert.alert('Error', e?.response?.data?.error || 'No se pudieron cargar los periodos');
      return [];
    }
  };

  useEffect(() => { loadPeriodos(); }, []);
  useEffect(() => () => clearPeriodStatusTimeout(), []);
  useEffect(() => () => clearColegiosSuccessTimer(), []);
  useEffect(() => () => clearEstudianteDeleteSuccessTimeout(), []);

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
      const ini = parseDateParts(periodo.fechaInicio);
      const fin = parseDateParts(periodo.fechaFin);
      setPeriodForm({
        nombre: periodo.nombre || '',
        startDay: ini.day, startMonth: ini.month, startYear: ini.year, startHour: ini.hour, startMinute: ini.minute,
        endDay: fin.day, endMonth: fin.month, endYear: fin.year, endHour: fin.hour, endMinute: fin.minute
      });
      setEditingPeriodo(periodo);
    } else {
      setPeriodForm(createDefaultPeriodForm(periodos));
      setEditingPeriodo(null);
    }
    setPeriodModalVisible(true);
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
      Alert.alert('Error', message);
      return;
    }
    const nombre = periodForm.nombre.trim() || `Periodo ${periodos.length + 1 || 1}`;
    const payload = {
      nombre,
      fechaInicio: buildDate({
        day: periodForm.startDay, month: periodForm.startMonth, year: periodForm.startYear, hour: periodForm.startHour, minute: periodForm.startMinute
      }),
      fechaFin: buildDate({
        day: periodForm.endDay, month: periodForm.endMonth, year: periodForm.endYear, hour: periodForm.endHour, minute: periodForm.endMinute
      }),
      activo: true,
      schoolId: managedSchoolId
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
      Alert.alert('Error', getApiErrorMessage(e, 'No se pudo eliminar'));
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

  const loadCursosReporteInasistencia = async (schoolIdParam = null) => {
    const schoolId = Number(schoolIdParam || reportesColegioId || user?.schoolId);
    if (!schoolId) {
      setReportesCursos([]);
      setReportesCursoId(null);
      return [];
    }

    const cursos = await getCursos({ schoolId });
    const ordered = sortCursosForDisplay(cursos);
    setReportesCursos(ordered);
    setReportesCursoId((prev) => {
      const hasPrev = ordered.some((curso) => String(curso.id) === String(prev));
      return hasPrev ? prev : (ordered[0]?.id || null);
    });
    return ordered;
  };

  const openReportesModal = async () => {
    setReportesModalVisible(true);
    setReportesColegioPickerOpen(false);
    setReportesCursoPickerOpen(false);
    setReportesMesPickerOpen(false);
    setReportesDiaPickerOpen(false);
    setReportesError('');
    setReportesDetalle(null);
    setReportesBootLoading(true);
    try {
      if (canAdminFilterReportSchools) {
        const colegios = await loadColegios({
          preferId: reportesColegioId || user?.schoolId || null,
          preferName: user?.schoolName
        });
        const defaultSchoolId = Number(reportesColegioId || user?.schoolId || colegios?.[0]?.id || null) || null;
        setReportesColegioId(defaultSchoolId);
        await loadCursosReporteInasistencia(defaultSchoolId);
      } else {
        const schoolId = Number(user?.schoolId || reportesColegioId || null) || null;
        setReportesColegioId(schoolId);
        await loadCursosReporteInasistencia(schoolId);
      }
    } catch (e) {
      setReportesError(getApiErrorMessage(e, 'No se pudieron cargar los cursos'));
    } finally {
      setReportesBootLoading(false);
    }
  };

  const closeReportesModal = () => {
    setReportesModalVisible(false);
    setReportesColegioPickerOpen(false);
    setReportesCursoPickerOpen(false);
    setReportesMesPickerOpen(false);
    setReportesDiaPickerOpen(false);
    setReportesLoading(false);
    setReportesError('');
    setReportesDetalle(null);
  };

  const resetReportesFilters = () => {
    const today = new Date();
    setReportesMes(today.getMonth() + 1);
    setReportesDia(today.getDate());
    setReportesColegioPickerOpen(false);
    setReportesCursoPickerOpen(false);
    setReportesMesPickerOpen(false);
    setReportesDiaPickerOpen(false);
    setReportesError('');
    setReportesDetalle(null);
  };

  useEffect(() => {
    const maxDay = getDaysInMonth(currentYear, reportesMes);
    if (reportesDia > maxDay) {
      setReportesDia(maxDay);
    }
  }, [currentYear, reportesDia, reportesMes]);

  useEffect(() => {
    if (!reportesModalVisible || !canAdminFilterReportSchools) return;
    const selectedSchoolId = Number(reportesColegioId);
    if (!Number.isFinite(selectedSchoolId) || selectedSchoolId <= 0) {
      setReportesCursos([]);
      setReportesCursoId(null);
      return;
    }
    (async () => {
      try {
        setReportesBootLoading(true);
        setReportesError('');
        setReportesDetalle(null);
        await loadCursosReporteInasistencia(selectedSchoolId);
      } catch (e) {
        setReportesError(getApiErrorMessage(e, 'No se pudieron cargar los cursos'));
      } finally {
        setReportesBootLoading(false);
      }
    })();
  }, [canAdminFilterReportSchools, reportesColegioId, reportesModalVisible]);

  const handleGenerateInasistenciaReport = async () => {
    if (canAdminFilterReportSchools && !reportesColegioId) {
      return Alert.alert('Institucion requerida', 'Selecciona una institucion para generar el reporte');
    }
    if (!reportesCursoId) {
      return Alert.alert('Curso requerido', 'Selecciona un curso para generar el reporte');
    }

    setReportesLoading(true);
    setReportesError('');
    try {
      const data = await getReporteInasistenciaCurso({
        cursoId: reportesCursoId,
        mes: reportMonthKey,
        fecha: reportSelectedDate
      });
      setReportesDetalle(data);
    } catch (e) {
      const message = getApiErrorMessage(e, 'No se pudo generar el reporte');
      setReportesError(message);
      setReportesDetalle(null);
    } finally {
      setReportesLoading(false);
    }
  };

  const loadCursosAsignados = async (schoolIdParam = null) => {
    const params = schoolIdParam ? { schoolId: schoolIdParam } : {};
    const cursos = await getCursos(params);
    const ordered = sortCursosForDisplay(cursos);
    setCursosAsignados(ordered);
    return ordered;
  };

  const openAdminCursosModal = async () => {
    setAdminCursoFormVisible(false);
    setAdminCursoEditing(null);
    setAdminCursoNombre('');
    setCursoCrudPickerOpen(false);
    setLoadingCursos(true);
    try {
      const userSchoolOption = user?.schoolId ? [{ id: user.schoolId, nombre: user?.schoolName || `Colegio ${user.schoolId}` }] : [];
      setColegiosOptions(userSchoolOption);
      const colegios = await loadColegios({ preferId: user?.schoolId, preferName: user?.schoolName });
      const defaultSchoolId = user?.schoolId || colegios?.[0]?.id || null;
      setCursoCrudColegioId(defaultSchoolId);
      await loadCursosAsignados(defaultSchoolId);
      setAdminCursosModalVisible(true);
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.error || 'No se pudieron cargar los cursos');
    } finally {
      setLoadingCursos(false);
    }
  };

  const openRectorCursosModal = async () => {
    setRectorCursoFormVisible(false);
    setRectorCursoEditing(null);
    setRectorCursoNombre('');
    setCursoCrudPickerOpen(false);
    setLoadingCursos(true);
    try {
      const defaultSchoolId = Number(user?.schoolId) || null;
      if (!defaultSchoolId) {
        Alert.alert('Colegio requerido', 'No se encontro un colegio asociado a este usuario');
        return;
      }
      setColegiosOptions([{ id: defaultSchoolId, nombre: user?.schoolName || `Colegio ${defaultSchoolId}` }]);
      setCursoCrudColegioId(defaultSchoolId);
      await loadCursosAsignados(defaultSchoolId);
      setRectorCursosModalVisible(true);
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.error || 'No se pudieron cargar los cursos');
    } finally {
      setLoadingCursos(false);
    }
  };

  const closeCursosModal = () => {
    setAdminCursosModalVisible(false);
    setRectorCursosModalVisible(false);
    setAdminCursoFormVisible(false);
    setAdminCursoEditing(null);
    setAdminCursoNombre('');
    setRectorCursoFormVisible(false);
    setRectorCursoEditing(null);
    setRectorCursoNombre('');
    setCursoCrudColegioId(null);
    setCursoCrudPickerOpen(false);
  };

  const changeCursoCrudColegio = async (newSchoolId) => {
    const parsedSchoolId = Number(newSchoolId);
    if (!Number.isFinite(parsedSchoolId) || parsedSchoolId <= 0) return;
    setCursoCrudColegioId(parsedSchoolId);
    setCursoCrudPickerOpen(false);
    setAdminCursoFormVisible(false);
    setAdminCursoEditing(null);
    setAdminCursoNombre('');
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

  const selectCursoEstudiantes = async (cursoId) => {
    setCursoSeleccionado(cursoId);
    setCursoPickerOpen(false);
    setEstudianteMateriaFiltro(ALL_MATERIAS_OPTION);
    setEstudianteMateriaPickerOpen(false);
    setEstudiantesColegioPickerOpen(false);
    setEstudianteEditing(null);
    setEstudianteEditForm({ nombres: '', apellidos: '', qr: '', codigoEstudiante: '', materias: [] });
    await loadEstudiantesPorCurso(cursoId);
  };

  const openEstudiantesModal = async () => {
    setEstudiantesModalVisible(true);
    setCursoPickerOpen(false);
    setEstudianteMateriaFiltro(ALL_MATERIAS_OPTION);
    setEstudianteMateriaPickerOpen(false);
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
      if (!firstId) {
        setEstudiantes([]);
        setEstudiantesError('No tienes cursos asignados para consultar estudiantes');
        return;
      }
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
    setEstudianteMateriaFiltro(ALL_MATERIAS_OPTION);
    setEstudianteMateriaPickerOpen(false);
    setEstudiantesColegioPickerOpen(false);
    setEstudiantesColegioId(null);
    setCursoSeleccionado(null);
    setEstudiantes([]);
    setEstudiantesError('');
    setEstudianteEditing(null);
    setEstudianteEditForm({ nombres: '', apellidos: '', qr: '', codigoEstudiante: '', materias: [] });
  };

  const changeEstudiantesColegio = async (newSchoolId) => {
    const parsedSchoolId = Number(newSchoolId);
    if (!Number.isFinite(parsedSchoolId) || parsedSchoolId <= 0) return;
    setEstudiantesColegioId(parsedSchoolId);
    setEstudiantesColegioPickerOpen(false);
    setCursoPickerOpen(false);
    setEstudianteMateriaFiltro(ALL_MATERIAS_OPTION);
    setEstudianteMateriaPickerOpen(false);
    setEstudianteEditing(null);
    setEstudianteEditForm({ nombres: '', apellidos: '', qr: '', codigoEstudiante: '', materias: [] });
    setLoadingCursos(true);
    try {
      const cursos = await loadCursosAsignados(parsedSchoolId);
      const firstId = (cursos && cursos[0]?.id) || null;
      setCursoSeleccionado(firstId);
      if (!firstId) {
        setEstudiantes([]);
        setEstudiantesError('No hay cursos asignados en este colegio');
        return;
      }
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
      codigoEstudiante: estudiante?.codigoEstudiante || '',
      materias: Array.isArray(estudiante?.materias) ? estudiante.materias : []
    });
  };

  const cancelEditEstudiante = () => {
    setEstudianteEditing(null);
    setEstudianteEditForm({ nombres: '', apellidos: '', qr: '', codigoEstudiante: '', materias: [] });
  };

  const toggleEstudianteEditMateria = (materiaNombre) => {
    const normalizedMateria = normalizeMateriaOption(materiaNombre);
    if (!normalizedMateria) return;
    setEstudianteEditForm((prev) => {
      const current = Array.isArray(prev.materias) ? prev.materias : [];
      const exists = current.some((item) => normalizeMateriaOption(item) === normalizedMateria);
      const materias = exists
        ? current.filter((item) => normalizeMateriaOption(item) !== normalizedMateria)
        : [...current, materiaNombre];
      return { ...prev, materias };
    });
  };

  const handleUpdateEstudiante = async (id) => {
    const nombres = (estudianteEditForm.nombres || '').trim();
    const apellidos = (estudianteEditForm.apellidos || '').trim();
    const qr = (estudianteEditForm.qr || '').trim();
    const codigoEstudiante = (estudianteEditForm.codigoEstudiante || '').trim();
    const materias = Array.from(new Set(
      (Array.isArray(estudianteEditForm.materias) ? estudianteEditForm.materias : [])
        .map((item) => String(item || '').trim())
        .filter(Boolean)
    ));
    if (!nombres || !apellidos || !qr) {
      Alert.alert('Campos requeridos', 'Completa nombres, apellidos y QR');
      return;
    }
    setSavingEstudianteEdit(true);
    try {
      await updateEstudiante(id, { nombres, apellidos, qr, codigoEstudiante, materias });
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
    setDeleteEstudianteConfirmModal({ visible: true, estudiante: estudiante || null, deleting: false });
  };

  const handleConfirmDeleteEstudiante = async () => {
    const estudiante = deleteEstudianteConfirmModal?.estudiante;
    if (!estudiante?.id) return;
    setDeleteEstudianteConfirmModal((prev) => ({ ...prev, deleting: true }));
    try {
      await deleteEstudiante(estudiante.id);
      await loadEstudiantesPorCurso(cursoSeleccionado);
      if (String(estudianteEditing) === String(estudiante.id)) cancelEditEstudiante();
      setDeleteEstudianteConfirmModal({ visible: false, estudiante: null, deleting: false });
      const nombreCompleto = `${estudiante?.nombres || ''} ${estudiante?.apellidos || ''}`.trim();
      showEstudianteDeleteSuccessModal(
        nombreCompleto ? `${nombreCompleto} fue eliminado` : 'Estudiante eliminado'
      );
    } catch (e) {
      setDeleteEstudianteConfirmModal((prev) => ({ ...prev, deleting: false }));
      Alert.alert('Error', getApiErrorMessage(e, 'No se pudo eliminar el estudiante'));
    }
  };

  const sanitizeFileName = (value = '') => String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 70);

  const downloadEstudiantesQrZip = async () => {
    if (downloadingQrZip) return;
    const studentsWithQr = (Array.isArray(estudiantesFiltrados) ? estudiantesFiltrados : [])
      .filter((item) => String(item?.qr || '').trim());
    if (!studentsWithQr.length) {
      Alert.alert('Sin datos', 'No hay estudiantes con QR para exportar en la vista actual.');
      return;
    }

    setDownloadingQrZip(true);
    try {
      const JSZip = (await import('jszip')).default;
      const QRCodeModule = await import('qrcode');
      const toDataURL = QRCodeModule?.toDataURL || QRCodeModule?.default?.toDataURL;
      if (typeof toDataURL !== 'function') {
        throw new Error('No se pudo inicializar el generador QR');
      }
      const zip = new JSZip();
      const courseLabel = sanitizeFileName(cursoSeleccionadoNombre || `curso_${cursoSeleccionado || ''}`) || 'curso';
      const folder = zip.folder(`qr_${courseLabel}`);
      if (!folder) {
        throw new Error('No se pudo crear la carpeta ZIP');
      }

      for (let index = 0; index < studentsWithQr.length; index += 1) {
        const student = studentsWithQr[index];
        const qrValue = String(student?.qr || '').trim();
        const fullName = String(student?.nombre || `${student?.nombres || ''} ${student?.apellidos || ''}`).trim();
        const safeName = sanitizeFileName(fullName) || `estudiante_${index + 1}`;
        const pngBase64 = await toDataURL(qrValue, {
          errorCorrectionLevel: 'H',
          margin: 2,
          width: 640
        });
        const pureBase64 = String(pngBase64).split(',')[1] || '';
        folder.file(`${String(index + 1).padStart(3, '0')}_${safeName}.png`, pureBase64, { base64: true });
      }

      const zipName = `qrs_${courseLabel}_${new Date().toISOString().slice(0, 10)}.zip`;

      if (Platform.OS === 'web') {
        const blob = await zip.generateAsync({ type: 'blob' });
        const nav = typeof window !== 'undefined' ? window.navigator : null;
        if (nav && typeof nav.msSaveOrOpenBlob === 'function') {
          nav.msSaveOrOpenBlob(blob, zipName);
        } else {
          const url = URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = zipName;
          anchor.style.display = 'none';
          document.body.appendChild(anchor);
          anchor.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          document.body.removeChild(anchor);
          setTimeout(() => URL.revokeObjectURL(url), 1500);
        }
        Alert.alert('Listo', `Se descargo el ZIP con ${studentsWithQr.length} QR(s).`);
      } else {
        const zipBase64 = await zip.generateAsync({ type: 'base64' });
        const FileSystem = await import('expo-file-system');
        const targetDir = FileSystem.documentDirectory || FileSystem.cacheDirectory;
        if (!targetDir) throw new Error('No se encontro una carpeta valida para guardar el ZIP');
        const fileUri = `${targetDir}${zipName}`;
        await FileSystem.writeAsStringAsync(fileUri, zipBase64, {
          encoding: FileSystem.EncodingType.Base64
        });
        try {
          const Sharing = await import('expo-sharing');
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri, {
              mimeType: 'application/zip',
              dialogTitle: 'QR de estudiantes'
            });
          }
        } catch {}
        Alert.alert('Listo', `ZIP generado con ${studentsWithQr.length} QR(s).`);
      }
    } catch (e) {
      Alert.alert('Error', getApiErrorMessage(e, `No se pudo generar/descargar el ZIP de codigos QR${e?.message ? `: ${e.message}` : ''}`));
    } finally {
      setDownloadingQrZip(false);
    }
  };

  const buildAutoQrCode = (nombres = '', apellidos = '', seed = '') => {
    const normalizeChunk = (value) => String(value || '')
      .trim()
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Z0-9]+/g, '')
      .slice(0, 6);
    const baseNombres = normalizeChunk(nombres) || 'EST';
    const baseApellidos = normalizeChunk(apellidos) || 'AUTO';
    const randomChunk = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}${String(seed || '')}`
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 10);
    return `QR-${baseNombres}-${baseApellidos}-${randomChunk}`;
  };

  const parseSpreadsheetRows = async (fileData) => {
    if (!fileData) return [];
    const XLSX = await import('xlsx');
    const workbook = fileData?.arrayBuffer
      ? XLSX.read(fileData.arrayBuffer, { type: 'array' })
      : XLSX.read(String(fileData?.base64 || ''), { type: 'base64' });
    const firstSheetName = workbook?.SheetNames?.[0];
    if (!firstSheetName) return [];
    const firstSheet = workbook.Sheets[firstSheetName];
    const matrix = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' });
    if (!Array.isArray(matrix) || matrix.length < 2) return [];

    const normalizeHeader = (value = '') => String(value || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const headers = (Array.isArray(matrix[0]) ? matrix[0] : []).map(normalizeHeader);
    const nonEmptyHeaders = headers.filter(Boolean);
    const allowedHeaders = new Set(['nombre', 'nombres', 'apellidos']);
    const hasInvalidHeader = nonEmptyHeaders.some((header) => !allowedHeaders.has(header));
    const nameHeadersCount = nonEmptyHeaders.filter((header) => header === 'nombre' || header === 'nombres').length;
    const lastNameHeadersCount = nonEmptyHeaders.filter((header) => header === 'apellidos').length;
    if (hasInvalidHeader || nonEmptyHeaders.length !== 2 || nameHeadersCount !== 1 || lastNameHeadersCount !== 1) {
      return [];
    }
    const idxNombres = headers.indexOf('nombres') >= 0 ? headers.indexOf('nombres') : headers.indexOf('nombre');
    const idxApellidos = headers.indexOf('apellidos');
    if (idxNombres < 0 || idxApellidos < 0) return [];

    return matrix.slice(1).map((row = [], index) => {
      const cols = Array.isArray(row) ? row : [];
      const nombres = String(cols[idxNombres] || '').trim();
      const apellidos = String(cols[idxApellidos] || '').trim();
      return {
        nombres,
        apellidos,
        qr: buildAutoQrCode(nombres, apellidos, `xls-${index + 1}`),
        codigoEstudiante: ''
      };
    }).filter((row) => row.nombres && row.apellidos);
  };

  const openCreateEstudianteModal = async (preferredCursoId = null) => {
    setEstudianteCreateModalVisible(true);
    setEstudianteCreateCursoPickerOpen(false);
    setEstudianteCreateError('');
    setEstudianteCreateForm({ nombres: '', apellidos: '' });
    setEstudianteCreateMaterias([]);
    setSelectedCsvFile(null);
    setUploadedStudents([]);
    setLoadingCursos(true);
    try {
      const schoolId = user?.schoolId || null;
      const cursos = await loadCursosAsignados(schoolId);
      const preferredExists = cursos.some((curso) => String(curso.id) === String(preferredCursoId));
      const nextCursoId = preferredExists ? preferredCursoId : (cursos?.[0]?.id || null);
      setEstudianteCreateCursoId(nextCursoId);
      setEstudianteCreateMaterias(getMateriasDisponiblesByCurso(nextCursoId));
    } catch (e) {
      setEstudianteCreateError(e?.response?.data?.error || 'No se pudieron cargar los cursos');
    } finally {
      setLoadingCursos(false);
    }
  };

  const changeEstudianteCreateCurso = (cursoId) => {
    setEstudianteCreateCursoId(cursoId);
    setEstudianteCreateCursoPickerOpen(false);
    setEstudianteCreateMaterias(getMateriasDisponiblesByCurso(cursoId));
  };

  const toggleEstudianteCreateMateria = (materiaNombre) => {
    const materia = String(materiaNombre || '').trim();
    const materiaKey = normalizeMateriaOption(materia);
    if (!materiaKey) return;
    setEstudianteCreateMaterias((prev) => {
      const exists = prev.some((item) => normalizeMateriaOption(item) === materiaKey);
      if (exists) {
        return prev.filter((item) => normalizeMateriaOption(item) !== materiaKey);
      }
      return [...prev, materia];
    });
  };

  const closeCreateEstudianteModal = () => {
    setEstudianteCreateModalVisible(false);
    setEstudianteCreateCursoPickerOpen(false);
    setEstudianteCreateError('');
    setEstudianteCreateCursoId(null);
    setEstudianteCreateMaterias([]);
    setEstudianteCreateForm({ nombres: '', apellidos: '' });
    setSelectedCsvFile(null);
    setUploadedStudents([]);
    setSavingEstudiante(false);
  };

  const handleImportCsv = async () => {
    setEstudianteCreateError('');
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      input.onchange = async (event) => {
        const file = event?.target?.files?.[0];
        if (!file) return;
        const dotIdx = file.name.lastIndexOf('.');
        const ext = dotIdx >= 0 ? file.name.slice(dotIdx + 1).toLowerCase() : '';
        if (!['xls', 'xlsx'].includes(ext)) {
          setEstudianteCreateError('El archivo debe ser .xls o .xlsx');
          return;
        }
        const arrayBuffer = await file.arrayBuffer();
        setSelectedCsvFile({ name: file.name, ext, arrayBuffer });
      };
      input.click();
      return;
    }

    try {
      const DocumentPicker = await import('expo-document-picker');
      const FileSystem = await import('expo-file-system');
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/octet-stream'
        ],
        copyToCacheDirectory: true,
        multiple: false
      });
      if (result.canceled) return;
      const file = result.assets?.[0];
      if (!file?.uri) return;
      const name = file.name || file.uri.split('/').pop() || 'archivo.xlsx';
      const dotIdx = name.lastIndexOf('.');
      const ext = dotIdx >= 0 ? name.slice(dotIdx + 1).toLowerCase() : '';
      if (!['xls', 'xlsx'].includes(ext)) {
        setEstudianteCreateError('El archivo debe ser .xls o .xlsx');
        return;
      }
      const base64 = await FileSystem.readAsStringAsync(file.uri, { encoding: FileSystem.EncodingType.Base64 });
      setSelectedCsvFile({ name, ext, base64 });
    } catch (e) {
      setEstudianteCreateError('No se pudo abrir el selector de archivos del dispositivo.');
    }
  };

  const handleUploadCsv = async () => {
    const cursoId = Number(estudianteCreateCursoId);
    const materiasSeleccionadas = estudianteCreateMaterias.filter((materia) => (
      estudianteCreateMateriasDisponibles.some((item) => normalizeMateriaOption(item) === normalizeMateriaOption(materia))
    ));
    if (!Number.isFinite(cursoId) || cursoId <= 0) {
      setEstudianteCreateError('Selecciona un curso antes de subir el archivo');
      return;
    }
    if (estudianteCreateMateriasDisponibles.length > 0 && materiasSeleccionadas.length === 0) {
      setEstudianteCreateError('Selecciona al menos una materia del curso');
      return;
    }
    if (!selectedCsvFile?.arrayBuffer && !selectedCsvFile?.base64) {
      setEstudianteCreateError('Primero selecciona un archivo XLS o XLSX');
      return;
    }
    const estudiantes = await parseSpreadsheetRows(selectedCsvFile);
    if (!estudiantes.length) {
      setEstudianteCreateError('Archivo Excel invalido. Solo se permiten las columnas: nombre(s),apellidos');
      return;
    }
    setSavingEstudiante(true);
    setEstudianteCreateError('');
    try {
      const data = await createEstudiantesLote({ cursoId, estudiantes, materias: materiasSeleccionadas });
      setUploadedStudents(Array.isArray(data?.students) ? data.students : estudiantes);
      Alert.alert('Listo', `Se cargaron ${data?.created || estudiantes.length} estudiantes`);
    } catch (e) {
      setEstudianteCreateError(getApiErrorMessage(e, 'No se pudo subir el archivo Excel'));
    } finally {
      setSavingEstudiante(false);
    }
  };

  const handleCreateEstudiante = async () => {
    const nombres = (estudianteCreateForm.nombres || '').trim();
    const apellidos = (estudianteCreateForm.apellidos || '').trim();
    const qr = buildAutoQrCode(nombres, apellidos, 'manual');
    const cursoId = Number(estudianteCreateCursoId);
    const materiasSeleccionadas = estudianteCreateMaterias.filter((materia) => (
      estudianteCreateMateriasDisponibles.some((item) => normalizeMateriaOption(item) === normalizeMateriaOption(materia))
    ));
    if (!nombres || !apellidos) {
      setEstudianteCreateError('Completa nombres y apellidos');
      return;
    }
    if (!Number.isFinite(cursoId) || cursoId <= 0) {
      setEstudianteCreateError('Selecciona un curso');
      return;
    }
    if (estudianteCreateMateriasDisponibles.length > 0 && materiasSeleccionadas.length === 0) {
      setEstudianteCreateError('Selecciona al menos una materia del curso');
      return;
    }
    setSavingEstudiante(true);
    setEstudianteCreateError('');
    try {
      await createEstudiante({ nombres, apellidos, qr, cursoId, materias: materiasSeleccionadas });
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
    hideColegiosSuccess({ animated: false });
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
    hideColegiosSuccess({ animated: false });
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
    const payload = {
      nombre,
      codigoDane,
      rectorCargo,
      rectorNombre: rectorNombreValue,
      rectorApellido: rectorApellidoValue,
      rectorCorreo: rectorCorreoValue,
      rectorTelefono: rectorTelefonoValue,
      rectorCedula: rectorCedulaValue
    };
    if (passwordDraft) {
      payload.rectorPassword = passwordDraft;
    }
    if (!nombre) return Alert.alert('Nombre requerido', 'Ingresa un nombre para el colegio');
    if (!colegioEditing) {
      if (!codigoDane) return Alert.alert('Codigo DANE requerido', 'Ingresa el codigo DANE de la institucion');
      if (!rectorNombreValue) return Alert.alert('Nombre requerido', 'Ingresa el nombre del directivo');
      if (!rectorApellidoValue) return Alert.alert('Apellido requerido', 'Ingresa el apellido del directivo');
      if (!rectorCorreoValue) return Alert.alert('Correo requerido', 'Ingresa el correo del directivo');
      if (!rectorTelefonoValue) return Alert.alert('Telefono requerido', 'Ingresa el telefono del directivo');
      if (!rectorCedulaValue) return Alert.alert('Cedula requerida', 'Ingresa la cedula del directivo');
      if (!passwordDraft) return Alert.alert('Contrasena requerida', 'Ingresa la contrasena del directivo');
    }
    setSavingColegio(true);
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

  useEffect(() => {
    if (!estudianteCreateModalVisible || !estudianteCreateCursoId) return;
    const disponibles = getMateriasDisponiblesByCurso(estudianteCreateCursoId);
    setEstudianteCreateMaterias((prev) => {
      if (!disponibles.length) return [];
      const next = prev.filter((materia) => disponibles.some((item) => normalizeMateriaOption(item) === normalizeMateriaOption(materia)));
      return next.length ? next : disponibles;
    });
  }, [docentePerfilCursos, estudianteCreateCursoId, estudianteCreateModalVisible]);

  useEffect(() => {
    if (!estudiantesModalVisible || estudianteMateriaFiltro === ALL_MATERIAS_OPTION) return;
    const disponibles = cursoSeleccionado
      ? getEstudianteMateriaOptionsByCurso(cursoSeleccionado, estudiantes)
      : [];
    const exists = disponibles.some(
      (materia) => normalizeMateriaOption(materia) === normalizeMateriaOption(estudianteMateriaFiltro)
    );
    if (!exists) {
      setEstudianteMateriaFiltro(ALL_MATERIAS_OPTION);
    }
  }, [cursoSeleccionado, docentePerfilCursos, estudianteMateriaFiltro, estudiantes, estudiantesModalVisible]);

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
    setShowDocentePassword(false);
    setDocenteCursos([]);
    docenteMateriasDraftRef.current = {};
    setDocenteMateriasDraft({});
    setDocenteCursosDisponibles([]);
    setDocenteColegioId(user?.schoolId || null);
    setDocenteColegioPickerOpen(false);
    setDocenteError('');
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
    setShowDocentePassword(false);
    setDocenteCursos([]);
    docenteMateriasDraftRef.current = {};
    setDocenteMateriasDraft({});
    setDocenteCursosDisponibles([]);
    setDocenteColegioId(null);
    setDocenteColegioPickerOpen(false);
    setDocenteError('');
    setAdminDocentesSearchTerm('');
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
    setShowDocentePassword(false);
    setDocenteCursos([]);
    docenteMateriasDraftRef.current = {};
    setDocenteMateriasDraft({});
    setDocenteCursosDisponibles([]);
    setDocenteError('');
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
  }, [docenteCrudModalVisible, docenteColegioId]);

  useEffect(() => {
    const parsedSchoolId = Number(docenteColegioId);
    if (!docenteCrudListModalVisible || !Number.isFinite(parsedSchoolId) || parsedSchoolId <= 0) return;
    loadDocentesActual(parsedSchoolId);
  }, [docenteColegioId, docenteCrudListModalVisible]);

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
    setShowDocentePassword(false);
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

  const openAdminDocenteEditModal = async (docente) => {
    setDocenteEditing(docente);
    setDocenteForm({ nombre: docente.nombre || '', email: docente.email || '', password: '' });
    setShowDocentePassword(false);
    setDocenteError('');
    const targetSchoolId = Number(docente.schoolId || docenteColegioId || user?.schoolId || null);
    if (Number.isFinite(targetSchoolId) && targetSchoolId > 0) {
      setDocenteColegioId(targetSchoolId);
      docenteCrudSchoolRef.current = targetSchoolId;
    }
    setAdminDocenteEditModalVisible(true);
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

  const closeAdminDocenteEditModal = () => {
    setAdminDocenteEditModalVisible(false);
    setDocenteEditing(null);
    setDocenteForm({ nombre: '', email: '', password: '' });
    setShowDocentePassword(false);
    setDocenteCursos([]);
    setDocenteMateriasState({});
    setDocenteError('');
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

    if (selectedCursoIds.length > 0) {
      const cursosSinMaterias = selectedCursoIds.filter((cursoId) => parseMateriasTexto(docenteMateriasDraftRef.current?.[cursoId]).length === 0);
      if (cursosSinMaterias.length > 0) {
        const cursosSinMateriasLabel = cursosSinMaterias
          .map((cursoId) => docenteCursosDisponibles.find((curso) => String(curso?.id) === String(cursoId))?.nombre || `Curso ${cursoId}`)
          .join(', ');
        setDocenteError(`Ingresa al menos una materia por curso: ${cursosSinMateriasLabel}`);
        return;
      }
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
      if (password) {
        const previewDocenteId = Number(savedDocente?.id || editingDocenteId);
        if (Number.isFinite(previewDocenteId) && previewDocenteId > 0) {
          setDocenteAccessPreviewById((prev) => ({ ...prev, [previewDocenteId]: password }));
        }
      }
      await loadDocentesActual(payload.schoolId);
      if (isEditingDocente) {
        const cursosActualizados = (savedDocente?.cursos || []).map((curso) => curso.id);
        const materiasDraft = buildDocenteMateriasDraft(savedDocente?.cursos || []);
        setDocenteEditing(savedDocente || editingDocenteSnapshot);
        setDocenteCursos(cursosActualizados.length ? cursosActualizados : selectedCursoIds);
        syncDocenteMateriasWithCursos(cursosActualizados.length ? cursosActualizados : selectedCursoIds, materiasDraft);
        showPeriodStatusModal('Docente actualizado');
        if (isAdmin && adminDocenteEditModalVisible) {
          setDocenteEditing(null);
          setDocenteForm({ nombre: '', email: '', password: '' });
          setShowDocentePassword(false);
          setDocenteCursos([]);
          setDocenteMateriasState({});
          setDocenteError('');
          setAdminDocenteEditModalVisible(false);
        } else {
          await returnToDocenteCrudListModal(payload.schoolId);
        }
      } else {
        setDocenteForm({ nombre: '', email: '', password: '' });
        setShowDocentePassword(false);
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
      setDocenteAccessPreviewById((prev) => {
        const next = { ...prev };
        delete next[docente.id];
        return next;
      });
      if (String(docenteEditing?.id) === String(docente.id)) {
        setDocenteEditing(null);
        setDocenteForm({ nombre: '', email: '', password: '' });
        setShowDocentePassword(false);
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
    setDocentesModalVisible(false);
    await openDocenteCrudListModal(user?.schoolId || colegioSeleccionado || null);
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

  const openAdminCursoForm = (curso = null) => {
    if (curso) {
      setAdminCursoEditing(curso);
      setAdminCursoNombre(curso.nombre || '');
    } else {
      setAdminCursoEditing(null);
      setAdminCursoNombre('');
    }
    setAdminCursoFormVisible(true);
  };

  const openRectorCursoForm = (curso = null) => {
    if (curso) {
      setRectorCursoEditing(curso);
      setRectorCursoNombre(curso.nombre || '');
    } else {
      setRectorCursoEditing(null);
      setRectorCursoNombre('');
    }
    setRectorCursoFormVisible(true);
  };

  const handleSaveAdminCurso = async () => {
    const nombre = adminCursoNombre.trim();
    if (!nombre) return Alert.alert('Nombre requerido', 'Ingresa un nombre para el curso');
    const schoolId = Number(cursoCrudColegioId || user?.schoolId);
    if (!Number.isFinite(schoolId) || schoolId <= 0) {
      return Alert.alert('Colegio requerido', 'Selecciona un colegio antes de guardar el curso');
    }
    setSavingCurso(true);
    setLoadingCursos(true);
    try {
      if (adminCursoEditing) {
        await updateCurso(adminCursoEditing.id, { nombre, schoolId });
      } else {
        await createCurso({ nombre, schoolId });
      }
      await loadCursosAsignados(schoolId);
      setAdminCursoFormVisible(false);
      setAdminCursoEditing(null);
      setAdminCursoNombre('');
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.error || 'No se pudo guardar el curso');
    } finally {
      setSavingCurso(false);
      setLoadingCursos(false);
    }
  };

  const handleSaveRectorCurso = async () => {
    const nombre = rectorCursoNombre.trim();
    if (!nombre) return Alert.alert('Nombre requerido', 'Ingresa un nombre para el curso');
    const schoolId = Number(user?.schoolId || cursoCrudColegioId);
    if (!Number.isFinite(schoolId) || schoolId <= 0) {
      return Alert.alert('Colegio requerido', 'No se encontro colegio para este usuario');
    }
    setSavingCurso(true);
    setLoadingCursos(true);
    try {
      if (rectorCursoEditing) {
        await updateCurso(rectorCursoEditing.id, { nombre, schoolId });
      } else {
        await createCurso({ nombre, schoolId });
      }
      await loadCursosAsignados(schoolId);
      setRectorCursoFormVisible(false);
      setRectorCursoEditing(null);
      setRectorCursoNombre('');
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
  const estudianteCreateMateriasDisponibles = estudianteCreateCursoId
    ? getMateriasDisponiblesByCurso(estudianteCreateCursoId)
    : [];
  const estudiantesMateriasDisponibles = cursoSeleccionado
    ? getEstudianteMateriaOptionsByCurso(cursoSeleccionado, estudiantes)
    : [];
  const estudiantesFiltrados = estudianteMateriaFiltro !== ALL_MATERIAS_OPTION
    ? estudiantes.filter((estudiante) => (
      Array.isArray(estudiante?.materias)
      && estudiante.materias.some((materia) => normalizeMateriaOption(materia) === normalizeMateriaOption(estudianteMateriaFiltro))
    ))
    : estudiantes;
  const reportesCursoNombre = reportesCursoId
    ? (reportesCursos.find((curso) => String(curso.id) === String(reportesCursoId))?.nombre || 'Curso sin nombre')
    : 'Selecciona curso';
  const mobileActionBtnStyle = isMobileApp ? styles.actionBtnMobile : null;
  const mobileActionTextStyle = isMobileApp ? styles.actionBtnTextMobile : null;
  const mobileBtnRowStyle = isMobileApp ? styles.btnRowMobile : null;
  const mobileDocenteRowStyle = isDocente && isMobileApp ? styles.btnRowMobileStacked : null;
  const mobileDocenteTextStyle = isDocente && isMobileApp ? styles.actionBtnTextMobileStacked : null;
  const mobileLongLabelRowStyle = (isRectorCoordinador || isAdmin) && isMobileApp ? styles.btnRowMobileStacked : null;
  const mobileLongLabelTextStyle = (isRectorCoordinador || isAdmin) && isMobileApp ? styles.actionBtnTextMobileStacked : null;
  const mobileGridLogoutRowStyle = isDocente ? mobileDocenteRowStyle : mobileLongLabelRowStyle;
  const mobileGridLogoutTextStyle = isDocente ? mobileDocenteTextStyle : mobileLongLabelTextStyle;
  const mobileColegioControlsRowStyle = isMobileApp ? styles.colegioControlsRowMobile : null;
  const mobileColegioControlBtnStyle = isMobileApp ? styles.colegioControlBtnMobile : null;
  const mobileColegioControlRowStyle = isMobileApp ? styles.colegioControlBtnRowMobile : null;
  const mobileColegioControlTextStyle = isMobileApp ? styles.colegioControlBtnTextMobile : null;
  const isForcedPasswordChange = Boolean(user?.mustChangePassword);
  const showMobileGridLogout = isMobileApp && !isRectorCoordinador && !isDocente && !isAdmin;
  const docenteMateriasAsignadasTotal = docentePerfilCursos.reduce(
    (total, curso) => total + (Array.isArray(curso?.materias) ? curso.materias.length : 0),
    0
  );
  const docentesSearchNormalized = normalizeSearchText(docentesSearchTerm);
  const docentesFiltrados = docentesSearchNormalized
    ? docentes.filter((docente) => normalizeSearchText(docente?.nombre || '').includes(docentesSearchNormalized))
    : docentes;
  const docentesSearchSuggestions = docentesSearchNormalized
    ? docentesFiltrados.slice(0, 6)
    : [];
  const adminDocentesSearchNormalized = normalizeSearchText(adminDocentesSearchTerm);
  const adminDocentesFiltrados = adminDocentesSearchNormalized
    ? docentes.filter((docente) => {
      const nombre = normalizeSearchText(docente?.nombre || '');
      const correo = normalizeSearchText(docente?.email || '');
      const cursosText = normalizeSearchText(
        Array.isArray(docente?.cursos)
          ? docente.cursos.map((curso) => curso?.nombre || `curso ${curso?.id || ''}`).join(' ')
          : ''
      );
      const materiasText = normalizeSearchText(
        Array.isArray(docente?.cursos)
          ? docente.cursos
            .flatMap((curso) => (Array.isArray(curso?.materias) ? curso.materias : []))
            .join(' ')
          : ''
      );
      const blob = `${nombre} ${correo} ${cursosText} ${materiasText}`;
      return blob.includes(adminDocentesSearchNormalized);
    })
    : docentes;
  const rectoresSearchNormalized = normalizeSearchText(rectoresSearchTerm);
  const rectoresRegistrados = (colegiosList || [])
    .map((item) => normalizeColegioItem(item))
    .filter((colegio) => hasDirectivoData(colegio))
    .map((colegio) => {
      const cargoValue = (colegio?.rectorCargo || 'rector').toLowerCase();
      const cargoLabel = cargoValue === 'coordinador' ? 'Coordinador' : 'Rector';
      const nombreCompleto = [colegio?.rectorNombre, colegio?.rectorApellido].filter(Boolean).join(' ').trim();
      return {
        id: colegio.id,
        cargoLabel,
        nombreCompleto,
        colegioNombre: colegio?.nombre || `Colegio ${colegio?.id}`,
        correo: colegio?.rectorCorreo || '',
        telefono: colegio?.rectorTelefono || '',
        cedula: colegio?.rectorCedula || ''
      };
    });
  const rectoresFiltrados = rectoresSearchNormalized
    ? rectoresRegistrados.filter((rector) => {
      const blob = normalizeSearchText(
        `${rector?.nombreCompleto || ''} ${rector?.colegioNombre || ''} ${rector?.correo || ''} ${rector?.telefono || ''} ${rector?.cedula || ''} ${rector?.cargoLabel || ''}`
      );
      return blob.includes(rectoresSearchNormalized);
    })
    : rectoresRegistrados;
  const realtimeContextRef = useRef({
    estudiantesModalVisible: false,
    cursoSeleccionado: null,
    reportesModalVisible: false,
    reportesCursoId: null,
    userSchoolId: null
  });
  const realtimeRefreshTimeoutRef = useRef(null);

  useEffect(() => {
    const needsForcedChange = Boolean(user?.mustChangePassword);
    if (needsForcedChange) {
      setChangePasswordModalVisible(true);
      return;
    }
    setChangePasswordModalVisible(Boolean(manualChangePasswordModalVisible));
    if (!manualChangePasswordModalVisible) clearChangePasswordForm();
  }, [user?.mustChangePassword, manualChangePasswordModalVisible]);

  useEffect(() => {
    let unsubscribe = null;
    let cancelled = false;
    (async () => {
      if (!user?.id) return;
      try {
        const cleanup = await subscribeAttendance();
        if (cancelled) {
          if (typeof cleanup === 'function') cleanup();
          return;
        }
        unsubscribe = cleanup;
      } catch {}
    })();
    return () => {
      cancelled = true;
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [subscribeAttendance, user?.id]);

  useEffect(() => {
    realtimeContextRef.current = {
      estudiantesModalVisible,
      cursoSeleccionado,
      reportesModalVisible,
      reportesCursoId,
      userSchoolId: user?.schoolId
    };
  }, [cursoSeleccionado, estudiantesModalVisible, reportesCursoId, reportesModalVisible, user?.schoolId]);

  useEffect(() => () => {
    if (realtimeRefreshTimeoutRef.current) {
      clearTimeout(realtimeRefreshTimeoutRef.current);
      realtimeRefreshTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!attendanceLastEvent) return;
    const ctx = realtimeContextRef.current;
    const eventCursoId = Number(attendanceLastEvent?.cursoId);
    const eventSchoolId = Number(attendanceLastEvent?.schoolId);
    const userSchoolId = Number(ctx?.userSchoolId);
    if (Number.isFinite(userSchoolId) && userSchoolId > 0 && Number.isFinite(eventSchoolId) && eventSchoolId > 0 && eventSchoolId !== userSchoolId) {
      return;
    }
    if (realtimeRefreshTimeoutRef.current) clearTimeout(realtimeRefreshTimeoutRef.current);
    realtimeRefreshTimeoutRef.current = setTimeout(async () => {
      try {
        if (ctx.estudiantesModalVisible && ctx.cursoSeleccionado && String(ctx.cursoSeleccionado) === String(eventCursoId)) {
          await loadEstudiantesPorCurso(ctx.cursoSeleccionado);
        }
        if (ctx.reportesModalVisible && ctx.reportesCursoId && String(ctx.reportesCursoId) === String(eventCursoId)) {
          await handleGenerateInasistenciaReport();
        }
      } catch {}
    }, 250);
  }, [attendanceLastEvent]);

  const resolveColegioNombre = (id) => {
    if (!id) return 'Selecciona colegio';
    return colegiosOptions.find(c => String(c.id) === String(id))?.nombre || `Colegio ${id}`;
  };
  const getDocenteAccessPreview = (docenteId) => {
    const draftPassword = docenteAccessPreviewById?.[docenteId];
    if (draftPassword) return draftPassword;
    return 'Protegida (no visible por seguridad)';
  };

  function sortCursosForDisplay(items = []) {
    return [...items].sort((a, b) => {
      const aName = String(a?.nombre || '').trim();
      const bName = String(b?.nombre || '').trim();
      return aName.localeCompare(bName, undefined, { numeric: true, sensitivity: 'base' });
    });
  }

  function normalizeMateriaOption(value = '') {
    return String(value || '').trim().toLowerCase();
  }

  function getMateriasDisponiblesByCurso(cursoId) {
    const curso = (docentePerfilCursos || []).find((item) => String(item?.id) === String(cursoId));
    const uniques = [];
    const seen = new Set();
    (Array.isArray(curso?.materias) ? curso.materias : [])
      .map((materia) => String(materia || '').trim())
      .filter(Boolean)
      .forEach((materia) => {
        const key = normalizeMateriaOption(materia);
        if (!key || seen.has(key)) return;
        seen.add(key);
        uniques.push(materia);
      });
    return uniques.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  }

  function getEstudianteMateriaOptionsByCurso(cursoId, estudianteList = []) {
    const uniques = [];
    const seen = new Set();
    const pushMateria = (materia) => {
      const value = String(materia || '').trim();
      const key = normalizeMateriaOption(value);
      if (!key || seen.has(key)) return;
      seen.add(key);
      uniques.push(value);
    };

    getMateriasDisponiblesByCurso(cursoId).forEach(pushMateria);
    (Array.isArray(estudianteList) ? estudianteList : []).forEach((estudiante) => {
      (Array.isArray(estudiante?.materias) ? estudiante.materias : []).forEach(pushMateria);
    });

    return uniques.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  }

  const colegioSeleccionadoNombre = resolveColegioNombre(colegioSeleccionado);
  const reportesColegioNombre = resolveColegioNombre(reportesColegioId || user?.schoolId);

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

          <View style={[styles.actionGrid, isRectorCoordinador && styles.actionGridRector, isMobileApp && styles.actionGridMobile]}>
            {isDocente ? (
              <>
                <TouchableOpacity style={[styles.actionBtn, mobileActionBtnStyle, { backgroundColor: '#22c55e' }]} onPress={() => navigation.navigate('QR')}>
                  <View style={[styles.btnRow, mobileBtnRowStyle, mobileDocenteRowStyle]}>
                    <Ionicons name="qr-code-outline" size={18} color="#fff" />
                    <Text style={[styles.actionBtnText, mobileActionTextStyle, mobileDocenteTextStyle]}>Escanear QR</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, mobileActionBtnStyle, { backgroundColor: '#a78bfa' }]} onPress={openEstudiantesModal}>
                  <View style={[styles.btnRow, mobileBtnRowStyle, mobileDocenteRowStyle]}>
                    <Ionicons name="people-outline" size={18} color="#fff" />
                    <Text style={[styles.actionBtnText, styles.actionBtnTextCompact, mobileActionTextStyle, mobileDocenteTextStyle]}>Ver estudiantes</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, mobileActionBtnStyle, { backgroundColor: '#2563eb' }]} onPress={() => setDocentePanelModalVisible(true)}>
                  <View style={[styles.btnRow, mobileBtnRowStyle, mobileDocenteRowStyle]}>
                    <Ionicons name="school-outline" size={18} color="#fff" />
                    <Text style={[styles.actionBtnText, styles.actionBtnTextCompact, mobileActionTextStyle, mobileDocenteTextStyle]}>Panel docente</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, mobileActionBtnStyle, { backgroundColor: '#0ea5a4' }]} onPress={openManualChangePasswordModal}>
                  <View style={[styles.btnRow, mobileBtnRowStyle, mobileDocenteRowStyle]}>
                    <Ionicons name="key-outline" size={18} color="#fff" />
                    <Text style={[styles.actionBtnText, styles.actionBtnTextCompact, mobileActionTextStyle, mobileDocenteTextStyle]}>Cambiar contrasena</Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.docenteGridLogoutRow}>
                  <TouchableOpacity style={[styles.actionBtn, mobileActionBtnStyle, styles.logoutActionBtn, styles.docenteGridLogoutCentered]} onPress={logout} activeOpacity={0.85}>
                    <View style={[styles.btnRow, mobileBtnRowStyle, mobileDocenteRowStyle]}>
                      <Ionicons name="log-out-outline" size={18} color="#fff" />
                      <Text style={[styles.actionBtnText, styles.actionBtnTextCompact, mobileActionTextStyle, mobileDocenteTextStyle]}>Cerrar sesion</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                {!isAdmin && !isRectorCoordinador ? (
                  <TouchableOpacity style={[styles.actionBtn, mobileActionBtnStyle, { backgroundColor: '#22c55e' }]} onPress={() => navigation.navigate('QR')}>
                    <View style={[styles.btnRow, mobileBtnRowStyle]}>
                      <Ionicons name="qr-code-outline" size={18} color="#fff" />
                      <Text style={[styles.actionBtnText, mobileActionTextStyle]}>Escanear QR</Text>
                    </View>
                  </TouchableOpacity>
                ) : null}
                {canManageCourses && !isAdmin ? (
                  <TouchableOpacity
                    style={[styles.actionBtn, isRectorCoordinador && styles.actionBtnRector, mobileActionBtnStyle, { backgroundColor: '#38bdf8' }]}
                    onPress={isAdmin ? openAdminCursosModal : openRectorCursosModal}
                  >
                    <View style={[styles.btnRow, mobileBtnRowStyle, mobileLongLabelRowStyle]}>
                      <Ionicons name="book-outline" size={18} color="#fff" />
                      <Text style={[styles.actionBtnText, isRectorCoordinador && styles.actionBtnTextCompact, mobileActionTextStyle, mobileLongLabelTextStyle]}>{isRectorCoordinador ? 'Crear cursos' : 'Crear cursos'}</Text>
                    </View>
                  </TouchableOpacity>
                ) : null}
                {!isAdmin && !isRectorCoordinador ? (
                  <TouchableOpacity style={[styles.actionBtn, mobileActionBtnStyle, { backgroundColor: '#a78bfa' }]} onPress={openEstudiantesModal}>
                    <View style={[styles.btnRow, mobileBtnRowStyle]}>
                      <Ionicons name="people-outline" size={18} color="#fff" />
                      <Text style={[styles.actionBtnText, mobileActionTextStyle]}>Estudiantes</Text>
                    </View>
                  </TouchableOpacity>
                ) : null}
                {isAdmin ? (
                  <TouchableOpacity style={[styles.actionBtn, mobileActionBtnStyle, { backgroundColor: '#14b8a6' }]} onPress={openDocenteCrudModal}>
                    <View style={[styles.btnRow, mobileBtnRowStyle, mobileLongLabelRowStyle]}>
                      <Ionicons name="person-add-outline" size={18} color="#fff" />
                      <Text style={[styles.actionBtnText, mobileActionTextStyle, mobileLongLabelTextStyle]}>Ver docentes</Text>
                    </View>
                  </TouchableOpacity>
                ) : null}
                {isRectorCoordinador ? (
                  <TouchableOpacity style={[styles.actionBtn, styles.actionBtnRector, mobileActionBtnStyle, { backgroundColor: '#14b8a6' }]} onPress={openDocenteCrudModal}>
                    <View style={[styles.btnRow, mobileBtnRowStyle, mobileLongLabelRowStyle]}>
                      <Ionicons name="person-add-outline" size={18} color="#fff" />
                      <Text style={[styles.actionBtnText, styles.actionBtnTextCompact, mobileActionTextStyle, mobileLongLabelTextStyle]}>Crear docentes</Text>
                    </View>
                  </TouchableOpacity>
                ) : null}
                {isRectorCoordinador ? (
                  <TouchableOpacity style={[styles.actionBtn, styles.actionBtnRector, mobileActionBtnStyle, { backgroundColor: '#2563eb' }]} onPress={openDocentesModal}>
                    <View style={[styles.btnRow, mobileBtnRowStyle, mobileLongLabelRowStyle]}>
                      <Ionicons name="people-outline" size={18} color="#fff" />
                      <Text style={[styles.actionBtnText, styles.actionBtnTextCompact, mobileActionTextStyle, mobileLongLabelTextStyle]}>Ver docentes</Text>
                    </View>
                  </TouchableOpacity>
                ) : null}
                {isAdmin ? (
                  <TouchableOpacity style={[styles.actionBtn, mobileActionBtnStyle, { backgroundColor: '#facc15' }]} onPress={openColegiosModal}>
                    <View style={[styles.btnRow, mobileBtnRowStyle, mobileLongLabelRowStyle]}>
                      <Ionicons name="business-outline" size={18} color="#111" />
                      <Text style={[styles.actionBtnText, mobileActionTextStyle, mobileLongLabelTextStyle, { color: '#111' }]}>Crear colegios</Text>
                    </View>
                  </TouchableOpacity>
                ) : null}
                {isAdmin ? (
                  <TouchableOpacity style={[styles.actionBtn, mobileActionBtnStyle, { backgroundColor: '#10b981' }]} onPress={openRectoresListModal}>
                    <View style={[styles.btnRow, mobileBtnRowStyle, mobileLongLabelRowStyle]}>
                      <Ionicons name="people-circle-outline" size={18} color="#fff" />
                      <Text style={[styles.actionBtnText, mobileActionTextStyle, mobileLongLabelTextStyle]}>Ver rectores</Text>
                    </View>
                  </TouchableOpacity>
                ) : null}
                {isRectorCoordinador && canManagePeriods ? (
                  <TouchableOpacity style={[styles.actionBtn, styles.actionBtnRector, mobileActionBtnStyle, { backgroundColor: '#7c3aed' }]} onPress={openPeriodManagerModal}>
                    <View style={[styles.btnRow, mobileBtnRowStyle, mobileLongLabelRowStyle]}>
                      <Ionicons name="calendar-outline" size={18} color="#fff" />
                      <Text style={[styles.actionBtnText, styles.actionBtnTextCompact, mobileActionTextStyle, mobileLongLabelTextStyle]}>Periodos activos</Text>
                    </View>
                  </TouchableOpacity>
                ) : null}
                {isRectorCoordinador ? (
                  <TouchableOpacity style={[styles.actionBtn, styles.actionBtnRector, mobileActionBtnStyle, styles.logoutActionBtn]} onPress={logout} activeOpacity={0.85}>
                    <View style={[styles.btnRow, mobileBtnRowStyle, mobileLongLabelRowStyle]}>
                      <Ionicons name="log-out-outline" size={18} color="#fff" />
                      <Text style={[styles.actionBtnText, styles.actionBtnTextCompact, mobileActionTextStyle, mobileLongLabelTextStyle]}>Cerrar sesion</Text>
                    </View>
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                  style={[styles.actionBtn, isRectorCoordinador && styles.actionBtnRector, mobileActionBtnStyle, { backgroundColor: '#f97316' }]}
                  onPress={(isRectorCoordinador || isAdmin) ? openReportesModal : () => openQuickModal('reportes')}
                >
                  <View style={[styles.btnRow, mobileBtnRowStyle, mobileLongLabelRowStyle]}>
                    <Ionicons name="bar-chart-outline" size={18} color="#fff" />
                    <Text style={[styles.actionBtnText, (isRectorCoordinador || isAdmin) && styles.actionBtnTextCompact, mobileActionTextStyle, mobileLongLabelTextStyle]}>{(isRectorCoordinador || isAdmin) ? 'Ver reportes' : 'Reportes'}</Text>
                  </View>
                </TouchableOpacity>
                {isRectorCoordinador ? (
                  <TouchableOpacity style={[styles.actionBtn, styles.actionBtnRector, mobileActionBtnStyle, { backgroundColor: '#0ea5a4' }]} onPress={openManualChangePasswordModal}>
                    <View style={[styles.btnRow, mobileBtnRowStyle, mobileLongLabelRowStyle]}>
                      <Ionicons name="key-outline" size={18} color="#fff" />
                      <Text style={[styles.actionBtnText, styles.actionBtnTextCompact, mobileActionTextStyle, mobileLongLabelTextStyle]}>Cambiar contrasena</Text>
                    </View>
                  </TouchableOpacity>
                ) : null}
                {!isRectorCoordinador && canManagePeriods ? (
                  <>
                    <TouchableOpacity style={[styles.actionBtn, mobileActionBtnStyle, { backgroundColor: '#7c3aed' }]} onPress={openPeriodManagerModal}>
                      <View style={[styles.btnRow, mobileBtnRowStyle, mobileLongLabelRowStyle]}>
                        <Ionicons name="calendar-outline" size={18} color="#fff" />
                        <Text style={[styles.actionBtnText, mobileActionTextStyle, mobileLongLabelTextStyle]}>Periodos activos</Text>
                      </View>
                    </TouchableOpacity>
                    {isAdmin ? (
                      <TouchableOpacity style={[styles.actionBtn, mobileActionBtnStyle, styles.logoutActionBtn]} onPress={logout} activeOpacity={0.85}>
                        <View style={[styles.btnRow, mobileBtnRowStyle, mobileLongLabelRowStyle]}>
                          <Ionicons name="log-out-outline" size={18} color="#fff" />
                          <Text style={[styles.actionBtnText, mobileActionTextStyle, mobileLongLabelTextStyle]}>Cerrar sesion</Text>
                        </View>
                      </TouchableOpacity>
                    ) : null}
                  </>
                ) : null}
              </>
            )}
            {showMobileGridLogout ? (
              <View style={styles.mobileLogoutRowCenter}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.actionBtnMobile, styles.logoutActionBtn, isDocente && styles.docenteGridLogoutCentered]}
                  onPress={logout}
                  activeOpacity={0.85}
                >
                  <View style={[styles.btnRow, styles.btnRowMobile, mobileGridLogoutRowStyle]}>
                    <Ionicons name="log-out-outline" size={18} color="#fff" />
                    <Text style={[styles.actionBtnText, styles.actionBtnTextMobile, mobileGridLogoutTextStyle]}>Cerrar sesion</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>

          {!isAdmin && !isDocente && !isRectorCoordinador && !showMobileGridLogout ? (
            <TouchableOpacity style={[styles.logoutBtn, isDocente && styles.docenteFooterLogoutCentered]} onPress={logout} activeOpacity={0.85}>
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
        visible={docentePanelModalVisible}
        onRequestClose={() => setDocentePanelModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, styles.docentesModalCard]}>
            <View style={styles.modalHeader}>
              <Text style={styles.periodTitle}>Panel docente</Text>
              <Pressable onPress={() => setDocentePanelModalVisible(false)} style={styles.closeBtn}>
                <View style={styles.btnRow}><Ionicons name="close-outline" size={16} color="#fecaca" /><Text style={styles.closeBtnText}>Cerrar</Text></View>
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.docentePerfilBox}>
                <View style={styles.docentePerfilHeader}>
                  <View style={styles.docentePerfilTitleWrap}>
                    <Text style={styles.docentePerfilEyebrow}>Panel docente</Text>
                    <Text style={styles.docentePerfilTitle}>Mis cursos y materias</Text>
                  </View>
                  <View style={styles.docentePerfilBadge}>
                    <Text style={styles.docentePerfilBadgeText}>
                      {docentePerfilLoading ? 'Cargando...' : `${docentePerfilCursos.length} cursos`}
                    </Text>
                  </View>
                </View>

                {!docentePerfilLoading && !docentePerfilError ? (
                  <Text style={styles.docentePerfilSummary}>
                    {docentePerfilCursos.length > 0
                      ? `Tienes ${docentePerfilCursos.length} cursos y ${docenteMateriasAsignadasTotal} materias asignadas.`
                      : 'Aun no tienes cursos o materias asignadas.'}
                  </Text>
                ) : null}

                {docentePerfilError ? <Text style={[styles.errorText, styles.docentePerfilError]}>{docentePerfilError}</Text> : null}

                {!docentePerfilLoading && !docentePerfilError && docentePerfilCursos.length === 0 ? (
                  <View style={styles.docenteMateriaEmptyCard}>
                    <Ionicons name="school-outline" size={18} color="#93c5fd" />
                    <Text style={styles.docenteMateriaEmptyText}>No tienes materias asignadas</Text>
                  </View>
                ) : (
                  <View style={styles.docenteMateriaList}>
                    {docentePerfilCursos.map((curso) => {
                      const materias = Array.isArray(curso?.materias) ? curso.materias : [];
                      return (
                        <View key={`mis-materias-${curso.id}`} style={styles.docenteMateriaCard}>
                          <View style={styles.docenteMateriaHeader}>
                            <View style={styles.docenteMateriaTitleBlock}>
                              <Text style={styles.docenteMateriaCourseLine}>
                                <Text style={styles.docenteMateriaLabelInline}>Curso </Text>
                                <Text style={styles.docenteMateriaCourse}>{curso.nombre || curso.id}</Text>
                              </Text>
                            </View>
                            <View style={styles.docenteMateriaAside}>
                              <View style={styles.docenteMateriaMetaRow}>
                                <View style={styles.docenteMateriaNamesWrap}>
                                  {materias.length > 0 ? (
                                    materias.map((materia, index) => (
                                      <View key={`mis-materias-${curso.id}-${index}`} style={styles.docenteMateriaChip}>
                                        <Text style={styles.docenteMateriaChipText}>{materia}</Text>
                                      </View>
                                    ))
                                  ) : (
                                    <Text style={[styles.docenteMateriaEmptyHint, styles.docenteMateriaEmptyHintInline]}>Sin materias asignadas</Text>
                                  )}
                                </View>
                              </View>
                            </View>
                          </View>
                          <View style={styles.docenteMateriaActionCenterRow}>
                            <TouchableOpacity
                              style={styles.docenteMateriaActionBtn}
                              onPress={() => {
                                setDocentePanelModalVisible(false);
                                openCreateEstudianteModal(curso.id);
                              }}
                              activeOpacity={0.85}
                            >
                              <View style={styles.btnRow}>
                                <Ionicons name="person-add-outline" size={13} color="#e0f2fe" />
                                <Text style={styles.docenteMateriaActionText}>Agregar estudiantes</Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

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
                <View style={styles.btnRow}><Ionicons name="close-outline" size={16} color="#fecaca" /><Text style={styles.closeBtnText}>Cerrar</Text></View>
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
                        onPress={() => changeEstudianteCreateCurso(c.id)}
                      >
                        <Text style={styles.selectText}>{c.nombre || `Curso ${c.id}`}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              ) : null}

              <Text style={styles.fieldLabel}>Materias del curso</Text>
              <View style={styles.estudianteMateriaSelectorBox}>
                {loadingCursos ? (
                  <Text style={styles.dataBullet}>Cargando materias...</Text>
                ) : estudianteCreateCursoId && estudianteCreateMateriasDisponibles.length > 0 ? (
                  <>
                    <Text style={styles.dataBullet}>Selecciona una o varias materias correspondientes a este curso.</Text>
                    <View style={styles.estudianteMateriaChipWrap}>
                      {estudianteCreateMateriasDisponibles.map((materia) => {
                        const isSelected = estudianteCreateMaterias.some((item) => normalizeMateriaOption(item) === normalizeMateriaOption(materia));
                        return (
                          <TouchableOpacity
                            key={`estudiante-materia-${estudianteCreateCursoId}-${materia}`}
                            style={[
                              styles.estudianteMateriaChip,
                              isSelected && styles.estudianteMateriaChipActive
                            ]}
                            onPress={() => toggleEstudianteCreateMateria(materia)}
                            disabled={savingEstudiante}
                          >
                            <Text
                              style={[
                                styles.estudianteMateriaChipText,
                                isSelected && styles.estudianteMateriaChipTextActive
                              ]}
                            >
                              {materia}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </>
                ) : (
                  <Text style={styles.dataBullet}>No hay materias asignadas para el curso seleccionado.</Text>
                )}
              </View>

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
              <Text style={styles.dataBullet}>El codigo QR se genera automaticamente al guardar.</Text>
              <TouchableOpacity
                style={[styles.smallBtn, styles.outlineBtn, savingEstudiante && { opacity: 0.6 }]}
                onPress={handleImportCsv}
                disabled={savingEstudiante}
              >
                <View style={styles.btnRow}>
                  <Ionicons name="document-attach-outline" size={14} color="#e5e7eb" />
                  <Text style={styles.smallBtnText}>Seleccionar archivo Excel</Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.dataBullet}>Excel (.xls/.xlsx) encabezados: nombre(s),apellidos (sin columnas extra)</Text>
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
                  <Text style={styles.smallBtnText}>{savingEstudiante ? 'Subiendo...' : 'Subir archivo Excel'}</Text>
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

      <Modal transparent animationType="slide" visible={periodModalVisible} onRequestClose={closePeriodModal}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, styles.periodModalCard]}>
            <ScrollView contentContainerStyle={[styles.modalContent, styles.periodModalContent]} showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={styles.periodTitle}>{editingPeriodo ? 'Editar periodo' : 'Crear periodo'}</Text>
                <Pressable onPress={closePeriodModal} style={styles.closeBtn}>
                  <View style={styles.btnRow}><Ionicons name="close-outline" size={16} color="#fecaca" /><Text style={styles.closeBtnText}>Cerrar</Text></View>
                </Pressable>
              </View>

              {canAdminFilterPeriodSchools ? (
                <View style={styles.dataBox}>
                  <Text style={styles.fieldLabel}>Colegio para periodos</Text>
                  <Pressable
                    style={styles.selectBoxFull}
                    onPress={() => setPeriodSchoolPickerOpen((prev) => !prev)}
                  >
                    <Text style={styles.selectText}>{periodSchoolId ? resolveColegioNombre(periodSchoolId) : 'Selecciona un colegio'}</Text>
                    <Ionicons name={periodSchoolPickerOpen ? 'chevron-up-outline' : 'chevron-down-outline'} size={16} color="#cbd5e1" />
                  </Pressable>
                  {periodSchoolPickerOpen ? (
                    <View style={styles.pickerList}>
                      {colegiosLoading ? <Text style={styles.dataBullet}>Cargando colegios...</Text> : null}
                      {colegiosOptions.length === 0 ? (
                        <Text style={styles.dataBullet}>No hay colegios disponibles</Text>
                      ) : (
                        colegiosOptions.map((c) => (
                          <Pressable
                            key={`period-school-${c.id}`}
                            style={[styles.pickerItem, String(periodSchoolId) === String(c.id) && styles.pickerItemActive]}
                            onPress={() => {
                              setPeriodSchoolId(c.id);
                              setEditingPeriodo(null);
                              setPeriodSchoolPickerOpen(false);
                            }}
                          >
                            <Text style={styles.dataItem}>{c.nombre || `Colegio ${c.id}`}</Text>
                          </Pressable>
                        ))
                      )}
                    </View>
                  ) : null}
                </View>
              ) : null}

              <Text style={styles.fieldLabel}>Nombre</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. Periodo 1"
                placeholderTextColor="#9ca3af"
                value={periodForm.nombre}
                onChangeText={(txt) => setPeriodForm(prev => ({ ...prev, nombre: txt }))}
                editable={canAdminFilterPeriodSchools ? Boolean(periodSchoolId) : true}
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

              <TouchableOpacity style={[styles.periodBtn, styles.periodSaveBtn, (savingPeriodo || (canAdminFilterPeriodSchools && !periodSchoolId)) && { opacity: 0.6 }]} onPress={handleSavePeriod} disabled={savingPeriodo || (canAdminFilterPeriodSchools && !periodSchoolId)}>
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
                <Text style={styles.periodTitle}>
                  Lista {periodSchoolId ? `- ${resolveColegioNombre(periodSchoolId)}` : ''}
                </Text>
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
        visible={adminCursosModalVisible}
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
                <Text style={styles.periodTitle}>Cursos (Administrador)</Text>
                <Pressable onPress={closeCursosModal} style={styles.closeBtn}>
                  <View style={styles.btnRow}><Ionicons name="close-outline" size={16} color="#fecaca" /><Text style={styles.closeBtnText}>Cerrar</Text></View>
                </Pressable>
              </View>

              <View style={styles.courseActionsRow}>
                <TouchableOpacity style={[styles.smallBtn, styles.createBtn]} onPress={() => openAdminCursoForm()}>
                  <View style={styles.btnRow}>
                    <Ionicons name="add-outline" size={14} color="#e5e7eb" />
                    <Text style={styles.smallBtnText}>Nuevo</Text>
                  </View>
                </TouchableOpacity>
                {loadingCursos ? <Text style={styles.dataBullet}>Cargando...</Text> : null}
              </View>

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

              {adminCursoFormVisible ? (
                <View style={styles.adminCourseForm}>
                  <Text style={styles.fieldLabel}>{adminCursoEditing ? 'Actualizar curso' : 'Nuevo curso'}</Text>
                  <TextInput
                    style={styles.adminCourseInput}
                    placeholder="Nombre del curso"
                    placeholderTextColor="#9ca3af"
                    value={adminCursoNombre}
                    editable={!savingCurso}
                    onChangeText={setAdminCursoNombre}
                  />
                  <View style={styles.adminCourseFormActions}>
                    <TouchableOpacity
                      style={[styles.smallBtn, styles.outlineBtn, savingCurso && { opacity: 0.6 }]}
                      onPress={() => { if (!savingCurso) { setAdminCursoFormVisible(false); setAdminCursoEditing(null); setAdminCursoNombre(''); } }}
                      disabled={savingCurso}
                    >
                      <View style={styles.btnRow}>
                        <Ionicons name="close-outline" size={14} color="#e5e7eb" />
                        <Text style={styles.smallBtnText}>Cancelar</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.smallBtn, styles.createBtn, savingCurso && { opacity: 0.6 }]}
                      onPress={handleSaveAdminCurso}
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
                    <View key={c.id} style={[styles.adminCourseRow, styles.adminCourseCardRow]}>
                      <View style={styles.adminCourseRowContent}>
                        <Text style={styles.adminCourseRowTitle}>{c.nombre}</Text>
                        {c.grado ? <Text style={styles.dataBullet}>Grado: {c.grado}</Text> : null}
                      </View>
                      <View style={styles.adminCourseRowActions}>
                        <TouchableOpacity style={[styles.smallBtn, styles.adminCourseActionBtn, styles.updateBtn]} onPress={() => openAdminCursoForm(c)}>
                          <View style={styles.btnRow}>
                            <Ionicons name="create-outline" size={14} color="#e5e7eb" />
                            <Text style={styles.smallBtnText}>Editar</Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.smallBtn, styles.adminCourseActionBtn, styles.deleteBtn]} onPress={() => askDeleteCurso(c)}>
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
        visible={rectorCursosModalVisible}
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
                <Text style={styles.periodTitle}>Cursos (Rector / Coordinador)</Text>
                <Pressable onPress={closeCursosModal} style={styles.closeBtn}>
                  <View style={styles.btnRow}><Ionicons name="close-outline" size={16} color="#fecaca" /><Text style={styles.closeBtnText}>Cerrar</Text></View>
                </Pressable>
              </View>

              <View style={styles.courseActionsRow}>
                <TouchableOpacity style={[styles.smallBtn, styles.createBtn]} onPress={() => openRectorCursoForm()}>
                  <View style={styles.btnRow}>
                    <Ionicons name="add-outline" size={14} color="#e5e7eb" />
                    <Text style={styles.smallBtnText}>Nuevo</Text>
                  </View>
                </TouchableOpacity>
                {loadingCursos ? <Text style={styles.dataBullet}>Cargando...</Text> : null}
              </View>

              {rectorCursoFormVisible ? (
                <View style={styles.rectorCourseForm}>
                  <Text style={styles.fieldLabel}>{rectorCursoEditing ? 'Actualizar curso' : 'Nuevo curso'}</Text>
                  <TextInput
                    style={styles.rectorCourseInput}
                    placeholder="Nombre del curso"
                    placeholderTextColor="#9ca3af"
                    value={rectorCursoNombre}
                    editable={!savingCurso}
                    onChangeText={setRectorCursoNombre}
                  />
                  <View style={styles.rectorCourseFormActions}>
                    <TouchableOpacity
                      style={[styles.smallBtn, styles.outlineBtn, savingCurso && { opacity: 0.6 }]}
                      onPress={() => { if (!savingCurso) { setRectorCursoFormVisible(false); setRectorCursoEditing(null); setRectorCursoNombre(''); } }}
                      disabled={savingCurso}
                    >
                      <View style={styles.btnRow}>
                        <Ionicons name="close-outline" size={14} color="#e5e7eb" />
                        <Text style={styles.smallBtnText}>Cancelar</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.smallBtn, styles.createBtn, savingCurso && { opacity: 0.6 }]}
                      onPress={handleSaveRectorCurso}
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
                    <View key={c.id} style={[styles.rectorCourseRow, styles.rectorCourseCardRow]}>
                      <View style={styles.rectorCourseRowContent}>
                        <Text style={styles.rectorCourseRowTitle}>{c.nombre}</Text>
                        {c.grado ? <Text style={styles.dataBullet}>Grado: {c.grado}</Text> : null}
                      </View>
                      <View style={styles.rectorCourseRowActions}>
                        <TouchableOpacity style={[styles.smallBtn, styles.rectorCourseActionBtn, styles.updateBtn]} onPress={() => openRectorCursoForm(c)}>
                          <View style={styles.btnRow}>
                            <Ionicons name="create-outline" size={14} color="#e5e7eb" />
                            <Text style={styles.smallBtnText}>Editar</Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.smallBtn, styles.rectorCourseActionBtn, styles.deleteBtn]} onPress={() => askDeleteCurso(c)}>
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
                  <View style={styles.btnRow}><Ionicons name="close-outline" size={16} color="#fecaca" /><Text style={styles.closeBtnText}>Cerrar</Text></View>
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
              <View style={styles.colegioControlsGrid}>
                <View style={[styles.inlineRow, styles.colegioControlsGridRow, mobileColegioControlsRowStyle]}>
                  <TouchableOpacity
                    style={[
                      styles.smallBtn,
                      styles.colegioControlGridBtn,
                      styles.colegioRoleBtn,
                      mobileColegioControlBtnStyle,
                      rectorCargo === 'rector' && styles.colegioRoleBtnActive,
                      savingColegio && { opacity: 0.6 }
                    ]}
                    onPress={() => setRectorCargo('rector')}
                    disabled={savingColegio}
                  >
                    <View style={[styles.btnRow, styles.colegioControlGridBtnRow, mobileColegioControlRowStyle]}>
                      <Ionicons name="school-outline" size={14} color="#e5e7eb" />
                      <Text style={[styles.smallBtnText, styles.colegioRoleBtnText, styles.colegioControlGridBtnText, mobileColegioControlTextStyle]}>Rector</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.smallBtn,
                      styles.colegioControlGridBtn,
                      styles.colegioRoleBtn,
                      mobileColegioControlBtnStyle,
                      rectorCargo === 'coordinador' && styles.colegioRoleBtnActive,
                      savingColegio && { opacity: 0.6 }
                    ]}
                    onPress={() => setRectorCargo('coordinador')}
                    disabled={savingColegio}
                  >
                    <View style={[styles.btnRow, styles.colegioControlGridBtnRow, mobileColegioControlRowStyle]}>
                      <Ionicons name="people-outline" size={14} color="#e5e7eb" />
                      <Text style={[styles.smallBtnText, styles.colegioRoleBtnText, styles.colegioControlGridBtnText, mobileColegioControlTextStyle]}>Coordinador</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={[styles.inlineRow, styles.colegioControlsGridRow, mobileColegioControlsRowStyle]}>
                  <TouchableOpacity
                    style={[styles.smallBtn, styles.colegioControlGridBtn, styles.colegioListBtn, mobileColegioControlBtnStyle, savingColegio && { opacity: 0.6 }]}
                    onPress={openColegiosListModal}
                    disabled={savingColegio}
                  >
                    <View style={[styles.btnRow, styles.colegioControlGridBtnRow, mobileColegioControlRowStyle]}>
                      <Ionicons name="list-outline" size={14} color="#e5e7eb" />
                      <Text style={[styles.smallBtnText, styles.colegioActionBtnText, styles.colegioControlGridBtnText, mobileColegioControlTextStyle]}>Mostrar colegios</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.smallBtn, styles.colegioControlGridBtn, styles.colegioRectoresBtn, mobileColegioControlBtnStyle, savingColegio && { opacity: 0.6 }]}
                    onPress={openRectoresListModal}
                    disabled={savingColegio}
                  >
                    <View style={[styles.btnRow, styles.colegioControlGridBtnRow, mobileColegioControlRowStyle]}>
                      <Ionicons name="people-circle-outline" size={14} color="#e5e7eb" />
                      <Text style={[styles.smallBtnText, styles.colegioActionBtnText, styles.colegioControlGridBtnText, mobileColegioControlTextStyle]}>Mostrar rectores</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={[styles.inlineRow, styles.colegioControlsGridRow, mobileColegioControlsRowStyle]}>
                  <TouchableOpacity
                    style={[styles.smallBtn, styles.colegioControlGridBtn, styles.colegioSaveBtn, mobileColegioControlBtnStyle, savingColegio && { opacity: 0.6 }]}
                    onPress={handleSaveColegio}
                    disabled={savingColegio}
                  >
                    <View style={[styles.btnRow, styles.colegioControlGridBtnRow, mobileColegioControlRowStyle]}>
                      <Ionicons name="save-outline" size={14} color="#e5e7eb" />
                      <Text style={[styles.smallBtnText, styles.colegioActionBtnText, styles.colegioControlGridBtnText, mobileColegioControlTextStyle]}>{savingColegio ? 'Guardando...' : isEditingColegio ? 'Guardar cambios' : 'Crear'}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              {colegiosError ? <Text style={[styles.dataBullet, { color: '#fca5a5' }]}>{colegiosError}</Text> : null}
              {colegiosSuccess ? (
                <Animated.View
                  style={[
                    styles.colegioSuccessBanner,
                    {
                      opacity: colegioSuccessAnim,
                      transform: [
                        {
                          translateY: colegioSuccessAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-8, 0]
                          })
                        },
                        {
                          scale: colegioSuccessAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.98, 1]
                          })
                        }
                      ]
                    }
                  ]}
                >
                  <Ionicons name="checkmark-circle" size={16} color="#6ee7b7" />
                  <Text style={styles.colegioSuccessText}>{colegiosSuccess}</Text>
                </Animated.View>
              ) : null}
              {isEditingColegio ? (
                <View style={[styles.courseFormActions, styles.colegioCancelActions]}>
                  <TouchableOpacity
                    style={[styles.smallBtn, styles.colegioCancelBtn, savingColegio && { opacity: 0.6 }]}
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
                      <Text style={[styles.smallBtnText, styles.colegioActionBtnText]}>Cancelar edicion</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : null}
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
              <Text style={styles.periodTitle}>{colegiosListView === 'rectores' ? 'Rectores en el sistema' : 'Colegios en el sistema'}</Text>
              <Pressable onPress={closeColegiosListModal} style={styles.closeBtn}>
                <View style={styles.btnRow}><Ionicons name="close-outline" size={16} color="#fecaca" /><Text style={styles.closeBtnText}>Cerrar</Text></View>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={[styles.dataBox, styles.colegiosRegisteredBox]}>
                <View style={styles.colegiosRegisteredHeader}>
                  <Text style={styles.dataTitle}>{colegiosListView === 'rectores' ? 'Directivos registrados' : 'Colegios registrados'}</Text>
                  {colegiosLoading ? <Text style={styles.dataBullet}>Cargando...</Text> : null}
                </View>
                {colegiosListView === 'rectores' ? (
                  <View style={styles.rectoresListWrap}>
                    <View style={styles.docentesSearchBox}>
                      <Text style={styles.fieldLabel}>Filtrar rectores</Text>
                      <View style={styles.docentesSearchInputWrap}>
                        <Ionicons name="search-outline" size={16} color="#94a3b8" />
                        <TextInput
                          style={styles.docentesSearchInput}
                          placeholder="Nombre, colegio, correo, telefono o cedula"
                          placeholderTextColor="#94a3b8"
                          value={rectoresSearchTerm}
                          onChangeText={setRectoresSearchTerm}
                        />
                        {rectoresSearchTerm ? (
                          <Pressable
                            onPress={() => setRectoresSearchTerm('')}
                            style={styles.docentesSearchClearBtn}
                          >
                            <Ionicons name="close-circle" size={16} color="#94a3b8" />
                          </Pressable>
                        ) : null}
                      </View>
                    </View>
                    {rectoresRegistrados.length === 0 && !colegiosLoading ? (
                      <Text style={styles.dataBullet}>No hay rectores registrados.</Text>
                    ) : rectoresFiltrados.length === 0 ? (
                      <Text style={styles.dataBullet}>No hay rectores que coincidan con el filtro.</Text>
                    ) : (
                      rectoresFiltrados.map((rector) => (
                        <View key={`rector-list-${rector.id}`} style={styles.rectorRegisteredCard}>
                          <View style={styles.rectorRegisteredTop}>
                            <Text style={styles.rectorRegisteredName}>{rector.nombreCompleto || 'Sin nombre registrado'}</Text>
                            <View style={styles.colegioRegisteredMetaChip}>
                              <Ionicons name="person-outline" size={12} color="#bbf7d0" />
                              <Text style={[styles.colegioRegisteredMetaChipText, styles.colegioRegisteredRoleChipText]}>{rector.cargoLabel}</Text>
                            </View>
                          </View>
                          <Text style={styles.rectorRegisteredMeta}>Colegio: {rector.colegioNombre}</Text>
                          <Text style={styles.rectorRegisteredMeta}>Correo: {rector.correo || 'No registrado'}</Text>
                          <Text style={styles.rectorRegisteredMeta}>Telefono: {rector.telefono || 'No registrado'}</Text>
                          <Text style={styles.rectorRegisteredMeta}>Cedula: {rector.cedula || 'No registrada'}</Text>
                        </View>
                      ))
                    )}
                  </View>
                ) : colegiosList.length === 0 && !colegiosLoading ? (
                  <Text style={styles.dataBullet}>- Aun no hay colegios registrados</Text>
                ) : (
                  colegiosList.map((c) => {
                    const colegio = normalizeColegioItem(c);
                    const cargoValue = (colegio?.rectorCargo || 'rector').toLowerCase();
                    const cargoLabel = cargoValue === 'coordinador' ? 'Coordinador' : 'Rector';
                    const hasRectorData = hasDirectivoData(colegio);
                    return (
                      <View
                        key={colegio.id}
                        style={[
                          styles.colegioRegisteredCard,
                          isEditingColegio && String(colegioEditing?.id) === String(colegio.id) && styles.colegioRegisteredCardActive
                        ]}
                      >
                        <View style={styles.colegioRegisteredTopRow}>
                          <View style={styles.colegioRegisteredTitleWrap}>
                            <Text style={styles.colegioRegisteredEyebrow}>Colegio</Text>
                            <Text style={styles.colegioRegisteredName}>{colegio.nombre || `Colegio ${colegio.id}`}</Text>
                            <View style={styles.colegioRegisteredMetaWrap}>
                              {colegio.codigoDane ? (
                                <View style={styles.colegioRegisteredMetaChip}>
                                  <Ionicons name="id-card-outline" size={12} color="#bfdbfe" />
                                  <Text style={styles.colegioRegisteredMetaChipText}>DANE {colegio.codigoDane}</Text>
                                </View>
                              ) : null}
                              {hasRectorData ? (
                                <View style={[styles.colegioRegisteredMetaChip, styles.colegioRegisteredRoleChip]}>
                                  <Ionicons name="person-outline" size={12} color="#bbf7d0" />
                                  <Text style={[styles.colegioRegisteredMetaChipText, styles.colegioRegisteredRoleChipText]}>{cargoLabel}</Text>
                                </View>
                              ) : null}
                            </View>
                          </View>
                        </View>

                        <View style={styles.colegioRegisteredActions}>
                          <TouchableOpacity style={[styles.smallBtn, styles.updateBtn, styles.colegioRegisteredActionBtn]} onPress={() => startEditColegio(colegio)}>
                            <View style={[styles.btnRow, styles.colegioRegisteredActionBtnRow]}>
                              <Ionicons name="create-outline" size={14} color="#e5e7eb" />
                              <Text style={styles.smallBtnText}>Editar</Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.smallBtn, styles.deleteBtn, styles.colegioRegisteredActionBtn]} onPress={() => askDeleteColegio(colegio)}>
                            <View style={[styles.btnRow, styles.colegioRegisteredActionBtnRow]}>
                              <Ionicons name="trash-outline" size={14} color="#e5e7eb" />
                              <Text style={styles.smallBtnText}>Eliminar</Text>
                            </View>
                          </TouchableOpacity>
                        </View>

                        {hasRectorData ? (
                          <View style={styles.colegioRegisteredDirectivoBox}>
                            <Text style={styles.colegioRegisteredDirectivoTitle}>Datos del directivo</Text>
                            <View style={styles.colegioRegisteredInfoGrid}>
                              <View style={styles.colegioRegisteredInfoItem}>
                                <Text style={styles.colegioRegisteredInfoLabel}>Nombre</Text>
                                <Text style={styles.colegioRegisteredInfoValue}>{colegio.rectorNombre || 'No registrado'}</Text>
                              </View>
                              <View style={styles.colegioRegisteredInfoItem}>
                                <Text style={styles.colegioRegisteredInfoLabel}>Apellido</Text>
                                <Text style={styles.colegioRegisteredInfoValue}>{colegio.rectorApellido || 'No registrado'}</Text>
                              </View>
                              <View style={styles.colegioRegisteredInfoItem}>
                                <Text style={styles.colegioRegisteredInfoLabel}>Correo</Text>
                                <Text style={styles.colegioRegisteredInfoValue}>{colegio.rectorCorreo || 'No registrado'}</Text>
                              </View>
                              <View style={styles.colegioRegisteredInfoItem}>
                                <Text style={styles.colegioRegisteredInfoLabel}>Telefono</Text>
                                <Text style={styles.colegioRegisteredInfoValue}>{colegio.rectorTelefono || 'No registrado'}</Text>
                              </View>
                              <View style={styles.colegioRegisteredInfoItem}>
                                <Text style={styles.colegioRegisteredInfoLabel}>Cedula</Text>
                                <Text style={styles.colegioRegisteredInfoValue}>{colegio.rectorCedula || 'No registrado'}</Text>
                              </View>
                              <View style={styles.colegioRegisteredInfoItem}>
                                <Text style={styles.colegioRegisteredInfoLabel}>Contrasena</Text>
                                <Text style={styles.colegioRegisteredInfoValue}>{colegio.rectorTienePassword ? 'Configurada' : 'Pendiente'}</Text>
                              </View>
                            </View>
                          </View>
                        ) : (
                          <View style={styles.colegioRegisteredEmptyBox}>
                            <Ionicons name="information-circle-outline" size={14} color="#93c5fd" />
                            <Text style={styles.colegioRegisteredEmptyText}>Sin datos directivos registrados</Text>
                          </View>
                        )}
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
              <Text style={styles.periodTitle}>{isAdmin ? 'Ver docentes (Administrador)' : 'Crear docentes (Rector/Coordinador)'}</Text>
              <Pressable onPress={closeDocenteCrudModal} style={styles.closeBtn}>
                <View style={styles.btnRow}><Ionicons name="close-outline" size={16} color="#fecaca" /><Text style={styles.closeBtnText}>Cerrar</Text></View>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
              {isAdmin ? (
                <View style={styles.courseForm}>
                  {canAdminFilterDocenteSchools ? (
                    <View style={styles.dataBox}>
                      <Text style={styles.fieldLabel}>Institucion</Text>
                      <TouchableOpacity
                        style={styles.selectBoxFull}
                        onPress={() => setDocenteColegioPickerOpen((prev) => !prev)}
                        disabled={savingDocente || loadingCursos}
                      >
                        <Text style={styles.selectText}>{resolveColegioNombre(docenteColegioId || user?.schoolId)}</Text>
                      </TouchableOpacity>
                      {docenteColegioPickerOpen ? (
                        <View style={styles.pickerList}>
                          {colegiosLoading ? <Text style={styles.dataBullet}>Cargando instituciones...</Text> : null}
                          {colegiosOptions.length > 0 ? (
                            colegiosOptions.map((colegio) => (
                              <TouchableOpacity
                                key={`docente-crud-school-${colegio.id}`}
                                style={[styles.pickerItem, String(docenteColegioId) === String(colegio.id) && styles.pickerItemActive]}
                                onPress={() => {
                                  setDocenteColegioId(colegio.id);
                                  setDocenteColegioPickerOpen(false);
                                  setDocenteEditing(null);
                                  setDocenteForm({ nombre: '', email: '', password: '' });
                                  setShowDocentePassword(false);
                                  setDocenteCursos([]);
                                  setDocenteMateriasState({});
                                  setDocenteError('');
                                }}
                              >
                                <Text style={styles.dataItem}>{colegio.nombre || `Colegio ${colegio.id}`}</Text>
                              </TouchableOpacity>
                            ))
                          ) : (
                            <Text style={styles.dataBullet}>No hay instituciones disponibles</Text>
                          )}
                        </View>
                      ) : null}
                    </View>
                  ) : null}

                  <View style={styles.dataBox}>
                    <View style={styles.courseActionsRow}>
                      <Text style={styles.dataTitle}>Docentes de la institucion</Text>
                      {docentesLoading ? <Text style={styles.dataBullet}>Cargando...</Text> : null}
                    </View>
                    <View style={styles.docentesSearchBox}>
                      <Text style={styles.fieldLabel}>Filtrar docentes</Text>
                      <View style={styles.docentesSearchInputWrap}>
                        <Ionicons name="search-outline" size={16} color="#94a3b8" />
                        <TextInput
                          style={styles.docentesSearchInput}
                          placeholder="Nombre, correo, curso o materia"
                          placeholderTextColor="#94a3b8"
                          value={adminDocentesSearchTerm}
                          onChangeText={setAdminDocentesSearchTerm}
                        />
                        {adminDocentesSearchTerm ? (
                          <Pressable
                            onPress={() => setAdminDocentesSearchTerm('')}
                            style={styles.docentesSearchClearBtn}
                          >
                            <Ionicons name="close-circle" size={16} color="#94a3b8" />
                          </Pressable>
                        ) : null}
                      </View>
                    </View>
                    {docentes.length === 0 && !docentesLoading ? (
                      <Text style={styles.dataBullet}>No hay docentes registrados para esta institucion.</Text>
                    ) : adminDocentesFiltrados.length === 0 ? (
                      <Text style={styles.dataBullet}>No hay docentes que coincidan con el filtro.</Text>
                    ) : (
                      adminDocentesFiltrados.map((docenteItem) => (
                        <View key={`crud-inline-docente-${docenteItem.id}`} style={styles.docenteInlineCard}>
                          <Text style={styles.docenteInlineName}>{docenteItem.nombre || docenteItem.email || `Docente ${docenteItem.id}`}</Text>
                          {docenteItem.email ? <Text style={styles.docenteInlineMeta}>Correo: {docenteItem.email}</Text> : null}
                          <Text style={styles.docenteInlineMeta}>Clave de acceso: {getDocenteAccessPreview(docenteItem.id)}</Text>
                          <Text style={styles.docenteInlineMeta}>
                            Cursos: {Array.isArray(docenteItem.cursos) && docenteItem.cursos.length ? docenteItem.cursos.map((curso) => curso?.nombre || `Curso ${curso?.id}`).join(', ') : 'Sin cursos asignados'}
                          </Text>
                          <Text style={styles.docenteInlineMeta}>
                            Materias: {Array.isArray(docenteItem.cursos) && docenteItem.cursos.length
                              ? docenteItem.cursos
                                .flatMap((curso) => {
                                  const cursoNombre = curso?.nombre || `Curso ${curso?.id}`;
                                  const materias = Array.isArray(curso?.materias) ? curso.materias.filter(Boolean) : [];
                                  if (!materias.length) return [`${cursoNombre}: sin materias`];
                                  return [`${cursoNombre}: ${materias.join(', ')}`];
                                })
                                .join(' | ')
                              : 'Sin materias asignadas'}
                          </Text>
                          <View style={styles.docenteInlineActions}>
                            <TouchableOpacity
                              style={[styles.smallBtn, styles.infoBtn]}
                              onPress={() => handleResetDocentePassword(docenteItem)}
                              disabled={savingDocente}
                            >
                              <View style={styles.btnRow}>
                                <Ionicons name="key-outline" size={14} color="#e5e7eb" />
                                <Text style={styles.smallBtnText}>Restablecer clave</Text>
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.smallBtn, styles.updateBtn]}
                              onPress={() => openAdminDocenteEditModal(docenteItem)}
                              disabled={savingDocente}
                            >
                              <View style={styles.btnRow}>
                                <Ionicons name="create-outline" size={14} color="#e5e7eb" />
                                <Text style={styles.smallBtnText}>Editar</Text>
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.smallBtn, styles.deleteBtn]}
                              onPress={() => askDeleteDocente(docenteItem)}
                              disabled={savingDocente}
                            >
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
              ) : (
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
                  <View style={styles.passwordInputWrap}>
                    <TextInput
                      style={[styles.courseInput, styles.passwordInput]}
                      placeholder={docenteEditing ? 'Nueva contrasena (opcional)' : 'Contrasena'}
                      placeholderTextColor="#9ca3af"
                      secureTextEntry={!showDocentePassword}
                      value={docenteForm.password}
                      onChangeText={(txt) => setDocenteForm(prev => ({ ...prev, password: txt }))}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TouchableOpacity
                      style={styles.passwordEyeBtn}
                      onPress={() => setShowDocentePassword((prev) => !prev)}
                      disabled={savingDocente}
                    >
                      <Ionicons name={showDocentePassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#e5e7eb" />
                    </TouchableOpacity>
                  </View>

                  {docenteError ? <Text style={[styles.errorText, { marginTop: 4 }]}>{docenteError}</Text> : null}

                  <View style={styles.dataBox}>
                    <Text style={styles.fieldLabel}>Asignar cursos</Text>
                    {loadingCursos ? (
                      <Text style={styles.dataBullet}>Cargando cursos...</Text>
                    ) : docenteCursosDisponibles.length === 0 ? (
                      <Text style={styles.dataBullet}>No hay cursos disponibles para asignar.</Text>
                    ) : (
                      <View style={styles.docenteCourseChecklist}>
                        {docenteCursosDisponibles.map((curso) => {
                          const isSelected = docenteCursos.includes(curso.id);
                          return (
                            <TouchableOpacity
                              key={`docente-curso-option-${curso.id}`}
                              style={[styles.docenteCourseOption, isSelected && styles.docenteCourseOptionActive]}
                              onPress={() => toggleDocenteCurso(curso.id)}
                              disabled={savingDocente}
                              activeOpacity={0.85}
                            >
                              <Ionicons
                                name={isSelected ? 'checkbox-outline' : 'square-outline'}
                                size={20}
                                color={isSelected ? '#60a5fa' : '#cbd5e1'}
                              />
                              <Text style={[styles.docenteCourseOptionText, isSelected && styles.docenteCourseOptionTextActive]}>
                                {curso?.nombre || `Curso ${curso?.id}`}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    )}
                    {docenteCursos.length > 0 ? (
                      <View style={styles.docenteMateriasByCursoWrap}>
                        <Text style={styles.fieldLabel}>Materias por curso</Text>
                        {docenteCursos
                          .map((cursoId) => docenteCursosDisponibles.find((curso) => String(curso?.id) === String(cursoId)))
                          .filter(Boolean)
                          .map((curso) => (
                            <View key={`docente-materias-curso-${curso.id}`} style={styles.docenteMateriaCursoItem}>
                              <Text style={styles.docenteMateriaCursoLabel}>{curso?.nombre || `Curso ${curso?.id}`}</Text>
                              <TextInput
                                style={[styles.courseInput, styles.docenteMateriaCursoInput]}
                                placeholder="Ej: Matematicas, Etica"
                                placeholderTextColor="#94a3b8"
                                value={docenteMateriasDraft?.[curso.id] || ''}
                                onChangeText={(txt) => updateDocenteMateriaDraft(curso.id, txt)}
                                onBlur={(event) => commitDocenteMateriaDraft(curso.id, event?.nativeEvent?.text)}
                                editable={!savingDocente}
                                multiline
                              />
                              <Text style={styles.docenteMateriaCursoHint}>Separa varias materias con coma.</Text>
                            </View>
                          ))}
                      </View>
                    ) : null}
                  </View>

                  <View style={styles.dataBox}>
                    <View style={styles.courseActionsRow}>
                      <Text style={styles.dataTitle}>Docentes de la institucion</Text>
                      {docentesLoading ? <Text style={styles.dataBullet}>Cargando...</Text> : null}
                    </View>
                    {docentes.length === 0 && !docentesLoading ? (
                      <Text style={styles.dataBullet}>No hay docentes registrados para esta institucion.</Text>
                    ) : (
                      docentes.map((docenteItem) => (
                        <View key={`crud-inline-docente-${docenteItem.id}`} style={styles.docenteInlineCard}>
                          <Text style={styles.docenteInlineName}>{docenteItem.nombre || docenteItem.email || `Docente ${docenteItem.id}`}</Text>
                          {docenteItem.email ? <Text style={styles.docenteInlineMeta}>Correo: {docenteItem.email}</Text> : null}
                          <Text style={styles.docenteInlineMeta}>Clave de acceso: {getDocenteAccessPreview(docenteItem.id)}</Text>
                          <Text style={styles.docenteInlineMeta}>
                            Cursos: {Array.isArray(docenteItem.cursos) && docenteItem.cursos.length ? docenteItem.cursos.map((curso) => curso?.nombre || `Curso ${curso?.id}`).join(', ') : 'Sin cursos asignados'}
                          </Text>
                          <View style={styles.docenteInlineActions}>
                            <TouchableOpacity
                              style={[styles.smallBtn, styles.updateBtn]}
                              onPress={() => startEditDocente(docenteItem)}
                              disabled={savingDocente}
                            >
                              <View style={styles.btnRow}>
                                <Ionicons name="create-outline" size={14} color="#e5e7eb" />
                                <Text style={styles.smallBtnText}>Editar</Text>
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.smallBtn, styles.deleteBtn]}
                              onPress={() => askDeleteDocente(docenteItem)}
                              disabled={savingDocente}
                            >
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

                  <View style={styles.courseFormActions}>
                    {docenteEditing ? (
                      <TouchableOpacity
                        style={[styles.smallBtn, styles.outlineBtn, savingDocente && { opacity: 0.6 }]}
                        onPress={() => {
                          if (savingDocente) return;
                          setDocenteEditing(null);
                          setDocenteForm({ nombre: '', email: '', password: '' });
                          setShowDocentePassword(false);
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
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="slide"
        visible={adminDocenteEditModalVisible}
        onRequestClose={closeAdminDocenteEditModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, styles.docenteCrudModalCard]}>
            <View style={styles.modalHeader}>
              <Text style={styles.periodTitle}>Editar docente (Administrador)</Text>
              <Pressable onPress={closeAdminDocenteEditModal} style={styles.closeBtn}>
                <View style={styles.btnRow}><Ionicons name="close-outline" size={16} color="#fecaca" /><Text style={styles.closeBtnText}>Cerrar</Text></View>
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.courseForm}>
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
                <View style={styles.passwordInputWrap}>
                  <TextInput
                    style={[styles.courseInput, styles.passwordInput]}
                    placeholder="Nueva contrasena (opcional)"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showDocentePassword}
                    value={docenteForm.password}
                    onChangeText={(txt) => setDocenteForm(prev => ({ ...prev, password: txt }))}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    style={styles.passwordEyeBtn}
                    onPress={() => setShowDocentePassword((prev) => !prev)}
                    disabled={savingDocente}
                  >
                    <Ionicons name={showDocentePassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#e5e7eb" />
                  </TouchableOpacity>
                </View>
                {docenteError ? <Text style={[styles.errorText, { marginTop: 4 }]}>{docenteError}</Text> : null}

                <View style={styles.dataBox}>
                  <Text style={styles.fieldLabel}>Asignar cursos</Text>
                  {loadingCursos ? (
                    <Text style={styles.dataBullet}>Cargando cursos...</Text>
                  ) : docenteCursosDisponibles.length === 0 ? (
                    <Text style={styles.dataBullet}>No hay cursos disponibles para asignar.</Text>
                  ) : (
                    <View style={styles.docenteCourseChecklist}>
                      {docenteCursosDisponibles.map((curso) => {
                        const isSelected = docenteCursos.includes(curso.id);
                        return (
                          <TouchableOpacity
                            key={`admin-docente-curso-option-${curso.id}`}
                            style={[styles.docenteCourseOption, isSelected && styles.docenteCourseOptionActive]}
                            onPress={() => toggleDocenteCurso(curso.id)}
                            disabled={savingDocente}
                            activeOpacity={0.85}
                          >
                            <Ionicons
                              name={isSelected ? 'checkbox-outline' : 'square-outline'}
                              size={20}
                              color={isSelected ? '#60a5fa' : '#cbd5e1'}
                            />
                            <Text style={[styles.docenteCourseOptionText, isSelected && styles.docenteCourseOptionTextActive]}>
                              {curso?.nombre || `Curso ${curso?.id}`}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                  {docenteCursos.length > 0 ? (
                    <View style={styles.docenteMateriasByCursoWrap}>
                      <Text style={styles.fieldLabel}>Materias por curso</Text>
                      {docenteCursos
                        .map((cursoId) => docenteCursosDisponibles.find((curso) => String(curso?.id) === String(cursoId)))
                        .filter(Boolean)
                        .map((curso) => (
                          <View key={`admin-docente-materias-curso-${curso.id}`} style={styles.docenteMateriaCursoItem}>
                            <Text style={styles.docenteMateriaCursoLabel}>{curso?.nombre || `Curso ${curso?.id}`}</Text>
                            <TextInput
                              style={[styles.courseInput, styles.docenteMateriaCursoInput]}
                              placeholder="Ej: Matematicas, Etica"
                              placeholderTextColor="#94a3b8"
                              value={docenteMateriasDraft?.[curso.id] || ''}
                              onChangeText={(txt) => updateDocenteMateriaDraft(curso.id, txt)}
                              onBlur={(event) => commitDocenteMateriaDraft(curso.id, event?.nativeEvent?.text)}
                              editable={!savingDocente}
                              multiline
                            />
                            <Text style={styles.docenteMateriaCursoHint}>Separa varias materias con coma.</Text>
                          </View>
                        ))}
                    </View>
                  ) : null}
                </View>

                <View style={styles.courseFormActions}>
                  <TouchableOpacity
                    style={[styles.smallBtn, styles.outlineBtn, savingDocente && { opacity: 0.6 }]}
                    onPress={closeAdminDocenteEditModal}
                    disabled={savingDocente}
                  >
                    <View style={styles.btnRow}>
                      <Ionicons name="close-outline" size={14} color="#e5e7eb" />
                      <Text style={styles.smallBtnText}>Cancelar</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.smallBtn, styles.createBtn, savingDocente && { opacity: 0.6 }]}
                    onPress={handleSaveDocente}
                    disabled={savingDocente}
                  >
                    <View style={styles.btnRow}>
                      <Ionicons name="save-outline" size={14} color="#e5e7eb" />
                      <Text style={styles.smallBtnText}>{savingDocente ? 'Guardando...' : 'Actualizar'}</Text>
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
        onRequestClose={closeDocenteCrudListModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, styles.docentesModalCard]}>
            <View style={styles.modalHeader}>
              <Text style={styles.periodTitle}>Docentes del colegio</Text>
              <Pressable onPress={closeDocenteCrudListModal} style={styles.closeBtn}>
                <View style={styles.btnRow}><Ionicons name="close-outline" size={16} color="#fecaca" /><Text style={styles.closeBtnText}>Cerrar</Text></View>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.fieldLabel}>Colegio: <Text style={styles.dataValue}>{resolveColegioNombre(docenteColegioId || user?.schoolId)}</Text></Text>
              <View style={styles.dataBox}>
                <View style={styles.courseActionsRow}>
                  <Text style={styles.dataTitle}>Docentes del colegio</Text>
                  {docentesLoading ? <Text style={styles.dataBullet}>Cargando...</Text> : null}
                </View>
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
                            key={`crud-docente-suggestion-${docente.id}`}
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

                {docentes.length === 0 && !docentesLoading ? (
                  <Text style={styles.dataBullet}>- Aun no hay docentes</Text>
                ) : docentesFiltrados.length === 0 ? (
                  <Text style={styles.dataBullet}>- No hay docentes que coincidan con la busqueda</Text>
                ) : (
                  docentesFiltrados.map((d) => (
                    <View key={d.id} style={styles.docenteSummaryCard}>
                      <View style={[styles.docenteSummaryTopRow, isMobileApp && styles.docenteSummaryTopRowMobile]}>
                        <View style={[styles.docenteSummaryHeader, isMobileApp && styles.docenteSummaryHeaderMobile]}>
                          <Text style={styles.docenteSummaryName}>{d.nombre || d.email || `Docente ${d.id}`}</Text>
                          {d.email ? <Text style={styles.docenteSummaryEmail}>{d.email}</Text> : null}
                          <Text style={styles.docenteSummaryEmail}>Clave de acceso: {getDocenteAccessPreview(d.id)}</Text>
                        </View>
                        <View style={[styles.docenteSummaryActions, isMobileApp && styles.docenteSummaryActionsMobile]}>
                          <TouchableOpacity
                            style={[styles.smallBtn, styles.updateBtn, isMobileApp && styles.docenteSummaryActionBtnMobile]}
                            onPress={() => {
                              closeDocenteCrudListModal();
                              startEditDocente(d);
                            }}
                          >
                            <View style={styles.btnRow}>
                              <Ionicons name="create-outline" size={14} color="#e5e7eb" />
                              <Text style={styles.smallBtnText}>Editar</Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.smallBtn, styles.deleteBtn, isMobileApp && styles.docenteSummaryActionBtnMobile]}
                            onPress={() => askDeleteDocente(d)}
                          >
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
        visible={estudiantesModalVisible}
        onRequestClose={closeEstudiantesModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, styles.sharedActionModalCard]}>
            <View style={styles.modalHeader}>
              <Text style={styles.periodTitle}>Estudiantes por curso</Text>
              <Pressable onPress={closeEstudiantesModal} style={styles.closeBtn}>
                <View style={styles.btnRow}><Ionicons name="close-outline" size={16} color="#fecaca" /><Text style={styles.closeBtnText}>Cerrar</Text></View>
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
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
                        onPress={() => selectCursoEstudiantes(c.id)}
                      >
                        <Text style={styles.dataItem}>{c.nombre}</Text>
                      </Pressable>
                    ))
                  )}
                </View>
              ) : null}

              <Text style={styles.fieldLabel}>Selecciona una materia</Text>
              <Pressable
                style={[styles.selectBoxFull, !estudiantesMateriasDisponibles.length && { opacity: 0.65 }]}
                onPress={() => {
                  if (!estudiantesMateriasDisponibles.length) return;
                  setEstudianteMateriaPickerOpen((prev) => !prev);
                }}
              >
                <Text style={styles.selectText}>
                  {estudianteMateriaFiltro === ALL_MATERIAS_OPTION ? 'Todas las materias' : estudianteMateriaFiltro}
                </Text>
              </Pressable>
              {estudianteMateriaPickerOpen ? (
                <View style={styles.dropdownList}>
                  <Pressable
                    style={[styles.dropdownItem, estudianteMateriaFiltro === ALL_MATERIAS_OPTION && styles.dropdownItemSelected]}
                    onPress={() => {
                      setEstudianteMateriaFiltro(ALL_MATERIAS_OPTION);
                      setEstudianteMateriaPickerOpen(false);
                    }}
                  >
                    <Text style={styles.dataItem}>Todas las materias</Text>
                  </Pressable>
                  {estudiantesMateriasDisponibles.length === 0 ? (
                    <Text style={styles.dataBullet}>No hay materias configuradas para este curso</Text>
                  ) : (
                    estudiantesMateriasDisponibles.map((materia) => (
                      <Pressable
                        key={`estudiante-materia-${materia}`}
                        style={[
                          styles.dropdownItem,
                          normalizeMateriaOption(estudianteMateriaFiltro) === normalizeMateriaOption(materia) && styles.dropdownItemSelected
                        ]}
                        onPress={() => {
                          setEstudianteMateriaFiltro(materia);
                          setEstudianteMateriaPickerOpen(false);
                        }}
                      >
                        <Text style={styles.dataItem}>{materia}</Text>
                      </Pressable>
                    ))
                  )}
                </View>
              ) : null}

              <View style={styles.dataBox}>
                <View style={styles.assignedCoursesHeader}>
                  <Text style={styles.dataTitle}>Cursos asignados al docente</Text>
                  <View style={styles.assignedCoursesBadge}>
                    <Text style={styles.assignedCoursesBadgeText}>
                      {loadingCursos ? '...' : `${cursosAsignados.length}`}
                    </Text>
                  </View>
                </View>
                <Text style={styles.dataBullet}>
                  Solo se muestran los cursos que tienes asignados y desde aqui puedes cambiar rapido entre ellos.
                </Text>
                {loadingCursos ? (
                  <Text style={styles.dataBullet}>Cargando cursos asignados...</Text>
                ) : cursosAsignados.length === 0 ? (
                  <Text style={styles.dataBullet}>No tienes cursos asignados en este momento.</Text>
                ) : (
                  <View style={styles.assignedCoursesWrap}>
                    {cursosAsignados.map((curso) => (
                      <Pressable
                        key={`curso-asignado-${curso.id}`}
                        style={[
                          styles.assignedCourseChip,
                          String(cursoSeleccionado) === String(curso.id) && styles.assignedCourseChipActive
                        ]}
                        onPress={() => selectCursoEstudiantes(curso.id)}
                      >
                        <Text
                          style={[
                            styles.assignedCourseChipText,
                            String(cursoSeleccionado) === String(curso.id) && styles.assignedCourseChipTextActive
                          ]}
                        >
                          {curso.nombre}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.dataBox}>
                <View style={styles.studentsHeaderRow}>
                  <Text style={styles.dataTitle}>Estudiantes</Text>
                  <TouchableOpacity
                    style={[styles.smallBtn, styles.infoBtn, downloadingQrZip && { opacity: 0.6 }]}
                    onPress={downloadEstudiantesQrZip}
                    disabled={downloadingQrZip || estudiantesLoading || estudiantesFiltrados.length === 0}
                  >
                    <View style={styles.btnRow}>
                      <Ionicons name="download-outline" size={14} color="#e5e7eb" />
                      <Text style={styles.smallBtnText}>{downloadingQrZip ? 'Generando ZIP...' : 'Descargar QR (ZIP)'}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <Text style={styles.dataBullet}>
                  {estudianteMateriaFiltro === ALL_MATERIAS_OPTION
                    ? 'Puedes ver todo el curso o filtrar por una materia especifica.'
                    : `Mostrando estudiantes de la materia ${estudianteMateriaFiltro}.`}
                </Text>
                {estudiantesLoading ? (
                  <Text style={styles.dataBullet}>Cargando estudiantes...</Text>
                ) : estudiantesError ? (
                  <Text style={[styles.dataBullet, { color: '#fca5a5' }]}>{estudiantesError}</Text>
                ) : estudiantesFiltrados.length === 0 ? (
                  <Text style={styles.dataBullet}>
                    {estudianteMateriaFiltro === ALL_MATERIAS_OPTION
                      ? 'No hay estudiantes asignados'
                      : 'No hay estudiantes asignados a la materia seleccionada'}
                  </Text>
                ) : (
                  estudiantesFiltrados.map((e) => (
                    <View key={e.id} style={styles.estudianteRowCard}>
                      <View style={styles.estudianteRowContent}>
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
                          <Text style={[styles.dataBullet, { marginTop: 4, marginBottom: 8, fontWeight: '700' }]}>Materias del estudiante</Text>
                          <View style={styles.estudianteMateriaSelectorBox}>
                            {estudiantesMateriasDisponibles.length > 0 ? (
                              <>
                                <Text style={styles.dataBullet}>Selecciona una o varias materias correspondientes a este curso.</Text>
                                <View style={styles.estudianteMateriaChipWrap}>
                                  {estudiantesMateriasDisponibles.map((materia) => {
                                    const isSelected = (Array.isArray(estudianteEditForm.materias) ? estudianteEditForm.materias : [])
                                      .some((item) => normalizeMateriaOption(item) === normalizeMateriaOption(materia));
                                    return (
                                      <Pressable
                                        key={`estudiante-edit-materia-${e.id}-${materia}`}
                                        style={[
                                          styles.estudianteMateriaChip,
                                          isSelected && styles.estudianteMateriaChipActive
                                        ]}
                                        onPress={() => toggleEstudianteEditMateria(materia)}
                                      >
                                        <Text
                                          style={[
                                            styles.estudianteMateriaChipText,
                                            isSelected && styles.estudianteMateriaChipTextActive
                                          ]}
                                        >
                                          {materia}
                                        </Text>
                                      </Pressable>
                                    );
                                  })}
                                </View>
                              </>
                            ) : (
                              <Text style={styles.dataBullet}>No hay materias configuradas para este curso.</Text>
                            )}
                          </View>
                          </View>
                        ) : (
                          <>
                            <Text style={styles.estudianteRowName}>
                              {e.nombre || `${e.nombres || ''} ${e.apellidos || ''}`.trim()}
                            </Text>
                            {e.codigoEstudiante ? <Text style={styles.estudianteRowMeta}>Codigo: {e.codigoEstudiante}</Text> : null}
                            {e.qr ? <Text style={styles.estudianteRowMeta}>QR: {e.qr}</Text> : null}
                            {Array.isArray(e.materias) && e.materias.length ? (
                              <Text style={styles.estudianteRowMeta}>Materias: {e.materias.join(', ')}</Text>
                            ) : null}
                            {Number(e?.faltas?.total || 0) > 0 ? (
                              <>
                                <Text style={[styles.estudianteRowMeta, { color: '#fca5a5', fontWeight: '700' }]}>
                                  Fallas registradas: {e.faltas.total}
                                </Text>
                                {Array.isArray(e?.faltas?.materias) && e.faltas.materias.length ? (
                                  <Text style={[styles.estudianteRowMeta, { color: '#fecaca' }]}>
                                    Materias con fallas: {e.faltas.materias.map((item) => `${item.materia} (${item.faltas})`).join(', ')}
                                  </Text>
                                ) : null}
                              </>
                            ) : (
                              <Text style={styles.estudianteRowMeta}>Sin fallas registradas</Text>
                            )}
                          </>
                        )}
                      </View>
                      <View style={styles.estudianteRowActions}>
                        {String(estudianteEditing) === String(e.id) ? (
                          <>
                            <TouchableOpacity
                              style={[styles.smallBtn, styles.outlineBtn, styles.estudianteRowActionBtn, savingEstudianteEdit && { opacity: 0.6 }]}
                              onPress={cancelEditEstudiante}
                              disabled={savingEstudianteEdit}
                            >
                              <View style={styles.btnRow}>
                                <Ionicons name="close-outline" size={14} color="#e5e7eb" />
                                <Text style={styles.smallBtnText}>Cancelar</Text>
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.smallBtn, styles.createBtn, styles.estudianteRowActionBtn, savingEstudianteEdit && { opacity: 0.6 }]}
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
                            <TouchableOpacity style={[styles.smallBtn, styles.updateBtn, styles.estudianteRowActionBtn]} onPress={() => startEditEstudiante(e)}>
                              <View style={styles.btnRow}>
                                <Ionicons name="create-outline" size={14} color="#e5e7eb" />
                                <Text style={styles.smallBtnText}>Actualizar</Text>
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.smallBtn, styles.deleteBtn, styles.estudianteRowActionBtn]} onPress={() => askDeleteEstudiante(e)}>
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
            </ScrollView>
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
                  <View style={styles.btnRow}><Ionicons name="close-outline" size={16} color="#fecaca" /><Text style={styles.closeBtnText}>Cerrar</Text></View>
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
        animationType="slide"
        visible={reportesModalVisible}
        onRequestClose={closeReportesModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, styles.reportesModalCard]}>
            <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={styles.periodTitle}>Reporte de inasistencia</Text>
                <Pressable onPress={closeReportesModal} style={styles.closeBtn}>
                  <View style={styles.btnRow}><Ionicons name="close-outline" size={16} color="#fecaca" /><Text style={styles.closeBtnText}>Cerrar</Text></View>
                </Pressable>
              </View>

              <View style={styles.reportHeroCard}>
                <View style={styles.reportHeroHead}>
                  <View style={styles.reportHeroIconWrap}>
                    <Ionicons name="analytics-outline" size={18} color="#a5f3fc" />
                  </View>
                  <View style={styles.reportHeroTextWrap}>
                    <Text style={styles.reportHeroTitle}>Panel de reportes</Text>
                    <Text style={styles.reportHeroSubtitle}>Analiza inasistencias por curso, dia y mes</Text>
                  </View>
                </View>
                <View style={styles.reportHeroChips}>
                  <View style={styles.reportHeroChip}>
                    <Ionicons name="calendar-outline" size={13} color="#93c5fd" />
                    <Text style={styles.reportHeroChipText}>{pad2(reportesDia)}/{pad2(reportesMes)}/{currentYear}</Text>
                  </View>
                  <View style={styles.reportHeroChip}>
                    <Ionicons name="business-outline" size={13} color="#fcd34d" />
                    <Text style={styles.reportHeroChipText}>{reportesColegioNombre}</Text>
                  </View>
                  <View style={styles.reportHeroChip}>
                    <Ionicons name="school-outline" size={13} color="#86efac" />
                    <Text style={styles.reportHeroChipText}>{reportesCursoNombre}</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.fieldLabel}>Colegio: <Text style={styles.dataValue}>{reportesColegioNombre || 'No asignado'}</Text></Text>

              <View style={styles.dataBox}>
                <Text style={styles.dataTitle}>Filtros</Text>

                {canAdminFilterReportSchools ? (
                  <View style={styles.reportFieldGroup}>
                    <Text style={styles.fieldLabel}>Institucion</Text>
                    <TouchableOpacity
                      style={styles.selectBoxFull}
                      onPress={() => {
                        setReportesColegioPickerOpen((prev) => !prev);
                        setReportesCursoPickerOpen(false);
                        setReportesMesPickerOpen(false);
                        setReportesDiaPickerOpen(false);
                      }}
                      disabled={reportesBootLoading || reportesLoading}
                    >
                      <Text style={styles.selectText}>{reportesColegioNombre}</Text>
                    </TouchableOpacity>
                    {reportesColegioPickerOpen ? (
                      <View style={styles.pickerList}>
                        {colegiosLoading ? <Text style={styles.dataBullet}>Cargando instituciones...</Text> : null}
                        {colegiosOptions.length > 0 ? (
                          colegiosOptions.map((colegio) => (
                            <TouchableOpacity
                              key={`reporte-colegio-${colegio.id}`}
                              style={[styles.pickerItem, String(reportesColegioId) === String(colegio.id) && styles.pickerItemActive]}
                              onPress={() => {
                                setReportesColegioId(colegio.id);
                                setReportesColegioPickerOpen(false);
                                setReportesCursoPickerOpen(false);
                                setReportesError('');
                                setReportesDetalle(null);
                              }}
                            >
                              <Text style={styles.dataItem}>{colegio.nombre || `Colegio ${colegio.id}`}</Text>
                            </TouchableOpacity>
                          ))
                        ) : (
                          <Text style={[styles.dataBullet, styles.reportPickerEmpty]}>No hay instituciones disponibles</Text>
                        )}
                      </View>
                    ) : null}
                  </View>
                ) : null}

                <View style={styles.reportFieldGroup}>
                  <Text style={styles.fieldLabel}>Curso</Text>
                  <TouchableOpacity
                    style={styles.selectBoxFull}
                    onPress={() => {
                      setReportesCursoPickerOpen((prev) => !prev);
                      setReportesColegioPickerOpen(false);
                      setReportesMesPickerOpen(false);
                      setReportesDiaPickerOpen(false);
                    }}
                    disabled={reportesBootLoading || reportesLoading}
                  >
                    <Text style={styles.selectText}>{reportesCursoNombre}</Text>
                  </TouchableOpacity>
                  {reportesCursoPickerOpen ? (
                    <View style={styles.pickerList}>
                      {reportesCursos.length > 0 ? (
                        reportesCursos.map((curso) => (
                          <TouchableOpacity
                            key={`reporte-curso-${curso.id}`}
                            style={[styles.pickerItem, String(reportesCursoId) === String(curso.id) && styles.pickerItemActive]}
                            onPress={() => {
                              setReportesCursoId(curso.id);
                              setReportesCursoPickerOpen(false);
                            }}
                          >
                            <Text style={styles.dataItem}>{curso.nombre || `Curso ${curso.id}`}</Text>
                          </TouchableOpacity>
                        ))
                      ) : (
                        <Text style={[styles.dataBullet, styles.reportPickerEmpty]}>No hay cursos disponibles</Text>
                      )}
                    </View>
                  ) : null}
                </View>

                <View style={styles.reportFiltersGrid}>
                  <View style={styles.reportFieldColumn}>
                    <Text style={styles.fieldLabel}>Mes</Text>
                    <TouchableOpacity
                      style={styles.selectBoxFull}
                      onPress={() => {
                        setReportesMesPickerOpen((prev) => !prev);
                        setReportesColegioPickerOpen(false);
                        setReportesCursoPickerOpen(false);
                        setReportesDiaPickerOpen(false);
                      }}
                      disabled={reportesLoading}
                    >
                      <Text style={styles.selectText}>{monthNames[reportesMes - 1]} {currentYear}</Text>
                    </TouchableOpacity>
                    {reportesMesPickerOpen ? (
                      <View style={styles.pickerList}>
                        {reportMonthOptions.map((option) => (
                          <TouchableOpacity
                            key={`reporte-mes-${option.value}`}
                            style={[styles.pickerItem, reportesMes === option.value && styles.pickerItemActive]}
                            onPress={() => {
                              setReportesMes(option.value);
                              setReportesMesPickerOpen(false);
                            }}
                          >
                            <Text style={styles.dataItem}>{option.label}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    ) : null}
                  </View>

                  <View style={styles.reportFieldColumn}>
                    <Text style={styles.fieldLabel}>Dia</Text>
                    <TouchableOpacity
                      style={styles.selectBoxFull}
                      onPress={() => {
                        setReportesDiaPickerOpen((prev) => !prev);
                        setReportesColegioPickerOpen(false);
                        setReportesCursoPickerOpen(false);
                        setReportesMesPickerOpen(false);
                      }}
                      disabled={reportesLoading}
                    >
                      <Text style={styles.selectText}>{reportesDia}</Text>
                    </TouchableOpacity>
                    {reportesDiaPickerOpen ? (
                      <View style={styles.pickerList}>
                        {reportDayOptions.map((dayValue) => (
                          <TouchableOpacity
                            key={`reporte-dia-${dayValue}`}
                            style={[styles.pickerItem, reportesDia === dayValue && styles.pickerItemActive]}
                            onPress={() => {
                              setReportesDia(dayValue);
                              setReportesDiaPickerOpen(false);
                            }}
                          >
                            <Text style={styles.dataItem}>{dayValue}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    ) : null}
                  </View>
                </View>

                <View style={styles.reportActionRow}>
                  <TouchableOpacity
                    style={[styles.reportActionBtn, styles.reportActionBtnPrimary, (reportesLoading || reportesBootLoading) && styles.reportGenerateBtnDisabled]}
                    onPress={handleGenerateInasistenciaReport}
                    disabled={reportesLoading || reportesBootLoading || !reportesCursoId}
                  >
                    <View style={styles.btnRow}>
                      <Ionicons name="bar-chart-outline" size={16} color="#fff" />
                      <Text style={styles.reportActionBtnText}>{reportesLoading ? 'Generando...' : 'Generar'}</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.reportActionBtn, styles.reportActionBtnInfo, reportesLoading && styles.reportGenerateBtnDisabled]}
                    onPress={() => {
                      const today = new Date();
                      setReportesMes(today.getMonth() + 1);
                      setReportesDia(today.getDate());
                      setReportesColegioPickerOpen(false);
                      setReportesMesPickerOpen(false);
                      setReportesDiaPickerOpen(false);
                      setReportesCursoPickerOpen(false);
                    }}
                    disabled={reportesLoading}
                  >
                    <View style={styles.btnRow}>
                      <Ionicons name="today-outline" size={16} color="#dbeafe" />
                      <Text style={styles.reportActionBtnText}>Hoy</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.reportActionBtn, styles.reportActionBtnGhost, reportesLoading && styles.reportGenerateBtnDisabled]}
                    onPress={resetReportesFilters}
                    disabled={reportesLoading}
                  >
                    <View style={styles.btnRow}>
                      <Ionicons name="refresh-outline" size={16} color="#e2e8f0" />
                      <Text style={styles.reportActionBtnText}>Limpiar</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {reportesError ? <Text style={styles.errorText}>{reportesError}</Text> : null}
              </View>

              {reportesBootLoading ? (
                <View style={styles.dataBox}>
                  <Text style={styles.dataBullet}>Cargando cursos...</Text>
                </View>
              ) : null}

              {reportesDetalle ? (
                <>
                  <View style={styles.reportMetricGrid}>
                    <View style={styles.reportMetricCard}>
                      <Text style={styles.reportMetricLabel}>Curso</Text>
                      <Text style={styles.reportMetricValue}>{reportesDetalle?.curso?.nombre || reportesCursoNombre}</Text>
                      <Text style={styles.reportMetricHint}>Filtro actual</Text>
                    </View>
                    <View style={styles.reportMetricCard}>
                      <Text style={styles.reportMetricLabel}>Dia</Text>
                      <Text style={styles.reportMetricValue}>{reportesDetalle?.detalleDia?.totalInasistencias || 0}</Text>
                      <Text style={styles.reportMetricHint}>Inasistencias el {reportesDia}/{reportesMes}</Text>
                    </View>
                    <View style={styles.reportMetricCard}>
                      <Text style={styles.reportMetricLabel}>Mes</Text>
                      <Text style={styles.reportMetricValue}>{reportesDetalle?.resumenMes?.inasistencias || 0}</Text>
                      <Text style={styles.reportMetricHint}>Faltas registradas del mes</Text>
                    </View>
                  </View>

                  <View style={styles.dataBox}>
                    <Text style={styles.dataTitle}>Detalle del dia seleccionado</Text>
                    <Text style={styles.dataItem}>Fecha: <Text style={styles.dataValue}>{reportesDetalle?.fecha}</Text></Text>
                    <Text style={styles.dataItem}>Ausentes: <Text style={styles.dataValue}>{reportesDetalle?.detalleDia?.totalAusentes || 0}</Text></Text>
                    <Text style={styles.dataItem}>Fuera del aula: <Text style={styles.dataValue}>{reportesDetalle?.detalleDia?.totalAfuera || 0}</Text></Text>
                    <Text style={styles.dataItem}>Sin registro: <Text style={styles.dataValue}>{reportesDetalle?.detalleDia?.totalSinRegistro || 0}</Text></Text>

                    <View style={styles.reportListSection}>
                      <Text style={styles.fieldLabel}>Estudiantes con inasistencia</Text>
                      {Array.isArray(reportesDetalle?.detalleDia?.estudiantes) && reportesDetalle.detalleDia.estudiantes.length > 0 ? (
                        reportesDetalle.detalleDia.estudiantes.map((student) => (
                          <View key={`reporte-dia-${student.id}`} style={styles.reportListItem}>
                            <Text style={styles.reportListTitle}>{student.nombres} {student.apellidos}</Text>
                            <Text style={styles.reportListMeta}>
                              {student.estadoActual ? `Estado: ${student.estadoActual}` : 'Sin registro de asistencia'}
                            </Text>
                            {Array.isArray(student.materias) && student.materias.length > 0 ? (
                              <Text style={styles.reportListMeta}>
                                Materias: {student.materias.map((item) => (
                                  item?.materia
                                    ? `${item.materia}${item?.estadoActual ? ` (${item.estadoActual})` : ''}`
                                    : (item?.estadoActual ? `Sin materia (${item.estadoActual})` : 'Sin materia')
                                )).join(', ')}
                              </Text>
                            ) : null}
                          </View>
                        ))
                      ) : (
                        <Text style={styles.dataBullet}>No se encontraron inasistencias para el dia seleccionado.</Text>
                      )}
                    </View>
                  </View>

                  <View style={styles.dataBox}>
                    <Text style={styles.dataTitle}>Resumen del mes</Text>
                    <Text style={styles.dataItem}>Dias con registro: <Text style={styles.dataValue}>{reportesDetalle?.resumenMes?.diasConRegistro || 0}</Text></Text>
                    <Text style={styles.dataItem}>Dias con inasistencias: <Text style={styles.dataValue}>{reportesDetalle?.resumenMes?.diasConInasistencias || 0}</Text></Text>
                    <Text style={styles.dataItem}>Estudiantes con faltas: <Text style={styles.dataValue}>{reportesDetalle?.resumenMes?.estudiantesConFaltas || 0}</Text></Text>

                    <View style={styles.reportListSection}>
                      <Text style={styles.fieldLabel}>Dias con mas faltas del mes</Text>
                      {Array.isArray(reportesDetalle?.diasMasCriticosMes) && reportesDetalle.diasMasCriticosMes.length > 0 ? (
                        reportesDetalle.diasMasCriticosMes.map((dayItem) => (
                          <View key={`reporte-mes-dia-${dayItem.fecha}`} style={styles.reportListItem}>
                            <Text style={styles.reportListTitle}>{dayItem.fecha}</Text>
                            <Text style={styles.reportListMeta}>{dayItem.inasistencias} faltas</Text>
                          </View>
                        ))
                      ) : (
                        <Text style={styles.dataBullet}>No hay faltas registradas en el mes seleccionado.</Text>
                      )}
                    </View>

                    <View style={styles.reportListSection}>
                      <Text style={styles.fieldLabel}>Estudiantes con mas faltas en el mes</Text>
                      {Array.isArray(reportesDetalle?.estudiantesConMasFaltas) && reportesDetalle.estudiantesConMasFaltas.length > 0 ? (
                        reportesDetalle.estudiantesConMasFaltas.map((student) => (
                          <View key={`reporte-mes-est-${student.estudianteId}`} style={styles.reportListItem}>
                            <Text style={styles.reportListTitle}>{student.nombre}</Text>
                            <Text style={styles.reportListMeta}>
                              {student.inasistencias} faltas - {student.ausente} ausente - {student.afuera} afuera
                            </Text>
                          </View>
                        ))
                      ) : (
                        <Text style={styles.dataBullet}>No hay estudiantes con faltas registradas en el mes.</Text>
                      )}
                    </View>
                  </View>
                </>
              ) : null}
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
                <View style={styles.btnRow}><Ionicons name="close-outline" size={16} color="#fecaca" /><Text style={styles.closeBtnText}>Cerrar</Text></View>
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
        visible={resetPasswordFeedbackModal.visible}
        onRequestClose={() => setResetPasswordFeedbackModal({ visible: false, title: '', message: '' })}
      >
        <View style={styles.modalBackdrop}>
          <View style={[
            styles.resetPasswordModalCard,
            String(resetPasswordFeedbackModal.title || '').toLowerCase() === 'error' && styles.resetPasswordModalCardError
          ]}>
            <View style={[
              styles.resetPasswordIconWrap,
              String(resetPasswordFeedbackModal.title || '').toLowerCase() === 'error' && styles.resetPasswordIconWrapError
            ]}>
              <Ionicons
                name={String(resetPasswordFeedbackModal.title || '').toLowerCase() === 'error' ? 'alert-circle-outline' : 'key-outline'}
                size={22}
                color={String(resetPasswordFeedbackModal.title || '').toLowerCase() === 'error' ? '#fecaca' : '#bbf7d0'}
              />
            </View>
            <Text style={styles.resetPasswordModalTitle}>{resetPasswordFeedbackModal.title || 'Informacion'}</Text>
            <Text style={styles.resetPasswordModalText}>{resetPasswordFeedbackModal.message}</Text>
            <TouchableOpacity
              style={styles.resetPasswordModalBtn}
              onPress={() => setResetPasswordFeedbackModal({ visible: false, title: '', message: '' })}
            >
              <Text style={styles.resetPasswordModalBtnText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="fade"
        visible={changePasswordModalVisible}
        onRequestClose={closeManualChangePasswordModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, styles.changePasswordModalCard]}>
            <View style={styles.modalHeader}>
              <Text style={styles.periodTitle}>{isForcedPasswordChange ? 'Cambio obligatorio de clave' : 'Cambiar contrasena'}</Text>
              {!isForcedPasswordChange ? (
                <Pressable onPress={closeManualChangePasswordModal} style={styles.closeBtn}>
                  <View style={styles.btnRow}><Ionicons name="close-outline" size={16} color="#fecaca" /><Text style={styles.closeBtnText}>Cerrar</Text></View>
                </Pressable>
              ) : null}
            </View>
            <View style={styles.modalContent}>
              <Text style={styles.dataBullet}>
                {isForcedPasswordChange
                  ? 'Debes cambiar tu clave temporal para continuar.'
                  : 'Usa una clave segura: minimo 8 caracteres, mayuscula, minuscula, numero y caracter especial.'}
              </Text>

              <View style={styles.passwordInputWrap}>
                <TextInput
                  style={[styles.courseInput, styles.passwordInput]}
                  placeholder="Clave actual (temporal)"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showChangeCurrentPassword}
                  value={changePasswordForm.current}
                  onChangeText={(txt) => setChangePasswordForm((prev) => ({ ...prev, current: txt }))}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity style={styles.passwordEyeBtn} onPress={() => setShowChangeCurrentPassword((prev) => !prev)} disabled={changingPassword}>
                  <Ionicons name={showChangeCurrentPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#e5e7eb" />
                </TouchableOpacity>
              </View>

              <View style={styles.passwordInputWrap}>
                <TextInput
                  style={[styles.courseInput, styles.passwordInput]}
                  placeholder="Nueva clave"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showChangeNextPassword}
                  value={changePasswordForm.next}
                  onChangeText={(txt) => setChangePasswordForm((prev) => ({ ...prev, next: txt }))}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity style={styles.passwordEyeBtn} onPress={() => setShowChangeNextPassword((prev) => !prev)} disabled={changingPassword}>
                  <Ionicons name={showChangeNextPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#e5e7eb" />
                </TouchableOpacity>
              </View>

              <View style={styles.passwordInputWrap}>
                <TextInput
                  style={[styles.courseInput, styles.passwordInput]}
                  placeholder="Confirmar nueva clave"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showChangeConfirmPassword}
                  value={changePasswordForm.confirm}
                  onChangeText={(txt) => setChangePasswordForm((prev) => ({ ...prev, confirm: txt }))}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity style={styles.passwordEyeBtn} onPress={() => setShowChangeConfirmPassword((prev) => !prev)} disabled={changingPassword}>
                  <Ionicons name={showChangeConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#e5e7eb" />
                </TouchableOpacity>
              </View>

              {changePasswordError ? <Text style={styles.errorText}>{changePasswordError}</Text> : null}

              <View style={styles.courseFormActions}>
                {isForcedPasswordChange ? (
                  <TouchableOpacity style={[styles.smallBtn, styles.deleteBtn, changingPassword && { opacity: 0.6 }]} onPress={logout} disabled={changingPassword}>
                    <View style={styles.btnRow}>
                      <Ionicons name="log-out-outline" size={14} color="#e5e7eb" />
                      <Text style={styles.smallBtnText}>Cerrar sesion</Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={[styles.smallBtn, styles.outlineBtn, changingPassword && { opacity: 0.6 }]} onPress={closeManualChangePasswordModal} disabled={changingPassword}>
                    <View style={styles.btnRow}>
                      <Ionicons name="close-outline" size={14} color="#e5e7eb" />
                      <Text style={styles.smallBtnText}>Cancelar</Text>
                    </View>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={[styles.smallBtn, styles.createBtn, changingPassword && { opacity: 0.6 }]} onPress={handleSubmitForcedPasswordChange} disabled={changingPassword}>
                  <View style={styles.btnRow}>
                    <Ionicons name="save-outline" size={14} color="#e5e7eb" />
                    <Text style={styles.smallBtnText}>{changingPassword ? 'Actualizando...' : 'Actualizar clave'}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
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
        visible={estudianteDeleteSuccessModal.visible}
        onRequestClose={() => {
          clearEstudianteDeleteSuccessTimeout();
          setEstudianteDeleteSuccessModal({ visible: false, message: '' });
        }}
      >
        <View style={styles.statusModalBackdrop}>
          <View style={styles.estudianteDeleteSuccessCard}>
            <View style={styles.estudianteDeleteSuccessIconWrap}>
              <Ionicons name="checkmark-done-outline" size={24} color="#86efac" />
            </View>
            <View style={styles.estudianteDeleteSuccessContent}>
              <Text style={styles.estudianteDeleteSuccessTitle}>Eliminacion completada</Text>
              <Text style={styles.estudianteDeleteSuccessText}>{estudianteDeleteSuccessModal.message}</Text>
            </View>
            <Pressable
              style={styles.estudianteDeleteSuccessCloseBtn}
              onPress={() => {
                clearEstudianteDeleteSuccessTimeout();
                setEstudianteDeleteSuccessModal({ visible: false, message: '' });
              }}
            >
              <Ionicons name="close-outline" size={16} color="#cbd5e1" />
            </Pressable>
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
        visible={deleteEstudianteConfirmModal.visible}
        onRequestClose={() => {
          if (deleteEstudianteConfirmModal.deleting) return;
          setDeleteEstudianteConfirmModal({ visible: false, estudiante: null, deleting: false });
        }}
      >
        <View style={styles.statusModalBackdrop}>
          <View style={styles.deleteModalCard}>
            <View style={styles.deleteModalIconWrap}>
              <Ionicons name="warning-outline" size={24} color="#ef4444" />
            </View>
            <Text style={styles.deleteModalTitle}>Eliminar estudiante</Text>
            <Text style={styles.deleteModalText}>
              Vas a eliminar "
              {`${deleteEstudianteConfirmModal?.estudiante?.nombres || ''} ${deleteEstudianteConfirmModal?.estudiante?.apellidos || ''}`.trim() || 'este estudiante'}
              ". Esta accion no se puede deshacer.
            </Text>
            <View style={styles.deleteModalActions}>
              <TouchableOpacity
                style={[styles.deleteModalCancelBtn, deleteEstudianteConfirmModal.deleting && { opacity: 0.6 }]}
                disabled={deleteEstudianteConfirmModal.deleting}
                onPress={() => setDeleteEstudianteConfirmModal({ visible: false, estudiante: null, deleting: false })}
              >
                <Text style={styles.deleteModalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deleteModalConfirmBtn, deleteEstudianteConfirmModal.deleting && { opacity: 0.6 }]}
                disabled={deleteEstudianteConfirmModal.deleting}
                onPress={handleConfirmDeleteEstudiante}
              >
                <Text style={styles.deleteModalConfirmText}>
                  {deleteEstudianteConfirmModal.deleting ? 'Eliminando...' : 'Eliminar'}
                </Text>
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
  hero: { width: '100%', height: 170, borderRadius: 18, overflow: 'hidden', backgroundColor: '#000', marginTop: 0, alignSelf: 'center', shadowColor: '#000', shadowOpacity: 0.28, shadowOffset: { width: 0, height: 8 }, shadowRadius: 12, elevation: 5, alignItems: 'center', justifyContent: 'center' },
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
  actionGridMobile: { justifyContent: 'space-between', rowGap: 12, columnGap: 12 },
  btnRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  btnRowMobile: { width: '100%', minWidth: 0, justifyContent: 'center' },
  btnRowMobileStacked: { flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5 },
  actionBtn: { width: '48.8%', borderRadius: 14, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 4 }, shadowRadius: 6, elevation: 3 },
  actionBtnMobile: { width: '48%', flexBasis: '48%', maxWidth: '48%', minWidth: 0, paddingHorizontal: 10 },
  actionBtnFull: { width: '100%' },
  actionBtnRector: { width: '48.8%' },
  actionBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  actionBtnTextMobile: { fontSize: 12.5, flexShrink: 1, textAlign: 'center' },
  mobileLogoutRowCenter: { width: '100%', alignItems: 'center' },
  actionBtnTextMobileStacked: { width: '100%', lineHeight: 15, textAlign: 'center', alignSelf: 'center' },
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
  estudianteDeleteSuccessCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: '#0b1220',
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.42)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.32,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 8
  },
  estudianteDeleteSuccessIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(22,163,74,0.24)',
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.5)'
  },
  estudianteDeleteSuccessContent: { flex: 1, minWidth: 0, gap: 2 },
  estudianteDeleteSuccessTitle: { color: '#dcfce7', fontSize: 14, fontWeight: '900' },
  estudianteDeleteSuccessText: { color: '#bbf7d0', fontSize: 12.5, fontWeight: '700' },
  estudianteDeleteSuccessCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(51,65,85,0.65)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.35)'
  },
  resetPasswordModalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 18,
    backgroundColor: '#0b1324',
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.45)',
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#10b981',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 16,
    elevation: 6
  },
  resetPasswordModalCardError: {
    borderColor: 'rgba(248,113,113,0.5)',
    shadowColor: '#ef4444'
  },
  resetPasswordIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16,185,129,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.55)',
    marginBottom: 10
  },
  resetPasswordIconWrapError: {
    backgroundColor: 'rgba(239,68,68,0.18)',
    borderColor: 'rgba(248,113,113,0.55)'
  },
  resetPasswordModalTitle: { color: '#f8fafc', fontWeight: '900', fontSize: 18, textAlign: 'center', marginBottom: 8 },
  resetPasswordModalText: { color: '#cbd5e1', fontSize: 13.5, lineHeight: 20, textAlign: 'center', marginBottom: 14 },
  resetPasswordModalBtn: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#16a34a',
    borderWidth: 1,
    borderColor: '#22c55e'
  },
  resetPasswordModalBtnText: { color: '#ecfdf5', fontWeight: '900', fontSize: 14 },
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
  reportesModalCard: { width: Platform.OS === 'web' ? '52%' : '92%', maxWidth: 780, maxHeight: '82%', alignSelf: 'center' },
  periodModalCard: { ...SHARED_ACTION_MODAL },
  cursoModalCard: { ...SHARED_ACTION_MODAL },
  docenteCrudModalCard: { ...SHARED_ACTION_MODAL, marginTop: -12 },
  docentesModalCard: { ...SHARED_ACTION_MODAL },
  changePasswordModalCard: { ...SHARED_ACTION_MODAL, maxWidth: 520 },
  quickInfoModalCard: { ...SHARED_ACTION_MODAL },
  colegioModalCard: { ...SHARED_ACTION_MODAL },
  colegioListModalCard: { ...SHARED_ACTION_MODAL },
  modalContent: { padding: 16, gap: 12 },
  periodModalContent: { padding: 14, gap: 10 },
  cursoModalContent: { padding: 14, gap: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  closeBtn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: 'rgba(127,29,29,0.3)', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(248,113,113,0.45)' },
  closeBtnText: { color: '#fecaca', fontWeight: '700' },
  fieldLabel: { color: '#cbd5e1', fontWeight: '700', fontSize: 13 },
  input: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, color: '#fff', backgroundColor: 'rgba(255,255,255,0.04)' },
  inlineRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  colegioControlsGrid: { gap: 10 },
  colegioControlsGridRow: { width: '100%', justifyContent: 'space-between', alignItems: 'stretch', columnGap: 10, rowGap: 10, flexWrap: 'nowrap' },
  colegioControlGridBtn: { width: '48%', flexBasis: '48%', maxWidth: '48%', minWidth: 0, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, minHeight: 42 },
  colegioControlGridBtnRow: { width: '100%', minWidth: 0, justifyContent: 'center' },
  colegioControlGridBtnText: { flexShrink: 1, textAlign: 'center' },
  colegioControlsRowMobile: { justifyContent: 'space-between', rowGap: 10, columnGap: 10, alignItems: 'stretch' },
  colegioControlBtnMobile: { width: '48%', flexBasis: '48%', maxWidth: '48%', minWidth: 0, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 8 },
  colegioControlBtnRowMobile: { width: '100%', minWidth: 0, justifyContent: 'center' },
  colegioControlBtnTextMobile: { flexShrink: 1, textAlign: 'center', fontSize: 11.5 },
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
  studentsHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' },
  dataItem: { color: '#cbd5e1' },
  dataValue: { color: '#fff', fontWeight: '800' },
  dataBullet: { color: '#cbd5e1', fontSize: 12 },
  assignedCoursesHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 4 },
  assignedCoursesBadge: {
    minWidth: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(59,130,246,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.3)'
  },
  assignedCoursesBadgeText: { color: '#dbeafe', fontSize: 11.5, fontWeight: '800' },
  assignedCoursesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  assignedCourseChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(30,41,59,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.22)'
  },
  assignedCourseChipActive: {
    backgroundColor: 'rgba(59,130,246,0.2)',
    borderColor: 'rgba(96,165,250,0.48)'
  },
  assignedCourseChipText: { color: '#cbd5e1', fontSize: 12.5, fontWeight: '700' },
  assignedCourseChipTextActive: { color: '#eff6ff' },
  docentePerfilBox: {
    width: '100%',
    alignSelf: 'stretch',
    marginTop: 10,
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(15,23,42,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.24)',
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 4
  },
  docentePerfilHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },
  docentePerfilTitleWrap: { flex: 1, gap: 2 },
  docentePerfilEyebrow: { color: '#93c5fd', fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.8 },
  docentePerfilTitle: { color: '#f8fafc', fontSize: 18, fontWeight: '900' },
  docentePerfilBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(59,130,246,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.3)'
  },
  docentePerfilBadgeText: { color: '#dbeafe', fontSize: 11.5, fontWeight: '800' },
  docentePerfilSummary: { color: '#cbd5e1', fontSize: 13, lineHeight: 19 },
  docentePerfilError: { marginTop: 2 },
  docenteMateriaList: { gap: 10 },
  docenteMateriaCard: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(30,41,59,0.88)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.2)',
    gap: 10
  },
  docenteMateriaHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, flexWrap: 'nowrap' },
  docenteMateriaTitleBlock: { flexShrink: 0, minWidth: 120, paddingTop: 2 },
  docenteMateriaAside: { flex: 1, minWidth: 0, alignItems: 'flex-end' },
  docenteMateriaLabel: { color: '#93c5fd', fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.6 },
  docenteMateriaLabelInline: { color: '#93c5fd', fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  docenteMateriaCourseLine: { color: '#fff', fontSize: 16, fontWeight: '800' },
  docenteMateriaCourse: { color: '#fff', fontSize: 16, fontWeight: '800', marginTop: 2 },
  docenteMateriaMetaRow: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap' },
  docenteMateriaActionCenterRow: { width: '100%', marginTop: 8, alignItems: 'center' },
  docenteMateriaInlineChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(37,99,235,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.26)',
    maxWidth: '100%'
  },
  docenteMateriaInlineChipText: { color: '#dbeafe', fontSize: 12.5, fontWeight: '700', textAlign: 'center' },
  docenteMateriaActionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(14,165,233,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.42)',
    flexShrink: 0
  },
  docenteMateriaActionText: { color: '#e0f2fe', fontSize: 11.5, fontWeight: '800' },
  docenteMateriaNamesWrap: { width: '100%', minWidth: 0, flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end' },
  docenteMateriaChip: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(37,99,235,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.26)'
  },
  docenteMateriaChipText: { color: '#dbeafe', fontSize: 12, fontWeight: '700' },
  docenteMateriaEmptyHint: { color: '#94a3b8', fontSize: 12.5, fontStyle: 'italic' },
  docenteMateriaEmptyHintInline: { textAlign: 'right', alignSelf: 'center' },
  docenteMateriaEmptyCard: {
    minHeight: 74,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.18)',
    backgroundColor: 'rgba(30,41,59,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 16
  },
  docenteMateriaEmptyText: { color: '#cbd5e1', fontSize: 13, fontWeight: '700', textAlign: 'center' },
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
  reportFieldGroup: { gap: 6 },
  reportFiltersGrid: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginTop: 2 },
  reportFieldColumn: { flex: 1, minWidth: 160, gap: 6 },
  reportHeroCard: {
    marginTop: 2,
    marginBottom: 2,
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(15,23,42,0.82)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.24)',
    gap: 10
  },
  reportHeroHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reportHeroIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(14,116,144,0.34)',
    borderWidth: 1,
    borderColor: 'rgba(103,232,249,0.35)'
  },
  reportHeroTextWrap: { flex: 1, gap: 2 },
  reportHeroTitle: { color: '#ecfeff', fontSize: 14.5, fontWeight: '900' },
  reportHeroSubtitle: { color: '#cbd5e1', fontSize: 12.5, lineHeight: 17 },
  reportHeroChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  reportHeroChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(30,41,59,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.28)'
  },
  reportHeroChipText: { color: '#dbeafe', fontSize: 11.5, fontWeight: '800' },
  reportActionRow: { marginTop: 10, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  reportActionBtn: {
    minHeight: 42,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  reportActionBtnPrimary: {
    backgroundColor: '#0284c7',
    borderColor: '#38bdf8'
  },
  reportActionBtnInfo: {
    backgroundColor: 'rgba(37,99,235,0.28)',
    borderColor: 'rgba(96,165,250,0.45)'
  },
  reportActionBtnGhost: {
    backgroundColor: 'rgba(30,41,59,0.78)',
    borderColor: 'rgba(148,163,184,0.35)'
  },
  reportActionBtnText: { color: '#f8fafc', fontSize: 12.5, fontWeight: '800' },
  reportGenerateBtn: { alignSelf: 'flex-start', marginTop: 10 },
  reportGenerateBtnDisabled: { opacity: 0.65 },
  reportPickerEmpty: { paddingHorizontal: 12, paddingVertical: 10 },
  reportMetricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  reportMetricCard: {
    flexGrow: 1,
    minWidth: 150,
    backgroundColor: 'rgba(15,23,42,0.72)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.18)',
    padding: 14,
    gap: 4
  },
  reportMetricLabel: { color: '#94a3b8', fontSize: 11.5, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.4 },
  reportMetricValue: { color: '#f8fafc', fontSize: 22, fontWeight: '900' },
  reportMetricHint: { color: '#cbd5e1', fontSize: 12, lineHeight: 17 },
  reportListSection: { marginTop: 10, gap: 8 },
  reportListItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(30,41,59,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.18)',
    gap: 3
  },
  reportListTitle: { color: '#e2e8f0', fontSize: 13.5, fontWeight: '700' },
  reportListMeta: { color: '#cbd5e1', fontSize: 12, lineHeight: 18 },
  docentesOverviewSection: { marginTop: 6, width: '100%', alignSelf: 'stretch' },
  colegiosRegisteredBox: {
    gap: 10,
    padding: 14,
    backgroundColor: 'rgba(15,23,42,0.6)',
    borderColor: 'rgba(96,165,250,0.16)'
  },
  colegiosRegisteredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 2
  },
  colegioRegisteredCard: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(15,23,42,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.18)',
    gap: 12
  },
  colegioRegisteredCardActive: {
    backgroundColor: 'rgba(37,99,235,0.14)',
    borderColor: 'rgba(96,165,250,0.4)'
  },
  colegioRegisteredTopRow: {
    gap: 8
  },
  colegioRegisteredTitleWrap: {
    width: '100%',
    gap: 6
  },
  colegioRegisteredActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    flexWrap: 'nowrap',
    gap: 8
  },
  colegioRegisteredActionBtn: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8
  },
  colegioRegisteredActionBtnRow: {
    width: '100%',
    justifyContent: 'center'
  },
  colegioRegisteredEyebrow: {
    color: '#93c5fd',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.7
  },
  colegioRegisteredName: {
    color: '#f8fafc',
    fontSize: 17,
    fontWeight: '900'
  },
  colegioRegisteredMetaWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  colegioRegisteredMetaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(37,99,235,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.28)'
  },
  colegioRegisteredRoleChip: {
    backgroundColor: 'rgba(34,197,94,0.14)',
    borderColor: 'rgba(74,222,128,0.28)'
  },
  colegioRegisteredMetaChipText: {
    color: '#dbeafe',
    fontSize: 11.5,
    fontWeight: '800'
  },
  colegioRegisteredRoleChipText: {
    color: '#dcfce7'
  },
  colegioRegisteredDirectivoBox: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(30,41,59,0.84)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.14)',
    gap: 10
  },
  colegioRegisteredDirectivoTitle: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '800'
  },
  colegioRegisteredInfoGrid: {
    gap: 8
  },
  colegioRegisteredInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: 'rgba(15,23,42,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.14)',
    gap: 6
  },
  colegioRegisteredInfoLabel: {
    color: '#93c5fd',
    fontSize: 10.5,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  colegioRegisteredInfoValue: {
    color: '#f8fafc',
    fontSize: 12.5,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'right'
  },
  colegioRegisteredEmptyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(30,41,59,0.68)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.14)'
  },
  colegioRegisteredEmptyText: {
    color: '#cbd5e1',
    fontSize: 12.5,
    fontWeight: '600'
  },
  rectoresListWrap: {
    gap: 10
  },
  rectorRegisteredCard: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(30,41,59,0.86)',
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.22)',
    gap: 4
  },
  rectorRegisteredTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8
  },
  rectorRegisteredName: {
    color: '#f8fafc',
    fontSize: 14.5,
    fontWeight: '800',
    flex: 1
  },
  rectorRegisteredMeta: {
    color: '#cbd5e1',
    fontSize: 12
  },
  docenteInlineCard: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(30,41,59,0.86)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.22)',
    marginTop: 8,
    gap: 4
  },
  docenteInlineActions: { flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' },
  docenteInlineName: { color: '#f8fafc', fontSize: 14.5, fontWeight: '800' },
  docenteInlineMeta: { color: '#cbd5e1', fontSize: 12, lineHeight: 18 },
  docenteCourseChecklist: { marginTop: 6, gap: 8 },
  docenteCourseOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(30,41,59,0.88)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.25)'
  },
  docenteCourseOptionActive: {
    backgroundColor: 'rgba(30,58,138,0.35)',
    borderColor: 'rgba(96,165,250,0.62)'
  },
  docenteCourseOptionText: { color: '#cbd5e1', fontSize: 15, fontWeight: '600' },
  docenteCourseOptionTextActive: { color: '#eff6ff', fontWeight: '800' },
  docenteMateriasByCursoWrap: { marginTop: 10, gap: 10 },
  docenteMateriaCursoItem: {
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(15,23,42,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.18)'
  },
  docenteMateriaCursoLabel: { color: '#dbeafe', fontSize: 12.5, fontWeight: '800' },
  docenteMateriaCursoInput: { minHeight: 44, textAlignVertical: 'top' },
  docenteMateriaCursoHint: { color: '#93c5fd', fontSize: 11.5, fontStyle: 'italic' },
  docenteSummaryCard: { padding: 12, borderRadius: 14, backgroundColor: 'rgba(15,23,42,0.55)', borderWidth: 1, borderColor: 'rgba(148,163,184,0.16)', marginTop: 10, gap: 10 },
  docenteSummaryTopRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' },
  docenteSummaryTopRowMobile: { flexDirection: 'column', alignItems: 'stretch', gap: 10 },
  docenteSummaryHeader: { gap: 4, flex: 1, minWidth: 0 },
  docenteSummaryHeaderMobile: { width: '100%', minWidth: 0 },
  docenteSummaryActions: { flexDirection: 'row', gap: 8, alignSelf: 'flex-end', flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: '100%' },
  docenteSummaryActionsMobile: { width: '100%', alignSelf: 'stretch' },
  docenteSummaryActionBtnMobile: { flex: 1, minWidth: 0, alignItems: 'center' },
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
  adminCourseForm: { marginBottom: 10, gap: 8 },
  adminCourseInput: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: '#fff', backgroundColor: 'rgba(255,255,255,0.08)' },
  rectorCourseForm: { marginBottom: 10, gap: 8 },
  rectorCourseInput: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: '#fff', backgroundColor: 'rgba(255,255,255,0.08)' },
  estudianteMateriaSelectorBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(15,23,42,0.45)',
    gap: 8
  },
  estudianteMateriaChipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  estudianteMateriaChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(30,41,59,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.24)'
  },
  estudianteMateriaChipActive: {
    backgroundColor: 'rgba(16,185,129,0.18)',
    borderColor: 'rgba(16,185,129,0.55)'
  },
  estudianteMateriaChipText: { color: '#cbd5e1', fontSize: 12.5, fontWeight: '700' },
  estudianteMateriaChipTextActive: { color: '#ecfdf5' },
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
  adminCourseFormActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap' },
  rectorCourseFormActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap' },
  outlineBtn: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)', backgroundColor: 'transparent' },
  infoBtn: { backgroundColor: 'rgba(59,130,246,0.18)', borderWidth: 1, borderColor: 'rgba(96,165,250,0.45)' },
  createBtn: { backgroundColor: 'rgba(16,185,129,0.25)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.6)' },
  colegioRoleBtn: {
    backgroundColor: 'rgba(30,41,59,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.22)',
    shadowColor: '#020617',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2
  },
  colegioRoleBtnActive: {
    backgroundColor: 'rgba(37,99,235,0.28)',
    borderColor: 'rgba(96,165,250,0.65)',
    shadowColor: '#2563eb',
    shadowOpacity: 0.22
  },
  colegioRoleBtnText: {
    color: '#f8fafc'
  },
  colegioRectoresBtn: {
    backgroundColor: 'rgba(6,78,59,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.55)',
    shadowColor: '#10b981',
    shadowOpacity: 0.24,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 3
  },
  colegioListBtn: {
    backgroundColor: 'rgba(8,47,73,0.96)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.55)',
    shadowColor: '#0ea5e9',
    shadowOpacity: 0.24,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 3
  },
  colegioSaveBtn: {
    backgroundColor: '#10b981',
    borderWidth: 1.5,
    borderColor: '#6ee7b7',
    shadowColor: '#34d399',
    shadowOpacity: 0.38,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 14,
    elevation: 5
  },
  colegioCancelBtn: {
    backgroundColor: 'rgba(127,29,29,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.5)',
    shadowColor: '#ef4444',
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3
  },
  colegioCancelActions: {
    justifyContent: 'center'
  },
  colegioActionBtnText: {
    color: '#f8fafc'
  },
  colegioSuccessBanner: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.45)',
    backgroundColor: 'rgba(6,78,59,0.55)'
  },
  colegioSuccessText: {
    color: '#d1fae5',
    fontSize: 12.5,
    fontWeight: '800'
  },
  courseRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  courseCardRow: { paddingHorizontal: 8, paddingVertical: 8, borderRadius: 12, backgroundColor: 'rgba(15,23,42,0.38)', borderWidth: 1, borderColor: 'rgba(148,163,184,0.14)', borderBottomWidth: 1, borderBottomColor: 'rgba(148,163,184,0.14)', marginBottom: 6 },
  courseRowContent: { flex: 1, minWidth: 0, gap: 2, paddingRight: 2 },
  courseRowTitle: { color: '#f8fafc', fontSize: 15, fontWeight: '800' },
  courseRowActive: { backgroundColor: 'rgba(56,189,248,0.08)', borderRadius: 10, paddingHorizontal: 8 },
  courseRowActions: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end', alignSelf: 'center' },
  courseActionBtn: { paddingHorizontal: 8, paddingVertical: 7 },
  adminCourseRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  adminCourseCardRow: { paddingHorizontal: 8, paddingVertical: 8, borderRadius: 12, backgroundColor: 'rgba(15,23,42,0.38)', borderWidth: 1, borderColor: 'rgba(148,163,184,0.14)', borderBottomWidth: 1, borderBottomColor: 'rgba(148,163,184,0.14)', marginBottom: 6 },
  adminCourseRowContent: { flex: 1, minWidth: 0, gap: 2, paddingRight: 2 },
  adminCourseRowTitle: { color: '#f8fafc', fontSize: 15, fontWeight: '800' },
  adminCourseRowActions: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end', alignSelf: 'center' },
  adminCourseActionBtn: { paddingHorizontal: 8, paddingVertical: 7 },
  rectorCourseRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  rectorCourseCardRow: { paddingHorizontal: 8, paddingVertical: 8, borderRadius: 12, backgroundColor: 'rgba(15,23,42,0.38)', borderWidth: 1, borderColor: 'rgba(148,163,184,0.14)', borderBottomWidth: 1, borderBottomColor: 'rgba(148,163,184,0.14)', marginBottom: 6 },
  rectorCourseRowContent: { flex: 1, minWidth: 0, gap: 2, paddingRight: 2 },
  rectorCourseRowTitle: { color: '#f8fafc', fontSize: 15, fontWeight: '800' },
  rectorCourseRowActions: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end', alignSelf: 'center' },
  rectorCourseActionBtn: { paddingHorizontal: 8, paddingVertical: 7 },
  estudianteRowCard: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: 'rgba(15,23,42,0.56)',
    borderWidth: 1,
    borderColor: 'rgba(125,211,252,0.2)',
    marginTop: 8
  },
  estudianteRowContent: {
    gap: 5
  },
  estudianteRowName: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 21
  },
  estudianteRowMeta: {
    color: '#cbd5e1',
    fontSize: 12.5,
    lineHeight: 18
  },
  estudianteRowActions: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'nowrap'
  },
  estudianteRowActionBtn: {
    flex: 1,
    minWidth: 0,
    maxWidth: 170,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9
  },
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
  docenteGridLogoutRow: { width: '100%', alignItems: 'center' },
  docenteGridLogoutCentered: { width: '52%', maxWidth: 340, alignSelf: 'center' },
  rectorGridLogoutRow: { width: '100%', alignItems: 'center' },
  rectorGridLogoutCentered: { width: '52%', maxWidth: 340, alignSelf: 'center' },
  adminGridLogoutRow: { width: '100%', alignItems: 'center' },
  adminGridLogoutCentered: { width: '52%', maxWidth: 340, alignSelf: 'center' },
  docenteFooterLogoutCentered: { width: '52%', maxWidth: 340, alignSelf: 'center' },
  logoutText: { color: '#fff', fontWeight: '800', letterSpacing: 0.3 }
});




