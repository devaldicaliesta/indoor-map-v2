import type * as Demo from '@indoor/demo';
import { demoBySlug } from '@indoor/demo';
import type { Closure, VenueId } from '@indoor/domain';
import { describe, expect, it, vi } from 'vitest';
import { listCurrentClosures, loadSnapshot, VenueNotFoundError } from './client';

const HOUR_MS = 3_600_000;

vi.mock('@indoor/demo', async (importOriginal) => {
  const actual = await importOriginal<typeof Demo>();
  return {
    ...actual,
    demoClosures: (...args: Parameters<typeof actual.demoClosures>): Closure[] => {
      const [snapshot, now] = args;
      const at = (hours: number) => new Date(now.getTime() + hours * HOUR_MS).toISOString();
      const lift = snapshot.graph.connectors.find((c) => c.kind === 'elevator');
      const extra = (id: string, from: number, to: number | null): Closure => ({
        id,
        featureId: null,
        edgeId: null,
        connectorId: lift?.id ?? null,
        reason: id,
        startsAt: at(from),
        endsAt: to === null ? null : at(to),
      });
      return [
        ...actual.demoClosures(snapshot, now),
        extra('terjadwal', 26, 32),
        extra('sudah-selesai', -10, -1),
        extra('tanpa-akhir', -1, null),
      ];
    },
  };
});

const hospital = demoBySlug('demo');
if (!hospital) throw new Error('demo rumah sakit tidak ada');
const venueId = hospital.id as VenueId;

describe('listCurrentClosures', () => {
  it('hanya meneruskan penutupan yang sedang berlaku', async () => {
    const now = new Date('2026-11-02T09:00:00+07:00');
    const closures = await listCurrentClosures(venueId, now);
    const reasons = closures.map((c) => c.reason);
    expect(reasons).not.toContain('terjadwal');
    expect(reasons).not.toContain('sudah-selesai');
    expect(reasons).toContain('tanpa-akhir');
    for (const closure of closures) {
      expect(Date.parse(closure.startsAt)).toBeLessThanOrEqual(now.getTime());
      if (closure.endsAt !== null)
        expect(Date.parse(closure.endsAt)).toBeGreaterThan(now.getTime());
    }
  });
});

describe('loadSnapshot', () => {
  it('venue yang bukan demo ditolak dengan VenueNotFoundError', async () => {
    await expect(loadSnapshot('bukan-demo' as VenueId)).rejects.toBeInstanceOf(VenueNotFoundError);
  });
});
