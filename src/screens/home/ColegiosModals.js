import React from 'react';
import { Animated, Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ColegiosModals({
  styles,
  colegiosModalVisible,
  closeColegiosModal,
  colegiosScrollRef,
  isEditingColegio,
  colegioEditing,
  colegioNombre,
  setColegioNombre,
  colegioCodigoDane,
  setColegioCodigoDane,
  rectorCargo,
  setRectorCargo,
  rectorNombre,
  setRectorNombre,
  rectorApellido,
  setRectorApellido,
  rectorCorreo,
  setRectorCorreo,
  rectorTelefono,
  setRectorTelefono,
  rectorCedula,
  setRectorCedula,
  rectorPassword,
  setRectorPassword,
  showRectorPassword,
  setShowRectorPassword,
  savingColegio,
  handleSaveColegio,
  cancelColegioEdit,
  colegiosError,
  colegiosSuccess,
  colegioSuccessAnim,
  mobileColegioControlsRowStyle,
  mobileColegioControlBtnStyle,
  mobileColegioControlRowStyle,
  mobileColegioControlTextStyle,
  colegiosListModalVisible,
  closeColegiosListModal,
  colegiosListView,
  colegiosLoading,
  rectoresSearchTerm,
  setRectoresSearchTerm,
  rectoresRegistrados,
  rectoresFiltrados,
  openRectorEditModal,
  askDeleteRector,
  colegiosList,
  normalizeColegioItem,
  startEditColegio,
  askDeleteColegio
}) {
  return (
    <>
      <Modal
        transparent
        animationType="slide"
        visible={colegiosModalVisible}
        onRequestClose={closeColegiosModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, styles.colegioModalCard]}>
            <View style={[styles.modalHeader, styles.adminDocentesModalHeader]}>
              <View style={styles.adminDocentesTitleBlock}>
                <View style={styles.adminDocentesIconWrap}>
                  <Ionicons name="business-outline" size={22} color="#ecfeff" />
                </View>
                <View style={styles.adminDocentesTitleCopy}>
                  <Text style={styles.adminDocentesEyebrow}>Vista administrador</Text>
                  <Text style={styles.adminDocentesTitle}>{isEditingColegio ? 'Editar colegio' : 'Crear colegios'}</Text>
                </View>
              </View>
              <Pressable onPress={closeColegiosModal} style={[styles.closeBtn, styles.adminDocentesCloseBtn]}>
                <View style={styles.btnRow}>
                  <Ionicons name="close-outline" size={16} color="#fecaca" />
                  <Text style={styles.closeBtnText}>Cerrar</Text>
                </View>
              </Pressable>
            </View>
            <ScrollView
              ref={colegiosScrollRef}
              contentContainerStyle={[styles.modalContent, styles.adminDocentesModalContent]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={[styles.courseForm, styles.adminColegioCreatePanel]}>
                <View style={styles.adminColegioCreateHero}>
                  <View style={styles.adminColegioAvatar}>
                    <Ionicons name={isEditingColegio ? 'create-outline' : 'add-circle-outline'} size={20} color="#ecfeff" />
                  </View>
                  <View style={styles.adminDocentesTitleCopy}>
                    <Text style={styles.colegioRegisteredEyebrow}>{isEditingColegio ? 'Registro seleccionado' : 'Nueva institucion'}</Text>
                    <Text style={styles.adminColegioCreateTitle}>{isEditingColegio ? 'Actualiza los datos del colegio' : 'Registra colegio y directivo'}</Text>
                  </View>
                </View>
                {isEditingColegio ? (
                  <Text style={styles.dataBullet}>
                    Editando: {colegioEditing?.nombre || `Colegio ${colegioEditing?.id}`}
                  </Text>
                ) : null}
                <TextInput
                  style={[styles.courseInput, styles.adminColegioInput]}
                  placeholder="Nombre del colegio"
                  placeholderTextColor="#7dd3fc"
                  value={colegioNombre}
                  editable={!savingColegio}
                  onChangeText={setColegioNombre}
                />
                <TextInput
                  style={[styles.courseInput, styles.adminColegioInput]}
                  placeholder="Codigo DANE de la institucion"
                  placeholderTextColor="#7dd3fc"
                  value={colegioCodigoDane}
                  editable={!savingColegio}
                  onChangeText={setColegioCodigoDane}
                  autoCapitalize="characters"
                />
                {!isEditingColegio ? (
                  <>
                    <TextInput
                      style={[styles.courseInput, styles.adminColegioInput]}
                      placeholder={`Nombre del ${rectorCargo === 'coordinador' ? 'coordinador' : 'rector'}`}
                      placeholderTextColor="#7dd3fc"
                      value={rectorNombre}
                      editable={!savingColegio}
                      onChangeText={setRectorNombre}
                    />
                    <TextInput
                      style={[styles.courseInput, styles.adminColegioInput]}
                      placeholder={`Apellido del ${rectorCargo === 'coordinador' ? 'coordinador' : 'rector'}`}
                      placeholderTextColor="#7dd3fc"
                      value={rectorApellido}
                      editable={!savingColegio}
                      onChangeText={setRectorApellido}
                    />
                    <TextInput
                      style={[styles.courseInput, styles.adminColegioInput]}
                      placeholder={`Correo del ${rectorCargo === 'coordinador' ? 'coordinador' : 'rector'}`}
                      placeholderTextColor="#7dd3fc"
                      value={rectorCorreo}
                      editable={!savingColegio}
                      onChangeText={setRectorCorreo}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    <TextInput
                      style={[styles.courseInput, styles.adminColegioInput]}
                      placeholder={`Telefono del ${rectorCargo === 'coordinador' ? 'coordinador' : 'rector'}`}
                      placeholderTextColor="#7dd3fc"
                      value={rectorTelefono}
                      editable={!savingColegio}
                      onChangeText={setRectorTelefono}
                      keyboardType="phone-pad"
                    />
                    <TextInput
                      style={[styles.courseInput, styles.adminColegioInput]}
                      placeholder={`Cedula del ${rectorCargo === 'coordinador' ? 'coordinador' : 'rector'}`}
                      placeholderTextColor="#7dd3fc"
                      value={rectorCedula}
                      editable={!savingColegio}
                      onChangeText={setRectorCedula}
                      keyboardType="numeric"
                    />
                    <View style={styles.passwordInputWrap}>
                      <TextInput
                        style={[styles.courseInput, styles.passwordInput, styles.adminColegioInput]}
                        placeholder={`Contrasena del ${rectorCargo === 'coordinador' ? 'coordinador' : 'rector'}`}
                        placeholderTextColor="#7dd3fc"
                        value={rectorPassword}
                        editable={!savingColegio}
                        onChangeText={setRectorPassword}
                        secureTextEntry={!showRectorPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      <TouchableOpacity
                        style={styles.passwordEyeBtn}
                        onPress={() => setShowRectorPassword((prev) => !prev)}
                        disabled={savingColegio}
                      >
                        <Ionicons name={showRectorPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#e5e7eb" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.fieldLabel}>Cargo del directivo</Text>
                  </>
                ) : null}
                <View style={styles.colegioControlsGrid}>
                  {!isEditingColegio ? (
                    <View style={[styles.inlineRow, styles.colegioControlsGridRow, mobileColegioControlsRowStyle]}>
                      <TouchableOpacity
                        style={[
                          styles.smallBtn,
                          styles.colegioControlGridBtn,
                          styles.colegioRoleBtn,
                          styles.adminColegioRoleBtn,
                          mobileColegioControlBtnStyle,
                          rectorCargo === 'rector' && styles.colegioRoleBtnActive,
                          savingColegio && { opacity: 0.6 }
                        ]}
                        onPress={() => setRectorCargo('rector')}
                        disabled={savingColegio}
                      >
                        <View style={[styles.btnRow, styles.colegioControlGridBtnRow, mobileColegioControlRowStyle]}>
                          <Ionicons name="school-outline" size={14} color="#e5e7eb" />
                          <Text style={[styles.smallBtnText, styles.colegioRoleBtnText, styles.colegioControlGridBtnText, mobileColegioControlTextStyle]}>Rector</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.smallBtn,
                          styles.colegioControlGridBtn,
                          styles.colegioRoleBtn,
                          styles.adminColegioRoleBtn,
                          styles.colegioCoordinatorRoleBtn,
                          mobileColegioControlBtnStyle,
                          rectorCargo === 'coordinador' && styles.colegioRoleBtnActive,
                          rectorCargo === 'coordinador' && styles.colegioCoordinatorRoleBtnActive,
                          savingColegio && { opacity: 0.6 }
                        ]}
                        onPress={() => setRectorCargo('coordinador')}
                        disabled={savingColegio}
                      >
                        <View style={[styles.btnRow, styles.colegioControlGridBtnRow, mobileColegioControlRowStyle]}>
                          <Ionicons name="people-outline" size={14} color={rectorCargo === 'coordinador' ? '#ecfeff' : '#a5f3fc'} />
                          <Text style={[styles.smallBtnText, styles.colegioRoleBtnText, styles.colegioControlGridBtnText, mobileColegioControlTextStyle]}>Coordinador</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                  <View style={[styles.inlineRow, styles.colegioControlsGridRow, mobileColegioControlsRowStyle, styles.colegioSaveRow]}>
                    {isEditingColegio ? (
                      <TouchableOpacity
                        style={[styles.smallBtn, styles.colegioControlGridBtn, styles.colegioCancelBtn, styles.adminColegioCancelBtn, mobileColegioControlBtnStyle, savingColegio && { opacity: 0.6 }]}
                        onPress={cancelColegioEdit}
                        disabled={savingColegio}
                      >
                        <View style={[styles.btnRow, styles.colegioControlGridBtnRow, mobileColegioControlRowStyle]}>
                          <Ionicons name="close-outline" size={14} color="#e5e7eb" />
                          <Text style={[styles.smallBtnText, styles.colegioActionBtnText, styles.colegioControlGridBtnText, mobileColegioControlTextStyle]}>Cancelar</Text>
                        </View>
                      </TouchableOpacity>
                    ) : null}
                    <TouchableOpacity
                      style={[
                        styles.smallBtn,
                        styles.colegioControlGridBtn,
                        styles.colegioSaveBtn,
                        styles.adminColegioSaveBtn,
                        !isEditingColegio && styles.adminColegioCreateBtn,
                        mobileColegioControlBtnStyle,
                        savingColegio && { opacity: 0.6 }
                      ]}
                      onPress={handleSaveColegio}
                      disabled={savingColegio}
                    >
                      <View style={[styles.btnRow, styles.colegioControlGridBtnRow, mobileColegioControlRowStyle]}>
                        <Ionicons name="save-outline" size={14} color="#e5e7eb" />
                        <Text style={[styles.smallBtnText, styles.colegioActionBtnText, styles.colegioControlGridBtnText, mobileColegioControlTextStyle]}>{savingColegio ? 'Guardando...' : isEditingColegio ? 'Actualizar' : 'Crear'}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                {colegiosError ? <Text style={[styles.dataBullet, { color: '#fca5a5' }]}>{colegiosError}</Text> : null}
                {colegiosSuccess ? (
                  <Animated.View
                    style={[
                      styles.colegioSuccessBanner,
                      {
                        opacity: colegioSuccessAnim,
                        transform: [
                          {
                            translateY: colegioSuccessAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-8, 0]
                            })
                          },
                          {
                            scale: colegioSuccessAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.98, 1]
                            })
                          }
                        ]
                      }
                    ]}
                  >
                    <Ionicons name="checkmark-circle" size={16} color="#6ee7b7" />
                    <Text style={styles.colegioSuccessText}>{colegiosSuccess}</Text>
                  </Animated.View>
                ) : null}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="slide"
        visible={colegiosListModalVisible}
        onRequestClose={closeColegiosListModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, styles.colegioListModalCard]}>
            <View style={[styles.modalHeader, styles.adminDocentesModalHeader]}>
              <View style={styles.adminDocentesTitleBlock}>
                <View style={styles.adminDocentesIconWrap}>
                  <Ionicons name={colegiosListView === 'rectores' ? 'people-circle-outline' : 'business-outline'} size={22} color="#ecfeff" />
                </View>
                <View style={styles.adminDocentesTitleCopy}>
                  <Text style={styles.adminDocentesEyebrow}>Vista administrador</Text>
                  <Text style={styles.adminDocentesTitle}>{colegiosListView === 'rectores' ? 'Rectores en el sistema' : 'Ver colegios'}</Text>
                </View>
              </View>
              <Pressable onPress={closeColegiosListModal} style={[styles.closeBtn, styles.adminDocentesCloseBtn]}>
                <View style={styles.btnRow}>
                  <Ionicons name="close-outline" size={16} color="#fecaca" />
                  <Text style={styles.closeBtnText}>Cerrar</Text>
                </View>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={[styles.modalContent, styles.adminDocentesModalContent]} showsVerticalScrollIndicator={false}>
              <View style={[styles.dataBox, styles.colegiosRegisteredBox, styles.adminColegiosPanel]}>
                <View style={styles.colegiosRegisteredHeader}>
                  <View style={styles.adminDocentesSectionTitleRow}>
                    <Ionicons name={colegiosListView === 'rectores' ? 'person-outline' : 'school-outline'} size={17} color="#67e8f9" />
                    <Text style={styles.adminDocentesSectionTitle}>{colegiosListView === 'rectores' ? 'Directivos registrados' : 'Colegios registrados'}</Text>
                  </View>
                  {colegiosLoading ? <Text style={styles.dataBullet}>Cargando...</Text> : null}
                </View>
                {colegiosListView === 'rectores' ? (
                  <View style={styles.rectoresListWrap}>
                    <View style={[styles.docentesSearchBox, styles.adminDocentesSearchBox]}>
                      <Text style={styles.fieldLabel}>Filtrar rectores</Text>
                      <View style={[styles.docentesSearchInputWrap, styles.adminDocentesSearchInputWrap]}>
                        <Ionicons name="search-outline" size={16} color="#67e8f9" />
                        <TextInput
                          style={[styles.docentesSearchInput, styles.adminDocentesSearchInput]}
                          placeholder="Nombre, colegio, correo, telefono o cedula"
                          placeholderTextColor="#7dd3fc"
                          value={rectoresSearchTerm}
                          onChangeText={setRectoresSearchTerm}
                        />
                        {rectoresSearchTerm ? (
                          <Pressable
                            onPress={() => setRectoresSearchTerm('')}
                            style={[styles.docentesSearchClearBtn, styles.adminDocentesClearBtn]}
                          >
                            <Ionicons name="close-circle" size={18} color="#a5f3fc" />
                          </Pressable>
                        ) : null}
                      </View>
                    </View>
                    {rectoresRegistrados.length === 0 && !colegiosLoading ? (
                      <Text style={styles.dataBullet}>No hay rectores registrados.</Text>
                    ) : rectoresFiltrados.length === 0 ? (
                      <Text style={styles.dataBullet}>No hay rectores que coincidan con el filtro.</Text>
                    ) : (
                      rectoresFiltrados.map((rector) => (
                        <View key={`rector-list-${rector.id}`} style={[styles.rectorRegisteredCard, styles.adminRectorRegisteredCard]}>
                          <View style={styles.rectorRegisteredTop}>
                            <View style={styles.adminRectorHeaderRow}>
                              <View style={styles.adminRectorAvatar}>
                                <Ionicons name="person-outline" size={18} color="#ecfeff" />
                              </View>
                              <View style={styles.adminDocentesTitleCopy}>
                                <Text style={styles.rectorRegisteredName}>{rector.nombreCompleto || 'Sin nombre registrado'}</Text>
                              </View>
                            </View>
                            <View style={[styles.colegioRegisteredMetaChip, styles.adminColegioMetaChip]}>
                              <Ionicons name="person-outline" size={12} color="#67e8f9" />
                              <Text style={[styles.colegioRegisteredMetaChipText, styles.adminColegioMetaChipText]}>{rector.cargoLabel}</Text>
                            </View>
                          </View>
                          <View style={styles.adminRectorMetaGrid}>
                            <Text style={[styles.adminDocenteMetaPill, styles.adminRectorMetaLine]}>Colegio: {rector.colegioNombre}</Text>
                            <Text style={[styles.adminDocenteMetaPill, styles.adminRectorMetaLine]}>Correo: {rector.correo || 'No registrado'}</Text>
                            <Text style={[styles.adminDocenteMetaPill, styles.adminRectorMetaLine]}>Telefono: {rector.telefono || 'No registrado'}</Text>
                            <Text style={[styles.adminDocenteMetaPill, styles.adminRectorMetaLine]}>Cedula: {rector.cedula || 'No registrada'}</Text>
                          </View>
                          <View style={styles.rectorRegisteredActions}>
                            <TouchableOpacity
                              style={[styles.smallBtn, styles.rectorModernActionBtn, styles.rectorEditBtn, styles.adminColegioActionBtn]}
                              onPress={() => openRectorEditModal(rector)}
                              activeOpacity={0.86}
                            >
                              <View style={[styles.btnRow, styles.rectorModernActionRow]}>
                                <Ionicons name="create-outline" size={14} color="#eff6ff" />
                                <Text style={[styles.smallBtnText, styles.rectorModernActionText]}>Editar</Text>
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.smallBtn, styles.rectorModernActionBtn, styles.rectorDeleteBtn, styles.adminColegioActionBtn]}
                              onPress={() => askDeleteRector(rector)}
                              activeOpacity={0.86}
                            >
                              <View style={[styles.btnRow, styles.rectorModernActionRow]}>
                                <Ionicons name="trash-outline" size={14} color="#fff1f2" />
                                <Text style={[styles.smallBtnText, styles.rectorModernActionText]}>Eliminar</Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))
                    )}
                  </View>
                ) : colegiosList.length === 0 && !colegiosLoading ? (
                  <Text style={styles.dataBullet}>- Aun no hay colegios registrados</Text>
                ) : (
                  colegiosList.map((c) => {
                    const colegio = normalizeColegioItem(c);
                    return (
                      <View
                        key={colegio.id}
                        style={[
                          styles.colegioRegisteredCard,
                          styles.adminColegioRegisteredCard,
                          isEditingColegio && String(colegioEditing?.id) === String(colegio.id) && styles.colegioRegisteredCardActive
                        ]}
                      >
                        <View style={styles.colegioRegisteredTopRow}>
                          <View style={styles.adminColegioHeaderRow}>
                            <View style={styles.adminColegioAvatar}>
                              <Ionicons name="business-outline" size={19} color="#ecfeff" />
                            </View>
                            <View style={styles.colegioRegisteredTitleWrap}>
                              <Text style={styles.colegioRegisteredEyebrow}>Colegio</Text>
                              <Text style={styles.colegioRegisteredName}>{colegio.nombre || `Colegio ${colegio.id}`}</Text>
                              <View style={styles.colegioRegisteredMetaWrap}>
                                {colegio.codigoDane ? (
                                  <View style={[styles.colegioRegisteredMetaChip, styles.adminColegioMetaChip]}>
                                    <Ionicons name="id-card-outline" size={12} color="#67e8f9" />
                                    <Text style={[styles.colegioRegisteredMetaChipText, styles.adminColegioMetaChipText]}>DANE {colegio.codigoDane}</Text>
                                  </View>
                                ) : (
                                  <View style={[styles.colegioRegisteredMetaChip, styles.adminColegioMetaChip]}>
                                    <Ionicons name="id-card-outline" size={12} color="#67e8f9" />
                                    <Text style={[styles.colegioRegisteredMetaChipText, styles.adminColegioMetaChipText]}>Sin codigo DANE</Text>
                                  </View>
                                )}
                              </View>
                            </View>
                          </View>
                        </View>

                        <View style={styles.colegioRegisteredActions}>
                          <TouchableOpacity style={[styles.smallBtn, styles.updateBtn, styles.colegioRegisteredActionBtn, styles.adminColegioActionBtn, styles.adminColegioEditBtn]} onPress={() => startEditColegio(colegio)}>
                            <View style={[styles.btnRow, styles.colegioRegisteredActionBtnRow]}>
                              <Ionicons name="create-outline" size={14} color="#ecfeff" />
                              <Text style={[styles.smallBtnText, styles.adminDocenteActionText]}>Editar</Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.smallBtn, styles.deleteBtn, styles.colegioRegisteredActionBtn, styles.adminColegioActionBtn, styles.adminColegioDeleteBtn]} onPress={() => askDeleteColegio(colegio)}>
                            <View style={[styles.btnRow, styles.colegioRegisteredActionBtnRow]}>
                              <Ionicons name="trash-outline" size={14} color="#fff1f2" />
                              <Text style={[styles.smallBtnText, styles.adminDocenteActionText]}>Eliminar</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
