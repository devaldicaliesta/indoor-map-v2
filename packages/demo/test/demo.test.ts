import { parseSnapshot, type Snapshot } from '@indoor/domain';
import { buildRouteGraph, planRoute } from '@indoor/routing';
import { beforeAll, describe, expect, it } from 'vitest';
import { DEMO_VENUES, demoById, demoBySlug, demoClosures, demoSnapshot } from '../src';

const NOW = new Date('2026-11-02T03:00:00.000Z');

describe('katalog demo', () => {
  it('tujuh venue dengan slug dan id unik', () => {
    expect(DEMO_VENUES).toHaveLength(7);
    expect(new Set(DEMO_VENUES.map((v) => v.slug)).size).toBe(7);
    expect(new Set(DEMO_VENUES.map((v) => v.id)).size).toBe(7);
  });

  it('dicari lewat slug atau id', () => {
    const hospital = demoBySlug('demo');
    expect(hospital?.kind).toBe('hospital');
    expect(hospital && demoById(hospital.id)).toBe(hospital);
    expect(demoBySlug('tidak-ada')).toBeUndefined();
  });
});

describe.each(DEMO_VENUES.map((v) => [v.slug, v] as const))('venue %s', (_, entry) => {
  let snapshot: Snapshot;

  beforeAll(async () => {
    snapshot = await demoSnapshot(entry);
  });

  it('lolos skema snapshot penuh', () => {
    expect(() => parseSnapshot(JSON.parse(JSON.stringify(snapshot)))).not.toThrow();
    expect(snapshot.venue.id).toBe(entry.id);
    expect(snapshot.venue.logoPath).toBe(entry.logoPath);
    expect(snapshot.venue.branding?.primaryColor).toBe(entry.color);
    expect(snapshot.locations.length).toBeGreaterThanOrEqual(70);
  });

  it('id stabil antar pembuatan', async () => {
    const again = await demoSnapshot(entry);
    expect(again.locations.map((l) => l.id)).toEqual(snapshot.locations.map((l) => l.id));
  });

  it('setiap lokasi bisa dirutekan dari titik asal pertama', () => {
    const origin = snapshot.originPoints[0];
    expect(origin).toBeDefined();
    const graph = buildRouteGraph(snapshot);
    const failed = snapshot.locations.filter((location) => {
      const plan = planRoute(
        graph,
        snapshot,
        { kind: 'origin_point', code: origin?.code ?? '' },
        { kind: 'location', locationId: location.id },
      );
      return !plan.ok;
    });
    expect(failed.map((l) => l.name)).toEqual([]);
  });

  it('penutupan contoh mengarah ke sasaran di snapshot dan semuanya sedang berlaku', () => {
    const closures = demoClosures(snapshot, NOW);
    const connectors = new Set(snapshot.graph.connectors.map((c) => c.id));
    const features = new Set(snapshot.features.features.map((f) => f.properties.id));
    for (const closure of closures) {
      const known =
        (closure.connectorId !== null && connectors.has(closure.connectorId)) ||
        (closure.featureId !== null && features.has(closure.featureId));
      expect(known).toBe(true);
    }
    const active = closures.filter(
      (c) => Date.parse(c.startsAt) <= NOW.getTime() && Date.parse(c.endsAt ?? '') > NOW.getTime(),
    );
    expect(closures.length).toBeGreaterThan(0);
    expect(active).toEqual(closures);
  });
});
