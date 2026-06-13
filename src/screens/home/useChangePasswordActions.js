import { useEffect, useState } from 'react';
import { changeMyPassword } from '../../services/auth';

const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export default function useChangePasswordActions({
  user,
  updateUser,
  onSuccess
}) {
  const [changingPassword, setChangingPassword] = useState(false);
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [manualChangePasswordModalVisible, setManualChangePasswordModalVisible] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState('');
  const [changePasswordForm, setChangePasswordForm] = useState({ current: '', next: '', confirm: '' });
  const [showChangeCurrentPassword, setShowChangeCurrentPassword] = useState(false);
  const [showChangeNextPassword, setShowChangeNextPassword] = useState(false);
  const [showChangeConfirmPassword, setShowChangeConfirmPassword] = useState(false);

  const clearChangePasswordForm = () => {
    setChangePasswordForm({ current: '', next: '', confirm: '' });
    setShowChangeCurrentPassword(false);
    setShowChangeNextPassword(false);
    setShowChangeConfirmPassword(false);
    setChangePasswordError('');
  };

  const openManualChangePasswordModal = () => {
    clearChangePasswordForm();
    setManualChangePasswordModalVisible(true);
  };

  const closeManualChangePasswordModal = () => {
    if (changingPassword) return;
    if (user?.mustChangePassword) return;
    setManualChangePasswordModalVisible(false);
    clearChangePasswordForm();
  };

  const handleSubmitForcedPasswordChange = async () => {
    if (changingPassword) return;
    const current = String(changePasswordForm.current || '').trim();
    const next = String(changePasswordForm.next || '').trim();
    const confirm = String(changePasswordForm.confirm || '').trim();

    if (!current || !next || !confirm) {
      setChangePasswordError('Completa todos los campos');
      return;
    }
    if (!STRONG_PASSWORD_REGEX.test(next)) {
      setChangePasswordError('La nueva clave debe tener minimo 8 caracteres, mayuscula, minuscula, numero y caracter especial');
      return;
    }
    if (next !== confirm) {
      setChangePasswordError('La confirmacion no coincide con la nueva clave');
      return;
    }

    setChangingPassword(true);
    try {
      await changeMyPassword(current, next);
      updateUser({ mustChangePassword: false });
      setChangePasswordModalVisible(false);
      setManualChangePasswordModalVisible(false);
      clearChangePasswordForm();
      if (typeof onSuccess === 'function') onSuccess('Clave actualizada');
    } catch (error) {
      setChangePasswordError(error?.response?.data?.error || error?.message || 'No se pudo actualizar la clave');
    } finally {
      setChangingPassword(false);
    }
  };

  useEffect(() => {
    const needsForcedChange = Boolean(user?.mustChangePassword);
    if (needsForcedChange) {
      setChangePasswordModalVisible(true);
      return;
    }
    setChangePasswordModalVisible(Boolean(manualChangePasswordModalVisible));
    if (!manualChangePasswordModalVisible) clearChangePasswordForm();
  }, [manualChangePasswordModalVisible, user?.mustChangePassword]);

  return {
    changingPassword,
    changePasswordModalVisible,
    manualChangePasswordModalVisible,
    changePasswordError,
    changePasswordForm,
    showChangeCurrentPassword,
    showChangeNextPassword,
    showChangeConfirmPassword,
    isForcedPasswordChange: Boolean(user?.mustChangePassword),
    setChangePasswordForm,
    setShowChangeCurrentPassword,
    setShowChangeNextPassword,
    setShowChangeConfirmPassword,
    openManualChangePasswordModal,
    closeManualChangePasswordModal,
    handleSubmitForcedPasswordChange
  };
}
