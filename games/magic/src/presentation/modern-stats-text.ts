import type { CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import type { RenderedCardInput } from './face-layout.js';
import { modernPrintingProfile } from './modern-printing-profile.js';
import { paintTextInk } from './text-ink.js';

/** Keep the source family's P/T font and anchor; exact-set fits change glyphs only. */
export function paintModernStatsText(
  c: CanvasContext,
  text: string,
  x: number,
  y: number,
  width: number,
  face: RenderedCardInput,
) {
  const fit = modernPrintingProfile(face)?.statsText;
  if (!fit) return paintTextInk(c, text, x, y, width, face.textInk);
  c.save();
  try {
    c.font = c.font.replace(/([\d.]+)px/, (_, size: string) => `${Number(size) * fit.size}px`);
    if (fit.fractionalMetrics) {
      c.textRendering = 'geometricPrecision';
      c.fontKerning = 'normal';
    }
    paintTextInk(c, text, x, y, width, face.textInk);
  } finally {
    c.restore();
  }
}
