import { useEffect } from 'react';
import { Platform } from 'react-native';
import JSZip from 'jszip';
import * as FileSystemLegacy from 'expo-file-system/legacy';
import QRCodeGenerator from 'qrcode-generator';
import jpeg from 'jpeg-js';
import { EMPTY_ACUDIENTE_FORM } from './useEstudianteCrudState';

const emptyAcudienteForm = () => ({ ...EMPTY_ACUDIENTE_FORM });
const emptyEstudianteEditForm = () => ({ nombres: '', apellidos: '', qr: '', codigoEstudiante: '', materias: [], acudiente: emptyAcudienteForm() });
const emptyEstudianteCreateForm = () => ({ nombres: '', apellidos: '', codigoEstudiante: '', acudiente: emptyAcudienteForm() });

const normalizeAcudientePayload = (acudiente = {}) => {
  const nombre = String(acudiente?.nombre || '').trim();
  const telefonoE164 = String(acudiente?.telefonoE164 || '').trim().replace(/\s+/g, '');
  const parentesco = String(acudiente?.parentesco || '').trim();
  const whatsappOptIn = Boolean(acudiente?.whatsappOptIn);
  if (!nombre && !telefonoE164 && !parentesco && !whatsappOptIn) return null;
  return { nombre, telefonoE164, parentesco, whatsappOptIn, activo: true };
};

