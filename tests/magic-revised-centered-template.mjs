import assert from 'node:assert/strict';
import { fitCenteredPrintedFramePixels } from '../games/magic/tools/accuracy/revised-pixel-template-fit.mjs';

const width = 488,
  height = 680;
function image(dx, tone = 0) {
  const data = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const l = Math.max(0, Math.min(1, (x - 52 - dx) / 1.5 + 0.5));
      const r = Math.max(0, Math.min(1, (440 + dx - x) / 1.5 + 0.5));
      const v = Math.round(35 + 150 * Math.min(l, r) + tone);
      data.set([v, v, v, 255], (y * width + x) * 4);
    }
  return { width, height, data };
}
const rawOffsets = [-1.375, 0.25, 1.375, 2];
const rows = rawOffsets.map((dx, i) => ({
  id: String(i),
  name: 'Synthetic ' + i,
  cohort: i < 3 ? 'calibration' : 'validation',
  stockTransform: {},
  image: image(dx, i * 3),
}));
const fit = fitCenteredPrintedFramePixels(rows);
assert.equal(fit.calibrationMedianDx, 0);
assert(fit.passes.every((p) => p.calibrationMedianDx === 0));
for (const r of fit.rows) {
  const expected = 0.25 - rawOffsets[Number(r.id)];
  assert(
    Math.abs(r.interiorDelta.dx - expected) <= 0.125,
    `${r.id}: expected ${expected}, got ${r.interiorDelta.dx}`,
  );
  assert(r.accepted, r.id);
}
const poisoned = structuredClone(rows);
poisoned[3].image.data.fill(0);
const held = fitCenteredPrintedFramePixels(poisoned);
assert.deepEqual(held.templates, fit.templates);
assert.deepEqual(held.passes, fit.passes);
assert.deepEqual(held.rows.slice(0, 3), fit.rows.slice(0, 3));
assert.equal(held.rows[3].accepted, false);

// Check-strip pixels cannot select the fit or the calibration gauge.
const conflicting = structuredClone(rows);
for (const r of conflicting)
  for (const y of [500, 550])
    for (let yy = y; yy < y + 25; yy++)
      r.image.data.fill(100, yy * width * 4, (yy + 1) * width * 4);
const checks = fitCenteredPrintedFramePixels(conflicting);
assert.deepEqual(checks.passes, fit.passes);
for (const key of ['fitLeft', 'fitRight'])
  assert.deepEqual(checks.templates[key], fit.templates[key]);
assert.deepEqual(
  checks.rows.map((r) => r.transform),
  fit.rows.map((r) => r.transform),
);
assert(checks.rows.every((r) => !r.accepted));
assert.throws(() => fitCenteredPrintedFramePixels(rows.slice(0, 3)));
assert.throws(() =>
  fitCenteredPrintedFramePixels(rows.map((r) => ({ ...r, cohort: 'validation' }))),
);
console.log(
  'Centered scan templates: known fractional translations, zero calibration gauge, independent check rejection and validation-template isolation pass.',
);

const { readFile } = await import('node:fs/promises');
const { gunzipSync } = await import('node:zlib');
const { hash } = await import('../games/magic/tools/accuracy/common.mjs');
const { median } = await import('../games/magic/tools/accuracy/metrics.mjs');
const { scanMatrix } = await import('../games/magic/tools/accuracy/scan-transform.mjs');
const { verifyWarpedFrame } = await import(
  '../games/magic/tools/accuracy/revised-frame-pixel-fit.mjs'
);
const { physicalRevisedMaterial } = await import(
  '../games/magic/tools/accuracy/revised-pixel-template-fit.mjs'
);
const base = 'games/magic/fixtures/accuracy/3ed-recheck/';
const report = JSON.parse(
  gunzipSync(await readFile(base + 'colored-horizontal-normalization.json.gz')),
);
const inputsBytes = gunzipSync(await readFile(base + 'corrected-original-inputs.json.gz'));
const parentBytes = gunzipSync(await readFile(base + 'normalization-baseline.json.gz'));
assert.equal(report.inputHash, hash(inputsBytes));
assert.equal(report.parentHash, hash(parentBytes));
const inputs = JSON.parse(inputsBytes),
  parent = JSON.parse(parentBytes);
