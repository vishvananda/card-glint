import type { RenderedCardInput } from './face-layout.js';
import { usesPlanarFrameGeometry } from './planar-frame-geometry.js';

export function planarStatsFont(face: RenderedCardInput, source: string): string | undefined {
  return usesPlanarFrameGeometry(face, source) ? 'CardRenderer MTG ModMatrix' : undefined;
}

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
        : ([407, 627, 2, -2.25, 1.03, 1.01] as const);
  c.translate(x + dx, y + dy);
  c.scale(size * width, size);
  c.translate(-x, -y);
}

let statsFont: Promise<void> | null = null;
export function loadPlanarStatsFont(face: RenderedCardInput, source: string): Promise<void> {
  const family = planarStatsFont(face, source);
  if (!family || face.power == null || face.toughness == null) return Promise.resolve();
  return (statsFont ??= document.fonts
    .load(`700 29px "${family}"`)
    .then((fonts) => {
      if (!fonts.length || fonts.some((font) => font.status !== 'loaded'))
        throw Error('Planar Chaos P/T needs card-glint/magic/fonts.css.');
    })
    .catch((error: unknown) => {
      statsFont = null;
      throw error;
    }));
}
