import type { LayerSpecification } from 'maplibre-gl';
import { describe, expect, it } from 'vitest';
import type { LabelFont } from '../src/layers/labels';
import { buildStyle, buildStyleLayers, FLOOR_SOURCE_ID, LAYER_IDS } from '../src/style';

const FONT: LabelFont = {
  name: 'Atkinson Hyperlegible Bold',
  faces: [{ url: '/assets/atkinson-latin-700.woff2' }],
};

const layer = (layers: LayerSpecification[], id: string) => {
  const found = layers.find((l) => l.id === id);
  if (!found) throw new Error(`layer ${id} tidak ada`);
  return found;
};

describe('buildStyleLayers', () => {
  const layers = buildStyleLayers();

  it('semua layer dari source lantai', () => {
    expect(layers.map((l) => [l.id, l.type])).toEqual([
      [LAYER_IDS.flat, 'fill'],
      [LAYER_IDS.rooms, 'fill'],
      [LAYER_IDS.roomOutline, 'line'],
      [LAYER_IDS.vacantOutline, 'line'],
      [LAYER_IDS.walls, 'line'],
      [LAYER_IDS.points, 'circle'],
    ]);
    for (const l of layers) expect('source' in l && l.source).toBe(FLOOR_SOURCE_ID);
  });

  it('warna dari pengaturan tampilan venue menimpa default, termasuk dinding dan pintu', () => {
    const custom = buildStyleLayers({
      colors: { unit: '#ffe9a8', wall: '#222222', door: '#0000ff' },
    });
    expect(JSON.stringify(layer(custom, LAYER_IDS.rooms).paint)).toContain('#ffe9a8');
    expect(JSON.stringify(layer(custom, LAYER_IDS.walls).paint)).toContain('#222222');
    expect(JSON.stringify(layer(custom, LAYER_IDS.points).paint)).toContain('"door","#0000ff"');
  });

  it('unit kosong memakai isi terang dan garis putus-putus', () => {
    expect(JSON.stringify(layer(layers, LAYER_IDS.rooms).paint)).toContain('#f7f7f4');
    const vacant = layer(layers, LAYER_IDS.vacantOutline);
    expect(vacant.type === 'line' && vacant.paint?.['line-dasharray']).toEqual([2, 2]);
  });

  it('dinding garis 2 px', () => {
    const walls = layer(layers, LAYER_IDS.walls);
    expect(walls.type === 'line' && walls.paint?.['line-width']).toBe(2);
  });
});

describe('buildStyle', () => {
  it('tanpa tile, sprite, atau font dari internet', () => {
    const style = buildStyle(FONT);
    expect(Object.values(style.sources).map((s) => s.type)).toEqual(['geojson', 'geojson']);
    expect(style.glyphs).toBeUndefined();
    expect(style.sprite).toBeUndefined();
    expect(JSON.stringify(style)).not.toMatch(/https?:\/\//);
  });
});

describe('gaya per jenis', () => {
  const layers = buildStyleLayers();
  const paintOf = (id: string) => {
    const found = layers.find((l) => l.id === id);
    return JSON.stringify(found && 'paint' in found ? found.paint : {});
  };

  it('Area Luar dibedakan per subjenis: jalan, taman, parkir', () => {
    const flat = paintOf(LAYER_IDS.flat);
    for (const color of ['#e6e3da', '#d5e8c8', '#e3e5e8']) expect(flat).toContain(color);
  });

  it('pintu keluar berbeda warna dan ukuran dari pintu', () => {
    const points = paintOf(LAYER_IDS.points);
    expect(points).toContain('"exit",4.5');
    expect(points).toContain('#1b7f4b');
  });
});
