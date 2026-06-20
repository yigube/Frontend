import React from 'react';
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AdminCursoForm, RectorCursoForm, SedeForm } from './CourseForms';

export default function CursosModals({
  styles,
  adminCursosModalVisible,
  rectorCursosModalVisible,
  rectorSedesModalVisible,
  closeCursosModal,
  closeRectorSedesModal,
  loadingCursos,
  openAdminCursoForm,
  cursoCrudColegioId,
  user,
  resolveColegioNombre,
  cursoCrudPickerOpen,
  setCursoCrudPickerOpen,
  colegiosLoading,
  colegiosOptions,
  changeCursoCrudColegio,
  savingSede,
  openSedeForm,
  sedeFormVisible,
  sedeForm,
  sedesLoading,
  sedesDisponibles,
  askDeleteSede,
  sortCursosForDisplay,
  cursosAsignados,
  getNivelLabel,
  resolveSedeNombre,
  askDeleteCurso,
  adminCursoFormVisible,
  adminCursoFormProps,
  openRectorCursoForm,
  rectorCursoFormVisible,
  rectorCursoFormProps,
  sedeFormProps
}) {
  return (
    <>
      <Modal
        transparent
        animationType="slide"
        visible={adminCursosModalVisible}
        onRequestClose={closeCursosModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, styles.cursoModalCard]}>
            <ScrollView
              contentContainerStyle={[styles.modalContent, styles.cursoModalContent]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.modalHeader}>
                <Text style={styles.periodTitle}>Cursos (Administrador)</Text>
                <Pressable onPress={closeCursosModal} style={styles.closeBtn}>
                  <View style={styles.btnRow}>
                    <Ionicons name="close-outline" size={16} color="#fecaca" />
                    <Text style={styles.closeBtnText}>Cerrar</Text>
                  </View>
                </Pressable>
              </View>

              <View style={styles.courseActionsRow}>
                <TouchableOpacity style={[styles.smallBtn, styles.createBtn]} onPress={() => openAdminCursoForm()}>
                  <View style={styles.btnRow}>
                    <Ionicons name="add-outline" size={14} color="#e5e7eb" />
                    <Text style={styles.smallBtnText}>Nuevo</Text>
                  </View>
                </TouchableOpacity>
                {loadingCursos ? <Text style={styles.dataBullet}>Cargando...</Text> : null}
              </View>

              <View style={{ marginBottom: 10 }}>
                <Text style={styles.fieldLabel}>Colegio</Text>
                <TouchableOpacity
                  style={[styles.selectBoxFull, { marginTop: 6 }]}
                  onPress={() => setCursoCrudPickerOpen((prev) => !prev)}
                  disabled={loadingCursos || colegiosLoading}
                >
                  <Text style={styles.selectText}>{resolveColegioNombre(cursoCrudColegioId || user?.schoolId)}</Text>
                </TouchableOpacity>
                {cursoCrudPickerOpen && colegiosOptions.length > 0 ? (
                  <View style={styles.pickerList}>
                    {colegiosOptions.map((c) => (
                      <TouchableOpacity
                        key={c.id}
                        style={[styles.pickerItem, String(cursoCrudColegioId) === String(c.id) && styles.pickerItemActive]}
                        onPress={async () => {
                          await changeCursoCrudColegio(c.id);
                        }}
                      >
                        <Text style={styles.dataItem}>{c.nombre || `Colegio ${c.id}`}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : null}
              </View>

              <View style={styles.dataBox}>
                <View style={styles.courseActionsRow}>
                  <Text style={styles.dataTitle}>Sedes</Text>
                  <TouchableOpacity
                    style={[styles.smallBtn, styles.createBtn, savingSede && { opacity: 0.6 }]}
                    onPress={() => openSedeForm()}
                    disabled={savingSede}
                  >
                    <View style={styles.btnRow}>
                      <Ionicons name="add-outline" size={14} color="#e5e7eb" />
                      <Text style={styles.smallBtnText}>Nueva sede</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                {sedeFormVisible ? <SedeForm {...sedeFormProps} /> : null}
                {sedesLoading ? (
                  <Text style={styles.dataBullet}>Cargando sedes...</Text>
                ) : sedesDisponibles.length === 0 ? (
                  <Text style={styles.dataBullet}>Sin sedes registradas.</Text>
                ) : (
                  sedesDisponibles.map((sede) => (
                    <View key={`admin-sede-${sede.id}`} style={[styles.adminCourseRow, styles.adminCourseCardRow]}>
                      <View style={styles.adminCourseRowContent}>
                        <Text style={styles.adminCourseRowTitle}>{sede.nombre}</Text>
                      </View>
                      <View style={styles.adminCourseRowActions}>
                        <TouchableOpacity
                          style={[styles.smallBtn, styles.adminCourseActionBtn, styles.updateBtn]}
                          onPress={() => openSedeForm(sede)}
                          disabled={savingSede}
                        >
                          <View style={styles.btnRow}>
                            <Ionicons name="create-outline" size={14} color="#e5e7eb" />
                            <Text style={styles.smallBtnText}>Editar</Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.smallBtn, styles.adminCourseActionBtn, styles.deleteBtn]}
                          onPress={() => askDeleteSede(sede)}
                          disabled={savingSede}
                        >
                          <View style={styles.btnRow}>
                            <Ionicons name="trash-outline" size={14} color="#e5e7eb" />
                            <Text style={styles.smallBtnText}>Eliminar</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                )}
              </View>

              {adminCursoFormVisible ? <AdminCursoForm {...adminCursoFormProps} /> : null}

              <View style={styles.dataBox}>
                <Text style={styles.dataTitle}>Lista</Text>
                {loadingCursos ? (
                  <Text style={styles.dataBullet}>Cargando cursos...</Text>
                ) : cursosAsignados.length === 0 ? (
                  <Text style={styles.dataBullet}>- No hay cursos</Text>
                ) : (
                  sortCursosForDisplay(cursosAsignados).map((c) => (
                    <View key={c.id} style={[styles.adminCourseRow, styles.adminCourseCardRow]}>
                      <View style={styles.adminCourseRowContent}>
                        <Text style={styles.adminCourseRowTitle}>{c.nombre}</Text>
                        {c.grado ? <Text style={styles.dataBullet}>Grado: {c.grado}</Text> : null}
                        <Text style={styles.dataBullet}>Nivel: {getNivelLabel(c?.nivel)}</Text>
                        <Text style={styles.dataBullet}>Sede: {resolveSedeNombre(c?.sedeId)}</Text>
                      </View>
                      <View style={styles.adminCourseRowActions}>
                        <TouchableOpacity style={[styles.smallBtn, styles.adminCourseActionBtn, styles.updateBtn]} onPress={() => openAdminCursoForm(c)}>
                          <View style={styles.btnRow}>
                            <Ionicons name="create-outline" size={14} color="#e5e7eb" />
                            <Text style={styles.smallBtnText}>Editar</Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.smallBtn, styles.adminCourseActionBtn, styles.deleteBtn]} onPress={() => askDeleteCurso(c)}>
                          <View style={styles.btnRow}>
                            <Ionicons name="trash-outline" size={14} color="#e5e7eb" />
                            <Text style={styles.smallBtnText}>Eliminar</Text>
                          </View>
                        </TouchableOpacity>
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
        visible={rectorSedesModalVisible}
        onRequestClose={closeRectorSedesModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, styles.rectorSedesModalCard]}>
            <ScrollView
              contentContainerStyle={[styles.modalContent, styles.cursoModalContent]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.modalHeader}>
                <Text style={[styles.periodTitle, styles.modalHeaderTitle]}>Sedes</Text>
                <Pressable onPress={closeRectorSedesModal} style={styles.closeBtn}>
                  <View style={styles.btnRow}>
                    <Ionicons name="close-outline" size={16} color="#fecaca" />
                    <Text style={styles.closeBtnText}>Cerrar</Text>
                  </View>
                </Pressable>
              </View>

              <View style={styles.dataBox}>
                <View style={styles.rectorSedesHeaderRow}>
                  <Text style={styles.dataTitle}>Lista de sedes</Text>
                  <TouchableOpacity
                    style={[styles.smallBtn, styles.createBtn, savingSede && { opacity: 0.6 }]}
                    onPress={() => openSedeForm()}
                    disabled={savingSede}
                  >
                    <View style={styles.btnRow}>
                      <Ionicons name="add-outline" size={14} color="#e5e7eb" />
                      <Text style={styles.smallBtnText}>Nueva sede</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {sedeFormVisible ? <SedeForm {...sedeFormProps} /> : null}

                {sedesLoading ? (
                  <Text style={styles.dataBullet}>Cargando sedes...</Text>
                ) : sedesDisponibles.length === 0 ? (
                  <Text style={styles.dataBullet}>Sin sedes registradas.</Text>
                ) : (
                  sedesDisponibles.map((sede) => (
                    <View key={`rector-sede-${sede.id}`} style={[styles.rectorCourseRow, styles.rectorCourseCardRow]}>
                      <View style={styles.rectorCourseRowContent}>
                        <Text style={styles.rectorCourseRowTitle}>{sede.nombre}</Text>
                      </View>
                      <View style={styles.rectorCourseRowActions}>
                        <TouchableOpacity
                          style={[styles.smallBtn, styles.rectorCourseActionBtn, styles.updateBtn]}
                          onPress={() => openSedeForm(sede)}
                          disabled={savingSede}
                        >
                          <View style={styles.btnRow}>
                            <Ionicons name="create-outline" size={14} color="#e5e7eb" />
                            <Text style={styles.smallBtnText}>Editar</Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.smallBtn, styles.rectorCourseActionBtn, styles.deleteBtn]}
                          onPress={() => askDeleteSede(sede)}
                          disabled={savingSede}
                        >
                          <View style={styles.btnRow}>
                            <Ionicons name="trash-outline" size={14} color="#e5e7eb" />
                            <Text style={styles.smallBtnText}>Eliminar</Text>
                          </View>
                        </TouchableOpacity>
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
        visible={rectorCursosModalVisible}
        onRequestClose={closeCursosModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, styles.cursoModalCard]}>
            <ScrollView
              contentContainerStyle={[styles.modalContent, styles.cursoModalContent]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.modalHeader}>
                <Text style={[styles.periodTitle, styles.modalHeaderTitle]}>Cursos (Rector / Coordinador)</Text>
                <View style={styles.modalHeaderActions}>
                  <Pressable onPress={closeCursosModal} style={styles.closeBtn}>
                    <View style={styles.btnRow}>
                      <Ionicons name="close-outline" size={16} color="#fecaca" />
                      <Text style={styles.closeBtnText}>Cerrar</Text>
                    </View>
                  </Pressable>
                </View>
              </View>

              <View style={styles.dataBox}>
                <View style={styles.rectorCoursesListHeaderRow}>
                  <Text style={styles.dataTitle}>Lista</Text>
                  <TouchableOpacity style={[styles.smallBtn, styles.createBtn, styles.rectorCourseCreateBtn]} onPress={() => openRectorCursoForm()}>
                    <View style={styles.btnRow}>
                      <Ionicons name="add-outline" size={14} color="#e5e7eb" />
                      <Text style={styles.smallBtnText}>Crear cursos</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                {rectorCursoFormVisible ? <RectorCursoForm {...rectorCursoFormProps} /> : null}
                {loadingCursos ? (
                  <Text style={styles.dataBullet}>Cargando cursos...</Text>
                ) : cursosAsignados.length === 0 ? (
                  <Text style={styles.dataBullet}>- No hay cursos</Text>
                ) : (
                  sortCursosForDisplay(cursosAsignados).map((c) => (
                    <React.Fragment key={c.id}>
                      <View style={[styles.rectorCourseRow, styles.rectorCourseCardRow]}>
                        <View style={styles.rectorCourseRowContent}>
                          <Text style={styles.rectorCourseRowTitle}>{c.nombre}</Text>
                          {c.grado ? <Text style={styles.dataBullet}>Grado: {c.grado}</Text> : null}
                          <Text style={styles.dataBullet}>Nivel: {getNivelLabel(c?.nivel)}</Text>
                          <Text style={styles.dataBullet}>Sede: {resolveSedeNombre(c?.sedeId)}</Text>
                        </View>
                        <View style={styles.rectorCourseRowActions}>
                          <TouchableOpacity style={[styles.smallBtn, styles.rectorCourseActionBtn, styles.updateBtn]} onPress={() => openRectorCursoForm(c)}>
                            <View style={styles.btnRow}>
                              <Ionicons name="create-outline" size={14} color="#e5e7eb" />
                              <Text style={styles.smallBtnText}>Editar</Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.smallBtn, styles.rectorCourseActionBtn, styles.deleteBtn]} onPress={() => askDeleteCurso(c)}>
                            <View style={styles.btnRow}>
                              <Ionicons name="trash-outline" size={14} color="#e5e7eb" />
                              <Text style={styles.smallBtnText}>Eliminar</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </React.Fragment>
                  ))
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
