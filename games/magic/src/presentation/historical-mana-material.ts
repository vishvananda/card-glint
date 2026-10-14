import type { Rgb } from './hsb.js';

export interface ManaGlyphPalette {
  discColor: string;
  inkColor: string;
}
export function hexManaColor(hex: string): Rgb {
  if (!/^#[a-f0-9]{6}$/i.test(hex)) throw Error('Invalid mana palette color');
  return [
    parseInt(hex.slice(1, 3), 16) / 255,
    parseInt(hex.slice(3, 5), 16) / 255,
    parseInt(hex.slice(5, 7), 16) / 255,
  ];
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
    recolorHistoricalManaPixels(pixels.data, palette, target);
    c.putImageData(pixels, 0, 0);
    return await createImageBitmap(canvas);
  } finally {
    canvas.width = canvas.height = 0;
  }
}
