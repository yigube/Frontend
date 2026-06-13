import { useEffect, useRef, useState } from 'react';

export default function useHomeFeedbackState() {
  const [periodStatusModal, setPeriodStatusModal] = useState({ visible: false, message: '' });
  const [appAlertModal, setAppAlertModal] = useState({ visible: false, title: '', message: '', tone: 'info' });
  const [deleteSedeConfirmModal, setDeleteSedeConfirmModal] = useState({ visible: false, sede: null, deleting: false });
  const [estudianteDeleteSuccessModal, setEstudianteDeleteSuccessModal] = useState({ visible: false, message: '' });
  const [uploadTemplateSuccessModal, setUploadTemplateSuccessModal] = useState({ visible: false, message: '' });
  const [qrZipErrorModal, setQrZipErrorModal] = useState({ visible: false, message: '' });
  const [qrZipDownloadModal, setQrZipDownloadModal] = useState({ visible: false, message: '' });
  const [resetPasswordFeedbackModal, setResetPasswordFeedbackModal] = useState({ visible: false, title: '', message: '' });

  const periodStatusTimeoutRef = useRef(null);
  const estudianteDeleteSuccessTimeoutRef = useRef(null);
  const uploadTemplateSuccessTimeoutRef = useRef(null);

  const clearPeriodStatusTimeout = () => {
    if (!periodStatusTimeoutRef.current) return;
    clearTimeout(periodStatusTimeoutRef.current);
    periodStatusTimeoutRef.current = null;
  };

  const clearEstudianteDeleteSuccessTimeout = () => {
    if (!estudianteDeleteSuccessTimeoutRef.current) return;
    clearTimeout(estudianteDeleteSuccessTimeoutRef.current);
    estudianteDeleteSuccessTimeoutRef.current = null;
  };

  const clearUploadTemplateSuccessTimeout = () => {
    if (!uploadTemplateSuccessTimeoutRef.current) return;
    clearTimeout(uploadTemplateSuccessTimeoutRef.current);
    uploadTemplateSuccessTimeoutRef.current = null;
  };

  const showPeriodStatusModal = (message) => {
    clearPeriodStatusTimeout();
    setPeriodStatusModal({ visible: true, message });
    periodStatusTimeoutRef.current = setTimeout(() => {
      setPeriodStatusModal({ visible: false, message: '' });
      periodStatusTimeoutRef.current = null;
    }, 2000);
  };

  const showEstudianteDeleteSuccessModal = (message) => {
    clearEstudianteDeleteSuccessTimeout();
    setEstudianteDeleteSuccessModal({ visible: true, message });
    estudianteDeleteSuccessTimeoutRef.current = setTimeout(() => {
      setEstudianteDeleteSuccessModal({ visible: false, message: '' });
      estudianteDeleteSuccessTimeoutRef.current = null;
    }, 2200);
  };

  const showUploadTemplateSuccessModal = (message = 'Estudiantes cargados correctamente') => {
    clearUploadTemplateSuccessTimeout();
    setUploadTemplateSuccessModal({ visible: true, message });
    uploadTemplateSuccessTimeoutRef.current = setTimeout(() => {
      setUploadTemplateSuccessModal({ visible: false, message: '' });
      uploadTemplateSuccessTimeoutRef.current = null;
    }, 2600);
  };

  const showQrZipErrorModal = (message) => {
    setQrZipErrorModal({
      visible: true,
      message: String(message || 'No se pudo generar ni descargar el ZIP de codigos QR.')
    });
  };

  const showQrZipDownloadModal = (message) => {
    setQrZipDownloadModal({
      visible: true,
      message: String(message || '')
    });
  };

  const showAppAlert = (title, message, tone = 'info') => {
    setAppAlertModal({
      visible: true,
      title: String(title || 'Informacion'),
      message: String(message || ''),
      tone
    });
  };

  const showResetPasswordFeedbackModal = (title, message) => {
    setResetPasswordFeedbackModal({
      visible: true,
      title: String(title || 'Informacion'),
      message: String(message || '')
    });
  };

  useEffect(() => () => clearPeriodStatusTimeout(), []);
  useEffect(() => () => clearEstudianteDeleteSuccessTimeout(), []);
  useEffect(() => () => clearUploadTemplateSuccessTimeout(), []);

  return {
    periodStatusModal,
    appAlertModal,
    deleteSedeConfirmModal,
    estudianteDeleteSuccessModal,
    uploadTemplateSuccessModal,
    qrZipErrorModal,
    qrZipDownloadModal,
    resetPasswordFeedbackModal,
    setPeriodStatusModal,
    setAppAlertModal,
    setDeleteSedeConfirmModal,
    setEstudianteDeleteSuccessModal,
    setUploadTemplateSuccessModal,
    setQrZipErrorModal,
    setQrZipDownloadModal,
    setResetPasswordFeedbackModal,
    clearPeriodStatusTimeout,
    clearEstudianteDeleteSuccessTimeout,
    clearUploadTemplateSuccessTimeout,
    showPeriodStatusModal,
    showEstudianteDeleteSuccessModal,
    showUploadTemplateSuccessModal,
    showQrZipErrorModal,
    showQrZipDownloadModal,
    showAppAlert,
    showResetPasswordFeedbackModal
  };
}
