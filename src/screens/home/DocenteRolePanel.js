import React from 'react';
import { View } from 'react-native';
import RoleActionButton from './RoleActionButton';

export default function DocenteRolePanel({
  styles,
  navigation,
  mobileActionBtnStyle,
  mobileBtnRowStyle,
  mobileDocenteRowStyle,
  mobileActionTextStyle,
  mobileDocenteTextStyle,
  openEstudiantesModal,
  setDocentePanelModalVisible,
  openManualChangePasswordModal,
  logout
}) {
  const buttonStyles = [mobileActionBtnStyle].filter(Boolean);
  const rowStyles = [mobileBtnRowStyle, mobileDocenteRowStyle].filter(Boolean);
  const textStyles = [mobileActionTextStyle, mobileDocenteTextStyle].filter(Boolean);
  const compactTextStyles = [styles.actionBtnTextCompact, ...textStyles];

  return (
    <>
      <RoleActionButton
        styles={styles}
        label="Escanear QR"
        icon="qr-code-outline"
        backgroundColor="#22c55e"
        onPress={() => navigation.navigate('QR')}
        buttonStyles={buttonStyles}
        rowStyles={rowStyles}
        textStyles={textStyles}
      />
      <RoleActionButton
        styles={styles}
        label="Ver estudiantes"
        icon="people-outline"
        backgroundColor="#a78bfa"
        onPress={openEstudiantesModal}
        buttonStyles={buttonStyles}
        rowStyles={rowStyles}
        textStyles={compactTextStyles}
      />
      <RoleActionButton
        styles={styles}
        label="Panel docente"
        icon="school-outline"
        backgroundColor="#2563eb"
        onPress={() => setDocentePanelModalVisible(true)}
        buttonStyles={buttonStyles}
        rowStyles={rowStyles}
        textStyles={compactTextStyles}
      />
      <RoleActionButton
        styles={styles}
        label="Cambiar contraseÃ±a"
        icon="key-outline"
        backgroundColor="#0ea5a4"
        onPress={openManualChangePasswordModal}
        buttonStyles={buttonStyles}
        rowStyles={rowStyles}
        textStyles={compactTextStyles}
      />
      <View style={styles.docenteGridLogoutRow}>
        <RoleActionButton
          styles={styles}
          label="Cerrar sesion"
          icon="log-out-outline"
          backgroundColor="#ef4444"
          onPress={logout}
          buttonStyles={[...buttonStyles, styles.logoutActionBtn, styles.docenteGridLogoutCentered]}
          rowStyles={rowStyles}
          textStyles={compactTextStyles}
        />
      </View>
    </>
  );
}
