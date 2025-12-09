import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { api } from '../services/api';
import ScreenBackground from '../components/ScreenBackground';

export default function ReportesScreen() {
  const [downloading, setDownloading] = useState(false);

  const descargar = async () => {
    try {
      setDownloading(true);
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
        <Button title={downloading ? 'Descargando...' : 'Descargar CSV'} onPress={descargar} disabled={downloading} />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { justifyContent: 'center' },
  card: { gap: 12, backgroundColor: 'rgba(255,255,255,0.92)', padding: 16, borderRadius: 12 },
  title: { fontWeight: '700', fontSize: 16, color: '#111' }
});
