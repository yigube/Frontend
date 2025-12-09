import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Pressable,
  Alert,
  RefreshControl,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import ScreenBackground from '../components/ScreenBackground';
import { getCursos, createCurso, updateCurso, deleteCurso } from '../services/cursos';

export default function CursosScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [formName, setFormName] = useState('');
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);

  const loadCursos = async (term = '') => {
    setError(null);
    const isRefreshing = loading === false;
    if (isRefreshing) setRefreshing(true);
    if (!isRefreshing) setLoading(true);
    try {
      const res = await getCursos(term ? { q: term } : {});
      setData(res);
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || 'Error al cargar cursos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadCursos(); }, []);

  const openCreate = () => {
    setEditing(null);
    setFormName('');
    setModalVisible(true);
  };

  const openEdit = (curso) => {
    setEditing(curso);
    setFormName(curso.nombre);
    setModalVisible(true);
  };

  const handleSave = async () => {
    const nombre = formName.trim();
    if (!nombre) return Alert.alert('Nombre requerido', 'Escribe un nombre para el curso');
    setSaving(true);
    try {
      if (editing) {
        await updateCurso(editing.id, { nombre });
      } else {
        await createCurso({ nombre });
      }
      setModalVisible(false);
      await loadCursos(search);
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.error || e?.message || 'No se pudo guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (curso) => {
    Alert.alert('Eliminar curso', `Vas a eliminar "${curso.nombre}"`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCurso(curso.id);
            await loadCursos(search);
          } catch (e) {
            Alert.alert('Error', e?.response?.data?.error || e?.message || 'No se pudo eliminar');
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{item.nombre}</Text>
        {item.grado ? <Text style={styles.cardMeta}>Grado: {item.grado}</Text> : null}
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => openEdit(item)}>
          <Text style={styles.iconText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconBtn, styles.danger]} onPress={() => handleDelete(item)}>
          <Text style={styles.iconText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const listHeader = (
    <View style={styles.topBar}>
      <Text style={styles.title}>Cursos asignados</Text>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar curso"
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={() => loadCursos(search)}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={() => loadCursos(search)}>
          <Text style={styles.searchBtnText}>Buscar</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.primaryBtn} onPress={openCreate}>
        <Text style={styles.primaryBtnText}>Crear curso</Text>
      </TouchableOpacity>
    </View>
  );

  const empty = !loading && data.length === 0;

  return (
    <ScreenBackground contentStyle={styles.screen}>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 32 }} color="#fff" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, idx) => String(item.id || idx)}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={empty ? <Text style={styles.empty}>No hay cursos asignados</Text> : null}
          refreshControl={(
            <RefreshControl refreshing={refreshing} onRefresh={() => loadCursos(search)} colors={["#4f46e5"]} tintColor="#fff" />
          )}
        />
      )}

      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => !saving && setModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editing ? 'Editar curso' : 'Crear curso'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del curso"
              value={formName}
              onChangeText={setFormName}
              editable={!saving}
            />
            <View style={styles.modalActions}>
              <Pressable disabled={saving} onPress={() => setModalVisible(false)} style={[styles.outlineBtn, saving && { opacity: 0.6 }]}>
                <Text style={styles.outlineBtnText}>Cancelar</Text>
              </Pressable>
              <Pressable disabled={saving} onPress={handleSave} style={[styles.primaryBtn, saving && { opacity: 0.6 }]}>
                <Text style={styles.primaryBtnText}>{saving ? 'Guardando...' : 'Guardar'}</Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, gap: 12 },
  title: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 8 },
  topBar: { gap: 10, marginBottom: 12 },
  searchRow: { flexDirection: 'row', gap: 8 },
  searchInput: { flex: 1, backgroundColor: 'rgba(255,255,255,0.12)', color: '#fff', borderRadius: 10, paddingHorizontal: 12, height: 44 },
  searchBtn: { backgroundColor: '#2563eb', paddingHorizontal: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  searchBtnText: { color: '#fff', fontWeight: '700' },
  primaryBtn: { backgroundColor: '#16a34a', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
  card: { backgroundColor: 'rgba(255,255,255,0.94)', borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardTitle: { fontWeight: '700', fontSize: 16, color: '#111' },
  cardMeta: { color: '#333', marginTop: 4 },
  cardActions: { flexDirection: 'row', gap: 8 },
  iconBtn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#e5e7eb', borderRadius: 10 },
  iconText: { color: '#111', fontWeight: '600' },
  danger: { backgroundColor: '#fee2e2' },
  error: { color: 'salmon', padding: 16, textAlign: 'center' },
  empty: { color: '#ccc', paddingVertical: 16, textAlign: 'center' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#fff', borderRadius: 14, padding: 16, gap: 12 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff', color: '#111' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  outlineBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#d1d5db' },
  outlineBtnText: { color: '#111', fontWeight: '600' }
});
