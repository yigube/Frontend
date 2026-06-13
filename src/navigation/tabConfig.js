export const getTabScreenNamesForRole = (role) => {
  const isDocente = role === 'docente';
  const names = ['Inicio', 'Cursos'];
  if (isDocente) names.push('Estudiantes');
  names.push('Reportes');
  if (isDocente) names.push('QR');
  return names;
};
