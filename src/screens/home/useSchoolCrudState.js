import { useRef, useState } from 'react';

export default function useSchoolCrudState() {
  const [colegioSeleccionado, setColegioSeleccionado] = useState(null);
  const [colegiosOptions, setColegiosOptions] = useState([]);
  const [colegioPickerOpen, setColegioPickerOpen] = useState(false);
  const [colegiosLoading, setColegiosLoading] = useState(false);
  const [colegiosModalVisible, setColegiosModalVisible] = useState(false);
  const [colegiosListModalVisible, setColegiosListModalVisible] = useState(false);
  const [colegiosList, setColegiosList] = useState([]);
  const [colegiosListView, setColegiosListView] = useState('colegios');
  const [rectoresSearchTerm, setRectoresSearchTerm] = useState('');
  const [colegioNombre, setColegioNombre] = useState('');
  const [colegioCodigoDane, setColegioCodigoDane] = useState('');
  const [rectorNombre, setRectorNombre] = useState('');
  const [rectorApellido, setRectorApellido] = useState('');
  const [rectorCorreo, setRectorCorreo] = useState('');
  const [rectorTelefono, setRectorTelefono] = useState('');
  const [rectorCedula, setRectorCedula] = useState('');
  const [rectorCargo, setRectorCargo] = useState('rector');
  const [rectorPassword, setRectorPassword] = useState('');
  const [showRectorPassword, setShowRectorPassword] = useState(false);
  const [hasRectorPassword, setHasRectorPassword] = useState(false);
  const [deleteColegioModal, setDeleteColegioModal] = useState({ visible: false, colegio: null });
  const [rectorEditing, setRectorEditing] = useState(null);
  const [rectorEditModalVisible, setRectorEditModalVisible] = useState(false);
  const [deleteRectorModal, setDeleteRectorModal] = useState({ visible: false, rector: null });
  const [daneExistsModal, setDaneExistsModal] = useState({ visible: false, message: '' });
  const [colegioEditing, setColegioEditing] = useState(null);
  const [savingColegio, setSavingColegio] = useState(false);
  const [colegiosError, setColegiosError] = useState('');
  const colegiosScrollRef = useRef(null);

  return {
    colegioSeleccionado,
    setColegioSeleccionado,
    colegiosOptions,
    setColegiosOptions,
    colegioPickerOpen,
    setColegioPickerOpen,
    colegiosLoading,
    setColegiosLoading,
    colegiosModalVisible,
    setColegiosModalVisible,
    colegiosListModalVisible,
    setColegiosListModalVisible,
    colegiosList,
    setColegiosList,
    colegiosListView,
    setColegiosListView,
    rectoresSearchTerm,
    setRectoresSearchTerm,
    colegioNombre,
    setColegioNombre,
    colegioCodigoDane,
    setColegioCodigoDane,
    rectorNombre,
    setRectorNombre,
    rectorApellido,
    setRectorApellido,
    rectorCorreo,
    setRectorCorreo,
    rectorTelefono,
    setRectorTelefono,
    rectorCedula,
    setRectorCedula,
    rectorCargo,
    setRectorCargo,
    rectorPassword,
    setRectorPassword,
    showRectorPassword,
    setShowRectorPassword,
    hasRectorPassword,
    setHasRectorPassword,
    deleteColegioModal,
    setDeleteColegioModal,
    rectorEditing,
    setRectorEditing,
    rectorEditModalVisible,
    setRectorEditModalVisible,
    deleteRectorModal,
    setDeleteRectorModal,
    daneExistsModal,
    setDaneExistsModal,
    colegioEditing,
    setColegioEditing,
    savingColegio,
    setSavingColegio,
    colegiosError,
    setColegiosError,
    colegiosScrollRef
  };
}
