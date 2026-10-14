import type { Rgb } from './hsb.js';
import { expandHistoricalManaInk } from './historical-mana-ink.js';
import { hexManaColor } from './mana-colors.js';
export { hexManaColor } from './mana-colors.js';

export interface ManaGlyphPalette {
  discColor: string;
  inkColor: string;
  inkExpansion?: number;
}
/** Separate two-color source ink from its disc, including neutral gray discs
 * that cannot be recolored using a saturation multiplier. Preserve edge alpha. */
export function recolorHistoricalManaPixels(
  data: Uint8ClampedArray,
  palette: ManaGlyphPalette,
  target: Rgb,
) {
  const paper = hexManaColor(palette.discColor),
    ink = hexManaColor(palette.inkColor),
    axis = paper.map((v, i) => v - ink[i]!),
    norm = axis.reduce((s, v) => s + v * v, 0);
  if (norm < 0.01) throw Error('Historical mana palette has no ink contrast');
  for (let i = 0; i < data.length; i += 4) {
    if (!data[i + 3]) continue;
    const weight = Math.max(
      0,
      Math.min(1, axis.reduce((s, v, k) => s + (data[i + k]! / 255 - ink[k]!) * v, 0) / norm),
    );
    for (let c = 0; c < 3; c++)
      data[i + c] = Math.round(255 * (ink[c]! * (1 - weight) + target[c]! * weight));
  }
}
export async function buildHistoricalMana(
  source: ImageBitmap,
  palette: ManaGlyphPalette,
  target: Rgb,
) {
  const canvas = document.createElement('canvas');
  canvas.width = source.width;
  canvas.height = source.height;
  try {
    const c = canvas.getContext('2d', { willReadFrequently: true });
    if (!c) throw Error('Historical mana preparation needs Canvas2D.');
    c.drawImage(source, 0, 0);
    const pixels = c.getImageData(0, 0, canvas.width, canvas.height);
    if (palette.inkExpansion)
      expandHistoricalManaInk(pixels.data, canvas.width, canvas.height, palette);
    recolorHistoricalManaPixels(pixels.data, palette, target);
    c.putImageData(pixels, 0, 0);
    return await createImageBitmap(canvas);
  } finally {
    canvas.width = canvas.height = 0;
  }
}
