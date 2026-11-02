import { z } from 'zod';

/**
 * ID bermerek: semua ID berupa UUID, tetapi mereknya mencegah
 * `FloorId` tertukar dengan `VenueId` saat dikirim ke fungsi.
 */
const uuid = z.uuid();

export const VenueIdSchema = uuid.brand<'VenueId'>();
export const BuildingIdSchema = uuid.brand<'BuildingId'>();
export const FloorIdSchema = uuid.brand<'FloorId'>();
export const LocationIdSchema = uuid.brand<'LocationId'>();

export type VenueId = z.infer<typeof VenueIdSchema>;
export type BuildingId = z.infer<typeof BuildingIdSchema>;
export type FloorId = z.infer<typeof FloorIdSchema>;
export type LocationId = z.infer<typeof LocationIdSchema>;
