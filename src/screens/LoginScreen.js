import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Modal, Pressable, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../store/useAuth';
import { requestPasswordReset } from '../services/auth';
import { AppInfoDialog } from '../components/AppDialog';

export default function LoginScreen() {
  const { control, handleSubmit } = useForm({ defaultValues: { email: '', password: '' } });
  const passwordInputRef = useRef(null);
  const login = useAuth(s => s.login);
  const loading = useAuth(s => s.loading);
  const [showPassword, setShowPassword] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [sendingTemporaryPassword, setSendingTemporaryPassword] = useState(false);
  const [resetForm, setResetForm] = useState({ email: '' });
  const [resetError, setResetError] = useState('');
  const [feedbackModal, setFeedbackModal] = useState({ visible: false, title: '', message: '', tone: 'info' });
  const isWeb = Platform.OS === 'web';

  const showFeedback = (title, message, tone = 'info') => {
    setFeedbackModal({ visible: true, title, message, tone });
  };

  const openResetModal = () => {
    setResetError('');
    setResetForm({ email: '' });
    setResetModalVisible(true);
  };

  const closeResetModal = () => {
    if (sendingTemporaryPassword) return;
    setResetModalVisible(false);
  };

  const handleSubmitResetPassword = async () => {
    if (sendingTemporaryPassword) return;
    const email = String(resetForm.email || '').trim().toLowerCase();

    if (!email) {
      setResetError('Ingresa un correo valido');
      return;
    }

    setSendingTemporaryPassword(true);
    try {
      await requestPasswordReset(email);
      setResetModalVisible(false);
      showFeedback(
        'Clave temporal enviada',
        'Revisa tu correo. Ingresa con la clave temporal y luego cambiala desde la app.',
        'success'
      );
    } catch (e) {
      setResetError(e?.response?.data?.error || e?.message || 'No se pudo enviar la clave temporal');
    } finally {
      setSendingTemporaryPassword(false);
    }
  };

  const onSubmit = async ({ email, password }) => {
    try {
      await login(email, password);
    } catch (e) {
      const apiError = e?.response?.data?.error || e?.response?.data?.message;
      showFeedback('Error de autenticacion', apiError || e.message, 'error');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/edusac-header.png')} style={styles.logo} resizeMode="contain" />
      <View style={styles.card}>
        <Text style={styles.title}>Iniciar sesion</Text>
        <Text style={styles.label}>Email</Text>
        <Controller
          control={control}
          name="email"
          rules={{ required: 'Requerido' }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="docente@colegio.edu"
              value={value}
              onChangeText={onChange}
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current?.focus?.()}
              onKeyPress={(event) => {
                if (!isWeb || event?.nativeEvent?.key !== 'Enter') return;
                passwordInputRef.current?.focus?.();
              }}
            />
          )}
        />
        <Text style={styles.label}>Contrasena</Text>
        <Controller
          control={control}
          name="password"
          rules={{ required: 'Requerido' }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.passwordWrap}>
              <TextInput
                ref={passwordInputRef}
                style={styles.passwordInput}
                secureTextEntry={!showPassword}
                placeholder="******"
                value={value}
                onChangeText={onChange}
                returnKeyType="go"
                onSubmitEditing={handleSubmit(onSubmit)}
                onKeyPress={(event) => {
                  if (!isWeb || event?.nativeEvent?.key !== 'Enter') return;
                  handleSubmit(onSubmit)();
                }}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(prev => !prev)}
                style={styles.eyeBtn}
                accessibilityRole="button"
              >
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#374151" />
              </TouchableOpacity>
            </View>
          )}
        />
        <TouchableOpacity
          style={[styles.loginBtn, loading && { opacity: 0.7 }]}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          <View style={styles.btnRow}>
            <Ionicons name="log-in-outline" size={18} color="#fff" />
            <Text style={styles.loginBtnText}>{loading ? 'Ingresando...' : 'Ingresar'}</Text>
          </View>
        </TouchableOpacity>
        <Pressable style={styles.resetLinkWrap} onPress={openResetModal}>
          <Text style={styles.resetLinkText}>Restablecer contrasena</Text>
        </Pressable>
      </View>

      <Modal
        transparent
        animationType="fade"
        visible={resetModalVisible}
        onRequestClose={closeResetModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Restablecer contrasena</Text>
              <Pressable onPress={closeResetModal} disabled={sendingTemporaryPassword}>
                <Ionicons name="close-outline" size={20} color="#d1d5db" />
              </Pressable>
            </View>
            <Text style={styles.modalHelp}>Ingresa tu correo y te enviaremos una clave temporal para entrar y cambiarla desde la aplicacion.</Text>

            <TextInput
              style={styles.modalInput}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Correo"
              placeholderTextColor="#94a3b8"
              value={resetForm.email}
              onChangeText={(txt) => setResetForm((prev) => ({ ...prev, email: txt }))}
              editable={!sendingTemporaryPassword}
            />

            {resetError ? <Text style={styles.resetError}>{resetError}</Text> : null}

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.secondaryBtn, sendingTemporaryPassword && { opacity: 0.6 }]} onPress={closeResetModal} disabled={sendingTemporaryPassword}>
                <Text style={styles.secondaryBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.primaryBtn, sendingTemporaryPassword && { opacity: 0.6 }]} onPress={handleSubmitResetPassword} disabled={sendingTemporaryPassword}>
                <Text style={styles.primaryBtnText}>{sendingTemporaryPassword ? 'Enviando...' : 'Enviar clave temporal'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <AppInfoDialog
        visible={feedbackModal.visible}
        title={feedbackModal.title}
        message={feedbackModal.message}
        tone={feedbackModal.tone}
        onClose={() => setFeedbackModal({ visible: false, title: '', message: '', tone: 'info' })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#0c0c0f', justifyContent: 'center', alignItems: 'center', gap: 16 },
  logo: { width: '100%', maxWidth: 460, height: 200, borderRadius: 12, marginTop: 12, alignSelf: 'center' },
  card: { width: '100%', maxWidth: 460, gap: 10, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 12, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 4, textAlign: 'center', color: '#111' },
  label: { fontWeight: '600', color: '#222' },
  input: { borderWidth: 1, borderColor: '#d9d9d9', borderRadius: 8, padding: 10, backgroundColor: '#fff' },
  passwordWrap: { borderWidth: 1, borderColor: '#d9d9d9', borderRadius: 8, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' },
  passwordInput: { flex: 1, padding: 10 },
  eyeBtn: { paddingHorizontal: 10, paddingVertical: 8 },
  loginBtn: { marginTop: 6, backgroundColor: '#2563eb', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  loginBtnText: { color: '#fff', fontWeight: '700' },
  btnRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  resetLinkWrap: { marginTop: 8, alignItems: 'center' },
  resetLinkText: { color: '#2563eb', fontWeight: '700', textDecorationLine: 'underline' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(2,6,23,0.7)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalCard: { width: '100%', maxWidth: 480, borderRadius: 14, padding: 16, backgroundColor: '#0f172a', borderWidth: 1, borderColor: 'rgba(148,163,184,0.25)', gap: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { color: '#f8fafc', fontSize: 19, fontWeight: '800' },
  modalHelp: { color: '#cbd5e1', fontSize: 12.5, lineHeight: 18 },
  modalInput: { borderWidth: 1, borderColor: 'rgba(148,163,184,0.4)', borderRadius: 10, padding: 10, color: '#f8fafc', backgroundColor: 'rgba(15,23,42,0.5)' },
  resetError: { color: '#fecaca', fontWeight: '700', fontSize: 12.5, marginTop: 2 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 4 },
  secondaryBtn: { borderWidth: 1, borderColor: 'rgba(148,163,184,0.45)', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14 },
  secondaryBtnText: { color: '#e2e8f0', fontWeight: '700' },
  primaryBtn: { backgroundColor: '#16a34a', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, borderWidth: 1, borderColor: '#22c55e' },
  primaryBtnText: { color: '#f0fdf4', fontWeight: '800' }
});
