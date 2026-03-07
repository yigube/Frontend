import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[AppErrorBoundary]', error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;

    const message = String(this.state.error?.message || this.state.error);
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Error de interfaz</Text>
        <Text style={styles.text}>
          Ocurrio un error al renderizar la aplicacion.
        </Text>
        {Platform.OS === 'web' ? (
          <ScrollView style={styles.box}>
            <Text style={styles.code}>{message}</Text>
          </ScrollView>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0c0c0f',
    padding: 20
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10
  },
  text: {
    color: '#cbd5e1',
    textAlign: 'center',
    marginBottom: 12
  },
  box: {
    width: '100%',
    maxHeight: 180,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    padding: 10
  },
  code: {
    color: '#fca5a5'
  }
});
