import { useRef, useState } from 'react';
import { createDefaultPeriodForm } from './homeUtils';

export default function usePeriodCrudState() {
  const [periodos, setPeriodos] = useState([]);
  const [periodModalVisible, setPeriodModalVisible] = useState(false);
  const [periodSchoolId, setPeriodSchoolId] = useState(null);
  const [periodSchoolPickerOpen, setPeriodSchoolPickerOpen] = useState(false);
  const [editingPeriodo, setEditingPeriodo] = useState(null);
  const [savingPeriodo, setSavingPeriodo] = useState(false);
  const [periodFeedback, setPeriodFeedback] = useState({ type: '', message: '' });
  const [deletePeriodModal, setDeletePeriodModal] = useState({ visible: false, id: null });
  const periodModalScrollRef = useRef(null);
  const [periodForm, setPeriodForm] = useState(() => createDefaultPeriodForm());

  return {
    periodos,
    setPeriodos,
    periodModalVisible,
    setPeriodModalVisible,
    periodSchoolId,
    setPeriodSchoolId,
    periodSchoolPickerOpen,
    setPeriodSchoolPickerOpen,
    editingPeriodo,
    setEditingPeriodo,
    savingPeriodo,
    setSavingPeriodo,
    periodFeedback,
    setPeriodFeedback,
    deletePeriodModal,
    setDeletePeriodModal,
    periodModalScrollRef,
    periodForm,
    setPeriodForm
  };
}
