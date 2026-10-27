// A rejected search remains reproducible and cannot count as set approval.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { fourthNonbasicDelta } from '../games/magic/tools/accuracy/fourth-nonbasic-ancestry.mjs';
import { fourthBasicBodyDelta } from '../games/magic/tools/accuracy/fourth-basic-body-ancestry.mjs';
const review = JSON.parse(
    await fs.readFile('games/magic/fixtures/accuracy/4ed/nonland-text-review.json'),
  ),
  p = await fourthNonbasicDelta(),
  basic = await fourthBasicBodyDelta(),
  native = JSON.parse(gunzipSync(await fs.readFile(p.native.file)));
const z = await fs.readFile(review.artifact.file),
  raw = gunzipSync(z),
  study = JSON.parse(raw);
assert.equal(hash(z), review.artifact.sha256);
assert.equal(hash(raw), review.artifact.contentSha256);
// The CLI now supports new request studies. Preserve the exact original
// implementation for this immutable rejected trial instead of rewriting it.
const historicalTool = await fs.readFile(
  'games/magic/fixtures/accuracy/4ed/nonland-study-original-tool.mjs.gz',
);
assert.equal(
  hash(historicalTool),
  '74f174846bc0444ef92a48dafbafa78a816d3950132a3a84ce351341a5a88af1',
);
assert.equal(hash(gunzipSync(historicalTool)), review.tool.sha256);
assert.equal(study.toolHash, review.tool.sha256);
assert(!/\/home\/|\/Users\/|127\.0\.0\.1/.test(raw.toString()));
assert.equal(review.status, 'rejected-shared-nonland-policy');
assert.equal(study.status, 'complete-exploratory');
assert.equal(study.rendererHash, p.afterRenderer);
assert.equal(study.inputHash, native.inputHash);
assert.equal(study.baselineHash, native.sources.after);
const lands = new Set([...p.ids, ...basic.ids]),
  ids = native.rows
    .filter((r) => !lands.has(r.id))
    .map((r) => r.id)
    .sort();
assert.equal(ids.length, 360);
assert.deepEqual(study.rows.map((r) => r.id).sort(), ids);
assert.deepEqual(review.classification.map((r) => r.id).sort(), ids);
for (const r of study.rows) {
  const n = native.rows.find((n) => n.id === r.id),
    c = review.classification.find((c) => c.id === r.id);
  assert.equal(r.referenceHash, n.referenceHash);
  assert.equal(r.baselineHash, n.modes.original.after);
  assert.equal(c.faceHash, n.afterInputHash);
  assert.equal(r.replayDifference, 0);
  assert.equal(r.trials.length, 2);
  assert.equal(r.trials[0].candidate.id, 'current');
  assert.equal(r.trials[1].candidate.id, 'shared-class-policy');
  for (const t of r.trials) {
    if (t.invalid) {
      assert(t.reason.includes('overflows'));
      continue;
    }
    assert.equal(t.outside, 0);
    assert.equal(t.alpha, 0);
    assert(t.metric.score >= 0 && t.metric.score <= 1);
    assert(t.metric.filled >= 0 && t.metric.filled <= 1);
  }
  if (!r.trials[1].invalid) {
    assert.match(r.candidateHash, /^[a-f0-9]{64}$/);
    if (r.trials[1].selectedClass.startsWith('retain-'))
      assert.equal(r.candidateHash, r.baselineHash);
  }
}
const valid = study.rows.filter((r) => !r.trials[1].invalid),
  mean = (a) => a.reduce((n, v) => n + v, 0) / a.length;
assert.equal(valid.length, 358);
assert.equal(review.summary.invalidCandidates, 2);
assert.equal(review.summary.before100, mean(valid.map((r) => 100 * r.trials[0].metric.score)));
assert.equal(review.summary.candidate100, mean(valid.map((r) => 100 * r.trials[1].metric.score)));
assert(review.summary.candidate100 < review.summary.before100);
assert.equal(review.summary.improved, 56);
assert.equal(review.summary.regressed, 82);
assert.equal(review.summary.unchanged, 220);
assert.deepEqual(review.invalid.map((r) => r.name).sort(), ['Bronze Tablet', 'Tempest Efreet']);
for (const slice of review.exploratorySlices) {
  const selected = study.rows.filter((r) => {
    const c = review.classification.find((c) => c.id === r.id),
      b = r.trials[0],
      a = r.trials[1];
    return (
      c.roles.length === 1 &&
      c.roles[0] === 'rules' &&
      ((a.selectedClass === 'compact' && b.layout.size >= 17.5 && b.layout.size < 21.75) ||
        (a.selectedClass === 'large' && c.characters <= slice.maxCharacters))
    );
  });
  assert.deepEqual(selected.map((r) => r.id).sort(), slice.ids);
  assert.equal(slice.selected, selected.length);
  assert.equal(slice.invalid, 0);
}
console.log(
  'Fourth nonland search:360 exact native baselines,358 isolated candidates,2 disclosed overflows,and rejected broad policy remain separate from renderer approval.',
);
