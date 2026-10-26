// Comparison-only vertical registration, independent of rendered cards and text.
// Endpoint shifts are centered on canonical y=67 and y=612. Stock poses remain separate.
import assert from 'node:assert/strict';
import { scanMatrix } from './scan-transform.mjs';
import { normalizedRgbaRegion } from './normalized-rgba-region.mjs';
import { medianFrameGradient, gradientOverlap, bestGradientShift } from './frame-edge-measure.mjs';
import { median } from './metrics.mjs';
export const verticalFrameStrips = Object.freeze({
  fitTop: [95, 55, 110, 35, 'y'],
  fitBottom: [275, 592, 110, 34, 'y'],
  checkTop: [275, 55, 110, 35, 'y'],
  checkBottom: [95, 592, 110, 34, 'y'],
  certificateArtBottom: [180, 345, 120, 38, 'y'],
  certificatePaperTop: [180, 393, 120, 38, 'y'],
});
export const perimeterPaperStrips = Object.freeze({
  fitTop: [95, 18, 110, 22, 'y'],
  fitBottom: [275, 640, 110, 26, 'y'],
  checkTop: [275, 18, 110, 22, 'y'],
  checkBottom: [95, 640, 110, 26, 'y'],
  certificatePaperTop: [180, 400, 120, 22, 'y'],
  certificatePaperBottom: [180, 600, 120, 26, 'y'],
  diagnosticArtTop: [180, 55, 120, 35, 'y'],
  diagnosticArtBottom: [180, 365, 120, 24, 'y'],
});
export const perimeterPaperChecks = Object.freeze([
  'checkTop',
  'checkBottom',
  'certificatePaperTop',
  'certificatePaperBottom',
]);
const fitKeys = ['fitTop', 'fitBottom'];
const checkKeys = ['checkTop', 'checkBottom', 'certificateArtBottom', 'certificatePaperTop'];
const steps = Array.from({ length: 13 }, (_, i) => (i - 6) / 8).sort(
  (a, b) => Math.abs(a) - Math.abs(b) || a - b,
);
export function composePrintedVertical(parent, top, bottom) {
  assert(
    Number.isFinite(top) && Number.isFinite(bottom) && Math.abs(top) <= 8 && Math.abs(bottom) <= 8,
  );
  const sy = 1 + (bottom - top) / 545,
    dy = top + (340 - 67) * (sy - 1),
    m = scanMatrix(parent);
  assert(sy > 0);
  return { matrix: [m[0], m[1] * sy, m[2], m[3] * sy, m[4], m[5] * sy + dy] };
}
export function verticalFrameProfiles(
  image,
  transform,
  keys = Object.keys(verticalFrameStrips),
  strips = verticalFrameStrips,
  gradient = medianFrameGradient,
) {
  return Object.fromEntries(
    keys.map((k) => {
      const [x, y, w, h, axis] = strips[k],
        window = normalizedRgbaRegion(image, [x, y, w, h], transform);
      return [k, gradient(window, [0, 0, w, h, axis])];
    }),
  );
}
const fitScore = (templates, profiles) =>
  fitKeys.reduce((s, k) => s + gradientOverlap(templates[k], profiles[k]), 0) / 2;
export function verifyVerticalFrameProfiles(
  profiles,
  templates,
  { strips = verticalFrameStrips, verificationKeys = checkKeys } = {},
) {
  const bands = Object.fromEntries(
    Object.keys(strips).map((k) => {
      const best = bestGradientShift(templates[k], profiles[k]);
      return [
        k,
        {
          score: gradientOverlap(templates[k], profiles[k]),
          shift: best.shift,
          bestScore: best.score,
        },
      ];
    }),
  );
  return {
    bands,
    fitPassed: fitKeys.every((k) => bands[k].score >= 90),
    independentPassed: verificationKeys.every(
      (k) => bands[k].score >= 90 && Math.abs(bands[k].shift) <= 0.5,
    ),
  };
}
/** Calibrators alone choose templates and both endpoint gauges. Validation and
 * parent-rejected scans cannot modify a template, gauge or another scan's pose.
 * Verification strips are evaluated only after every parameter is frozen. */
