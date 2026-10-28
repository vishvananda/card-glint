// Source-scan peers only. This module never imports or fits a renderer.
import assert from 'node:assert/strict';
import { luminance } from './pixels-pure.mjs';
import { median } from './metrics.mjs';
import { oldDefaultPose } from './old-frame-default-registration.mjs';

export const PEER_PROFILE_VERSION = 'old-frame-peer-gradients-v3';
// Side strips stop outside artwork, rules, names and copyright.
// The 11-pixel footprints alternate fit/validation without overlapping.
export const PEER_SAMPLE_BOUNDS = Object.freeze({
  left: [7, 45],
  right: [443, 483],
  top: [7, 32],
  bottom: [646, 674],
});
export const PEER_WINDOWS = Object.freeze({
  left: { axis: 'x', lo: 16, hi: 36, position: 24, start: 100, step: 20, count: 26 },
  right: { axis: 'x', lo: 452, hi: 474, position: 464, start: 100, step: 20, count: 26 },
  top: { axis: 'y', lo: 16, hi: 32, position: 26, start: 76, step: 14, count: 26 },
  bottom: { axis: 'y', lo: 646, hi: 665, position: 653, start: 76, step: 14, count: 26 },
});
const interpolate = (values, position) => {
  const i = Math.floor(position),
    f = position - i;
  assert(i >= 0 && i + 1 < values.length, 'Profile sample outside frozen support');
  return values[i] * (1 - f) + values[i + 1] * f;
};
export function peerProfiles(image) {
  assert.equal(image.width, 488);
  assert.equal(image.height, 680);
  const gray = luminance(image);
  return Object.entries(PEER_WINDOWS).flatMap(([side, spec]) =>
    Array.from({ length: spec.count }, (_, index) => {
      const along = spec.start + index * spec.step,
        start = spec.lo - 8;
      const values = [];
      for (let p = start - 1; p <= spec.hi + 9; p++) {
        // Clamp overscan too: shifted correlations must never sample title or copyright ink.
        const [lo, hi] = PEER_SAMPLE_BOUNDS[side];
        const normal = Math.max(lo, Math.min(hi, p));
        let sum = 0;
        for (let k = along - 5; k <= along + 5; k++)
          sum += gray[(spec.axis === 'x' ? k : normal) * 488 + (spec.axis === 'x' ? normal : k)];
        values.push(sum / 11);
      }
      return {
        side,
        axis: spec.axis,
        lo: spec.lo,
        hi: spec.hi,
        position: spec.position,
        along,
        index,
        cohort: index % 2 ? 'validation' : 'fit',
        start,
        gradient: values.slice(1, -1).map((_, i) => (values[i + 2] - values[i]) / 2),
      };
    }),
  );
}
export function peerTemplate(rows) {
  assert(rows.length >= 3, 'At least three scan peers required');
  const template = rows[0];
  for (const row of rows) {
    assert.equal(row.length, template.length);
    row.forEach((p, i) =>
      assert.deepEqual({ ...p, gradient: null }, { ...template[i], gradient: null }),
    );
  }
  return template.map((p, i) => ({
    ...p,
    gradient: p.gradient.map((_, j) => median(rows.map((r) => r[i].gradient[j]))),
  }));
}
export function fitPeerProfiles(profiles, template) {
  const points = [],
    rejected = [];
  assert.equal(profiles.length, template.length);
  for (let i = 0; i < profiles.length; i++) {
    const p = profiles[i],
      t = template[i];
    assert.deepEqual({ ...p, gradient: null }, { ...t, gradient: null });
    const score = (shift) => {
      let dot = 0,
        aa = 0,
        bb = 0;
      for (let x = t.lo; x <= t.hi; x++) {
        const a = interpolate(p.gradient, x + shift - p.start),
          b = t.gradient[x - t.start];
        dot += a * b;
        aa += a * a;
        bb += b * b;
      }
      // Absolute energy rejects identical dim edges solely because of ink or
      // scan exposure. Normalize every non-flat profile; correlation, four-side
      // support and independent residual limits still reject noise/ambiguity.
      return aa > 0 && bb > 0 ? Math.max(-1, Math.min(1, dot / Math.sqrt(aa * bb))) : -1;
    };
    const scores = Array.from({ length: 49 }, (_, j) => ({
      shift: -6 + j * 0.25,
      score: score(-6 + j * 0.25),
    }));
    scores.sort((a, b) => b.score - a.score);
    const best = scores[0];
    const info = { side: p.side, index: p.index, cohort: p.cohort, along: p.along };
    if (best.score < 0.65 || Math.abs(best.shift) >= 5.75) {
      rejected.push({ ...info, reason: 'ambiguous-peer-profile', ...best });
      continue;
    }
    // Refine only the measured strip displacement, never a card's typography.
    let refined = best;
    for (let delta = -0.2; delta <= 0.2001; delta += 0.025) {
      const shift = best.shift + delta,
        value = score(shift);
      if (value > refined.score) refined = { shift, score: value };
    }
    points.push({
      ...info,
      x: p.axis === 'x' ? p.position + refined.shift : p.along,
      y: p.axis === 'y' ? p.position + refined.shift : p.along,
      strength: refined.score,
    });
  }
  const target = {
    reliable: true,
    sides: Object.fromEntries(
      Object.entries(PEER_WINDOWS).map(([side, s]) => [
        side,
        { position: s.position, reliable: true },
      ]),
    ),
  };
  return {
    ...oldDefaultPose({ version: PEER_PROFILE_VERSION, points, rejected }, target),
    profiles: { accepted: points.length, rejected },
    method: PEER_PROFILE_VERSION,
  };
}
