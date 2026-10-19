/** Small Canvas2D preparation helpers, independent of any game pack. */
export { canvas, rasterCanvas, closeRaster } from './canvas-raster.js';
export type { CanvasRaster, CanvasContext } from './canvas-raster.js';
export type { CoverageMap } from './canvas-mask.js';
export { decodeCanvasImage, sizedCanvasSvg } from './canvas-images.js';
export { ellipsizedText } from './canvas-text.js';
export { coverImage } from './image-cover.js';
export type { ImageFit } from './image-cover.js';
export { setAssetFetcher } from './asset-fetch.js';
