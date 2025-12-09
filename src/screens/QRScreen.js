import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { registrarAsistencia } from '../services/asistencias';

export default function QRScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      if (!permission || !permission.granted) {
        await requestPermission();
      }
    })();
  }, [permission]);

  const onBarcodeScanned = async ({ data }) => {
    if (scanned) return;
    setScanned(true);
    try {
      const studentId = String(data);
      await registrarAsistencia({ estudianteId: studentId, estado: 'PRESENTE' });
      Alert.alert('Asistencia registrada', `ID: ${studentId}`);
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.message || e.message);
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
    </View>
  );
}

const styles = StyleSheet.create({ center: { flex: 1, alignItems: 'center', justifyContent: 'center' } });
