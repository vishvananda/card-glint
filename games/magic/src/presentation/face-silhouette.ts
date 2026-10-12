import { FACE_CORNER_RADIUS, type RenderedCardInput } from './face-layout.js';
import { isRetro } from './retro-frame.js';

/** One policy for Canvas composition and the GPU silhouette. Historical
 * frames retain their separately reviewed, rounder stock. */
export const MODERN_CORNER_RADIUS = 0.045;
export function faceCornerRadius(face: RenderedCardInput): number {
  return isRetro(face) ? FACE_CORNER_RADIUS : MODERN_CORNER_RADIUS;
}
