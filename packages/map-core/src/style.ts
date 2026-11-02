import type { FeatureKind } from '@indoor/domain';
import type { ExpressionSpecification, LayerSpecification, StyleSpecification } from 'maplibre-gl';
import {
  DEFAULT_FILL,
  DEFAULT_OUTLINE,
  MAP_BACKGROUND,
  OUTDOOR_SUBTYPE_FILL,
  POINT_COLOR,
  POINT_STYLE,
  VACANT_UNIT,
} from './defaults';
import { LABEL_SOURCE_ID, type LabelFont, labelFontFaces, labelLayer } from './layers/labels';

export const FLOOR_SOURCE_ID = 'floor';

/** Bagian `display` snapshot yang memengaruhi style. */
export interface MapDisplay {
  colors?: Partial<Record<FeatureKind, string>>;
}

/** Id layer lantai di peta. */
export const LAYER_IDS = {
  background: 'background',
  flat: 'floor-flat',
  rooms: 'floor-rooms',
  roomOutline: 'floor-room-outline',
  vacantOutline: 'floor-vacant-outline',
  walls: 'floor-walls',
  points: 'floor-points',
} as const;

/** Sorotan pilihan pengunjung (layers/highlight.ts); ditambahkan saat pertama dipakai. */
export const HIGHLIGHT_LAYER_IDS = {
  fill: 'floor-highlight-fill',
  line: 'floor-highlight-line',
  point: 'floor-highlight-point',
} as const;

const FLAT_KINDS: FeatureKind[] = ['outdoor_area', 'corridor', 'non_walkable'];
const ROOM_KINDS: FeatureKind[] = ['unit', 'elevator', 'escalator', 'stairs'];
const POINT_KINDS: FeatureKind[] = ['door', 'exit', 'landmark'];

const kind: ExpressionSpecification = ['get', 'kind'];
const isVacant: ExpressionSpecification = ['==', ['get', 'unitStatus'], 'vacant'];
const isPolygon: ExpressionSpecification = [
  'match',
  ['geometry-type'],
  ['Polygon', 'MultiPolygon'],
  true,
  false,
];

function kindIn(kinds: FeatureKind[]): ExpressionSpecification {
  return ['match', kind, kinds, true, false];
}

/** `match` per jenis fitur dengan fallback. */
function byKind(
  values: Partial<Record<FeatureKind, string | number>>,
  fallback: string | number,
): ExpressionSpecification {
  const pairs = Object.entries(values).flatMap(([k, v]) => [k, v]);
  // `match` butuh minimal satu pasangan; label mustahil dipakai saat tidak ada entri.
  const body = pairs.length ? pairs : ['__none__', fallback];
  return ['match', kind, ...body, fallback] as ExpressionSpecification;
}

/** Warna per fitur: override fitur → unit kosong → warna venue/default per jenis. */
function fillColor(display: MapDisplay): ExpressionSpecification {
  return [
    'coalesce',
    ['get', 'color'],
    [
      'case',
      isVacant,
      VACANT_UNIT.fill,
      ['==', kind, 'outdoor_area'],
      [
        'match',
        ['get', 'subtype'],
        'garden',
        OUTDOOR_SUBTYPE_FILL.garden,
        'parking',
        OUTDOOR_SUBTYPE_FILL.parking,
        display.colors?.outdoor_area ?? OUTDOOR_SUBTYPE_FILL.road,
      ],
      byKind({ ...DEFAULT_FILL, ...display.colors }, '#ffffff'),
    ],
  ] as ExpressionSpecification;
}

/** Warna dinding: override fitur → warna venue → default. */
function wallColor(display: MapDisplay): ExpressionSpecification {
  return ['coalesce', ['get', 'color'], display.colors?.wall ?? DEFAULT_OUTLINE.wall ?? '#8a929b'];
}

/** Warna titik (pintu, pintu keluar) dari pengaturan venue. */
function pointColors(display: MapDisplay): Partial<Record<FeatureKind, string>> {
  const colors: Partial<Record<FeatureKind, string>> = {};
  for (const k of ['door', 'exit'] as const) if (display.colors?.[k]) colors[k] = display.colors[k];
  return colors;
}

/** Layer per `feature_kind`; tanpa WebGL sehingga bisa diuji langsung. */
export function buildStyleLayers(display: MapDisplay = {}): LayerSpecification[] {
  const source = FLOOR_SOURCE_ID;
  return [
    {
      id: LAYER_IDS.flat,
      type: 'fill',
      source,
      filter: ['all', isPolygon, kindIn(FLAT_KINDS)],
      paint: { 'fill-color': fillColor(display) },
    },
    {
      id: LAYER_IDS.rooms,
      type: 'fill',
      source,
      filter: ['all', isPolygon, kindIn(ROOM_KINDS)],
      paint: { 'fill-color': fillColor(display) },
    },
    {
      id: LAYER_IDS.roomOutline,
      type: 'line',
      source,
      filter: ['all', isPolygon, kindIn(ROOM_KINDS), ['!', isVacant]],
      // `outline` per fitur: tepi berwarna kategori di Visitor (lihat `categoryUnitColors`).
      paint: {
        'line-color': ['coalesce', ['get', 'outline'], byKind(DEFAULT_OUTLINE, '#bfc5cc')],
        'line-width': 1,
      },
    },
    {
      id: LAYER_IDS.vacantOutline,
      type: 'line',
      source,
      filter: ['all', isPolygon, isVacant],
      paint: { 'line-color': VACANT_UNIT.outline, 'line-width': 1, 'line-dasharray': [2, 2] },
    },
    {
      id: LAYER_IDS.walls,
      type: 'line',
      source,
      filter: ['==', kind, 'wall'],
      paint: { 'line-color': wallColor(display), 'line-width': 2 },
    },
    {
      id: LAYER_IDS.points,
      type: 'circle',
      source,
      filter: ['all', ['==', ['geometry-type'], 'Point'], kindIn(POINT_KINDS)],
      paint: {
        'circle-radius': byKind(
          Object.fromEntries(Object.entries(POINT_STYLE).map(([k, v]) => [k, v.radius])),
          3,
        ),
        'circle-color': byKind(
          {
            ...Object.fromEntries(Object.entries(POINT_STYLE).map(([k, v]) => [k, v.color])),
            ...pointColors(display),
          },
          POINT_COLOR,
        ),
        'circle-stroke-color': '#ffffff',
        'circle-stroke-width': 1,
      },
    },
  ];
}

const emptyCollection = () => ({ type: 'FeatureCollection' as const, features: [] });

/**
 * Style tanpa basemap internet: hanya latar dan data lantai dari snapshot. Nama lokasi dan ikon
 * fasilitas digambar lewat satu layer label yang saling menyembunyikan saat bertumpuk.
 */
export function buildStyle(labelFont: LabelFont, display: MapDisplay = {}): StyleSpecification {
  return {
    version: 8,
    'font-faces': labelFontFaces(labelFont),
    sources: {
      [FLOOR_SOURCE_ID]: { type: 'geojson', data: emptyCollection() },
      [LABEL_SOURCE_ID]: { type: 'geojson', data: emptyCollection() },
    },
    layers: [
      {
        id: LAYER_IDS.background,
        type: 'background',
        paint: { 'background-color': MAP_BACKGROUND },
      },
      ...buildStyleLayers(display),
      labelLayer(labelFont),
    ],
  };
}
