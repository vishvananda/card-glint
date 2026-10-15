import manifest from '../../assets.json' with { type: 'json' };
import type { FaceRect, RenderedCardInput } from './face-layout.js';

/** Revised land stock uses the Fourth texture with independent paper geometry.
 * Coordinates are rendering defaults, never individual scan normalization. */
export function isRevisedLand(face: RenderedCardInput): boolean {
  return (
    face.setCode?.toLowerCase() === '3ed' &&
    !face.frameTemplate &&
    face.frameStyle !== 'modern' &&
    !/\b(Saga|Class|Planeswalker|Battle)\b/.test(face.typeLine ?? '') &&
    (!face.layout || face.layout === 'normal') &&
    (face.land ?? /\bLand\b/.test(face.typeLine ?? ''))
  );
}
export const REVISED_LAND_ASSET = `${manifest.RETRO_ROOT}/img/frames/old/fourth/l.png`;
export const REVISED_LAND_FRAME: FaceRect = [2.404 / 488, 9.9 / 680, 0.984, 0.99];
export const REVISED_LAND_ART: FaceRect = [
  (2.404 + 0.10533333333333333 * 488 * 0.984) / 488,
  (9.9 + 0.08571428571428572 * 680 * 0.99) / 680,
  0.7926666666666666 * 0.984,
  0.4552380952380952 * 0.99,
];
/** Concentric paper bands start with the earlier color in this printed order.
 * This is distinct from mana ordering and from ABU's mask/base assignment. */
export function revisedLandColors(face: RenderedCardInput): string[] {
  const semantic =
    face.frameColors ??
    [
      ['Plains', 'W'],
      ['Island', 'U'],
      ['Swamp', 'B'],
      ['Mountain', 'R'],
      ['Forest', 'G'],
    ]
      .filter(([type]) => new RegExp(`\\b${type}\\b`).test(face.typeLine ?? ''))
      .map(([, color]) => color!);
  return [...new Set(semantic)]
    .filter((c) => 'WUBRG'.includes(c))
    .sort((a, b) => 'RBWUG'.indexOf(a) - 'RBWUG'.indexOf(b));
}
