import type { Rgb } from './hsb.js';

/** Disc targets are independent of the chosen glyph source. Geometry and ink
 * are fitted separately; these colors are opt-in through printing calibration.
 * Evidence: fixtures/accuracy/beta-mana-materials.json. */
export const MANA_PRINTING_TARGETS: Readonly<Record<string, Rgb>> = {
  'leb-black-W': [228 / 255, 228 / 255, 209 / 255],
  'leb-black-U': [163 / 255, 201 / 255, 213 / 255],
  'leb-black-B': [113 / 255, 122 / 255, 121 / 255],
  'leb-black-R': [215 / 255, 170 / 255, 152 / 255],
  'leb-black-G': [175 / 255, 199 / 255, 167 / 255],
  'leb-black-N': [156 / 255, 162 / 255, 162 / 255],
};

/** Expansion in pixels for a nominal 24px disc. Only measured printing/source
 * combinations qualify; other printings retain their source artwork. */
export const MANA_PRINTING_INK: Readonly<Record<string, { family: string; pixels: number }>> = {
  'leb/R': { family: 'mse-old', pixels: 0.4 },
};
