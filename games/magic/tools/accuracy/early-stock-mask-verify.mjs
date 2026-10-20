// Verify that a stock-mask trial changes only the card's outer printed boundary.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
import { median } from './metrics.mjs';
const [nativeDirectory, trialDirectory, trialName, output] = process.argv.slice(2);
assert(output, 'Usage: early-stock-mask-verify.mjs NATIVE_CAPTURE TRIAL_CAPTURE TRIAL_NAME OUTPUT');
const nativeBytes = await readFile(path.join(nativeDirectory, 'capture.json')),
  native = JSON.parse(nativeBytes),
  trialBytes = await readFile(path.join(trialDirectory, 'capture.json')),
  trial = JSON.parse(trialBytes),
  rows = [];
assert.equal(trial.source.nativeCaptureHash, hash(nativeBytes));
assert.equal(trial.source.rendererHash, native.source.rendererHash);
assert.equal(trial.rows.length, native.rows.length, 'Incomplete stock-mask replay');
for (const r of trial.rows) {
  const b = native.rows.find((b) => b.id === r.id),
    v = r.trials[trialName];
  assert(b && v && r.baselineParity);
  for (const k of ['referenceHash', 'poseHash']) assert.equal(b[k], r[k]);
  assert.equal(r.trials.current.faceHash, b.renderHash);
  const files = [
      path.join(nativeDirectory, r.set, r.id + '.png'),
      path.join(trialDirectory, trialName, r.id + '.png'),
    ],
    bytes = await Promise.all(files.map((f) => readFile(f)));
  assert.equal(hash(bytes[0]), b.renderHash);
  assert.equal(hash(bytes[1]), v.faceHash);
  const images = bytes.map((b) => PNG.sync.read(b));
  for (const im of images) assert(im.width === 732 && im.height === 1020);
  const masks = [];
  for (const role of ['title', 'type']) {
    const raw = await readFile(path.join(nativeDirectory, r.set, r.id + '-' + role + '.png'));
    assert.equal(hash(raw), b.controls[role].sha256);
    masks.push(PNG.sync.read(raw));
  }
  let changed = 0,
    alphaChanged = 0,
    interiorChanged = 0,
    glyphOverlap = 0;
  for (let p = 0; p < 732 * 1020; p++) {
    const i = p * 4,
      a = images[0].data,
      c = images[1].data;
    if (a[i + 3] !== c[i + 3]) alphaChanged++;
    if (a[i] === c[i] && a[i + 1] === c[i + 1] && a[i + 2] === c[i + 2] && a[i + 3] === c[i + 3])
      continue;
    changed++;
    const x = p % 732,
      y = Math.floor(p / 732);
    if (x > 60 && x < 672 && y > 68 && y < 952) interiorChanged++;
    if (masks.some((m) => m.data[i + 3] > 0)) glyphOverlap++;
  }
  assert.equal(interiorChanged, 0, r.name + ' interior changed');
  assert.equal(alphaChanged, 0, r.name + ' alpha changed');
  assert.equal(glyphOverlap, 0, r.name + ' heading overlap');
  assert.equal(v.etchingChanged, false);
  assert(v.outerBoundary.coherent);
  const before = r.trials.current.outerBoundary.medianResidualPx,
    after = v.outerBoundary.medianResidualPx;
  assert(after < before, r.name + ' outer boundary did not improve');
  rows.push({
    id: r.id,
    name: r.name,
    material: r.material,
    cohort: r.cohort,
    referenceHash: r.referenceHash,
    poseHash: r.poseHash,
    beforeFaceHash: b.renderHash,
    afterFaceHash: v.faceHash,
    etchingHash: v.etchingHash,
    changedPixels: changed,
    interiorChanged,
    alphaChanged,
    glyphOverlap,
    beforeResidualPx: before,
    afterResidualPx: after,
  });
}
await writeJson(output, {
  schema: 1,
  status: 'verified-native-stock-mask-only',
  scope:
    'All supplied frozen original-printing native captures. Exact baseline face hashes and original scan poses are retained. No changed pixel intersects a native title/type coverage mask or the strict canonical interior [40,45]–[448,635]. Face alpha bytes are identical. Every measured outer boundary improves. Etching outputs are unchanged but empty for these inputs; this is not nonempty etching coverage certification. No complete-set geometry or release claim.',
  rendererHash: native.source.rendererHash,
  nativeCaptureHash: hash(nativeBytes),
  trialCaptureHash: hash(trialBytes),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  total: rows.length,
  medianBeforePx: median(rows.map((r) => r.beforeResidualPx)),
  medianAfterPx: median(rows.map((r) => r.afterResidualPx)),
  worstAfterPx: Math.max(...rows.map((r) => r.afterResidualPx)),
  rows,
});
console.log(
  JSON.stringify({
    total: rows.length,
    medianBeforePx: median(rows.map((r) => r.beforeResidualPx)),
    medianAfterPx: median(rows.map((r) => r.afterResidualPx)),
    interiorChanged: 0,
    alphaChanged: 0,
    glyphOverlap: 0,
  }),
);
