// Paired native heading audit. Scores are regional indices, not whole-card scores.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { readJson, writeJson, hash } from './common.mjs';
import { JsTextObjective, nativeGrayCrop } from './abu-type-objective.mjs';
const [beforeDir, afterDir, output, partial] = process.argv.slice(2);
assert(output, 'Usage: abu-reviewed-measure.mjs BEFORE AFTER OUTPUT [--partial]');
assert(!partial || partial === '--partial');
const before = await readJson(path.join(beforeDir, 'capture.json')),
  after = await readJson(path.join(afterDir, 'capture.json'));
assert.equal(before.source.variant, 'released-headings');
assert.equal(after.source.variant, 'current');
for (const k of ['rendererHash']) assert.deepEqual(before.source[k], after.source[k]);
const assetHashes = new Map(after.source.components);
for (const [url, digest] of before.source.components)
  assert.equal(assetHashes.get(url), digest, 'Changed source asset: ' + url);
const rects = { title: [29, 24, 425, 48], type: [29, 358, 425, 49] },
  rows = [];
for (const a of after.rows.filter((r) => r.set === 'lea')) {
  const b = before.rows.find((r) => r.id === a.id);
  if (!b) {
    assert(partial, 'Unpaired printing ' + a.id);
    continue;
  }
  for (const k of ['referenceHash', 'poseHash', 'scanHash', 'accepted'])
    assert.deepEqual(a[k], b[k]);
  const load = async (dir, suffix, expected) => {
    const bytes = await readFile(path.join(dir, a.set, a.id + suffix + '.png'));
    assert.equal(hash(bytes), expected);
    return PNG.sync.read(bytes);
  };
  const [scan, old, current] = await Promise.all([
    load(afterDir, '-scan', a.scanHash),
    load(beforeDir, '', b.renderHash),
    load(afterDir, '', a.renderHash),
  ]);
  let outside = 0,
    changed = 0;
  for (let y = 0; y < current.height; y++)
    for (let x = 0; x < current.width; x++) {
      const i = (y * current.width + x) * 4;
      if (![0, 1, 2, 3].some((c) => old.data[i + c] !== current.data[i + c])) continue;
      changed++;
      if (
        !Object.values(rects).some(
          ([l, t, w, h]) => x >= l * 1.5 && x < (l + w) * 1.5 && y >= t * 1.5 && y < (t + h) * 1.5,
        )
      )
        outside++;
    }
  assert.equal(outside, 0, 'Non-heading change: ' + a.name);
  const scores = {};
  for (const [role, rect] of Object.entries(rects)) {
    const objective = new JsTextObjective(nativeGrayCrop(scan, rect), rect[2], rect[3]);
    const bv = objective.score(nativeGrayCrop(old, rect)),
      av = objective.score(nativeGrayCrop(current, rect));
    scores[role] = {
      before: 100 * bv[0],
      after: 100 * av[0],
      delta: 100 * (av[0] - bv[0]),
      chamferBefore: bv[4],
      chamferAfter: av[4],
      nativeMask: a.controls[role],
    };
  }
  rows.push({
    id: a.id,
    name: a.name,
    accepted: a.accepted,
    referenceHash: a.referenceHash,
    poseHash: a.poseHash,
    beforeHash: b.renderHash,
    afterHash: a.renderHash,
    changed,
    outside,
    scores,
  });
}
if (!partial) assert.equal(rows.length, 295, 'Incomplete Alpha native replay');
const accepted = rows.filter((r) => r.accepted),
  mean = (vs) => vs.reduce((s, v) => s + v, 0) / vs.length;
const summary = Object.fromEntries(
  Object.keys(rects).map((role) => [
    role,
    {
      count: accepted.length,
      before: mean(accepted.map((r) => r.scores[role].before)),
      after: mean(accepted.map((r) => r.scores[role].after)),
      improved: accepted.filter((r) => r.scores[role].delta > 0).length,
      regressedHalfPoint: accepted.filter((r) => r.scores[role].delta < -0.5).length,
    },
  ]),
);
await writeJson(output, {
  schema: 1,
  complete: !partial,
  scope:
    'Alpha headings only. Same native renderer, corrections, artwork and frozen independent scan transforms; before restores the released 0.6.1 heading settings through the public set editor. Real full-pipeline candidates, zero pixel changes outside headings. Single-pass raw-reference sampling at 732x1020, followed by symmetric regional local-contrast scoring in canonical space. Reused development scans, not a new blind holdout. Indices out of 100; not percentage correctness or Lab whole-card measurements.',
  rendererHash: after.source.rendererHash,
  toolHash: hash(await readFile(new URL(import.meta.url))),
  beforeCaptureHash: hash(await readFile(path.join(beforeDir, 'capture.json'))),
  afterCaptureHash: hash(await readFile(path.join(afterDir, 'capture.json'))),
  total: rows.length,
  excluded: rows.filter((r) => !r.accepted).map((r) => ({ id: r.id, name: r.name })),
  summary,
  rows,
});
console.log(JSON.stringify({ partial: !!partial, total: rows.length, summary }));
