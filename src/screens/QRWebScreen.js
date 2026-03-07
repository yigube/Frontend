import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function QRWebScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escaneo QR no disponible en web</Text>
      <Text style={styles.body}>
        Usa la app movil para escanear codigos QR con camara.
      </Text>
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
