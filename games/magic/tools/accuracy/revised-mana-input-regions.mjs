// Compare actual native cost variants without composing or normalizing whole cards.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { hash, objectFile, writeJson } from './common.mjs';
import { nativeReferenceWindow } from './native-reference-window.mjs';
import { cropGray } from './pixels-pure.mjs';
import { nativeGrayCrop, JsTextObjective } from './abu-type-objective.mjs';

const [beforeInput, afterInput, beforeCapture, afterCapture, posesFile, priorStudy, output] =
  process.argv.slice(2);
assert(
  output,
  'Usage: revised-mana-input-regions.mjs BEFORE_INPUT AFTER_INPUT BEFORE_CAPTURE AFTER_CAPTURE POSES PRIOR_PLACEMENT_STUDY NEW_OUTPUT',
);
const files = [beforeInput, afterInput, beforeCapture, afterCapture, posesFile, priorStudy],
  bytes = await Promise.all(files.map((f) => fs.readFile(f))),
  [inputs, nextInputs, before, after, poses, prior] = bytes.map((b) => JSON.parse(b)),
  toolHash = hash(await fs.readFile(new URL(import.meta.url))),
  moduleNames = [
    'native-reference-window.mjs',
    'pixels-pure.mjs',
    'scan-transform.mjs',
    'abu-type-objective.mjs',
    'edges.mjs',
  ],
  identities = async () =>
    Object.fromEntries(
      await Promise.all(
        moduleNames.map(async (n) => [n, hash(await fs.readFile(new URL(n, import.meta.url)))]),
      ),
    ),
  modules = await identities(),
  rows = [];
