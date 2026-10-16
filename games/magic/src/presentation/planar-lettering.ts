import type { RenderedCardInput } from './face-layout.js';
import { usesPlanarFrameGeometry } from './planar-frame-geometry.js';

/** Shared training-only header fit, checked with frozen scan poses and held-out
 * printings. Keep Matrix Bold: both pinned Matrix faces rasterize these labels
 * identically, so the study does not establish a reason to switch fonts. */
export function planarLettering(
  face: RenderedCardInput,
  source: string,
  part: 'title' | 'type',
): { dx: number; dy: number; size: number } {
  if (!usesPlanarFrameGeometry(face, source)) return { dx: 0, dy: 0, size: 1 };
  const shifted = face.frameTreatment === 'colorshifted';
  if (part === 'title')
    return shifted ? { dx: 0.25, dy: 0.75, size: 1.04 } : { dx: 1, dy: 0.75, size: 1.035 };
  return shifted ? { dx: -0.75, dy: -1.25, size: 1.03 } : { dx: 0.5, dy: 0, size: 1.025 };
}
