export default function useDocentePasswordReset({
  user,
  docenteColegioId,
  resetDocentePassword,
  loadDocentesActual,
  showResetPasswordFeedbackModal
}) {
  const handleResetDocentePassword = async (docente) => {
    if (!docente?.id) return;
    try {
      const data = await resetDocentePassword(docente.id);
      await loadDocentesActual(docenteColegioId || user?.schoolId);
      showResetPasswordFeedbackModal(
        'Clave restablecida',
        data?.message || 'Se envio una clave temporal al correo del docente.'
      );
    } catch (e) {
      showResetPasswordFeedbackModal(
        'Error',
        e?.response?.data?.error || e?.message || 'No se pudo restablecer la clave'
      );
    }
  };

  return { handleResetDocentePassword };
}
