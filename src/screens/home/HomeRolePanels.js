import React from 'react';
import { View } from 'react-native';
import AdminRolePanel from './AdminRolePanel';
import DocenteRolePanel from './DocenteRolePanel';
import FallbackRolePanel from './FallbackRolePanel';
import RectorCoordinatorRolePanel from './RectorCoordinatorRolePanel';
import UserInfoCard from './UserInfoCard';

export default function HomeRolePanels({
  styles,
  user,
  teacherInitial,
  isAdmin,
  isDocente,
  isRectorCoordinador,
  canManageCourses,
  canManagePeriods,
  isMobileApp,
  showMobileGridLogout,
  mobileActionBtnStyle,
  mobileActionTextStyle,
  mobileBtnRowStyle,
  mobileDocenteRowStyle,
  mobileDocenteTextStyle,
  mobileLongLabelRowStyle,
  mobileLongLabelTextStyle,
  mobileGridLogoutRowStyle,
  mobileGridLogoutTextStyle,
  navigation,
  openEstudiantesModal,
  setDocentePanelModalVisible,
  openManualChangePasswordModal,
  openRectorCursosModal,
  openRectorSedesModal,
  openDocenteCrudModal,
  openDocentesModal,
  openColegiosModal,
  openColegiosListModal,
  openRectoresListModal,
  openPeriodManagerModal,
  openReportesModal,
  logout
}) {
  return (
    <>
      <UserInfoCard
        styles={styles}
        user={user}
        teacherInitial={teacherInitial}
        isAdmin={isAdmin}
      />

      <View style={[styles.actionGrid, isRectorCoordinador && styles.actionGridRector, isMobileApp && styles.actionGridMobile]}>
        {isDocente ? (
          <DocenteRolePanel
            styles={styles}
            navigation={navigation}
            mobileActionBtnStyle={mobileActionBtnStyle}
            mobileBtnRowStyle={mobileBtnRowStyle}
            mobileDocenteRowStyle={mobileDocenteRowStyle}
            mobileActionTextStyle={mobileActionTextStyle}
            mobileDocenteTextStyle={mobileDocenteTextStyle}
            openEstudiantesModal={openEstudiantesModal}
            setDocentePanelModalVisible={setDocentePanelModalVisible}
            openManualChangePasswordModal={openManualChangePasswordModal}
            logout={logout}
          />
        ) : null}

        {isAdmin ? (
          <AdminRolePanel
            styles={styles}
            canManagePeriods={canManagePeriods}
            mobileActionBtnStyle={mobileActionBtnStyle}
            mobileBtnRowStyle={mobileBtnRowStyle}
            mobileLongLabelRowStyle={mobileLongLabelRowStyle}
            mobileActionTextStyle={mobileActionTextStyle}
            mobileLongLabelTextStyle={mobileLongLabelTextStyle}
            openDocenteCrudModal={openDocenteCrudModal}
            openColegiosModal={openColegiosModal}
            openColegiosListModal={openColegiosListModal}
            openRectoresListModal={openRectoresListModal}
            openPeriodManagerModal={openPeriodManagerModal}
            openReportesModal={openReportesModal}
            logout={logout}
          />
        ) : null}

        {isRectorCoordinador ? (
          <RectorCoordinatorRolePanel
            styles={styles}
            canManageCourses={canManageCourses}
            canManagePeriods={canManagePeriods}
            mobileActionBtnStyle={mobileActionBtnStyle}
            mobileBtnRowStyle={mobileBtnRowStyle}
            mobileLongLabelRowStyle={mobileLongLabelRowStyle}
            mobileActionTextStyle={mobileActionTextStyle}
            mobileLongLabelTextStyle={mobileLongLabelTextStyle}
            openRectorCursosModal={openRectorCursosModal}
            openRectorSedesModal={openRectorSedesModal}
            openDocenteCrudModal={openDocenteCrudModal}
            openDocentesModal={openDocentesModal}
            openPeriodManagerModal={openPeriodManagerModal}
            openReportesModal={openReportesModal}
            openManualChangePasswordModal={openManualChangePasswordModal}
            logout={logout}
          />
        ) : null}

        {!isAdmin && !isDocente && !isRectorCoordinador && showMobileGridLogout ? (
          <FallbackRolePanel
            styles={styles}
            isDocente={isDocente}
            showMobileGridLogout={showMobileGridLogout}
            mobileGridLogoutRowStyle={mobileGridLogoutRowStyle}
            mobileGridLogoutTextStyle={mobileGridLogoutTextStyle}
            logout={logout}
          />
        ) : null}
      </View>

      {!isAdmin && !isDocente && !isRectorCoordinador && !showMobileGridLogout ? (
        <FallbackRolePanel
          styles={styles}
          isDocente={isDocente}
          showMobileGridLogout={showMobileGridLogout}
          mobileGridLogoutRowStyle={mobileGridLogoutRowStyle}
          mobileGridLogoutTextStyle={mobileGridLogoutTextStyle}
          logout={logout}
        />
      ) : null}
    </>
  );
}
