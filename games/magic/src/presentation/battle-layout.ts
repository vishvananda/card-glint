import { measureFontText } from './font-geometry.js';
import type { CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import type { FaceRect, RenderedCardInput } from './face-layout.js';

/** Native 523 × 375 Battle rectangles, rotated into the physical portrait face. */
export function battlePhysicalRect([x, y, width, height]: FaceRect): FaceRect {
  return [y / 375, 1 - (x + width) / 523, height / 375, width / 523];
}

/** Inverse of battlePhysicalRect; input is normalized physical-card geometry. */
export function battleNativeRect([x, y, width, height]: FaceRect): FaceRect {
  return [(1 - y - height) * 523, x * 375, height * 523, width * 375];
}

/** Pinned MSE dfc/card_fields plus the Battle style's -10/+9 hint offsets.
 * Right = 523 - 28 - 10; top = 375 - 77 + 9. Font sizes convert points to pixels. */
export const BATTLE_REVERSE_STATS = {
  rect: [455, 307, 30, 12] as FaceRect,
  font: 'bold 16px "CardRenderer MTG ModMatrix"',
  color: 'rgb(45, 45, 45)',
} as const;

export interface BattleReverseStatsLayout {
  text: string;
  font: string;
  /** Native landscape coordinates, shared with the painter. */
  x: number;
  baseline: number;
  inkBounds: FaceRect;
  /** Measured ink in normalized physical portrait coordinates. */
  rect: FaceRect;
  rotation: -90;
}

/** Measure the reverse creature's reminder independently of the live defense badge.
 * MSE aligns this field bottom-right without shrink-overflow. */
export function battleReverseStatsLayout(
  context: CanvasContext,
  face: RenderedCardInput,
): BattleReverseStatsLayout | null {
  if (face.frameTemplate !== 'battle' || !face.reverseStats) return null;
  const text = `${face.reverseStats.power}/${face.reverseStats.toughness}`;
  context.save();
  try {
    context.font = BATTLE_REVERSE_STATS.font;
    context.textAlign = 'right';
    context.textBaseline = 'alphabetic';
    context.letterSpacing = '0px';
    const metrics = measureFontText(context, text),
      [left, top, width, height] = BATTLE_REVERSE_STATS.rect,
      x = left + width,
      baseline = top + height - metrics.actualBoundingBoxDescent;
    const inkBounds: FaceRect = [
      x - metrics.actualBoundingBoxLeft,
      baseline - metrics.actualBoundingBoxAscent,
      metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight,
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
    ];
    return {
      text,
      font: BATTLE_REVERSE_STATS.font,
      x,
      baseline,
      inkBounds,
      rect: battlePhysicalRect(inkBounds),
      rotation: -90,
    };
  } finally {
    context.restore();
  }
}
