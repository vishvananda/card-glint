// Native verification of the shared stats-anchor fit, not another alignment search.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
import { JsTextObjective, nativeGrayCrop } from './abu-type-objective.mjs';
const [beforeDirectory, afterDirectory, fitFile, out] = process.argv.slice(2);
assert(out, 'Usage: early-profile-stats-verify.mjs BEFORE AFTER FIT OUTPUT');
const raw = await Promise.all(
  [
    path.join(beforeDirectory, 'capture.json'),
    path.join(afterDirectory, 'capture.json'),
    fitFile,
    path.join(beforeDirectory, 'inputs.json'),
    path.join(afterDirectory, 'inputs.json'),
  ].map((f) => readFile(f)),
);
const [before, after, fit, bi, ai] = raw.map((b) => JSON.parse(b));
assert.equal(before.completed, 302);
assert.equal(after.completed, 302);
assert.equal(before.source.rendererHash, after.source.rendererHash);
assert.equal(hash(raw[0]), fit.source.nativeCaptureHash);
const p = structuredClone(bi.profile),
  q = structuredClone(ai.profile);
assert.equal(q.footer.stats.x - p.footer.stats.x, fit.selected.dx);
assert.equal(q.footer.stats.y - p.footer.stats.y, fit.selected.dy);
p.revision = q.revision = 0;
p.footer.stats.x = q.footer.stats.x = 0;
p.footer.stats.y = q.footer.stats.y = 0;
assert.deepEqual(p, q, 'More than stats anchor changed');
const rect = fit.rect,
  rows = [];
let unchanged = 0;
const load = async (root, file, digest) => {
  const b = await readFile(path.join(root, file));
  assert.equal(hash(b), digest);
  return PNG.sync.read(b, { checkCRC: true });
};
for (const row of after.rows) {
  const old = before.rows.find((r) => r.id === row.id);
  for (const k of ['poseHash', 'referenceHash', 'scanHash', 'currentFaceInputHash'])
    assert.equal(row[k], old[k]);
  assert.deepEqual(row.rasters.current, old.rasters.current);
  assert.equal(row.rasters.candidate.etching, old.rasters.candidate.etching);
  const a = await load(beforeDirectory, 'candidate/' + row.id + '.png', old.rasters.candidate.face),
    b = await load(afterDirectory, 'candidate/' + row.id + '.png', row.rasters.candidate.face);
  let changed = 0,
    outside = 0;
  for (let y = 0; y < b.height; y++)
    for (let x = 0; x < b.width; x++) {
      const i = (y * b.width + x) * 4;
      assert.equal(a.data[i + 3], b.data[i + 3]);
      if (![0, 1, 2, 3].some((k) => a.data[i + k] !== b.data[i + k])) continue;
      changed++;
      if (
        x < rect[0] * 1.5 ||
        x >= (rect[0] + rect[2]) * 1.5 ||
        y < rect[1] * 1.5 ||
        y >= (rect[1] + rect[3]) * 1.5
      )
        outside++;
    }
  assert.equal(outside, 0, 'Non-stats change ' + row.name);
  const predicted = fit.rows.find((r) => r.id === row.id);
  if (!predicted) {
    assert.equal(changed, 0, 'Noncreature changed ' + row.name);
    unchanged++;
    continue;
  }
  const scan = await load(afterDirectory, row.id + '-scan.png', row.scanHash),
    objective = new JsTextObjective(nativeGrayCrop(scan, rect), rect[2], rect[3]);
  const bv = objective.score(nativeGrayCrop(a, rect))[0],
    av = objective.score(nativeGrayCrop(b, rect))[0];
  assert.equal(bv, predicted.baseline);
  const index = fit.candidates.findIndex(
    (c) => c.dx === fit.selected.dx && c.dy === fit.selected.dy,
  );
  rows.push({
    id: row.id,
    name: row.name,
    material: row.material,
    cohort: row.cohort,
    referenceHash: row.referenceHash,
    poseHash: row.poseHash,
    beforeHash: old.rasters.candidate.face,
    afterHash: row.rasters.candidate.face,
    changed,
    outside,
    before100: 100 * bv,
    after100: 100 * av,
    predicted100: 100 * predicted.scores[index],
    predictionError100: 100 * (av - predicted.scores[index]),
  });
}
assert.equal(unchanged, 210);
assert.equal(rows.length, 92);
const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length,
  summary = {};
for (const label of ['all', 'calibration', 'validation']) {
  const rs = rows.filter((r) => label === 'all' || r.cohort === label);
  summary[label] = {
    count: rs.length,
    beforeMean100: mean(rs.map((r) => r.before100)),
    afterMean100: mean(rs.map((r) => r.after100)),
    improved: rs.filter((r) => r.after100 > r.before100).length,
    regressed: rs.filter((r) => r.after100 < r.before100).length,
    worstRegression100: Math.max(0, ...rs.map((r) => r.before100 - r.after100)),
    maximumPredictionError100: Math.max(...rs.map((r) => Math.abs(r.predictionError100))),
  };
}
await writeJson(out, {
  schema: 1,
  status: 'native-stats-anchor-verified-candidate',
  scope:
    'All 302 actual native Original faces: 92 shared P/T adjustments and 210 byte-identical noncreatures. Only the two shared stats-anchor values change, outside-region pixels and face alpha stay exact, all 302 default etching layers are unchanged, fixed scans/source inputs remain bound. This verifies an integrated component, not Oracle behavior or complete-set certification.',
  source: {
    beforeCaptureHash: hash(raw[0]),
    afterCaptureHash: hash(raw[1]),
    fitHash: hash(raw[2]),
    beforeInputsHash: hash(raw[3]),
    afterInputsHash: hash(raw[4]),
    rendererHash: after.source.rendererHash,
    toolHash: hash(await readFile(new URL(import.meta.url))),
  },
  unchangedNoncreatures: unchanged,
  summary,
  rows,
});
console.log(JSON.stringify(summary, null, 2));
