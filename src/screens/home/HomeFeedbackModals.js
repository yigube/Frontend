import React from 'react';
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeFeedbackModals({
  styles,
  periodStatusModal,
  clearPeriodStatusTimeout,
  setPeriodStatusModal,
  estudianteDeleteSuccessModal,
  clearEstudianteDeleteSuccessTimeout,
  setEstudianteDeleteSuccessModal,
  uploadTemplateSuccessModal,
  clearUploadTemplateSuccessTimeout,
  setUploadTemplateSuccessModal,
  qrZipErrorModal,
  setQrZipErrorModal,
  qrZipDownloadModal,
  setQrZipDownloadModal,
  estudiantesExistentesModal,
  setEstudiantesExistentesModal
}) {
  const closePeriodStatus = () => {
    clearPeriodStatusTimeout();
    setPeriodStatusModal({ visible: false, message: '' });
  };

  const closeDeleteSuccess = () => {
    clearEstudianteDeleteSuccessTimeout();
    setEstudianteDeleteSuccessModal({ visible: false, message: '' });
  };

  const closeUploadSuccess = () => {
    clearUploadTemplateSuccessTimeout();
    setUploadTemplateSuccessModal({ visible: false, message: '' });
  };

  const closeQrZipError = () => setQrZipErrorModal({ visible: false, message: '' });
  const closeQrZipDownload = () => setQrZipDownloadModal({ visible: false, message: '' });
  const closeExistingStudents = () => setEstudiantesExistentesModal({ visible: false, students: [], created: 0 });

  return (
    <>
      <Modal transparent animationType="fade" visible={periodStatusModal.visible} onRequestClose={closePeriodStatus}>
        <View style={styles.statusModalBackdrop}>
          <View style={styles.statusModalCard}>
            <Ionicons name="checkmark-circle-outline" size={22} color="#22c55e" />
            <Text style={styles.statusModalText}>{periodStatusModal.message}</Text>
          </View>
        </View>
      </Modal>

      <Modal transparent animationType="fade" visible={estudianteDeleteSuccessModal.visible} onRequestClose={closeDeleteSuccess}>
        <View style={styles.statusModalBackdrop}>
          <View style={styles.estudianteDeleteSuccessCard}>
            <View style={styles.estudianteDeleteSuccessIconWrap}>
              <Ionicons name="checkmark-done-outline" size={24} color="#86efac" />
            </View>
            <View style={styles.estudianteDeleteSuccessContent}>
              <Text style={styles.estudianteDeleteSuccessTitle}>Eliminacion completada</Text>
              <Text style={styles.estudianteDeleteSuccessText}>{estudianteDeleteSuccessModal.message}</Text>
            </View>
            <Pressable style={styles.estudianteDeleteSuccessCloseBtn} onPress={closeDeleteSuccess}>
              <Ionicons name="close-outline" size={16} color="#cbd5e1" />
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal transparent animationType="fade" visible={uploadTemplateSuccessModal.visible} onRequestClose={closeUploadSuccess}>
        <View style={styles.statusModalBackdrop}>
          <View style={styles.uploadTemplateSuccessCard}>
            <View style={styles.uploadTemplateSuccessIconWrap}>
              <Ionicons name="cloud-done-outline" size={24} color="#99f6e4" />
            </View>
            <View style={styles.uploadTemplateSuccessContent}>
              <Text style={styles.uploadTemplateSuccessTitle}>Estudiantes cargados correctamente</Text>
              <Text style={styles.uploadTemplateSuccessText}>{uploadTemplateSuccessModal.message}</Text>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent animationType="fade" visible={qrZipErrorModal.visible} onRequestClose={closeQrZipError}>
        <View style={styles.statusModalBackdrop}>
          <View style={styles.qrZipErrorCard}>
            <View style={styles.qrZipErrorIconWrap}>
              <Ionicons name="alert-circle-outline" size={24} color="#fda4af" />
            </View>
            <View style={styles.qrZipErrorContent}>
              <Text style={styles.qrZipErrorTitle}>Error al descargar ZIP</Text>
              <Text style={styles.qrZipErrorText}>{qrZipErrorModal.message}</Text>
            </View>
            <Pressable style={styles.qrZipErrorCloseBtn} onPress={closeQrZipError}>
              <Ionicons name="close-outline" size={16} color="#fecdd3" />
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal transparent animationType="fade" visible={qrZipDownloadModal.visible} onRequestClose={closeQrZipDownload}>
        <View style={styles.statusModalBackdrop}>
          <View style={styles.qrZipDownloadCard}>
            <View style={styles.qrZipDownloadIconWrap}>
              <Ionicons name="download-outline" size={24} color="#bfdbfe" />
            </View>
            <View style={styles.qrZipDownloadContent}>
              <Text style={styles.qrZipDownloadTitle}>ZIP descargado</Text>
              <Text style={styles.qrZipDownloadText}>{qrZipDownloadModal.message}</Text>
            </View>
            <Pressable style={styles.qrZipDownloadCloseBtn} onPress={closeQrZipDownload}>
              <Ionicons name="close-outline" size={16} color="#dbeafe" />
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal transparent animationType="fade" visible={estudiantesExistentesModal.visible} onRequestClose={closeExistingStudents}>
        <View style={styles.statusModalBackdrop}>
          <View style={styles.existingStudentsModalCard}>
            <View style={styles.existingStudentsHeader}>
              <View style={styles.existingStudentsIconWrap}>
                <Ionicons name="alert-circle-outline" size={22} color="#f59e0b" />
              </View>
              <View style={styles.existingStudentsHeaderText}>
                <Text style={styles.existingStudentsTitle}>Estudiantes omitidos</Text>
                <Text style={styles.existingStudentsSubtitle}>
                  {estudiantesExistentesModal.created > 0
                    ? `Se cargaron ${estudiantesExistentesModal.created} nuevos.`
                    : 'No se cargaron estudiantes nuevos.'}
                </Text>
              </View>
            </View>

            <View style={styles.existingStudentsList}>
              <ScrollView
                style={{ maxHeight: 260 }}
                contentContainerStyle={{ gap: 8, paddingVertical: 2 }}
                showsVerticalScrollIndicator={false}
              >
                {(Array.isArray(estudiantesExistentesModal.students) ? estudiantesExistentesModal.students : []).map((student, index) => (
                  <View key={`existing-student-${index}`} style={styles.existingStudentsItem}>
                    <Text style={styles.existingStudentsName}>{`${student?.nombres || ''} ${student?.apellidos || ''}`.trim() || 'Sin nombre'}</Text>
                    <Text style={styles.existingStudentsReason}>{student?.motivo || 'Duplicado'}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            <TouchableOpacity style={styles.existingStudentsCloseBtn} onPress={closeExistingStudents}>
              <Text style={styles.existingStudentsCloseBtnText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
