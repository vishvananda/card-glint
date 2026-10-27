import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash, sourceHash } from '../games/magic/tools/accuracy/common.mjs';
import {
  fourthBasicBodyDelta,
  fourthBasicBodyHistoricalHash,
  preFourthBasicBodySource,
  fourthBasicBodyAffected,
} from '../games/magic/tools/accuracy/fourth-basic-body-ancestry.mjs';
const p = await fourthBasicBodyDelta();
assert.equal(await sourceHash('games/magic/src'), p.afterRenderer);
assert.equal(await fourthBasicBodyHistoricalHash(), p.beforeRenderer);
for (const [file, r] of Object.entries(p.files)) {
  const bytes = await fs.readFile(file);
  assert.equal(hash(bytes), r.after);
  assert.equal(hash(await preFourthBasicBodySource(file, bytes)), r.before);
  const unknown = Buffer.concat([bytes, Buffer.from('\n// unknown change\n')]);
  assert.deepEqual(await preFourthBasicBodySource(file, unknown), unknown);
}
const native = JSON.parse(gunzipSync(await fs.readFile(p.native.file))),
  review = JSON.parse(
    await fs.readFile('games/magic/fixtures/accuracy/4ed/basic-body-adoption.json'),
  ),
  artifacts = {};
for (const [key, ref] of Object.entries(review.artifacts)) {
  const z = await fs.readFile(ref.file);
  assert.equal(hash(z), ref.sha256);
  const raw = gunzipSync(z);
  assert.equal(hash(raw), ref.contentSha256);
  assert(!/\/home\/|\/Users\/|127\.0\.0\.1/.test(raw.toString()));
  artifacts[key] = key === 'scores' ? JSON.parse(raw) : raw.toString();
}
assert.equal(native.toolHash, hash(artifacts.nativeTool));
const scores = artifacts.scores;
assert.equal(scores.toolHash, hash(artifacts.scoreTool));
assert.equal(scores.bodyNativeProofHash, p.native.contentSha256);
assert.equal(scores.beforeInputHash, scores.inputHash);
assert.deepEqual(native.counts.original, { changed: 15, unchanged: 363, keysChanged: 378 });
for (const mode of ['oracle', 'oracle-modern', 'etching'])
  assert.deepEqual(native.counts[mode], { changed: 0, unchanged: 378, keysChanged: 378 });
assert.deepEqual(scores.reuse, { reused: 363, fresh: 15 });
assert.equal(scores.rows.length, 378);
assert.equal(scores.summary.all.improved, 15);
assert.equal(scores.summary.all.regressed, 0);
assert(scores.summary.L.current100 > scores.summary.L.before100 + 9);
assert.deepEqual(review.wholeCard, scores.summary.all);
assert.deepEqual(review.landGroup, scores.summary.L);
const baseline = JSON.parse(
  gunzipSync(
    await fs.readFile(
      'games/magic/fixtures/accuracy/early-through-fourth/later-native-baselines.json.gz',
    ),
  ),
).sets['4ed'];
for (const r of scores.rows) {
  const n = native.rows.find((n) => n.id === r.id),
    old = baseline.rows.find((b) => b.id === r.id);
  assert(n && old);
  assert.equal(r.scoreReused, !n.basic);
  assert.equal(r.beforeNativeHash, n.modes.original.before);
  assert.equal(r.nativeHash, n.modes.original.after);
  assert.equal(r.beforeNativeHash, old.nativeHash);
  assert.equal(r.referenceHash, old.referenceHash);
  assert.equal(r.poseHash, old.poseHash);
  if (!n.basic) assert.deepEqual(r.score, r.beforeScore);
  else assert(r.delta100 > 0);
}
const basic = { printingIds: [p.ids[0]] },
  nonbasic = { printingIds: [native.rows.find((r) => !r.basic).id] };
for (const task of ['rules', 'fullCard', 'release']) {
  assert(await fourthBasicBodyAffected('4ed', task, false, basic));
  assert(!(await fourthBasicBodyAffected('4ed', task, true, basic)));
  assert(!(await fourthBasicBodyAffected('4ed', task, false, nonbasic)));
  assert(!(await fourthBasicBodyAffected('3ed', task, false, basic)));
}
for (const task of [
  'references',
  'normalization',
  'frameGeometry',
  'frameColor',
  'manaGeometry',
  'headings',
  'artist',
  'footer',
  'stats',
])
  assert(!(await fourthBasicBodyAffected('4ed', task, false, basic)));
console.log(
  'Fourth basics:1512 native variants,15 exact shared-prototype bodies,363 retained Originals/1134 Oracle-mask controls,15 whole-card gains,no regressions,and scoped data/source reuse pass.',
);
