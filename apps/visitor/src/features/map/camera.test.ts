import type { Snapshot } from '@indoor/domain';
import type { FloorFeatureCollection } from '@indoor/map-core';
import { describe, expect, it } from 'vitest';
import { fitBearing, initialCamera } from './camera';

const venue = (camera: Snapshot['venue']['camera']) =>
  ({ venue: { camera } }) as Pick<Snapshot, 'venue'>;

const features: FloorFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [106.8268, -6.1751],
            [106.8276, -6.1751],
            [106.8276, -6.1755],
            [106.8268, -6.1755],
            [106.8268, -6.1751],
          ],
        ],
      },
      properties: { id: 'u1', kind: 'unit', floorId: 'f1' },
    },
  ],
};

describe('kamera awal Visitor', () => {
  const saved = {
    center: [106.8272, -6.1753] as [number, number],
    zoom: 19,
    pitch: 35,
    bearing: -20,
  };

  it('memakai kamera yang disimpan di Pengaturan → Tampilan; selalu tegak lurus', () => {
    expect(initialCamera(venue(saved), features)).toEqual({
      kind: 'view',
      ...saved,
      pitch: 0,
    });
  });

  it('tanpa kamera tersimpan: membingkai lantai awal', () => {
    expect(initialCamera(venue(null), features)).toEqual({
      kind: 'bounds',
      bounds: [
        [106.8268, -6.1755],
        [106.8276, -6.1751],
      ],
      bearing: 0,
    });
  });

  it('HP tegak dan lantai memanjang (±88 × 44 m): peta diputar agar lantai mengisi layar', () => {
    const portrait = { width: 390, height: 844 };
    expect(initialCamera(venue(null), features, portrait)).toMatchObject({ bearing: 90 });
    expect(initialCamera(venue(null), features, { width: 1280, height: 800 })).toMatchObject({
      bearing: 0,
    });
  });

  it('lantai hampir persegi tidak diputar di HP', () => {
    expect(
      fitBearing(
        [
          [106.8268, -6.1755],
          [106.8272, -6.1751],
        ],
        { width: 390, height: 844 },
      ),
    ).toBe(0);
  });

  it('lantai kosong tanpa kamera tersimpan: tidak ada kamera awal', () => {
    expect(initialCamera(venue(null), { type: 'FeatureCollection', features: [] })).toBeNull();
  });
});
