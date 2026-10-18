import { calibrationForFace } from '../calibration/selection.js';
import { FACE_CORNER_RADIUS, type RenderedCardInput } from './face-layout.js';
import { isRetro } from './retro-frame.js';

/** One policy for Canvas composition and the GPU silhouette. Only Alpha keeps
 * the rounder historical stock; the other old frames share the modern cut. */
export const MODERN_CORNER_RADIUS = 0.045;
export function faceCornerRadius(face: RenderedCardInput): number {
  const configured = calibrationForFace(face)?.cornerRadius;
  if (configured !== undefined) return configured;
  return isRetro(face) && face.setCode?.toLowerCase() === 'lea'
    ? FACE_CORNER_RADIUS
    : MODERN_CORNER_RADIUS;
}
