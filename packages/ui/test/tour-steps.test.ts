import { describe, expect, it } from 'vitest';
import { resolveTourSteps, type TourStep, tourKey, tourSelector } from '../src/tour/steps';

type Action = 'route.share' | 'map.print';

const steps: TourStep<Action>[] = [
  { title: 'Pengantar', description: 'Tanpa sasaran: selalu tampil' },
  { target: 'search', title: 'Cari', description: 'Kolom cari' },
  { target: 'share', title: 'Bagikan', description: 'Tombol bagikan', requires: 'route.share' },
  { target: 'legend', title: 'Legenda', description: 'Hanya ada bila peta dimuat' },
  { title: 'Cetak', description: 'Aksi tanpa sasaran', requires: 'map.print' },
];

const titles = (list: TourStep<Action>[]) => list.map((s) => s.title);

describe('resolveTourSteps', () => {
  it('semua aksi tersedia dan semua elemen ada: semua langkah tampil berurutan', () => {
    const resolved = resolveTourSteps(steps, { can: () => true, isPresent: () => true });
    expect(titles(resolved)).toEqual(['Pengantar', 'Cari', 'Bagikan', 'Legenda', 'Cetak']);
  });

  it('langkah untuk aksi yang tidak tersedia dilewati walau tombolnya ada di DOM', () => {
    const resolved = resolveTourSteps(steps, { can: () => false, isPresent: () => true });
    expect(titles(resolved)).toEqual(['Pengantar', 'Cari', 'Legenda']);
  });

  it('elemen yang tidak ada di layar dilewati, tur tidak macet', () => {
    const present = new Set(['search', 'share']);
    const resolved = resolveTourSteps(steps, {
      can: (action) => action === 'route.share',
      isPresent: (target) => present.has(target),
    });
    expect(titles(resolved)).toEqual(['Pengantar', 'Cari', 'Bagikan']);
  });

  it('tidak mengubah daftar asli', () => {
    resolveTourSteps(steps, { can: () => false, isPresent: () => false });
    expect(steps).toHaveLength(5);
  });
});

describe('tourKey dan tourSelector', () => {
  it('kunci berversi dan selektor atribut data-tour', () => {
    expect(tourKey({ id: 'venue', version: 2 })).toBe('venue@2');
    expect(tourSelector('venue-search')).toBe('[data-tour="venue-search"]');
  });
});
