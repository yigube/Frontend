import React from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DocentesModals({
  styles,
  isAdmin,
  isMobileApp,
  user,
  NIVEL_OPTIONS,
  docenteNivelModalVisible,
  closeDocenteNivelConfigModal,
  docenteNivel,
  getNivelLabel,
  docenteSedeId,
  resolveSedeNombre,
  setDocenteNivelPickerOpen,
  setDocenteSedePickerOpen,
  savingDocente,
  docenteNivelPickerOpen,
  setDocenteNivel,
  docenteSedePickerOpen,
  setDocenteSedeId,
  sedesLoading,
  sedesDisponibles,
  docenteCursosModalVisible,
  closeDocenteCursosConfigModal,
  docenteCursos,
  docenteCursosReturnTarget,
  loadingCursos,
  docenteCursosDisponibles,
  toggleDocenteCurso,
  getNivelShortLabel,
  docenteMateriasDraft,
  updateDocenteMateriaDraft,
  commitDocenteMateriaDraft,
  docenteCrudModalVisible,
  closeDocenteCrudModal,
  canAdminFilterDocenteSchools,
  docenteColegioPickerOpen,
  setDocenteColegioPickerOpen,
  colegiosLoading,
  resolveColegioNombre,
  docenteColegioId,
  colegiosOptions,
  handleSelectDocenteCrudColegio,
  docentesLoading,
  docentes,
  adminDocentesSearchTerm,
  setAdminDocentesSearchTerm,
  adminDocentesFiltrados,
  sortCursosForDisplay,
  handleResetDocentePassword,
  openAdminDocenteEditModal,
  askDeleteDocente,
  docenteEditing,
  docenteForm,
  setDocenteForm,
  sanitizeDocenteNombreInput,
  normalizeDocenteEmailInput,
  showDocentePassword,
  setShowDocentePassword,
  docenteError,
  resetDocenteFormState,
  openDocenteNivelConfigModal,
  openDocenteCursosConfigModal,
  handleSaveDocente,
  adminDocenteEditModalVisible,
  closeAdminDocenteEditModal,
  parseMateriasTexto,
  docenteCrudListModalVisible,
  closeDocenteCrudListModal,
  docentesSearchTerm,
  setDocentesSearchTerm,
  docentesSearchOpen,
  setDocentesSearchOpen,
  docentesSearchNormalized,
  docentesSearchSuggestions,
  docentesFiltrados,
  docentesModalVisible,
  closeDocentesModal,
  colegioSeleccionadoNombre,
  colegioPickerOpen,
  setColegioPickerOpen,
  colegioSeleccionado,
  setColegioSeleccionado,
  loadDocentesColegio,
  docentesError
}) {
  return (
    <>
      <Modal
        transparent
        animationType="fade"
        visible={docenteNivelModalVisible}
        onRequestClose={closeDocenteNivelConfigModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, styles.docenteConfigModalCard]}>
            <View style={styles.modalHeader}>
              <View style={styles.docenteEditHeaderTitle}>
                <Text style={styles.rectorEditEyebrow}>Docente</Text>
                <Text style={styles.periodTitle}>Nivel docente</Text>
              </View>
              <Pressable onPress={closeDocenteNivelConfigModal} style={styles.closeBtn}>
                <View style={styles.btnRow}>
                  <Ionicons name="close-outline" size={16} color="#fecaca" />
                  <Text style={styles.closeBtnText}>Cerrar</Text>
                </View>
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.docenteConfigHero}>
                <View style={styles.docenteConfigIconWrap}>
                  <Ionicons name="school-outline" size={24} color="#dbeafe" />
                </View>
                <View style={styles.rectorCourseEditHeroCopy}>
                  <Text style={styles.rectorCourseEditHeroTitle}>{docenteNivel ? getNivelLabel(docenteNivel) : 'Sin nivel'}</Text>
                  <Text style={styles.rectorCourseEditHeroMeta}>{docenteSedeId ? resolveSedeNombre(docenteSedeId) : 'Sin sede asignada'}</Text>
                </View>
              </View>
              <View style={styles.courseForm}>
                <Text style={styles.fieldLabel}>Nivel del docente</Text>
                <TouchableOpacity
                  style={styles.selectBoxFull}
                  onPress={() => {
                    setDocenteNivelPickerOpen((prev) => !prev);
                    setDocenteSedePickerOpen(false);
                  }}
                  disabled={savingDocente}
                >
                  <Text style={styles.selectText}>{docenteNivel ? getNivelLabel(docenteNivel) : 'Sin nivel'}</Text>
                </TouchableOpacity>
                {docenteNivelPickerOpen ? (
                  <View style={styles.pickerList}>
                    <TouchableOpacity
                      style={[styles.pickerItem, !docenteNivel && styles.pickerItemActive]}
                      onPress={() => {
                        setDocenteNivel('');
                        setDocenteNivelPickerOpen(false);
                      }}
                    >
                      <Text style={styles.dataItem}>Sin nivel</Text>
                    </TouchableOpacity>
                    {NIVEL_OPTIONS.map((nivel) => (
                      <TouchableOpacity
                        key={`docente-modal-nivel-${nivel.value}`}
                        style={[styles.pickerItem, docenteNivel === nivel.value && styles.pickerItemActive]}
                        onPress={() => {
                          setDocenteNivel(nivel.value);
                          setDocenteNivelPickerOpen(false);
                        }}
                      >
                        <Text style={styles.dataItem}>{nivel.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : null}

                <Text style={styles.fieldLabel}>Sede del docente</Text>
                <TouchableOpacity
                  style={styles.selectBoxFull}
                  onPress={() => {
                    setDocenteSedePickerOpen((prev) => !prev);
                    setDocenteNivelPickerOpen(false);
                  }}
                  disabled={savingDocente || sedesLoading}
                >
                  <Text style={styles.selectText}>{docenteSedeId ? resolveSedeNombre(docenteSedeId) : 'Sin sede'}</Text>
                </TouchableOpacity>
                {docenteSedePickerOpen ? (
                  <View style={styles.pickerList}>
                    <TouchableOpacity
                      style={[styles.pickerItem, !docenteSedeId && styles.pickerItemActive]}
                      onPress={() => {
                        setDocenteSedeId(null);
                        setDocenteSedePickerOpen(false);
                      }}
                    >
                      <Text style={styles.dataItem}>Sin sede</Text>
                    </TouchableOpacity>
                    {sedesDisponibles.map((sede) => (
                      <TouchableOpacity
                        key={`docente-modal-sede-${sede.id}`}
                        style={[styles.pickerItem, Number(docenteSedeId) === Number(sede.id) && styles.pickerItemActive]}
                        onPress={() => {
                          setDocenteSedeId(sede.id);
                          setDocenteSedePickerOpen(false);
                        }}
                      >
                        <Text style={styles.dataItem}>{sede.nombre}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : null}

                <View style={styles.docenteConfigActions}>
                  <TouchableOpacity
                    style={[styles.smallBtn, styles.createBtn, styles.docenteConfigDoneBtn]}
                    onPress={closeDocenteNivelConfigModal}
                  >
                    <View style={[styles.btnRow, styles.docenteCreateSaveRow]}>
                      <Ionicons name="checkmark-outline" size={14} color="#e5e7eb" />
                      <Text style={styles.smallBtnText}>Listo</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="fade"
        visible={docenteCursosModalVisible}
        onRequestClose={closeDocenteCursosConfigModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, styles.docenteConfigModalCard]}>
            <View style={styles.modalHeader}>
              <View style={styles.docenteEditHeaderTitle}>
                <Text style={styles.rectorEditEyebrow}>Docente</Text>
                <Text style={styles.periodTitle}>Asignar cursos</Text>
              </View>
              <Pressable onPress={closeDocenteCursosConfigModal} style={styles.closeBtn}>
                <View style={styles.btnRow}>
                  <Ionicons name="close-outline" size={16} color="#fecaca" />
                  <Text style={styles.closeBtnText}>Cerrar</Text>
                </View>
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.docenteConfigHero}>
                <View style={styles.docenteConfigIconWrap}>
                  <Ionicons name="library-outline" size={24} color="#dbeafe" />
                </View>
                <View style={styles.rectorCourseEditHeroCopy}>
                  <Text style={styles.rectorCourseEditHeroTitle}>
                    {docenteCursos.length} curso{docenteCursos.length === 1 ? '' : 's'} seleccionado{docenteCursos.length === 1 ? '' : 's'}
                  </Text>
                  <Text style={styles.rectorCourseEditHeroMeta}>
                    Asigna cursos y materias antes de {docenteCursosReturnTarget === 'edit' ? 'actualizar' : 'crear'} el docente
                  </Text>
                </View>
              </View>
              <View style={styles.courseForm}>
                {loadingCursos ? (
                  <Text style={styles.dataBullet}>Cargando cursos...</Text>
                ) : docenteCursosDisponibles.length === 0 ? (
                  <Text style={styles.dataBullet}>No hay cursos disponibles para asignar.</Text>
                ) : (
                  <View style={styles.docenteCourseChecklist}>
                    {docenteCursosDisponibles.map((curso) => {
                      const isSelected = docenteCursos.includes(curso.id);
                      return (
                        <TouchableOpacity
                          key={`docente-modal-curso-option-${curso.id}`}
                          style={[styles.docenteCourseOption, isSelected && styles.docenteCourseOptionActive]}
                          onPress={() => toggleDocenteCurso(curso.id)}
                          disabled={savingDocente}
                          activeOpacity={0.85}
                        >
                          <Ionicons
                            name={isSelected ? 'checkbox-outline' : 'square-outline'}
                            size={20}
                            color={isSelected ? '#60a5fa' : '#cbd5e1'}
                          />
                          <View style={styles.docenteCourseOptionCopyMobile}>
                            <Text
                              style={[styles.docenteCourseOptionText, styles.docenteCourseOptionTextMobile, isSelected && styles.docenteCourseOptionTextActive]}
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {`${curso?.nombre || `Curso ${curso?.id}`} · ${getNivelShortLabel(curso?.nivel)}`}
                            </Text>
                            <Text style={styles.docenteCourseOptionMetaMobile} numberOfLines={2} ellipsizeMode="tail">
                              {`Sede: ${resolveSedeNombre(curso?.sedeId)}`}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}

                {docenteCursos.length > 0 ? (
                  <View style={styles.docenteMateriasByCursoWrap}>
                    <Text style={styles.fieldLabel}>Materias por curso</Text>
                    {docenteCursos
                      .map((cursoId) => docenteCursosDisponibles.find((curso) => String(curso?.id) === String(cursoId)))
                      .filter(Boolean)
                      .map((curso) => (
                        <View key={`docente-modal-materias-curso-${curso.id}`} style={styles.docenteMateriaCursoItem}>
                          <Text style={styles.docenteMateriaCursoLabel}>{curso?.nombre || `Curso ${curso?.id}`}</Text>
                          <TextInput
                            style={[styles.courseInput, styles.docenteMateriaCursoInput]}
                            placeholder="Ej: Matematicas, Etica"
                            placeholderTextColor="#94a3b8"
                            value={docenteMateriasDraft?.[curso.id] || ''}
                            onChangeText={(txt) => updateDocenteMateriaDraft(curso.id, txt)}
                            onBlur={(event) => commitDocenteMateriaDraft(curso.id, event?.nativeEvent?.text)}
                            editable={!savingDocente}
                            multiline
                          />
                          <Text style={styles.docenteMateriaCursoHint}>Separa varias materias con coma.</Text>
                        </View>
                      ))}
                  </View>
                ) : null}

                <View style={styles.docenteConfigActions}>
                  <TouchableOpacity
                    style={[styles.smallBtn, styles.createBtn, styles.docenteConfigDoneBtn]}
                    onPress={closeDocenteCursosConfigModal}
                  >
                    <View style={[styles.btnRow, styles.docenteCreateSaveRow]}>
                      <Ionicons name="checkmark-outline" size={14} color="#e5e7eb" />
                      <Text style={styles.smallBtnText}>Listo</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="slide"
        visible={docenteCrudModalVisible}
        onRequestClose={closeDocenteCrudModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, styles.docenteCrudModalCard]}>
            <View style={[styles.modalHeader, styles.adminDocentesModalHeader]}>
              <View style={styles.adminDocentesTitleBlock}>
                <View style={styles.adminDocentesIconWrap}>
                  <Ionicons name="people-outline" size={22} color="#ecfeff" />
                </View>
                <View style={styles.adminDocentesTitleCopy}>
                  <Text style={styles.adminDocentesEyebrow}>Vista administrador</Text>
                  <Text style={styles.adminDocentesTitle}>{isAdmin ? 'Ver docentes' : 'Crear docentes'}</Text>
                </View>
              </View>
              <Pressable onPress={closeDocenteCrudModal} style={[styles.closeBtn, styles.adminDocentesCloseBtn]}>
                <View style={styles.btnRow}>
                  <Ionicons name="close-outline" size={16} color="#fecaca" />
                  <Text style={styles.closeBtnText}>Cerrar</Text>
                </View>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={[styles.modalContent, styles.adminDocentesModalContent]} showsVerticalScrollIndicator={false}>
              {isAdmin ? (
                <View style={styles.courseForm}>
                  {canAdminFilterDocenteSchools ? (
                    <View style={[styles.dataBox, styles.adminDocentesPanel]}>
                      <Text style={styles.fieldLabel}>Institucion</Text>
                      <TouchableOpacity
                        style={[styles.selectBoxFull, styles.adminDocentesSelectBox]}
                        onPress={() => setDocenteColegioPickerOpen((prev) => !prev)}
                        disabled={savingDocente || loadingCursos}
                      >
                        <View style={styles.adminDocentesSelectRow}>
                          <Ionicons name="business-outline" size={16} color="#67e8f9" />
                          <Text style={[styles.selectText, styles.adminDocentesSelectText]}>{resolveColegioNombre(docenteColegioId || user?.schoolId)}</Text>
                          <Ionicons name={docenteColegioPickerOpen ? 'chevron-up-outline' : 'chevron-down-outline'} size={16} color="#a5f3fc" />
                        </View>
                      </TouchableOpacity>
                      {docenteColegioPickerOpen ? (
                        <View style={[styles.pickerList, styles.adminDocentesPickerList]}>
                          {colegiosLoading ? <Text style={styles.dataBullet}>Cargando instituciones...</Text> : null}
                          {colegiosOptions.length > 0 ? (
                            colegiosOptions.map((colegio) => (
                              <TouchableOpacity
                                key={`docente-crud-school-${colegio.id}`}
                                style={[
                                  styles.pickerItem,
                                  styles.adminDocentesPickerItem,
                                  String(docenteColegioId) === String(colegio.id) && styles.adminDocentesPickerItemActive
                                ]}
                                onPress={() => handleSelectDocenteCrudColegio(colegio.id)}
                              >
                                <Text style={[styles.dataItem, styles.adminDocentesPickerText]}>{colegio.nombre || `Colegio ${colegio.id}`}</Text>
                              </TouchableOpacity>
                            ))
                          ) : (
                            <Text style={styles.dataBullet}>No hay instituciones disponibles</Text>
                          )}
                        </View>
                      ) : null}
                    </View>
                  ) : null}

                  <View style={[styles.dataBox, styles.adminDocentesPanel]}>
                    <View style={styles.courseActionsRow}>
                      <View style={styles.adminDocentesSectionTitleRow}>
                        <Ionicons name="school-outline" size={17} color="#67e8f9" />
                        <Text style={styles.adminDocentesSectionTitle}>Docentes de la institucion</Text>
                      </View>
                      {docentesLoading ? <Text style={styles.dataBullet}>Cargando...</Text> : null}
                    </View>
                    <View style={[styles.docentesSearchBox, styles.adminDocentesSearchBox]}>
                      <Text style={styles.fieldLabel}>Filtrar docentes</Text>
                      <View style={[styles.docentesSearchInputWrap, styles.adminDocentesSearchInputWrap]}>
                        <Ionicons name="search-outline" size={16} color="#67e8f9" />
                        <TextInput
                          style={[styles.docentesSearchInput, styles.adminDocentesSearchInput]}
                          placeholder="Nombre, correo, curso o materia"
                          placeholderTextColor="#7dd3fc"
                          value={adminDocentesSearchTerm}
                          onChangeText={setAdminDocentesSearchTerm}
                        />
                        {adminDocentesSearchTerm ? (
                          <Pressable onPress={() => setAdminDocentesSearchTerm('')} style={[styles.docentesSearchClearBtn, styles.adminDocentesClearBtn]}>
                            <Ionicons name="close-circle" size={18} color="#a5f3fc" />
                          </Pressable>
                        ) : null}
                      </View>
                    </View>

                    {docentes.length === 0 && !docentesLoading ? (
                      <Text style={styles.dataBullet}>No hay docentes registrados para esta institucion.</Text>
                    ) : adminDocentesFiltrados.length === 0 ? (
                      <Text style={styles.dataBullet}>No hay docentes que coincidan con el filtro.</Text>
                    ) : (
                      adminDocentesFiltrados.map((docenteItem) => (
                        <View key={`crud-inline-docente-${docenteItem.id}`} style={[styles.docenteInlineCard, styles.adminDocenteInlineCard]}>
                          <View style={styles.adminDocenteInlineHeader}>
                            <View style={styles.adminDocenteAvatar}>
                              <Ionicons name="person-outline" size={18} color="#ecfeff" />
                            </View>
                            <View style={styles.adminDocenteInlineTitleBlock}>
                              <Text style={styles.docenteInlineName}>{docenteItem.nombre || docenteItem.email || `Docente ${docenteItem.id}`}</Text>
                              {docenteItem.email ? <Text style={styles.docenteInlineMeta}>Correo: {docenteItem.email}</Text> : null}
                            </View>
                          </View>
                          <View style={[styles.adminDocenteMetaGrid, isMobileApp && styles.adminDocenteMetaGridMobile]}>
                            <Text style={[styles.adminDocenteMetaPill, isMobileApp && styles.adminDocenteMetaPillMobile]}>Nivel: {getNivelLabel(docenteItem?.nivel)}</Text>
                            <Text style={[styles.adminDocenteMetaPill, isMobileApp && styles.adminDocenteMetaPillMobile]}>Sede: {resolveSedeNombre(docenteItem?.sedeId)}</Text>
                          </View>
                          <Text style={styles.docenteInlineMeta}>
                            Cursos: {Array.isArray(docenteItem.cursos) && docenteItem.cursos.length ? docenteItem.cursos.map((curso) => curso?.nombre || `Curso ${curso?.id}`).join(', ') : 'Sin cursos asignados'}
                          </Text>
                          <Text style={styles.docenteInlineMeta}>
                            Materias: {Array.isArray(docenteItem.cursos) && docenteItem.cursos.length
                              ? docenteItem.cursos
                                .flatMap((curso) => {
                                  const cursoNombre = curso?.nombre || `Curso ${curso?.id}`;
                                  const materias = Array.isArray(curso?.materias) ? curso.materias.filter(Boolean) : [];
                                  if (!materias.length) return [`${cursoNombre}: sin materias`];
                                  return [`${cursoNombre}: ${materias.join(', ')}`];
                                })
                                .join(' | ')
                              : 'Sin materias asignadas'}
                          </Text>
                          <View style={[styles.docenteInlineActions, isMobileApp && styles.docenteInlineActionsMobile]}>
                            <TouchableOpacity
                              style={[styles.smallBtn, styles.infoBtn, styles.adminDocenteActionBtn, styles.adminDocenteResetBtn, isMobileApp && styles.adminDocenteResetBtnMobile]}
                              onPress={() => handleResetDocentePassword(docenteItem)}
                              disabled={savingDocente}
                            >
                              <View style={[styles.btnRow, isMobileApp && styles.adminDocenteResetBtnRowMobile]}>
                                <Ionicons name="key-outline" size={14} color="#ecfeff" />
                                <Text style={[styles.smallBtnText, styles.adminDocenteActionText, isMobileApp && styles.adminDocenteActionTextMobile]}>Clave</Text>
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.smallBtn, styles.updateBtn, styles.adminDocenteActionBtn, styles.adminDocenteEditBtn, isMobileApp && styles.adminDocenteInlineActionBtnMobile]}
                              onPress={() => openAdminDocenteEditModal(docenteItem)}
                              disabled={savingDocente}
                            >
                              <View style={[styles.btnRow, isMobileApp && styles.adminDocenteActionRowMobile]}>
                                <Ionicons name="create-outline" size={14} color="#ecfeff" />
                                <Text style={[styles.smallBtnText, styles.adminDocenteActionText, isMobileApp && styles.adminDocenteActionTextMobile]}>Editar</Text>
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.smallBtn, styles.deleteBtn, styles.adminDocenteActionBtn, styles.adminDocenteDeleteBtn, isMobileApp && styles.adminDocenteInlineActionBtnMobile]}
                              onPress={() => askDeleteDocente(docenteItem)}
                              disabled={savingDocente}
                            >
                              <View style={[styles.btnRow, isMobileApp && styles.adminDocenteActionRowMobile]}>
                                <Ionicons name="trash-outline" size={14} color="#fff1f2" />
                                <Text style={[styles.smallBtnText, styles.adminDocenteActionText, isMobileApp && styles.adminDocenteActionTextMobile, isMobileApp && styles.adminDocenteDeleteTextMobile]}>Eliminar</Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))
                    )}
                  </View>
                </View>
              ) : (
                <View style={styles.courseForm}>
                  <View style={styles.dataBox}>
                    <Text style={styles.dataTitle}>{docenteEditing ? 'Editar docente' : 'Nuevo docente'}</Text>
                    <TextInput
                      style={styles.courseInput}
                      placeholder="Nombre completo"
                      placeholderTextColor="#9ca3af"
                      value={docenteForm.nombre}
                      onChangeText={(txt) => setDocenteForm((prev) => ({ ...prev, nombre: sanitizeDocenteNombreInput(txt) }))}
                    />
                    <TextInput
                      style={styles.courseInput}
                      placeholder="Correo"
                      placeholderTextColor="#9ca3af"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      value={docenteForm.email}
                      onChangeText={(txt) => setDocenteForm((prev) => ({ ...prev, email: normalizeDocenteEmailInput(txt) }))}
                    />
                    <View style={styles.passwordInputWrap}>
                      <TextInput
                        style={[styles.courseInput, styles.passwordInput]}
                        placeholder={docenteEditing ? 'Nueva contrasena (opcional)' : 'Contrasena'}
                        placeholderTextColor="#9ca3af"
                        secureTextEntry={!showDocentePassword}
                        value={docenteForm.password}
                        onChangeText={(txt) => setDocenteForm((prev) => ({ ...prev, password: txt }))}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      <TouchableOpacity
                        style={styles.passwordEyeBtn}
                        onPress={() => setShowDocentePassword((prev) => !prev)}
                        disabled={savingDocente}
                      >
                        <Ionicons name={showDocentePassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#e5e7eb" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {docenteError ? <Text style={[styles.errorText, { marginTop: 4 }]}>{docenteError}</Text> : null}

                  <View style={[styles.courseFormActions, styles.docenteCreateActions]}>
                    {docenteEditing ? (
                      <TouchableOpacity
                        style={[styles.smallBtn, styles.outlineBtn, styles.docenteEditCancelBtnMobile, savingDocente && { opacity: 0.6 }]}
                        onPress={resetDocenteFormState}
                        disabled={savingDocente}
                      >
                        <View style={styles.btnRow}>
                          <Ionicons name="close-outline" size={14} color="#e5e7eb" />
                          <Text style={[styles.smallBtnText, styles.docenteEditCancelTextMobile]}>Cancelar edicion</Text>
                        </View>
                      </TouchableOpacity>
                    ) : null}
                    <TouchableOpacity
                      style={[styles.smallBtn, styles.infoBtn, styles.docenteCreateOptionBtn, savingDocente && { opacity: 0.6 }]}
                      onPress={openDocenteNivelConfigModal}
                      disabled={savingDocente}
                    >
                      <View style={[styles.btnRow, styles.docenteCreateSaveRow]}>
                        <Ionicons name="school-outline" size={14} color="#e5e7eb" />
                        <Text style={[styles.smallBtnText, styles.docenteCreateOptionText]}>Nivel docente</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.smallBtn, styles.updateBtn, styles.docenteCreateOptionBtn, savingDocente && { opacity: 0.6 }]}
                      onPress={() => openDocenteCursosConfigModal('create')}
                      disabled={savingDocente}
                    >
                      <View style={[styles.btnRow, styles.docenteCreateSaveRow]}>
                        <Ionicons name="library-outline" size={14} color="#e5e7eb" />
                        <Text style={[styles.smallBtnText, styles.docenteCreateOptionText]}>Asignar cursos</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.smallBtn, styles.createBtn, styles.docenteCreateSaveBtn, savingDocente && { opacity: 0.6 }]}
                      onPress={handleSaveDocente}
                      disabled={savingDocente}
                    >
                      <View style={[styles.btnRow, styles.docenteCreateSaveRow]}>
                        <Ionicons name="save-outline" size={14} color="#e5e7eb" />
                        <Text style={[styles.smallBtnText, styles.docenteCreateSaveText]}>
                          {savingDocente ? 'Guardando...' : docenteEditing ? 'Actualizar' : 'Crear'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="fade"
        visible={adminDocenteEditModalVisible}
        onRequestClose={closeAdminDocenteEditModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, styles.docenteEditModalCard]}>
            <View style={styles.modalHeader}>
              <View style={styles.docenteEditHeaderTitle}>
                <Text style={styles.rectorEditEyebrow}>Docente</Text>
                <Text style={styles.periodTitle}>Editar docente</Text>
              </View>
              <Pressable onPress={closeAdminDocenteEditModal} style={styles.closeBtn}>
                <View style={styles.btnRow}>
                  <Ionicons name="close-outline" size={16} color="#fecaca" />
                  <Text style={styles.closeBtnText}>Cerrar</Text>
                </View>
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.docenteEditHero}>
                <View style={styles.docenteEditIconWrap}>
                  <Ionicons name="person-outline" size={25} color="#dbeafe" />
                </View>
                <View style={styles.rectorCourseEditHeroCopy}>
                  <Text style={styles.rectorCourseEditHeroTitle}>{docenteEditing?.nombre || docenteEditing?.email || 'Docente'}</Text>
                  <Text style={styles.rectorCourseEditHeroMeta}>
                    {getNivelLabel(docenteEditing?.nivel)} · {resolveSedeNombre(docenteEditing?.sedeId)}
                  </Text>
                </View>
              </View>
              <View style={styles.courseForm}>
                <TextInput
                  style={styles.courseInput}
                  placeholder="Nombre completo"
                  placeholderTextColor="#9ca3af"
                  value={docenteForm.nombre}
                  onChangeText={(txt) => setDocenteForm((prev) => ({ ...prev, nombre: sanitizeDocenteNombreInput(txt) }))}
                />
                <TextInput
                  style={styles.courseInput}
                  placeholder="Correo"
                  placeholderTextColor="#9ca3af"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={docenteForm.email}
                  onChangeText={(txt) => setDocenteForm((prev) => ({ ...prev, email: normalizeDocenteEmailInput(txt) }))}
                />
                <View style={styles.passwordInputWrap}>
                  <TextInput
                    style={[styles.courseInput, styles.passwordInput]}
                    placeholder="Nueva contrasena (opcional)"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showDocentePassword}
                    value={docenteForm.password}
                    onChangeText={(txt) => setDocenteForm((prev) => ({ ...prev, password: txt }))}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    style={styles.passwordEyeBtn}
                    onPress={() => setShowDocentePassword((prev) => !prev)}
                    disabled={savingDocente}
                  >
                    <Ionicons name={showDocentePassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#e5e7eb" />
                  </TouchableOpacity>
                </View>
                {docenteError ? <Text style={[styles.errorText, { marginTop: 4 }]}>{docenteError}</Text> : null}

                <View style={[styles.docenteSummaryCard, styles.adminDocenteSummaryCard]}>
                  <View style={styles.docenteSummaryHeader}>
                    <Text style={styles.docenteSummaryName}>Cursos y materias</Text>
                    <Text style={styles.docenteSummaryEmail}>
                      {docenteCursos.length > 0
                        ? `${docenteCursos.length} curso${docenteCursos.length === 1 ? '' : 's'} seleccionado${docenteCursos.length === 1 ? '' : 's'}`
                        : 'Sin cursos asignados'}
                    </Text>
                  </View>
                  {docenteCursos.length > 0 ? (
                    <View style={styles.docenteCursoList}>
                      {docenteCursos
                        .map((cursoId) => docenteCursosDisponibles.find((curso) => String(curso?.id) === String(cursoId)))
                        .filter(Boolean)
                        .map((curso) => (
                          <View key={`docente-edit-resumen-curso-${curso.id}`} style={styles.docenteCursoChip}>
                            <Text style={styles.docenteCursoChipTitle}>{curso?.nombre || `Curso ${curso?.id}`}</Text>
                            <Text style={styles.docenteCursoChipMeta}>
                              {parseMateriasTexto(docenteMateriasDraft?.[curso.id]).length
                                ? parseMateriasTexto(docenteMateriasDraft?.[curso.id]).join(', ')
                                : 'Sin materias'}
                            </Text>
                          </View>
                        ))}
                    </View>
                  ) : null}
                  <TouchableOpacity
                    style={[styles.smallBtn, styles.updateBtn, styles.docenteCreateOptionBtn, savingDocente && { opacity: 0.6 }]}
                    onPress={() => openDocenteCursosConfigModal('edit')}
                    disabled={savingDocente || loadingCursos}
                  >
                    <View style={[styles.btnRow, styles.docenteCreateSaveRow]}>
                      <Ionicons name="library-outline" size={14} color="#e5e7eb" />
                      <Text style={[styles.smallBtnText, styles.docenteCreateOptionText]}>Cursos y materias</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.docenteCourseChecklist}>
                  {loadingCursos ? (
                    <Text style={styles.dataBullet}>Cargando cursos...</Text>
                  ) : docenteCursosDisponibles.length === 0 ? (
                    <Text style={styles.dataBullet}>No hay cursos disponibles para asignar.</Text>
                  ) : (
                    docenteCursosDisponibles.map((curso) => {
                      const isSelected = docenteCursos.includes(curso.id);
                      return (
                        <TouchableOpacity
                          key={`docente-edit-curso-option-${curso.id}`}
                          style={[styles.docenteCourseOption, isSelected && styles.docenteCourseOptionActive]}
                          onPress={() => toggleDocenteCurso(curso.id)}
                          disabled={savingDocente}
                          activeOpacity={0.85}
                        >
                          <Ionicons
                            name={isSelected ? 'checkbox-outline' : 'square-outline'}
                            size={20}
                            color={isSelected ? '#60a5fa' : '#cbd5e1'}
                          />
                          <View style={styles.docenteCourseOptionCopyMobile}>
                            <Text
                              style={[styles.docenteCourseOptionText, styles.docenteCourseOptionTextMobile, isSelected && styles.docenteCourseOptionTextActive]}
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {`${curso?.nombre || `Curso ${curso?.id}`} · ${getNivelShortLabel(curso?.nivel)}`}
                            </Text>
                            <Text style={styles.docenteCourseOptionMetaMobile} numberOfLines={2} ellipsizeMode="tail">
                              {`Sede: ${resolveSedeNombre(curso?.sedeId)}`}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })
                  )}
                </View>

                {docenteCursos.length > 0 ? (
                  <View style={styles.docenteMateriasByCursoWrap}>
                    <Text style={styles.fieldLabel}>Materias por curso</Text>
                    {docenteCursos
                      .map((cursoId) => docenteCursosDisponibles.find((curso) => String(curso?.id) === String(cursoId)))
                      .filter(Boolean)
                      .map((curso) => (
                        <View key={`docente-edit-materias-curso-${curso.id}`} style={styles.docenteMateriaCursoItem}>
                          <Text style={styles.docenteMateriaCursoLabel}>{curso?.nombre || `Curso ${curso?.id}`}</Text>
                          <TextInput
                            style={[styles.courseInput, styles.docenteMateriaCursoInput]}
                            placeholder="Ej: Matematicas, Etica"
                            placeholderTextColor="#94a3b8"
                            value={docenteMateriasDraft?.[curso.id] || ''}
                            onChangeText={(txt) => updateDocenteMateriaDraft(curso.id, txt)}
                            onBlur={(event) => commitDocenteMateriaDraft(curso.id, event?.nativeEvent?.text)}
                            editable={!savingDocente}
                            multiline
                          />
                          <Text style={styles.docenteMateriaCursoHint}>Separa varias materias con coma.</Text>
                        </View>
                      ))}
                  </View>
                ) : null}

                <View style={[styles.courseFormActions, styles.docenteEditActionsCentered]}>
                  <TouchableOpacity
                    style={[styles.smallBtn, styles.outlineBtn, styles.docenteEditCancelBtnMobile, savingDocente && { opacity: 0.6 }]}
                    onPress={closeAdminDocenteEditModal}
                    disabled={savingDocente}
                  >
                    <View style={styles.btnRow}>
                      <Ionicons name="close-outline" size={14} color="#e5e7eb" />
                      <Text style={[styles.smallBtnText, styles.docenteEditCancelTextMobile]}>Cancelar</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.smallBtn, styles.createBtn, styles.docenteEditUpdateBtnMobile, savingDocente && { opacity: 0.6 }]}
                    onPress={handleSaveDocente}
                    disabled={savingDocente}
                  >
                    <View style={styles.btnRow}>
                      <Ionicons name="save-outline" size={14} color="#e5e7eb" />
                      <Text style={styles.smallBtnText}>{savingDocente ? 'Guardando...' : 'Actualizar'}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="slide"
        visible={docenteCrudListModalVisible}
        onRequestClose={closeDocenteCrudListModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, styles.docentesModalCard]}>
            <View style={[styles.modalHeader, styles.adminDocentesModalHeader]}>
              <View style={styles.adminDocentesTitleBlock}>
                <View style={styles.adminDocentesIconWrap}>
                  <Ionicons name="people-circle-outline" size={22} color="#ecfeff" />
                </View>
                <View style={styles.adminDocentesTitleCopy}>
                  <Text style={styles.adminDocentesEyebrow}>Listado</Text>
                  <Text style={styles.adminDocentesTitle}>Docentes del colegio</Text>
                </View>
              </View>
              <Pressable onPress={closeDocenteCrudListModal} style={[styles.closeBtn, styles.adminDocentesCloseBtn]}>
                <View style={styles.btnRow}>
                  <Ionicons name="close-outline" size={16} color="#fecaca" />
                  <Text style={styles.closeBtnText}>Cerrar</Text>
                </View>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={[styles.modalContent, styles.adminDocentesModalContent]} showsVerticalScrollIndicator={false}>
              <View style={styles.adminDocentesSchoolBadge}>
                <Ionicons name="business-outline" size={16} color="#67e8f9" />
                <Text style={styles.adminDocentesSchoolBadgeText}>{resolveColegioNombre(docenteColegioId || user?.schoolId)}</Text>
              </View>
              <View style={[styles.dataBox, styles.adminDocentesPanel]}>
                <View style={styles.courseActionsRow}>
                  <View style={styles.adminDocentesSectionTitleRow}>
                    <Ionicons name="school-outline" size={17} color="#67e8f9" />
                    <Text style={styles.adminDocentesSectionTitle}>Docentes del colegio</Text>
                  </View>
                  {docentesLoading ? <Text style={styles.dataBullet}>Cargando...</Text> : null}
                </View>
                <View style={[styles.docentesSearchBox, styles.adminDocentesSearchBox]}>
                  <Text style={styles.fieldLabel}>Buscar docente</Text>
                  <View style={[styles.docentesSearchInputWrap, styles.adminDocentesSearchInputWrap]}>
                    <Ionicons name="search-outline" size={16} color="#67e8f9" />
                    <TextInput
                      style={[styles.docentesSearchInput, styles.adminDocentesSearchInput]}
                      placeholder="Escribe nombre o apellido"
                      placeholderTextColor="#7dd3fc"
                      value={docentesSearchTerm}
                      onFocus={() => setDocentesSearchOpen(true)}
                      onChangeText={(text) => {
                        setDocentesSearchTerm(text);
                        setDocentesSearchOpen(Boolean(text.trim()));
                      }}
                    />
                    {docentesSearchTerm ? (
                      <Pressable
                        onPress={() => {
                          setDocentesSearchTerm('');
                          setDocentesSearchOpen(false);
                        }}
                        style={[styles.docentesSearchClearBtn, styles.adminDocentesClearBtn]}
                      >
                        <Ionicons name="close-circle" size={18} color="#a5f3fc" />
                      </Pressable>
                    ) : null}
                  </View>

                  {docentesSearchOpen && docentesSearchNormalized ? (
                    <View style={[styles.docentesSearchSuggestions, styles.adminDocentesSuggestions]}>
                      {docentesSearchSuggestions.length > 0 ? (
                        docentesSearchSuggestions.map((docente) => (
                          <TouchableOpacity
                            key={`crud-docente-suggestion-${docente.id}`}
                            style={styles.docentesSearchSuggestionItem}
                            onPress={() => {
                              setDocentesSearchTerm(docente?.nombre || '');
                              setDocentesSearchOpen(false);
                            }}
                          >
                            <Text style={styles.docentesSearchSuggestionName}>{docente?.nombre || `Docente ${docente?.id}`}</Text>
                            {docente?.email ? <Text style={styles.docentesSearchSuggestionMeta}>{docente.email}</Text> : null}
                          </TouchableOpacity>
                        ))
                      ) : (
                        <Text style={styles.docentesSearchEmpty}>No hay coincidencias</Text>
                      )}
                    </View>
                  ) : null}
                </View>

                {docentes.length === 0 && !docentesLoading ? (
                  <Text style={styles.dataBullet}>- Aun no hay docentes</Text>
                ) : docentesFiltrados.length === 0 ? (
                  <Text style={styles.dataBullet}>- No hay docentes que coincidan con la busqueda</Text>
                ) : (
                  docentesFiltrados.map((d) => (
                    <View key={d.id} style={[styles.docenteSummaryCard, styles.adminDocenteSummaryCard]}>
                      <View style={[styles.docenteSummaryTopRow, isMobileApp && styles.docenteSummaryTopRowMobile]}>
                        <View style={[styles.docenteSummaryHeader, isMobileApp && styles.docenteSummaryHeaderMobile]}>
                          <Text style={styles.docenteSummaryName}>{d.nombre || d.email || `Docente ${d.id}`}</Text>
                          {d.email ? <Text style={styles.docenteSummaryEmail}>{d.email}</Text> : null}
                          <Text style={styles.docenteSummaryEmail}>Nivel: {getNivelLabel(d?.nivel)}</Text>
                          <Text style={styles.docenteSummaryEmail}>Sede: {resolveSedeNombre(d?.sedeId)}</Text>
                        </View>
                        <View style={[styles.docenteSummaryActions, isMobileApp && styles.docenteSummaryActionsMobile]}>
                          <TouchableOpacity
                            style={[styles.smallBtn, styles.updateBtn, styles.adminDocenteActionBtn, styles.adminDocenteEditBtn, isMobileApp && styles.docenteSummaryActionBtnMobile]}
                            onPress={() => {
                              closeDocenteCrudListModal();
                              setTimeout(() => openAdminDocenteEditModal(d, { returnToList: true }), 0);
                            }}
                          >
                            <View style={styles.btnRow}>
                              <Ionicons name="create-outline" size={14} color="#ecfeff" />
                              <Text style={[styles.smallBtnText, styles.adminDocenteActionText]}>Editar</Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.smallBtn, styles.deleteBtn, styles.adminDocenteActionBtn, styles.adminDocenteDeleteBtn, isMobileApp && styles.docenteSummaryActionBtnMobile]}
                            onPress={() => askDeleteDocente(d)}
                          >
                            <View style={styles.btnRow}>
                              <Ionicons name="trash-outline" size={14} color="#fff1f2" />
                              <Text style={[styles.smallBtnText, styles.adminDocenteActionText]}>Eliminar</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={styles.docenteCursoList}>
                        {d.cursos && d.cursos.length ? (
                          sortCursosForDisplay(d.cursos).map((c) => (
                            <View key={c.id} style={styles.docenteCursoChip}>
                              <Text style={styles.docenteCursoChipTitle}>{c.nombre || `Curso ${c.id}`}</Text>
                              <Text style={styles.docenteCursoChipMeta}>
                                {Array.isArray(c.materias) && c.materias.length ? `Materias: ${c.materias.join(', ')}` : 'Sin materias asignadas'}
                              </Text>
                            </View>
                          ))
                        ) : (
                          <View style={styles.docenteCursoChipEmpty}>
                            <Text style={styles.docenteCursoChipMeta}>Sin cursos asignados</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  ))
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="slide"
        visible={docentesModalVisible}
        onRequestClose={closeDocentesModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, styles.docentesModalCard]}>
            <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={styles.periodTitle}>Docentes del colegio</Text>
                <Pressable onPress={closeDocentesModal} style={styles.closeBtn}>
                  <View style={styles.btnRow}>
                    <Ionicons name="close-outline" size={16} color="#fecaca" />
                    <Text style={styles.closeBtnText}>Cerrar</Text>
                  </View>
                </Pressable>
              </View>

              <Text style={styles.fieldLabel}>Colegio: <Text style={styles.dataValue}>{colegioSeleccionadoNombre}</Text></Text>
              <View style={styles.dataBox}>
                <Text style={styles.fieldLabel}>Selecciona colegio</Text>
                {colegiosOptions.length > 0 ? (
                  <TouchableOpacity
                    style={[styles.selectBox, { marginBottom: 8 }]}
                    onPress={() => setColegioPickerOpen((prev) => !prev)}
                    disabled={docentesLoading || colegiosLoading}
                  >
                    <Text style={styles.selectText}>{colegiosLoading ? 'Cargando colegios...' : colegioSeleccionadoNombre}</Text>
                  </TouchableOpacity>
                ) : null}

                {colegioPickerOpen && colegiosOptions.length > 0 ? (
                  <View style={styles.pickerList}>
                    {colegiosOptions.map((c) => (
                      <TouchableOpacity
                        key={c.id}
                        style={[styles.pickerItem, String(colegioSeleccionado) === String(c.id) && styles.pickerItemActive]}
                        onPress={async () => {
                          setColegioPickerOpen(false);
                          setColegioSeleccionado(c.id);
                          await loadDocentesColegio(c.id);
                        }}
                      >
                        <Text style={styles.dataItem}>{c.nombre || `Colegio ${c.id}`}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : null}

                {docentesError ? <Text style={styles.errorText}>{docentesError}</Text> : null}

                <View style={styles.docentesSearchBox}>
                  <Text style={styles.fieldLabel}>Buscar docente</Text>
                  <View style={styles.docentesSearchInputWrap}>
                    <Ionicons name="search-outline" size={16} color="#94a3b8" />
                    <TextInput
                      style={styles.docentesSearchInput}
                      placeholder="Escribe nombre o apellido"
                      placeholderTextColor="#94a3b8"
                      value={docentesSearchTerm}
                      onFocus={() => setDocentesSearchOpen(true)}
                      onChangeText={(text) => {
                        setDocentesSearchTerm(text);
                        setDocentesSearchOpen(Boolean(text.trim()));
                      }}
                    />
                    {docentesSearchTerm ? (
                      <Pressable
                        onPress={() => {
                          setDocentesSearchTerm('');
                          setDocentesSearchOpen(false);
                        }}
                        style={styles.docentesSearchClearBtn}
                      >
                        <Ionicons name="close-circle" size={16} color="#94a3b8" />
                      </Pressable>
                    ) : null}
                  </View>

                  {docentesSearchOpen && docentesSearchNormalized ? (
                    <View style={styles.docentesSearchSuggestions}>
                      {docentesSearchSuggestions.length > 0 ? (
                        docentesSearchSuggestions.map((docente) => (
                          <TouchableOpacity
                            key={`suggestion-${docente.id}`}
                            style={styles.docentesSearchSuggestionItem}
                            onPress={() => {
                              setDocentesSearchTerm(docente?.nombre || '');
                              setDocentesSearchOpen(false);
                            }}
                          >
                            <Text style={styles.docentesSearchSuggestionName}>{docente?.nombre || `Docente ${docente?.id}`}</Text>
                            {docente?.email ? <Text style={styles.docentesSearchSuggestionMeta}>{docente.email}</Text> : null}
                          </TouchableOpacity>
                        ))
                      ) : (
                        <Text style={styles.docentesSearchEmpty}>No hay coincidencias</Text>
                      )}
                    </View>
                  ) : null}
                </View>

                <View style={styles.docentesOverviewSection}>
                  <Text style={styles.dataTitle}>Docentes y cursos</Text>
                  {docentesLoading ? (
                    <Text style={styles.dataBullet}>Cargando docentes...</Text>
                  ) : docentes.length === 0 ? (
                    <Text style={styles.dataBullet}>- Sin docentes para este colegio</Text>
                  ) : docentesFiltrados.length === 0 ? (
                    <Text style={styles.dataBullet}>- No hay docentes que coincidan con la busqueda</Text>
                  ) : (
                    docentesFiltrados.map((d) => (
                      <View key={d.id} style={styles.docenteSummaryCard}>
                        <View style={styles.docenteSummaryHeader}>
                          <Text style={styles.docenteSummaryName}>{d.nombre || d.email || `Docente ${d.id}`}</Text>
                          {d.email ? <Text style={styles.docenteSummaryEmail}>{d.email}</Text> : null}
                        </View>
                        <View style={styles.docenteCursoList}>
                          {d.cursos && d.cursos.length > 0 ? (
                            sortCursosForDisplay(d.cursos).map((c) => (
                              <View key={c.id} style={styles.docenteCursoChip}>
                                <Text style={styles.docenteCursoChipTitle}>
                                  {c.nombre}{c.grado ? ` ${c.grado}` : ''}
                                </Text>
                                <Text style={styles.docenteCursoChipMeta}>
                                  {Array.isArray(c.materias) && c.materias.length ? `Materias: ${c.materias.join(', ')}` : 'Sin materias asignadas'}
                                </Text>
                              </View>
                            ))
                          ) : (
                            <View style={styles.docenteCursoChipEmpty}>
                              <Text style={styles.docenteCursoChipMeta}>Sin cursos asignados</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    ))
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
