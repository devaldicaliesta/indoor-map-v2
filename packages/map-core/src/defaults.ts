import type { FeatureKind } from '@indoor/domain';

/**
 * Warna dan tinggi default peta; dapat ditimpa per venue lewat `display` di snapshot. Nilai hex di sini adalah data style
 * MapLibre, bukan warna komponen UI.
 */
export const MAP_BACKGROUND = '#f2f3ef';

export const DEFAULT_FILL: Partial<Record<FeatureKind, string>> = {
  unit: '#ffffff',
  corridor: '#eceeea',
  non_walkable: '#daddd7',
  outdoor_area: '#e6e3da',
  elevator: '#e3e7ee',
  escalator: '#e3e7ee',
  stairs: '#e3e7ee',
};

export const DEFAULT_OUTLINE: Partial<Record<FeatureKind, string>> = {
  unit: '#bfc5cc',
  elevator: '#8a929b',
  escalator: '#8a929b',
  stairs: '#8a929b',
  wall: '#8a929b',
};

export const VACANT_UNIT = { fill: '#f7f7f4', outline: '#d5d9de' } as const;
export const POINT_COLOR = '#545b64';

/** Warna subjenis Area Luar; parkir memakai abu dingin agar beda dari jalan. */
export const OUTDOOR_SUBTYPE_FILL = {
  road: '#e6e3da',
  garden: '#d5e8c8',
  parking: '#e3e5e8',
} as const;

/** Titik per jenis: pintu keluar hijau (warna standar tanda evakuasi) dan sedikit lebih besar. */
export const POINT_STYLE: Partial<Record<FeatureKind, { color: string; radius: number }>> = {
  door: { color: POINT_COLOR, radius: 3 },
  exit: { color: '#1b7f4b', radius: 4.5 },
};

/** Warna aksen penanda di peta: token --signal (sorotan), --ink (garis), dan putih. */
export const MAP_ACCENT_COLORS = { signal: '#ffc20e', ink: '#111418', paper: '#ffffff' } as const;
