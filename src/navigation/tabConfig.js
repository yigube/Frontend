export const getTabScreenNamesForRole = (role) => {
  const isAdmin = role === 'admin';
  const names = ['Inicio', 'Cursos'];
  if (!isAdmin) names.push('Estudiantes');
  names.push('Reportes');
  if (!isAdmin) names.push('QR');
  return names;
};
