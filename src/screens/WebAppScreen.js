import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../store/useAuth';
import WebHomeScreen from './WebHomeScreen';
import CursosScreen from './CursosScreen';
import EstudiantesScreen from './EstudiantesScreen';
import ReportesWebScreen from './ReportesWebScreen';
import QRWebScreen from './QRWebScreen';

const MODULES = [
  { key: 'inicio', label: 'Inicio' },
  { key: 'cursos', label: 'Cursos' },
  { key: 'estudiantes', label: 'Estudiantes' },
  { key: 'reportes', label: 'Reportes' },
  { key: 'qr', label: 'QR' }
];

function ModuleView({ active }) {
  if (active === 'cursos') return <CursosScreen />;
  if (active === 'estudiantes') return <EstudiantesScreen />;
  if (active === 'reportes') return <ReportesWebScreen />;
  if (active === 'qr') return <QRWebScreen />;
  return <WebHomeScreen />;
}

export default function WebAppScreen() {
  const logout = useAuth((s) => s.logout);
  const [active, setActive] = useState('inicio');

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.brand}>Asistencia Web</Text>
        <TouchableOpacity style={styles.logout} onPress={logout}>
          <Text style={styles.logoutText}>Cerrar sesion</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.moduleBar}>
        {MODULES.map((m) => (
          <TouchableOpacity
            key={m.key}
            style={[styles.moduleBtn, active === m.key && styles.moduleBtnActive]}
            onPress={() => setActive(m.key)}
          >
            <Text style={[styles.moduleText, active === m.key && styles.moduleTextActive]}>
              {m.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        <ModuleView active={active} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1220'
  },
  topBar: {
    height: 62,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  brand: {
    color: '#e5e7eb',
    fontSize: 20,
    fontWeight: '800'
  },
  logout: {
    backgroundColor: '#dc2626',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700'
  },
  moduleBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)'
  },
  moduleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.06)'
  },
  moduleBtnActive: {
    backgroundColor: '#2563eb'
  },
  moduleText: {
    color: '#9ca3af',
    fontWeight: '700'
  },
  moduleTextActive: {
    color: '#fff'
  },
  content: {
    flex: 1
  }
});
