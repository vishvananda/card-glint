// Scan-only RGB gradient observations; the geometric fitter and gates are unchanged.
import assert from 'node:assert/strict';
import { PEER_WINDOWS, PEER_SAMPLE_BOUNDS } from './old-frame-peer-profiles.mjs';
import { median } from './metrics.mjs';
import { oldDefaultPose } from './old-frame-default-registration.mjs';
export const CHROMATIC_PROFILE_VERSION = 'old-frame-rgb-peer-gradients-v5';
const smoothProfile = (values) =>
  values.map(
    (_, i) =>
      [1, 4, 6, 4, 1].reduce(
        (sum, weight, k) =>
          sum + weight * values[Math.max(0, Math.min(values.length - 1, i + k - 2))],
        0,
      ) / 16,
  );
// One additional upper-side sample is outside the name/art apertures. It adds
// real measured span on dark sides; no support or residual limit is relaxed.
export const CHROMATIC_WINDOWS = Object.freeze(
  Object.fromEntries(
    Object.entries(PEER_WINDOWS).map(([side, spec]) => [
      side,
      spec.axis === 'x' ? { ...spec, start: 80, count: 27 } : spec,
    ]),
  ),
);
export function chromaticProfiles(image) {
  assert.equal(image.width, 488);
  assert.equal(image.height, 680);
  return Object.entries(CHROMATIC_WINDOWS).flatMap(([side, spec]) =>
    Array.from({ length: spec.count }, (_, index) => {
      const along = spec.start + index * spec.step,
        start = spec.lo - 8;
      const channels = Array.from({ length: 3 }, () => []);
      for (let p = start - 1; p <= spec.hi + 9; p++) {
        const [lo, hi] = PEER_SAMPLE_BOUNDS[side],
          normal = Math.max(lo, Math.min(hi, p));
        const values = [0, 0, 0];
        const radius = spec.axis === 'x' ? 9 : 6;
        for (let k = along - radius; k <= along + radius; k++) {
          const offset =
            ((spec.axis === 'x' ? k : normal) * 488 + (spec.axis === 'x' ? normal : k)) * 4;
          for (let c = 0; c < 3; c++) values[c] += image.data[offset + c] / (2 * radius + 1);
        }
        values.forEach((v, c) => channels[c].push(v));
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
        gradient: channels
          .map(smoothProfile)
          .map(smoothProfile)
          .map((values) => values.slice(1, -1).map((_, i) => (values[i + 2] - values[i]) / 2)),
      };
    }),
  );
}
export function chromaticTemplate(rows) {
  assert(rows.length >= 3);
  const template = rows[0];
  for (const row of rows) {
    assert.equal(row.length, template.length);
    row.forEach((p, i) =>
      assert.deepEqual({ ...p, gradient: null }, { ...template[i], gradient: null }),
    );
  }
  return template.map((p, i) => ({
    ...p,
    gradient: p.gradient.map((channel, c) =>
      channel.map((_, j) => median(rows.map((r) => r[i].gradient[c][j]))),
    ),
  }));
}
const interpolate = (values, x) => {
  const i = Math.floor(x),
    f = x - i;
  assert(i >= 0 && i + 1 < values.length, 'Chromatic sample outside frozen support');
  return values[i] * (1 - f) + values[i + 1] * f;
};
export function fitChromaticProfiles(profiles, template) {
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
      for (let x = t.lo; x <= t.hi; x++)
        for (let c = 0; c < 3; c++) {
          const a = interpolate(p.gradient[c], x + shift - p.start),
            b = t.gradient[c][x - t.start];
          dot += a * b;
          aa += a * a;
          bb += b * b;
        }
      return aa > 0 && bb > 0 ? Math.max(-1, Math.min(1, dot / Math.sqrt(aa * bb))) : -1;
    };
    const scores = Array.from({ length: 49 }, (_, j) => ({
      shift: -6 + j * 0.25,
      score: score(-6 + j * 0.25),
    })).sort((a, b) => b.score - a.score);
    const best = scores[0],
      info = { side: p.side, index: p.index, cohort: p.cohort, along: p.along };
    if (best.score < 0.65 || Math.abs(best.shift) >= 5.75) {
      rejected.push({ ...info, reason: 'ambiguous-rgb-peer-profile', ...best });
      continue;
    }
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
      Object.entries(CHROMATIC_WINDOWS).map(([side, s]) => [
        side,
        { position: s.position, reliable: true },
      ]),
    ),
  };
  return {
    ...oldDefaultPose({ version: CHROMATIC_PROFILE_VERSION, points, rejected }, target),
    observations: points,
    profiles: { accepted: points.length, rejected },
    method: CHROMATIC_PROFILE_VERSION,
  };
}
