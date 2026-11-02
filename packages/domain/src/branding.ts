/**
 * Branding venue untuk Visitor dan Info Point: nama tampilan, warna utama (pengganti --signal),
 * dan warna rute (pengganti --route). Logonya memakai logo venue.
 *
 * Tanpa impor agar bisa dipakai builder snapshot tanpa bundler (lihat `snapshot.ts`).
 */

/** Header HP hanya muat sekitar ini sebelum terpotong. */
export const MAX_DISPLAY_NAME_LENGTH = 60;

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

export interface Branding {
  /** `null` = nama venue. */
  displayName: string | null;
  /** `#rrggbb` huruf kecil; `null` = warna bawaan. */
  primaryColor: string | null;
  routeColor: string | null;
}

export const EMPTY_BRANDING: Branding = Object.freeze({
  displayName: null,
  primaryColor: null,
  routeColor: null,
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const tidyName = (value: string) => value.trim().replace(/\s+/g, ' ');

function toColor(value: unknown): string | null {
  return typeof value === 'string' && HEX_COLOR.test(value.trim())
    ? value.trim().toLowerCase()
    : null;
}

/**
 * Membaca data branding venue dengan aman: entri yang rusak dibuang per kunci, dan nama yang
 * terlalu panjang dipotong.
 */
export function parseBranding(value: unknown): Branding {
  if (!isRecord(value)) return EMPTY_BRANDING;
  const name = typeof value.displayName === 'string' ? tidyName(value.displayName) : '';
  return {
    displayName: name
      ? Array.from(name).slice(0, MAX_DISPLAY_NAME_LENGTH).join('').trimEnd()
      : null,
    primaryColor: toColor(value.primaryColor),
    routeColor: toColor(value.routeColor),
  };
}

/** Nama di header Visitor dan Info Point. */
export function brandDisplayName(
  venueName: string,
  branding: Pick<Branding, 'displayName'> | null | undefined,
): string {
  return branding?.displayName || venueName;
}
