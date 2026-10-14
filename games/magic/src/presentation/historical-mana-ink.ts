import type { ManaGlyphPalette } from './historical-mana-material.js';
import { hexManaColor } from './mana-colors.js';

/** Cached source preparation only. Circular fractional dilation thickens ink
 * without scaling the glyph or changing the disc's original edge alpha. */
export function expandHistoricalManaInk(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  palette: ManaGlyphPalette,
): void {
  const amount = palette.inkExpansion ?? 0;
  if (!Number.isFinite(amount) || amount < 0 || amount > 1)
    throw Error('Historical mana ink expansion is outside its supported range.');
  if (!amount) return;
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width <= 0 ||
    height <= 0 ||
    data.length !== width * height * 4
  )
    throw Error('Historical mana ink pixels do not match their dimensions.');
  const paper = hexManaColor(palette.discColor),
    ink = hexManaColor(palette.inkColor),
    axis = paper.map((v, k) => v - ink[k]!),
    norm = axis.reduce((s, v) => s + v * v, 0);
  if (norm < 0.01) throw Error('Historical mana palette has no ink contrast');
  const mask = new Float32Array(width * height);
  for (let i = 0; i < mask.length; i++) {
    if (data[i * 4 + 3]! < 255) continue;
    mask[i] = Math.max(
      0,
      Math.min(1, axis.reduce((s, v, k) => s + v * (paper[k]! - data[i * 4 + k]! / 255), 0) / norm),
    );
  }
  const radius = (Math.min(width, height) * amount) / 24,
    limit = Math.ceil(radius),
    offsets: { x: number; y: number; weight: number }[] = [];
  for (let y = -limit; y <= limit; y++)
    for (let x = -limit; x <= limit; x++) {
      const weight = Math.max(0, Math.min(1, radius + 1 - Math.hypot(x, y)));
      if (weight) offsets.push({ x, y, weight });
    }
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      if (data[i * 4 + 3]! < 255) continue;
      let opacity = mask[i]!;
      for (const o of offsets) {
        const sx = x + o.x,
          sy = y + o.y;
        if (sx >= 0 && sx < width && sy >= 0 && sy < height)
          opacity = Math.max(opacity, mask[sy * width + sx]! * o.weight);
      }
      if (opacity <= mask[i]!) continue;
      for (let k = 0; k < 3; k++)
        data[i * 4 + k] = Math.round(255 * (paper[k]! * (1 - opacity) + ink[k]! * opacity));
    }
}
