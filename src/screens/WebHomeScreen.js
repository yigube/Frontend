import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../store/useAuth';

export default function WebHomeScreen() {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Asistencia Web</Text>
        <Text style={styles.subtitle}>Sesion iniciada correctamente</Text>
        <Text style={styles.row}>Usuario: {user?.email || 'N/D'}</Text>
        <Text style={styles.row}>Rol: {user?.rol || 'N/D'}</Text>
        <Text style={styles.row}>Colegio: {user?.schoolName || user?.schoolId || 'N/D'}</Text>

        <TouchableOpacity style={styles.button} onPress={logout}>
          <Text style={styles.buttonText}>Cerrar sesion</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c0f',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 14,
    padding: 20,
    gap: 10
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111'
  },
  subtitle: {
    color: '#374151',
    marginBottom: 8
  },
  row: {
    color: '#111827'
  },
  button: {
    marginTop: 12,
    backgroundColor: '#dc2626',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700'
  }
});
