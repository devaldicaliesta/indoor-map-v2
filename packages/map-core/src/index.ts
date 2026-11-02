export type { Map as MapInstance } from 'maplibre-gl';
export { prefersReducedMotion } from './camera';
export {
  type Crowd,
  type CrowdArea,
  type CrowdGraph,
  type CrowdOptions,
  type CrowdPerson,
  createCrowd,
  personFacing,
  personFrame,
  personMeters,
  personPosition,
  seededRandom,
  stepCrowd,
} from './crowd';
export type { PixelImage } from './crowd-sprite';
export {
  CROWD_FRAMES,
  CROWD_PIXEL_RATIO,
  type CrowdFacing,
  type CrowdFrame,
  type CrowdLook,
  lookKey,
  randomLook,
  renderCrowdSprite,
  uniqueLooks,
} from './crowd-sprite';
export {
  DEFAULT_FILL,
  MAP_ACCENT_COLORS,
  MAP_BACKGROUND,
} from './defaults';
export { BASEMAP_LAYER_ID, type Basemap, setBasemap } from './layers/basemap';
export {
  CLOSURE_LAYER_IDS,
  type ClosureMarks,
  closureCollection,
  setClosureMarks,
} from './layers/closures';
export {
  CROWD_LAYER_ID,
  CROWD_MIN_ZOOM,
  CROWD_SOURCE_ID,
  type CrowdInput,
  crowdCollection,
  crowdIconId,
  crowdLayer,
  setCrowd,
} from './layers/crowd';
export {
  HIGHLIGHT_COLORS,
  highlightFilters,
  highlightLayers,
  setHighlight,
} from './layers/highlight';
export {
  LABEL_LAYER_ID,
  LABEL_SOURCE_ID,
  type LabelFont,
  labelCollection,
  labelFontFaces,
  labelLayer,
  setLabels,
} from './layers/labels';
export {
  ORIGIN_LAYER_IDS,
  type OriginMarker,
  originCollection,
  setOriginMarkers,
} from './layers/origin';
export {
  ROUTE_COLOR,
  ROUTE_FLOW_STEPS,
  ROUTE_LAYER_IDS,
  type RouteView,
  routeCollection,
  routeFlowDash,
  routeLayers,
  setRoute,
} from './layers/route';
export type { LngLat } from './lng-lat';
export {
  type CreateMapOptions,
  createMap,
  type FloorFeatureCollection,
  featureBounds,
  setFloorData,
  setMapLabel,
} from './map';
export {
  createTapInteractions,
  type MapPick,
  PICK_TOLERANCE_PX,
  pickAt,
  type TapInteractionOptions,
} from './pick';
export {
  categoryIconTypeId,
  FACILITY_ICON_COLORS,
  FACILITY_ICON_FALLBACK,
  FACILITY_ICON_PREFIX,
  FACILITY_ICON_SIZE,
  type FacilityIconSpec,
  facilityIconId,
  fitContain,
  glyphColorOn,
  type IconSource,
  isOpaque,
  renderFacilityIcon,
  setFacilityIcons,
} from './sprites';
export {
  buildStyle,
  buildStyleLayers,
  FLOOR_SOURCE_ID,
  HIGHLIGHT_LAYER_IDS,
  LAYER_IDS,
  type MapDisplay,
} from './style';
export * from './tint';

export { detectWebGL, supportsWebGL, type WebGLProbeCanvas } from './webgl';