for (const [file, expected] of Object.entries(report.sources))
  assert.equal(hash(await readFile('games/magic/tools/accuracy/' + file)), expected, file);
assert.deepEqual(Object.keys(report.groups), ['W', 'U', 'B', 'R', 'G']);
const seen = new Set();
let accepted = 0;
for (const [material, group] of Object.entries(report.groups)) {
  const cal = group.rows.filter((r) => r.cohort === 'calibration');
  assert.equal(median(cal.map((r) => r.interiorDelta.dx)), 0);
  assert(group.passes.every((p) => p.calibrationMedianDx === 0));
  for (const [key, template] of Object.entries(group.templates))
    assert.deepEqual(
      template,
      template.map((_, i) => median(cal.map((r) => r.profiles[key][i]))),
    );
  const expectedIds = inputs.entries
    .filter((e) => physicalRevisedMaterial(e) === material)
    .map((e) => e.id)
    .sort();
  assert.deepEqual(group.rows.map((r) => r.id).sort(), expectedIds);
  for (const r of group.rows) {
    assert(!seen.has(r.id));
    seen.add(r.id);
    const p = parent.rows.find((p) => p.id === r.id);
    assert(p.accepted);
    assert.equal(p.referenceHash, r.referenceHash);
    assert.equal(p.cohort, r.cohort);
    assert.deepEqual(r.stockTransform, p.transform);
    const expected = scanMatrix(p.transform).slice();
    expected[4] += r.interiorDelta.dx;
    assert.deepEqual(r.transform, { matrix: expected });
    const verification = verifyWarpedFrame(r.profiles, group.templates, {
      delta: r.finalRefinement,
    });
    for (const [key, value] of Object.entries(verification))
      if (key !== 'accepted') assert.deepEqual(r[key], value);
    assert.equal(r.accepted, verification.accepted && r.bounded);
    if (r.accepted) accepted++;
  }
  assert.equal(group.summary.accepted, group.rows.filter((r) => r.accepted).length);
}
assert.equal(seen.size, 230);
assert.equal(accepted, 223);
assert.equal(report.mismatches.length, 1);
assert.equal(report.mismatches[0].name, 'Serendib Efreet');
assert.equal(report.mismatches[0].recorded, 'U');
assert.equal(report.mismatches[0].physical, 'G');
console.log(
  'Revised colored registration:230 complete physical-material memberships,223 accepted,7 retained exclusions,exact centered templates and original stock transforms verified.',
);

const native = JSON.parse(gunzipSync(await readFile(base + 'colored-frame-native-trials.json.gz')));
const baselineBytes = gunzipSync(
  await readFile(base + 'artifact-adopted-native-originals.json.gz'),
);
const baseline = JSON.parse(baselineBytes);
assert.equal(native.baselineHash, hash(baselineBytes));
assert.equal(native.inputHash, hash(inputsBytes));
assert.equal(native.rendererHash, baseline.source.rendererHash);
assert.equal(native.status, 'complete');
assert.deepEqual(native.faults, []);
assert.equal(native.mode, 'trials');
assert.equal(
  native.toolHash,
  hash(await readFile('games/magic/tools/accuracy/revised-colored-native-trials.mjs')),
);
assert.equal(native.rows.length, 230);
assert.deepEqual(native.rows.map((r) => r.id).sort(), [...seen].sort());
assert.deepEqual(native.offsets, { W: 0.5, U: -0.25, B: 0, R: -0.25, G: 0.75 });
let changed = 0,
  unchanged = 0;
for (const row of native.rows) {
  const before = baseline.rows.find((r) => r.id === row.id);
  const original = row.modes.original;
  assert.deepEqual(Object.keys(row.modes), ['original']);
  assert.equal(row.referenceHash, before.referenceHash);
  assert.equal(original.inputHash, before.modes.original.inputHash);
  assert.equal(original.trials.current.sha256, before.modes.original.sha256);
  for (const trial of Object.values(original.trials)) {
    assert.deepEqual(trial.layout, before.modes.original.layout);
    assert.equal(trial.alphaHash, original.trials.current.alphaHash);
  }
  const entry = inputs.entries.find((e) => e.id === row.id);
  if (physicalRevisedMaterial(entry) === 'B') {
    assert.equal(original.trials.current.sha256, original.trials.proposed.sha256);
    unchanged++;
  } else {
    assert.notEqual(original.trials.current.sha256, original.trials.proposed.sha256);
    changed++;
  }
}
assert.equal(changed, 184);
assert.equal(unchanged, 46);
console.log(
  'Native colored proposals:230 exact Original baselines,230 stable body layouts and alpha masks,46 zero-shift controls; prototype is not a runtime adoption.',
);

