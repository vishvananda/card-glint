// Recompute ink and whole-cost indices from hash-checked native PNGs, without Chromium.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
import { normalize, cropGray } from './pixels-pure.mjs';
import { JsTextObjective, nativeGrayCrop } from './abu-type-objective.mjs';
import { manaGlyphMask, compareManaGlyph } from './mana-glyph-metrics.mjs';
import { median } from './hsb-color.mjs';
const [native, auditFile, baselineDirectory, directory, output] = process.argv.slice(2);
assert(output, 'Usage: early-mana-ink-verify.mjs NATIVE AUDIT GLYPH_NATIVE CANDIDATE OUT');
const files = [
  path.join(native, 'capture.json'),
  path.join(native, 'inputs.json'),
  auditFile,
  path.join(baselineDirectory, 'capture.json'),
  path.join(directory, 'capture.json'),
];
const raw = await Promise.all(files.map((f) => readFile(f)));
const [nativeCapture, inputs, audit, baseline, capture] = raw.map((b) => JSON.parse(b));
assert.equal(capture.completed, capture.total);
for (const [key, i] of [
  ['nativeCaptureHash', 0],
  ['nativeInputsHash', 1],
  ['auditHash', 2],
  ['baselineHash', 3],
])
  assert.equal(capture.source[key], hash(raw[i]));
for (const [key, file] of [
  ['toolHash', 'early-mana-ink-study.mjs'],
  ['pluginHash', 'early-mana-ink-plugin.mjs'],
  ['basePluginHash', 'early-mana-trial-plugin.mjs'],
])
  assert.equal(capture.source[key], hash(await readFile(new URL(file, import.meta.url))));
const thresholds = [0.38, 0.48, 0.58],
  rows = [];
for (const r of capture.rows) {
  const e = inputs.entries.find((e) => e.id === r.id),
    ar = audit.rows.find((a) => a.id === r.id),
    nr = nativeCapture.rows.find((a) => a.id === r.id);
  assert.equal(r.poseHash, hash(JSON.stringify(e.pose.transform)));
  const scanBytes = await readFile(path.join(native, '2ed', r.id + '-scan.png'));
  assert.equal(hash(scanBytes), r.scanHash);
  assert.equal(r.scanHash, nr.scanHash);
  const scan = normalize(PNG.sync.read(scanBytes));
  const objective = new JsTextObjective(cropGray(scan, r.rect).gray, r.rect[2], r.rect[3]);
  const refMasks = thresholds.map((thresholdFraction) =>
    manaGlyphMask(scan, ar.scan.circle, false, { normalizeBounds: false, thresholdFraction }),
  );
  assert(refMasks.every((m) => m.status === 'measured'));
  const control = baseline.rows.find((b) => b.id === r.id).trials.find((t) => t.id === 'glyph-fit');
  let before;
  const trials = [];
  for (const t of r.trials) {
    const bytes = await readFile(path.join(directory, t.file));
    assert.equal(hash(bytes), t.faceHash);
    const image = PNG.sync.read(bytes);
    if (!t.amount) {
      assert.equal(hash(bytes), control.faceHash);
      before = image;
    }
    let changed = 0,
      outside = 0,
      alphaChanged = 0;
    const [l, top, w, h] = r.rect;
    for (let p = 0; p < 732 * 1020; p++) {
      const i = p * 4,
        x = p % 732,
        y = Math.floor(p / 732);
      if (before.data[i + 3] !== image.data[i + 3]) alphaChanged++;
      if (![0, 1, 2, 3].some((k) => before.data[i + k] !== image.data[i + k])) continue;
      changed++;
      if (
        !(
          (x >= l * 1.5 && x < (l + w) * 1.5 && y >= top * 1.5 && y < (top + h) * 1.5) ||
          (x >= 53 * 1.5 && x < 445 * 1.5 && y >= 404 * 1.5 && y < 603 * 1.5)
        )
      )
        outside++;
    }
    assert.deepEqual([changed, outside, alphaChanged], [t.changed, 0, 0]);
    const masks = thresholds.map((thresholdFraction) =>
      manaGlyphMask(normalize(image), t.circle, false, {
        normalizeBounds: false,
        thresholdFraction,
      }),
    );
    assert(masks.every((m) => m.status === 'measured'));
    trials.push({
      amount: t.amount,
      faceHash: t.faceHash,
      changed,
      outside,
      alphaChanged,
      inkScore: median(masks.map((m, i) => compareManaGlyph(refMasks[i].ink, m.ink).score)),
      costScore: objective.score(nativeGrayCrop(image, r.rect))[0],
    });
  }
  rows.push({ ...r, trials });
}
const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
const groups = {};
for (const symbol of ['B', 'R', 'G']) {
  const group = rows.filter((r) => r.symbol === symbol),
    cal = group.filter((r) => r.cohort === 'calibration');
  assert.equal(cal.length, 5);
  const candidates = capture.candidates
    .map((c) => c.profile.inkExpansion[symbol])
    .map((amount) => {
      const deltas = cal.map(
        (r) => r.trials.find((t) => t.amount === amount).inkScore - r.trials[0].inkScore,
      );
      return {
        amount,
        utility: mean(deltas) - 0.25 * Math.max(0, ...deltas.map((d) => -d)),
        calibrationGain100: 100 * mean(deltas),
      };
    })
    .sort((a, b) => b.utility - a.utility || a.amount - b.amount);
  const selected = candidates[0].amount;
  const cohorts = Object.fromEntries(
    ['all', 'calibration', 'validation'].map((cohort) => {
      const a = group.filter((r) => cohort === 'all' || r.cohort === cohort);
      const before = a.map((r) => r.trials[0]),
        after = a.map((r) => r.trials.find((t) => t.amount === selected));
      return [
        cohort,
        {
          count: a.length,
          inkMean100: [before, after].map((ts) => 100 * mean(ts.map((t) => t.inkScore))),
          costMean100: [before, after].map((ts) => 100 * mean(ts.map((t) => t.costScore))),
          improved: after.filter((t, i) => t.inkScore > before[i].inkScore + 1e-9).length,
          regressed: after.filter((t, i) => t.inkScore < before[i].inkScore - 1e-9).length,
          worstRegression100:
            100 * Math.max(0, ...after.map((t, i) => before[i].inkScore - t.inkScore)),
        },
      ];
    }),
  );
  groups[symbol] = { selected, candidates, cohorts };
}
await writeJson(output, {
  schema: 1,
  status: 'native-ink-expansion-study-verified-not-adopted',
  sources: Object.fromEntries(
    ['nativeCapture', 'nativeInputs', 'audit', 'glyphNativeCapture', 'inkNativeCapture'].map(
      (key, i) => [key, hash(raw[i])],
    ),
  ),
  verifierHash: hash(await readFile(new URL(import.meta.url))),
  thresholds,
  selection:
    'Calibration mean ink gain minus 0.25 times worst loss, per symbol, smaller expansion wins exact ties. Validation is reused development data, not an independent holdout.',
  scope:
    'Actual cached native PNGs with original words and fixed scan poses; zero expansion exactly matches prior glyph-native output. Only cost/rules pixels change, alpha unchanged. Thirty examples do not certify all costs, etching or final profile integration.',
  groups,
  rows,
});
console.log(JSON.stringify(groups, null, 2));
