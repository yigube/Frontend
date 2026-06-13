import { useEffect, useRef } from 'react';
import { useAttendance } from '../../store/useAttendance';

export default function useAttendanceRealtimeRefresh({
  userId,
  userSchoolId,
  estudiantesModalVisible,
  cursoSeleccionado,
  reportesModalVisible,
  reportesCursoId,
  loadEstudiantesPorCurso,
  handleGenerateInasistenciaReport
}) {
  const subscribeAttendance = useAttendance((state) => state.subscribe);
  const attendanceLastEvent = useAttendance((state) => state.lastEvent);
  const realtimeContextRef = useRef({
    estudiantesModalVisible: false,
    cursoSeleccionado: null,
    reportesModalVisible: false,
    reportesCursoId: null,
    userSchoolId: null
  });
  const realtimeRefreshTimeoutRef = useRef(null);

  useEffect(() => {
    let unsubscribe = null;
    let cancelled = false;
    (async () => {
      if (!userId) return;
      try {
        const cleanup = await subscribeAttendance();
        if (cancelled) {
          if (typeof cleanup === 'function') cleanup();
          return;
        }
        unsubscribe = cleanup;
      } catch {}
    })();
    return () => {
      cancelled = true;
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [subscribeAttendance, userId]);

  useEffect(() => {
    realtimeContextRef.current = {
      estudiantesModalVisible,
      cursoSeleccionado,
      reportesModalVisible,
      reportesCursoId,
      userSchoolId
    };
  }, [cursoSeleccionado, estudiantesModalVisible, reportesCursoId, reportesModalVisible, userSchoolId]);

  useEffect(() => () => {
    if (realtimeRefreshTimeoutRef.current) {
      clearTimeout(realtimeRefreshTimeoutRef.current);
      realtimeRefreshTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!attendanceLastEvent) return;
    const ctx = realtimeContextRef.current;
    const eventCursoId = Number(attendanceLastEvent?.cursoId);
    const eventSchoolId = Number(attendanceLastEvent?.schoolId);
    const currentUserSchoolId = Number(ctx?.userSchoolId);
    if (
      Number.isFinite(currentUserSchoolId)
      && currentUserSchoolId > 0
      && Number.isFinite(eventSchoolId)
      && eventSchoolId > 0
      && eventSchoolId !== currentUserSchoolId
    ) {
      return;
    }
    if (realtimeRefreshTimeoutRef.current) clearTimeout(realtimeRefreshTimeoutRef.current);
    realtimeRefreshTimeoutRef.current = setTimeout(async () => {
      try {
        if (ctx.estudiantesModalVisible && ctx.cursoSeleccionado && String(ctx.cursoSeleccionado) === String(eventCursoId)) {
          await loadEstudiantesPorCurso(ctx.cursoSeleccionado);
        }
        if (ctx.reportesModalVisible && ctx.reportesCursoId && String(ctx.reportesCursoId) === String(eventCursoId)) {
          await handleGenerateInasistenciaReport();
        }
      } catch {}
    }, 250);
  }, [attendanceLastEvent, handleGenerateInasistenciaReport, loadEstudiantesPorCurso]);
}
