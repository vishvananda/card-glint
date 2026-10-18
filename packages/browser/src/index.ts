export { createRenderer, Renderer, type RendererOptions } from './renderer.js';
export * from './types.js';
/** Public instance rainFog support, independent of game packs and releases. */
export const rainFogVersion = 1;
export { canvas, closeRaster } from './raster.js';

export { coverImage } from './image-cover.js';
export type { ImageFit } from './image-cover.js';
export { createDisplayRaster, type DisplayRaster } from './display-raster.js';
/** Continuous varied print screens and CSS-host display sampling helpers. */
export const printSamplingVersion = 1;

/** Native reflective diffraction finish, independent of local hologram patches. */
export const holofoilVersion = 1;

export { DEFAULT_PRINT_DOTS } from './print-settings.js';
