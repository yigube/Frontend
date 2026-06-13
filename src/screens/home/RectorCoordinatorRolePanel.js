import React from 'react';
import RoleActionButton from './RoleActionButton';

export default function RectorCoordinatorRolePanel({
  styles,
  canManageCourses,
  canManagePeriods,
  mobileActionBtnStyle,
  mobileBtnRowStyle,
  mobileLongLabelRowStyle,
  mobileActionTextStyle,
  mobileLongLabelTextStyle,
  openRectorCursosModal,
  openRectorSedesModal,
  openDocenteCrudModal,
  openDocentesModal,
  openPeriodManagerModal,
  openReportesModal,
  openManualChangePasswordModal,
  logout
}) {
  const buttonStyles = [styles.actionBtnRector, mobileActionBtnStyle].filter(Boolean);
  const rowStyles = [mobileBtnRowStyle, mobileLongLabelRowStyle].filter(Boolean);
  const textStyles = [styles.actionBtnTextCompact, mobileActionTextStyle, mobileLongLabelTextStyle].filter(Boolean);

  return (
    <>
      {canManageCourses ? (
        <RoleActionButton
          styles={styles}
          label="Crear cursos"
          icon="book-outline"
          backgroundColor="#38bdf8"
          onPress={openRectorCursosModal}
          buttonStyles={buttonStyles}
          rowStyles={rowStyles}
          textStyles={textStyles}
        />
      ) : null}
      <RoleActionButton
        styles={styles}
        label="Crear sedes"
        icon="business-outline"
        backgroundColor="#059669"
        onPress={openRectorSedesModal}
        buttonStyles={buttonStyles}
        rowStyles={rowStyles}
        textStyles={textStyles}
      />
      <RoleActionButton
        styles={styles}
        label="Crear docentes"
        icon="person-add-outline"
        backgroundColor="#14b8a6"
        onPress={openDocenteCrudModal}
        buttonStyles={buttonStyles}
        rowStyles={rowStyles}
        textStyles={textStyles}
      />
      <RoleActionButton
        styles={styles}
        label="Ver docentes"
        icon="people-outline"
        backgroundColor="#2563eb"
        onPress={openDocentesModal}
        buttonStyles={buttonStyles}
        rowStyles={rowStyles}
        textStyles={textStyles}
      />
      {canManagePeriods ? (
        <RoleActionButton
          styles={styles}
          label="Periodos activos"
          icon="calendar-outline"
          backgroundColor="#7c3aed"
          onPress={openPeriodManagerModal}
          buttonStyles={buttonStyles}
          rowStyles={rowStyles}
          textStyles={textStyles}
        />
      ) : null}
      <RoleActionButton
        styles={styles}
        label="Ver reportes"
        icon="bar-chart-outline"
        backgroundColor="#f97316"
        onPress={openReportesModal}
        buttonStyles={buttonStyles}
        rowStyles={rowStyles}
        textStyles={textStyles}
      />
      <RoleActionButton
        styles={styles}
        label="Cambiar contraseÃ±a"
        icon="key-outline"
        backgroundColor="#0ea5a4"
        onPress={openManualChangePasswordModal}
        buttonStyles={buttonStyles}
        rowStyles={rowStyles}
        textStyles={textStyles}
      />
      <RoleActionButton
        styles={styles}
        label="Cerrar sesion"
        icon="log-out-outline"
        backgroundColor="#ef4444"
        onPress={logout}
        buttonStyles={[...buttonStyles, styles.logoutActionBtn]}
        rowStyles={rowStyles}
        textStyles={textStyles}
      />
    </>
  );
}
