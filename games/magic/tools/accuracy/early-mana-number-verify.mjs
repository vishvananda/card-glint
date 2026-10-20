// Actual numeral pixels, with reviewed input changes kept out of the fit.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { isDeepStrictEqual } from 'node:util';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
import { normalize, cropGray } from './pixels-pure.mjs';
import { JsTextObjective, nativeGrayCrop } from './abu-type-objective.mjs';
import { manaGlyphMask, compareManaGlyph } from './mana-glyph-metrics.mjs';
import { median } from './hsb-color.mjs';
const [
  nativeDirectory,
  auditFile,
  baselineDirectory,
  candidateDirectory,
  fitFile,
  currentFile,
  output,
] = process.argv.slice(2);
assert(
  output,
  'Usage: early-mana-number-verify.mjs NATIVE AUDIT NUMBER_BASELINE NUMBER_CANDIDATE FIT CURRENT_INPUTS OUTPUT',
);
const raw = await Promise.all(
  [
    path.join(nativeDirectory, 'capture.json'),
    path.join(nativeDirectory, 'inputs.json'),
    auditFile,
    path.join(baselineDirectory, 'capture.json'),
    path.join(candidateDirectory, 'capture.json'),
    fitFile,
    currentFile,
  ].map((f) => readFile(f)),
);
const [capture, inputs, audit, baseline, candidate, fit, current] = raw.map((b) => JSON.parse(b));
assert.equal(candidate.completed, candidate.total);
assert.equal(baseline.completed, baseline.total);
for (const c of [baseline, candidate]) {
  assert.equal(c.source.nativeCaptureHash, hash(raw[0]));
  assert.equal(c.source.nativeInputsHash, hash(raw[1]));
  assert.equal(c.source.auditHash, hash(raw[2]));
  assert.equal(
    c.source.toolHash,
    hash(await readFile(new URL('early-mana-geometry-replay.mjs', import.meta.url))),
  );
}
assert.equal(fit.sources.colorCapture, hash(raw[3]));
assert.equal(fit.sources.nativeInputs, hash(raw[1]));
assert.equal(candidate.definition.derivation.numberInkFitHash, hash(raw[5]));
const selected = fit.groups.N.selected.adjustment,
  profile = candidate.definition.candidates.find((c) => c.id === 'number-fit').profile;
assert.equal(profile.geometry.numberScale, selected.scale);
assert.equal(profile.geometry.numberDx, selected.dx);
assert.equal(profile.geometry.numberDy, selected.dy);
assert.deepEqual(current.entries.map((e) => e.id).sort(), inputs.entries.map((e) => e.id).sort());
const changedInputs = [];
for (const e of inputs.entries) {
  const c = current.entries.find((c) => c.id === e.id);
  assert.equal(e.reference.sha256, c.reference.sha256);
  assert.equal(e.art.sha256, c.art.sha256);
  const fields = Object.keys({ ...e.face, ...c.face })
    .filter((k) => !isDeepStrictEqual(e.face[k], c.face[k]))
    .sort();
  if (fields.length)
    changedInputs.push({
      id: e.id,
      name: e.name,
      fields,
      before: e.face.manaSymbols,
      after: c.face.manaSymbols,
    });
}
assert(changedInputs.every((c) => c.fields.length === 1 && c.fields[0] === 'manaSymbols'));
const rows = [],
  thresholds = [0.38, 0.48, 0.58];
