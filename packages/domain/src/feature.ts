import { z } from 'zod';

/** Jenis fitur peta. */
export const FEATURE_KINDS = [
  'unit',
  'corridor',
  'wall',
  'door',
  'elevator',
  'escalator',
  'stairs',
  'exit',
  'non_walkable',
  'outdoor_area',
  'facility',
  'landmark',
] as const;
export const FeatureKindSchema = z.enum(FEATURE_KINDS);
export type FeatureKind = z.infer<typeof FeatureKindSchema>;

export const UNIT_STATUSES = ['occupied', 'vacant', 'renovation'] as const;
export type UnitStatus = (typeof UNIT_STATUSES)[number];

/** Properti GeoJSON fitur peta di snapshot. */
export interface MapFeatureProperties {
  id: string;
  kind: FeatureKind;
  floorId: string;
  name?: string;
  unitCode?: string;
  unitStatus?: UnitStatus;
  /** Override tinggi 3D dalam meter. */
  height?: number;
  /** Override warna `#rrggbb`. */
  color?: string;
  facilityTypeId?: string;
  /** Hanya untuk `outdoor_area`. */
  subtype?: OutdoorSubtype;
  /** Luas koreksi manual (m²); tanpa nilai ini luas dihitung dari geometri. */
  areaM2?: number;
}

/** Subjenis `outdoor_area` di lapisan Area Luar, disimpan di `props.subtype`. */
export const OUTDOOR_SUBTYPES = ['road', 'garden', 'parking'] as const;
export type OutdoorSubtype = (typeof OUTDOOR_SUBTYPES)[number];

/** Kode unit disimpan huruf besar; unik per venue tanpa membedakan huruf besar/kecil. */
export { normalizeUnitCode } from './unit-code.ts';
