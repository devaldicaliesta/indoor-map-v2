import type {
  SnapshotFeature,
  SnapshotFloor,
  SnapshotGraph,
  SnapshotInfoPoint,
  SnapshotLocation,
  SnapshotOriginPoint,
} from '@indoor/domain';
import { buildGraph, type RouteGraph } from './graph';

/**
 * Data yang dipakai routing; snapshot memenuhinya apa adanya.
 */
export interface RouteData {
  floors: readonly Pick<SnapshotFloor, 'id' | 'buildingId' | 'level'>[];
  graph: SnapshotGraph;
  /** Fitur peta: titik wakil unit/fasilitas tanpa titik masuk, dan poligon penutupan area. */
  features: { features: readonly Pick<SnapshotFeature, 'id' | 'geometry' | 'properties'>[] };
  locations: readonly Pick<SnapshotLocation, 'id' | 'unitIds' | 'primaryUnitId'>[];
  originPoints: readonly Pick<SnapshotOriginPoint, 'code' | 'floorId' | 'coordinates' | 'nodeId'>[];
  infoPoints: readonly Pick<SnapshotInfoPoint, 'code' | 'floorId' | 'coordinates' | 'nodeId'>[];
}

/** Graf rute dari data rute, dengan poligon fitur untuk penutupan area. */
export function buildRouteGraph(
  data: Pick<RouteData, 'floors' | 'graph' | 'features'>,
): RouteGraph {
  return buildGraph(data.graph, { floors: data.floors, features: data.features.features });
}
