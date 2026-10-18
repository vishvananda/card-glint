/** Shader functions for a host-owned depth pass; see docs/host-integration.md. */
export { foilShader } from './gpu/foil-preview-shader.js';
export { FOIL_REFLECTION_GLSL } from './gpu/foil-reflection-shader.js';
export { SURFACE_GLSL } from './gpu/surface-shader.js';
export { WORN_GLSL } from './gpu/worn-shader.js';
export { CARDSTOCK_GLSL } from './gpu/cardstock.js';
export { PRINT_DOTS_GLSL } from './gpu/print-dots.js';
export type { FinishMap } from './finish-printing.js';
export { FinishResources } from './finish-material.js';
export { SurfaceMotion } from './surface-motion.js';
export { surfaceSeed } from './deformation.js';
