import { luminance } from './pixels-pure.mjs';
import { scanFrameAnchors } from './scan-frame-anchors.mjs';
import { median, quantile } from './metrics.mjs';
import { projectScanPoint } from './scan-transform.mjs';
import { fitScanFrame } from './scan-frame-fit.mjs';
import { fitAffineScan } from './scan-affine-fit.mjs';

// These strips contain only the outer rails and lower type-bar outline. The
// lower rail is curved; matching local edge profiles retains that shape instead
// of pretending it is a straight stock edge. No title, art, rules or symbol ink.
export const SAGA_WINDOWS = Object.freeze({
  left: { axis: 'x', lo: 13, hi: 28, position: 19.5, start: 100, step: 18, count: 26 },
  right: { axis: 'x', lo: 456, hi: 476, position: 468, start: 100, step: 18, count: 26 },
  top: { axis: 'y', lo: 12, hi: 29, position: 19, start: 76, step: 14, count: 26 },
  bottom: { axis: 'y', lo: 607, hi: 631, position: 617, start: 76, step: 14, count: 26 },
});
const sample = (gray, axis, p, along) => {
  const floor = Math.floor(p),
    f = p - floor;
  let sum = 0;
  for (let k = along - 5; k <= along + 5; k++) {
    const at = (q) => gray[(axis === 'x' ? k : q) * 488 + (axis === 'x' ? q : k)];
    sum += at(floor) * (1 - f) + at(floor + 1) * f;
  }
  return sum / 11;
};
function profileRegistration(reference, template) {
  const a = luminance(reference),
    b = luminance(template),
    points = [],
    rejected = [],
    sides = {};
  for (const [side, spec] of Object.entries(SAGA_WINDOWS)) {
    const { axis, lo, hi, position, start, step, count } = spec;
    sides[side] = { position, reliable: true, count, spread: 0 };
    for (let index = 0; index < count; index++) {
      const along = start + step * index;
      const gradient = (gray, shift) =>
        Array.from({ length: hi - lo - 2 }, (_, i) => {
          const p = lo + 1 + i + shift;
          return sample(gray, axis, p + 1, along) - sample(gray, axis, p - 1, along);
        });
      const target = gradient(b, 0),
        energy = target.reduce((n, v) => n + v * v, 0);
      const scores = [];
      for (let shift = -6; shift <= 6; shift += 0.25) {
        const values = gradient(a, shift),
          e = values.reduce((n, v) => n + v * v, 0);
        const score =
          energy > 100 && e > 100
            ? values.reduce((n, v, i) => n + v * target[i], 0) / Math.sqrt(e * energy)
            : 0;
        scores.push({ shift, score });
      }
      scores.sort((a, b) => b.score - a.score);
      const best = scores[0],
        sampleInfo = { side, index, cohort: index % 2 ? 'validation' : 'fit', along };
      if (best.score < 0.65 || Math.abs(best.shift) >= 5.75) {
        rejected.push({ ...sampleInfo, reason: 'ambiguous-profile', ...best });
        continue;
      }
      points.push({
        ...sampleInfo,
        x: axis === 'x' ? position + best.shift : along,
        y: axis === 'y' ? position + best.shift : along,
        strength: best.score,
      });
    }
  }
  const target = { reliable: true, sides },
    source = { version: 'saga-frame-profiles-v1', points, rejected };
  return {
    method: source.version,
    target,
    profiles: { accepted: points.length, rejected },
    ...fitAffineScan(source, target, fitScanFrame(source, target)),
  };
}

/** Independent straight-edge fit when the material exposes all four rails. */
function edgeRegistration(reference, template) {
  const windows = {
    left: { axis: 'x', lo: 12, hi: 31, start: 100, step: 18, count: 26 },
    right: { axis: 'x', lo: 454, hi: 477, start: 100, step: 18, count: 26 },
    top: { axis: 'y', lo: 12, hi: 30, start: 76, step: 14, count: 26 },
    bottom: { axis: 'y', lo: 608, hi: 620, start: 76, step: 14, count: 26 },
  };
  const anchors = scanFrameAnchors(template, 'black', windows);
  const sides = Object.fromEntries(
    ['left', 'right', 'top', 'bottom'].map((side) => {
      const values = anchors.points
        .filter((p) => p.side === side)
        .map((p) => (['left', 'right'].includes(side) ? p.x : p.y));
      const position = median(values),
        spread = quantile(
          values.map((v) => Math.abs(v - position)),
          0.9,
        );
      return [
        side,
        { position, spread, count: values.length, reliable: values.length >= 16 && spread < 0.8 },
      ];
    }),
  );
  const target = { reliable: Object.values(sides).every((s) => s.reliable), sides };
  const source = scanFrameAnchors(reference, 'black', windows);
  return {
    method: 'saga-straight-edges-v1',
    target,
    ...fitAffineScan(source, target, fitScanFrame(source, target)),
  };
}
export function sagaRegistration(reference, template) {
  const edges = edgeRegistration(reference, template),
    profiles = profileRegistration(reference, template);
  const methods = { edges, profiles };
  if (edges.accepted && profiles.accepted) {
    const disagreement = Math.max(
      ...[
        [20, 20],
        [468, 20],
        [20, 617],
        [468, 617],
      ].map(([x, y]) => {
        const a = projectScanPoint(x, y, edges.transform),
          b = projectScanPoint(x, y, profiles.transform);
        return Math.hypot(a[0] - b[0], a[1] - b[1]);
      }),
    );
    if (disagreement > 1.25)
      return {
        accepted: false,
        reason: 'registration-methods-disagree',
        transform: null,
        disagreement,
        methods,
      };
    return { ...profiles, disagreement, methods };
  }
  return { ...(profiles.accepted ? profiles : edges.accepted ? edges : profiles), methods };
}
