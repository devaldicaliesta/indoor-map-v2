import type { Map as MapLibreMap } from 'maplibre-gl';
import { describe, expect, it } from 'vitest';
import { LAYER_IDS, pickAt } from '../src';

function fakeMap(hits: Record<string, string>) {
  const queried: string[][] = [];
  const map = {
    getLayer: () => ({}),
    queryRenderedFeatures: (_point: unknown, options: { layers: string[] }) => {
      queried.push(options.layers);
      const layer = options.layers.find((id) => hits[id]);
      return layer ? [{ properties: { id: hits[layer] } }] : [];
    },
  } as unknown as MapLibreMap;
  return { map, queried };
}

describe('ketukan pengunjung di peta', () => {
  it('koridor dan Area Luar tidak bisa dipilih', () => {
    const { map } = fakeMap({ [LAYER_IDS.flat]: 'koridor' });
    expect(pickAt(map, { x: 5, y: 5 })).toBeNull();
  });

  it('ruang di bawah titik ketuk dipilih sebagai fitur lantai', () => {
    const { map, queried } = fakeMap({ [LAYER_IDS.rooms]: 'unit' });
    expect(pickAt(map, { x: 5, y: 5 })).toEqual({ layer: 'floor', id: 'unit' });
    expect(queried.at(-1)).not.toContain(LAYER_IDS.flat);
  });
});
