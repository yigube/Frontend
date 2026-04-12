export const getLocalDateISO = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const formatTimeLabel = (value) => {
  const parsed = value ? new Date(value) : new Date();
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  }
  return parsed.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
};

export const normalizeMateriaOption = (value = '') => String(value || '').trim().toLowerCase();

export const buildEstadoFlags = (estado) => ({
  presente: estado === 'presente' || estado === 'tarde',
  tarde: estado === 'tarde',
  afuera: estado === 'afuera',
  ausente: estado === 'ausente'
});
