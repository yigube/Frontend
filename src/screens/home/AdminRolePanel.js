import React from 'react';
import { View } from 'react-native';
import RoleActionButton from './RoleActionButton';

export default function AdminRolePanel({
  styles,
  canManagePeriods,
  mobileActionBtnStyle,
  mobileBtnRowStyle,
  mobileLongLabelRowStyle,
  mobileActionTextStyle,
  mobileLongLabelTextStyle,
  openDocenteCrudModal,
  openColegiosModal,
  openColegiosListModal,
  openRectoresListModal,
  openPeriodManagerModal,
  openReportesModal,
  logout
}) {
  const buttonStyles = [mobileActionBtnStyle].filter(Boolean);
  const rowStyles = [mobileBtnRowStyle, mobileLongLabelRowStyle].filter(Boolean);
  const textStyles = [mobileActionTextStyle, mobileLongLabelTextStyle].filter(Boolean);
  const compactTextStyles = [styles.actionBtnTextCompact, ...textStyles];

  return (
    <>
      <RoleActionButton
        styles={styles}
        label="Ver docentes"
        icon="person-add-outline"
        backgroundColor="#14b8a6"
        onPress={openDocenteCrudModal}
        buttonStyles={buttonStyles}
        rowStyles={rowStyles}
        textStyles={textStyles}
      />
      <RoleActionButton
        styles={styles}
        label="Crear colegios"
        icon="business-outline"
        iconColor="#111"
        textColor="#111"
        backgroundColor="#facc15"
        onPress={openColegiosModal}
        buttonStyles={buttonStyles}
        rowStyles={rowStyles}
        textStyles={textStyles}
      />
      <RoleActionButton
        styles={styles}
        label="Ver colegios"
        icon="list-outline"
        backgroundColor="#2563eb"
        onPress={openColegiosListModal}
        buttonStyles={buttonStyles}
        rowStyles={rowStyles}
        textStyles={textStyles}
      />
      <RoleActionButton
        styles={styles}
        label="Ver rectores"
        icon="people-circle-outline"
        backgroundColor="#10b981"
        onPress={openRectoresListModal}
        buttonStyles={buttonStyles}
        rowStyles={rowStyles}
        textStyles={textStyles}
      />
      <RoleActionButton
        styles={styles}
        label="Ver reportes"
        icon="bar-chart-outline"
        backgroundColor="#f97316"
        onPress={openReportesModal}
        buttonStyles={buttonStyles}
        rowStyles={rowStyles}
        textStyles={compactTextStyles}
      />
      {canManagePeriods ? (
        <>
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
          <View style={styles.adminGridLogoutRow}>
            <RoleActionButton
              styles={styles}
              label="Cerrar sesion"
              icon="log-out-outline"
              backgroundColor="#ef4444"
              onPress={logout}
              buttonStyles={[...buttonStyles, styles.logoutActionBtn, styles.adminGridLogoutCentered]}
              rowStyles={rowStyles}
              textStyles={compactTextStyles}
            />
          </View>
        </>
      ) : null}
    </>
  );
}
