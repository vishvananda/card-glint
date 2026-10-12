import type { CanvasImages } from './canvas-assets.js';
import { paintMana } from './canvas-text.js';

/** Frozen Revised nonland policy. Header geometry does not change title fitting. */
export function paintRevisedCost(
  c: CanvasRenderingContext2D,
  symbols: readonly string[],
  images: CanvasImages,
) {
  paintCost(c, symbols, images, {
    right: 435,
    centerY: 44.5,
    pitch: 27,
    size: 23.4,
    whiteSize: 21,
  });
}

/** Alpha calibration validated on reserved Alpha and Unlimited costs. */
export function paintEarlyCost(
  c: CanvasRenderingContext2D,
  symbols: readonly string[],
  images: CanvasImages,
) {
  paintCost(c, symbols, images, {
    right: 432,
    centerY: 46,
    pitch: 27,
    size: 23.9,
    whiteSize: 20.5,
  });
}

function paintCost(
  c: CanvasRenderingContext2D,
  symbols: readonly string[],
  images: CanvasImages,
  geometry: Readonly<{
    right: number;
    centerY: number;
    pitch: number;
    size: number;
    whiteSize: number;
  }>,
) {
  symbols.forEach((symbol, index) => {
    const { size } = geometry;
    const x = geometry.right - (symbols.length - 1 - index) * geometry.pitch - size / 2;
    const y = geometry.centerY - size / 2;
    if (symbol !== 'W') {
      paintMana(c, symbol, x, y, size, images, false);
      return;
    }
    // The early sun is still printed on a pale disc. The font supplies only
    // the black glyph; normalize its outline independently of the disc size.
    c.save();
    c.shadowColor = 'transparent';
    c.shadowOffsetX = c.shadowOffsetY = 0;
    c.fillStyle = '#efe7cb';
    c.beginPath();
    c.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#0d0f0f';
    c.font = '100px "CardRenderer MTG Historic Symbols"';
    c.textAlign = 'left';
    c.textBaseline = 'alphabetic';
    const glyph = '\ue997';
    const m = c.measureText(glyph);
    const width = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
    const height = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
    const scale = geometry.whiteSize / Math.max(width, height);
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
