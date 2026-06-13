import React from 'react';
import { Modal, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ChangePasswordModal({
  visible,
  styles,
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
  handleSubmitForcedPasswordChange
}) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={closeManualChangePasswordModal}
    >
      <View style={styles.modalBackdrop}>
        <View style={[styles.modalCard, styles.changePasswordModalCard]}>
          <View style={styles.modalHeader}>
            <Text style={styles.periodTitle}>{isForcedPasswordChange ? 'Cambio obligatorio de clave' : 'Cambiar contrase\u00f1a'}</Text>
            {!isForcedPasswordChange ? (
              <Pressable onPress={closeManualChangePasswordModal} style={styles.closeBtn}>
                <View style={styles.btnRow}>
                  <Ionicons name="close-outline" size={16} color="#fecaca" />
                  <Text style={styles.closeBtnText}>Cerrar</Text>
                </View>
              </Pressable>
            ) : null}
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.dataBullet}>
              {isForcedPasswordChange
                ? 'Debes cambiar tu clave temporal para continuar.'
                : 'Usa una clave segura: minimo 8 caracteres, mayuscula, minuscula, numero y caracter especial.'}
            </Text>

            <View style={styles.passwordInputWrap}>
              <TextInput
                style={[styles.courseInput, styles.passwordInput]}
                placeholder="Clave actual (temporal)"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showChangeCurrentPassword}
                value={changePasswordForm.current}
                onChangeText={(txt) => setChangePasswordForm((prev) => ({ ...prev, current: txt }))}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity style={styles.passwordEyeBtn} onPress={() => setShowChangeCurrentPassword((prev) => !prev)} disabled={changingPassword}>
                <Ionicons name={showChangeCurrentPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#e5e7eb" />
              </TouchableOpacity>
            </View>

            <View style={styles.passwordInputWrap}>
              <TextInput
                style={[styles.courseInput, styles.passwordInput]}
                placeholder="Nueva clave"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showChangeNextPassword}
                value={changePasswordForm.next}
                onChangeText={(txt) => setChangePasswordForm((prev) => ({ ...prev, next: txt }))}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity style={styles.passwordEyeBtn} onPress={() => setShowChangeNextPassword((prev) => !prev)} disabled={changingPassword}>
                <Ionicons name={showChangeNextPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#e5e7eb" />
              </TouchableOpacity>
            </View>

            <View style={styles.passwordInputWrap}>
              <TextInput
                style={[styles.courseInput, styles.passwordInput]}
                placeholder="Confirmar nueva clave"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showChangeConfirmPassword}
                value={changePasswordForm.confirm}
                onChangeText={(txt) => setChangePasswordForm((prev) => ({ ...prev, confirm: txt }))}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity style={styles.passwordEyeBtn} onPress={() => setShowChangeConfirmPassword((prev) => !prev)} disabled={changingPassword}>
                <Ionicons name={showChangeConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#e5e7eb" />
              </TouchableOpacity>
            </View>

            {changePasswordError ? <Text style={styles.errorText}>{changePasswordError}</Text> : null}

            <View style={styles.courseFormActions}>
              {isForcedPasswordChange ? (
                <TouchableOpacity style={[styles.smallBtn, styles.deleteBtn, changingPassword && { opacity: 0.6 }]} onPress={logout} disabled={changingPassword}>
                  <View style={styles.btnRow}>
                    <Ionicons name="log-out-outline" size={14} color="#e5e7eb" />
                    <Text style={styles.smallBtnText}>Cerrar sesion</Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={[styles.smallBtn, styles.outlineBtn, styles.rectorCancelBtn, styles.rectorPairedActionBtn, changingPassword && { opacity: 0.6 }]} onPress={closeManualChangePasswordModal} disabled={changingPassword}>
                  <View style={[styles.btnRow, styles.rectorCancelRow]}>
                    <Ionicons name="close-outline" size={14} color="#fecaca" />
                    <Text style={[styles.smallBtnText, styles.rectorCancelText]}>Cancelar</Text>
                  </View>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={[styles.smallBtn, styles.createBtn, styles.rectorPairedActionBtn, changingPassword && { opacity: 0.6 }]} onPress={handleSubmitForcedPasswordChange} disabled={changingPassword}>
                <View style={[styles.btnRow, styles.rectorPairedActionRow]}>
                  <Ionicons name="save-outline" size={14} color="#e5e7eb" />
                  <Text style={styles.smallBtnText}>{changingPassword ? 'Actualizando...' : 'Actualizar clave'}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
