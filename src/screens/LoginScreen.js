import React from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../store/useAuth';

export default function LoginScreen() {
  const { control, handleSubmit } = useForm({ defaultValues: { email: '', password: '' } });
  const login = useAuth(s => s.login);
  const loading = useAuth(s => s.loading);

  const onSubmit = async ({ email, password }) => {
    try {
      await login(email, password);
    } catch (e) {
      Alert.alert('Error de autenticacion', e?.response?.data?.message || e.message);
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
            />
          )}
        />
        <Text style={styles.label}>Contrasena</Text>
        <Controller
          control={control}
          name="password"
          rules={{ required: 'Requerido' }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder="******"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        <Button title={loading ? 'Ingresando...' : 'Ingresar'} onPress={handleSubmit(onSubmit)} disabled={loading} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#0c0c0f', justifyContent: 'center', alignItems: 'center', gap: 16 },
  logo: { width: '70%', height: 200, borderRadius: 12, marginTop: 12, alignSelf: 'center' },
  card: { width: '100%', gap: 10, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 12, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 4, textAlign: 'center', color: '#111' },
  label: { fontWeight: '600', color: '#222' },
  input: { borderWidth: 1, borderColor: '#d9d9d9', borderRadius: 8, padding: 10, backgroundColor: '#fff' }
});
