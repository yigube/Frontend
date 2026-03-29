import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { api } from '../services/api';
import { getCursos } from '../services/cursos';
import { getPeriodos } from '../services/periodos';

export default function ReportesWebScreen() {
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [cursoId, setCursoId] = useState('');
  const [periodoId, setPeriodoId] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [cursos, periodos] = await Promise.all([getCursos(), getPeriodos()]);
        if (cursos?.length) setCursoId(String(cursos[0].id));
        if (periodos?.length) setPeriodoId(String(periodos[0].id));
      } catch (e) {
        const apiError = e?.response?.data?.error || e?.response?.data?.message;
        Alert.alert('Error', apiError || e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const descargar = async () => {
    if (!cursoId || !periodoId) {
      Alert.alert('Datos requeridos', 'Ingresa cursoId y periodoId');
      return;
    }
    try {
      setDownloading(true);
      const res = await api.get('/reportes/asistencias.csv', {
        params: { cursoId, periodoId },
        responseType: 'blob'
      });
      const blobUrl = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `asistencias-curso-${cursoId}-periodo-${periodoId}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      const apiError = e?.response?.data?.error || e?.response?.data?.message;
      Alert.alert('Error', apiError || e.message);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Descargar reporte CSV</Text>
        <Text style={styles.label}>Curso ID</Text>
        <TextInput
          value={cursoId}
          onChangeText={setCursoId}
          keyboardType="numeric"
          style={styles.input}
          placeholder="Ej: 1"
        />
        <Text style={styles.label}>Periodo ID</Text>
        <TextInput
          value={periodoId}
          onChangeText={setPeriodoId}
          keyboardType="numeric"
          style={styles.input}
          placeholder="Ej: 1"
        />
        <TouchableOpacity style={[styles.button, downloading && { opacity: 0.7 }]} onPress={descargar} disabled={downloading}>
          <Text style={styles.buttonText}>{downloading ? 'Descargando...' : 'Descargar'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0c0c0f'
  },
  container: {
    flex: 1,
    backgroundColor: '#0c0c0f',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },
  card: {
    width: '100%',
    maxWidth: 460,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 14,
    padding: 16,
    gap: 8
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8
  },
  label: {
    color: '#111827',
    fontWeight: '600'
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#fff'
  },
  button: {
    marginTop: 8,
    backgroundColor: '#2563eb',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 12
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700'
  }
});
