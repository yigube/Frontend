import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function ScreenBackground({ children, contentStyle }) {
  return (
    <View style={styles.background}>
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: '#0c0c0f', alignItems: 'center' },
  content: { flex: 1, width: '100%', maxWidth: 1180, padding: 16, gap: 10 }
});
