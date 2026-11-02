import { demoById, demoClosures, demoSnapshot } from '@indoor/demo';
import type { Closure, Snapshot, VenueId } from '@indoor/domain';

export class VenueNotFoundError extends Error {
  constructor(venueId: string) {
    super(`Venue demo ${venueId} tidak ditemukan.`);
    this.name = 'VenueNotFoundError';
  }
}

const snapshots = new Map<string, Promise<Snapshot>>();

export function loadSnapshot(venueId: VenueId): Promise<Snapshot> {
  const cached = snapshots.get(venueId);
  if (cached) return cached;
  const entry = demoById(venueId);
  if (!entry) return Promise.reject(new VenueNotFoundError(venueId));
  const pending = demoSnapshot(entry);
  snapshots.set(venueId, pending);
  pending.catch(() => snapshots.delete(venueId));
  return pending;
}

export async function listCurrentClosures(venueId: VenueId, now: Date): Promise<Closure[]> {
  const snapshot = await loadSnapshot(venueId);
  const at = now.getTime();
  return demoClosures(snapshot, now).filter(
    (closure) =>
      Date.parse(closure.startsAt) <= at &&
      (closure.endsAt === null || Date.parse(closure.endsAt) > at),
  );
}

export function assetUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
}