for (const r of candidate.rows.filter((r) => r.symbol === 'N')) {
  const parent = baseline.rows.find((x) => x.id === r.id),
    e = inputs.entries.find((e) => e.id === r.id),
    ar = audit.rows.find((x) => x.id === r.id),
    c = capture.rows.find((x) => x.id === r.id);
  assert(e.face.manaSymbols.every((s) => /^\d+$/.test(s)));
  assert(!changedInputs.some((x) => x.id === e.id));
  const trials = [
    r.trials.find((t) => t.id === 'paper-ink'),
    r.trials.find((t) => t.id === 'number-fit'),
  ];
  assert.equal(trials[0].faceHash, parent.trials.find((t) => t.id === 'paper-ink').faceHash);
  const bytes = await Promise.all(
    [
      path.join(candidateDirectory, trials[0].file),
      path.join(candidateDirectory, trials[1].file),
      path.join(nativeDirectory, '2ed', r.id + '-scan.png'),
    ].map((f) => readFile(f)),
  );
  for (let i = 0; i < 2; i++) assert.equal(hash(bytes[i]), trials[i].faceHash);
  assert.equal(hash(bytes[2]), c.scanHash);
  const [before, after, scan] = bytes.map((b) => PNG.sync.read(b));
  const rect = r.rect,
    objective = new JsTextObjective(cropGray(normalize(scan), rect).gray, rect[2], rect[3]);
  const costScores = [before, after].map((im, i) => {
    const score = objective.score(nativeGrayCrop(im, rect))[0];
    assert(Math.abs(score - trials[i].score) < 1e-10);
    return score;
  });
  let changed = 0,
    outside = 0,
    alphaChanged = 0;
  for (let p = 0; p < 732 * 1020; p++) {
    const i = p * 4,
      x = p % 732,
      y = Math.floor(p / 732);
    if (before.data[i + 3] !== after.data[i + 3]) alphaChanged++;
    if (![0, 1, 2, 3].some((k) => before.data[i + k] !== after.data[i + k])) continue;
    changed++;
    if (!(x >= rect[0] * 1.5 && x < (rect[0] + rect[2]) * 1.5 && y >= 37.5 && y < 102)) outside++;
  }
  assert(changed > 0);
  assert.equal(outside, 0);
  assert.equal(alphaChanged, 0);
  const masks = [normalize(before), normalize(after), normalize(scan)].map((im, i) =>
    thresholds.map((thresholdFraction) =>
      manaGlyphMask(im, i === 2 ? ar.scan.circle : trials[i].circle, false, {
        normalizeBounds: false,
        thresholdFraction,
      }),
    ),
  );
  const failures = masks.flatMap((a, i) =>
    a.flatMap((m, j) =>
      m.status === 'measured' ? [] : [{ side: i, threshold: thresholds[j], status: m.status }],
    ),
  );
  const inkScores = failures.length
    ? null
    : [0, 1].map((i) =>
        median(thresholds.map((_, j) => compareManaGlyph(masks[2][j].ink, masks[i][j].ink).score)),
      );
  rows.push({
    id: r.id,
    name: r.name,
    number: e.face.manaSymbols.at(-1),
    cohort: r.cohort,
    referenceHash: r.referenceHash,
    poseHash: r.poseHash,
    faceHashes: bytes.slice(0, 2).map(hash),
    costScores,
    inkScores,
    failures,
    changed,
    outside,
    alphaChanged,
  });
}
assert.equal(rows.length, 47);
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
const groups = Object.fromEntries(
  ['all', 'calibration', 'validation', ...new Set(rows.map((r) => 'number/' + r.number))].map(
    (k) => {
      const a = rows.filter((r) => k === 'all' || r.cohort === k || k === 'number/' + r.number),
        ink = a.filter((r) => r.inkScores);
      return [
        k,
        {
          count: a.length,
          costMean100: [0, 1].map((i) => 100 * mean(a.map((r) => r.costScores[i]))),
          inkAccepted: ink.length,
          inkMean100: ink.length
            ? [0, 1].map((i) => 100 * mean(ink.map((r) => r.inkScores[i])))
            : null,
          inkImproved: ink.filter((r) => r.inkScores[1] > r.inkScores[0] + 1e-9).length,
          inkRegressed: ink.filter((r) => r.inkScores[1] < r.inkScores[0] - 1e-9).length,
          inkWorstRegression100: ink.length
            ? 100 * Math.max(0, ...ink.map((r) => r.inkScores[0] - r.inkScores[1]))
            : null,
        },
      ];
    },
  ),
);
await writeJson(output, {
  schema: 1,
  set: '2ed',
  status: 'native-shared-numeral-candidate-verified-not-adopted',
  scope:
    'All 47 numeric-only original costs. Native palette/geometry baselines match prior PNG hashes, actual cost scores are recomputed, and changed pixels must stay in the cost with unchanged alpha. Disc-relative ink scores use three thresholds; no ink-bound normalization or scan registration. Per-digit and printing residuals remain explicit. The separate X review found one incorrect provided original cost; its stale full-header trials are excluded from certification. Corrected data, X glyph identity, source ink expansion and complete-set integration remain separate.',
  sources: Object.fromEntries(
    ['nativeCapture', 'nativeInputs', 'audit', 'baseline', 'candidate', 'fit', 'currentInputs'].map(
      (k, i) => [k, hash(raw[i])],
    ),
  ),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  dependencies: await Promise.all(
    ['abu-type-objective.mjs', 'pixels-pure.mjs', 'mana-glyph-metrics.mjs'].map(async (f) => [
      f,
      hash(await readFile(new URL(f, import.meta.url))),
    ]),
  ),
  geometry: profile.geometry,
  changedInputs,
  uncertifiedXRows: candidate.rows
    .filter((r) => r.symbol !== 'N')
    .map((r) => ({
      id: r.id,
      name: r.name,
      reason: changedInputs.some((c) => c.id === r.id)
        ? 'original-cost-corrected-after-capture'
        : 'X-glyph-review-still-open',
    })),
  groups,
  rows,
});
console.log(JSON.stringify({ status: 'native-numerals-verified', changedInputs, groups }));
