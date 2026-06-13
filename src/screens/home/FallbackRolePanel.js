import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FallbackRolePanel({
  styles,
  isDocente,
  showMobileGridLogout,
  mobileGridLogoutRowStyle,
  mobileGridLogoutTextStyle,
  logout
}) {
  if (showMobileGridLogout) {
    return (
      <View style={styles.mobileLogoutRowCenter}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.actionBtnMobile, styles.logoutActionBtn, isDocente && styles.docenteGridLogoutCentered]}
          onPress={logout}
          activeOpacity={0.85}
        >
          <View style={[styles.btnRow, styles.btnRowMobile, mobileGridLogoutRowStyle]}>
            <Ionicons name="log-out-outline" size={18} color="#fff" />
            <Text style={[styles.actionBtnText, styles.actionBtnTextMobile, mobileGridLogoutTextStyle]}>Cerrar sesion</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity style={[styles.logoutBtn, isDocente && styles.docenteFooterLogoutCentered]} onPress={logout} activeOpacity={0.85}>
      <View style={styles.btnRow}>
        <Ionicons name="log-out-outline" size={18} color="#fff" />
        <Text style={styles.logoutText}>Cerrar sesion</Text>
      </View>
    </TouchableOpacity>
  );
}
