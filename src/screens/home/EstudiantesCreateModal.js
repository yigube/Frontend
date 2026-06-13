import React from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EstudiantesCreateModal({
  visible,
  onClose,
  styles,
  loadingCursos,
  savingEstudiante,
  estudianteCreateCursoPickerOpen,
  setEstudianteCreateCursoPickerOpen,
  estudianteCreateCursoNombre,
  cursosAsignados,
  estudianteCreateCursoId,
  changeEstudianteCreateCurso,
  estudianteCreateMateriasDisponibles,
  estudianteCreateMaterias,
  normalizeMateriaOption,
  toggleEstudianteCreateMateria,
  estudianteCreateForm,
  setEstudianteCreateForm,
  handleImportCsv,
  selectedCsvFile,
  downloadExcelTemplate,
  downloadingTemplate,
  estudianteCreateError,
  uploadedStudents,
  handleCreateEstudiante
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
            <Text style={styles.periodTitle}>Agregar estudiante</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <View style={styles.btnRow}>
                <Ionicons name="close-outline" size={16} color="#fecaca" />
                <Text style={styles.closeBtnText}>Cerrar</Text>
              </View>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={styles.fieldLabel}>Curso</Text>
            <TouchableOpacity
              style={[styles.selectBoxFull, { marginBottom: 6 }]}
              onPress={() => setEstudianteCreateCursoPickerOpen((prev) => !prev)}
              disabled={loadingCursos || savingEstudiante}
            >
              <Text style={styles.selectText}>{loadingCursos ? 'Cargando cursos...' : estudianteCreateCursoNombre}</Text>
            </TouchableOpacity>
            {estudianteCreateCursoPickerOpen ? (
              <View style={styles.dropdownList}>
                {cursosAsignados.length === 0 ? (
                  <Text style={[styles.dataBullet, { padding: 12 }]}>No hay cursos disponibles</Text>
                ) : (
                  cursosAsignados.map((c) => (
                    <TouchableOpacity
                      key={c.id}
                      style={[styles.dropdownItem, String(estudianteCreateCursoId) === String(c.id) && styles.dropdownItemSelected]}
                      onPress={() => changeEstudianteCreateCurso(c.id)}
                    >
                      <Text style={styles.selectText}>{c.nombre || `Curso ${c.id}`}</Text>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            ) : null}

            <Text style={styles.fieldLabel}>Materias del curso</Text>
            <View style={styles.estudianteMateriaSelectorBox}>
              {loadingCursos ? (
                <Text style={styles.dataBullet}>Cargando materias...</Text>
              ) : estudianteCreateCursoId && estudianteCreateMateriasDisponibles.length > 0 ? (
                <>
                  <Text style={styles.dataBullet}>Selecciona una o varias materias correspondientes a este curso.</Text>
                  <View style={styles.estudianteMateriaChipWrap}>
                    {estudianteCreateMateriasDisponibles.map((materia) => {
                      const isSelected = estudianteCreateMaterias.some((item) => normalizeMateriaOption(item) === normalizeMateriaOption(materia));
                      return (
                        <TouchableOpacity
                          key={`estudiante-materia-${estudianteCreateCursoId}-${materia}`}
                          style={[styles.estudianteMateriaChip, isSelected && styles.estudianteMateriaChipActive]}
                          onPress={() => toggleEstudianteCreateMateria(materia)}
                          disabled={savingEstudiante}
                        >
                          <Text style={[styles.estudianteMateriaChipText, isSelected && styles.estudianteMateriaChipTextActive]}>
                            {materia}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </>
              ) : (
                <Text style={styles.dataBullet}>No hay materias asignadas para el curso seleccionado.</Text>
              )}
            </View>

            <TextInput
              style={styles.courseInput}
              placeholder="Nombres"
              placeholderTextColor="#9ca3af"
              value={estudianteCreateForm.nombres}
              editable={!savingEstudiante}
              onChangeText={(v) => setEstudianteCreateForm((prev) => ({ ...prev, nombres: v }))}
            />
            <TextInput
              style={styles.courseInput}
              placeholder="Apellidos"
              placeholderTextColor="#9ca3af"
              value={estudianteCreateForm.apellidos}
              editable={!savingEstudiante}
              onChangeText={(v) => setEstudianteCreateForm((prev) => ({ ...prev, apellidos: v }))}
            />
            <TextInput
              style={styles.courseInput}
              placeholder="Codigo del estudiante"
              placeholderTextColor="#9ca3af"
              value={estudianteCreateForm.codigoEstudiante}
              editable={!savingEstudiante}
              onChangeText={(v) => setEstudianteCreateForm((prev) => ({ ...prev, codigoEstudiante: v }))}
            />
            <Text style={styles.dataBullet}>El codigo QR se genera automaticamente al guardar.</Text>
            <TouchableOpacity
              style={[styles.smallBtn, styles.outlineBtn, savingEstudiante && { opacity: 0.6 }]}
              onPress={handleImportCsv}
              disabled={savingEstudiante}
            >
              <View style={styles.btnRow}>
                <Ionicons name="document-attach-outline" size={14} color="#e5e7eb" />
                <Text style={styles.smallBtnText}>{savingEstudiante ? 'Procesando...' : 'Subir plantilla'}</Text>
              </View>
            </TouchableOpacity>
            {selectedCsvFile ? (
              <Text style={styles.dataBullet}>Archivo: {selectedCsvFile.name}</Text>
            ) : (
              <Text style={styles.dataBullet}>Archivo: no seleccionado</Text>
            )}
            <TouchableOpacity
              style={[styles.smallBtn, styles.infoBtn, (savingEstudiante || downloadingTemplate) && { opacity: 0.6 }]}
              onPress={downloadExcelTemplate}
              disabled={savingEstudiante || downloadingTemplate}
            >
              <View style={styles.btnRow}>
                <Ionicons name="download-outline" size={14} color="#e5e7eb" />
                <Text style={styles.smallBtnText}>{downloadingTemplate ? 'Descargando...' : 'Descargar plantilla'}</Text>
              </View>
            </TouchableOpacity>
            {estudianteCreateError ? <Text style={[styles.dataBullet, { color: '#fca5a5' }]}>{estudianteCreateError}</Text> : null}

            {uploadedStudents.length > 0 ? (
              <View style={styles.uploadedStudentsBox}>
                <View style={styles.uploadedStudentsHeader}>
                  <View style={styles.uploadedStudentsHeaderLeft}>
                    <View style={styles.uploadedStudentsHeaderIconWrap}>
                      <Ionicons name="people-outline" size={14} color="#93c5fd" />
                    </View>
                    <Text style={styles.uploadedStudentsTitle}>Estudiantes cargados</Text>
                  </View>
                  <View style={styles.uploadedStudentsCountBadge}>
                    <Text style={styles.uploadedStudentsCountText}>{uploadedStudents.length}</Text>
                  </View>
                </View>
                <ScrollView
                  style={styles.uploadedStudentsList}
                  contentContainerStyle={styles.uploadedStudentsListContent}
                  showsVerticalScrollIndicator={false}
                >
                  {uploadedStudents.map((s, idx) => (
                    <View key={`${s.id || 'new'}-${idx}`} style={styles.uploadedStudentsItem}>
                      <Text style={styles.uploadedStudentsItemName}>{`${s.nombres || ''} ${s.apellidos || ''}`.trim()}</Text>
                      <Text style={styles.uploadedStudentsItemMeta}>
                        {s.codigoEstudiante ? `Codigo: ${s.codigoEstudiante}` : 'Codigo: -'}
                      </Text>
                      <Text style={styles.uploadedStudentsItemMeta}>
                        {s.qr ? `QR: ${s.qr}` : 'QR generado'}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            ) : null}

            <View style={styles.courseFormActions}>
              <TouchableOpacity
                style={[styles.smallBtn, styles.createBtn, savingEstudiante && { opacity: 0.6 }]}
                onPress={handleCreateEstudiante}
                disabled={savingEstudiante}
              >
                <View style={styles.btnRow}>
                  <Ionicons name="save-outline" size={14} color="#e5e7eb" />
                  <Text style={styles.smallBtnText}>{savingEstudiante ? 'Guardando...' : 'Guardar estudiante'}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
