import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Platform } from 'react-native';
import { api } from '../services/api';
import ScreenBackground from '../components/ScreenBackground';
import { Ionicons } from '@expo/vector-icons';

export default function ReportesScreen() {
  const [downloading, setDownloading] = useState(false);

  const descargar = async () => {
    try {
      setDownloading(true);
      if (Platform.OS === 'web') {
        const res = await api.get('/reportes/asistencias.csv', { responseType: 'blob' });
        const blob = res.data instanceof Blob ? res.data : new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `asistencias-${Date.now()}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(blobUrl);
        Alert.alert('Reporte descargado', 'El archivo CSV fue descargado en tu navegador.');
        return;
      }

      const FileSystem = await import('expo-file-system');
      const url = `${api.defaults.baseURL}/reportes/asistencias.csv`;
      const target = FileSystem.documentDirectory + 'asistencias.csv';
      const res = await FileSystem.downloadAsync(url, target);
      Alert.alert('Reporte descargado', `Ruta: ${res.uri}`);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <ScreenBackground contentStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Descarga de reportes</Text>
        <TouchableOpacity
          style={[styles.downloadBtn, downloading && { opacity: 0.7 }]}
          onPress={descargar}
          disabled={downloading}
        >
          <View style={styles.btnRow}>
            <Ionicons name="download-outline" size={18} color="#fff" />
            <Text style={styles.downloadText}>{downloading ? 'Descargando...' : 'Descargar CSV'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { justifyContent: 'center' },
  card: { gap: 12, backgroundColor: 'rgba(255,255,255,0.92)', padding: 16, borderRadius: 12 },
  title: { fontWeight: '700', fontSize: 16, color: '#111' },
  downloadBtn: { backgroundColor: '#2563eb', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  downloadText: { color: '#fff', fontWeight: '700' },
  btnRow: { flexDirection: 'row', alignItems: 'center', gap: 8 }
});
