import React from 'react';
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DocentePanelModal({
  visible,
  onClose,
  styles,
  docentePerfilLoading,
  docentePerfilError,
  docentePerfilCursos,
  docenteMateriasAsignadasTotal,
  setDocentePanelModalVisible,
  openCreateEstudianteModal
}) {
  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={[styles.modalCard, styles.docentesModalCard]}>
          <View style={styles.modalHeader}>
            <Text style={styles.periodTitle}>Panel docente</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <View style={styles.btnRow}>
                <Ionicons name="close-outline" size={16} color="#fecaca" />
                <Text style={styles.closeBtnText}>Cerrar</Text>
              </View>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.docentePerfilBox}>
              <View style={styles.docentePerfilHeader}>
                <View style={styles.docentePerfilTitleWrap}>
                  <Text style={styles.docentePerfilEyebrow}>Panel docente</Text>
                  <Text style={styles.docentePerfilTitle}>Mis cursos y materias</Text>
                </View>
                <View style={styles.docentePerfilBadge}>
                  <Text style={styles.docentePerfilBadgeText}>
                    {docentePerfilLoading ? 'Cargando...' : `${docentePerfilCursos.length} cursos`}
                  </Text>
                </View>
              </View>

              {!docentePerfilLoading && !docentePerfilError ? (
                <Text style={styles.docentePerfilSummary}>
                  {docentePerfilCursos.length > 0
                    ? `Tienes ${docentePerfilCursos.length} cursos y ${docenteMateriasAsignadasTotal} materias asignadas.`
                    : 'Aun no tienes cursos o materias asignadas.'}
                </Text>
              ) : null}

              {docentePerfilError ? <Text style={[styles.errorText, styles.docentePerfilError]}>{docentePerfilError}</Text> : null}

              {!docentePerfilLoading && !docentePerfilError && docentePerfilCursos.length === 0 ? (
                <View style={styles.docenteMateriaEmptyCard}>
                  <Ionicons name="school-outline" size={18} color="#93c5fd" />
                  <Text style={styles.docenteMateriaEmptyText}>No tienes materias asignadas</Text>
                </View>
              ) : (
                <View style={styles.docenteMateriaList}>
                  {docentePerfilCursos.map((curso) => {
                    const materias = Array.isArray(curso?.materias) ? curso.materias : [];
                    return (
                      <View key={`mis-materias-${curso.id}`} style={styles.docenteMateriaCard}>
                        <View style={styles.docenteMateriaHeader}>
                          <View style={styles.docenteMateriaTitleBlock}>
                            <Text style={styles.docenteMateriaCourseLine}>
                              <Text style={styles.docenteMateriaLabelInline}>Curso </Text>
                              <Text style={styles.docenteMateriaCourse}>{curso.nombre || curso.id}</Text>
                            </Text>
                          </View>
                          <View style={styles.docenteMateriaAside}>
                            <View style={styles.docenteMateriaMetaRow}>
                              <View style={styles.docenteMateriaNamesWrap}>
                                {materias.length > 0 ? (
                                  materias.map((materia, index) => (
                                    <View key={`mis-materias-${curso.id}-${index}`} style={styles.docenteMateriaChip}>
                                      <Text style={styles.docenteMateriaChipText}>{materia}</Text>
                                    </View>
                                  ))
                                ) : (
                                  <Text style={[styles.docenteMateriaEmptyHint, styles.docenteMateriaEmptyHintInline]}>Sin materias asignadas</Text>
                                )}
                              </View>
                            </View>
                          </View>
                        </View>
                        <View style={styles.docenteMateriaActionCenterRow}>
                          <TouchableOpacity
                            style={styles.docenteMateriaActionBtn}
                            onPress={() => {
                              setDocentePanelModalVisible(false);
                              openCreateEstudianteModal(curso.id);
                            }}
                            activeOpacity={0.85}
                          >
                            <View style={styles.btnRow}>
                              <Ionicons name="person-add-outline" size={13} color="#e0f2fe" />
                              <Text style={styles.docenteMateriaActionText}>Agregar estudiantes</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
