import type { CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';

/** Shared, frame-aligned measurements in the 488 × 680 painter space.
 * Keep the title and lower endpoints fixed; move the middle group together. */
export const WALKER_GEOMETRY = {
  middleLift: 4,
  rightInset: 2,
  titleWidth: 1.06,
  typeWidth: 1.03,
} as const;

export function walkerY(y: number, large: boolean): number {
  const a = large ? 310 : 356,
    b = large ? 384 : 430;
  if (y <= 70 || y >= 620) return y;
  if (y < a) return y - (WALKER_GEOMETRY.middleLift * (y - 70)) / (a - 70);
  if (y <= b) return y - WALKER_GEOMETRY.middleLift;
  return y - (WALKER_GEOMETRY.middleLift * (620 - y)) / (620 - b);
}

/** Static face preparation only. Text is laid out separately, never stretched. */
export function paintWalkerGeometry(context: CanvasContext, large: boolean, draw: () => void) {
  const points = [0, 70, large ? 310 : 356, large ? 384 : 430, 620, 680];
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]!,
      b = points[i + 1]!,
      u = walkerY(a, large),
      v = walkerY(b, large);
    context.save();
    try {
      context.beginPath();
      context.rect(0, u, 488, v - u);
      context.clip();
      context.translate(0, u);
      context.scale(1, (v - u) / (b - a));
      context.translate(0, -a);
      draw();
    } finally {
      context.restore();
    }
  }
}

/** Measurements belong to the symbol source, independent of frame color and
 * height. Preserve the lower-right anchor; do not move a whole type line to fit it.
 * Unmeasured symbols retain their source dimensions. */
const SYMBOL_SIZE: Readonly<Record<string, readonly [number, number]>> = {
  m15: [0.95, 1],
  m19: [1.1, 1.085],
  m20: [1.1, 1.085],
  m21: [1.1, 1.085],
  war: [0.96, 1.05],
  c14: [0.94, 0.98],
  dom: [1.12, 0.98],
  soi: [1.055, 0.95],
  dft: [0.92, 0.975],
};
export function walkerSymbolSize(set: string | null | undefined): readonly [number, number] {
  const code = set?.toLowerCase() ?? '';
  return Object.hasOwn(SYMBOL_SIZE, code) ? SYMBOL_SIZE[code]! : [1, 1];
}
