import type {
  ExpressionSpecification,
  FilterSpecification,
  LayerSpecification,
  Map as MapLibreMap,
} from 'maplibre-gl';
import { FACILITY_ICON_SIZE } from '../sprites';
import { FLOOR_SOURCE_ID, HIGHLIGHT_LAYER_IDS, LAYER_IDS } from '../style';
import { LABEL_LAYER_ID } from './labels';

/** Unit terpilih: isi #FFE9A8, garis --ink. */
export const HIGHLIGHT_COLORS = { fill: '#ffe9a8', line: '#111418' } as const;

const listed = (ids: readonly string[]): ExpressionSpecification => [
  'in',
  ['get', 'id'],
  ['literal', [...ids]],
];
const isPolygon: ExpressionSpecification = [
  'match',
  ['geometry-type'],
  ['Polygon', 'MultiPolygon'],
  true,
  false,
];

/** Filter tiap layer sorotan untuk daftar id fitur. */
export function highlightFilters(ids: readonly string[]): Record<string, FilterSpecification> {
  return {
    [HIGHLIGHT_LAYER_IDS.fill]: ['all', isPolygon, listed(ids)],
    [HIGHLIGHT_LAYER_IDS.line]: ['all', isPolygon, listed(ids)],
    [HIGHLIGHT_LAYER_IDS.point]: ['all', ['==', ['geometry-type'], 'Point'], listed(ids)],
  };
}

/**
 * Layer sorotan beserta layer yang harus ada di atasnya. Ruang diisi dan digaris ulang, dan
 * fasilitas diberi lingkaran di bawah ikonnya. Lingkaran bukan simbol, jadi
 * tetap terlihat walau ikonnya kalah tabrakan label.
 */
export function highlightLayers(
  ids: readonly string[],
): { layer: LayerSpecification; before: string }[] {
  const filters = highlightFilters(ids);
  const filter = (id: string) => filters[id] as FilterSpecification;
  return [
    {
      before: LAYER_IDS.walls,
      layer: {
        id: HIGHLIGHT_LAYER_IDS.fill,
        type: 'fill',
        source: FLOOR_SOURCE_ID,
        filter: filter(HIGHLIGHT_LAYER_IDS.fill),
        paint: { 'fill-color': HIGHLIGHT_COLORS.fill },
      },
    },
    {
      before: LAYER_IDS.walls,
      layer: {
        id: HIGHLIGHT_LAYER_IDS.line,
        type: 'line',
        source: FLOOR_SOURCE_ID,
        filter: filter(HIGHLIGHT_LAYER_IDS.line),
        paint: { 'line-color': HIGHLIGHT_COLORS.line, 'line-width': 2 },
      },
    },
    {
      before: LABEL_LAYER_ID,
      layer: {
        id: HIGHLIGHT_LAYER_IDS.point,
        type: 'circle',
        source: FLOOR_SOURCE_ID,
        filter: filter(HIGHLIGHT_LAYER_IDS.point),
        paint: {
          // Mengikuti ukuran ikon label (0,5× di zoom 15, 1× di zoom 18).
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            FACILITY_ICON_SIZE / 4 + 4,
            18,
            FACILITY_ICON_SIZE / 2 + 5,
          ],
          'circle-color': HIGHLIGHT_COLORS.fill,
          'circle-stroke-color': HIGHLIGHT_COLORS.line,
          'circle-stroke-width': 2,
        },
      },
    },
  ];
}

/** Menyorot unit dan fasilitas pilihan pengunjung; daftar kosong menghapus sorotan. */
export function setHighlight(map: MapLibreMap, ids: readonly string[]): void {
  if (!map.getLayer(HIGHLIGHT_LAYER_IDS.fill)) {
    for (const { layer, before } of highlightLayers(ids)) {
      map.addLayer(layer, map.getLayer(before) ? before : undefined);
    }
  }
  for (const [layerId, filter] of Object.entries(highlightFilters(ids))) {
    if (map.getLayer(layerId)) map.setFilter(layerId, filter);
  }
}