assert.equal(inputs.set, '3ed');
assert.equal(nextInputs.set, inputs.set);
for (const c of [before, after]) {
  assert.equal(c.status, 'complete');
  assert.deepEqual(c.faults, []);
  assert.equal(c.rendererHash, prior.rendererHash);
  assert.deepEqual(c.rows.map((r) => r.id).sort(), inputs.entries.map((e) => e.id).sort());
}
assert.equal(before.inputHash, hash(bytes[0]));
assert.equal(after.inputHash, hash(bytes[1]));
assert.equal(prior.sources['inputs.json'], hash(bytes[0]));
assert.equal(prior.sources['capture.json'], hash(bytes[2]));
assert.equal(prior.sources[path.basename(posesFile)], hash(bytes[4]));
await fs.writeFile(output, JSON.stringify({ status: 'running' }), { flag: 'wx' });
for (const r of prior.rows) {
  const e = inputs.entries.find((e) => e.id === r.id),
    n = nextInputs.entries.find((e) => e.id === r.id),
    b = before.rows.find((n) => n.id === r.id).modes.original,
    a = after.rows.find((n) => n.id === r.id).modes.original,
    p = poses.groups[r.material].rows.find((p) => p.id === r.id);
  assert(p.accepted);
  assert.equal(r.poseHash, hash(JSON.stringify(p.transform)));
  assert.equal(r.nativeHash, b.sha256);
  assert.equal(e.face.wordingMode, 'original');
  assert.equal(n.face.wordingMode, 'original');
  const { symbolAdjustment: oldAdjustment, ...oldFace } = e.face,
    { symbolAdjustment: nextAdjustment, ...nextFace } = n.face;
  assert.deepEqual(nextFace, oldFace);
  assert.deepEqual(n.reference, e.reference);
  assert.deepEqual(n.card, e.card);
  assert.equal(b.inputHash, hash(JSON.stringify(e.face)));
  assert.equal(a.inputHash, hash(JSON.stringify(n.face)));
  assert.deepEqual(n.art, e.art);
  const source = await fs.readFile(objectFile(e.reference)),
    bb = await fs.readFile(path.join(path.dirname(beforeCapture), b.file)),
    ab = await fs.readFile(path.join(path.dirname(afterCapture), a.file));
  assert.equal(hash(source), r.referenceHash);
  assert.equal(hash(bb), b.sha256);
  assert.equal(hash(ab), a.sha256);
  const count = e.face.manaSymbols.length,
    left = Math.floor(432 - (count - 1) * 28 - 19),
    rect = [left, 25, 458 - left, 43],
    scan = nativeReferenceWindow(PNG.sync.read(source), rect, p.transform, 1),
    objective = new JsTextObjective(
      cropGray(scan, [0, 0, scan.width, scan.height]).gray,
      scan.width,
      scan.height,
    ),
    beforeImage = PNG.sync.read(bb),
    afterImage = PNG.sync.read(ab),
    oldScore = objective.score(nativeGrayCrop(beforeImage, rect))[0],
    newScore = objective.score(nativeGrayCrop(afterImage, rect))[0];
  assert.equal(beforeImage.width, afterImage.width);
  assert.equal(beforeImage.height, afterImage.height);
  assert(
    Math.abs(oldScore - r.scores[0]) < 1e-12,
    'Local scan sampler changed the archived native row objective',
  );
  let changed = 0;
  for (let y = 0; y < beforeImage.height; y++)
    for (let x = 0; x < beforeImage.width; x++) {
      const i = (y * beforeImage.width + x) * 4;
      if ([0, 1, 2, 3].some((k) => beforeImage.data[i + k] !== afterImage.data[i + k])) {
        changed++;
        assert(
          x >= Math.floor(rect[0] * 1.5) &&
            x < Math.ceil((rect[0] + rect[2]) * 1.5) &&
            y >= Math.floor(rect[1] * 1.5) &&
            y < Math.ceil((rect[1] + rect[3]) * 1.5),
          'Public cost adjustment changed pixels outside the cost window',
        );
      }
    }
  rows.push({
    id: r.id,
    name: r.name,
    material: r.material,
    cohort: r.cohort,
    referenceHash: r.referenceHash,
    poseHash: r.poseHash,
    beforeNativeHash: b.sha256,
    nativeHash: a.sha256,
    before100: 100 * oldScore,
    after100: 100 * newScore,
    delta100: 100 * (newScore - oldScore),
    changedPixels: changed,
    adjustment: n.face.symbolAdjustment?.mana ?? null,
  });
  if (rows.length % 30 === 0)
    console.log('Native cost region comparison', rows.length, '/', prior.rows.length);
}
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length,
  groups = Object.fromEntries(
    ['all', 'W', 'U', 'B', 'R', 'G', 'A'].map((m) => [
      m,
      Object.fromEntries(
        ['all', 'calibration', 'validation'].map((c) => {
          const rs = rows.filter(
            (r) => (m === 'all' || r.material === m) && (c === 'all' || r.cohort === c),
          );
          return [
            c,
            {
              cards: rs.length,
              before100: mean(rs.map((r) => r.before100)),
              after100: mean(rs.map((r) => r.after100)),
              gains: rs.filter((r) => r.delta100 > 1e-9).length,
              losses: rs.filter((r) => r.delta100 < -1e-9).length,
              worstLoss100: Math.max(0, ...rs.map((r) => -r.delta100)),
            },
          ];
        }),
      ),
    ]),
  );
assert.deepEqual(await identities(), modules);
assert.equal(hash(await fs.readFile(new URL(import.meta.url))), toolHash);
assert.deepEqual(
  await Promise.all(files.map(async (f) => hash(await fs.readFile(f)))),
  bytes.map(hash),
);
await writeJson(output, {
  schema: 1,
  status: 'complete-native-cost-input-regions-not-adopted',
  scope:
    'Actual Original full-card native renders; fixed accepted frame poses. Direct canonical reference windows reproduce every archived baseline cost objective within 1e-12. Only public mana/set inputs may differ. Every pixel change is checked to remain inside the cost window. This diagnostic does not change defaults or certify a set.',
  rendererHash: before.rendererHash,
  toolHash,
  modules,
  sources: Object.fromEntries(
    ['beforeInputs', 'afterInputs', 'beforeCapture', 'afterCapture', 'poses', 'priorStudy'].map(
      (name, i) => [name, hash(bytes[i])],
    ),
  ),
  groups,
  rows,
});
console.log(JSON.stringify(groups));
