import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenBackground from '../components/ScreenBackground';
import { useAuth } from '../store/useAuth';
import { getColegios } from '../services/colegios';
import { getPeriodos } from '../services/periodos';
import { getDashboardReportes } from '../services/reportes';
import { AppInfoDialog } from '../components/AppDialog';

const DASHBOARD_ROLES = new Set(['admin', 'rector', 'coordinador']);

const toDateOnly = (value) => {
  if (!value) return null;
  const normalized = String(value).trim();
  if (!normalized) return null;
  return normalized.includes('T') ? normalized.slice(0, 10) : normalized;
};

const formatDateLong = (value) => {
  const dateOnly = toDateOnly(value);
  if (!dateOnly) return 'Sin fecha';
  const date = new Date(`${dateOnly}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return dateOnly;
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(date);
};

const formatDateShort = (value) => {
  const dateOnly = toDateOnly(value);
  if (!dateOnly) return 'Sin fecha';
  const date = new Date(`${dateOnly}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return dateOnly;
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(date);
};

const formatMonthLabel = (monthKey, fallbackYear, fallbackMonth) => {
  const [year, month] = String(monthKey || '').split('-');
  const resolvedYear = Number(year) || Number(fallbackYear);
  const resolvedMonth = Number(month) || Number(fallbackMonth);
  if (!resolvedYear || !resolvedMonth) return monthKey || 'Sin mes';
  const date = new Date(Date.UTC(resolvedYear, resolvedMonth - 1, 1));
  return new Intl.DateTimeFormat('es-CO', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(date);
};

const formatNumber = (value) => new Intl.NumberFormat('es-CO').format(Number(value) || 0);

const sortByMissingDesc = (items = []) => [...items].sort((left, right) => {
  const byMissing = Number(right?.inasistencias || 0) - Number(left?.inasistencias || 0);
  if (byMissing !== 0) return byMissing;
  return String(left?.fecha || left?.startDate || left?.monthKey || left?.cursoNombre || '')
    .localeCompare(String(right?.fecha || right?.startDate || right?.monthKey || right?.cursoNombre || ''));
});

const buildOwnSchoolOptions = (user) => {
  const schoolId = Number(user?.schoolId);
  if (!schoolId) return [];
  return [{
    id: schoolId,
    nombre: user?.schoolName || `Colegio ${schoolId}`
  }];
};

function SectionCard({ icon, title, subtitle, children }) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconWrap}>
          <Ionicons name={icon} size={18} color="#67e8f9" />
        </View>
        <View style={styles.sectionHeaderText}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      {children}
    </View>
  );
}

