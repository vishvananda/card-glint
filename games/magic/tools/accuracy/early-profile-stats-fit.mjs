// Shared position refinement from native masks, keeping printing/scans fixed.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
import { JsTextObjective, nativeGrayCrop } from './abu-type-objective.mjs';
const [nativeDirectory, maskDirectory, profileFile, out] = process.argv.slice(2);
assert(out, 'Usage: early-profile-stats-fit.mjs INK_NATIVE MASK_CAPTURE PROFILE OUT');
const raw = await Promise.all(
  [
    path.join(nativeDirectory, 'capture.json'),
    path.join(maskDirectory, 'capture.json'),
    profileFile,
  ].map((f) => readFile(f)),
);
const [native, masks, profile] = raw.map((b) => JSON.parse(b));
assert.equal(native.completed, 302);
assert.equal(masks.completed, 302);
assert.equal(native.source.rendererHash, masks.source.rendererHash);
assert.equal(native.source.profileHash, hash(raw[2]));
const candidates = [];
for (let dx = -2; dx <= 10; dx += 0.5)
  for (let dy = -3; dy <= 3; dy += 0.5) candidates.push({ dx, dy });
const rect = [390, 596, 74, 51],
  origin = [584, 893],
  w = 115,
  h = 81,
  gray = profile.footer.stats.gray,
  shadow = profile.footer.stats.shadow;
const load = async (file, digest) => {
  const b = await readFile(file);
  assert.equal(hash(b), digest);
  return PNG.sync.read(b, { checkCRC: true });
};
const rows = [];
for (const row of masks.rows.filter((r) => r.assets.stats)) {
  const n = native.rows.find((n) => n.id === row.id);
  assert.equal(n.poseHash, row.poseHash);
  assert.equal(
    n.currentFaceInputHash,
    native.rows.find((r) => r.id === row.id).currentFaceInputHash,
  );
  const [a, bg, scan, current] = await Promise.all([
    load(path.join(maskDirectory, row.assets.stats.file), row.assets.stats.sha256),
    load(path.join(maskDirectory, row.assets.background.file), row.assets.background.sha256),
    load(path.join(nativeDirectory, row.id + '-scan.png'), row.scanHash),
    load(path.join(nativeDirectory, 'candidate', row.id + '.png'), n.rasters.candidate.face),
  ]);
  const state = row.states.stats;
  assert.equal(state.width, 1);
  assert.equal(state.trim, 0);
  const alpha = new Float64Array(a.width * a.height);
  for (let i = 0; i < alpha.length; i++) alpha[i] = a.data[i * 4 + 3] / 255;
  const at = (x, y) => {
    if (x < 0 || y < 0 || x + 1 >= a.width || y + 1 >= a.height) return 0;
    const l = Math.floor(x),
      t = Math.floor(y),
      fx = x - l,
      fy = y - t,
      i = t * a.width + l;
    return (
      (alpha[i] * (1 - fx) + alpha[i + 1] * fx) * (1 - fy) +
      (alpha[i + a.width] * (1 - fx) + alpha[i + a.width + 1] * fx) * fy
    );
  };
  const objective = new JsTextObjective(nativeGrayCrop(scan, rect), rect[2], rect[3]);
  const baseline = objective.score(nativeGrayCrop(current, rect))[0],
    scores = [];
  let zero,
    zeroError = 0;
  const raster = { width: w, height: h, data: new Uint8ClampedArray(w * h * 4) };
  for (const { dx, dy } of candidates) {
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const sx = origin[0] + x,
          sy = origin[1] + y,
          i = (y * w + x) * 4,
          j = (sy * bg.width + sx) * 4,
          A = at(sx - dx * 1.5, sy - dy * 1.5),
          S = at(sx - (dx + shadow) * 1.5, sy - (dy + shadow) * 1.5);
        for (let k = 0; k < 3; k++)
          raster.data[i + k] =
            (bg.data[j + k] * (1 - S) + [23, 20, 15][k] * S) * (1 - A) + gray * A;
        raster.data[i + 3] = bg.data[j + 3];
        if (dx === 0 && dy === 0)
          for (let k = 0; k < 3; k++)
            zeroError += Math.abs(raster.data[i + k] - current.data[j + k]);
      }
    const score = objective.score(nativeGrayCrop(raster, rect, origin))[0];
    scores.push(score);
    if (dx === 0 && dy === 0) zero = score;
  }
  assert(Math.abs(zero - baseline) < 0.025, 'Unreliable native zero model: ' + row.name);
  rows.push({
    id: row.id,
    name: row.name,
    material: row.material,
    cohort: row.cohort,
    referenceHash: row.referenceHash,
    poseHash: row.poseHash,
    baselineHash: n.rasters.candidate.face,
    maskHash: row.assets.stats.sha256,
    baseline,
    zero,
    zeroScoreError: zero - baseline,
    zeroMeanPixelError: zeroError / (w * h * 3),
    scores,
  });
  if (rows.length % 20 === 0) console.log('Stats position grid ' + rows.length + '/92');
}
assert.equal(rows.length, 92);
const cal = rows.filter((r) => r.cohort === 'calibration'),
  mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
const objectives = candidates.map(
  (c, i) =>
    mean(cal.map((r) => r.scores[i])) -
    0.25 * Math.max(0, ...cal.map((r) => r.baseline - r.scores[i])),
);
const j = objectives.indexOf(Math.max(...objectives));
const summary = {};
for (const label of ['all', 'calibration', 'validation']) {
  const rs = rows.filter((r) => label === 'all' || r.cohort === label),
    before = rs.map((r) => r.baseline),
    after = rs.map((r) => r.scores[j]);
  summary[label] = {
    count: rs.length,
    beforeMean100: 100 * mean(before),
    predictedAfterMean100: 100 * mean(after),
    improved: rs.filter((r) => r.scores[j] > r.baseline).length,
    regressed: rs.filter((r) => r.scores[j] < r.baseline).length,
    worstRegression100: 100 * Math.max(0, ...rs.map((r) => r.baseline - r.scores[j])),
  };
}
await writeJson(out, {
  schema: 1,
  status: 'shared-stats-position-candidate-needs-native-replay',
  scope:
    'All 92 native Original P/T fields, fixed scan poses, filled ink/shadow held constant. One shared right-anchor translation is selected using calibration names only. Model coverage is from the actual production glyphs; zero-candidate scores must stay within 2.5 regional points of actual native control. Nonzero translations still need full native verification because font antialias phase may differ. No per-card renderer offset is proposed.',
  source: {
    nativeCaptureHash: hash(raw[0]),
    maskCaptureHash: hash(raw[1]),
    profileHash: hash(raw[2]),
    rendererHash: native.source.rendererHash,
    toolHash: hash(await readFile(new URL(import.meta.url))),
  },
  rect,
  selected: candidates[j],
  objective: objectives[j],
  summary,
  candidates,
  objectives,
  rows,
});
console.log(JSON.stringify({ selected: candidates[j], summary }, null, 2));