export function fitVerticalFrameConsensus(
  rows,
  {
    passes = 3,
    rounds = 2,
    strips = verticalFrameStrips,
    fitAnchors = [67, 612],
    verificationKeys = checkKeys,
    gradient = medianFrameGradient,
  } = {},
) {
  assert(
    fitAnchors.length === 2 && fitAnchors.every(Number.isFinite) && fitAnchors[0] < fitAnchors[1],
  );
  assert(
    verificationKeys.length >= 3 && new Set(verificationKeys).size === verificationKeys.length,
  );
  assert(verificationKeys.every((k) => !fitKeys.includes(k) && Object.hasOwn(strips, k)));
  assert(fitKeys.every((k) => Object.hasOwn(strips, k)));
  assert(rows.length >= 4 && new Set(rows.map((r) => r.id)).size === rows.length);
  assert(Number.isInteger(passes) && passes >= 1 && passes <= 5);
  assert(Number.isInteger(rounds) && rounds >= 1 && rounds <= 3);
  assert(rows.every((r) => ['calibration', 'validation'].includes(r.cohort)));
  const calibrators = rows.filter((r) => r.cohort === 'calibration' && r.parentAccepted !== false);
  assert(calibrators.length >= 3);
  const ids = new Set(calibrators.map((r) => r.id)),
    params = new Map(),
    cache = new Map(),
    records = [];
  let computed = 0,
    reused = 0;
  const profiles = (r, t, b, keys = fitKeys) => {
    const id = JSON.stringify([r.id, t, b, keys]);
    if (cache.has(id)) {
      reused++;
      return cache.get(id);
    }
    const p = verticalFrameProfiles(
      r.image,
      composePrintedVertical(r.parentTransform, t, b),
      keys,
      strips,
      gradient,
    );
    cache.set(id, p);
    computed++;
    return p;
  };
  const templatesAt = (keys) => {
    const ps = calibrators.map((r) => {
      const p = params.get(r.id);
      return profiles(r, p.top, p.bottom, keys);
    });
    return Object.fromEntries(
      keys.map((k) => [k, ps[0][k].map((_, i) => median(ps.map((p) => p[k][i])))]),
    );
  };
  for (const r of rows) params.set(r.id, { top: 0, bottom: 0 });
  const initial = templatesAt(fitKeys);
  for (const r of rows) {
    const p = profiles(r, 0, 0),
      t = bestGradientShift(initial.fitTop, p.fitTop),
      b = bestGradientShift(initial.fitBottom, p.fitBottom),
      slope = (b.shift - t.shift) / (fitAnchors[1] - fitAnchors[0]),
      sy = 1 + slope,
      shiftAt = (y) => t.shift + slope * (y - fitAnchors[0]),
      quantize = (x) => Math.round(x * 8) / 8;
    params.set(r.id, {
      top: quantize(-shiftAt(67) / sy),
      bottom: quantize(-shiftAt(612) / sy),
      coarseBoundary: Math.abs(t.shift) === 4 || Math.abs(b.shift) === 4,
    });
  }
  const center = () => {
    const t = median(calibrators.map((r) => params.get(r.id).top)),
      b = median(calibrators.map((r) => params.get(r.id).bottom));
    for (const r of calibrators) {
      const p = params.get(r.id);
      p.top -= t;
      p.bottom -= b;
    }
    return { top: t, bottom: b };
  };
  const coarseGauge = center();
  const optimize = (r, templates) => {
    const initial = params.get(r.id);
    let best = { top: initial.top, bottom: initial.bottom };
    let value = fitScore(templates, profiles(r, best.top, best.bottom)),
      boundary = false;
    for (let round = 0; round < rounds; round++)
      for (const key of ['top', 'bottom']) {
        let winner = best,
          delta = 0;
        for (const step of steps) {
          const candidate = { ...best, [key]: best[key] + step };
          if (Math.abs(candidate.top) > 6 || Math.abs(candidate.bottom) > 6) continue;
          const score = fitScore(templates, profiles(r, candidate.top, candidate.bottom));
          if (score > value + 1e-10) {
            value = score;
            winner = candidate;
            delta = step;
          }
        }
        best = winner;
        if (round === rounds - 1 && Math.abs(delta) === 0.75) boundary = true;
      }
    return { ...initial, ...best, fitScore: value, boundary };
  };
  for (let pass = 0; pass < passes; pass++) {
    const template = templatesAt(fitKeys);
    for (const r of calibrators) params.set(r.id, optimize(r, template));
    const gauge = center();
    records.push({
      pass,
      gauge,
      medianTop: median(calibrators.map((r) => params.get(r.id).top)),
      medianBottom: median(calibrators.map((r) => params.get(r.id).bottom)),
    });
  }
  const templates = templatesAt(Object.keys(strips));
  const fitted = rows.map(({ image, ...row }) => {
    const r = { image, ...row };
    let p = params.get(r.id);
    if (!ids.has(r.id)) {
      p = optimize(r, templates);
      params.set(r.id, p);
    }
    const transform = composePrintedVertical(r.parentTransform, p.top, p.bottom),
      ps = profiles(r, p.top, p.bottom, Object.keys(strips)),
      verification = verifyVerticalFrameProfiles(ps, templates, { strips, verificationKeys }),
      bounded =
        Math.abs(p.top) <= 4.75 &&
        Math.abs(p.bottom) <= 4.75 &&
        Math.abs((p.bottom - p.top) / 545) <= 0.006;
    return {
      ...row,
      transform,
      profiles: ps,
      endpoints: p,
      templateMember: ids.has(r.id),
      ...verification,
      bounded,
      accepted:
        r.parentAccepted !== false &&
        bounded &&
        !p.boundary &&
        !p.coarseBoundary &&
        verification.fitPassed &&
        verification.independentPassed,
    };
  });
  assert.equal(median(fitted.filter((r) => r.templateMember).map((r) => r.endpoints.top)), 0);
  assert.equal(median(fitted.filter((r) => r.templateMember).map((r) => r.endpoints.bottom)), 0);
  return {
    rows: fitted,
    templates,
    passes: records,
    coarseGauge,
    strips,
    fitAnchors,
    verificationKeys,
    work: { computedProfiles: computed, reusedProfiles: reused },
    scope:
      'Comparison-only vertical affine correction after an independently verified parent pose. Two fit strips; four untouched checks. Stock transforms are not replaced; no renderer offsets are produced.',
  };
}
