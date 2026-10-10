import type { Instance } from './types.js';

/** Exactly representable seed shared by GPU animation and Rust shape picking. */
export const surfaceSeed = (id: number) => ((Math.imul(id + 1, 1597334677) >>> 0) % 65536) / 65536;

export function validateDeformation(value: Instance['deformation']) {
  if (
    value &&
    (value.kind !== 'heat' ||
      !Number.isFinite(value.amount) ||
      value.amount < 0 ||
      value.amount > 0.02)
  )
    throw RangeError('Heat deformation amount must be between 0 and 0.02');
}

/** Export keeps its requested dimensions/aspect and fits the entire envelope. */
export function exportScale(value: Instance['deformation'], width: number) {
  // Two pixels of transparent guard also contain the multisample edge fringe.
  return value?.amount ? width / (width + 4) / (1 + 2 * value.amount) : 1;
}
