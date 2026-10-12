import { blur } from './edges.mjs';
import { luminance, WIDTH, HEIGHT } from './pixels.mjs';
import { median } from './metrics.mjs';

export const BOUNDARY_VERSION = 'white-frame-boundary-v1';

/** Outer printed rectangle only. These are not art bevel or text-box landmarks. */
export function whiteFrameLandmarks() {
  return [
    ...[100, 244, 388].flatMap((x) => [
      { side: 'top', x, y: 28, axis: 'y', inward: 1 },
      { side: 'bottom', x, y: 652, axis: 'y', inward: -1 },
    ]),
    ...[150, 310, 530].flatMap((y) => [
      { side: 'left', x: 24, y, axis: 'x', inward: 1 },
      { side: 'right', x: 464, y, axis: 'x', inward: -1 },
    ]),
  ];
}

/**
 * First strong white-paper-to-frame transition, in a fixed search strip.
 * Averaging along the boundary suppresses print grain. Signed contrast and
 * outside-first peak selection avoid selecting a darker inner bevel or glyph.
 * Measurements diagnose each image; they never produce per-image transforms.
 */
export function measureWhiteFrame(image) {
  if (image.width !== WIDTH || image.height !== HEIGHT)
    throw Error('Frame boundaries require the canonical comparison grid');
  const gray = blur(luminance(image), WIDTH, HEIGHT);
  return whiteFrameLandmarks().map((point) => {
    const axisX = point.axis === 'x';
    const stride = (axisX ? 1 : WIDTH) * point.inward;
    const scores = [];
    for (let d = -10; d <= 10; d++) {
      const x = point.x + (axisX ? d * point.inward : 0);
      const y = point.y + (axisX ? 0 : d * point.inward);
      let gradient = 0;
      for (let along = -30; along <= 30; along++) {
        const i = (y + (axisX ? along : 0)) * WIDTH + x + (axisX ? 0 : along);
        gradient += gray[i - 2 * stride] - gray[i + 2 * stride];
      }
      scores.push(gradient / 61);
    }
    const threshold = Math.max(10, Math.max(...scores) * 0.45);
    const peak = scores.findIndex(
      (v, i) =>
        i > 0 && i + 1 < scores.length && v >= threshold && v > scores[i - 1] && v >= scores[i + 1],
    );
    if (peak < 0) return { ...point, detected: null, strength: 0, status: 'no-boundary' };
    const a = scores[peak - 1],
      b = scores[peak],
      c = scores[peak + 1];
    const fraction = (a - c) / (2 * (a - 2 * b + c));
    return {
      ...point,
      detected: point[point.axis] + (peak - 10 + fraction) * point.inward,
      strength: b,
      status: 'measured',
    };
  });
}

export function boundaryDifference(reference, rendered) {
  const sides = Object.fromEntries(
    ['left', 'right', 'top', 'bottom'].map((side) => {
      const pairs = reference.flatMap((p, i) =>
        p.side === side && p.detected !== null && rendered[i].detected !== null
          ? [
              {
                source: p.detected,
                target: rendered[i].detected,
                delta: rendered[i].detected - p.detected,
              },
            ]
          : [],
      );
      const delta = pairs.length ? median(pairs.map((p) => p.delta)) : null;
      return [
        side,
        {
          count: pairs.length,
          reference: pairs.length ? median(pairs.map((p) => p.source)) : null,
          rendered: pairs.length ? median(pairs.map((p) => p.target)) : null,
          delta,
          spread: pairs.length ? Math.max(...pairs.map((p) => Math.abs(p.delta - delta))) : null,
        },
      ];
    }),
  );
  const complete = Object.values(sides).every((s) => s.count === 3);
  return {
    sides,
    complete,
    centerDelta: complete
      ? [(sides.left.delta + sides.right.delta) / 2, (sides.top.delta + sides.bottom.delta) / 2]
      : null,
    sizeDelta: complete
      ? [sides.right.delta - sides.left.delta, sides.bottom.delta - sides.top.delta]
      : null,
    medianResidualPx: complete ? median(Object.values(sides).map((s) => Math.abs(s.delta))) : null,
    coherent: complete && Object.values(sides).every((s) => s.spread < 1.5),
  };
}
