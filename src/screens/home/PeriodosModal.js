import React from 'react';
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createDefaultPeriodForm } from './homeUtils';

export default function PeriodosModal({
  visible,
  onClose,
  styles,
  periodModalScrollRef,
  editingPeriodo,
  isRectorCoordinador,
  canAdminFilterPeriodSchools,
  periodSchoolId,
  periodSchoolPickerOpen,
  setPeriodSchoolPickerOpen,
  setPeriodSchoolId,
  setEditingPeriodo,
  colegiosLoading,
  colegiosOptions,
  resolveColegioNombre,
  periodForm,
  setPeriodForm,
  periodos,
  periodFeedback,
  setPeriodFeedback,
  days,
  months,
  years,
  hours,
  minutes,
  monthNames,
  adjustValue,
  cycleValue,
  savingPeriodo,
  handleSavePeriod,
  formatPeriodSummary,
  formatPeriodDate,
  formatPeriodTime,
  getPeriodDurationLabel,
  openPeriodModal,
  askDeletePeriod
}) {
  const periodTitle = String(periodForm?.nombre || editingPeriodo?.nombre || `Periodo ${periodos.length + 1 || 1}`).trim();
  const canShowPeriodEditor = Boolean(editingPeriodo || isRectorCoordinador || !canAdminFilterPeriodSchools || periodSchoolId);
  const periodViewLabel = isRectorCoordinador ? 'Vista directiva' : 'Vista administrador';

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={[styles.modalCard, styles.periodModalCard]}>
          <View style={[styles.modalHeader, styles.adminDocentesModalHeader]}>
            <View style={styles.adminDocentesTitleBlock}>
              <View style={styles.adminDocentesIconWrap}>
                <Ionicons name="calendar-outline" size={22} color="#ecfeff" />
              </View>
              <View style={styles.adminDocentesTitleCopy}>
                <Text style={styles.adminDocentesEyebrow}>{periodViewLabel}</Text>
                <Text style={styles.adminDocentesTitle}>Ver periodos</Text>
              </View>
            </View>
            <Pressable onPress={onClose} style={[styles.closeBtn, styles.adminDocentesCloseBtn]}>
              <View style={styles.btnRow}>
                <Ionicons name="close-outline" size={16} color="#fecaca" />
                <Text style={styles.closeBtnText}>Cerrar</Text>
              </View>
            </Pressable>
          </View>
          <ScrollView
            ref={periodModalScrollRef}
            contentContainerStyle={[styles.modalContent, styles.periodModalContent, styles.adminDocentesModalContent]}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.courseForm, styles.adminPeriodPanel]}>
              <View style={styles.adminPeriodHero}>
                <View style={styles.adminColegioAvatar}>
                  <Ionicons name={editingPeriodo ? 'create-outline' : 'calendar-number-outline'} size={20} color="#ecfeff" />
                </View>
                <View style={styles.adminDocentesTitleCopy}>
                  <Text style={styles.colegioRegisteredEyebrow}>{editingPeriodo ? 'Seleccionado' : 'Nuevo'}</Text>
                  <Text style={styles.adminColegioCreateTitle}>{editingPeriodo ? 'Actualiza las fechas' : 'Configura fechas activas'}</Text>
                </View>
              </View>

              {canAdminFilterPeriodSchools ? (
                <View style={[styles.dataBox, styles.adminPeriodSchoolBox]}>
                  <Text style={styles.fieldLabel}>Colegio para periodos</Text>
                  <Pressable
                    style={[styles.selectBoxFull, styles.adminDocentesSelectBox]}
                    onPress={() => setPeriodSchoolPickerOpen((prev) => !prev)}
                  >
                    <View style={styles.adminDocentesSelectRow}>
                      <Ionicons name="business-outline" size={16} color="#67e8f9" />
                      <Text style={[styles.selectText, styles.adminDocentesSelectText]}>
                        {periodSchoolId ? resolveColegioNombre(periodSchoolId) : 'Selecciona un colegio'}
                      </Text>
                      <Ionicons name={periodSchoolPickerOpen ? 'chevron-up-outline' : 'chevron-down-outline'} size={16} color="#a5f3fc" />
                    </View>
                  </Pressable>
                  {periodSchoolPickerOpen ? (
                    <View style={[styles.pickerList, styles.adminDocentesPickerList]}>
                      {colegiosLoading ? <Text style={styles.dataBullet}>Cargando colegios...</Text> : null}
                      {colegiosOptions.length === 0 ? (
                        <Text style={styles.dataBullet}>No hay colegios disponibles</Text>
                      ) : (
                        colegiosOptions.map((c) => (
                          <Pressable
                            key={`period-school-${c.id}`}
                            style={[styles.pickerItem, styles.adminDocentesPickerItem, String(periodSchoolId) === String(c.id) && styles.adminDocentesPickerItemActive]}
                            onPress={() => {
                              setPeriodSchoolId(c.id);
                              setEditingPeriodo(null);
                              setPeriodSchoolPickerOpen(false);
                            }}
                          >
                            <Text style={[styles.dataItem, styles.adminDocentesPickerText]}>{c.nombre || `Colegio ${c.id}`}</Text>
                          </Pressable>
                        ))
                      )}
                    </View>
                  ) : null}
                </View>
              ) : null}

              {canShowPeriodEditor ? (
                <View style={styles.adminPeriodEditBox}>
                  <View style={styles.adminPeriodFormTitleCard}>
                    <Text style={styles.adminPeriodFormTitleText} numberOfLines={1} adjustsFontSizeToFit>
                      {periodTitle}
                    </Text>
                  </View>
                  <Text style={[styles.fieldLabel, styles.adminPeriodSectionLabel]}>Inicio</Text>
                  <View style={styles.adminPeriodDateControls}>
                    <View style={styles.adminPeriodDateRow}>
                      <View style={[styles.stepper, styles.adminPeriodStepper]}>
                        <TouchableOpacity style={[styles.stepperBtn, styles.adminPeriodStepperBtn]} onPress={() => adjustValue('startDay', days, -1)}>
                          <Text style={styles.stepperText}>-</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.selectBox, styles.adminPeriodSelectBox]} onPress={() => cycleValue('startDay', days)}>
                          <Text style={[styles.selectText, styles.adminPeriodSelectText]}>{String(periodForm.startDay).padStart(2, '0')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.stepperBtn, styles.adminPeriodStepperBtn]} onPress={() => adjustValue('startDay', days, 1)}>
                          <Text style={styles.stepperText}>+</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={[styles.stepper, styles.adminPeriodStepper]}>
                        <TouchableOpacity style={[styles.stepperBtn, styles.adminPeriodStepperBtn]} onPress={() => adjustValue('startMonth', months, -1)}>
                          <Text style={styles.stepperText}>-</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.selectBox, styles.adminPeriodSelectBox, styles.adminPeriodMonthBox]} onPress={() => cycleValue('startMonth', months)}>
                          <Text style={[styles.selectText, styles.adminPeriodSelectText]} numberOfLines={1} adjustsFontSizeToFit>{monthNames[periodForm.startMonth - 1]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.stepperBtn, styles.adminPeriodStepperBtn]} onPress={() => adjustValue('startMonth', months, 1)}>
                          <Text style={styles.stepperText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.adminPeriodDateRow}>
                      <View style={[styles.stepper, styles.adminPeriodStepper]}>
                        <TouchableOpacity style={[styles.stepperBtn, styles.adminPeriodStepperBtn]} onPress={() => adjustValue('startYear', years, -1)}>
                          <Text style={styles.stepperText}>-</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.selectBox, styles.adminPeriodSelectBox]} onPress={() => cycleValue('startYear', years)}>
                          <Text style={[styles.selectText, styles.adminPeriodSelectText]}>{periodForm.startYear}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.stepperBtn, styles.adminPeriodStepperBtn]} onPress={() => adjustValue('startYear', years, 1)}>
                          <Text style={styles.stepperText}>+</Text>
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity style={[styles.selectBox, styles.adminPeriodSelectBox]} onPress={() => cycleValue('startHour', hours)}>
                        <Text style={[styles.selectText, styles.adminPeriodSelectText]}>{String(periodForm.startHour).padStart(2, '0')}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.selectBox, styles.adminPeriodSelectBox]} onPress={() => cycleValue('startMinute', minutes)}>
                        <Text style={[styles.selectText, styles.adminPeriodSelectText]}>{String(periodForm.startMinute).padStart(2, '0')}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text style={[styles.fieldLabel, styles.adminPeriodSectionLabel]}>Fin</Text>
                  <View style={styles.adminPeriodDateControls}>
                    <View style={styles.adminPeriodDateRow}>
                      <View style={[styles.stepper, styles.adminPeriodStepper]}>
                        <TouchableOpacity style={[styles.stepperBtn, styles.adminPeriodStepperBtn]} onPress={() => adjustValue('endDay', days, -1)}>
                          <Text style={styles.stepperText}>-</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.selectBox, styles.adminPeriodSelectBox]} onPress={() => cycleValue('endDay', days)}>
                          <Text style={[styles.selectText, styles.adminPeriodSelectText]}>{String(periodForm.endDay).padStart(2, '0')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.stepperBtn, styles.adminPeriodStepperBtn]} onPress={() => adjustValue('endDay', days, 1)}>
                          <Text style={styles.stepperText}>+</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={[styles.stepper, styles.adminPeriodStepper]}>
                        <TouchableOpacity style={[styles.stepperBtn, styles.adminPeriodStepperBtn]} onPress={() => adjustValue('endMonth', months, -1)}>
                          <Text style={styles.stepperText}>-</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.selectBox, styles.adminPeriodSelectBox, styles.adminPeriodMonthBox]} onPress={() => cycleValue('endMonth', months)}>
                          <Text style={[styles.selectText, styles.adminPeriodSelectText]} numberOfLines={1} adjustsFontSizeToFit>{monthNames[periodForm.endMonth - 1]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.stepperBtn, styles.adminPeriodStepperBtn]} onPress={() => adjustValue('endMonth', months, 1)}>
                          <Text style={styles.stepperText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.adminPeriodDateRow}>
                      <View style={[styles.stepper, styles.adminPeriodStepper]}>
                        <TouchableOpacity style={[styles.stepperBtn, styles.adminPeriodStepperBtn]} onPress={() => adjustValue('endYear', years, -1)}>
                          <Text style={styles.stepperText}>-</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.selectBox, styles.adminPeriodSelectBox]} onPress={() => cycleValue('endYear', years)}>
                          <Text style={[styles.selectText, styles.adminPeriodSelectText]}>{periodForm.endYear}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.stepperBtn, styles.adminPeriodStepperBtn]} onPress={() => adjustValue('endYear', years, 1)}>
                          <Text style={styles.stepperText}>+</Text>
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity style={[styles.selectBox, styles.adminPeriodSelectBox]} onPress={() => cycleValue('endHour', hours)}>
                        <Text style={[styles.selectText, styles.adminPeriodSelectText]}>{String(periodForm.endHour).padStart(2, '0')}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.selectBox, styles.adminPeriodSelectBox]} onPress={() => cycleValue('endMinute', minutes)}>
                        <Text style={[styles.selectText, styles.adminPeriodSelectText]}>{String(periodForm.endMinute).padStart(2, '0')}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.adminPeriodEditActions}>
                    {editingPeriodo ? (
                      <TouchableOpacity
                        style={[styles.smallBtn, styles.adminPeriodEditActionBtn, styles.adminPeriodEditCancelBtn, savingPeriodo && { opacity: 0.6 }]}
                        onPress={() => {
                          setEditingPeriodo(null);
                          setPeriodForm(createDefaultPeriodForm(periodos));
                          setPeriodFeedback({ type: '', message: '' });
                        }}
                        disabled={savingPeriodo}
                      >
                        <View style={[styles.btnRow, styles.rectorEditActionRow]}>
                          <Ionicons name="close-outline" size={14} color="#e5e7eb" />
                          <Text style={[styles.smallBtnText, styles.rectorEditActionText]}>Cancelar</Text>
                        </View>
                      </TouchableOpacity>
                    ) : null}
                    <TouchableOpacity
                      style={[styles.smallBtn, styles.periodSaveBtn, styles.adminPeriodEditActionBtn, !editingPeriodo && styles.adminPeriodCreateOnlyBtn, savingPeriodo && { opacity: 0.6 }]}
                      onPress={handleSavePeriod}
                      disabled={savingPeriodo}
                    >
                      <View style={[styles.btnRow, styles.rectorEditActionRow]}>
                        <Ionicons name="save-outline" size={14} color="#fff" />
                        <Text style={[styles.periodBtnText, styles.periodSaveBtnText, styles.rectorEditActionText]}>{savingPeriodo ? 'Guardando...' : editingPeriodo ? 'Guardar' : 'Agregar'}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}

              {periodFeedback.type === 'error' && periodFeedback.message ? (
                <Text style={periodFeedback.type === 'error' ? styles.feedbackError : styles.feedbackSuccess}>
                  {periodFeedback.message}
                </Text>
              ) : null}
            </View>

            <View style={styles.adminPeriodListTitleCard}>
              <Text style={styles.adminPeriodListTitleText}>
                Lista {periodSchoolId ? `- ${resolveColegioNombre(periodSchoolId)}` : ''}
              </Text>
            </View>
            {periodos.map((p, idx) => (
              <View key={p.id} style={[styles.periodItemRow, styles.periodCard, styles.adminPeriodCard]}>
                <View style={styles.periodContent}>
                  <View style={styles.periodHeadingRow}>
                    <View style={styles.periodNameBadge}>
                      <Text style={styles.periodName} numberOfLines={1} adjustsFontSizeToFit>
                        {p.nombre || `Periodo ${idx + 1}`}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.periodRange}>{formatPeriodSummary(p.fechaInicio, p.fechaFin)}</Text>
                  <View style={styles.periodDateGrid}>
                    <View style={styles.periodDateCard}>
                      <Text style={styles.periodDateValue}>{formatPeriodDate(p.fechaInicio)}</Text>
                      <Text style={styles.periodDateTime}>Hora: {formatPeriodTime(p.fechaInicio)}</Text>
                    </View>
                    <View style={styles.periodDateCard}>
                      <Text style={styles.periodDateValue}>{formatPeriodDate(p.fechaFin)}</Text>
                      <Text style={styles.periodDateTime}>Hora: {formatPeriodTime(p.fechaFin)}</Text>
                    </View>
                  </View>
                  <View style={styles.periodFooterRow}>
                    <View style={styles.periodDurationChip}>
                      <Text style={styles.periodDurationText}>{getPeriodDurationLabel(p.fechaInicio, p.fechaFin)}</Text>
                    </View>
                    <View style={styles.periodActions}>
                      <TouchableOpacity style={[styles.smallBtn, styles.updateBtn, styles.adminColegioActionBtn, styles.adminColegioEditBtn, styles.colegioRegisteredActionBtn]} onPress={() => openPeriodModal(p)}>
                        <View style={styles.btnRow}>
                          <Ionicons name="create-outline" size={14} color="#ecfeff" />
                          <Text style={[styles.smallBtnText, styles.adminDocenteActionText]}>Editar</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.smallBtn, styles.deleteBtn, styles.adminColegioActionBtn, styles.adminColegioDeleteBtn, styles.colegioRegisteredActionBtn]} onPress={() => askDeletePeriod(p.id)}>
                        <View style={styles.btnRow}>
                          <Ionicons name="trash-outline" size={14} color="#fff1f2" />
                          <Text style={[styles.smallBtnText, styles.adminDocenteActionText]}>Eliminar</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {p.actualizado ? <Text style={styles.periodMeta}>Actualizado: {formatPeriodDate(p.actualizado)}</Text> : null}
                </View>
              </View>
            ))}
            {periodos.length === 0 ? <Text style={styles.emptyText}>Sin periodos activos</Text> : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
