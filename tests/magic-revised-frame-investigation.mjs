import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';

const base = 'games/magic/fixtures/accuracy/3ed-recheck/';
const review = JSON.parse(await readFile(base + 'artifact-alignment-review.json'));
const receipts = {};
for (const [file, expected] of Object.entries(review.artifacts)) {
  const bytes = await readFile(base + file),
    raw = gunzipSync(bytes);
  assert.equal(hash(bytes), expected.sha256);
  assert.equal(hash(raw), expected.contentSha256);
  receipts[file] = JSON.parse(raw);
}
const readGzip = async (file) => gunzipSync(await readFile(base + file));
const inputBytes = await readGzip('original-inputs.json.gz');
const inputs = JSON.parse(inputBytes);
const poseBytes = await readGzip('normalization-baseline.json.gz');
const poses = JSON.parse(poseBytes);
const nativeBytes = await readGzip('native-baseline.json.gz');
const native = JSON.parse(nativeBytes);
const capture = receipts['artifact-geometry-native.json.gz'];
const geometry = receipts['artifact-geometry-scores.json.gz'];
const type = receipts['artifact-type-coherence.json.gz'];
const texture = receipts['artifact-texture-coherence.json.gz'];
const origin = receipts['artifact-origin-groups.json.gz'];
assert.equal(capture.status, 'complete');
assert.deepEqual(capture.faults, []);
assert.equal(capture.rendererHash, review.rendererHash);
assert.equal(capture.inputHash, hash(inputBytes));
assert.equal(capture.nativeParentHash, hash(nativeBytes));
assert.equal(geometry.inputHash, hash(inputBytes));
assert.equal(geometry.posesHash, hash(poseBytes));
assert.equal(
  geometry.captureHash,
  review.artifacts['artifact-geometry-native.json.gz'].contentSha256,
);
assert.match(geometry.status, /not-adopted/);
assert.match(review.status, /no-adoption/);
const ids = inputs.entries
  .filter((e) => e.material === 'A')
  .map((e) => e.id)
  .sort();
assert.equal(ids.length, 51);
for (const rows of [capture.rows, geometry.rows, type.rows, texture.rows, origin.rows]) {
  assert.deepEqual(rows.map((r) => r.id).sort(), ids);
}
assert.equal(
  new Set(
    capture.rows.map((r) => {
      const { face, ...shared } = r.material;
      assert.equal(hash(JSON.stringify(face)), r.inputHash);
      return JSON.stringify(shared);
    }),
  ).size,
  1,
  'Geometry candidates must retain one shared material treatment',
);
for (const e of inputs.entries.filter((e) => e.material === 'A')) {
  const n = native.rows.find((r) => r.id === e.id);
  const c = capture.rows.find((r) => r.id === e.id);
  const g = geometry.rows.find((r) => r.id === e.id);
  const t = type.rows.find((r) => r.id === e.id);
  const x = texture.rows.find((r) => r.id === e.id);
  const p = poses.rows.find((r) => r.id === e.id);
  for (const r of [c, g, t, x]) assert.equal(r.referenceHash, e.reference.sha256);
  assert.equal(c.inputHash, hash(JSON.stringify(e.face)));
  assert.equal(c.poseHash, hash(JSON.stringify(p.transform)));
  assert.equal(g.poseHash, c.poseHash);
  assert.equal(c.trials.current.sha256, n.sha256);
  assert.equal(x.paperObservedDx, t.paperObservedNativeDx);
  for (const trial of capture.trials) {
    const a = c.trials[trial.id],
      b = g.trials[trial.id];
    assert.equal(a.sha256, b.sha256);
    assert.deepEqual(a.layout, c.trials.current.layout);
    assert.equal(a.layout.overflow, false);
    assert.equal(
      b.delta100,
      100 * (b.score.structuralScore - g.trials.current.score.structuralScore),
    );
  }
}
const average = (a) => a.reduce((s, v) => s + v, 0) / a.length;
const close = (a, b) => assert(Math.abs(a - b) < 1e-9, a + ' != ' + b);
const correlation = (a, b) => {
  const x = average(a),
    y = average(b);
  return (
    a.reduce((s, v, i) => s + (v - x) * (b[i] - y), 0) /
    Math.sqrt(a.reduce((s, v) => s + (v - x) ** 2, 0) * b.reduce((s, v) => s + (v - y) ** 2, 0))
  );
};
close(
  texture.summary.paperVsTextureDxCorrelation,
  correlation(
    texture.rows.map((r) => r.paperObservedDx),
    texture.rows.map((r) => r.textureBest.dx),
  ),
);
assert.deepEqual(
  texture.summary.boundaries,
  texture.rows.filter((r) => r.boundary).map((r) => r.name),
);
for (const [rarity, expected] of Object.entries(review.rarityGroups)) {
  const rs = geometry.rows.filter(
    (r) => inputs.entries.find((e) => e.id === r.id).card.rarity === rarity,
  );
  assert.equal(expected.cards, rs.length);
  assert.equal(expected.improved, rs.filter((r) => r.trials['-1.25'].delta100 > 0).length);
  assert.equal(expected.regressed, rs.filter((r) => r.trials['-1.25'].delta100 < 0).length);
  close(expected.meanDelta100, average(rs.map((r) => r.trials['-1.25'].delta100)));
}
assert.equal(geometry.summary['-1.25'].all.regressed, 15);
assert.equal(review.uncutSheetControl.status, 'candidate-found-image-resolution-unverified');
console.log(
  'Revised frame investigation:51 exact controls, frozen geometry trials and scan-only co-motion; no shift adopted.',
);
