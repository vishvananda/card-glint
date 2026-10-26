import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { selectRevisedWidthTrial } from '../games/magic/tools/accuracy/revised-colored-width-diagnostic.mjs';
const base = 'games/magic/fixtures/accuracy/3ed-recheck/';
const read = async (file) => {
  const bytes = gunzipSync(await readFile(base + file));
  return { bytes, value: JSON.parse(bytes) };
};
const pose = await read('colored-horizontal-normalization.json.gz'),
  baseline = await read('artifact-adopted-native-originals.json.gz'),
  input = await read('corrected-original-inputs.json.gz'),
  probe = await read('colored-width-probe.json.gz'),
  native = await read('colored-width-native-trials.json.gz'),
  scores = await read('colored-width-geometry-scores.json.gz'),
  prior = await read('colored-frame-geometry-scores.json.gz');
assert.equal(probe.value.posesHash, hash(pose.bytes));
assert.equal(probe.value.captureHash, hash(baseline.bytes));
assert.equal(
  probe.value.toolHash,
  hash(await readFile('games/magic/tools/accuracy/revised-colored-width-diagnostic.mjs')),
);
assert.equal(native.value.status, 'complete');
assert.deepEqual(native.value.faults, []);
assert.equal(native.value.rows.length, 230);
assert.equal(native.value.inputHash, hash(input.bytes));
assert.equal(native.value.baselineHash, hash(baseline.bytes));
assert.equal(
  native.value.toolHash,
  hash(await readFile('games/magic/tools/accuracy/revised-colored-width-native-trials.mjs')),
);
assert.equal(native.value.rendererHash, baseline.value.source.rendererHash);
for (const [material, g] of Object.entries(probe.value.groups)) {
  assert.equal(g.trials.length, 225);
  assert.deepEqual(selectRevisedWidthTrial(g.trials), g.selected);
  const poisoned = g.trials.map((t) => ({ ...t, validationFit: 1000 - t.calibrationFit }));
  const selected = selectRevisedWidthTrial(poisoned);
  assert.equal(selected.sx, g.selected.sx);
  assert.equal(selected.dx, g.selected.dx);
  assert.deepEqual(selectRevisedWidthTrial([...g.trials].reverse()), g.selected);
  const actual = native.value.offsets[material];
  if (material === 'B') {
    assert.deepEqual(actual, { sx: 1, dx: 0 });
    assert(g.selected.calibrationFit - g.zero.calibrationFit < 0.01);
  } else assert.deepEqual(actual, { sx: g.selected.sx, dx: g.selected.dx });
}
assert.deepEqual(native.value.offsets, {
  W: { sx: 1.002, dx: 0.25 },
  U: { sx: 0.999, dx: -0.25 },
  B: { sx: 1, dx: 0 },
  R: { sx: 1, dx: -0.375 },
  G: { sx: 1, dx: 0.75 },
});
assert.equal(scores.value.captureHash, hash(native.bytes));
assert.equal(scores.value.posesHash, hash(pose.bytes));
assert.equal(scores.value.inputHash, hash(input.bytes));
assert.deepEqual(scores.value.metricGraph, prior.value.metricGraph);
assert.equal(scores.value.rows.length, 223);
let reused = 0,
  fresh = 0;
for (const r of native.value.rows) {
  const old = baseline.value.rows.find((o) => o.id === r.id),
    m = r.modes.original;
  assert.equal(m.inputHash, old.modes.original.inputHash);
  assert.equal(m.trials.current.sha256, old.modes.original.sha256);
  for (const t of Object.values(m.trials)) {
    assert.deepEqual(t.layout, old.modes.original.layout);
    assert.equal(t.alphaHash, m.trials.current.alphaHash);
  }
}
for (const r of scores.value.rows) {
  const p = pose.value.groups[r.material].rows.find((p) => p.id === r.id),
    old = prior.value.rows.find((o) => o.id === r.id),
    n = native.value.rows.find((n) => n.id === r.id);
  assert(p.accepted);
  assert.equal(r.poseHash, hash(JSON.stringify(p.transform)));
  assert.equal(r.referenceHash, p.referenceHash);
  assert.equal(r.inputHash, n.modes.original.inputHash);
  for (const [id, t] of Object.entries(r.trials)) {
    assert.equal(t.sha256, n.modes.original.trials[id].sha256);
    assert.equal(
      t.delta100,
      100 * (t.score.structuralScore - r.trials.current.score.structuralScore),
    );
    if (t.scoreReused) {
      reused++;
      const cached = Object.values(old.trials).find((t0) => t0.sha256 === t.sha256);
      assert(cached);
      assert.equal(r.poseHash, old.poseHash);
      assert.equal(r.referenceHash, old.referenceHash);
      assert.equal(r.inputHash, old.inputHash);
      assert.deepEqual(t.score, cached.score);
      assert.deepEqual(t.bands, cached.bands);
    } else fresh++;
  }
}
assert.deepEqual({ reused, fresh }, scores.value.reuse);
assert.equal(reused, 309);
assert.equal(fresh, 137);
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
for (const [material, cohorts] of Object.entries(scores.value.summary))
  for (const [cohort, s] of Object.entries(cohorts)) {
    const rs = scores.value.rows.filter(
      (r) =>
        (material === 'all' || r.material === material) &&
        (cohort === 'all' || r.cohort === cohort),
    );
    assert.equal(s.cards, rs.length);
    assert.equal(s.before100, mean(rs.map((r) => r.trials.current.score.structuralScore * 100)));
    assert.equal(s.after100, mean(rs.map((r) => r.trials.proposed.score.structuralScore * 100)));
    assert.equal(s.edgeBefore100, mean(rs.map((r) => r.trials.current.internalHorizontal100)));
    assert.equal(s.edgeAfter100, mean(rs.map((r) => r.trials.proposed.internalHorizontal100)));
  }
assert(scores.value.summary.all.all.after100 > prior.value.summary.all.all.after100);
assert(scores.value.summary.W.all.edgeAfter100 < scores.value.summary.W.all.edgeBefore100);
assert(scores.value.summary.G.all.edgeAfter100 > scores.value.summary.G.all.edgeBefore100);
assert.throws(() => selectRevisedWidthTrial([]));
assert.throws(() => selectRevisedWidthTrial([{ sx: 2, dx: 0, calibrationFit: 99 }]));
assert.throws(() =>
  selectRevisedWidthTrial([
    { sx: 1, dx: 0, calibrationFit: 99 },
    { sx: 1, dx: 0, calibrationFit: 99 },
  ]),
);
console.log(
  'Revised width study:225 bounded candidates/material; calibration-only deterministic selection;460 native controls;446 full metric joins with309 exact reuses/137 fresh metrics. White remains flagged; no runtime adoption.',
);
