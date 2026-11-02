import { z } from 'zod';
import { type VenueId, VenueIdSchema } from './ids';

/**
 * Alamat pendek venue di Visitor (`/v/<slug>`), mis. `demo` atau `rs-harapan`: huruf kecil, angka,
 * dan tanda hubung tunggal di antaranya, 3–60 karakter. Bentuk UUID ditolak agar `/v/<x>` selalu
 * jelas id atau slug.
 */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const UUID_SHAPE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export const VenueSlugSchema = z
  .string()
  .min(3)
  .max(60)
  .regex(SLUG_PATTERN)
  .refine((value) => !UUID_SHAPE.test(value), 'Slug tidak boleh berbentuk UUID.')
  .brand<'VenueSlug'>();
export type VenueSlug = z.infer<typeof VenueSlugSchema>;

export type VenueRef = { kind: 'id'; venueId: VenueId } | { kind: 'slug'; slug: VenueSlug };

/** Bagian `/v/:venue` → id venue atau slug; `null` bila bukan keduanya. */
export function parseVenueRef(value: string | undefined): VenueRef | null {
  const id = VenueIdSchema.safeParse(value);
  if (id.success) return { kind: 'id', venueId: id.data };
  const slug = VenueSlugSchema.safeParse(value);
  return slug.success ? { kind: 'slug', slug: slug.data } : null;
}
