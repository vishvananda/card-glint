import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';

const root = new URL('../games/magic/fixtures/accuracy/3ed-recheck/', import.meta.url),
  review = JSON.parse(await fs.readFile(new URL('mana-native-review.json', root))),
  artifacts = {};
for (const [name, ref] of Object.entries(review.artifacts)) {
  const compressed = await fs.readFile(new URL(ref.file, root));
  assert.equal(hash(compressed), ref.sha256);
  const bytes = gunzipSync(compressed);
  assert.equal(hash(bytes), ref.contentSha256);
  assert(
    !/\/home\/|\/Users\/|127\.0\.0\.1/.test(bytes.toString()),
    'Public evidence must not expose private host paths',
  );
  artifacts[name] = JSON.parse(bytes);
}
const {
  direct,
  qualifiedSelection,
  qualified,
  circleWhole,
  circleRegions,
  blackWhole,
  blackRegions,
  tools,
} = artifacts;
for (const v of [
  direct,
  qualifiedSelection,
  qualified,
  circleWhole,
  circleRegions,
  blackWhole,
  blackRegions,
])
  assert.equal(v.rendererHash, review.rendererHash);
assert.equal(review.status, 'native-mana-geometry-diagnostic-not-adopted');
assert.deepEqual(qualified.rows, qualifiedSelection.rows);
assert.equal(direct.rows.length, 223);
assert.equal(qualified.rows.length, 223);
assert.equal(qualified.excluded.length, 58);
assert.equal(qualified.groups.all.circles, 413);
assert.equal(qualified.groups.all.accepted, 359);
assert.equal(qualified.groups.W.accepted, 24);
for (const [v, name] of [
  [direct, 'revised-mana-native-ring-study.mjs'],
  [qualified, 'revised-mana-qualified-rings.mjs'],
  [circleRegions, 'revised-mana-input-regions.mjs'],
  [blackRegions, 'revised-mana-input-regions.mjs'],
  [circleWhole, 'printing-native-input-score.mjs'],
  [blackWhole, 'printing-native-input-score.mjs'],
]) {
  const identity = v === direct ? v.sources : v;
  assert.equal(hash(tools[name]), identity.toolHash);
  for (const [n, h] of Object.entries(identity.modules ?? {})) assert.equal(hash(tools[n]), h);
}
assert.equal(
  hash(tools['reference-mana-circle-executed-r3.mjs']),
  qualifiedSelection.modules['reference-mana-circle.mjs'],
);
for (const r of qualified.rows) {
  const original = direct.rows.find((d) => d.id === r.id);
  assert.equal(r.referenceHash, original.referenceHash);
  assert.equal(r.nativeHash, original.nativeHash);
  assert.equal(r.poseHash, original.poseHash);
  assert.equal(original.nativeWindowError, 0);
  for (const d of r.discs)
    assert.equal(d.accepted, d.nativeControlPassed && d.reference.status === 'measured');
}
assert.deepEqual(circleWhole.reuse, { reused: 116, fresh: 190 });
assert.deepEqual(blackWhole.reuse, { reused: 260, fresh: 46 });
for (const [whole, regional] of [
  [circleWhole, circleRegions],
  [blackWhole, blackRegions],
]) {
  assert.equal(whole.rows.length, 306);
  assert.equal(regional.rows.length, 223);
  assert.equal(whole.sources.beforeInputs, regional.sources.beforeInputs);
  assert.equal(whole.sources.afterInputs, regional.sources.afterInputs);
  assert.equal(whole.sources.beforeCapture, regional.sources.beforeCapture);
  assert.equal(whole.sources.afterCapture, regional.sources.afterCapture);
  assert.notEqual(
    whole.sources.poses,
    regional.sources.poses,
    'Stock and interior registration must stay distinguished',
  );
  for (const r of regional.rows) {
    const w = whole.rows.find((w) => w.id === r.id),
      q = qualified.rows.find((q) => q.id === r.id);
    assert.equal(r.beforeNativeHash, w.beforeNativeHash);
    assert.equal(r.nativeHash, w.nativeHash);
    assert.equal(r.referenceHash, w.referenceHash);
    assert.equal(r.poseHash, q.poseHash);
    assert(Math.abs(r.delta100 - r.after100 + r.before100) < 1e-10);
  }
}
const matrixRef = JSON.parse(await fs.readFile(new URL('mana-placement-review.json', root)))
    .artifacts.full,
  matrix = JSON.parse(gunzipSync(await fs.readFile(new URL(matrixRef.file, root))));
const index = matrix.groups.B.index;
for (const r of blackRegions.rows) {
  const m = matrix.rows.find((m) => m.id === r.id),
    expected = r.material === 'B' ? m.scores[index] : m.scores[0];
  assert(
    Math.abs(r.after100 - 100 * expected) < 1e-10,
    'Actual public input must match the retained grid candidate',
  );
  assert.equal(r.changedPixels > 0, r.material === 'B');
}
const b = blackRegions.groups.B;
assert.equal(b.all.gains, 36);
assert.equal(b.all.losses, 2);
assert(b.all.worstLoss100 < 0.2);
for (const c of ['calibration', 'validation']) {
  assert(b[c].after100 > b[c].before100);
  const g = review.blackRowPrototype.independentPhysicalLoss[c];
  assert(g.row.meanCardHuberLoss < g.current.meanCardHuberLoss);
}
assert(circleRegions.groups.G.all.after100 < circleRegions.groups.G.all.before100);
assert(circleRegions.groups.A.validation.after100 < circleRegions.groups.A.validation.before100);
assert(circleRegions.groups.R.validation.after100 < circleRegions.groups.R.validation.before100);
assert.equal(blackWhole.summary.B.regressed, 18);
console.log(
  'Native mana evidence preserves 413 perimeter controls,223 exact row baselines,306 full-card identities and rejected broad-placement fits; black candidate improves both ink and physical residuals without certifying the set.',
);
