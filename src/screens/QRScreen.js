import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Modal, Pressable } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { getAusentesCurso, registrarAsistencia } from '../services/asistencias';
import { getCursos } from '../services/cursos';
import { getDocentes } from '../services/docentes';
import { useAuth } from '../store/useAuth';
import { Ionicons } from '@expo/vector-icons';

const getLocalDateISO = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formatTimeLabel = (value) => {
  const parsed = value ? new Date(value) : new Date();
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  }
  return parsed.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
};
const normalizeMateriaOption = (value = '') => String(value || '').trim().toLowerCase();

const buildEstadoFlags = (estado) => ({
  presente: estado === 'presente' || estado === 'tarde',
  tarde: estado === 'tarde',
  afuera: estado === 'afuera',
  ausente: estado === 'ausente'
});

export default function QRScreen({ route, navigation }) {
  const user = useAuth((state) => state.user);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [cursoId, setCursoId] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [docentePerfilCursos, setDocentePerfilCursos] = useState([]);
  const [loadingCursos, setLoadingCursos] = useState(false);
  const [cursoPickerOpen, setCursoPickerOpen] = useState(false);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState('');
  const [materiaPickerOpen, setMateriaPickerOpen] = useState(false);
  const [pendingQr, setPendingQr] = useState('');
  const [estadoModalVisible, setEstadoModalVisible] = useState(false);
  const [savingEstado, setSavingEstado] = useState(false);
  const [ausentesDelDia, setAusentesDelDia] = useState([]);
  const [loadingAusentes, setLoadingAusentes] = useState(false);
  const [autoAusenteModal, setAutoAusenteModal] = useState({
    visible: false,
    cursoNombre: '',
    materiaNombre: '',
    fecha: '',
    hora: ''
  });
  const scanMode = route?.params?.scanMode === 'absent-only' ? 'absent-only' : 'all';
  const absentOnlyMode = scanMode === 'absent-only';

  const getMateriasDisponiblesByCurso = (cursoValue) => {
    const curso = (docentePerfilCursos || []).find((item) => String(item?.id) === String(cursoValue));
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
  };

  const materiasDisponibles = getMateriasDisponiblesByCurso(cursoId);

  useEffect(() => {
    (async () => {
      if (!permission || !permission.granted) {
        await requestPermission();
      }
    })();
  }, [permission, requestPermission]);

  useEffect(() => {
    (async () => {
      setLoadingCursos(true);
      try {
        const [cursosData, docentesData] = await Promise.all([
          getCursos(),
          user?.schoolId ? getDocentes({ schoolId: user.schoolId }) : Promise.resolve([])
        ]);
        const safeCursos = Array.isArray(cursosData) ? cursosData : [];
        setCursos(safeCursos);

        const docentes = Array.isArray(docentesData) ? docentesData : [];
        const currentDocente = docentes.find((docente) => String(docente?.id) === String(user?.id))
          || docentes.find((docente) => String(docente?.email || '').toLowerCase() === String(user?.email || '').toLowerCase())
          || null;
        setDocentePerfilCursos(Array.isArray(currentDocente?.cursos) ? currentDocente.cursos : []);

        if (safeCursos.length > 0) setCursoId(safeCursos[0].id);
      } catch (e) {
        Alert.alert('Error', e?.response?.data?.error || 'No se pudieron cargar los cursos');
      } finally {
        setLoadingCursos(false);
      }
    })();
  }, [user?.email, user?.id, user?.schoolId]);

  useEffect(() => {
    const disponibles = getMateriasDisponiblesByCurso(cursoId);
    setMateriaSeleccionada((prev) => {
      if (prev && disponibles.some((item) => normalizeMateriaOption(item) === normalizeMateriaOption(prev))) {
        return prev;
      }
      return disponibles[0] || '';
    });
    setMateriaPickerOpen(false);
  }, [absentOnlyMode, cursoId, docentePerfilCursos]);

  const loadAusentesDelDia = async (cursoValue, materiaValue = materiaSeleccionada) => {
    if (!absentOnlyMode || !cursoValue) {
      setAusentesDelDia([]);
      return;
    }
    setLoadingAusentes(true);
    try {
      const params = {
        cursoId: cursoValue,
        fecha: getLocalDateISO()
      };
      const materiaNormalizada = String(materiaValue || '').trim();
      if (materiaNormalizada) params.materia = materiaNormalizada;
      const data = await getAusentesCurso(params);
      setAusentesDelDia(Array.isArray(data?.ausentes) ? data.ausentes : []);
    } catch (e) {
      setAusentesDelDia([]);
      Alert.alert('Error', e?.response?.data?.error || 'No se pudieron cargar los ausentes del curso');
    } finally {
      setLoadingAusentes(false);
    }
  };

  useEffect(() => {
    const cursoValue = Number(cursoId);
    if (!cursoValue || !absentOnlyMode) {
      setAusentesDelDia([]);
      return;
    }
    const disponibles = getMateriasDisponiblesByCurso(cursoValue);
    if (disponibles.length > 0 && !String(materiaSeleccionada || '').trim()) {
      setAusentesDelDia([]);
      return;
    }
    loadAusentesDelDia(cursoValue, materiaSeleccionada);
  }, [cursoId, absentOnlyMode, materiaSeleccionada, docentePerfilCursos]);

  const resetScanState = () => {
    setPendingQr('');
    setTimeout(() => setScanned(false), 500);
  };

  const closeAutoAusenteModal = () => {
    setAutoAusenteModal({ visible: false, cursoNombre: '', materiaNombre: '', fecha: '', hora: '' });
    navigation.navigate('Inicio');
  };

  const registrarConEstado = async (estado, qrValueOverride = pendingQr, options = {}) => {
      const { returnHome = false } = options;
    const cursoValue = Number(cursoId);
    const materiaValue = String((options?.materia ?? materiaSeleccionada) || '').trim();
    if (!cursoValue || !qrValueOverride) {
      setEstadoModalVisible(false);
      resetScanState();
      setScanned(false);
      return;
    }

    setEstadoModalVisible(false);
    setSavingEstado(true);
    try {
      const flags = buildEstadoFlags(estado);
      const response = await registrarAsistencia({
        qr: qrValueOverride,
        cursoId: cursoValue,
        fecha: getLocalDateISO(),
        estado,
        ...(materiaValue ? { materia: materiaValue } : {}),
        ...flags
      });

      if (returnHome) {
        setAutoAusenteModal({
          visible: true,
          cursoNombre: cursos.find((c) => String(c.id) === String(cursoValue))?.nombre || `Curso ${cursoValue}`,
          materiaNombre: response?.registro?.materia?.nombre || materiaValue || '',
          fecha: getLocalDateISO(),
          hora: formatTimeLabel(
            response?.registro?.horaRegistro
            || response?.registro?.hora_registro
            || response?.registro?.updatedAt
            || response?.registro?.createdAt
            || response?.registro?.updated_at
            || response?.registro?.created_at
          )
        });
      } else {
        Alert.alert(
          'Asistencia registrada',
          `QR: ${qrValueOverride}\nEstado: ${estado}${materiaValue ? `\nMateria: ${materiaValue}` : ''}`
        );
      }
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.error || e.message);
    } finally {
      if (absentOnlyMode) {
        await loadAusentesDelDia(cursoValue);
      }
      setSavingEstado(false);
      resetScanState();
    }
  };

  const onBarcodeScanned = async ({ data }) => {
    if (scanned) return;
    const cursoValue = Number(cursoId);
    if (!cursoValue) {
      Alert.alert('Curso requerido', 'Selecciona un curso antes de escanear.');
      return;
    }

    const qrValue = String(data || '');
    if (materiasDisponibles.length > 0 && !String(materiaSeleccionada || '').trim()) {
      Alert.alert('Materia requerida', 'Selecciona una materia antes de escanear.');
      return;
    }
    if (absentOnlyMode) {
      const allowScan = ausentesDelDia.some((item) => String(item.qr || '') === qrValue);
      if (!allowScan) {
        setScanned(true);
        Alert.alert('QR no habilitado', 'Este estudiante no aparece como ausente para el curso y fecha actual.');
        setTimeout(() => setScanned(false), 500);
        return;
      }

      setScanned(true);
      await registrarConEstado('ausente', qrValue, {
        returnHome: true,
        materia: materiaSeleccionada
      });
      return;
    }

    setScanned(true);
    setPendingQr(qrValue);
    setEstadoModalVisible(true);
  };

  if (!permission) {
    return <View style={styles.center}><Text>Solicitando permisos de camara...</Text></View>;
  }

  if (!permission.granted) {
    return <View style={styles.center}><Text>Permiso de camara denegado.</Text></View>;
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        style={{ flex: 1 }}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={onBarcodeScanned}
      />

      <View style={styles.overlay}>
        {absentOnlyMode ? (
          <View style={styles.modePill}>
            <Text style={styles.modePillText}>
              {loadingAusentes ? 'Cargando ausentes...' : `Solo ausentes: ${ausentesDelDia.length}`}
            </Text>
          </View>
        ) : null}

        <Text style={styles.label}>Curso</Text>
        <Pressable style={styles.selectBox} onPress={() => {
          setCursoPickerOpen((prev) => !prev);
          setMateriaPickerOpen(false);
        }}>
          <Text style={styles.selectText}>
            {loadingCursos
              ? 'Cargando cursos...'
              : (cursos.find((c) => String(c.id) === String(cursoId))?.nombre || 'Selecciona un curso')}
          </Text>
          <Ionicons name={cursoPickerOpen ? 'chevron-up-outline' : 'chevron-down-outline'} size={16} color="#e5e7eb" />
        </Pressable>

        {cursoPickerOpen ? (
          <View style={styles.dropdownList}>
            {cursos.length === 0 ? (
              <Text style={styles.dropdownHint}>No hay cursos disponibles</Text>
            ) : (
              cursos.map((c) => (
                <Pressable
                  key={c.id}
                  style={[styles.dropdownItem, String(cursoId) === String(c.id) && styles.dropdownItemActive]}
                  onPress={() => {
                    setCursoId(c.id);
                    setCursoPickerOpen(false);
                    setMateriaPickerOpen(false);
                  }}
                >
                  <Text style={styles.dropdownText}>{c.nombre}</Text>
                </Pressable>
              ))
            )}
          </View>
        ) : null}

        {absentOnlyMode ? (
          <>
            <Text style={[styles.label, styles.secondaryLabel]}>Materia</Text>
            <Pressable
              style={[styles.selectBox, materiasDisponibles.length === 0 && styles.selectBoxDisabled]}
              onPress={() => {
                if (materiasDisponibles.length === 0) return;
                setMateriaPickerOpen((prev) => !prev);
                setCursoPickerOpen(false);
              }}
            >
              <Text style={styles.selectText}>
                {materiasDisponibles.length === 0
                  ? 'No hay materias configuradas'
                  : (materiaSeleccionada || 'Selecciona una materia')}
              </Text>
              <Ionicons
                name={materiaPickerOpen ? 'chevron-up-outline' : 'chevron-down-outline'}
                size={16}
                color="#e5e7eb"
              />
            </Pressable>

            {materiaPickerOpen ? (
              <View style={styles.dropdownList}>
                {materiasDisponibles.map((materia) => (
                  <Pressable
                    key={materia}
                    style={[
                      styles.dropdownItem,
                      normalizeMateriaOption(materiaSeleccionada) === normalizeMateriaOption(materia) && styles.dropdownItemActive
                    ]}
                    onPress={() => {
                      setMateriaSeleccionada(materia);
                      setMateriaPickerOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownText}>{materia}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </>
        ) : materiasDisponibles.length > 0 ? (
          <>
            <Text style={[styles.label, styles.secondaryLabel]}>Materia</Text>
            <Pressable
              style={styles.selectBox}
              onPress={() => {
                setMateriaPickerOpen((prev) => !prev);
                setCursoPickerOpen(false);
              }}
            >
              <Text style={styles.selectText}>{materiaSeleccionada || 'Selecciona una materia'}</Text>
              <Ionicons
                name={materiaPickerOpen ? 'chevron-up-outline' : 'chevron-down-outline'}
                size={16}
                color="#e5e7eb"
              />
            </Pressable>

            {materiaPickerOpen ? (
              <View style={styles.dropdownList}>
                {materiasDisponibles.map((materia) => (
                  <Pressable
                    key={materia}
                    style={[
                      styles.dropdownItem,
                      normalizeMateriaOption(materiaSeleccionada) === normalizeMateriaOption(materia) && styles.dropdownItemActive
                    ]}
                    onPress={() => {
                      setMateriaSeleccionada(materia);
                      setMateriaPickerOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownText}>{materia}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </>
        ) : null}
      </View>

      <Modal transparent visible={estadoModalVisible} onRequestClose={() => {}} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Selecciona estado de asistencia</Text>
            <Text style={styles.modalSub}>QR: {pendingQr || 'N/D'}</Text>

            <View style={styles.estadoGrid}>
              {['presente', 'tarde', 'afuera', 'ausente'].map((estado) => (
                <TouchableOpacity
                  key={estado}
                  style={[styles.estadoBtn, savingEstado && { opacity: 0.6 }]}
                  onPress={() => registrarConEstado(estado, pendingQr, { materia: materiaSeleccionada })}
                  disabled={savingEstado}
                >
                  <Text style={styles.estadoText}>{savingEstado ? 'Guardando...' : estado}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Pressable
              style={[styles.cancelBtn, savingEstado && { opacity: 0.6 }]}
              onPress={() => {
                if (savingEstado) return;
                setEstadoModalVisible(false);
                setPendingQr('');
                setScanned(false);
              }}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={autoAusenteModal.visible} onRequestClose={closeAutoAusenteModal} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.successModalCard}>
            <View style={styles.successIconWrap}>
              <Ionicons name="checkmark-done-outline" size={28} color="#86efac" />
            </View>
            <Text style={styles.successTitle}>Falla registrada</Text>
            <Text style={styles.successText}>
              La inasistencia se registró correctamente y el estudiante quedó marcado como ausente.
            </Text>

            <View style={styles.successMetaCard}>
              <Text style={styles.successMetaLabel}>Curso</Text>
              <Text style={styles.successMetaValue}>{autoAusenteModal.cursoNombre || 'Sin curso'}</Text>
              {autoAusenteModal.materiaNombre ? (
                <>
                  <Text style={styles.successMetaLabel}>Materia</Text>
                  <Text style={styles.successMetaValue}>{autoAusenteModal.materiaNombre}</Text>
                </>
              ) : null}
              <Text style={styles.successMetaLabel}>Fecha</Text>
              <Text style={styles.successMetaValue}>{autoAusenteModal.fecha || 'Sin fecha'}</Text>
              <Text style={styles.successMetaLabel}>Hora</Text>
              <Text style={styles.successMetaValue}>{autoAusenteModal.hora || 'Sin hora'}</Text>
            </View>

            <Text style={styles.successHint}>Al cerrar este mensaje volverás al menú principal.</Text>

            <TouchableOpacity style={styles.successBtn} onPress={closeAutoAusenteModal}>
              <View style={styles.btnRow}>
                <Ionicons name="home-outline" size={16} color="#fff" />
                <Text style={styles.successBtnText}>Volver al menu</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  overlay: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)'
  },
  modePill: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(250,204,21,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(250,204,21,0.5)'
  },
  modePillText: { color: '#fde68a', fontWeight: '800', fontSize: 12 },
  label: { color: '#fff', fontWeight: '700', marginBottom: 6 },
  secondaryLabel: { marginTop: 10 },
  selectBox: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8
  },
  selectBoxDisabled: {
    opacity: 0.65
  },
  selectText: { color: '#fff', fontWeight: '700', flexShrink: 1 },
  dropdownList: {
    marginTop: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(2,6,23,0.92)'
  },
  dropdownItem: { paddingHorizontal: 12, paddingVertical: 10 },
  dropdownItemActive: { backgroundColor: 'rgba(34,197,94,0.2)' },
  dropdownText: { color: '#e5e7eb' },
  dropdownHint: { color: '#cbd5e1', paddingHorizontal: 12, paddingVertical: 10 },
  btnRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 14,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    padding: 14
  },
  modalTitle: { color: '#fff', fontWeight: '800', fontSize: 16 },
  modalSub: { color: '#cbd5e1', marginTop: 4, marginBottom: 10 },
  successModalCard: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 18,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.35)',
    padding: 18,
    alignItems: 'center',
    gap: 10
  },
  successIconWrap: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(34,197,94,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.35)'
  },
  successTitle: { color: '#f0fdf4', fontWeight: '900', fontSize: 20, textAlign: 'center' },
  successText: { color: '#d1fae5', fontSize: 13.5, lineHeight: 20, textAlign: 'center' },
  successMetaCard: {
    width: '100%',
    borderRadius: 14,
    padding: 12,
    backgroundColor: 'rgba(15,23,42,0.95)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.18)',
    gap: 4
  },
  successMetaLabel: { color: '#86efac', fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  successMetaValue: { color: '#f8fafc', fontSize: 14, fontWeight: '800', marginBottom: 4 },
  successHint: { color: '#94a3b8', fontSize: 12, textAlign: 'center', lineHeight: 18 },
  successBtn: {
    marginTop: 4,
    width: '100%',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#16a34a',
    borderWidth: 1,
    borderColor: '#22c55e'
  },
  successBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  estadoGrid: { gap: 8 },
  estadoBtn: {
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
    backgroundColor: 'rgba(34,197,94,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.55)'
  },
  estadoText: { color: '#fff', fontWeight: '800', textTransform: 'capitalize' },
  cancelBtn: {
    marginTop: 10,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(148,163,184,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.45)'
  },
  cancelText: { color: '#e2e8f0', fontWeight: '700' }
});
