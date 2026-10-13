import { luminance, WIDTH, HEIGHT } from './pixels-pure.mjs';

export const SCAN_ANCHOR_VERSION = 'outer-frame-strips-v2';
export const SCAN_ANCHOR_WINDOWS = Object.freeze({
  left: { axis: 'x', lo: 12, hi: 39, start: 100, step: 20, count: 26 },
  right: { axis: 'x', lo: 449, hi: 476, start: 100, step: 20, count: 26 },
  top: { axis: 'y', lo: 16, hi: 43, start: 76, step: 14, count: 26 },
  bottom: { axis: 'y', lo: 638, hi: 666, start: 76, step: 14, count: 26 },
});

/** Frame-only strips. Disjoint 11-pixel-wide fit/validation samples exclude
 * titles, symbols, rules and artwork. Keep missing/ambiguous samples explicit. */
export function scanFrameAnchors(image, border) {
  if (image.width !== WIDTH || image.height !== HEIGHT) throw Error('Expected canonical image');
  if (!['white', 'black'].includes(border)) throw Error('Unsupported stock color');
  const gray = luminance(image),
    points = [],
    rejected = [];
  for (const [side, spec] of Object.entries(SCAN_ANCHOR_WINDOWS)) {
    const { axis, lo, hi, start, step, count } = spec;
    const sign = (side === 'left' || side === 'top' ? 1 : -1) * (border === 'white' ? -1 : 1);
    for (let index = 0; index < count; index++) {
      const along = start + step * index,
        values = [];
      for (let p = lo - 3; p <= hi + 3; p++) {
        let sum = 0;
        for (let k = along - 5; k <= along + 5; k++)
          sum += gray[(axis === 'x' ? k : p) * WIDTH + (axis === 'x' ? p : k)];
        values.push(sum / 11);
      }
      const smooth = values.map(
        (v, i) =>
          (values[Math.max(0, i - 1)] + 2 * v + values[Math.min(values.length - 1, i + 1)]) / 4,
      );
      const gradients = [];
      for (let i = 3; i < smooth.length - 3; i++)
        gradients.push(sign * (smooth[i + 2] - smooth[i - 2]));
      const threshold = Math.max(12, Math.max(...gradients) * 0.5);
      let peaks = gradients.flatMap((v, i) =>
        i > 0 &&
        i < gradients.length - 1 &&
        v >= threshold &&
        v > gradients[i - 1] &&
        v >= gradients[i + 1]
          ? [{ i, v }]
          : [],
      );
      if (side === 'right' || side === 'bottom') peaks.reverse();
      const peak = peaks[0],
        sample = { side, index, cohort: index % 2 ? 'validation' : 'fit', along };
      if (!peak) {
        rejected.push({ ...sample, reason: 'weak-edge' });
        continue;
      }
      const { i, v } = peak,
        offset =
          (gradients[i - 1] - gradients[i + 1]) /
          (2 * (gradients[i - 1] - 2 * v + gradients[i + 1])),
        position = lo + i + offset;
      if (position < lo + 1 || position > hi - 1) {
        rejected.push({ ...sample, reason: 'search-boundary' });
        continue;
      }
      points.push({
        ...sample,
        x: axis === 'x' ? position : along,
        y: axis === 'x' ? along : position,
        strength: v,
      });
    }
  }
  return { version: SCAN_ANCHOR_VERSION, points, rejected };
}
