import type { RenderedCardInput } from './face-layout.js';
import { usesPlanarFrameGeometry } from './planar-frame-geometry.js';

/** Shared footer ink fits. The source badge and texture keep their own bounds.
 * Apply only during face preparation, within a caller-owned saved context. */
export function transformPlanarFooter(
  c: CanvasRenderingContext2D,
  face: RenderedCardInput,
  source: string,
  part: 'artist' | 'legal' | 'stats',
): void {
  if (!usesPlanarFrameGeometry(face, source)) return;
  const [x, y, dx, dy, size, width] =
    part === 'artist'
      ? ([77, 634, -1, 3.25, 0.995, 1] as const)
      : part === 'legal'
        ? ([36.5, 647, 4.5, 4.75, 0.995, 1.1] as const)
        : ([407, 627, 2, 1, 1.03, 0.995] as const);
  c.translate(x + dx, y + dy);
  c.scale(size * width, size);
  c.translate(-x, -y);
}
