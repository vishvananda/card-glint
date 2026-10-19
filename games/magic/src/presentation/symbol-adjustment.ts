import { type CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import type { FaceRect, RenderedCardInput } from './face-layout.js';

export const SYMBOL_ADJUSTMENT_VERSION = 'symbols-v3';
export type ManaColor = 'W' | 'U' | 'B' | 'R' | 'G';
export interface ManaGlyphTransform {
  scale?: number;
  dx?: number;
  dy?: number;
}
/** Opt-in review deltas, in canonical 488 × 680 pixels. Right/center anchored. */
export interface SymbolTransform {
  dx?: number;
  dy?: number;
  scaleX?: number;
  scaleY?: number;
}
export interface ManaSymbolTransform extends SymbolTransform {
  /** Extra gap between discs, before whole-cost scaling; rightmost disc stays fixed. */
  spacing?: number;
  /** Numeral glyph only, preserving its circle and shadow. */
  numberScale?: number;
  numberDx?: number;
  numberDy?: number;
  /** Cost glyphs of this color only; their circles and inline symbols stay fixed. */
  glyphs?: Partial<Record<ManaColor, ManaGlyphTransform>>;
}
export interface SymbolAdjustment {
  mana?: ManaSymbolTransform;
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
      if (group === 'mana' && key === 'glyphs') {
        validateManaGlyphs(number);
        continue;
      }
      const translation = key === 'dx' || key === 'dy';
      const numeralOffset = group === 'mana' && (key === 'numberDx' || key === 'numberDy');
      const spacing = group === 'mana' && key === 'spacing';
      const scale =
        key === 'scaleX' || key === 'scaleY' || (group === 'mana' && key === 'numberScale');
      const limit = spacing ? 4 : numeralOffset ? 4 : 8;
      if (
        (!translation && !numeralOffset && !spacing && !scale) ||
        typeof number !== 'number' ||
        !Number.isFinite(number) ||
        number < (scale ? 0.75 : -limit) ||
        number > (scale ? 1.25 : limit)
      )
        throw Error('Symbol adjustment exceeds supported bounds.');
    }
  }
}
function validateManaGlyphs(value: unknown): void {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw Error('Invalid mana glyph controls.');
  for (const [color, fields] of Object.entries(value)) {
    if (!/^[WUBRG]$/.test(color) || !fields || typeof fields !== 'object' || Array.isArray(fields))
      throw Error('Invalid mana glyph color.');
    for (const [key, n] of Object.entries(fields)) {
      const scale = key === 'scale';
      if (
        (!scale && key !== 'dx' && key !== 'dy') ||
        typeof n !== 'number' ||
        !Number.isFinite(n) ||
        n < (scale ? 0.75 : -4) ||
        n > (scale ? 1.25 : 4)
      )
        throw Error('Mana glyph control exceeds supported bounds.');
    }
  }
}
export function colorGlyphTransform(adjustment: ManaSymbolTransform | undefined, symbol: string) {
  return /^[WUBRG]$/.test(symbol) ? adjustment?.glyphs?.[symbol as ManaColor] : undefined;
}
export function adjustedSymbolBounds(bounds: FaceRect, value?: SymbolTransform): FaceRect {
  const { dx = 0, dy = 0, scaleX = 1, scaleY = 1 } = value ?? {};
  if (!dx && !dy && scaleX === 1 && scaleY === 1) return bounds;
  const [x, y, w, h] = bounds;
  return [x + w + dx - w * scaleX, y + h / 2 + dy - (h * scaleY) / 2, w * scaleX, h * scaleY];
}
export function paintAdjustedSymbols(
  c: CanvasContext,
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

/** Spacing is independent of disc size, with the final disc anchored at the right. */
export function spacedManaBounds(
  bounds: FaceRect,
  count: number,
  value?: ManaSymbolTransform,
): FaceRect {
  const extra = Math.max(0, count - 1) * (value?.spacing ?? 0);
  return extra ? [bounds[0] - extra, bounds[1], bounds[2] + extra, bounds[3]] : bounds;
}
