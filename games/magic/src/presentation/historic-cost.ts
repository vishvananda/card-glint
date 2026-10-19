import { type CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import { paintOriginalWhite } from './historical-white.js';
import type { ManaSymbolTransform } from './symbol-adjustment.js';
import { colorGlyphTransform } from './symbol-adjustment.js';
import type { CanvasImages } from './canvas-assets.js';
import { paintMana } from './canvas-text.js';

/** Frozen Revised nonland policy. Header geometry does not change title fitting. */
export function paintRevisedCost(
  c: CanvasContext,
  symbols: readonly string[],
  images: CanvasImages,
  modernSymbols = false,
  adjustment?: ManaSymbolTransform,
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
    adjustment,
  );
}

/** Alpha calibration validated on reserved Alpha and Unlimited costs. */
export function paintEarlyCost(
  c: CanvasContext,
  symbols: readonly string[],
  images: CanvasImages,
  modernSymbols = false,
  adjustment?: ManaSymbolTransform,
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
    adjustment,
  );
}

function paintCost(
  c: CanvasContext,
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
  adjustment?: ManaSymbolTransform,
) {
  symbols.forEach((symbol, index) => {
    const { size } = geometry;
    const x =
      geometry.right -
      (symbols.length - 1 - index) * (geometry.pitch + (adjustment?.spacing ?? 0)) -
      size / 2;
    const y = geometry.centerY - size / 2;
    if (symbol !== 'W' || modernSymbols || images.originalManaGlyphs?.has('W')) {
      paintMana(c, symbol, x, y, size, images, false, adjustment);
      return;
    }
    paintOriginalWhite(
      c,
      x,
      y,
      size,
      geometry.whiteSize,
      images.manaColors?.W,
      colorGlyphTransform(adjustment, symbol),
      images.manaInkColor,
    );
  });
}

/** The original sun and its pale disc also occur inside early rules text. */
export const paintEarlyMana: typeof paintMana = (
  c,
  symbol,
  x,
  y,
  size,
  images,
  shadow = false,
  adjustment,
) => {
  if (symbol !== 'W' || images.originalManaGlyphs?.has('W'))
    return paintMana(c, symbol, x, y, size, images, shadow, adjustment);
  paintOriginalWhite(
    c,
    x,
    y,
    size,
    size * 0.87,
    images.manaColors?.W,
    colorGlyphTransform(adjustment, symbol),
    images.manaInkColor,
  );
};
