import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Modal, Pressable } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useFocusEffect } from '@react-navigation/native';
import { registrarAsistencia, syncAsistenciasPendientes, getAsistenciasPendientesCount } from '../services/asistencias';
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

export default function QRScreen({ navigation }) {
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
  const [successModal, setSuccessModal] = useState({
    visible: false,
    cursoNombre: '',
    materiaNombre: '',
    estado: '',
    qr: '',
    hora: '',
    queued: false
  });
  const [errorModal, setErrorModal] = useState({ visible: false, title: '', message: '' });
  const [duplicateModal, setDuplicateModal] = useState({ visible: false, title: '', message: '' });
  const [infoModal, setInfoModal] = useState({ visible: false, title: '', message: '' });
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [syncingPending, setSyncingPending] = useState(false);
  const scanLockRef = useRef(false);
  const savingLockRef = useRef(false);

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
  }, [cursoId, docentePerfilCursos]);

  const refreshPendingCount = async () => {
    try {
      const count = await getAsistenciasPendientesCount();
      setPendingSyncCount(Number(count) || 0);
    } catch {}
  };

  const syncPendingIfAny = async () => {
    try {
      setSyncingPending(true);
      const result = await syncAsistenciasPendientes();
      setPendingSyncCount(Number(result?.pending || 0));
      return result;
    } finally {
      setSyncingPending(false);
    }
  };

  useEffect(() => {
    (async () => {
      await refreshPendingCount();
      await syncPendingIfAny();
      await refreshPendingCount();
    })();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      resetScanState();
      setEstadoModalVisible(false);
      setSuccessModal((prev) => ({ ...prev, visible: false }));
      setErrorModal((prev) => ({ ...prev, visible: false }));
      setDuplicateModal((prev) => ({ ...prev, visible: false }));
      setInfoModal((prev) => ({ ...prev, visible: false }));
      return undefined;
    }, [])
  );

  const resetScanState = () => {
    setPendingQr('');
    setScanned(false);
    scanLockRef.current = false;
    savingLockRef.current = false;
  };

  const cancelEstadoModal = () => {
    if (savingEstado) return;
    setEstadoModalVisible(false);
    setPendingQr('');
    // Evita relectura inmediata del mismo QR mientras sale de la pantalla.
    scanLockRef.current = true;
    setScanned(true);
    navigation.navigate('Inicio');
  };

  const closeSuccessModal = () => {
    setSuccessModal({
      visible: false,
      cursoNombre: '',
      materiaNombre: '',
      estado: '',
      qr: '',
      hora: '',
      queued: false
    });
    resetScanState();
  };

  const finishSuccessFlow = () => {
    closeSuccessModal();
    setCursoPickerOpen(false);
    setMateriaPickerOpen(false);
    navigation.navigate('Inicio');
  };

  const closeErrorModal = () => {
    setErrorModal({ visible: false, title: '', message: '' });
    resetScanState();
  };

  const closeDuplicateModal = () => {
    setDuplicateModal({ visible: false, title: '', message: '' });
    resetScanState();
  };

  const closeInfoModal = () => {
    setInfoModal({ visible: false, title: '', message: '' });
  };

  const cancelScannerFlow = () => {
    if (savingEstado) return;
    setCursoPickerOpen(false);
    setMateriaPickerOpen(false);
    setEstadoModalVisible(false);
    setSuccessModal({
      visible: false,
      cursoNombre: '',
      materiaNombre: '',
      estado: '',
      qr: '',
      hora: '',
      queued: false
    });
    resetScanState();
    navigation.navigate('Inicio');
  };

  const registrarConEstado = async (estado, qrValueOverride = pendingQr, options = {}) => {
    if (savingLockRef.current) return;
    savingLockRef.current = true;
    const cursoValue = Number(cursoId);
    const materiaValue = String((options?.materia ?? materiaSeleccionada) || '').trim();
    if (!cursoValue || !qrValueOverride) {
      setEstadoModalVisible(false);
      resetScanState();
      savingLockRef.current = false;
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

      setSuccessModal({
        visible: true,
        cursoNombre: cursos.find((curso) => String(curso.id) === String(cursoValue))?.nombre || `Curso ${cursoValue}`,
        materiaNombre: response?.registro?.materia?.nombre || materiaValue || '',
        estado,
        qr: qrValueOverride,
        hora: formatTimeLabel(
          response?.registro?.horaRegistro
          || response?.registro?.hora_registro
          || response?.registro?.updatedAt
          || response?.registro?.createdAt
          || response?.registro?.updated_at
          || response?.registro?.created_at
        ),
        queued: Boolean(response?.queued)
      });
      if (response?.queued) {
        await refreshPendingCount();
        Alert.alert('Sin internet estable', 'Asistencia guardada localmente. Se sincronizara automaticamente cuando vuelva la conexion.');
        const retrySync = await syncPendingIfAny();
        if (Number(retrySync?.sent || 0) > 0) {
          await refreshPendingCount();
        }
      } else {
        const syncResult = await syncPendingIfAny();
        if (Number(syncResult?.sent || 0) > 0) {
          await refreshPendingCount();
        }
      }
    } catch (e) {
      const backendError = String(e?.response?.data?.error || e.message || '').trim();
      if (e?.response?.status === 409 || backendError === 'La asistencia ya fue registrada para esta clase') {
        setDuplicateModal({
          visible: true,
          title: 'Asistencia ya registrada',
          message: 'Este estudiante ya fue escaneado para esta clase. Puedes continuar con el siguiente QR.'
        });
      } else if (backendError.toLowerCase().includes('no existe periodo activo')) {
        setErrorModal({
          visible: true,
          title: 'Periodo no activo',
          message: `No hay periodo activo para la fecha ${getLocalDateISO()}. Verifica el rango de fechas del periodo y la fecha del dispositivo.`
        });
      } else {
        setErrorModal({
          visible: true,
          title: 'No se pudo registrar',
          message: backendError || 'No se pudo registrar la asistencia'
        });
      }
    } finally {
      setSavingEstado(false);
      savingLockRef.current = false;
    }
  };

  const onBarcodeScanned = ({ data }) => {
    if (scanLockRef.current || scanned || savingLockRef.current || successModal.visible || errorModal.visible || duplicateModal.visible || infoModal.visible || estadoModalVisible) return;
    const cursoValue = Number(cursoId);
    if (!cursoValue) {
      setInfoModal({
        visible: true,
        title: 'Curso requerido',
        message: 'Selecciona un curso antes de escanear.'
      });
      return;
    }

    if (materiasDisponibles.length > 0 && !String(materiaSeleccionada || '').trim()) {
      Alert.alert('Materia requerida', 'Selecciona una materia antes de escanear.');
      return;
    }

    scanLockRef.current = true;
    setScanned(true);
    setPendingQr(String(data || ''));
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
        <Text style={styles.label}>Curso</Text>
        <Pressable
          style={styles.selectBox}
          onPress={() => {
            setCursoPickerOpen((prev) => !prev);
            setMateriaPickerOpen(false);
          }}
        >
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

        {materiasDisponibles.length > 0 ? (
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

        {pendingSyncCount > 0 ? (
          <View style={styles.offlineQueueBanner}>
            <View style={styles.offlineQueueInfo}>
              <Ionicons name="cloud-offline-outline" size={14} color="#fde68a" />
              <Text style={styles.offlineQueueText}>{pendingSyncCount} pendiente(s) por sincronizar</Text>
            </View>
            <Pressable
              style={[styles.offlineSyncBtn, syncingPending && { opacity: 0.6 }]}
              onPress={async () => {
                if (syncingPending) return;
                const result = await syncPendingIfAny();
                await refreshPendingCount();
                if (Number(result?.sent || 0) > 0) {
                  Alert.alert('Sincronizacion completa', `Se sincronizaron ${result.sent} registro(s).`);
                }
              }}
            >
              <Text style={styles.offlineSyncBtnText}>{syncingPending ? 'Sincronizando...' : 'Sincronizar'}</Text>
            </Pressable>
          </View>
        ) : null}

        <Pressable style={styles.overlayCancelBtn} onPress={cancelScannerFlow}>
          <View style={styles.btnRow}>
            <Ionicons name="close-outline" size={16} color="#fca5a5" />
            <Text style={styles.overlayCancelText}>Cancelar</Text>
          </View>
        </Pressable>
      </View>

      <Modal transparent visible={estadoModalVisible} onRequestClose={cancelEstadoModal} animationType="fade">
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

            <Pressable style={[styles.cancelBtn, savingEstado && { opacity: 0.6 }]} onPress={cancelEstadoModal}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={successModal.visible} onRequestClose={closeSuccessModal} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.successModalCard}>
            <View style={styles.successIconWrap}>
              <Ionicons name={successModal.queued ? 'cloud-offline-outline' : 'checkmark-done-outline'} size={28} color={successModal.queued ? '#facc15' : '#86efac'} />
            </View>
            <Text style={styles.successTitle}>{successModal.queued ? 'Registro en cola' : 'Asistencia registrada'}</Text>
            <Text style={styles.successText}>
              {successModal.queued
                ? 'Se guardo localmente por conectividad limitada. Se enviara al servidor cuando vuelva la senal.'
                : 'El registro se guardo correctamente y puedes continuar escaneando.'}
            </Text>
            <Text style={styles.successQuestion}>Deseas seguir escaneando?</Text>

            <View style={styles.successMetaCard}>
              <Text style={styles.successMetaLabel}>Curso</Text>
              <Text style={styles.successMetaValue}>{successModal.cursoNombre || 'Sin curso'}</Text>
              <Text style={styles.successMetaLabel}>Estado</Text>
              <Text style={styles.successMetaValue}>{successModal.estado || 'Sin estado'}</Text>
              {successModal.materiaNombre ? (
                <>
                  <Text style={styles.successMetaLabel}>Materia</Text>
                  <Text style={styles.successMetaValue}>{successModal.materiaNombre}</Text>
                </>
              ) : null}
              <Text style={styles.successMetaLabel}>QR</Text>
              <Text style={styles.successMetaValue}>{successModal.qr || 'Sin QR'}</Text>
              <Text style={styles.successMetaLabel}>Hora</Text>
              <Text style={styles.successMetaValue}>{successModal.hora || 'Sin hora'}</Text>
            </View>

            <View style={styles.successActions}>
              <TouchableOpacity style={styles.successBtnSecondary} onPress={finishSuccessFlow}>
                <View style={styles.btnRow}>
                  <Ionicons name="checkmark-outline" size={16} color="#e2e8f0" />
                  <Text style={styles.successBtnSecondaryText}>Finalizar</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.successBtn} onPress={closeSuccessModal}>
                <View style={styles.btnRow}>
                  <Ionicons name="scan-outline" size={16} color="#fff" />
                  <Text style={styles.successBtnText}>Seguir escaneando</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={errorModal.visible} onRequestClose={closeErrorModal} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.errorModalCard}>
            <View style={styles.errorIconWrap}>
              <Ionicons name="alert-circle-outline" size={26} color="#fca5a5" />
            </View>
            <Text style={styles.errorTitle}>{errorModal.title || 'Error'}</Text>
            <Text style={styles.errorTextModal}>{errorModal.message || 'Ocurrio un problema al registrar asistencia.'}</Text>
            <TouchableOpacity style={styles.errorBtn} onPress={closeErrorModal}>
              <View style={styles.btnRow}>
                <Ionicons name="checkmark-outline" size={15} color="#fff" />
                <Text style={styles.errorBtnText}>Entendido</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={duplicateModal.visible} onRequestClose={closeDuplicateModal} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.duplicateModalCard}>
            <View style={styles.duplicateIconWrap}>
              <Ionicons name="information-circle-outline" size={26} color="#93c5fd" />
            </View>
            <Text style={styles.duplicateTitle}>{duplicateModal.title || 'Asistencia ya registrada'}</Text>
            <Text style={styles.duplicateTextModal}>{duplicateModal.message || 'Este estudiante ya fue escaneado para esta clase.'}</Text>
            <TouchableOpacity style={styles.duplicateBtn} onPress={closeDuplicateModal}>
              <View style={styles.btnRow}>
                <Ionicons name="scan-outline" size={15} color="#fff" />
                <Text style={styles.duplicateBtnText}>Seguir escaneando</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={infoModal.visible} onRequestClose={closeInfoModal} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.infoModalCard}>
            <View style={styles.infoIconWrap}>
              <Ionicons name="scan-circle-outline" size={26} color="#67e8f9" />
            </View>
            <Text style={styles.infoTitle}>{infoModal.title || 'Informacion'}</Text>
            <Text style={styles.infoTextModal}>{infoModal.message || 'Revisa los datos antes de continuar.'}</Text>
            <TouchableOpacity style={styles.infoBtn} onPress={closeInfoModal}>
              <View style={styles.btnRow}>
                <Ionicons name="checkmark-outline" size={15} color="#fff" />
                <Text style={styles.infoBtnText}>Entendido</Text>
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
  offlineQueueBanner: {
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(250,204,21,0.45)',
    backgroundColor: 'rgba(113,63,18,0.45)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10
  },
  offlineQueueInfo: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  offlineQueueText: { color: '#fef3c7', fontSize: 12, fontWeight: '700' },
  offlineSyncBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(125,211,252,0.6)',
    backgroundColor: 'rgba(2,132,199,0.35)'
  },
  offlineSyncBtnText: { color: '#e0f2fe', fontSize: 12, fontWeight: '800' },
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
  successQuestion: { color: '#bbf7d0', fontSize: 14, fontWeight: '800', textAlign: 'center' },
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
  successActions: {
    marginTop: 4,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  successBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#16a34a',
    borderWidth: 1,
    borderColor: '#22c55e'
  },
  successBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  successBtnSecondary: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(51,65,85,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.45)'
  },
  successBtnSecondaryText: { color: '#e2e8f0', fontWeight: '800', fontSize: 14 },
  errorModalCard: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 18,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.35)',
    padding: 18,
    alignItems: 'center',
    gap: 10
  },
  errorIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(127,29,29,0.34)',
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.45)'
  },
  errorTitle: { color: '#fee2e2', fontWeight: '900', fontSize: 19, textAlign: 'center' },
  errorTextModal: { color: '#fecaca', fontSize: 13.5, lineHeight: 20, textAlign: 'center' },
  errorBtn: {
    marginTop: 4,
    width: '100%',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#dc2626',
    borderWidth: 1,
    borderColor: '#ef4444'
  },
  errorBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  duplicateModalCard: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 18,
    backgroundColor: '#0b1a33',
    borderWidth: 1,
    borderColor: 'rgba(147,197,253,0.35)',
    padding: 18,
    alignItems: 'center',
    gap: 10
  },
  duplicateIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(30,58,138,0.36)',
    borderWidth: 1,
    borderColor: 'rgba(147,197,253,0.45)'
  },
  duplicateTitle: { color: '#dbeafe', fontWeight: '900', fontSize: 19, textAlign: 'center' },
  duplicateTextModal: { color: '#bfdbfe', fontSize: 13.5, lineHeight: 20, textAlign: 'center' },
  duplicateBtn: {
    marginTop: 4,
    width: '100%',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#2563eb',
    borderWidth: 1,
    borderColor: '#3b82f6'
  },
  duplicateBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  infoModalCard: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 18,
    backgroundColor: '#0b1f2a',
    borderWidth: 1,
    borderColor: 'rgba(103,232,249,0.45)',
    padding: 18,
    alignItems: 'center',
    gap: 10
  },
  infoIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(8,145,178,0.28)',
    borderWidth: 1,
    borderColor: 'rgba(103,232,249,0.45)'
  },
  infoTitle: { color: '#cffafe', fontWeight: '900', fontSize: 19, textAlign: 'center' },
  infoTextModal: { color: '#a5f3fc', fontSize: 13.5, lineHeight: 20, textAlign: 'center' },
  infoBtn: {
    marginTop: 4,
    width: '100%',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#0891b2',
    borderWidth: 1,
    borderColor: '#06b6d4'
  },
  infoBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
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
  cancelText: { color: '#e2e8f0', fontWeight: '700' },
  overlayCancelBtn: {
    marginTop: 12,
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
    backgroundColor: 'rgba(127,29,29,0.32)',
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.55)'
  },
  overlayCancelText: { color: '#fecaca', fontWeight: '800' }
});
