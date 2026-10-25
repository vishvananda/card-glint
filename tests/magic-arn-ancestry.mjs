import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { root, hash, sourceHash } from '../games/magic/tools/accuracy/common.mjs';
import {
  arnProfileDelta,
  preArnProfileSource,
  arnHistoricalSourceFiles,
  arnProfileRuntimeCompatible,
  arnProfileAffected,
} from '../games/magic/tools/accuracy/arn-profile-ancestry.mjs';
const p = await arnProfileDelta();
assert.equal(await sourceHash(root + '/games/magic/src'), p.afterRenderer);
for (const [file, e] of Object.entries(p.files)) {
  const bytes = await readFile(file);
  assert.equal(hash(bytes), e.after, file);
  const projected = await preArnProfileSource(file, bytes);
  assert.equal(hash(projected), e.before ?? e.after, file);
  const foreign = Buffer.concat([bytes, Buffer.from('\n// unreviewed edit\n')]);
  assert.deepEqual(await preArnProfileSource(file, foreign), foreign);
  if (e.beforeSource !== null)
    assert.deepEqual(await preArnProfileSource(file, projected), projected);
}
const added = Object.entries(p.files)
  .filter(([, e]) => e.beforeSource === null)
  .map(([f]) => f)
  .sort();
assert.deepEqual(added, [
  'games/magic/src/calibration/sets/arn.ts',
  'games/magic/src/presentation/set-symbol-source.ts',
]);
assert.deepEqual(await arnHistoricalSourceFiles(added), []);
assert(await arnProfileRuntimeCompatible('games/magic/src', p.beforeRenderer, 'lea'));
assert.equal(await arnProfileRuntimeCompatible('games/magic/src', p.beforeRenderer, 'arn'), false);
assert.equal(await arnProfileRuntimeCompatible('games/magic/src', p.beforeRenderer), false);
assert.equal(await arnProfileRuntimeCompatible('games/magic/src', '0'.repeat(64), 'lea'), false);
const artifacts = {};
for (const [name, r] of Object.entries(p.artifacts)) {
  const z = await readFile(r.file);
  assert.equal(hash(z), r.sha256);
  const b = gunzipSync(z);
  assert.equal(hash(b), r.contentSha256);
  artifacts[name] = JSON.parse(b);
}
const native = artifacts['integrated-native.json.gz'],
  scores = artifacts['integrated-scores.json.gz'];
assert.equal(native.status, 'complete');
assert.equal(native.completed, 92);
assert.equal(native.rows.length, 92);
assert.equal(native.source.rendererHash, p.afterRenderer);
assert.equal(
  scores.source.nativeCaptureHash,
  p.artifacts['integrated-native.json.gz'].contentSha256,
);
assert.equal(scores.rows.length, 92);
assert.equal(new Set(scores.rows.map((r) => r.id)).size, 92);
for (const r of scores.rows) {
  const n = native.rows.find((n) => n.id === r.id);
  assert(n);
  assert.equal(r.nativeHash, n.images.original.sha256);
  assert.equal(r.poseHash, n.poseHash);
  assert.equal(r.referenceHash, n.referenceHash);
  for (const mode of ['original', 'oracleModern', 'oracleOriginalSymbols', 'oracleFlavor']) {
    assert.match(n.images[mode].sha256, /^[a-f0-9]{64}$/);
    assert.equal(n.images[mode].layout?.overflow ?? false, false);
  }
}
const mean = scores.rows.reduce((sum, r) => sum + r.score.structuralScore * 100, 0) / 92;
assert.equal(mean, scores.summary.all.mean100);
assert(mean > 80 && mean < 81);
console.log(
  'ARN exact source history;1001 unchanged controls;92 native Originals plus276 Oracle modes; changed ARN cannot inherit earlier scores.',
);

assert.equal(arnProfileAffected('arn', 'frameColor'), true);
assert.equal(
  arnProfileAffected('arn', 'rules', true, {
    printingIds: ['9598b346-a47d-4c4c-9571-156824e86b9c'],
  }),
  true,
);
assert.equal(arnProfileAffected('arn', 'rules', true, { printingIds: ['unaffected-id'] }), false);
assert.equal(arnProfileAffected('arn', 'normalization'), false);
assert.equal(arnProfileAffected('lea', 'frameColor'), false);
