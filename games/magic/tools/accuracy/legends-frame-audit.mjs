import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fixtureRoot, outputRoot, objectFile, readJson, writeJson, hash } from './common.mjs';
import { readPng, normalize } from './pixels.mjs';
import { median } from './metrics.mjs';

// Broad averages suppress print grain. Each strip keeps its full signed profile
// and competing peaks: a strong art edge is not automatically a frame landmark.
// These windows diagnose this frozen Legends sample, not other sets or layouts.
const strips = [
  { id: 'outerTop', axis: 'y', range: [10, 38], along: [120, 360], sign: 1, outside: 'low' },
  { id: 'outerBottom', axis: 'y', range: [646, 670], along: [120, 360], sign: -1, outside: 'high' },
  { id: 'outerLeft', axis: 'x', range: [10, 38], along: [100, 600], sign: 1, outside: 'low' },
  { id: 'outerRight', axis: 'x', range: [450, 478], along: [100, 600], sign: -1, outside: 'high' },
  { id: 'artTop', axis: 'y', range: [48, 78], along: [100, 380], sign: -1, eligible: [53, 64] },
  {
    id: 'artBottom',
    axis: 'y',
    range: [358, 390],
    along: [100, 380],
    sign: -1,
    eligible: [370, 382],
  },
  {
    id: 'artLeftBevel',
    axis: 'x',
    range: [38, 68],
    along: [100, 350],
    sign: 1,
    eligible: [43, 55],
  },
  {
    id: 'artRightBevel',
    axis: 'x',
    range: [419, 450],
    along: [100, 350],
    sign: 1,
    eligible: [437, 448],
  },
  {
    id: 'rulesPaperTop',
    axis: 'y',
    range: [396, 422],
    along: [130, 360],
    sign: 1,
    eligible: [402, 415],
  },
];
function measure(image, strip) {
  const [lo, hi] = strip.range,
    [a, b] = strip.along,
    values = [];
  for (let p = lo - 2; p <= hi + 2; p++) {
    let sum = 0;
    for (let q = a; q <= b; q++) {
      const i = ((strip.axis === 'x' ? q : p) * 488 + (strip.axis === 'x' ? p : q)) * 4;
      sum += 0.2126 * image.data[i] + 0.7152 * image.data[i + 1] + 0.0722 * image.data[i + 2];
    }
    values.push(sum / (b - a + 1));
  }
  const gradient = Array.from(
      { length: hi - lo + 1 },
      (_, i) => (values[i + 4] + values[i + 3] - values[i + 1] - values[i]) / 4,
    ),
    peaks = [];
  for (let i = 1; i < gradient.length - 1; i++) {
    const prev = gradient[i - 1] * strip.sign,
      v = gradient[i] * strip.sign,
      next = gradient[i + 1] * strip.sign;
    if (v > prev && v >= next && v > 0) {
      const fraction = (prev - next) / (2 * (prev - 2 * v + next));
      peaks.push({ position: lo + i + fraction, strength: v });
    }
  }
  const eligible = peaks.filter(
      (p) =>
        !strip.eligible || (p.position >= strip.eligible[0] && p.position <= strip.eligible[1]),
    ),
    maximum = Math.max(0, ...eligible.map((p) => p.strength)),
    threshold = Math.max(8, maximum * 0.45),
    candidates = eligible
      .filter((p) => p.strength >= threshold)
      .sort((a, b) =>
        strip.outside === 'low'
          ? a.position - b.position
          : strip.outside === 'high'
            ? b.position - a.position
            : b.strength - a.strength,
      ),
    chosen = candidates[0] ?? null;
  return {
    id: strip.id,
    position: chosen?.position ?? null,
    strength: chosen?.strength ?? 0,
    status: chosen ? 'measured' : 'weak-or-missing',
    competing: candidates.slice(1),
    peaks,
    profile: gradient,
  };
}
function dimensions(points) {
  const p = Object.fromEntries(points.map((p) => [p.id, p.position]));
  const span = (a, b) => (p[a] === null || p[b] === null ? null : p[b] - p[a]);
  const outerWidth = span('outerLeft', 'outerRight'),
    outerHeight = span('outerTop', 'outerBottom'),
    artWidth = span('artLeftBevel', 'artRightBevel'),
    artHeight = span('artTop', 'artBottom'),
    typeBand = span('artBottom', 'rulesPaperTop');
  return {
    outerWidth,
    outerHeight,
    artWidth,
    artHeight,
    typeBand,
    artWidthFraction: artWidth === null || outerWidth === null ? null : artWidth / outerWidth,
    artHeightFraction: artHeight === null || outerHeight === null ? null : artHeight / outerHeight,
    typeBandFraction: typeBand === null || outerHeight === null ? null : typeBand / outerHeight,
  };
}
const capture = await readJson(`${outputRoot}/old-symbol-material/review/capture.json`),
  registration = await readJson(`${fixtureRoot}/old-symbol-material-registration.json`),
  rows = [];
