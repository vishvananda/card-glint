import type { FaceRect, RenderedCardInput } from './face-layout.js';

export const SYMBOL_ADJUSTMENT_VERSION = 'symbols-v1';
/** Opt-in review deltas, in canonical 488 × 680 pixels. Right/center anchored. */
export interface SymbolTransform {
  dx?: number;
  dy?: number;
  scaleX?: number;
  scaleY?: number;
}
export interface SymbolAdjustment {
  mana?: SymbolTransform;
  set?: SymbolTransform;
}
export function validateSymbolAdjustment(face: RenderedCardInput): void {
  if (!face.symbolAdjustment) return;
  if (
    (face.layout && face.layout !== 'normal') ||
    /\b(Saga|Class|Planeswalker|Battle)\b/.test(face.typeLine ?? '') ||
    /^Level up\b/m.test(face.rulesText ?? '')
  )
    throw Error('Symbol adjustment currently supports ordinary faces only.');
  for (const [group, value] of Object.entries(face.symbolAdjustment)) {
    if (group !== 'mana' && group !== 'set') throw Error('Unknown symbol adjustment group.');
    if (!value || typeof value !== 'object') throw Error('Invalid symbol adjustment.');
    for (const [key, number] of Object.entries(value)) {
      const translation = key === 'dx' || key === 'dy';
      if (
        (!translation && key !== 'scaleX' && key !== 'scaleY') ||
        typeof number !== 'number' ||
        !Number.isFinite(number) ||
        number < (translation ? -8 : 0.75) ||
        number > (translation ? 8 : 1.25)
      )
        throw Error('Symbol adjustment exceeds supported bounds.');
    }
  }
}
export function adjustedSymbolBounds(bounds: FaceRect, value?: SymbolTransform): FaceRect {
  const { dx = 0, dy = 0, scaleX = 1, scaleY = 1 } = value ?? {};
  if (!dx && !dy && scaleX === 1 && scaleY === 1) return bounds;
  const [x, y, w, h] = bounds;
  return [x + w + dx - w * scaleX, y + h / 2 + dy - (h * scaleY) / 2, w * scaleX, h * scaleY];
}
export function paintAdjustedSymbols(
  c: CanvasRenderingContext2D,
  bounds: FaceRect,
  value: SymbolTransform | undefined,
  paint: () => void,
): void {
  const adjusted = adjustedSymbolBounds(bounds, value);
  if (adjusted === bounds || !bounds[2] || !bounds[3]) {
    paint();
    return;
  }
  c.save();
  const sx = adjusted[2] / bounds[2],
    sy = adjusted[3] / bounds[3];
  c.transform(sx, 0, 0, sy, adjusted[0] - bounds[0] * sx, adjusted[1] - bounds[1] * sy);
  try {
    paint();
  } finally {
    c.restore();
  }
}
