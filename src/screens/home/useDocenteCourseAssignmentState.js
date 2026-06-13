import { useRef, useState } from 'react';

export default function useDocenteCourseAssignmentState() {
  const [cursoDocModalVisible, setCursoDocModalVisible] = useState(false);
  const [cursoDocColegioId, setCursoDocColegioId] = useState(null);
  const [cursoDocPickerOpen, setCursoDocPickerOpen] = useState(false);
  const [mostrarAsignadorCursoDoc, setMostrarAsignadorCursoDoc] = useState(false);
  const [cursoDocCursos, setCursoDocCursos] = useState([]);
  const [asignacionCursosDocente, setAsignacionCursosDocente] = useState({});
  const [savingAsignacionDocenteId, setSavingAsignacionDocenteId] = useState(null);
  const cursoDocSchoolRef = useRef(null);

  return {
    cursoDocModalVisible,
    setCursoDocModalVisible,
    cursoDocColegioId,
    setCursoDocColegioId,
    cursoDocPickerOpen,
    setCursoDocPickerOpen,
    mostrarAsignadorCursoDoc,
    setMostrarAsignadorCursoDoc,
    cursoDocCursos,
    setCursoDocCursos,
    asignacionCursosDocente,
    setAsignacionCursosDocente,
    savingAsignacionDocenteId,
    setSavingAsignacionDocenteId,
    cursoDocSchoolRef
  };
}