function TimelineList({ items, emptyText, labelBuilder, metaBuilder }) {
  if (!items.length) {
    return <Text style={styles.emptyText}>{emptyText}</Text>;
  }

  return (
    <View style={styles.timelineList}>
      {items.map((item, index) => (
        <View key={`${labelBuilder(item)}-${index}`} style={styles.timelineRow}>
          <View style={styles.timelineTextWrap}>
            <Text style={styles.timelineTitle}>{labelBuilder(item)}</Text>
            <Text style={styles.timelineMeta}>{metaBuilder(item)}</Text>
          </View>
          <View style={styles.timelineBadge}>
            <Text style={styles.timelineBadgeText}>{formatNumber(item?.inasistencias)} faltas</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

export default function ReportesScreen() {
  const user = useAuth((state) => state.user);
  const canViewDashboard = DASHBOARD_ROLES.has(user?.rol);
  const isGlobalAdmin = user?.rol === 'admin' && !user?.schoolId;

  const [schoolOptions, setSchoolOptions] = useState([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState(null);
  const [periodos, setPeriodos] = useState([]);
  const [selectedPeriodoId, setSelectedPeriodoId] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [loading, setLoading] = useState(false);
  const [periodLoading, setPeriodLoading] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState({ visible: false, title: '', message: '', tone: 'info' });

  const showFeedback = (title, message, tone = 'info') => {
    setFeedbackModal({ visible: true, title, message, tone });
  };

  const loadDashboard = async (schoolIdParam = selectedSchoolId, periodoIdParam = selectedPeriodoId, { silent = false } = {}) => {
    const schoolId = Number(schoolIdParam);
    if (!schoolId || !canViewDashboard) return;

    try {
      if (!silent) setLoading(true);
      const params = {};
      if (isGlobalAdmin) params.schoolId = schoolId;
      if (periodoIdParam && periodoIdParam !== 'all') params.periodoId = Number(periodoIdParam);
      const data = await getDashboardReportes(params);
      setDashboard(data);
    } catch (e) {
      setDashboard(null);
      showFeedback('Error', e?.response?.data?.error || 'No se pudieron cargar los reportes', 'error');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      if (!canViewDashboard) {
        setBootstrapping(false);
        return;
      }

      try {
        if (isGlobalAdmin) {
          const colegios = await getColegios();
          if (cancelled) return;
          const options = (colegios || []).map((item) => ({ id: item.id, nombre: item.nombre }));
          setSchoolOptions(options);
          setSelectedSchoolId((prev) => prev || options[0]?.id || null);
        } else {
          const ownOptions = buildOwnSchoolOptions(user);
          if (cancelled) return;
          setSchoolOptions(ownOptions);
          setSelectedSchoolId(ownOptions[0]?.id || null);
        }
      } catch (e) {
        if (!cancelled) {
          showFeedback('Error', e?.response?.data?.error || 'No se pudieron cargar los colegios', 'error');
        }
      } finally {
        if (!cancelled) setBootstrapping(false);
      }
    };

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [canViewDashboard, isGlobalAdmin, user?.schoolId, user?.schoolName]);

  useEffect(() => {
    let cancelled = false;

    const loadPeriodosForSchool = async () => {
      const schoolId = Number(selectedSchoolId);
      if (!canViewDashboard || !schoolId) {
        setPeriodos([]);
        setSelectedPeriodoId(null);
        return;
      }

      setPeriodLoading(true);
      setSelectedPeriodoId(null);

      try {
        const params = isGlobalAdmin ? { schoolId } : {};
        const data = await getPeriodos(params);
        if (cancelled) return;
        const lista = Array.isArray(data) ? data : [];
        setPeriodos(lista);
        setSelectedPeriodoId(lista.length ? String(lista[lista.length - 1].id) : 'all');
      } catch (e) {
        if (!cancelled) {
          setPeriodos([]);
          setSelectedPeriodoId('all');
          showFeedback('Error', e?.response?.data?.error || 'No se pudieron cargar los periodos', 'error');
        }
      } finally {
        if (!cancelled) setPeriodLoading(false);
      }
    };

    loadPeriodosForSchool();
    return () => {
      cancelled = true;
    };
  }, [canViewDashboard, isGlobalAdmin, selectedSchoolId]);

  useEffect(() => {
    if (!canViewDashboard) return;
    if (!selectedSchoolId) return;
    if (!selectedPeriodoId) return;
    loadDashboard(selectedSchoolId, selectedPeriodoId);
  }, [canViewDashboard, isGlobalAdmin, selectedSchoolId, selectedPeriodoId]);

  const selectedPeriodo = periodos.find((item) => String(item.id) === String(selectedPeriodoId));
  const reportByDay = dashboard?.worstDays?.length
    ? dashboard.worstDays
    : sortByMissingDesc((dashboard?.byDay || []).filter((item) => Number(item?.inasistencias) > 0)).slice(0, 6);
  const reportByWeek = sortByMissingDesc((dashboard?.byWeek || []).filter((item) => Number(item?.inasistencias) > 0)).slice(0, 6);
  const reportByMonth = sortByMissingDesc((dashboard?.byMonth || []).filter((item) => Number(item?.inasistencias) > 0)).slice(0, 6);
  const courseRanking = (dashboard?.courseRanking || []).slice(0, 5);

  if (!canViewDashboard) {
    return (
      <ScreenBackground contentStyle={styles.container}>
        <View style={styles.infoCard}>
          <Text style={styles.title}>Reportes</Text>
          <Text style={styles.infoText}>
            Este tablero esta disponible para admin, rector y coordinador.
          </Text>
        </View>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground contentStyle={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons name="bar-chart-outline" size={24} color="#fde68a" />
          </View>
          <View style={styles.heroTextWrap}>
            <Text style={styles.title}>Reportes de inasistencia</Text>
            <Text style={styles.subtitle}>
              Consulta faltas por dia, semana y mes, y detecta que curso concentra mas ausencias.
            </Text>
          </View>
        </View>

        <SectionCard
          icon="options-outline"
          title="Filtros"
          subtitle="Selecciona el colegio y el periodo que quieres analizar"
        >
          {isGlobalAdmin ? (
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Colegio</Text>
              <View style={styles.filterChipWrap}>
                {schoolOptions.map((school) => {
                  const active = String(selectedSchoolId) === String(school.id);
                  return (
                    <TouchableOpacity
                      key={school.id}
                      style={[styles.filterChip, active && styles.filterChipActive]}
                      onPress={() => setSelectedSchoolId(school.id)}
                    >
                      <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                        {school.nombre}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ) : null}

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Periodo</Text>
            <View style={styles.filterChipWrap}>
              <TouchableOpacity
                style={[styles.filterChip, selectedPeriodoId === 'all' && styles.filterChipActive]}
                onPress={() => setSelectedPeriodoId('all')}
              >
                <Text style={[styles.filterChipText, selectedPeriodoId === 'all' && styles.filterChipTextActive]}>
                  Todo
                </Text>
              </TouchableOpacity>
              {periodos.map((periodo) => {
                const active = String(selectedPeriodoId) === String(periodo.id);
                return (
                  <TouchableOpacity
                    key={periodo.id}
                    style={[styles.filterChip, active && styles.filterChipActive]}
                    onPress={() => setSelectedPeriodoId(String(periodo.id))}
                  >
                    <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                      {periodo.nombre}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.refreshBtn, (loading || bootstrapping || periodLoading) && styles.refreshBtnDisabled]}
            onPress={() => loadDashboard(selectedSchoolId, selectedPeriodoId)}
            disabled={loading || bootstrapping || periodLoading || !selectedSchoolId || !selectedPeriodoId}
          >
            <Ionicons name="refresh-outline" size={16} color="#fff" />
            <Text style={styles.refreshBtnText}>Actualizar reporte</Text>
          </TouchableOpacity>
        </SectionCard>

        {selectedPeriodo ? (
          <View style={styles.periodInfoCard}>
            <Text style={styles.periodInfoTitle}>{selectedPeriodo.nombre}</Text>
            <Text style={styles.periodInfoText}>
              Del {formatDateLong(selectedPeriodo.fechaInicio)} al {formatDateLong(selectedPeriodo.fechaFin)}
            </Text>
          </View>
        ) : (
          <View style={styles.periodInfoCard}>
            <Text style={styles.periodInfoTitle}>Todo el historial</Text>
            <Text style={styles.periodInfoText}>
              El reporte incluye todas las asistencias registradas del colegio seleccionado.
            </Text>
          </View>
        )}

        {bootstrapping || periodLoading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="small" color="#67e8f9" />
            <Text style={styles.loadingText}>Cargando filtros de reportes...</Text>
          </View>
        ) : null}

        {loading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="small" color="#67e8f9" />
            <Text style={styles.loadingText}>Analizando asistencias...</Text>
          </View>
        ) : null}

        {!loading && dashboard ? (
          <>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Faltas</Text>
                <Text style={styles.statValue}>{formatNumber(dashboard?.totals?.inasistencias)}</Text>
                <Text style={styles.statHint}>Ausentes + fuera del aula</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Estudiantes afectados</Text>
                <Text style={styles.statValue}>{formatNumber(dashboard?.totals?.estudiantesConInasistencias)}</Text>
                <Text style={styles.statHint}>Con al menos una falta</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Cursos con registros</Text>
                <Text style={styles.statValue}>{formatNumber(dashboard?.totals?.cursosConRegistros)}</Text>
                <Text style={styles.statHint}>Cursos con asistencia tomada</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Dias con faltas</Text>
                <Text style={styles.statValue}>{formatNumber(dashboard?.totals?.diasConInasistencias)}</Text>
                <Text style={styles.statHint}>Fechas donde hubo ausencias</Text>
              </View>
            </View>

            <SectionCard
              icon="warning-outline"
              title="Curso con mas faltas"
              subtitle="Identifica rapidamente donde se concentra el problema"
            >
              {dashboard?.worstCourse ? (
                <View style={styles.highlightWrap}>
                  <View style={styles.highlightHeader}>
                    <View>
                      <Text style={styles.highlightTitle}>{dashboard.worstCourse.cursoNombre}</Text>
                      <Text style={styles.highlightSubtitle}>
                        {formatNumber(dashboard.worstCourse.inasistencias)} faltas en {formatNumber(dashboard.worstCourse.diasConInasistencias)} dias
                      </Text>
                    </View>
                    <View style={styles.highlightBadge}>
                      <Text style={styles.highlightBadgeText}>Curso critico</Text>
                    </View>
                  </View>
                  <View style={styles.miniList}>
                    {(dashboard.worstCourse.diasMasFaltas || []).map((item) => (
                      <View key={`${dashboard.worstCourse.cursoId}-${item.fecha}`} style={styles.miniListRow}>
                        <Text style={styles.miniListTitle}>{formatDateLong(item.fecha)}</Text>
                        <Text style={styles.miniListValue}>{formatNumber(item.inasistencias)} faltas</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ) : (
                <Text style={styles.emptyText}>No hay faltas registradas para este filtro.</Text>
              )}
            </SectionCard>

            <SectionCard
              icon="school-outline"
              title="Cursos con mas inasistencias"
              subtitle="Ranking de cursos con mayor cantidad de faltas"
            >
              <TimelineList
                items={courseRanking}
                emptyText="Todavia no hay cursos con faltas registradas."
                labelBuilder={(item) => item.cursoNombre}
                metaBuilder={(item) => `${formatNumber(item.diasConInasistencias)} dias con faltas`}
              />
            </SectionCard>

            <SectionCard
              icon="calendar-outline"
              title="Reporte por dia"
              subtitle="Fechas donde mas faltaron los estudiantes"
            >
              <TimelineList
                items={reportByDay}
                emptyText="No hay dias con faltas para mostrar."
                labelBuilder={(item) => formatDateLong(item.fecha)}
                metaBuilder={(item) => `${formatNumber(item.ausentes)} ausentes - ${formatNumber(item.afuera)} fuera`}
              />
            </SectionCard>

            <SectionCard
              icon="layers-outline"
              title="Reporte por semana"
              subtitle="Semanas con mayor volumen de inasistencias"
            >
              <TimelineList
                items={reportByWeek}
                emptyText="No hay semanas con faltas para mostrar."
                labelBuilder={(item) => `Semana ${item.week}: ${formatDateShort(item.startDate)} - ${formatDateShort(item.endDate)}`}
                metaBuilder={(item) => `${formatNumber(item.ausentes)} ausentes - ${formatNumber(item.afuera)} fuera`}
              />
            </SectionCard>

            <SectionCard
              icon="calendar-clear-outline"
              title="Reporte por mes"
              subtitle="Vista consolidada para detectar tendencias mensuales"
            >
              <TimelineList
                items={reportByMonth}
                emptyText="No hay meses con faltas para mostrar."
                labelBuilder={(item) => formatMonthLabel(item.monthKey, item.year, item.month)}
                metaBuilder={(item) => `${formatNumber(item.ausentes)} ausentes - ${formatNumber(item.afuera)} fuera`}
              />
            </SectionCard>

            <SectionCard
              icon="pulse-outline"
              title="Alertas rapidas"
              subtitle="Resumen corto del ultimo corte relevante"
            >
              <View style={styles.alertGrid}>
                <View style={styles.alertCard}>
                  <Text style={styles.alertLabel}>Ultimo dia registrado</Text>
                  <Text style={styles.alertValue}>
                    {dashboard?.highlights?.ultimoDiaRegistrado
                      ? formatDateLong(dashboard.highlights.ultimoDiaRegistrado.fecha)
                      : 'Sin datos'}
                  </Text>
                  <Text style={styles.alertHint}>
                    {dashboard?.highlights?.ultimoDiaRegistrado
                      ? `${formatNumber(dashboard.highlights.ultimoDiaRegistrado.inasistencias)} faltas`
                      : 'No hay registros'}
                  </Text>
                </View>
                <View style={styles.alertCard}>
                  <Text style={styles.alertLabel}>Semana mas critica</Text>
                  <Text style={styles.alertValue}>
                    {dashboard?.highlights?.semanaMasCritica
                      ? `Semana ${dashboard.highlights.semanaMasCritica.week}`
                      : 'Sin datos'}
                  </Text>
                  <Text style={styles.alertHint}>
                    {dashboard?.highlights?.semanaMasCritica
                      ? `${formatDateShort(dashboard.highlights.semanaMasCritica.startDate)} - ${formatDateShort(dashboard.highlights.semanaMasCritica.endDate)}`
                      : 'No hay registros'}
                  </Text>
                </View>
                <View style={styles.alertCard}>
                  <Text style={styles.alertLabel}>Mes mas critico</Text>
                  <Text style={styles.alertValue}>
                    {dashboard?.highlights?.mesMasCritico
                      ? formatMonthLabel(
                        dashboard.highlights.mesMasCritico.monthKey,
                        dashboard.highlights.mesMasCritico.year,
                        dashboard.highlights.mesMasCritico.month
                      )
                      : 'Sin datos'}
                  </Text>
                  <Text style={styles.alertHint}>
                    {dashboard?.highlights?.mesMasCritico
                      ? `${formatNumber(dashboard.highlights.mesMasCritico.inasistencias)} faltas`
                      : 'No hay registros'}
                  </Text>
                </View>
              </View>
            </SectionCard>
          </>
        ) : null}

        {!loading && !bootstrapping && !periodLoading && !dashboard ? (
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>No fue posible construir el reporte con los filtros actuales.</Text>
          </View>
        ) : null}
      </ScrollView>
      <AppInfoDialog
        visible={feedbackModal.visible}
        title={feedbackModal.title}
        message={feedbackModal.message}
        tone={feedbackModal.tone}
        onClose={() => setFeedbackModal({ visible: false, title: '', message: '', tone: 'info' })}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 18 },
  scrollContent: { paddingBottom: 28, gap: 14 },
  heroCard: {
    backgroundColor: '#111827',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(103,232,249,0.18)',
    padding: 18,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start'
  },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(250,204,21,0.12)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  heroTextWrap: { flex: 1, gap: 6 },
  title: { color: '#f8fafc', fontSize: 22, fontWeight: '800' },
  subtitle: { color: '#cbd5e1', fontSize: 14, lineHeight: 20 },
  sectionCard: {
    backgroundColor: '#111827',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.16)',
    padding: 16,
    gap: 14
  },
  sectionHeader: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  sectionIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(34,211,238,0.12)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sectionHeaderText: { flex: 1, gap: 2 },
  sectionTitle: { color: '#f8fafc', fontSize: 17, fontWeight: '800' },
  sectionSubtitle: { color: '#94a3b8', fontSize: 13, lineHeight: 18 },
  filterGroup: { gap: 10 },
  filterLabel: { color: '#e2e8f0', fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 },
  filterChipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.18)'
  },
  filterChipActive: {
    backgroundColor: 'rgba(37,99,235,0.22)',
    borderColor: '#38bdf8'
  },
  filterChipText: { color: '#cbd5e1', fontWeight: '700' },
  filterChipTextActive: { color: '#f8fafc' },
  refreshBtn: {
    marginTop: 4,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  refreshBtnDisabled: { opacity: 0.6 },
  refreshBtnText: { color: '#fff', fontWeight: '800' },
  periodInfoCard: {
    backgroundColor: '#172033',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.18)',
    padding: 15,
    gap: 5
  },
  periodInfoTitle: { color: '#f8fafc', fontSize: 16, fontWeight: '800' },
  periodInfoText: { color: '#cbd5e1', fontSize: 14, lineHeight: 20 },
  loadingCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  loadingText: { color: '#cbd5e1', fontSize: 14 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: {
    flexGrow: 1,
    minWidth: 160,
    backgroundColor: '#101a2c',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.15)',
    padding: 16,
    gap: 5
  },
  statLabel: { color: '#94a3b8', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  statValue: { color: '#f8fafc', fontSize: 28, fontWeight: '800' },
  statHint: { color: '#cbd5e1', fontSize: 13, lineHeight: 18 },
  highlightWrap: { gap: 14 },
  highlightHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' },
  highlightTitle: { color: '#f8fafc', fontSize: 24, fontWeight: '800' },
  highlightSubtitle: { color: '#cbd5e1', fontSize: 14, marginTop: 4 },
  highlightBadge: {
    backgroundColor: 'rgba(245,158,11,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.4)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7
  },
  highlightBadgeText: { color: '#fde68a', fontWeight: '800' },
  miniList: { gap: 10 },
  miniListRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  miniListTitle: { color: '#e2e8f0', fontWeight: '700', flex: 1 },
  miniListValue: { color: '#fde68a', fontWeight: '800' },
  timelineList: { gap: 10 },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#0f172a',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13
  },
  timelineTextWrap: { flex: 1, gap: 4 },
  timelineTitle: { color: '#f8fafc', fontSize: 15, fontWeight: '700' },
  timelineMeta: { color: '#94a3b8', fontSize: 13 },
  timelineBadge: {
    borderRadius: 999,
    backgroundColor: 'rgba(239,68,68,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.35)',
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  timelineBadgeText: { color: '#fecaca', fontWeight: '800' },
  alertGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  alertCard: {
    flexGrow: 1,
    minWidth: 180,
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 14,
    gap: 6
  },
  alertLabel: { color: '#94a3b8', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  alertValue: { color: '#f8fafc', fontSize: 16, fontWeight: '800' },
  alertHint: { color: '#cbd5e1', fontSize: 13, lineHeight: 18 },
  infoCard: {
    backgroundColor: '#111827',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.16)',
    padding: 18,
    gap: 8
  },
  infoText: { color: '#cbd5e1', fontSize: 14, lineHeight: 20 },
  emptyText: { color: '#94a3b8', fontSize: 14, lineHeight: 20 }
});
