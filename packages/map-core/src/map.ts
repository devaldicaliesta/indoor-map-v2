import type { MapFeatureProperties } from '@indoor/domain';
import type { FeatureCollection, Geometry } from 'geojson';
import { type GeoJSONSource, type LngLatLike, Map as MapLibreMap } from 'maplibre-gl';
import type { LabelFont } from './layers/labels';
import { handleMissingFacilityIcons } from './sprites';
import { buildStyle, FLOOR_SOURCE_ID, type MapDisplay } from './style';

export type FloorFeatureCollection = FeatureCollection<Geometry, MapFeatureProperties>;

export interface CreateMapOptions {
  center: LngLatLike;
  zoom?: number;
  bearing?: number;
  display?: MapDisplay;
  /** Font label nama lokasi dan ikon fasilitas, di-host sendiri. */
  labelFont: LabelFont;
}

/** Peta MapLibre dengan style kosong: tidak ada tile server atau font dari internet. */
export function createMap(container: HTMLElement, options: CreateMapOptions): MapLibreMap {
  const map = new MapLibreMap({
    container,
    style: buildStyle(options.labelFont, options.display),
    center: options.center,
    zoom: options.zoom ?? 18,
    bearing: options.bearing ?? 0,
    pitch: 0,
    maxPitch: 0,
    attributionControl: false,
  });
  handleMissingFacilityIcons(map);
  return map;
}

/** Berganti lantai = mengganti data satu source, bukan membuat peta baru. */
export function setFloorData(map: MapLibreMap, features: FloorFeatureCollection): void {
  const source = map.getSource<GeoJSONSource>(FLOOR_SOURCE_ID);
  if (!source) throw new Error(`Source ${FLOOR_SOURCE_ID} belum ada; tunggu event load.`);
  source.setData(features);
}

/**
 * Label aksesibilitas kanvas peta. MapLibre memasang "Map" berbahasa Inggris, jadi aplikasi
 * mengganti dengan teks dalam bahasa antarmuka (juga saat bahasa diganti).
 */
export function setMapLabel(map: MapLibreMap, label: string): void {
  map.getCanvas().setAttribute('aria-label', label);
}

/** Batas kotak semua fitur, untuk mengarahkan kamera ke lantai. */
export function featureBounds(
  features: FloorFeatureCollection,
): [[number, number], [number, number]] | null {
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  const visit = (value: unknown): void => {
    if (Array.isArray(value) && typeof value[0] === 'number' && typeof value[1] === 'number') {
      minX = Math.min(minX, value[0]);
      minY = Math.min(minY, value[1]);
      maxX = Math.max(maxX, value[0]);
      maxY = Math.max(maxY, value[1]);
    } else if (Array.isArray(value)) {
      for (const item of value) visit(item);
    }
  };
  for (const feature of features.features) {
    if ('coordinates' in feature.geometry) visit(feature.geometry.coordinates);
  }
  return Number.isFinite(minX)
    ? [
        [minX, minY],
        [maxX, maxY],
      ]
    : null;
}
