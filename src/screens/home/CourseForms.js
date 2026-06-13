import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function CourseForm({
  styles,
  variant = 'admin',
  title,
  inputStyle,
  nombre,
  setNombre,
  nivel,
  setNivel,
  nivelPickerOpen,
  setNivelPickerOpen,
  sedeId,
  setSedeId,
  sedePickerOpen,
  setSedePickerOpen,
  sedesDisponibles,
  sedesLoading,
  savingCurso,
  nivelOptions,
  getNivelLabel,
  resolveSedeNombre,
  onCancel,
  onSave
}) {
  const isRectorVariant = variant === 'rector';
  const formStyle = isRectorVariant ? styles.rectorCourseForm : styles.adminCourseForm;
  const formActionsStyle = isRectorVariant ? styles.rectorCourseFormActions : styles.adminCourseFormActions;
  const cancelButtonStyle = isRectorVariant
    ? [styles.smallBtn, styles.outlineBtn, styles.rectorCancelBtn, styles.rectorPairedActionBtn, savingCurso && { opacity: 0.6 }]
    : [styles.smallBtn, styles.outlineBtn, savingCurso && { opacity: 0.6 }];
  const saveButtonStyle = isRectorVariant
    ? [styles.smallBtn, styles.createBtn, styles.rectorPairedActionBtn, savingCurso && { opacity: 0.6 }]
    : [styles.smallBtn, styles.createBtn, savingCurso && { opacity: 0.6 }];
  const cancelRowStyle = isRectorVariant ? [styles.btnRow, styles.rectorCancelRow] : styles.btnRow;
  const saveRowStyle = isRectorVariant ? [styles.btnRow, styles.rectorPairedActionRow] : styles.btnRow;
  const cancelTextStyle = isRectorVariant
    ? [styles.smallBtnText, styles.rectorCancelText]
    : styles.smallBtnText;
  const cancelIconColor = isRectorVariant ? '#fecaca' : '#e5e7eb';

  return (
    <View style={formStyle}>
      <Text style={styles.fieldLabel}>{title}</Text>
      <TextInput
        style={inputStyle}
        placeholder="Nombre del curso"
        placeholderTextColor="#9ca3af"
        value={nombre}
        editable={!savingCurso}
        onChangeText={setNombre}
      />
      <Text style={styles.fieldLabel}>Nivel</Text>
      <TouchableOpacity
        style={styles.selectBoxFull}
        onPress={() => {
          setNivelPickerOpen((prev) => !prev);
          setSedePickerOpen(false);
        }}
        disabled={savingCurso}
      >
        <Text style={styles.selectText}>{nivel ? getNivelLabel(nivel) : 'Sin nivel'}</Text>
      </TouchableOpacity>
      {nivelPickerOpen ? (
        <View style={styles.pickerList}>
          <TouchableOpacity
            style={[styles.pickerItem, !nivel && styles.pickerItemActive]}
            onPress={() => {
              setNivel('');
              setNivelPickerOpen(false);
            }}
          >
            <Text style={styles.dataItem}>Sin nivel</Text>
          </TouchableOpacity>
          {nivelOptions.map((option) => (
            <TouchableOpacity
              key={`${variant}-curso-nivel-${option.value}`}
              style={[styles.pickerItem, nivel === option.value && styles.pickerItemActive]}
              onPress={() => {
                setNivel(option.value);
                setNivelPickerOpen(false);
              }}
            >
              <Text style={styles.dataItem}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
      <Text style={styles.fieldLabel}>Sede</Text>
      <TouchableOpacity
        style={styles.selectBoxFull}
        onPress={() => {
          setSedePickerOpen((prev) => !prev);
          setNivelPickerOpen(false);
        }}
        disabled={savingCurso || sedesLoading}
      >
        <Text style={styles.selectText}>{sedeId ? resolveSedeNombre(sedeId) : 'Sin sede'}</Text>
      </TouchableOpacity>
      {sedePickerOpen ? (
        <View style={styles.pickerList}>
          <TouchableOpacity
            style={[styles.pickerItem, !sedeId && styles.pickerItemActive]}
            onPress={() => {
              setSedeId(null);
              setSedePickerOpen(false);
            }}
          >
            <Text style={styles.dataItem}>Sin sede</Text>
          </TouchableOpacity>
          {sedesDisponibles.map((sede) => (
            <TouchableOpacity
              key={`${variant}-curso-sede-${sede.id}`}
              style={[styles.pickerItem, Number(sedeId) === Number(sede.id) && styles.pickerItemActive]}
              onPress={() => {
                setSedeId(sede.id);
                setSedePickerOpen(false);
              }}
            >
              <Text style={styles.dataItem}>{sede.nombre}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
      <View style={formActionsStyle}>
        <TouchableOpacity
          style={cancelButtonStyle}
          onPress={onCancel}
          disabled={savingCurso}
        >
          <View style={cancelRowStyle}>
            <Ionicons name="close-outline" size={14} color={cancelIconColor} />
            <Text style={cancelTextStyle}>Cancelar</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={saveButtonStyle}
          onPress={onSave}
          disabled={savingCurso}
        >
          <View style={saveRowStyle}>
            <Ionicons name="save-outline" size={14} color="#e5e7eb" />
            <Text style={styles.smallBtnText}>{savingCurso ? 'Guardando...' : 'Guardar'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function AdminCursoForm(props) {
  const { styles, adminCursoEditing } = props;
  return (
    <CourseForm
      {...props}
      variant="admin"
      title={adminCursoEditing ? 'Actualizar curso' : 'Nuevo curso'}
      inputStyle={styles.adminCourseInput}
      nombre={props.adminCursoNombre}
      setNombre={props.setAdminCursoNombre}
      nivel={props.adminCursoNivel}
      setNivel={props.setAdminCursoNivel}
      nivelPickerOpen={props.adminCursoNivelPickerOpen}
      setNivelPickerOpen={props.setAdminCursoNivelPickerOpen}
      sedeId={props.adminCursoSedeId}
      setSedeId={props.setAdminCursoSedeId}
      sedePickerOpen={props.adminCursoSedePickerOpen}
      setSedePickerOpen={props.setAdminCursoSedePickerOpen}
      onCancel={props.closeAdminCursoForm}
      onSave={props.handleSaveAdminCurso}
    />
  );
}

export function RectorCursoForm(props) {
  const { styles, rectorCursoEditing } = props;
  return (
    <CourseForm
      {...props}
      variant="rector"
      title={rectorCursoEditing ? 'Actualizar curso' : 'Nuevo curso'}
      inputStyle={styles.rectorCourseInput}
      nombre={props.rectorCursoNombre}
      setNombre={props.setRectorCursoNombre}
      nivel={props.rectorCursoNivel}
      setNivel={props.setRectorCursoNivel}
      nivelPickerOpen={props.rectorCursoNivelPickerOpen}
      setNivelPickerOpen={props.setRectorCursoNivelPickerOpen}
      sedeId={props.rectorCursoSedeId}
      setSedeId={props.setRectorCursoSedeId}
      sedePickerOpen={props.rectorCursoSedePickerOpen}
      setSedePickerOpen={props.setRectorCursoSedePickerOpen}
      onCancel={props.closeRectorCursoForm}
      onSave={props.handleSaveRectorCurso}
    />
  );
}

export function SedeForm({
  styles,
  sedeEditing,
  sedeNombre,
  setSedeNombre,
  savingSede,
  sedeError,
  closeSedeForm,
  handleSaveSede
}) {
  return (
    <View style={styles.rectorCourseForm}>
      <Text style={styles.fieldLabel}>{sedeEditing ? 'Actualizar sede' : 'Nueva sede'}</Text>
      <TextInput
        style={styles.rectorCourseInput}
        placeholder="Nombre de la sede"
        placeholderTextColor="#9ca3af"
        value={sedeNombre}
        editable={!savingSede}
        onChangeText={setSedeNombre}
      />
      {sedeError ? <Text style={styles.errorText}>{sedeError}</Text> : null}
      <View style={styles.rectorCourseFormActions}>
        <TouchableOpacity
          style={[styles.smallBtn, styles.outlineBtn, styles.rectorCancelBtn, styles.rectorPairedActionBtn, savingSede && { opacity: 0.6 }]}
          onPress={closeSedeForm}
          disabled={savingSede}
        >
          <View style={[styles.btnRow, styles.rectorCancelRow]}>
            <Ionicons name="close-outline" size={14} color="#fecaca" />
            <Text style={[styles.smallBtnText, styles.rectorCancelText]}>Cancelar</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.smallBtn, styles.createBtn, styles.rectorPairedActionBtn, savingSede && { opacity: 0.6 }]}
          onPress={handleSaveSede}
          disabled={savingSede}
        >
          <View style={[styles.btnRow, styles.rectorPairedActionRow]}>
            <Ionicons name="save-outline" size={14} color="#e5e7eb" />
            <Text style={styles.smallBtnText}>{savingSede ? 'Guardando...' : 'Guardar sede'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
