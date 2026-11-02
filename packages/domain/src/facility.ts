/**
 * Piktogram bawaan; gambarnya di
 * `packages/ui/src/pictograms`. Urutan ini dipakai di pemilih ikon.
 */
export const PICTOGRAM_KEYS = [
  'toilet-male',
  'toilet-female',
  'toilet-accessible',
  'prayer-room',
  'atm',
  'first-aid',
  'information',
  'fire-extinguisher',
  'assembly-point',
  'emergency-exit',
  'elevator',
  'escalator',
  'stairs',
  'parking',
] as const;
export type PictogramKey = (typeof PICTOGRAM_KEYS)[number];

/** Ikon jenis fasilitas: piktogram bawaan, atau gambar unggahan di Storage `public-assets`. */
export type FacilityIcon =
  | { kind: 'builtin'; key: PictogramKey }
  | { kind: 'upload'; path: string };

const BUILTIN_PREFIX = 'builtin:';

/** `facility_types.icon_path`: `builtin:<kunci>` untuk piktogram bawaan, selain itu path Storage. */
export function parseFacilityIcon(iconPath: string | null): FacilityIcon | null {
  if (!iconPath) return null;
  if (iconPath.startsWith(BUILTIN_PREFIX)) {
    const key = iconPath.slice(BUILTIN_PREFIX.length);
    return (PICTOGRAM_KEYS as readonly string[]).includes(key)
      ? { kind: 'builtin', key: key as PictogramKey }
      : null;
  }
  return { kind: 'upload', path: iconPath };
}
