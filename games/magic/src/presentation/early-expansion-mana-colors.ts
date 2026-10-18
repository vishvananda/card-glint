import type { Rgb } from './hsb.js';

/** Native palette residual fit on calibration cards only. See early-expansion-mana.json. */
export const EARLY_EXPANSION_MANA_TARGETS: Readonly<Record<string, Rgb>> = {
  'arn-black-W': [229 / 255, 229 / 255, 223 / 255],
  'arn-black-U': [170 / 255, 205 / 255, 224 / 255],
  'arn-black-G': [180 / 255, 200 / 255, 185 / 255],
  'arn-black-N': [185 / 255, 186 / 255, 185 / 255],
  'arn-black-B': [154 / 255, 150 / 255, 151 / 255],
  'arn-black-R': [213 / 255, 182 / 255, 177 / 255],
  'atq-black-N': [188 / 255, 183 / 255, 177 / 255],
  'atq-black-B': [158 / 255, 152 / 255, 141 / 255],
  'atq-black-R': [215 / 255, 182 / 255, 164 / 255],
  'atq-black-W': [220 / 255, 224 / 255, 205 / 255],
  'atq-black-U': [183 / 255, 214 / 255, 224 / 255],
  'atq-black-G': [194 / 255, 213 / 255, 185 / 255],
  // Robust glyph separation now uses the intended paper rather than a darkened
  // rim probe. Preserve the previous rendered disc's measured median color.
  'drk-black-B': [146 / 255, 124 / 255, 118 / 255],
  'drk-black-G': [179 / 255, 195 / 255, 158 / 255],
  'drk-black-U': [177 / 255, 205 / 255, 218 / 255],
  'drk-black-N': [185 / 255, 171 / 255, 162 / 255],
  'drk-black-W': [233 / 255, 224 / 255, 192 / 255],
  'drk-black-R': [210 / 255, 165 / 255, 151 / 255],
  'arn-dark-black-W': [228 / 255, 228 / 255, 223 / 255],
  'arn-light-black-W': [233 / 255, 232 / 255, 211 / 255],
  'arn-dark-black-B': [151 / 255, 148 / 255, 148 / 255],
  'arn-light-black-B': [167 / 255, 181 / 255, 181 / 255],
};