const probeBytes = gunzipSync(await readFile(base + 'colored-frame-shift-probe.json.gz'));
const probe = JSON.parse(probeBytes);
const posesBytes = gunzipSync(await readFile(base + 'colored-horizontal-normalization.json.gz'));
assert.equal(probe.posesHash, hash(posesBytes));
assert.equal(probe.captureHash, hash(baselineBytes));
assert.equal(probe.rendererHash, native.rendererHash);
assert.equal(
  probe.toolHash,
  hash(await readFile('games/magic/tools/accuracy/revised-colored-geometry-diagnostic.mjs')),
);
for (const [material, group] of Object.entries(probe.groups)) {
  assert.equal(group.windowParity, report.groups[material].rows.length);
  assert.equal(group.selectedDx, native.offsets[material]);
  const best = group.trials.toSorted(
    (a, b) => b.calibrationFit - a.calibrationFit || Math.abs(a.dx) - Math.abs(b.dx),
  )[0];
  assert.equal(group.selectedDx, best.dx);
  assert.equal(group.after, best.calibrationFit);
  assert.equal(best.scores.length, report.groups[material].summary.accepted);
}
const nativeBytes = gunzipSync(await readFile(base + 'colored-frame-native-trials.json.gz'));
const scores = JSON.parse(
  gunzipSync(await readFile(base + 'colored-frame-geometry-scores.json.gz')),
);
assert.equal(scores.captureHash, hash(nativeBytes));
assert.equal(scores.posesHash, hash(posesBytes));
assert.equal(scores.inputHash, hash(inputsBytes));
assert.equal(scores.rendererHash, native.rendererHash);
assert.deepEqual(scores.offsets, native.offsets);
assert.equal(scores.rows.length, 223);
for (const row of scores.rows) {
  const pose = report.groups[row.material].rows.find((r) => r.id === row.id);
  assert(pose.accepted);
  assert.equal(row.poseHash, hash(JSON.stringify(pose.transform)));
  assert.equal(row.stockPoseHash, hash(JSON.stringify(pose.stockTransform)));
  assert.equal(row.referenceHash, pose.referenceHash);
  const original = native.rows.find((r) => r.id === row.id).modes.original;
  assert.equal(row.inputHash, original.inputHash);
  for (const id of ['current', 'proposed']) {
    assert.equal(row.trials[id].sha256, original.trials[id].sha256);
    const expected =
      100 * (row.trials[id].score.structuralScore - row.trials.current.score.structuralScore);
    assert.equal(row.trials[id].delta100, expected);
  }
}
for (const [material, cohorts] of Object.entries(scores.summary))
  for (const [cohort, summary] of Object.entries(cohorts)) {
    const selected = scores.rows.filter(
      (r) =>
        (material === 'all' || r.material === material) &&
        (cohort === 'all' || r.cohort === cohort),
    );
    assert.equal(summary.cards, selected.length);
    for (const [field, id, value] of [
      ['before100', 'current', (v) => 100 * v.score.structuralScore],
      ['after100', 'proposed', (v) => 100 * v.score.structuralScore],
      ['edgeBefore100', 'current', (v) => v.internalHorizontal100],
      ['edgeAfter100', 'proposed', (v) => v.internalHorizontal100],
    ]) {
      const expected = selected.reduce((sum, r) => sum + value(r.trials[id]), 0) / selected.length;
      assert.equal(summary[field], expected);
    }
  }
assert(scores.summary.all.all.after100 < scores.summary.all.all.before100);
assert(scores.summary.W.all.edgeAfter100 < scores.summary.W.all.edgeBefore100);
assert(scores.summary.R.all.edgeAfter100 > scores.summary.R.all.edgeBefore100);
assert(scores.summary.G.all.edgeAfter100 > scores.summary.G.all.edgeBefore100);
console.log(
  'Colored geometry gates retain the whole-card regression and white art/frame conflict;230 native controls and223 score joins remain experimental.',
);
