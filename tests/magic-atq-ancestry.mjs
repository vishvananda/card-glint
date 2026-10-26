import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { root, hash, sourceHash } from '../games/magic/tools/accuracy/common.mjs';
import {
  atqProfileDelta,
  preAtqProfileSource,
  atqHistoricalSourceFiles,
  atqProfileHistoricalHash,
  atqProfileRuntimeCompatible,
  atqProfileAffected,
} from '../games/magic/tools/accuracy/atq-profile-ancestry.mjs';
const p = await atqProfileDelta();
assert.equal(await sourceHash(root + '/games/magic/src'), p.afterRenderer);
assert.equal(await atqProfileHistoricalHash(), p.beforeRenderer);
for (const [file, e] of Object.entries(p.files)) {
  const bytes = await readFile(file);
  assert.equal(hash(bytes), e.after, file);
  assert.equal(hash(await preAtqProfileSource(file, bytes)), e.before ?? e.after, file);
  const foreign = Buffer.concat([bytes, Buffer.from('\n// unreviewed edit\n')]);
  assert.deepEqual(await preAtqProfileSource(file, foreign), foreign);
}
const added = Object.entries(p.files)
  .filter(([, e]) => e.beforeSource === null)
  .map(([f]) => f);
assert.deepEqual(added, ['games/magic/src/calibration/sets/atq.ts']);
assert.deepEqual(await atqHistoricalSourceFiles(added), []);
for (const set of ['lea', 'leb', '2ed', 'arn'])
  assert(await atqProfileRuntimeCompatible('games/magic/src', p.beforeRenderer, set));
for (const set of ['atq', undefined])
  assert.equal(await atqProfileRuntimeCompatible('games/magic/src', p.beforeRenderer, set), false);
assert.equal(await atqProfileRuntimeCompatible('games/magic/src', '0'.repeat(64), 'lea'), false);
for (const task of ['frameColor', 'rules', 'setSymbol', 'manaColor', 'fullCard'])
  assert(atqProfileAffected('atq', task));
for (const task of ['references', 'normalization'])
  assert.equal(atqProfileAffected('atq', task), false);
assert.equal(atqProfileAffected('atq', 'rules', true), false);
assert.equal(atqProfileAffected('arn', 'rules'), false);
const artifacts = {};
for (const [name, a] of Object.entries(p.artifacts)) {
  const z = await readFile(a.file);
  assert.equal(hash(z), a.sha256);
  const bytes = gunzipSync(z);
  assert.equal(hash(bytes), a.contentSha256);
  artifacts[name] = JSON.parse(bytes);
}
const n = artifacts['integrated-native.json.gz'],
  s = artifacts['integrated-scores.json.gz'];
assert.equal(n.status, 'complete');
assert.equal(n.completed, 102);
assert.equal(n.source.rendererHash, p.afterRenderer);
assert.equal(s.source.rendererHash, p.afterRenderer);
assert.equal(s.source.nativeCaptureHash, p.artifacts['integrated-native.json.gz'].contentSha256);
assert.equal(s.rows.length, 102);
assert.equal(new Set(s.rows.map((r) => r.id)).size, 102);
for (const r of s.rows) {
  const native = n.rows.find((n) => n.id === r.id);
  assert(native);
  assert.equal(r.candidateHash, native.images.original.sha256);
  assert.equal(r.poseHash, native.poseHash);
  assert.equal(r.referenceHash, native.referenceHash);
  for (const mode of ['original', 'oracleModern', 'oracleOriginalSymbols', 'oracleFlavor']) {
    assert.match(native.images[mode].sha256, /^[a-f0-9]{64}$/);
    assert.equal(native.images[mode].layout?.overflow ?? false, false);
  }
}
const mean = (key) => s.rows.reduce((sum, r) => sum + r[key].structuralScore * 100, 0) / 102;
assert.equal(mean('before'), s.summary.all.before100);
assert.equal(mean('candidate'), s.summary.all.candidate100);
assert(s.summary.all.candidate100 - s.summary.all.before100 > 5);
assert.equal(s.summary.all.improved, 101);
assert.equal(s.summary.all.regressed, 1);
assert.equal(s.summary.validation.regressed, 0);
const factories = n.rows.filter((r) => r.name === "Mishra's Factory");
assert.equal(factories.length, 4);
for (const r of factories) {
  const layout = r.images.original.layout;
  assert.equal(layout.top, 414);
  assert.equal(layout.size, 21.75);
  assert.equal(layout.lines.length, 8);
}
const previousScores = artifacts['pre-minus-scores.json.gz'];
assert.equal(s.source.priorScoresHash, p.artifacts['pre-minus-scores.json.gz'].contentSha256);
assert.deepEqual(s.source.metricGraph, previousScores.source.metricGraph);
let reused = 0;
for (const row of s.rows) {
  const old = previousScores.rows.find((r) => r.id === row.id);
  assert.deepEqual(row.before, old.before);
  if (row.candidateHash === old.candidateHash) {
    assert.deepEqual(row.candidate, old.candidate);
    reused++;
  } else assert.equal(row.name, 'Shapeshifter');
}
assert.equal(reused, 101);
const footer = artifacts['footer-parity.json.gz'];
assert.equal(footer.rendererHash, p.afterRenderer);
for (const row of footer.rows.filter((r) => r.material !== 'U'))
  assert.equal(row.before, row.after);
const controls = artifacts['unaffected-native.json.gz'];
assert.equal(controls.rows.length, 991);
for (const r of controls.rows) assert.equal(r.before, r.after);
console.log(
  'ATQ exact source history;102 Original and306 Oracle renders;991 unchanged ABU/ARN controls; changed ATQ cannot inherit old fits.',
);
