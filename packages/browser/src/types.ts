import type { ImageFit } from './image-cover.js';
/** Public game-neutral contract. Inputs use normalized top-left card coordinates. */
export type Rect = readonly [number, number, number, number];
export type Size = readonly [number, number];
export type Finish =
  | 'regular'
  | 'gloss'
  | 'etched'
  | 'prismatic'
  | 'cold'
  | 'opal'
  | 'rain'
  | 'heat'
  | 'pool';
export type Tier = 'table' | 'inspect';
export interface Lease<T> {
  value: T;
  release(): void;
}
export interface AssetRequest {
  url: string;
  width?: number;
  revision?: string;
}
export interface RasterHost {
  images(
    requests: readonly AssetRequest[],
    signal: AbortSignal,
  ): Promise<Lease<ReadonlyMap<string, ImageBitmap>>>;
}
export interface Raster {
  /** Immutable content identity, including all dependencies and recipe version. */
  key: string;
  size: Size;
  paint(
    host: RasterHost,
    signal: AbortSignal,
    underArt?: HTMLCanvasElement,
  ): Promise<HTMLCanvasElement>;
}
export interface EdgeSource {
  /** Same image/threshold can be reused across faces, crops and finishes. */
  key: string;
  asset: AssetRequest;
  crop: Rect;
  rotation?: -90 | 0 | 90;
  destination: Rect;
  /** Optional source focal point and zoom, shared with color composition. */
  fit?: ImageFit;
  clip: Rect;
  threshold: number;
  /** Imported edge masks skip the detector. Alpha is extracted to linear R8. */
  importedMask?: AssetRequest;
}
/** A local reflective coating on the final printed composite. The mask's alpha
 * is mapped into rect; its RGB is ignored. Packs own the shape and must keep
 * protected lettering/borders outside it. Motion changes lighting, not the mask. */
export interface Hologram {
  mask: Raster;
  rect: Rect;
  strength: number;
  /** Stable unsigned seed for the fixed microtexture; defaults to zero. */
  seed?: number;
}
export interface FaceRecipe {
  pack: string;
  color: Raster;
  stamp?: Raster;
  edges: readonly EdgeSource[];
  artWindows: readonly Rect[];
  cornerRadius: number;
  finishCoverageBase?: number;
  /** Optional satin reflection on the combined over-finish printing. It never
   * refracts, blurs or etches those layers. Omit to keep overlays unshaded. */
  overlayFoil?: { tone: 'gold' | 'silver' | 'prismatic'; strength: number };
  /** Independent of the instance finish, including regular/nonfoil cards. */
  hologram?: Hologram;
  regions: readonly { id: string; rect: Rect }[];
}
export interface GamePack<T> {
  readonly id: string;
  describe(input: T, tier: Tier): FaceRecipe;
  dispose?(): void;
}
export type LayerStage = 'under-art' | 'printed-content' | 'under-finish' | 'over-finish';
export interface CardLayer {
  id: string;
  order: number;
  stage: LayerStage;
  raster: Raster;
  clip?: Rect;
  contributesToEtch?: boolean;
  finishCoverage?: { add?: Raster; exclude?: Raster };
  etchCoverage?: { add?: Raster; exclude?: Raster };
}
export interface CardDocument {
  id: number;
  revision: number;
  recipe: FaceRecipe;
  layers?: readonly CardLayer[];
}
export interface Instance {
  id: number;
  card: number;
  /** Column-major local unit quad → world matrix. Local y increases downward. */
  transform: readonly number[];
  order?: number;
  finish?: Finish;
  /** Rain condensation density, 0 (clear) to 2; omitted/1 keeps native fog.
   * Does not change droplets, refraction, reflections, blur or motion. */
  rainFog?: number;
  /** Optional abrasion over any finish. Amount is 0 (fresh) to 1 (heavily played).
   * Seed is a uint32, defaulting to the instance ID; persist it with the card. */
  wear?: { amount: number; seed?: number };
  /** Card-local coating relief over optical finishes. Amount 0..1; omitted/zero keeps smooth gloss. */
  cardstock?: { amount: number };
  /** Experimental process-ink dots. Amount 0..1, period 2..16 source pixels (default 5). */
  printDots?: { amount: number; period?: number; variation?: number; inset?: number };
  /** Optional whole-card silhouette warp. Amount is local card width, 0–0.02.
   * Card layers/masks follow it; world/scene/HUD layers keep their own geometry.
   * Leave unset for artwork-only finishes or a fixed silhouette. */
  deformation?: { kind: 'heat'; amount: number };
  /** World-space unit normal; defaults to +Z. */
  normal?: readonly [number, number, number];
}
export interface SceneLayer {
  id: string;
  raster: Raster;
  transform: readonly number[];
  order: number;
  stage: 'world-under-cards' | 'world-interleaved' | 'scene-overlay' | 'hud';
  depth: 'test-write' | 'test-readonly' | 'ignore';
}
export interface Budgets {
  gpuBytes: number;
  cpuBytes: number;
  /** Reserved separately from resident textures for etching and temporary uploads. */
  scratchBytes: number;
  preparationConcurrency: number;
}
export interface Frame {
  viewProjection: Float32Array;
  pointer?: readonly [number, number];
  /** Host-owned elapsed seconds. Omit (or keep fixed) for a still surface. */
  time?: number;
  /** Actual hit, in top-left card UVs. Only this instance receives ripple impulses. */
  hover?: { instance: number; uv: readonly [number, number] };
  clear?: readonly [number, number, number, number];
}
export interface CacheStats {
  hits: number;
  misses: number;
  admissions: number;
  evictions: number;
  bytes: number;
  peakBytes: number;
  rejected: number;
}
export interface Metrics {
  compositions: number;
  maskBuilds: number;
  edgeBuilds: number;
  uploads: number;
  readbacks: number;
  draws: number;
  visible: number;
  pending: number;
  gpu: CacheStats;
  cpu: CacheStats;
  scratchBytes: number;
  cpuFrameMs: number;
  /** Cumulative shared caustic light-map renders; fixed time reuses the last map. */
  surfacePasses: number;
  /** Fixed optical target and mesh allocation, separate from asset-cache budgets. */
  surfaceBytes: number;
}
export const IDENTITY = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
