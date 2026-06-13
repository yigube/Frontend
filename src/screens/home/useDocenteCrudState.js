import { useRef, useState } from 'react';

export default function useDocenteCrudState() {
  const docenteCursosReturnTargetRef = useRef('create');
  const [docentesModalVisible, setDocentesModalVisible] = useState(false);
  const [docentePanelModalVisible, setDocentePanelModalVisible] = useState(false);
  const [docentes, setDocentes] = useState([]);
  const [docentesLoading, setDocentesLoading] = useState(false);
  const [docentesError, setDocentesError] = useState('');
  const [adminDocentesSearchTerm, setAdminDocentesSearchTerm] = useState('');
  const [docentesSearchTerm, setDocentesSearchTerm] = useState('');
  const [docentesSearchOpen, setDocentesSearchOpen] = useState(false);
  const [docenteCrudModalVisible, setDocenteCrudModalVisible] = useState(false);
  const [adminDocenteEditModalVisible, setAdminDocenteEditModalVisible] = useState(false);
  const [returnToDocenteListAfterEdit, setReturnToDocenteListAfterEdit] = useState(false);
  const [docenteCrudListModalVisible, setDocenteCrudListModalVisible] = useState(false);
  const [docenteNivelModalVisible, setDocenteNivelModalVisible] = useState(false);
  const [docenteCursosModalVisible, setDocenteCursosModalVisible] = useState(false);
  const [docenteForm, setDocenteForm] = useState({ nombre: '', email: '', password: '' });
  const [docenteNivel, setDocenteNivel] = useState('');
  const [docenteSedeId, setDocenteSedeId] = useState(null);
  const [docenteNivelPickerOpen, setDocenteNivelPickerOpen] = useState(false);
  const [docenteSedePickerOpen, setDocenteSedePickerOpen] = useState(false);
  const [showDocentePassword, setShowDocentePassword] = useState(false);
  const [docenteCursos, setDocenteCursos] = useState([]);
  const [docenteCursosDisponibles, setDocenteCursosDisponibles] = useState([]);
  const [docenteColegioId, setDocenteColegioId] = useState(null);
  const [docenteColegioPickerOpen, setDocenteColegioPickerOpen] = useState(false);
  const [docenteEditing, setDocenteEditing] = useState(null);
  const [savingDocente, setSavingDocente] = useState(false);
  const [docenteError, setDocenteError] = useState('');
  const [docenteMateriasDraft, setDocenteMateriasDraft] = useState({});
  const [deleteDocenteModal, setDeleteDocenteModal] = useState({ visible: false, docente: null });
  const docenteCrudSchoolRef = useRef(null);
  const docenteMateriasDraftRef = useRef({});

  return {
    docenteCursosReturnTargetRef,
    docentesModalVisible,
    setDocentesModalVisible,
    docentePanelModalVisible,
    setDocentePanelModalVisible,
    docentes,
    setDocentes,
    docentesLoading,
    setDocentesLoading,
    docentesError,
    setDocentesError,
    adminDocentesSearchTerm,
    setAdminDocentesSearchTerm,
    docentesSearchTerm,
    setDocentesSearchTerm,
    docentesSearchOpen,
    setDocentesSearchOpen,
    docenteCrudModalVisible,
    setDocenteCrudModalVisible,
    adminDocenteEditModalVisible,
    setAdminDocenteEditModalVisible,
    returnToDocenteListAfterEdit,
    setReturnToDocenteListAfterEdit,
    docenteCrudListModalVisible,
    setDocenteCrudListModalVisible,
    docenteNivelModalVisible,
    setDocenteNivelModalVisible,
    docenteCursosModalVisible,
    setDocenteCursosModalVisible,
    docenteForm,
    setDocenteForm,
    docenteNivel,
    setDocenteNivel,
    docenteSedeId,
    setDocenteSedeId,
    docenteNivelPickerOpen,
    setDocenteNivelPickerOpen,
    docenteSedePickerOpen,
    setDocenteSedePickerOpen,
    showDocentePassword,
    setShowDocentePassword,
    docenteCursos,
    setDocenteCursos,
    docenteCursosDisponibles,
    setDocenteCursosDisponibles,
    docenteColegioId,
    setDocenteColegioId,
    docenteColegioPickerOpen,
    setDocenteColegioPickerOpen,
    docenteEditing,
    setDocenteEditing,
    savingDocente,
    setSavingDocente,
    docenteError,
    setDocenteError,
    docenteMateriasDraft,
    setDocenteMateriasDraft,
    deleteDocenteModal,
    setDeleteDocenteModal,
    docenteCrudSchoolRef,
    docenteMateriasDraftRef
  };
}