for (const c of capture.rows.filter((r) => r.set === 'leg' && r.cohort !== 'control')) {
  const refFile = objectFile({ sha256: c.referenceHash }),
    renderFile = `${outputRoot}/old-symbol-material/review/${c.images.inspect.file}`;
  assert.equal(hash(await readFile(refFile)), c.referenceHash);
  assert.equal(hash(await readFile(renderFile)), c.images.inspect.sha256);
  const source = await readPng(refFile),
    render = normalize(await readPng(renderFile)),
    stages = {};
  for (const [name, image] of [
    ['raw', normalize(source)],
    ['sharedFit', normalize(source, registration.groups.leg.transform)],
    ['render', render],
  ]) {
    const points = strips.map((s) => measure(image, s));
    stages[name] = { points, dimensions: dimensions(points) };
  }
  const ref = stages.raw.dimensions,
    current = stages.render.dimensions;
  // Fractions remove uniform scale and translation without fitting any scan.
  // Convert the residual to renderer pixels solely for readability.
  const residual = (key, span) =>
    ref[key] === null || current[key] === null || current[span] === null
      ? null
      : (current[key] - ref[key]) * current[span];
  rows.push({
    id: c.id,
    name: c.name,
    cohort: c.cohort,
    referenceHash: c.referenceHash,
    renderedHash: c.images.inspect.sha256,
    stages,
    proportionResidualPx: {
      artWidth: residual('artWidthFraction', 'outerWidth'),
      artHeight: residual('artHeightFraction', 'outerHeight'),
      typeBand: residual('typeBandFraction', 'outerHeight'),
    },
    review: [
      'different-frame-asset-era',
      'symbol-height-not-isolated',
      ...(stages.raw.points.some((p) => !p.position) ||
      stages.render.points.some((p) => !p.position)
        ? ['weak-frame-boundaries']
        : []),
    ],
  });
}
const summary = {};
for (const cohort of ['calibration', 'held-out']) {
  const group = rows.filter((r) => r.cohort === cohort),
    valid = (v) => v.filter((x) => x !== null);
  summary[cohort] = {
    cards: group.length,
    stages: Object.fromEntries(
      ['raw', 'sharedFit', 'render'].map((stage) => [
        stage,
        Object.fromEntries(
          Object.keys(group[0].stages[stage].dimensions).map((key) => [
            key,
            median(valid(group.map((r) => r.stages[stage].dimensions[key]))),
          ]),
        ),
      ]),
    ),
    proportionResidualPx: Object.fromEntries(
      ['artWidth', 'artHeight', 'typeBand'].map((key) => [
        key,
        median(valid(group.map((r) => r.proportionResidualPx[key]))),
      ]),
    ),
    weak: group.filter((r) => r.review.includes('weak-frame-boundaries')).map((r) => r.name),
  };
}
const result = {
  schemaVersion: 1,
  scope:
    'Diagnostic of eight previously reviewed single-color/artifact Legends cards. Fixed signed-gradient profiles on broad frame strips, retaining all peaks and weak landmarks. Outer-span fractions distinguish internal geometry from translation/uniform scale without fitting any individual scan or changing registration. Fractions use a colored-frame boundary, not the physical card perimeter; they cannot certify absolute print scale. Gradient locations remain sensitive to differing bevel styles. The shared legacy transform was fitted using internal art/rules borders and is not an independent guarantee of scan alignment. No symbol placement or frame geometry is adopted by this audit.',
  rendererHash: capture.rendererHash,
  captureHash: hash(JSON.stringify(capture)),
  registrationHash: hash(JSON.stringify(registration)),
  methodHash: hash(await readFile(new URL(import.meta.url))),
  legacyFitResidualPx: registration.groups.leg.residualPx,
  strips,
  summary,
  rows,
};
await writeJson(`${fixtureRoot}/legends-frame-diagnostic.json`, result);
console.log(JSON.stringify(summary, null, 2));
