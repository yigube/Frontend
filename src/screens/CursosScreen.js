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
  RefreshControl,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import ScreenBackground from '../components/ScreenBackground';
import { getCursos, createCurso, updateCurso, deleteCurso } from '../services/cursos';
import { useAuth } from '../store/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { AppConfirmDialog, AppInfoDialog } from '../components/AppDialog';

export default function CursosScreen() {
  const user = useAuth(s => s.user);
  const canManageCourses = ['admin', 'rector', 'coordinador'].includes(user?.rol);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [formName, setFormName] = useState('');
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [feedbackModal, setFeedbackModal] = useState({ visible: false, title: '', message: '', tone: 'info' });
  const [deleteModal, setDeleteModal] = useState({ visible: false, curso: null, loading: false });

  const showFeedback = (title, message, tone = 'info') => {
    setFeedbackModal({ visible: true, title, message, tone });
  };

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
    if (!nombre) {
      showFeedback('Nombre requerido', 'Escribe un nombre para el curso', 'warning');
      return;
    }
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
      showFeedback('Error', e?.response?.data?.error || e?.message || 'No se pudo guardar', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (curso) => {
    setDeleteModal({ visible: true, curso, loading: false });
  };

  const confirmDeleteCurso = async () => {
    const curso = deleteModal?.curso;
    if (!curso?.id) return;
    setDeleteModal((prev) => ({ ...prev, loading: true }));
    try {
      await deleteCurso(curso.id);
      setDeleteModal({ visible: false, curso: null, loading: false });
      await loadCursos(search);
    } catch (e) {
      setDeleteModal((prev) => ({ ...prev, loading: false }));
      showFeedback('Error', e?.response?.data?.error || e?.message || 'No se pudo eliminar', 'error');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{item.nombre}</Text>
        {item.grado ? <Text style={styles.cardMeta}>Grado: {item.grado}</Text> : null}
      </View>
      {canManageCourses ? (
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => openEdit(item)}>
            <View style={styles.btnRow}>
              <Ionicons name="create-outline" size={16} color="#111" />
              <Text style={styles.iconText}>Editar</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, styles.danger]} onPress={() => handleDelete(item)}>
            <View style={styles.btnRow}>
              <Ionicons name="trash-outline" size={16} color="#991b1b" />
              <Text style={styles.iconText}>Eliminar</Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : null}
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
          <View style={styles.btnRow}>
            <Ionicons name="search-outline" size={16} color="#fff" />
            <Text style={styles.searchBtnText}>Buscar</Text>
          </View>
        </TouchableOpacity>
      </View>
      {canManageCourses ? (
        <TouchableOpacity style={styles.primaryBtn} onPress={openCreate}>
          <View style={styles.btnRow}>
            <Ionicons name="add-outline" size={18} color="#fff" />
            <Text style={styles.primaryBtnText}>Crear curso</Text>
          </View>
        </TouchableOpacity>
      ) : null}
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
                <View style={styles.btnRow}>
                  <Ionicons name="close-outline" size={16} color="#111" />
                  <Text style={styles.outlineBtnText}>Cancelar</Text>
                </View>
              </Pressable>
              <Pressable disabled={saving} onPress={handleSave} style={[styles.primaryBtn, saving && { opacity: 0.6 }]}>
                <View style={styles.btnRow}>
                  <Ionicons name="save-outline" size={16} color="#fff" />
                  <Text style={styles.primaryBtnText}>{saving ? 'Guardando...' : 'Guardar'}</Text>
                </View>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      <AppInfoDialog
        visible={feedbackModal.visible}
        title={feedbackModal.title}
        message={feedbackModal.message}
        tone={feedbackModal.tone}
        onClose={() => setFeedbackModal({ visible: false, title: '', message: '', tone: 'info' })}
      />

      <AppConfirmDialog
        visible={deleteModal.visible}
        title="Eliminar curso"
        message={`Vas a eliminar "${deleteModal?.curso?.nombre || 'este curso'}".`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        danger
        loading={deleteModal.loading}
        onCancel={() => setDeleteModal({ visible: false, curso: null, loading: false })}
        onConfirm={confirmDeleteCurso}
      />
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
  modalCard: {
    backgroundColor: 'rgba(15,23,42,0.96)',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.28)'
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#f8fafc' },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.4)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(15,23,42,0.5)',
    color: '#f8fafc'
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  outlineBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(148,163,184,0.45)' },
  outlineBtnText: { color: '#e2e8f0', fontWeight: '700' },
  btnRow: { flexDirection: 'row', alignItems: 'center', gap: 6 }
});
