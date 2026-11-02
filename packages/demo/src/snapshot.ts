import { buildSnapshot, type Snapshot, type SnapshotSource } from '@indoor/domain';
import type { DemoVenue } from './catalog';

export function demoSource(entry: DemoVenue, make: () => SnapshotSource): SnapshotSource {
  const source = make();
  return {
    ...source,
    enabledFeatures: [],
    infoPoints: [],
    venue: { ...source.venue, logoPath: entry.logoPath },
    display: {
      defaultMode: '2d',
      heights: null,
      colors: null,
      camera: null,
      branding: { displayName: null, primaryColor: entry.color, routeColor: entry.color },
    },
  };
}

export async function demoSnapshot(entry: DemoVenue): Promise<Snapshot> {
  return buildSnapshot(demoSource(entry, await entry.load()));
}
