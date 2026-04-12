import React from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function AppInfoDialog({
  visible,
  title = 'Informacion',
  message = '',
  tone = 'info',
  buttonLabel = 'Entendido',
  onClose
}) {
  const iconByTone = {
    info: { name: 'information-circle-outline', color: '#93c5fd' },
    success: { name: 'checkmark-circle-outline', color: '#86efac' },
    warning: { name: 'warning-outline', color: '#fbbf24' },
    error: { name: 'alert-circle-outline', color: '#fca5a5' }
  };
  const toneConfig = iconByTone[tone] || iconByTone.info;

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.titleWrap}>
              <Ionicons name={toneConfig.name} size={22} color={toneConfig.color} />
              <Text style={styles.title}>{title}</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close-outline" size={18} color="#94a3b8" />
            </Pressable>
          </View>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={onClose}>
            <Text style={styles.primaryBtnText}>{buttonLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export function AppConfirmDialog({
  visible,
  title = 'Confirmar',
  message = '',
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  danger = false,
  loading = false
}) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.titleWrap}>
              <Ionicons name={danger ? 'warning-outline' : 'help-circle-outline'} size={22} color={danger ? '#fca5a5' : '#93c5fd'} />
              <Text style={styles.title}>{title}</Text>
            </View>
            <Pressable onPress={onCancel} style={styles.closeBtn} disabled={loading}>
              <Ionicons name="close-outline" size={18} color="#94a3b8" />
            </Pressable>
          </View>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={onCancel} disabled={loading}>
              <Text style={styles.secondaryBtnText}>{cancelLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.primaryBtn, danger && styles.dangerBtn, loading && { opacity: 0.7 }]}
              onPress={onConfirm}
              disabled={loading}
            >
              <Text style={styles.primaryBtnText}>{loading ? 'Procesando...' : confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(2,6,23,0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18
  },
  card: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: 'rgba(15,23,42,0.96)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.28)',
    borderRadius: 18,
    padding: 16,
    gap: 12,
    shadowColor: '#020617',
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 22,
    elevation: 12
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  titleWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  title: { color: '#f8fafc', fontSize: 18, fontWeight: '800', flexShrink: 1 },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15,23,42,0.55)'
  },
  message: { color: '#cbd5e1', fontSize: 13.5, lineHeight: 20 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  primaryBtn: {
    backgroundColor: '#2563eb',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.7)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  dangerBtn: { backgroundColor: '#b91c1c', borderColor: '#ef4444' },
  primaryBtnText: { color: '#eff6ff', fontWeight: '800' },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.45)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  secondaryBtnText: { color: '#e2e8f0', fontWeight: '700' }
});
