import { measureFontText, paintFontText } from './font-geometry.js';
import { canvasFonts } from './canvas-font-registry.js';
import { type CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import type { RenderedCardInput } from './face-layout.js';
import { usesPlanarFrameGeometry } from './planar-frame-geometry.js';

export function planarStatsFont(face: RenderedCardInput, source: string): string | undefined {
  return usesPlanarFrameGeometry(face, source) ? 'CardRenderer MTG ModMatrix' : undefined;
}

/** ModMatrix's star is larger than the printed PLC glyph. Fit star ink without
 * changing advances, digits or slash: two calibration and six validation scans.
 * The caller selects this painter only for the measured Planar frame family. */
export function paintPlanarStats(c: CanvasContext, text: string): void {
  if (!text.includes('*')) {
    paintFontText(c, text, 407, 627, 78);
    return;
  }
  c.save();
  const width = measureFontText(c, text).width;
  c.translate(407, 0);
  c.scale(Math.min(1, 78 / width), 1);
  c.textAlign = 'left';
  let prefix = '';
  for (const run of text.split(/(\*)/).filter(Boolean)) {
    const left = -width / 2 + measureFontText(c, prefix).width;
    if (run === '*') {
      const m = measureFontText(c, run);
      const x = left + (m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2;
      const y = 627 + (m.actualBoundingBoxDescent - m.actualBoundingBoxAscent) / 2;
      c.save();
      c.translate(x, y + 1.25);
      c.scale(0.775, 0.775);
      c.translate(-x, -y);
      paintFontText(c, run, left, 627);
      c.restore();
    } else paintFontText(c, run, left, 627);
    prefix += run;
  }
  c.restore();
}

/** Shared footer ink fits. The source badge and texture keep their own bounds.
 * Apply only during face preparation, within a caller-owned saved context. */
export function transformPlanarFooter(
  c: CanvasContext,
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
  return (statsFont ??= canvasFonts()
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
