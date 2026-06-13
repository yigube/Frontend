import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DeleteConfirmModals({
  styles,
  deletePeriodModal,
  setDeletePeriodModal,
  handleDeletePeriod,
  deleteColegioModal,
  setDeleteColegioModal,
  handleDeleteColegio,
  deleteRectorModal,
  setDeleteRectorModal,
  handleDeleteRector,
  deleteCursoModal,
  setDeleteCursoModal,
  handleDeleteCurso,
  deleteEstudianteConfirmModal,
  setDeleteEstudianteConfirmModal,
  handleConfirmDeleteEstudiante,
  deleteDocenteModal,
  setDeleteDocenteModal,
  handleDeleteDocente,
  daneExistsModal,
  setDaneExistsModal
}) {
  return (
    <>
      <Modal transparent animationType="fade" visible={deletePeriodModal.visible} onRequestClose={() => setDeletePeriodModal({ visible: false, id: null })}>
        <View style={styles.statusModalBackdrop}>
          <View style={styles.deleteModalCard}>
            <View style={styles.deleteModalIconWrap}>
              <Ionicons name="warning-outline" size={24} color="#ef4444" />
            </View>
            <Text style={styles.deleteModalTitle}>Eliminar periodo</Text>
            <Text style={styles.deleteModalText}>Esta accion no se puede deshacer. Se reorganizaran los periodos restantes.</Text>
            <View style={styles.deleteModalActions}>
              <TouchableOpacity style={styles.deleteModalCancelBtn} onPress={() => setDeletePeriodModal({ visible: false, id: null })}>
                <Text style={styles.deleteModalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteModalConfirmBtn} onPress={() => handleDeletePeriod(deletePeriodModal.id)}>
                <Text style={styles.deleteModalConfirmText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent animationType="fade" visible={deleteColegioModal.visible} onRequestClose={() => setDeleteColegioModal({ visible: false, colegio: null })}>
        <View style={styles.statusModalBackdrop}>
          <View style={styles.deleteModalCard}>
            <View style={styles.deleteModalIconWrap}>
              <Ionicons name="warning-outline" size={24} color="#ef4444" />
            </View>
            <Text style={styles.deleteModalTitle}>Eliminar colegio</Text>
            <Text style={styles.deleteModalText}>
              Vas a eliminar "{deleteColegioModal?.colegio?.nombre || 'este colegio'}". Esta accion no se puede deshacer.
            </Text>
            <View style={styles.deleteModalActions}>
              <TouchableOpacity style={styles.deleteModalCancelBtn} onPress={() => setDeleteColegioModal({ visible: false, colegio: null })}>
                <Text style={styles.deleteModalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteModalConfirmBtn} onPress={() => handleDeleteColegio(deleteColegioModal.colegio)}>
                <Text style={styles.deleteModalConfirmText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent animationType="fade" visible={deleteRectorModal.visible} onRequestClose={() => setDeleteRectorModal({ visible: false, rector: null })}>
        <View style={styles.statusModalBackdrop}>
          <View style={[styles.deleteModalCard, styles.deleteRectorModalCard]}>
            <View style={styles.deleteRectorIconWrap}>
              <Ionicons name="person-remove-outline" size={24} color="#fecaca" />
            </View>
            <Text style={styles.deleteModalTitle}>Eliminar directivo</Text>
            <Text style={styles.deleteModalText}>
              Vas a eliminar a "{deleteRectorModal?.rector?.nombreCompleto || 'este directivo'}" de {deleteRectorModal?.rector?.colegioNombre || 'la institucion'}. El colegio seguira registrado.
            </Text>
            <View style={styles.deleteModalActions}>
              <TouchableOpacity style={styles.deleteModalCancelBtn} onPress={() => setDeleteRectorModal({ visible: false, rector: null })}>
                <Text style={styles.deleteModalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteModalConfirmBtn} onPress={() => handleDeleteRector(deleteRectorModal.rector)}>
                <Text style={styles.deleteModalConfirmText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent animationType="fade" visible={deleteCursoModal.visible} onRequestClose={() => setDeleteCursoModal({ visible: false, curso: null })}>
        <View style={styles.statusModalBackdrop}>
          <View style={styles.deleteModalCard}>
            <View style={styles.deleteModalIconWrap}>
              <Ionicons name="warning-outline" size={24} color="#ef4444" />
            </View>
            <Text style={styles.deleteModalTitle}>Eliminar curso</Text>
            <Text style={styles.deleteModalText}>
              Vas a eliminar "{deleteCursoModal?.curso?.nombre || 'este curso'}". Esta accion no se puede deshacer.
            </Text>
            <View style={styles.deleteModalActions}>
              <TouchableOpacity style={styles.deleteModalCancelBtn} onPress={() => setDeleteCursoModal({ visible: false, curso: null })}>
                <Text style={styles.deleteModalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteModalConfirmBtn} onPress={() => handleDeleteCurso(deleteCursoModal.curso)}>
                <Text style={styles.deleteModalConfirmText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="fade"
        visible={deleteEstudianteConfirmModal.visible}
        onRequestClose={() => {
          if (deleteEstudianteConfirmModal.deleting) return;
          setDeleteEstudianteConfirmModal({ visible: false, estudiante: null, deleting: false });
        }}
      >
        <View style={styles.statusModalBackdrop}>
          <View style={styles.deleteModalCard}>
            <View style={styles.deleteModalIconWrap}>
              <Ionicons name="warning-outline" size={24} color="#ef4444" />
            </View>
            <Text style={styles.deleteModalTitle}>Eliminar estudiante</Text>
            <Text style={styles.deleteModalText}>
              Vas a eliminar "
              {`${deleteEstudianteConfirmModal?.estudiante?.nombres || ''} ${deleteEstudianteConfirmModal?.estudiante?.apellidos || ''}`.trim() || 'este estudiante'}
              ". Esta accion no se puede deshacer.
            </Text>
            <View style={styles.deleteModalActions}>
              <TouchableOpacity
                style={[styles.deleteModalCancelBtn, deleteEstudianteConfirmModal.deleting && { opacity: 0.6 }]}
                disabled={deleteEstudianteConfirmModal.deleting}
                onPress={() => setDeleteEstudianteConfirmModal({ visible: false, estudiante: null, deleting: false })}
              >
                <Text style={styles.deleteModalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deleteModalConfirmBtn, deleteEstudianteConfirmModal.deleting && { opacity: 0.6 }]}
                disabled={deleteEstudianteConfirmModal.deleting}
                onPress={handleConfirmDeleteEstudiante}
              >
                <Text style={styles.deleteModalConfirmText}>
                  {deleteEstudianteConfirmModal.deleting ? 'Eliminando...' : 'Eliminar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent animationType="fade" visible={deleteDocenteModal.visible} onRequestClose={() => setDeleteDocenteModal({ visible: false, docente: null })}>
        <View style={styles.statusModalBackdrop}>
          <View style={styles.deleteModalCard}>
            <View style={styles.deleteModalIconWrap}>
              <Ionicons name="warning-outline" size={24} color="#ef4444" />
            </View>
            <Text style={styles.deleteModalTitle}>Eliminar docente</Text>
            <Text style={styles.deleteModalText}>
              Vas a eliminar "{deleteDocenteModal?.docente?.nombre || deleteDocenteModal?.docente?.email || 'este docente'}". Esta accion no se puede deshacer.
            </Text>
            <View style={styles.deleteModalActions}>
              <TouchableOpacity style={styles.deleteModalCancelBtn} onPress={() => setDeleteDocenteModal({ visible: false, docente: null })}>
                <Text style={styles.deleteModalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteModalConfirmBtn} onPress={() => handleDeleteDocente(deleteDocenteModal.docente)}>
                <Text style={styles.deleteModalConfirmText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent animationType="fade" visible={daneExistsModal.visible} onRequestClose={() => setDaneExistsModal({ visible: false, message: '' })}>
        <View style={styles.statusModalBackdrop}>
          <View style={styles.deleteModalCard}>
            <View style={styles.deleteModalIconWrap}>
              <Ionicons name="alert-circle-outline" size={24} color="#ef4444" />
            </View>
            <Text style={styles.deleteModalTitle}>Codigo DANE duplicado</Text>
            <Text style={styles.deleteModalText}>{daneExistsModal.message}</Text>
            <View style={styles.deleteModalActions}>
              <TouchableOpacity style={styles.deleteModalConfirmBtn} onPress={() => setDaneExistsModal({ visible: false, message: '' })}>
                <Text style={styles.deleteModalConfirmText}>Entendido</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
