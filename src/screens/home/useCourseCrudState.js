import { useState } from 'react';

export default function useCourseCrudState() {
  const [adminCursosModalVisible, setAdminCursosModalVisible] = useState(false);
  const [rectorCursosModalVisible, setRectorCursosModalVisible] = useState(false);
  const [rectorSedesModalVisible, setRectorSedesModalVisible] = useState(false);
  const [deleteCursoModal, setDeleteCursoModal] = useState({ visible: false, curso: null });
  const [cursoCrudColegioId, setCursoCrudColegioId] = useState(null);
  const [cursoCrudPickerOpen, setCursoCrudPickerOpen] = useState(false);
  const [loadingCursos, setLoadingCursos] = useState(false);
  const [adminCursoFormVisible, setAdminCursoFormVisible] = useState(false);
  const [adminCursoNombre, setAdminCursoNombre] = useState('');
  const [adminCursoNivel, setAdminCursoNivel] = useState('');
  const [adminCursoSedeId, setAdminCursoSedeId] = useState(null);
  const [adminCursoNivelPickerOpen, setAdminCursoNivelPickerOpen] = useState(false);
  const [adminCursoSedePickerOpen, setAdminCursoSedePickerOpen] = useState(false);
  const [adminCursoEditing, setAdminCursoEditing] = useState(null);
  const [rectorCursoFormVisible, setRectorCursoFormVisible] = useState(false);
  const [rectorCursoNombre, setRectorCursoNombre] = useState('');
  const [rectorCursoNivel, setRectorCursoNivel] = useState('');
  const [rectorCursoSedeId, setRectorCursoSedeId] = useState(null);
  const [rectorCursoNivelPickerOpen, setRectorCursoNivelPickerOpen] = useState(false);
  const [rectorCursoSedePickerOpen, setRectorCursoSedePickerOpen] = useState(false);
  const [rectorCursoEditing, setRectorCursoEditing] = useState(null);
  const [savingCurso, setSavingCurso] = useState(false);
  const [sedeFormVisible, setSedeFormVisible] = useState(false);
  const [returnToRectorSedesAfterForm, setReturnToRectorSedesAfterForm] = useState(false);
  const [sedeNombre, setSedeNombre] = useState('');
  const [sedeEditing, setSedeEditing] = useState(null);
  const [savingSede, setSavingSede] = useState(false);
  const [sedeError, setSedeError] = useState('');

  return {
    adminCursosModalVisible,
    setAdminCursosModalVisible,
    rectorCursosModalVisible,
    setRectorCursosModalVisible,
    rectorSedesModalVisible,
    setRectorSedesModalVisible,
    deleteCursoModal,
    setDeleteCursoModal,
    cursoCrudColegioId,
    setCursoCrudColegioId,
    cursoCrudPickerOpen,
    setCursoCrudPickerOpen,
    loadingCursos,
    setLoadingCursos,
    adminCursoFormVisible,
    setAdminCursoFormVisible,
    adminCursoNombre,
    setAdminCursoNombre,
    adminCursoNivel,
    setAdminCursoNivel,
    adminCursoSedeId,
    setAdminCursoSedeId,
    adminCursoNivelPickerOpen,
    setAdminCursoNivelPickerOpen,
    adminCursoSedePickerOpen,
    setAdminCursoSedePickerOpen,
    adminCursoEditing,
    setAdminCursoEditing,
    rectorCursoFormVisible,
    setRectorCursoFormVisible,
    rectorCursoNombre,
    setRectorCursoNombre,
    rectorCursoNivel,
    setRectorCursoNivel,
    rectorCursoSedeId,
    setRectorCursoSedeId,
    rectorCursoNivelPickerOpen,
    setRectorCursoNivelPickerOpen,
    rectorCursoSedePickerOpen,
    setRectorCursoSedePickerOpen,
    rectorCursoEditing,
    setRectorCursoEditing,
    savingCurso,
    setSavingCurso,
    sedeFormVisible,
    setSedeFormVisible,
    returnToRectorSedesAfterForm,
    setReturnToRectorSedesAfterForm,
    sedeNombre,
    setSedeNombre,
    sedeEditing,
    setSedeEditing,
    savingSede,
    setSavingSede,
    sedeError,
    setSedeError
  };
}
