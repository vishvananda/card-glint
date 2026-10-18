import type { Rgb } from './hsb.js';

export interface ManaInkTone {
  readonly paper: Rgb;
  readonly sourceInk: Rgb;
  readonly inkTarget: Rgb;
}

/** Recolor solid pigment in the existing preparation buffer. Preserve alpha,
 * fractional outer edges and flat paper; never read back the finished card. */
export function recolorManaInkPixels(data: Uint8ClampedArray, tone: ManaInkTone) {
  const paper = tone.paper.map((v) => v * 255),
    ink = tone.sourceInk.map((v) => v * 255),
    target = tone.inkTarget.map((v) => v * 255),
    axis = paper.map((v, k) => v - ink[k]!),
    norm = axis.reduce((n, v) => n + v * v, 0);
  if (!Number.isFinite(norm) || norm < 100)
    throw Error('Mana ink needs a contrasting paper palette.');
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] !== 255) continue;
    const coverage = Math.max(
      0,
      Math.min(1, axis.reduce((n, v, k) => n + v * (paper[k]! - data[i + k]!), 0) / norm),
    );
    for (let k = 0; k < 3; k++)
      data[i + k] = Math.round(data[i + k]! + (target[k]! - ink[k]!) * coverage);
  }
}
