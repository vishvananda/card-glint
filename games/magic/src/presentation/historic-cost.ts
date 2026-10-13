import type { CanvasImages } from './canvas-assets.js';
import { paintMana } from './canvas-text.js';

/** Frozen Revised nonland policy. Header geometry does not change title fitting. */
export function paintRevisedCost(
  c: CanvasRenderingContext2D,
  symbols: readonly string[],
  images: CanvasImages,
  modernSymbols = false,
) {
  paintCost(
    c,
    symbols,
    images,
    {
      right: 435,
      centerY: 44.5,
      pitch: 27,
      size: 23.4,
      whiteSize: 21,
    },
    modernSymbols,
  );
}

/** Alpha calibration validated on reserved Alpha and Unlimited costs. */
export function paintEarlyCost(
  c: CanvasRenderingContext2D,
  symbols: readonly string[],
  images: CanvasImages,
  modernSymbols = false,
) {
  paintCost(
    c,
    symbols,
    images,
    {
      right: 432,
      centerY: 46,
      pitch: 27,
      size: 23.9,
      whiteSize: 20.5,
    },
    modernSymbols,
  );
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
  modernSymbols: boolean,
) {
  symbols.forEach((symbol, index) => {
    const { size } = geometry;
    const x = geometry.right - (symbols.length - 1 - index) * geometry.pitch - size / 2;
    const y = geometry.centerY - size / 2;
    if (symbol !== 'W' || modernSymbols) {
      paintMana(c, symbol, x, y, size, images, false);
      return;
    }
    paintOriginalWhite(c, x, y, size, geometry.whiteSize, images.manaColors?.W);
  });
}

/** The original sun and its pale disc also occur inside early rules text. */
export const paintEarlyMana: typeof paintMana = (c, symbol, x, y, size, images) => {
  if (symbol !== 'W') return paintMana(c, symbol, x, y, size, images);
  paintOriginalWhite(c, x, y, size, size * 0.87, images.manaColors?.W);
};

function paintOriginalWhite(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  whiteSize: number,
  fill = '#efe7cb',
) {
  // The font supplies only the black glyph; its outline and disc size differ.
  c.save();
  c.shadowColor = 'transparent';
  c.shadowOffsetX = c.shadowOffsetY = 0;
  c.fillStyle = fill;
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
  const scale = whiteSize / Math.max(width, height);
  c.translate(x + size / 2, y + size / 2);
  c.scale(scale, scale);
  c.fillText(
    glyph,
    (m.actualBoundingBoxLeft - m.actualBoundingBoxRight) / 2,
    (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2,
  );
  c.restore();
}
