import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Pressable
} from 'react-native';
import { getEstudiantes, createEstudiante, updateEstudiante, deleteEstudiante } from '../services/estudiantes';
import { getCursos } from '../services/cursos';
import ScreenBackground from '../components/ScreenBackground';
import { Ionicons } from '@expo/vector-icons';

export default function EstudiantesScreen() {
  const [data, setData] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nombres: '', apellidos: '', qr: '', codigoEstudiante: '', cursoId: null });

  const load = async () => {
    try {
      setError(null);
      const [estudiantes, cursosData] = await Promise.all([getEstudiantes(), getCursos()]);
      setData(estudiantes || []);
      setCursos(cursosData || []);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Error al cargar estudiantes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({
      nombres: '',
      apellidos: '',
      qr: '',
      codigoEstudiante: '',
      cursoId: cursos?.[0]?.id || null
    });
    setModalVisible(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      nombres: item?.nombres || '',
      apellidos: item?.apellidos || '',
      qr: item?.qr || '',
      codigoEstudiante: item?.codigoEstudiante || '',
      cursoId: item?.cursoId || cursos?.[0]?.id || null
    });
    setModalVisible(true);
  };

  const save = async () => {
    const payload = {
      nombres: String(form.nombres || '').trim(),
      apellidos: String(form.apellidos || '').trim(),
      qr: String(form.qr || '').trim(),
      codigoEstudiante: String(form.codigoEstudiante || '').trim(),
      cursoId: Number(form.cursoId)
    };
    if (!payload.nombres || !payload.apellidos || !payload.cursoId) {
      Alert.alert('Campos requeridos', 'Completa nombres, apellidos y curso.');
      return;
    }
    setSaving(true);
    try {
      if (editing) await updateEstudiante(editing.id, payload);
      else await createEstudiante(payload);
      setModalVisible(false);
      await load();
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.error || e?.message || 'No se pudo guardar');
    } finally {
      setSaving(false);
    }
  };

  const remove = (item) => {
    Alert.alert('Eliminar', `Eliminar a ${item?.nombres || ''} ${item?.apellidos || ''}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteEstudiante(item.id);
            await load();
          } catch (e) {
            Alert.alert('Error', e?.response?.data?.error || e?.message || 'No se pudo eliminar');
          }
        }
      }
    ]);
  };

  if (loading) return <ScreenBackground contentStyle={styles.loader}><ActivityIndicator /></ScreenBackground>;
  if (error) return <ScreenBackground contentStyle={styles.loader}><Text style={styles.error}>{error}</Text></ScreenBackground>;

  return (
    <ScreenBackground contentStyle={styles.listContainer}>
      <TouchableOpacity style={styles.primaryBtn} onPress={openCreate}>
        <View style={styles.btnRow}>
          <Ionicons name="add-outline" size={18} color="#fff" />
          <Text style={styles.primaryBtnText}>Agregar estudiante</Text>
        </View>
      </TouchableOpacity>

      <FlatList
      data={data}
      keyExtractor={(item,idx)=>String(item.id||idx)}
      renderItem={({item})=>(
        <View style={styles.card}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{item.nombre||`${item.nombres} ${item.apellidos}`}</Text>
            {item.codigoEstudiante ? <Text style={styles.meta}>Codigo: {item.codigoEstudiante}</Text> : null}
            {item.qr ? <Text style={styles.meta}>QR: {item.qr}</Text> : null}
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => openEdit(item)}>
              <Ionicons name="create-outline" size={16} color="#111" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconBtn, styles.danger]} onPress={() => remove(item)}>
              <Ionicons name="trash-outline" size={16} color="#991b1b" />
            </TouchableOpacity>
          </View>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.empty}>No hay estudiantes</Text>}
      ItemSeparatorComponent={()=><View style={{height:10}}/>}
      />

      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => !saving && setModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editing ? 'Editar estudiante' : 'Crear estudiante'}</Text>
            <TextInput style={styles.input} placeholder="Nombres" value={form.nombres} onChangeText={(v) => setForm((p) => ({ ...p, nombres: v }))} />
            <TextInput style={styles.input} placeholder="Apellidos" value={form.apellidos} onChangeText={(v) => setForm((p) => ({ ...p, apellidos: v }))} />
            <TextInput style={styles.input} placeholder="Codigo QR" value={form.qr} onChangeText={(v) => setForm((p) => ({ ...p, qr: v }))} />
            <TextInput style={styles.input} placeholder="Codigo estudiante" value={form.codigoEstudiante} onChangeText={(v) => setForm((p) => ({ ...p, codigoEstudiante: v }))} />

            <Text style={styles.label}>Curso</Text>
            <View style={styles.courseWrap}>
              {cursos.map((c) => (
                <Pressable
                  key={c.id}
                  style={[styles.coursePill, Number(form.cursoId) === Number(c.id) && styles.coursePillActive]}
                  onPress={() => setForm((p) => ({ ...p, cursoId: c.id }))}
                >
                  <Text style={styles.coursePillText}>{c.nombre}</Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.modalActions}>
              <Pressable disabled={saving} onPress={() => setModalVisible(false)} style={[styles.outlineBtn, saving && { opacity: 0.6 }]}>
                <Text style={styles.outlineBtnText}>Cancelar</Text>
              </Pressable>
              <Pressable disabled={saving} onPress={save} style={[styles.primaryBtn, saving && { opacity: 0.6 }]}>
                <Text style={styles.primaryBtnText}>{saving ? 'Guardando...' : 'Guardar'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenBackground>
  );
}

const styles=StyleSheet.create({
  listContainer:{ flex:1, padding: 16, gap: 10 },
  loader:{ flex:1, alignItems:'center', justifyContent:'center' },
  error:{ color:'red', textAlign:'center' },
  primaryBtn: { backgroundColor: '#16a34a', borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginBottom: 10 },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
  btnRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  card:{ backgroundColor:'rgba(255,255,255,0.92)', padding:16, borderRadius:12 },
  title:{ fontWeight:'700', fontSize:16, color:'#111' },
  meta:{ color:'#333', marginTop:4 }
  ,actions: { flexDirection: 'row', gap: 8 },
  iconBtn: { width: 34, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e5e7eb' },
  danger: { backgroundColor: '#fee2e2' },
  empty: { color: '#ddd', textAlign: 'center', padding: 12 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, gap: 10 },
  modalTitle: { color: '#111', fontWeight: '800', fontSize: 16, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 9, color: '#111' },
  label: { color: '#374151', fontWeight: '700' },
  courseWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  coursePill: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 999, backgroundColor: '#e5e7eb' },
  coursePillActive: { backgroundColor: '#16a34a' },
  coursePillText: { color: '#111', fontWeight: '700' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  outlineBtn: { borderWidth: 1, borderColor: '#d1d5db', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
  outlineBtnText: { color: '#111', fontWeight: '700' }
});
