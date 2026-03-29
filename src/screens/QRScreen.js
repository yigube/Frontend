import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Modal, Pressable } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { getAusentesCurso, registrarAsistencia } from '../services/asistencias';
import { getCursos } from '../services/cursos';
import { Ionicons } from '@expo/vector-icons';

const getLocalDateISO = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};
const buildEstadoFlags = (estado) => ({
  presente: estado === 'presente' || estado === 'tarde',
  tarde: estado === 'tarde',
  afuera: estado === 'afuera',
  ausente: estado === 'ausente'
});

export default function QRScreen({ route }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [cursoId, setCursoId] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [loadingCursos, setLoadingCursos] = useState(false);
  const [cursoPickerOpen, setCursoPickerOpen] = useState(false);
  const [pendingQr, setPendingQr] = useState('');
  const [estadoModalVisible, setEstadoModalVisible] = useState(false);
  const [savingEstado, setSavingEstado] = useState(false);
  const [ausentesDelDia, setAusentesDelDia] = useState([]);
  const [loadingAusentes, setLoadingAusentes] = useState(false);
  const scanMode = route?.params?.scanMode === 'absent-only' ? 'absent-only' : 'all';
  const absentOnlyMode = scanMode === 'absent-only';

  useEffect(() => {
    (async () => {
      if (!permission || !permission.granted) {
        await requestPermission();
      }
    })();
  }, [permission]);

  useEffect(() => {
    (async () => {
      setLoadingCursos(true);
      try {
        const data = await getCursos();
        setCursos(data);
        if (data.length > 0) setCursoId(data[0].id);
      } catch (e) {
        Alert.alert('Error', e?.response?.data?.error || 'No se pudieron cargar los cursos');
      } finally {
        setLoadingCursos(false);
      }
    })();
  }, []);

  const loadAusentesDelDia = async (cursoValue) => {
    if (!absentOnlyMode || !cursoValue) {
      setAusentesDelDia([]);
      return;
    }
    setLoadingAusentes(true);
    try {
      const data = await getAusentesCurso({
        cursoId: cursoValue,
        fecha: getLocalDateISO()
      });
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
    loadAusentesDelDia(cursoValue);
  }, [cursoId, absentOnlyMode]);

  const onBarcodeScanned = async ({ data }) => {
    if (scanned) return;
    const cursoValue = Number(cursoId);
    if (!cursoValue) {
      Alert.alert('Curso requerido', 'Selecciona un curso antes de escanear.');
      return;
    }
    const qrValue = String(data || '');
    if (absentOnlyMode) {
      const allowScan = ausentesDelDia.some((item) => String(item.qr || '') === qrValue);
      if (!allowScan) {
        setScanned(true);
        Alert.alert('QR no habilitado', 'Este estudiante no aparece como ausente para el curso y fecha actual.');
        setTimeout(() => setScanned(false), 500);
        return;
      }
    }

    setScanned(true);
    setPendingQr(qrValue);
    setEstadoModalVisible(true);
  };

  const registrarConEstado = async (estado) => {
    const cursoValue = Number(cursoId);
    if (!cursoValue || !pendingQr) {
      setEstadoModalVisible(false);
      setPendingQr('');
      setScanned(false);
      return;
    }
    setEstadoModalVisible(false);
    setSavingEstado(true);
    try {
      const flags = buildEstadoFlags(estado);
      await registrarAsistencia({
        qr: pendingQr,
        cursoId: cursoValue,
        fecha: getLocalDateISO(),
        estado,
        ...flags
      });
      Alert.alert('Asistencia registrada', `QR: ${pendingQr}\nEstado: ${estado}`);
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.error || e.message);
    } finally {
      if (absentOnlyMode) {
        await loadAusentesDelDia(cursoValue);
      }
      setSavingEstado(false);
      setPendingQr('');
      setTimeout(() => setScanned(false), 500);
    }
  };

  if (!permission) {
    return <View style={styles.center}><Text>Solicitando permisos de cámara...</Text></View>;
  }
  if (!permission.granted) {
    return <View style={styles.center}><Text>Permiso de cámara denegado.</Text></View>;
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
        <Pressable style={styles.selectBox} onPress={() => setCursoPickerOpen((prev) => !prev)}>
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
                  }}
                >
                  <Text style={styles.dropdownText}>{c.nombre}</Text>
                </Pressable>
              ))
            )}
          </View>
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
                  onPress={() => registrarConEstado(estado)}
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
