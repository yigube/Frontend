import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TextInput, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { registrarAsistencia } from '../services/asistencias';
import { Ionicons } from '@expo/vector-icons';

export default function QRScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [cursoId, setCursoId] = useState('');

  useEffect(() => {
    (async () => {
      if (!permission || !permission.granted) {
        await requestPermission();
      }
    })();
  }, [permission]);

  const onBarcodeScanned = async ({ data }) => {
    if (scanned) return;
    const cursoValue = Number(cursoId);
    if (!cursoValue) {
      Alert.alert('Curso requerido', 'Ingresa un cursoId antes de escanear.');
      return;
    }
    setScanned(true);
    try {
      const qr = String(data);
      await registrarAsistencia({
        qr,
        cursoId: cursoValue,
        fecha: new Date().toISOString(),
        presente: true
      });
      Alert.alert('Asistencia registrada', `QR: ${qr}`);
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.error || e.message);
    } finally {
      setTimeout(() => setScanned(false), 1200);
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
        <Text style={styles.label}>Curso ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 1"
          keyboardType="numeric"
          value={cursoId}
          onChangeText={setCursoId}
        />
        <TouchableOpacity style={styles.clearBtn} onPress={() => setCursoId('')}>
          <View style={styles.btnRow}>
            <Ionicons name="close-outline" size={16} color="#fff" />
            <Text style={styles.clearText}>Limpiar</Text>
          </View>
        </TouchableOpacity>
      </View>
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
  input: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  clearBtn: {
    alignSelf: 'flex-end',
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)'
  },
  clearText: { color: '#fff', fontWeight: '700' },
  btnRow: { flexDirection: 'row', alignItems: 'center', gap: 6 }
});
