import { useState } from 'react';

export const EMPTY_ACUDIENTE_FORM = {
  nombre: '',
  telefonoE164: '',
  parentesco: '',
  whatsappOptIn: false
};

export default function useEstudianteCrudState(allMateriasOption) {
  const [estudiantesModalVisible, setEstudiantesModalVisible] = useState(false);
  const [estudiantes, setEstudiantes] = useState([]);
  const [estudiantesLoading, setEstudiantesLoading] = useState(false);
  const [estudiantesError, setEstudiantesError] = useState('');
  const [downloadingQrZip, setDownloadingQrZip] = useState(false);
  const [qrZipProgress, setQrZipProgress] = useState(0);
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);
  const [deleteEstudianteConfirmModal, setDeleteEstudianteConfirmModal] = useState({ visible: false, estudiante: null, deleting: false });
  const [estudiantesExistentesModal, setEstudiantesExistentesModal] = useState({ visible: false, students: [], created: 0 });
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [cursoPickerOpen, setCursoPickerOpen] = useState(false);
  const [estudianteMateriaFiltro, setEstudianteMateriaFiltro] = useState(allMateriasOption);
  const [estudianteMateriaPickerOpen, setEstudianteMateriaPickerOpen] = useState(false);
  const [estudiantesColegioId, setEstudiantesColegioId] = useState(null);
  const [estudiantesColegioPickerOpen, setEstudiantesColegioPickerOpen] = useState(false);
  const [estudianteCreateModalVisible, setEstudianteCreateModalVisible] = useState(false);
  const [estudianteCreateCursoId, setEstudianteCreateCursoId] = useState(null);
  const [estudianteCreateCursoPickerOpen, setEstudianteCreateCursoPickerOpen] = useState(false);
  const [estudianteCreateForm, setEstudianteCreateForm] = useState({ nombres: '', apellidos: '', codigoEstudiante: '', acudiente: EMPTY_ACUDIENTE_FORM });
  const [estudianteCreateMaterias, setEstudianteCreateMaterias] = useState([]);
  const [selectedCsvFile, setSelectedCsvFile] = useState(null);
  const [uploadedStudents, setUploadedStudents] = useState([]);
  const [estudianteCreateError, setEstudianteCreateError] = useState('');
  const [savingEstudiante, setSavingEstudiante] = useState(false);
  const [estudianteEditing, setEstudianteEditing] = useState(null);
  const [estudianteEditForm, setEstudianteEditForm] = useState({ nombres: '', apellidos: '', qr: '', codigoEstudiante: '', materias: [], acudiente: EMPTY_ACUDIENTE_FORM });
  const [savingEstudianteEdit, setSavingEstudianteEdit] = useState(false);

  return {
    estudiantesModalVisible,
    setEstudiantesModalVisible,
    estudiantes,
    setEstudiantes,
    estudiantesLoading,
    setEstudiantesLoading,
    estudiantesError,
    setEstudiantesError,
    downloadingQrZip,
    setDownloadingQrZip,
    qrZipProgress,
    setQrZipProgress,
    downloadingTemplate,
    setDownloadingTemplate,
    deleteEstudianteConfirmModal,
    setDeleteEstudianteConfirmModal,
    estudiantesExistentesModal,
    setEstudiantesExistentesModal,
    cursoSeleccionado,
    setCursoSeleccionado,
    cursoPickerOpen,
    setCursoPickerOpen,
    estudianteMateriaFiltro,
    setEstudianteMateriaFiltro,
    estudianteMateriaPickerOpen,
    setEstudianteMateriaPickerOpen,
    estudiantesColegioId,
    setEstudiantesColegioId,
    estudiantesColegioPickerOpen,
    setEstudiantesColegioPickerOpen,
    estudianteCreateModalVisible,
    setEstudianteCreateModalVisible,
    estudianteCreateCursoId,
    setEstudianteCreateCursoId,
    estudianteCreateCursoPickerOpen,
    setEstudianteCreateCursoPickerOpen,
    estudianteCreateForm,
    setEstudianteCreateForm,
    estudianteCreateMaterias,
    setEstudianteCreateMaterias,
    selectedCsvFile,
    setSelectedCsvFile,
    uploadedStudents,
    setUploadedStudents,
    estudianteCreateError,
    setEstudianteCreateError,
    savingEstudiante,
    setSavingEstudiante,
    estudianteEditing,
    setEstudianteEditing,
    estudianteEditForm,
    setEstudianteEditForm,
    savingEstudianteEdit,
    setSavingEstudianteEdit
  };
}
