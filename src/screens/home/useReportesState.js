import { useState } from 'react';

export default function useReportesState() {
  const [reportesModalVisible, setReportesModalVisible] = useState(false);
  const [reportesColegioId, setReportesColegioId] = useState(null);
  const [reportesColegioPickerOpen, setReportesColegioPickerOpen] = useState(false);
  const [reportesCursos, setReportesCursos] = useState([]);
  const [reportesCursoId, setReportesCursoId] = useState(null);
  const [reportesCursoPickerOpen, setReportesCursoPickerOpen] = useState(false);
  const [reportesMes, setReportesMes] = useState(new Date().getMonth() + 1);
  const [reportesMesPickerOpen, setReportesMesPickerOpen] = useState(false);
  const [reportesDia, setReportesDia] = useState(new Date().getDate());
  const [reportesDiaPickerOpen, setReportesDiaPickerOpen] = useState(false);
  const [reportesLoading, setReportesLoading] = useState(false);
  const [reportesBootLoading, setReportesBootLoading] = useState(false);
  const [reportesError, setReportesError] = useState('');
  const [reportesDetalle, setReportesDetalle] = useState(null);

  return {
    reportesModalVisible,
    setReportesModalVisible,
    reportesColegioId,
    setReportesColegioId,
    reportesColegioPickerOpen,
    setReportesColegioPickerOpen,
    reportesCursos,
    setReportesCursos,
    reportesCursoId,
    setReportesCursoId,
    reportesCursoPickerOpen,
    setReportesCursoPickerOpen,
    reportesMes,
    setReportesMes,
    reportesMesPickerOpen,
    setReportesMesPickerOpen,
    reportesDia,
    setReportesDia,
    reportesDiaPickerOpen,
    setReportesDiaPickerOpen,
    reportesLoading,
    setReportesLoading,
    reportesBootLoading,
    setReportesBootLoading,
    reportesError,
    setReportesError,
    reportesDetalle,
    setReportesDetalle
  };
}
