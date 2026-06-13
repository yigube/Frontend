import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppConfirmDialog, AppInfoDialog } from '../../components/AppDialog';
import ChangePasswordModal from './ChangePasswordModal';
import DeleteConfirmModals from './DeleteConfirmModals';
import HomeFeedbackModals from './HomeFeedbackModals';

export default function HomeModalsContainer({
  styles,
  resetPasswordFeedbackModal,
  setResetPasswordFeedbackModal,
  changePasswordModalVisible,
  isForcedPasswordChange,
  closeManualChangePasswordModal,
  changePasswordForm,
  setChangePasswordForm,
  changePasswordError,
  showChangeCurrentPassword,
  setShowChangeCurrentPassword,
  showChangeNextPassword,
  setShowChangeNextPassword,
  showChangeConfirmPassword,
  setShowChangeConfirmPassword,
  changingPassword,
  logout,
  handleSubmitForcedPasswordChange,
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
  setEstudiantesExistentesModal,
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
  setDaneExistsModal,
  appAlertModal,
  setAppAlertModal,
  deleteSedeConfirmModal,
  setDeleteSedeConfirmModal,
  handleConfirmDeleteSede
}) {
  const resetPasswordTone = String(resetPasswordFeedbackModal.title || '').toLowerCase() === 'error';

  return (
    <>
      <Modal
        transparent
        animationType="fade"
        visible={resetPasswordFeedbackModal.visible}
        onRequestClose={() => setResetPasswordFeedbackModal({ visible: false, title: '', message: '' })}
      >
        <View style={styles.modalBackdrop}>
          <View style={[
            styles.resetPasswordModalCard,
            resetPasswordTone && styles.resetPasswordModalCardError
          ]}>
            <View style={[
              styles.resetPasswordIconWrap,
              resetPasswordTone && styles.resetPasswordIconWrapError
            ]}>
              <Ionicons
                name={resetPasswordTone ? 'alert-circle-outline' : 'key-outline'}
                size={22}
                color={resetPasswordTone ? '#fecaca' : '#bbf7d0'}
              />
            </View>
            <Text style={styles.resetPasswordModalTitle}>{resetPasswordFeedbackModal.title || 'Informacion'}</Text>
            <Text style={styles.resetPasswordModalText}>{resetPasswordFeedbackModal.message}</Text>
            <TouchableOpacity
              style={styles.resetPasswordModalBtn}
              onPress={() => setResetPasswordFeedbackModal({ visible: false, title: '', message: '' })}
            >
              <Text style={styles.resetPasswordModalBtnText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ChangePasswordModal
        visible={changePasswordModalVisible}
        styles={styles}
        isForcedPasswordChange={isForcedPasswordChange}
        closeManualChangePasswordModal={closeManualChangePasswordModal}
        changePasswordForm={changePasswordForm}
        setChangePasswordForm={setChangePasswordForm}
        changePasswordError={changePasswordError}
        showChangeCurrentPassword={showChangeCurrentPassword}
        setShowChangeCurrentPassword={setShowChangeCurrentPassword}
        showChangeNextPassword={showChangeNextPassword}
        setShowChangeNextPassword={setShowChangeNextPassword}
        showChangeConfirmPassword={showChangeConfirmPassword}
        setShowChangeConfirmPassword={setShowChangeConfirmPassword}
        changingPassword={changingPassword}
        logout={logout}
        handleSubmitForcedPasswordChange={handleSubmitForcedPasswordChange}
      />

      <HomeFeedbackModals
        styles={styles}
        periodStatusModal={periodStatusModal}
        clearPeriodStatusTimeout={clearPeriodStatusTimeout}
        setPeriodStatusModal={setPeriodStatusModal}
        estudianteDeleteSuccessModal={estudianteDeleteSuccessModal}
        clearEstudianteDeleteSuccessTimeout={clearEstudianteDeleteSuccessTimeout}
        setEstudianteDeleteSuccessModal={setEstudianteDeleteSuccessModal}
        uploadTemplateSuccessModal={uploadTemplateSuccessModal}
        clearUploadTemplateSuccessTimeout={clearUploadTemplateSuccessTimeout}
        setUploadTemplateSuccessModal={setUploadTemplateSuccessModal}
        qrZipErrorModal={qrZipErrorModal}
        setQrZipErrorModal={setQrZipErrorModal}
        qrZipDownloadModal={qrZipDownloadModal}
        setQrZipDownloadModal={setQrZipDownloadModal}
        estudiantesExistentesModal={estudiantesExistentesModal}
        setEstudiantesExistentesModal={setEstudiantesExistentesModal}
      />

      <DeleteConfirmModals
        styles={styles}
        deletePeriodModal={deletePeriodModal}
        setDeletePeriodModal={setDeletePeriodModal}
        handleDeletePeriod={handleDeletePeriod}
        deleteColegioModal={deleteColegioModal}
        setDeleteColegioModal={setDeleteColegioModal}
        handleDeleteColegio={handleDeleteColegio}
        deleteRectorModal={deleteRectorModal}
        setDeleteRectorModal={setDeleteRectorModal}
        handleDeleteRector={handleDeleteRector}
        deleteCursoModal={deleteCursoModal}
        setDeleteCursoModal={setDeleteCursoModal}
        handleDeleteCurso={handleDeleteCurso}
        deleteEstudianteConfirmModal={deleteEstudianteConfirmModal}
        setDeleteEstudianteConfirmModal={setDeleteEstudianteConfirmModal}
        handleConfirmDeleteEstudiante={handleConfirmDeleteEstudiante}
        deleteDocenteModal={deleteDocenteModal}
        setDeleteDocenteModal={setDeleteDocenteModal}
        handleDeleteDocente={handleDeleteDocente}
        daneExistsModal={daneExistsModal}
        setDaneExistsModal={setDaneExistsModal}
      />

      <AppInfoDialog
        visible={appAlertModal.visible}
        title={appAlertModal.title}
        message={appAlertModal.message}
        tone={appAlertModal.tone}
        onClose={() => setAppAlertModal({ visible: false, title: '', message: '', tone: 'info' })}
      />

      <AppConfirmDialog
        visible={deleteSedeConfirmModal.visible}
        title="Eliminar sede"
        message={`Se eliminara la sede "${deleteSedeConfirmModal?.sede?.nombre || 'seleccionada'}".`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        danger
        loading={deleteSedeConfirmModal.deleting}
        onCancel={() => {
          if (deleteSedeConfirmModal.deleting) return;
          setDeleteSedeConfirmModal({ visible: false, sede: null, deleting: false });
        }}
        onConfirm={handleConfirmDeleteSede}
      />
    </>
  );
}