export default function useEstudianteCrudActions({
  user,
  colegioSeleccionado,
  cursoSeleccionado,
  cursosAsignados,
  estudiantes,
  estudiantesFiltrados,
  estudiantesModalVisible,
  estudianteCreateModalVisible,
  estudianteCreateCursoId,
  estudianteCreateMaterias,
  estudianteCreateMateriasDisponibles,
  estudianteCreateForm,
  estudianteEditForm,
  estudianteEditing,
  estudianteMateriaFiltro,
  estudiantesColegioId,
  selectedCsvFile,
  deleteEstudianteConfirmModal,
  downloadingQrZip,
  downloadingTemplate,
  cursoSeleccionadoNombre,
  getEstudiantes,
  createEstudiante,
  createEstudiantesLote,
  updateEstudiante,
  deleteEstudiante,
  loadCursosAsignados,
  loadColegios,
  resolveColegioNombre,
  normalizeMateriaOption,
  getMateriasDisponiblesByCurso,
  getEstudianteMateriaOptionsByCurso,
  normalizeStudentCodeKey,
  normalizeStudentIdentityKey,
  ALL_MATERIAS_OPTION,
  getApiErrorMessage,
  showAppAlert,
  showEstudianteDeleteSuccessModal,
  showUploadTemplateSuccessModal,
  clearUploadTemplateSuccessTimeout,
  setLoadingCursos,
  setEstudiantesLoading,
  setEstudiantesError,
  setEstudiantes,
  setCursoSeleccionado,
  setCursoPickerOpen,
  setEstudianteMateriaFiltro,
  setEstudianteMateriaPickerOpen,
  setEstudiantesColegioPickerOpen,
  setEstudianteEditing,
  setEstudianteEditForm,
  setEstudiantesModalVisible,
  setColegiosOptions,
  setEstudiantesColegioId,
  setDownloadingQrZip,
  setQrZipProgress,
  setQrZipErrorModal,
  setQrZipDownloadModal,
  setDownloadingTemplate,
  setEstudianteCreateModalVisible,
  setEstudianteCreateCursoId,
  setEstudianteCreateCursoPickerOpen,
  setEstudianteCreateError,
  setEstudianteCreateForm,
  setEstudianteCreateMaterias,
  setSelectedCsvFile,
  setUploadedStudents,
  setSavingEstudiante,
  setSavingEstudianteEdit,
  setEstudiantesExistentesModal,
  setUploadTemplateSuccessModal,
  setDeleteEstudianteConfirmModal
}) {
  const loadEstudiantesPorCurso = async (cursoId) => {
    if (!cursoId) {
      setEstudiantes([]);
      setEstudiantesError('');
      return;
    }
    setEstudiantesLoading(true);
    setEstudiantesError('');
    try {
      const data = await getEstudiantes({ cursoId });
      setEstudiantes(data);
    } catch (e) {
      setEstudiantesError(e?.response?.data?.error || e?.message || 'No se pudieron cargar los estudiantes');
    } finally {
      setEstudiantesLoading(false);
    }
  };

  const selectCursoEstudiantes = async (cursoId) => {
    setCursoSeleccionado(cursoId);
    setCursoPickerOpen(false);
    setEstudianteMateriaFiltro(ALL_MATERIAS_OPTION);
    setEstudianteMateriaPickerOpen(false);
    setEstudiantesColegioPickerOpen(false);
    setEstudianteEditing(null);
    setEstudianteEditForm(emptyEstudianteEditForm());
    await loadEstudiantesPorCurso(cursoId);
  };

  const openEstudiantesModal = async () => {
    setEstudiantesModalVisible(true);
    setCursoPickerOpen(false);
    setEstudianteMateriaFiltro(ALL_MATERIAS_OPTION);
    setEstudianteMateriaPickerOpen(false);
    setEstudiantesColegioPickerOpen(false);
    setEstudiantesError('');
    try {
      setLoadingCursos(true);
      const userSchoolOption = user?.schoolId ? [{ id: user.schoolId, nombre: user?.schoolName || `Colegio ${user.schoolId}` }] : [];
      setColegiosOptions(userSchoolOption);
      const defaultSchool = user?.schoolId || colegioSeleccionado || null;
      const options = await loadColegios({ preferId: defaultSchool, preferName: user?.schoolName });
      const selectedSchoolId = defaultSchool || options?.[0]?.id || null;
      setEstudiantesColegioId(selectedSchoolId);
      const cursos = await loadCursosAsignados(selectedSchoolId);
      const firstId = (cursos && cursos[0]?.id) || null;
      setCursoSeleccionado(firstId);
      if (!firstId) {
        setEstudiantes([]);
        setEstudiantesError('No tienes cursos asignados para consultar estudiantes');
        return;
      }
      await loadEstudiantesPorCurso(firstId);
    } catch (e) {
      showAppAlert('Error', e?.response?.data?.error || 'No se pudieron cargar los cursos/estudiantes', 'error');
    } finally {
      setLoadingCursos(false);
    }
  };

  const closeEstudiantesModal = () => {
    setEstudiantesModalVisible(false);
    setCursoPickerOpen(false);
    setEstudianteMateriaFiltro(ALL_MATERIAS_OPTION);
    setEstudianteMateriaPickerOpen(false);
    setEstudiantesColegioPickerOpen(false);
    setEstudiantesColegioId(null);
    setCursoSeleccionado(null);
    setEstudiantes([]);
    setEstudiantesError('');
    setEstudianteEditing(null);
    setEstudianteEditForm(emptyEstudianteEditForm());
  };

  const changeEstudiantesColegio = async (newSchoolId) => {
    const parsedSchoolId = Number(newSchoolId);
    if (!Number.isFinite(parsedSchoolId) || parsedSchoolId <= 0) return;
    setEstudiantesColegioId(parsedSchoolId);
    setEstudiantesColegioPickerOpen(false);
    setCursoPickerOpen(false);
    setEstudianteMateriaFiltro(ALL_MATERIAS_OPTION);
    setEstudianteMateriaPickerOpen(false);
    setEstudianteEditing(null);
    setEstudianteEditForm(emptyEstudianteEditForm());
    setLoadingCursos(true);
    try {
      const cursos = await loadCursosAsignados(parsedSchoolId);
      const firstId = (cursos && cursos[0]?.id) || null;
      setCursoSeleccionado(firstId);
      if (!firstId) {
        setEstudiantes([]);
        setEstudiantesError('No hay cursos asignados en este colegio');
        return;
      }
      await loadEstudiantesPorCurso(firstId);
    } finally {
      setLoadingCursos(false);
    }
  };

  const startEditEstudiante = (estudiante) => {
    setEstudianteEditing(estudiante?.id || null);
    setEstudianteEditForm({
      nombres: estudiante?.nombres || '',
      apellidos: estudiante?.apellidos || '',
      qr: estudiante?.qr || '',
      codigoEstudiante: estudiante?.codigoEstudiante || '',
      materias: Array.isArray(estudiante?.materias) ? estudiante.materias : [],
      acudiente: {
        nombre: estudiante?.acudiente?.nombre || '',
        telefonoE164: estudiante?.acudiente?.telefonoE164 || '',
        parentesco: estudiante?.acudiente?.parentesco || '',
        whatsappOptIn: Boolean(estudiante?.acudiente?.whatsappOptIn)
      }
    });
  };

  const cancelEditEstudiante = () => {
    setEstudianteEditing(null);
    setEstudianteEditForm(emptyEstudianteEditForm());
  };

  const toggleEstudianteEditMateria = (materiaNombre) => {
    const normalizedMateria = normalizeMateriaOption(materiaNombre);
    if (!normalizedMateria) return;
    setEstudianteEditForm((prev) => {
      const current = Array.isArray(prev.materias) ? prev.materias : [];
      const exists = current.some((item) => normalizeMateriaOption(item) === normalizedMateria);
      const materias = exists
        ? current.filter((item) => normalizeMateriaOption(item) !== normalizedMateria)
        : [...current, materiaNombre];
      return { ...prev, materias };
    });
  };

  const handleUpdateEstudiante = async (id) => {
    const nombres = (estudianteEditForm.nombres || '').trim();
    const apellidos = (estudianteEditForm.apellidos || '').trim();
    const qr = (estudianteEditForm.qr || '').trim();
    const codigoEstudiante = (estudianteEditForm.codigoEstudiante || '').trim();
    const materias = Array.from(new Set(
      (Array.isArray(estudianteEditForm.materias) ? estudianteEditForm.materias : [])
        .map((item) => String(item || '').trim())
        .filter(Boolean)
    ));
    if (!nombres || !apellidos || !qr) {
      showAppAlert('Campos requeridos', 'Completa nombres, apellidos y QR', 'warning');
      return;
    }
    const acudiente = normalizeAcudientePayload(estudianteEditForm.acudiente);
    if (acudiente && (!acudiente.nombre || !acudiente.telefonoE164)) {
      showAppAlert('Acudiente incompleto', 'Completa nombre y telefono WhatsApp del acudiente', 'warning');
      return;
    }
    setSavingEstudianteEdit(true);
    try {
      await updateEstudiante(id, { nombres, apellidos, qr, codigoEstudiante, materias, ...(acudiente ? { acudiente } : {}) });
      await loadEstudiantesPorCurso(cursoSeleccionado);
      cancelEditEstudiante();
      showAppAlert('Listo', 'Estudiante actualizado', 'success');
    } catch (e) {
      showAppAlert('Error', getApiErrorMessage(e, 'No se pudo actualizar el estudiante'), 'error');
    } finally {
      setSavingEstudianteEdit(false);
    }
  };

  const askDeleteEstudiante = (estudiante) => {
    setDeleteEstudianteConfirmModal({ visible: true, estudiante: estudiante || null, deleting: false });
  };

  const handleConfirmDeleteEstudiante = async () => {
    const estudiante = deleteEstudianteConfirmModal?.estudiante;
    if (!estudiante?.id) return;
    setDeleteEstudianteConfirmModal((prev) => ({ ...prev, deleting: true }));
    try {
      await deleteEstudiante(estudiante.id);
      await loadEstudiantesPorCurso(cursoSeleccionado);
      if (String(estudianteEditing) === String(estudiante.id)) cancelEditEstudiante();
      setDeleteEstudianteConfirmModal({ visible: false, estudiante: null, deleting: false });
      const nombreCompleto = `${estudiante?.nombres || ''} ${estudiante?.apellidos || ''}`.trim();
      showEstudianteDeleteSuccessModal(nombreCompleto ? `${nombreCompleto} fue eliminado` : 'Estudiante eliminado');
    } catch (e) {
      setDeleteEstudianteConfirmModal((prev) => ({ ...prev, deleting: false }));
      showAppAlert('Error', getApiErrorMessage(e, 'No se pudo eliminar el estudiante'), 'error');
    }
  };

  const sanitizeFileName = (value = '') => String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 70);

  const buildQrJpgBinary = (value = '') => {
    const qr = QRCodeGenerator(0, 'H');
    qr.addData(String(value || ''));
    qr.make();
    const size = qr.getModuleCount();
    const margin = 4;
    const scale = 12;
    const total = (size + margin * 2) * scale;
    const frameData = new Uint8Array(total * total * 4);

    for (let y = 0; y < total; y += 1) {
      for (let x = 0; x < total; x += 1) {
        const pixelIndex = (y * total + x) * 4;
        const qrX = Math.floor(x / scale) - margin;
        const qrY = Math.floor(y / scale) - margin;
        const isDark = qrX >= 0 && qrX < size && qrY >= 0 && qrY < size && qr.isDark(qrY, qrX);
        const color = isDark ? 0 : 255;
        frameData[pixelIndex] = color;
        frameData[pixelIndex + 1] = color;
        frameData[pixelIndex + 2] = color;
        frameData[pixelIndex + 3] = 255;
      }
    }
    const encoded = jpeg.encode({ data: frameData, width: total, height: total }, 92);
    const buffer = encoded?.data;
    if (!buffer) throw new Error('No se pudo codificar el QR en JPG');
    return buffer;
  };

  const downloadEstudiantesQrZip = async () => {
    if (downloadingQrZip) return;
    const studentsWithQr = (Array.isArray(estudiantesFiltrados) ? estudiantesFiltrados : [])
      .filter((item) => String(item?.qr || '').trim());
    if (!studentsWithQr.length) {
      showAppAlert('Sin datos', 'No hay estudiantes con QR para exportar en la vista actual.', 'warning');
      return;
    }

    setDownloadingQrZip(true);
    setQrZipProgress(1);
    try {
      const zip = new JSZip();
      const courseLabel = sanitizeFileName(cursoSeleccionadoNombre || `curso_${cursoSeleccionado || ''}`) || 'curso';

      for (let index = 0; index < studentsWithQr.length; index += 1) {
        const student = studentsWithQr[index];
        const qrValue = String(student?.qr || '').trim();
        const fullName = String(student?.nombre || `${student?.nombres || ''} ${student?.apellidos || ''}`).trim();
        const safeName = sanitizeFileName(fullName) || `estudiante_${index + 1}`;
        const jpgBinary = buildQrJpgBinary(qrValue);
        zip.file(`${String(index + 1).padStart(3, '0')}_${safeName}.jpg`, jpgBinary);
        const buildPct = Math.round(((index + 1) / studentsWithQr.length) * 80);
        setQrZipProgress(Math.max(1, buildPct));
      }

      const zipName = `qrs_${courseLabel}_${new Date().toISOString().slice(0, 10)}.zip`;
      setQrZipProgress(85);

      if (Platform.OS === 'web') {
        setQrZipProgress(92);
        const blob = await zip.generateAsync({ type: 'blob' });
        setQrZipProgress(98);
        const nav = typeof window !== 'undefined' ? window.navigator : null;
        if (nav && typeof nav.msSaveOrOpenBlob === 'function') {
          nav.msSaveOrOpenBlob(blob, zipName);
        } else {
          const url = URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = zipName;
          anchor.style.display = 'none';
          document.body.appendChild(anchor);
          anchor.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          document.body.removeChild(anchor);
          setTimeout(() => URL.revokeObjectURL(url), 1500);
        }
        setQrZipProgress(100);
        setQrZipDownloadModal({ visible: true, message: `ZIP descargado correctamente.\nArchivo: ${zipName}\nRuta: Descargas del navegador.` });
      } else {
        setQrZipProgress(92);
        const zipBase64 = await zip.generateAsync({ type: 'base64' });
        setQrZipProgress(98);
        if (Platform.OS === 'android') {
          const SAF = FileSystemLegacy.StorageAccessFramework;
          const downloadDirUri = SAF.getUriForDirectoryInRoot('Download');
          const permissions = await SAF.requestDirectoryPermissionsAsync(downloadDirUri);
          if (!permissions?.granted || !permissions?.directoryUri) {
            throw new Error('No se otorgó permiso para guardar en la carpeta Download.');
          }
          const baseName = zipName.replace(/\.zip$/i, '');
          let targetFileUri;
          try {
            targetFileUri = await SAF.createFileAsync(permissions.directoryUri, baseName, 'application/zip');
          } catch {
            targetFileUri = await SAF.createFileAsync(permissions.directoryUri, `${baseName}_${Date.now()}`, 'application/zip');
          }
          await SAF.writeAsStringAsync(targetFileUri, zipBase64, {
            encoding: FileSystemLegacy.EncodingType.Base64
          });
          setQrZipProgress(100);
          setQrZipDownloadModal({ visible: true, message: `ZIP generado correctamente.\nArchivo: ${zipName}\nRuta: Download/${zipName}\nURI: ${targetFileUri}` });
        } else {
          const targetDir = FileSystemLegacy.documentDirectory || FileSystemLegacy.cacheDirectory;
          if (!targetDir) throw new Error('No se encontró una carpeta válida para guardar el ZIP.');
          const fileUri = `${targetDir}${zipName}`;
          await FileSystemLegacy.writeAsStringAsync(fileUri, zipBase64, {
            encoding: FileSystemLegacy.EncodingType.Base64
          });
          setQrZipProgress(100);
          try {
            const Sharing = await import('expo-sharing');
            if (await Sharing.isAvailableAsync()) {
              await Sharing.shareAsync(fileUri, {
                mimeType: 'application/zip',
                dialogTitle: 'QR de estudiantes'
              });
            }
          } catch {}
          setQrZipDownloadModal({ visible: true, message: `ZIP generado correctamente.\nArchivo: ${zipName}\nRuta: ${fileUri}` });
        }
      }
    } catch (e) {
      setQrZipErrorModal({
        visible: true,
        message: getApiErrorMessage(e, `No se pudo generar ni descargar el ZIP de códigos QR${e?.message ? `: ${e.message}` : ''}`)
      });
    } finally {
      setDownloadingQrZip(false);
      setQrZipProgress(0);
    }
  };

  const downloadExcelTemplate = async () => {
    if (downloadingTemplate) return;
    setDownloadingTemplate(true);
    try {
      const ExcelJSModule = await import('exceljs');
      const ExcelJS = ExcelJSModule?.default || ExcelJSModule;
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Plantilla');
      worksheet.columns = [
        { header: 'codigo', key: 'codigo', width: 20 },
        { header: 'nombre', key: 'nombre', width: 28 },
        { header: 'apellidos', key: 'apellidos', width: 28 }
      ];
      worksheet.getRow(1).font = { bold: true };
      worksheet.getCell('A1').protection = { locked: true };
      worksheet.getCell('B1').protection = { locked: true };
      worksheet.getCell('C1').protection = { locked: true };
      worksheet.getColumn(1).style = { protection: { locked: false } };
      worksheet.getColumn(2).style = { protection: { locked: false } };
      worksheet.getColumn(3).style = { protection: { locked: false } };
      await worksheet.protect('plantilla_edusac', {
        selectLockedCells: false,
        selectUnlockedCells: true,
        formatCells: false,
        formatColumns: false,
        formatRows: false,
        insertColumns: false,
        insertRows: false,
        insertHyperlinks: false,
        deleteColumns: false,
        deleteRows: false,
        sort: false,
        autoFilter: false,
        pivotTables: false
      });
      const fileName = `plantilla_estudiantes_${new Date().toISOString().slice(0, 10)}.xlsx`;

      if (Platform.OS === 'web') {
        const xlsxArrayBuffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([xlsxArrayBuffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const nav = typeof window !== 'undefined' ? window.navigator : null;
        if (nav && typeof nav.msSaveOrOpenBlob === 'function') {
          nav.msSaveOrOpenBlob(blob, fileName);
        } else {
          const url = URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = fileName;
          anchor.style.display = 'none';
          document.body.appendChild(anchor);
          anchor.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          document.body.removeChild(anchor);
          setTimeout(() => URL.revokeObjectURL(url), 1500);
        }
        showAppAlert('Listo', 'Plantilla Excel descargada.', 'success');
      } else {
        const xlsxArrayBuffer = await workbook.xlsx.writeBuffer();
        const bytes = new Uint8Array(xlsxArrayBuffer);
        const chunkSize = 0x8000;
        let binary = '';
        for (let i = 0; i < bytes.length; i += chunkSize) {
          const chunk = bytes.subarray(i, i + chunkSize);
          binary += String.fromCharCode(...chunk);
        }
        const xlsxBase64 = typeof btoa === 'function'
          ? btoa(binary)
          : (typeof Buffer !== 'undefined' ? Buffer.from(bytes).toString('base64') : '');
        if (!xlsxBase64) throw new Error('No se pudo convertir la plantilla a base64');
        const targetDir = FileSystemLegacy.documentDirectory || FileSystemLegacy.cacheDirectory;
        if (!targetDir) throw new Error('No se encontro una carpeta valida para guardar la plantilla');
        const fileUri = `${targetDir}${fileName}`;
        await FileSystemLegacy.writeAsStringAsync(fileUri, xlsxBase64, {
          encoding: FileSystemLegacy.EncodingType.Base64
        });
        try {
          const Sharing = await import('expo-sharing');
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri, {
              mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              dialogTitle: 'Plantilla de estudiantes'
            });
          }
        } catch {}
        showAppAlert('Listo', 'Plantilla Excel generada.', 'success');
      }
    } catch (e) {
      showAppAlert('Error', getApiErrorMessage(e, `No se pudo descargar la plantilla${e?.message ? `: ${e.message}` : ''}`), 'error');
    } finally {
      setDownloadingTemplate(false);
    }
  };

  const buildAutoQrCode = (nombres = '', apellidos = '', seed = '') => {
    const normalizeChunk = (value) => String(value || '')
      .trim()
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Z0-9]+/g, '')
      .slice(0, 6);
    const baseNombres = normalizeChunk(nombres) || 'EST';
    const baseApellidos = normalizeChunk(apellidos) || 'AUTO';
    const randomChunk = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}${String(seed || '')}`
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 10);
    return `QR-${baseNombres}-${baseApellidos}-${randomChunk}`;
  };

  const parseSpreadsheetRows = async (fileData) => {
    if (!fileData) return { students: [], invalidRows: [] };
    const ExcelJSModule = await import('exceljs');
    const ExcelJS = ExcelJSModule?.default || ExcelJSModule;
    const workbook = new ExcelJS.Workbook();
    const source = fileData?.arrayBuffer || (
      fileData?.base64 && typeof Buffer !== 'undefined'
        ? Buffer.from(String(fileData.base64), 'base64')
        : null
    );
    if (!source) return { students: [], invalidRows: [] };
    await workbook.xlsx.load(source);
    const firstSheet = workbook.worksheets?.[0];
    if (!firstSheet) return { students: [], invalidRows: [] };
    const getCellText = (cell) => {
      const value = cell?.value;
      if (value === undefined || value === null) return '';
      if (typeof value === 'object') {
        if (value.text) return String(value.text);
        if (value.result !== undefined && value.result !== null) return String(value.result);
        if (Array.isArray(value.richText)) return value.richText.map((item) => item.text || '').join('');
        if (value.hyperlink && value.text) return String(value.text);
      }
      return String(value);
    };
    const matrix = [];
    for (let rowNumber = 1; rowNumber <= firstSheet.rowCount; rowNumber += 1) {
      const row = firstSheet.getRow(rowNumber);
      const values = [];
      for (let colNumber = 1; colNumber <= Math.max(firstSheet.columnCount, 3); colNumber += 1) {
        values.push(getCellText(row.getCell(colNumber)));
      }
      matrix.push(values);
    }
    if (!Array.isArray(matrix) || matrix.length < 2) return { students: [], invalidRows: [] };

    const normalizeHeader = (value = '') => String(value || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const headers = (Array.isArray(matrix[0]) ? matrix[0] : []).map(normalizeHeader);
    const nonEmptyHeaders = headers.filter(Boolean);
    const allowedHeaders = new Set([
      'codigo',
      'nombre',
      'nombres',
      'apellidos',
      'codigo estudiante',
      'codigoestudiante',
      'codigo_de_estudiante',
      'codigo de estudiante'
    ]);
    const hasInvalidHeader = nonEmptyHeaders.some((header) => !allowedHeaders.has(header));
    const nameHeadersCount = nonEmptyHeaders.filter((header) => header === 'nombre' || header === 'nombres').length;
    const lastNameHeadersCount = nonEmptyHeaders.filter((header) => header === 'apellidos').length;
    const studentCodeHeaders = new Set(['codigo', 'codigo estudiante', 'codigoestudiante', 'codigo_de_estudiante', 'codigo de estudiante']);
    const studentCodeHeadersCount = nonEmptyHeaders.filter((header) => studentCodeHeaders.has(header)).length;
    if (hasInvalidHeader || nonEmptyHeaders.length !== 3 || nameHeadersCount !== 1 || lastNameHeadersCount !== 1 || studentCodeHeadersCount !== 1) {
      return { students: [], invalidRows: [] };
    }
    const idxNombres = headers.indexOf('nombres') >= 0 ? headers.indexOf('nombres') : headers.indexOf('nombre');
    const idxApellidos = headers.indexOf('apellidos');
    const idxCodigo = headers.findIndex((header) => studentCodeHeaders.has(header));
    if (idxNombres < 0 || idxApellidos < 0 || idxCodigo < 0) return { students: [], invalidRows: [] };

    const parsedRows = matrix.slice(1).map((row = [], index) => {
      const cols = Array.isArray(row) ? row : [];
      const nombres = String(cols[idxNombres] || '').trim();
      const apellidos = String(cols[idxApellidos] || '').trim();
      const codigoEstudiante = String(cols[idxCodigo] || '').trim();
      return {
        excelRow: index + 2,
        nombres,
        apellidos,
        qr: buildAutoQrCode(nombres, apellidos, `xls-${index + 1}`),
        codigoEstudiante
      };
    });

    const invalidRows = parsedRows
      .filter((row) => !row.nombres || !row.apellidos || !row.codigoEstudiante)
      .map((row) => row.excelRow);
    const students = parsedRows
      .filter((row) => row.nombres && row.apellidos && row.codigoEstudiante)
      .map(({ excelRow, ...rest }) => rest);

    return { students, invalidRows };
  };

  const openCreateEstudianteModal = async (preferredCursoId = null) => {
    setEstudianteCreateModalVisible(true);
    setEstudianteCreateCursoPickerOpen(false);
    setEstudianteCreateError('');
    setEstudianteCreateForm(emptyEstudianteCreateForm());
    setEstudianteCreateMaterias([]);
    setSelectedCsvFile(null);
    setUploadedStudents([]);
    setLoadingCursos(true);
    try {
      const schoolId = user?.schoolId || null;
      const cursos = await loadCursosAsignados(schoolId);
      const preferredExists = cursos.some((curso) => String(curso.id) === String(preferredCursoId));
      const nextCursoId = preferredExists ? preferredCursoId : (cursos?.[0]?.id || null);
      setEstudianteCreateCursoId(nextCursoId);
      setEstudianteCreateMaterias(getMateriasDisponiblesByCurso(nextCursoId));
    } catch (e) {
      setEstudianteCreateError(e?.response?.data?.error || 'No se pudieron cargar los cursos');
    } finally {
      setLoadingCursos(false);
    }
  };

  const changeEstudianteCreateCurso = (cursoId) => {
    setEstudianteCreateCursoId(cursoId);
    setEstudianteCreateCursoPickerOpen(false);
    setEstudianteCreateMaterias(getMateriasDisponiblesByCurso(cursoId));
  };

  const toggleEstudianteCreateMateria = (materiaNombre) => {
    const materia = String(materiaNombre || '').trim();
    const materiaKey = normalizeMateriaOption(materia);
    if (!materiaKey) return;
    setEstudianteCreateMaterias((prev) => {
      const exists = prev.some((item) => normalizeMateriaOption(item) === materiaKey);
      if (exists) return prev.filter((item) => normalizeMateriaOption(item) !== materiaKey);
      return [...prev, materia];
    });
  };

  const closeCreateEstudianteModal = () => {
    clearUploadTemplateSuccessTimeout();
    setEstudianteCreateModalVisible(false);
    setEstudianteCreateCursoPickerOpen(false);
    setEstudianteCreateError('');
    setEstudianteCreateCursoId(null);
    setEstudianteCreateMaterias([]);
    setEstudianteCreateForm(emptyEstudianteCreateForm());
    setSelectedCsvFile(null);
    setUploadedStudents([]);
    setUploadTemplateSuccessModal({ visible: false, message: '' });
    setEstudiantesExistentesModal({ visible: false, students: [], created: 0 });
    setSavingEstudiante(false);
  };

  const uploadStudentsFromFile = async (fileData) => {
    const cursoId = Number(estudianteCreateCursoId);
    const materiasSeleccionadas = estudianteCreateMaterias.filter((materia) => (
      estudianteCreateMateriasDisponibles.some((item) => normalizeMateriaOption(item) === normalizeMateriaOption(materia))
    ));
    if (!Number.isFinite(cursoId) || cursoId <= 0) {
      setEstudianteCreateError('Selecciona un curso antes de subir el archivo');
      return;
    }
    if (estudianteCreateMateriasDisponibles.length > 0 && materiasSeleccionadas.length === 0) {
      setEstudianteCreateError('Selecciona al menos una materia del curso');
      return;
    }
    if (!fileData?.arrayBuffer && !fileData?.base64) {
      setEstudianteCreateError('Primero selecciona un archivo XLSX');
      return;
    }
    const parsed = await parseSpreadsheetRows(fileData);
    const estudiantesLote = Array.isArray(parsed?.students) ? parsed.students : [];
    const invalidRows = Array.isArray(parsed?.invalidRows) ? parsed.invalidRows : [];
    if (invalidRows.length > 0) {
      setEstudianteCreateError(`Hay filas incompletas en el Excel (${invalidRows.join(', ')}). Debes completar codigo, nombre(s) y apellidos.`);
      return;
    }
    if (!estudiantesLote.length) {
      setEstudianteCreateError('Archivo Excel invalido. Las columnas obligatorias son: codigo, nombre(s) y apellidos');
      return;
    }
    setSavingEstudiante(true);
    setEstudianteCreateError('');
    try {
      const estudiantesCurso = await getEstudiantes({ cursoId });
      const existingDbNameKeys = new Set(
        (Array.isArray(estudiantesCurso) ? estudiantesCurso : [])
          .map((student) => normalizeStudentIdentityKey(student))
          .filter(Boolean)
      );
      const existingDbCodeKeys = new Set(
        (Array.isArray(estudiantesCurso) ? estudiantesCurso : [])
          .map((student) => normalizeStudentCodeKey(student))
          .filter(Boolean)
      );
      const seenFileNameKeys = new Set();
      const seenFileCodeKeys = new Set();
      const estudiantesNuevos = [];
      const estudiantesOmitidos = [];

      estudiantesLote.forEach((student) => {
        const nameKey = normalizeStudentIdentityKey(student);
        const codeKey = normalizeStudentCodeKey(student);
        if (!nameKey || !codeKey) return;
        if (existingDbCodeKeys.has(codeKey) && existingDbNameKeys.has(nameKey)) {
          estudiantesOmitidos.push({ ...student, motivo: 'Ya existe en este curso (codigo y nombre)' });
          return;
        }
        if (existingDbCodeKeys.has(codeKey)) {
          estudiantesOmitidos.push({ ...student, motivo: 'Ya existe en este curso (codigo)' });
          return;
        }
        if (existingDbNameKeys.has(nameKey)) {
          estudiantesOmitidos.push({ ...student, motivo: 'Ya existe en este curso (nombre y apellidos)' });
          return;
        }
        if (seenFileCodeKeys.has(codeKey) && seenFileNameKeys.has(nameKey)) {
          estudiantesOmitidos.push({ ...student, motivo: 'Duplicado dentro del archivo (codigo y nombre)' });
          return;
        }
        if (seenFileCodeKeys.has(codeKey)) {
          estudiantesOmitidos.push({ ...student, motivo: 'Duplicado dentro del archivo (codigo)' });
          return;
        }
        if (seenFileNameKeys.has(nameKey)) {
          estudiantesOmitidos.push({ ...student, motivo: 'Duplicado dentro del archivo (nombre y apellidos)' });
          return;
        }
        seenFileNameKeys.add(nameKey);
        seenFileCodeKeys.add(codeKey);
        estudiantesNuevos.push(student);
      });

      if (estudiantesNuevos.length === 0) {
        setUploadedStudents([]);
        setEstudiantesExistentesModal({ visible: true, students: estudiantesOmitidos, created: 0 });
        setEstudianteCreateError('No hay estudiantes nuevos para subir. Revisa los duplicados mostrados.');
        return;
      }

      const data = await createEstudiantesLote({ cursoId, estudiantes: estudiantesNuevos, materias: materiasSeleccionadas });
      const createdCount = Number(data?.created || 0) || estudiantesNuevos.length;
      setUploadedStudents(Array.isArray(data?.students) ? data.students : estudiantesNuevos);
      if (estudiantesOmitidos.length > 0) {
        setEstudiantesExistentesModal({ visible: true, students: estudiantesOmitidos, created: createdCount });
      }
      showUploadTemplateSuccessModal(`Estudiantes cargados correctamente (${createdCount}).`);
    } catch (e) {
      setEstudianteCreateError(getApiErrorMessage(e, 'No se pudo subir el archivo Excel'));
    } finally {
      setSavingEstudiante(false);
    }
  };

  const handleImportCsv = async () => {
    setEstudianteCreateError('');
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      input.onchange = async (event) => {
        const file = event?.target?.files?.[0];
        if (!file) return;
        const dotIdx = file.name.lastIndexOf('.');
        const ext = dotIdx >= 0 ? file.name.slice(dotIdx + 1).toLowerCase() : '';
        if (ext !== 'xlsx') {
          setEstudianteCreateError('El archivo debe ser .xlsx');
          return;
        }
        const arrayBuffer = await file.arrayBuffer();
        const nextFile = { name: file.name, ext, arrayBuffer };
        setSelectedCsvFile(nextFile);
        await uploadStudentsFromFile(nextFile);
      };
      input.click();
      return;
    }

    try {
      const DocumentPicker = await import('expo-document-picker');
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/octet-stream'
        ],
        copyToCacheDirectory: true,
        multiple: false
      });
      if (result.canceled) return;
      const file = result.assets?.[0];
      if (!file?.uri) return;
      const name = file.name || file.uri.split('/').pop() || 'archivo.xlsx';
      const dotIdx = name.lastIndexOf('.');
      const ext = dotIdx >= 0 ? name.slice(dotIdx + 1).toLowerCase() : '';
      if (ext !== 'xlsx') {
        setEstudianteCreateError('El archivo debe ser .xlsx');
        return;
      }
      const base64 = await FileSystemLegacy.readAsStringAsync(file.uri, { encoding: FileSystemLegacy.EncodingType.Base64 });
      const nextFile = { name, ext, base64 };
      setSelectedCsvFile(nextFile);
      await uploadStudentsFromFile(nextFile);
    } catch {
      setEstudianteCreateError('No se pudo abrir el selector de archivos del dispositivo.');
    }
  };

  const handleUploadCsv = async () => {
    if (!selectedCsvFile?.arrayBuffer && !selectedCsvFile?.base64) {
      setEstudianteCreateError('Primero selecciona un archivo XLSX');
      return;
    }
    await uploadStudentsFromFile(selectedCsvFile);
  };

  const handleCreateEstudiante = async () => {
    const nombres = (estudianteCreateForm.nombres || '').trim();
    const apellidos = (estudianteCreateForm.apellidos || '').trim();
    const codigoEstudiante = (estudianteCreateForm.codigoEstudiante || '').trim();
    const qr = buildAutoQrCode(nombres, apellidos, 'manual');
    const cursoId = Number(estudianteCreateCursoId);
    const materiasSeleccionadas = estudianteCreateMaterias.filter((materia) => (
      estudianteCreateMateriasDisponibles.some((item) => normalizeMateriaOption(item) === normalizeMateriaOption(materia))
    ));
    if (!nombres || !apellidos || !codigoEstudiante) {
      setEstudianteCreateError('Completa nombres, apellidos y codigo del estudiante');
      return;
    }
    if (!Number.isFinite(cursoId) || cursoId <= 0) {
      setEstudianteCreateError('Selecciona un curso');
      return;
    }
    if (estudianteCreateMateriasDisponibles.length > 0 && materiasSeleccionadas.length === 0) {
      setEstudianteCreateError('Selecciona al menos una materia del curso');
      return;
    }
    const acudiente = normalizeAcudientePayload(estudianteCreateForm.acudiente);
    if (acudiente && (!acudiente.nombre || !acudiente.telefonoE164)) {
      setEstudianteCreateError('Completa nombre y telefono WhatsApp del acudiente');
      return;
    }
    setSavingEstudiante(true);
    setEstudianteCreateError('');
    try {
      await createEstudiante({ nombres, apellidos, qr, codigoEstudiante, cursoId, materias: materiasSeleccionadas, ...(acudiente ? { acudiente } : {}) });
      showAppAlert('Listo', 'Estudiante agregado correctamente', 'success');
      closeCreateEstudianteModal();
    } catch (e) {
      setEstudianteCreateError(getApiErrorMessage(e, 'No se pudo agregar el estudiante'));
    } finally {
      setSavingEstudiante(false);
    }
  };

  useEffect(() => {
    if (!estudianteCreateModalVisible || !estudianteCreateCursoId) return;
    const disponibles = getMateriasDisponiblesByCurso(estudianteCreateCursoId);
    setEstudianteCreateMaterias((prev) => {
      if (!disponibles.length) return [];
      const next = prev.filter((materia) => disponibles.some((item) => normalizeMateriaOption(item) === normalizeMateriaOption(materia)));
      return next.length ? next : disponibles;
    });
  }, [estudianteCreateCursoId, estudianteCreateModalVisible]);

  useEffect(() => {
    if (!estudiantesModalVisible || estudianteMateriaFiltro === ALL_MATERIAS_OPTION) return;
    const disponibles = cursoSeleccionado ? getEstudianteMateriaOptionsByCurso(cursoSeleccionado, estudiantes) : [];
    const exists = disponibles.some((materia) => normalizeMateriaOption(materia) === normalizeMateriaOption(estudianteMateriaFiltro));
    if (!exists) {
      setEstudianteMateriaFiltro(ALL_MATERIAS_OPTION);
    }
  }, [cursoSeleccionado, estudianteMateriaFiltro, estudiantes, estudiantesModalVisible]);

  return {
    loadEstudiantesPorCurso,
    selectCursoEstudiantes,
    openEstudiantesModal,
    closeEstudiantesModal,
    changeEstudiantesColegio,
    startEditEstudiante,
    cancelEditEstudiante,
    toggleEstudianteEditMateria,
    handleUpdateEstudiante,
    askDeleteEstudiante,
    handleConfirmDeleteEstudiante,
    downloadEstudiantesQrZip,
    downloadExcelTemplate,
    openCreateEstudianteModal,
    changeEstudianteCreateCurso,
    toggleEstudianteCreateMateria,
    closeCreateEstudianteModal,
    handleImportCsv,
    handleUploadCsv,
    handleCreateEstudiante
  };
}
