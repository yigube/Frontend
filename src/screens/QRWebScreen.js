import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function QRWebScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Escaneo QR no disponible en web</Text>
        <Text style={styles.body}>
          Usa la app movil para escanear codigos QR con camara.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0c0c0f',
    paddingHorizontal: 20
  },
  card: {
    width: '100%',
    maxWidth: 460,
    backgroundColor: 'rgba(15,23,42,0.9)',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)'
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12
  },
  body: {
    color: '#cbd5e1',
    textAlign: 'center',
    lineHeight: 22
  }
});
