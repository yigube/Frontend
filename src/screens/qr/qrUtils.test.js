import { buildEstadoFlags, normalizeMateriaOption } from './qrUtils';

describe('qr utils', () => {
  test('buildEstadoFlags para estado tarde', () => {
    expect(buildEstadoFlags('tarde')).toEqual({
      presente: true,
      tarde: true,
      afuera: false,
      ausente: false
    });
  });

  test('normalizeMateriaOption normaliza y recorta', () => {
    expect(normalizeMateriaOption('  Matemáticas  ')).toBe('matemáticas');
  });
});
