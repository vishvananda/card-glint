import { luminance } from './pixels-pure.mjs';
import { fitScanFrame } from './scan-frame-fit.mjs';
import { fitAffineScan } from './scan-affine-fit.mjs';

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
export function frameProfileRegistration(reference, template, windows, version) {
  const a = luminance(reference),
    b = luminance(template),
    points = [],
    rejected = [],
    sides = {};
  for (const [side, spec] of Object.entries(windows)) {
    const { axis, lo, hi, position, start, step, count } = spec;
    sides[side] = { position, reliable: true, count, spread: 0 };
    for (let index = 0; index < count; index++) {
      const along = start + step * index;
      // A profile averages an 11-pixel strip. Exclude the whole footprint,
      // including authenticity stamps or other non-frame printing.
      if (spec.exclude?.some(([from, to]) => along + 5 >= from && along - 5 <= to)) {
        sides[side].count--;
        continue;
      }
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
    source = { version, points, rejected };
  return {
    method: source.version,
    target,
    profiles: { accepted: points.length, rejected },
    ...fitAffineScan(source, target, fitScanFrame(source, target)),
  };
}
