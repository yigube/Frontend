import React from 'react';
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ReportesModal({
  visible,
  onClose,
  styles,
  pad2,
  reportesDia,
  reportesMes,
  currentYear,
  reportesColegioNombre,
  reportesCursoNombre,
  canAdminFilterReportSchools,
  setReportesColegioPickerOpen,
  setReportesCursoPickerOpen,
  setReportesMesPickerOpen,
  setReportesDiaPickerOpen,
  reportesBootLoading,
  reportesLoading,
  reportesColegioPickerOpen,
  colegiosLoading,
  colegiosOptions,
  reportesColegioId,
  setReportesColegioId,
  setReportesError,
  setReportesDetalle,
  reportesCursoPickerOpen,
  reportesCursos,
  reportesCursoId,
  setReportesCursoId,
  monthNames,
  reportMonthOptions,
  setReportesMes,
  reportesMesPickerOpen,
  reportDayOptions,
  setReportesDia,
  reportesDiaPickerOpen,
  handleGenerateInasistenciaReport,
  resetReportesFilters,
  reportesError,
  reportesDetalle
}) {
  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={[styles.modalCard, styles.reportesModalCard]}>
          <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.modalHeader}>
              <Text style={styles.periodTitle}>Reporte de inasistencia</Text>
              <Pressable onPress={onClose} style={styles.closeBtn}>
                <View style={styles.btnRow}>
                  <Ionicons name="close-outline" size={16} color="#fecaca" />
                  <Text style={styles.closeBtnText}>Cerrar</Text>
                </View>
              </Pressable>
            </View>

            <View style={styles.reportHeroCard}>
              <View style={styles.reportHeroHead}>
                <View style={styles.reportHeroIconWrap}>
                  <Ionicons name="analytics-outline" size={18} color="#a5f3fc" />
                </View>
                <View style={styles.reportHeroTextWrap}>
                  <Text style={styles.reportHeroTitle}>Panel de reportes</Text>
                  <Text style={styles.reportHeroSubtitle}>Analiza inasistencias por curso, dia y mes</Text>
                </View>
              </View>
              <View style={styles.reportHeroChips}>
                <View style={styles.reportHeroChip}>
                  <Ionicons name="calendar-outline" size={13} color="#93c5fd" />
                  <Text style={styles.reportHeroChipText}>{pad2(reportesDia)}/{pad2(reportesMes)}/{currentYear}</Text>
                </View>
                <View style={styles.reportHeroChip}>
                  <Ionicons name="business-outline" size={13} color="#fcd34d" />
                  <Text style={styles.reportHeroChipText}>{reportesColegioNombre}</Text>
                </View>
                <View style={styles.reportHeroChip}>
                  <Ionicons name="school-outline" size={13} color="#86efac" />
                  <Text style={styles.reportHeroChipText}>{reportesCursoNombre}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.fieldLabel}>Colegio: <Text style={styles.dataValue}>{reportesColegioNombre || 'No asignado'}</Text></Text>

            <View style={styles.dataBox}>
              <Text style={styles.dataTitle}>Filtros</Text>

              {canAdminFilterReportSchools ? (
                <View style={styles.reportFieldGroup}>
                  <Text style={styles.fieldLabel}>Institucion</Text>
                  <TouchableOpacity
                    style={styles.selectBoxFull}
                    onPress={() => {
                      setReportesColegioPickerOpen((prev) => !prev);
                      setReportesCursoPickerOpen(false);
                      setReportesMesPickerOpen(false);
                      setReportesDiaPickerOpen(false);
                    }}
                    disabled={reportesBootLoading || reportesLoading}
                  >
                    <Text style={styles.selectText}>{reportesColegioNombre}</Text>
                  </TouchableOpacity>
                  {reportesColegioPickerOpen ? (
                    <View style={styles.pickerList}>
                      {colegiosLoading ? <Text style={styles.dataBullet}>Cargando instituciones...</Text> : null}
                      {colegiosOptions.length > 0 ? (
                        colegiosOptions.map((colegio) => (
                          <TouchableOpacity
                            key={`reporte-colegio-${colegio.id}`}
                            style={[styles.pickerItem, String(reportesColegioId) === String(colegio.id) && styles.pickerItemActive]}
                            onPress={() => {
                              setReportesColegioId(colegio.id);
                              setReportesColegioPickerOpen(false);
                              setReportesCursoPickerOpen(false);
                              setReportesError('');
                              setReportesDetalle(null);
                            }}
                          >
                            <Text style={styles.dataItem}>{colegio.nombre || `Colegio ${colegio.id}`}</Text>
                          </TouchableOpacity>
                        ))
                      ) : (
                        <Text style={[styles.dataBullet, styles.reportPickerEmpty]}>No hay instituciones disponibles</Text>
                      )}
                    </View>
                  ) : null}
                </View>
              ) : null}

              <View style={styles.reportFieldGroup}>
                <Text style={styles.fieldLabel}>Curso</Text>
                <TouchableOpacity
                  style={styles.selectBoxFull}
                  onPress={() => {
                    setReportesCursoPickerOpen((prev) => !prev);
                    setReportesColegioPickerOpen(false);
                    setReportesMesPickerOpen(false);
                    setReportesDiaPickerOpen(false);
                  }}
                  disabled={reportesBootLoading || reportesLoading}
                >
                  <Text style={styles.selectText}>{reportesCursoNombre}</Text>
                </TouchableOpacity>
                {reportesCursoPickerOpen ? (
                  <View style={styles.pickerList}>
                    {reportesCursos.length > 0 ? (
                      reportesCursos.map((curso) => (
                        <TouchableOpacity
                          key={`reporte-curso-${curso.id}`}
                          style={[styles.pickerItem, String(reportesCursoId) === String(curso.id) && styles.pickerItemActive]}
                          onPress={() => {
                            setReportesCursoId(curso.id);
                            setReportesCursoPickerOpen(false);
                          }}
                        >
                          <Text style={styles.dataItem}>{curso.nombre || `Curso ${curso.id}`}</Text>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <Text style={[styles.dataBullet, styles.reportPickerEmpty]}>No hay cursos disponibles</Text>
                    )}
                  </View>
                ) : null}
              </View>

              <View style={styles.reportFiltersGrid}>
                <View style={styles.reportFieldColumn}>
                  <Text style={styles.fieldLabel}>Mes</Text>
                  <TouchableOpacity
                    style={styles.selectBoxFull}
                    onPress={() => {
                      setReportesMesPickerOpen((prev) => !prev);
                      setReportesColegioPickerOpen(false);
                      setReportesCursoPickerOpen(false);
                      setReportesDiaPickerOpen(false);
                    }}
                    disabled={reportesLoading}
                  >
                    <Text style={styles.selectText}>{monthNames[reportesMes - 1]} {currentYear}</Text>
                  </TouchableOpacity>
                  {reportesMesPickerOpen ? (
                    <View style={styles.pickerList}>
                      {reportMonthOptions.map((option) => (
                        <TouchableOpacity
                          key={`reporte-mes-${option.value}`}
                          style={[styles.pickerItem, reportesMes === option.value && styles.pickerItemActive]}
                          onPress={() => {
                            setReportesMes(option.value);
                            setReportesMesPickerOpen(false);
                          }}
                        >
                          <Text style={styles.dataItem}>{option.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : null}
                </View>

                <View style={styles.reportFieldColumn}>
                  <Text style={styles.fieldLabel}>Dia</Text>
                  <TouchableOpacity
                    style={styles.selectBoxFull}
                    onPress={() => {
                      setReportesDiaPickerOpen((prev) => !prev);
                      setReportesColegioPickerOpen(false);
                      setReportesCursoPickerOpen(false);
                      setReportesMesPickerOpen(false);
                    }}
                    disabled={reportesLoading}
                  >
                    <Text style={styles.selectText}>{reportesDia}</Text>
                  </TouchableOpacity>
                  {reportesDiaPickerOpen ? (
                    <View style={styles.pickerList}>
                      {reportDayOptions.map((dayValue) => (
                        <TouchableOpacity
                          key={`reporte-dia-${dayValue}`}
                          style={[styles.pickerItem, reportesDia === dayValue && styles.pickerItemActive]}
                          onPress={() => {
                            setReportesDia(dayValue);
                            setReportesDiaPickerOpen(false);
                          }}
                        >
                          <Text style={styles.dataItem}>{dayValue}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : null}
                </View>
              </View>

              <View style={styles.reportActionRow}>
                <TouchableOpacity
                  style={[styles.reportActionBtn, styles.reportActionBtnPrimary, (reportesLoading || reportesBootLoading) && styles.reportGenerateBtnDisabled]}
                  onPress={handleGenerateInasistenciaReport}
                  disabled={reportesLoading || reportesBootLoading || !reportesCursoId}
                >
                  <View style={styles.btnRow}>
                    <Ionicons name="bar-chart-outline" size={16} color="#fff" />
                    <Text style={styles.reportActionBtnText}>{reportesLoading ? 'Generando...' : 'Generar'}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.reportActionBtn, styles.reportActionBtnInfo, reportesLoading && styles.reportGenerateBtnDisabled]}
                  onPress={() => {
                    const today = new Date();
                    setReportesMes(today.getMonth() + 1);
                    setReportesDia(today.getDate());
                    setReportesColegioPickerOpen(false);
                    setReportesMesPickerOpen(false);
                    setReportesDiaPickerOpen(false);
                    setReportesCursoPickerOpen(false);
                  }}
                  disabled={reportesLoading}
                >
                  <View style={styles.btnRow}>
                    <Ionicons name="today-outline" size={16} color="#dbeafe" />
                    <Text style={styles.reportActionBtnText}>Hoy</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.reportActionBtn, styles.reportActionBtnGhost, reportesLoading && styles.reportGenerateBtnDisabled]}
                  onPress={resetReportesFilters}
                  disabled={reportesLoading}
                >
                  <View style={styles.btnRow}>
                    <Ionicons name="refresh-outline" size={16} color="#e2e8f0" />
                    <Text style={styles.reportActionBtnText}>Limpiar</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {reportesError ? <Text style={styles.errorText}>{reportesError}</Text> : null}
            </View>

            {reportesBootLoading ? (
              <View style={styles.dataBox}>
                <Text style={styles.dataBullet}>Cargando cursos...</Text>
              </View>
            ) : null}

            {reportesDetalle ? (
              <>
                <View style={styles.reportMetricGrid}>
                  <View style={styles.reportMetricCard}>
                    <Text style={styles.reportMetricLabel}>Curso</Text>
                    <Text style={styles.reportMetricValue}>{reportesDetalle?.curso?.nombre || reportesCursoNombre}</Text>
                    <Text style={styles.reportMetricHint}>Filtro actual</Text>
                  </View>
                  <View style={styles.reportMetricCard}>
                    <Text style={styles.reportMetricLabel}>Dia</Text>
                    <Text style={styles.reportMetricValue}>{reportesDetalle?.detalleDia?.totalInasistencias || 0}</Text>
                    <Text style={styles.reportMetricHint}>Inasistencias el {reportesDia}/{reportesMes}</Text>
                  </View>
                  <View style={styles.reportMetricCard}>
                    <Text style={styles.reportMetricLabel}>Mes</Text>
                    <Text style={styles.reportMetricValue}>{reportesDetalle?.resumenMes?.inasistencias || 0}</Text>
                    <Text style={styles.reportMetricHint}>Faltas registradas del mes</Text>
                  </View>
                </View>

                <View style={styles.dataBox}>
                  <Text style={styles.dataTitle}>Detalle del dia seleccionado</Text>
                  <Text style={styles.dataItem}>Fecha: <Text style={styles.dataValue}>{reportesDetalle?.fecha}</Text></Text>
                  <Text style={styles.dataItem}>Ausentes: <Text style={styles.dataValue}>{reportesDetalle?.detalleDia?.totalAusentes || 0}</Text></Text>
                  <Text style={styles.dataItem}>Fuera del aula: <Text style={styles.dataValue}>{reportesDetalle?.detalleDia?.totalAfuera || 0}</Text></Text>
                  <Text style={styles.dataItem}>Sin registro: <Text style={styles.dataValue}>{reportesDetalle?.detalleDia?.totalSinRegistro || 0}</Text></Text>

                  <View style={styles.reportListSection}>
                    <Text style={styles.fieldLabel}>Estudiantes con inasistencia</Text>
                    {Array.isArray(reportesDetalle?.detalleDia?.estudiantes) && reportesDetalle.detalleDia.estudiantes.length > 0 ? (
                      reportesDetalle.detalleDia.estudiantes.map((student) => (
                        <View key={`reporte-dia-${student.id}`} style={styles.reportListItem}>
                          <Text style={styles.reportListTitle}>{student.nombres} {student.apellidos}</Text>
                          <Text style={styles.reportListMeta}>
                            {student.estadoActual ? `Estado: ${student.estadoActual}` : 'Sin registro de asistencia'}
                          </Text>
                          {Array.isArray(student.materias) && student.materias.length > 0 ? (
                            <Text style={styles.reportListMeta}>
                              Materias: {student.materias.map((item) => (
                                item?.materia
                                  ? `${item.materia}${item?.estadoActual ? ` (${item.estadoActual})` : ''}`
                                  : (item?.estadoActual ? `Sin materia (${item.estadoActual})` : 'Sin materia')
                              )).join(', ')}
                            </Text>
                          ) : null}
                        </View>
                      ))
                    ) : (
                      <Text style={styles.dataBullet}>No se encontraron inasistencias para el dia seleccionado.</Text>
                    )}
                  </View>
                </View>

                <View style={styles.dataBox}>
                  <Text style={styles.dataTitle}>Resumen del mes</Text>
                  <Text style={styles.dataItem}>Dias con registro: <Text style={styles.dataValue}>{reportesDetalle?.resumenMes?.diasConRegistro || 0}</Text></Text>
                  <Text style={styles.dataItem}>Dias con inasistencias: <Text style={styles.dataValue}>{reportesDetalle?.resumenMes?.diasConInasistencias || 0}</Text></Text>
                  <Text style={styles.dataItem}>Estudiantes con faltas: <Text style={styles.dataValue}>{reportesDetalle?.resumenMes?.estudiantesConFaltas || 0}</Text></Text>

                  <View style={styles.reportListSection}>
                    <Text style={styles.fieldLabel}>Dias con mas faltas del mes</Text>
                    {Array.isArray(reportesDetalle?.diasMasCriticosMes) && reportesDetalle.diasMasCriticosMes.length > 0 ? (
                      reportesDetalle.diasMasCriticosMes.map((dayItem) => (
                        <View key={`reporte-mes-dia-${dayItem.fecha}`} style={styles.reportListItem}>
                          <Text style={styles.reportListTitle}>{dayItem.fecha}</Text>
                          <Text style={styles.reportListMeta}>{dayItem.inasistencias} faltas</Text>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.dataBullet}>No hay faltas registradas en el mes seleccionado.</Text>
                    )}
                  </View>

                  <View style={styles.reportListSection}>
                    <Text style={styles.fieldLabel}>Estudiantes con mas faltas en el mes</Text>
                    {Array.isArray(reportesDetalle?.estudiantesConMasFaltas) && reportesDetalle.estudiantesConMasFaltas.length > 0 ? (
                      reportesDetalle.estudiantesConMasFaltas.map((student) => (
                        <View key={`reporte-mes-est-${student.estudianteId}`} style={styles.reportListItem}>
                          <Text style={styles.reportListTitle}>{student.nombre}</Text>
                          <Text style={styles.reportListMeta}>
                            {student.inasistencias} faltas - {student.ausente} ausente - {student.afuera} afuera
                          </Text>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.dataBullet}>No hay estudiantes con faltas registradas en el mes.</Text>
                    )}
                  </View>
                </View>
              </>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
