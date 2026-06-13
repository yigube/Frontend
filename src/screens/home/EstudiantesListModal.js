import React from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EstudiantesListModal({
  visible,
  onClose,
  styles,
  resolveColegioNombre,
  estudiantesColegioId,
  setEstudiantesColegioPickerOpen,
  estudiantesColegioPickerOpen,
  colegiosLoading,
  colegiosOptions,
  changeEstudiantesColegio,
  cursoSeleccionadoNombre,
  setCursoPickerOpen,
  cursoPickerOpen,
  loadingCursos,
  cursosAsignados,
  cursoSeleccionado,
  selectCursoEstudiantes,
  estudiantesMateriasDisponibles,
  setEstudianteMateriaPickerOpen,
  estudianteMateriaPickerOpen,
  estudianteMateriaFiltro,
  ALL_MATERIAS_OPTION,
  setEstudianteMateriaFiltro,
  normalizeMateriaOption,
  downloadingQrZip,
  downloadEstudiantesQrZip,
  estudiantesLoading,
  estudiantesError,
  estudiantesFiltrados,
  qrZipProgress,
  estudianteEditing,
  estudianteEditForm,
  setEstudianteEditForm,
  savingEstudianteEdit,
  toggleEstudianteEditMateria,
  handleUpdateEstudiante,
  cancelEditEstudiante,
  startEditEstudiante,
  askDeleteEstudiante
}) {
  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={[styles.modalCard, styles.sharedActionModalCard]}>
          <View style={styles.modalHeader}>
            <Text style={styles.periodTitle}>Estudiantes por curso</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <View style={styles.btnRow}>
                <Ionicons name="close-outline" size={16} color="#fecaca" />
                <Text style={styles.closeBtnText}>Cerrar</Text>
              </View>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.fieldLabel}>Selecciona colegio</Text>
            <Pressable
              style={styles.selectBoxFull}
              onPress={() => setEstudiantesColegioPickerOpen((prev) => !prev)}
            >
              <Text style={styles.selectText}>{resolveColegioNombre(estudiantesColegioId)}</Text>
            </Pressable>
            {estudiantesColegioPickerOpen ? (
              <View style={styles.dropdownList}>
                {colegiosLoading ? <Text style={styles.dataBullet}>Cargando colegios...</Text> : null}
                {colegiosOptions.length === 0 ? (
                  <Text style={styles.dataBullet}>No hay colegios disponibles</Text>
                ) : (
                  colegiosOptions.map((c) => (
                    <Pressable
                      key={c.id}
                      style={[styles.dropdownItem, String(estudiantesColegioId) === String(c.id) && styles.dropdownItemSelected]}
                      onPress={async () => {
                        await changeEstudiantesColegio(c.id);
                      }}
                    >
                      <Text style={styles.dataItem}>{c.nombre || `Colegio ${c.id}`}</Text>
                    </Pressable>
                  ))
                )}
              </View>
            ) : null}

            <Text style={styles.fieldLabel}>Selecciona un curso</Text>
            <Pressable style={styles.selectBoxFull} onPress={() => setCursoPickerOpen((prev) => !prev)}>
              <Text style={styles.selectText}>{cursoSeleccionadoNombre}</Text>
            </Pressable>
            {cursoPickerOpen ? (
              <View style={styles.dropdownList}>
                {loadingCursos ? <Text style={styles.dataBullet}>Cargando cursos...</Text> : null}
                {cursosAsignados.length === 0 ? (
                  <Text style={styles.dataBullet}>No tienes cursos asignados</Text>
                ) : (
                  cursosAsignados.map((c) => (
                    <Pressable
                      key={c.id}
                      style={[styles.dropdownItem, cursoSeleccionado === c.id && styles.dropdownItemSelected]}
                      onPress={() => selectCursoEstudiantes(c.id)}
                    >
                      <Text style={styles.dataItem}>{c.nombre}</Text>
                    </Pressable>
                  ))
                )}
              </View>
            ) : null}

            <Text style={styles.fieldLabel}>Selecciona una materia</Text>
            <Pressable
              style={[styles.selectBoxFull, !estudiantesMateriasDisponibles.length && { opacity: 0.65 }]}
              onPress={() => {
                if (!estudiantesMateriasDisponibles.length) return;
                setEstudianteMateriaPickerOpen((prev) => !prev);
              }}
            >
              <Text style={styles.selectText}>
                {estudianteMateriaFiltro === ALL_MATERIAS_OPTION ? 'Todas las materias' : estudianteMateriaFiltro}
              </Text>
            </Pressable>
            {estudianteMateriaPickerOpen ? (
              <View style={styles.dropdownList}>
                <Pressable
                  style={[styles.dropdownItem, estudianteMateriaFiltro === ALL_MATERIAS_OPTION && styles.dropdownItemSelected]}
                  onPress={() => {
                    setEstudianteMateriaFiltro(ALL_MATERIAS_OPTION);
                    setEstudianteMateriaPickerOpen(false);
                  }}
                >
                  <Text style={styles.dataItem}>Todas las materias</Text>
                </Pressable>
                {estudiantesMateriasDisponibles.length === 0 ? (
                  <Text style={styles.dataBullet}>No hay materias configuradas para este curso</Text>
                ) : (
                  estudiantesMateriasDisponibles.map((materia) => (
                    <Pressable
                      key={`estudiante-materia-${materia}`}
                      style={[
                        styles.dropdownItem,
                        normalizeMateriaOption(estudianteMateriaFiltro) === normalizeMateriaOption(materia) && styles.dropdownItemSelected
                      ]}
                      onPress={() => {
                        setEstudianteMateriaFiltro(materia);
                        setEstudianteMateriaPickerOpen(false);
                      }}
                    >
                      <Text style={styles.dataItem}>{materia}</Text>
                    </Pressable>
                  ))
                )}
              </View>
            ) : null}

            <View style={styles.dataBox}>
              <View style={styles.assignedCoursesHeader}>
                <Text style={styles.dataTitle}>Cursos asignados al docente</Text>
                <View style={styles.assignedCoursesBadge}>
                  <Text style={styles.assignedCoursesBadgeText}>{loadingCursos ? '...' : `${cursosAsignados.length}`}</Text>
                </View>
              </View>
              <Text style={styles.dataBullet}>
                Solo se muestran los cursos que tienes asignados y desde aqui puedes cambiar rapido entre ellos.
              </Text>
              {loadingCursos ? (
                <Text style={styles.dataBullet}>Cargando cursos asignados...</Text>
              ) : cursosAsignados.length === 0 ? (
                <Text style={styles.dataBullet}>No tienes cursos asignados en este momento.</Text>
              ) : (
                <View style={styles.assignedCoursesWrap}>
                  {cursosAsignados.map((curso) => (
                    <Pressable
                      key={`curso-asignado-${curso.id}`}
                      style={[styles.assignedCourseChip, String(cursoSeleccionado) === String(curso.id) && styles.assignedCourseChipActive]}
                      onPress={() => selectCursoEstudiantes(curso.id)}
                    >
                      <Text
                        style={[styles.assignedCourseChipText, String(cursoSeleccionado) === String(curso.id) && styles.assignedCourseChipTextActive]}
                      >
                        {curso.nombre}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.dataBox}>
              <View style={styles.studentsHeaderRow}>
                <Text style={styles.dataTitle}>Estudiantes</Text>
                <TouchableOpacity
                  style={[styles.smallBtn, styles.infoBtn, downloadingQrZip && { opacity: 0.6 }]}
                  onPress={downloadEstudiantesQrZip}
                  disabled={downloadingQrZip || estudiantesLoading || estudiantesFiltrados.length === 0}
                >
                  <View style={styles.btnRow}>
                    <Ionicons name="download-outline" size={14} color="#e5e7eb" />
                    <Text style={styles.smallBtnText}>
                      {downloadingQrZip ? `Descargando ZIP... ${Math.max(1, Math.min(100, qrZipProgress))}%` : 'Descargar QR (ZIP)'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <Text style={styles.dataBullet}>
                {estudianteMateriaFiltro === ALL_MATERIAS_OPTION
                  ? 'Puedes ver todo el curso o filtrar por una materia especifica.'
                  : `Mostrando estudiantes de la materia ${estudianteMateriaFiltro}.`}
              </Text>
              {estudiantesLoading ? (
                <Text style={styles.dataBullet}>Cargando estudiantes...</Text>
              ) : estudiantesError ? (
                <Text style={[styles.dataBullet, { color: '#fca5a5' }]}>{estudiantesError}</Text>
              ) : estudiantesFiltrados.length === 0 ? (
                <Text style={styles.dataBullet}>
                  {estudianteMateriaFiltro === ALL_MATERIAS_OPTION
                    ? 'No hay estudiantes asignados'
                    : 'No hay estudiantes asignados a la materia seleccionada'}
                </Text>
              ) : (
                estudiantesFiltrados.map((e) => (
                  <View key={e.id} style={styles.estudianteRowCard}>
                    <View style={styles.estudianteRowContent}>
                      {String(estudianteEditing) === String(e.id) ? (
                        <View style={[styles.courseForm, { marginBottom: 0 }]}>
                          <TextInput
                            style={styles.courseInput}
                            value={estudianteEditForm.nombres}
                            onChangeText={(value) => setEstudianteEditForm((prev) => ({ ...prev, nombres: value }))}
                            placeholder="Nombres"
                            placeholderTextColor="#94a3b8"
                            editable={!savingEstudianteEdit}
                          />
                          <TextInput
                            style={styles.courseInput}
                            value={estudianteEditForm.apellidos}
                            onChangeText={(value) => setEstudianteEditForm((prev) => ({ ...prev, apellidos: value }))}
                            placeholder="Apellidos"
                            placeholderTextColor="#94a3b8"
                            editable={!savingEstudianteEdit}
                          />
                          <TextInput
                            style={styles.courseInput}
                            value={estudianteEditForm.qr}
                            onChangeText={(value) => setEstudianteEditForm((prev) => ({ ...prev, qr: value }))}
                            placeholder="Codigo QR"
                            placeholderTextColor="#94a3b8"
                            editable={!savingEstudianteEdit}
                          />
                          <TextInput
                            style={styles.courseInput}
                            value={estudianteEditForm.codigoEstudiante}
                            onChangeText={(value) => setEstudianteEditForm((prev) => ({ ...prev, codigoEstudiante: value }))}
                            placeholder="Codigo del estudiante"
                            placeholderTextColor="#94a3b8"
                            editable={!savingEstudianteEdit}
                          />
                          <Text style={[styles.dataBullet, { marginTop: 4, marginBottom: 8, fontWeight: '700' }]}>Materias del estudiante</Text>
                          <View style={styles.estudianteMateriaSelectorBox}>
                            {estudiantesMateriasDisponibles.length > 0 ? (
                              <>
                                <Text style={styles.dataBullet}>Selecciona una o varias materias correspondientes a este curso.</Text>
                                <View style={styles.estudianteMateriaChipWrap}>
                                  {estudiantesMateriasDisponibles.map((materia) => {
                                    const isSelected = (Array.isArray(estudianteEditForm.materias) ? estudianteEditForm.materias : [])
                                      .some((item) => normalizeMateriaOption(item) === normalizeMateriaOption(materia));
                                    return (
                                      <Pressable
                                        key={`estudiante-edit-materia-${e.id}-${materia}`}
                                        style={[styles.estudianteMateriaChip, isSelected && styles.estudianteMateriaChipActive]}
                                        onPress={() => toggleEstudianteEditMateria(materia)}
                                      >
                                        <Text style={[styles.estudianteMateriaChipText, isSelected && styles.estudianteMateriaChipTextActive]}>
                                          {materia}
                                        </Text>
                                      </Pressable>
                                    );
                                  })}
                                </View>
                              </>
                            ) : (
                              <Text style={styles.dataBullet}>No hay materias configuradas para este curso.</Text>
                            )}
                          </View>
                        </View>
                      ) : (
                        <>
                          <Text style={styles.estudianteRowName}>
                            {e.nombre || `${e.nombres || ''} ${e.apellidos || ''}`.trim()}
                          </Text>
                          {e.codigoEstudiante ? <Text style={styles.estudianteRowMeta}>Codigo: {e.codigoEstudiante}</Text> : null}
                          <Text style={styles.estudianteRowMeta}>QR: {e.qr}</Text>
                          <Text style={styles.estudianteRowMeta}>
                            Materias: {Array.isArray(e.materias) && e.materias.length ? e.materias.join(', ') : 'Sin materias asignadas'}
                          </Text>
                        </>
                      )}
                    </View>
                    <View style={styles.estudianteRowActions}>
                      {String(estudianteEditing) === String(e.id) ? (
                        <>
                          <TouchableOpacity
                            style={[styles.smallBtn, styles.outlineBtn, styles.estudianteRowActionBtn, savingEstudianteEdit && { opacity: 0.6 }]}
                            onPress={cancelEditEstudiante}
                            disabled={savingEstudianteEdit}
                          >
                            <View style={styles.btnRow}>
                              <Ionicons name="close-outline" size={14} color="#e5e7eb" />
                              <Text style={styles.smallBtnText}>Cancelar</Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.smallBtn, styles.createBtn, styles.estudianteRowActionBtn, savingEstudianteEdit && { opacity: 0.6 }]}
                            onPress={() => handleUpdateEstudiante(e.id)}
                            disabled={savingEstudianteEdit}
                          >
                            <View style={styles.btnRow}>
                              <Ionicons name="save-outline" size={14} color="#e5e7eb" />
                              <Text style={styles.smallBtnText}>{savingEstudianteEdit ? 'Guardando...' : 'Guardar'}</Text>
                            </View>
                          </TouchableOpacity>
                        </>
                      ) : (
                        <>
                          <TouchableOpacity
                            style={[styles.smallBtn, styles.updateBtn, styles.estudianteRowActionBtn]}
                            onPress={() => startEditEstudiante(e)}
                          >
                            <View style={styles.btnRow}>
                              <Ionicons name="create-outline" size={14} color="#e5e7eb" />
                              <Text style={styles.smallBtnText}>Actualizar</Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.smallBtn, styles.deleteBtn, styles.estudianteRowActionBtn]}
                            onPress={() => askDeleteEstudiante(e)}
                          >
                            <View style={styles.btnRow}>
                              <Ionicons name="trash-outline" size={14} color="#e5e7eb" />
                              <Text style={styles.smallBtnText}>Eliminar</Text>
                            </View>
                          </TouchableOpacity>
                        </>
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
  );
}
