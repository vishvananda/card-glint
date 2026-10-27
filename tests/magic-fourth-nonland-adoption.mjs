import {
  fourthParagraphHistoricalHash,
  preFourthParagraphSource,
} from '../games/magic/tools/accuracy/fourth-paragraph-ancestry.mjs';
// Integrated nonland policy keeps exact source history and scoped score reuse.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import {
  fourthNonlandDelta,
  fourthNonlandHistoricalHash,
  preFourthNonlandSource,
  fourthNonlandAffected,
} from '../games/magic/tools/accuracy/fourth-nonland-ancestry.mjs';
import { validateFourthNonlandData } from '../games/magic/tools/accuracy/fourth-nonland-data-check.mjs';
const p = await fourthNonlandDelta();
assert.equal(await fourthParagraphHistoricalHash(), p.afterRenderer);
assert.equal(await fourthNonlandHistoricalHash(), p.beforeRenderer);
for (const [file, r] of Object.entries(p.files)) {
  const b = await preFourthParagraphSource(file, await fs.readFile(file));
  assert.equal(hash(b), r.after);
  assert.equal(hash(await preFourthNonlandSource(file, b)), r.before);
  const changed = Buffer.concat([b, Buffer.from('\n// unreviewed change\n')]);
  assert.deepEqual(await preFourthNonlandSource(file, changed), changed);
}
const unrelated = Buffer.from('unrelated');
assert.deepEqual(await preFourthNonlandSource('unrelated.ts', unrelated), unrelated);
const tampered = structuredClone(p),
  file = 'games/magic/src/calibration/sets/4ed.ts';
tampered.files[file].afterSource = tampered.files[file].afterSource.replace(
  'maxCharacters: 130',
  'maxCharacters: 131',
);
tampered.files[file].after = hash(tampered.files[file].afterSource);
assert.throws(() => validateFourthNonlandData(tampered));
const native = JSON.parse(gunzipSync(await fs.readFile(p.native.file)));
const review = JSON.parse(
  await fs.readFile('games/magic/fixtures/accuracy/4ed/nonland-body-adoption.json'),
);
const priorReview = JSON.parse(
  await fs.readFile('games/magic/fixtures/accuracy/4ed/nonbasic-body-adoption.json'),
);
const prior = JSON.parse(gunzipSync(await fs.readFile(priorReview.artifacts.scores.file)));
const artifacts = {};
for (const [key, ref] of Object.entries(review.artifacts)) {
  const z = await fs.readFile(ref.file);
  assert.equal(hash(z), ref.sha256);
  const raw = gunzipSync(z);
  assert.equal(hash(raw), ref.contentSha256);
  assert(!/\/home\/|\/Users\/|127\.0\.0\.1/.test(raw.toString()));
  artifacts[key] = key === 'scores' ? JSON.parse(raw) : raw.toString();
}
const s = artifacts.scores;
assert.equal(native.toolHash, hash(artifacts.nativeTool));
assert.equal(s.toolHash, hash(artifacts.scoreTool));
assert.equal(s.nonlandNativeProofHash, p.native.contentSha256);
assert.equal(s.rendererHash, p.afterRenderer);
assert.deepEqual(s.metricGraph, prior.metricGraph);
assert.deepEqual(s.policyGraph, prior.policyGraph);
assert.deepEqual(s.reuse, { reused: 341, fresh: 37 });
assert.deepEqual(review.wholeCard, s.summary.all);
assert(s.summary.all.current100 > s.summary.all.before100);
assert.deepEqual(review.nativeCounts, native.counts);
for (const r of s.rows) {
  const n = native.rows.find((v) => v.id === r.id),
    old = prior.rows.find((v) => v.id === r.id);
  assert.equal(r.scoreReused, !n.scoped);
  assert.equal(r.beforeNativeHash, old.nativeHash);
  assert.equal(r.beforeNativeHash, n.modes.original.before);
  assert.equal(r.nativeHash, n.modes.original.after);
  assert.equal(r.inputHash, old.inputHash);
  assert.equal(r.referenceHash, old.referenceHash);
  assert.equal(r.poseHash, old.poseHash);
  assert.equal(r.regionPlanHash, old.regionPlanHash);
  assert.equal(r.aggregateEligible, old.aggregateEligible);
  if (!n.scoped) assert.deepEqual(r.score, old.score);
}
const yes = { printingIds: p.ids },
  no = { printingIds: [native.rows.find((r) => !r.scoped).id] };
for (const task of ['rules', 'fullCard', 'release']) {
  assert(await fourthNonlandAffected('4ED', task, false, yes));
  assert(!(await fourthNonlandAffected('4ed', task, false, no)));
  assert(!(await fourthNonlandAffected('4ed', task, true, yes)));
  assert(!(await fourthNonlandAffected('3ed', task, false, yes)));
}
for (const task of [
  'normalization',
  'references',
  'frameGeometry',
  'frameColor',
  'manaGeometry',
  'manaColor',
  'headings',
  'artist',
  'footer',
  'stats',
  'setSymbol',
])
  assert(!(await fourthNonlandAffected('4ed', task, false, yes)));
assert.equal(review.status, 'nonland-body-integrated-full-set-audit-open');
assert(review.limitations.some((s) => s.includes('Gloom')));
console.log(
  'Fourth nonlands:37 exact prototype bodies,1512 scoped native variants,488 Dark controls,strict source ancestry and341 score reuses pass.',
);
