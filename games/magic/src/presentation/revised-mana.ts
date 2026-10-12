import type { CanvasImages } from './canvas-assets.js';
import { paintMana } from './canvas-text.js';

/** Frozen Revised nonland policy. Header geometry does not change title fitting. */
export function paintRevisedCost(
  c: CanvasRenderingContext2D,
  symbols: readonly string[],
  images: CanvasImages,
) {
  symbols.forEach((symbol, index) => {
    const size = 23.4;
    const x = 435 - (symbols.length - 1 - index) * 27 - size / 2;
    const y = 44.5 - size / 2;
    if (symbol !== 'W') {
      paintMana(c, symbol, x, y, size, images, false);
      return;
    }
    // Mana's original sun has no cost disc. Normalize its actual outline bounds,
    // since the font's advance and em box do not describe the visible symbol.
    c.save();
    c.shadowColor = 'transparent';
    c.shadowOffsetX = c.shadowOffsetY = 0;
    c.fillStyle = '#0d0f0f';
    c.font = '100px "CardRenderer MTG Historic Symbols"';
    c.textAlign = 'left';
    c.textBaseline = 'alphabetic';
    const glyph = '\ue997';
    const m = c.measureText(glyph);
    const width = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
    const height = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
    const scale = 21 / Math.max(width, height);
    c.translate(x + size / 2, y + size / 2);
    c.scale(scale, scale);
    c.fillText(
      glyph,
      (m.actualBoundingBoxLeft - m.actualBoundingBoxRight) / 2,
      (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2,
    );
    c.restore();
  });
}
