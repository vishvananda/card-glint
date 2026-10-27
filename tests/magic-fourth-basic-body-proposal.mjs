import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
const file = 'games/magic/fixtures/accuracy/4ed/basic-body-proposal.json',
  proposal = JSON.parse(await fs.readFile(file)),
  z = await fs.readFile(proposal.evidence.file);
assert.equal(hash(z), proposal.evidence.sha256);
const raw = gunzipSync(z);
assert.equal(hash(raw), proposal.evidence.contentSha256);
assert(!/\/home\/|\/Users\/|127\.0\.0\.1/.test(raw.toString()));
const evidence = JSON.parse(raw),
  baseline = JSON.parse(
    gunzipSync(
      await fs.readFile(
        'games/magic/fixtures/accuracy/early-through-fourth/later-native-baselines.json.gz',
      ),
    ),
  ).sets['4ed'];
assert.equal(proposal.status, 'candidate-not-adopted');
assert.equal(evidence.status, 'exploratory-not-adopted');
assert.equal(proposal.rows.length, 15);
assert.equal(new Set(proposal.rows.map((r) => r.name)).size, 5);
assert.equal(proposal.landWordingCensus.length, 18);
assert.deepEqual(
  proposal.landWordingCensus.filter((r) => !r.wordingMatches).map((r) => r.name),
  ["Mishra's Factory"],
);
for (const r of proposal.landWordingCensus) {
  const b = baseline.rows.find((b) => b.id === r.id);
  assert(b);
  assert.equal(b.referenceHash, r.referenceHash);
  if (r.name === "Mishra's Factory") {
    assert(r.providerRules.includes('Add 1 colorless'));
    assert(r.providerRules.includes('\n{1}:'));
    assert(r.observedRules.includes('Add one colorless'));
    assert(r.observedRules.includes('\n{1}:'));
    assert.equal(r.observedRules, r.providerRules.replace('Add 1 colorless', 'Add one colorless'));
  }
}
for (const r of proposal.rows) {
  const b = baseline.rows.find((b) => b.id === r.id),
    s = evidence.studies.refined.rows.find((s) => s.id === r.id);
  assert.equal(r.referenceHash, b.referenceHash);
  assert.equal(r.baselineHash, b.nativeHash);
  assert.equal(hash(JSON.stringify(s.pose)), b.poseHash);
  assert.equal(r.poseHash, b.poseHash);
  assert.equal(r.replayDifference, 0);
  assert.equal(s.replayDifference, 0);
  assert.equal(s.baselineHash, b.nativeHash);
  assert.equal(s.trials.length, 76);
  assert.equal(s.basic, true);
  const current = s.trials.find((t) => t.candidate.id === 'current'),
    selected = s.trials.find((t) => t.candidate.id === proposal.selectedCandidate);
  assert.deepEqual(r.before, current.metric);
  assert.deepEqual(r.candidate, selected.metric);
  assert.deepEqual(r.layout, selected.layout);
  assert(r.candidate.score > r.before.score);
  assert.equal(selected.layout.size, 25);
  assert.equal(selected.layout.lines.length, 1);
  assert.equal(selected.candidate.textWidth, 1.01);
  assert.equal(selected.candidate.centerOffset, -12.5);
}
const mean = (a) => a.reduce((a, b) => a + b, 0) / a.length;
assert(
  Math.abs(mean(proposal.rows.map((r) => r.before.score)) * 100 - proposal.summary.before100) <
    1e-10,
);
assert(
  Math.abs(
    mean(proposal.rows.map((r) => r.candidate.score)) * 100 - proposal.summary.candidate100,
  ) < 1e-10,
);
assert.equal(proposal.summary.improved, 15);
assert.equal(proposal.summary.regressed, 0);
assert.equal(proposal.tapReview.decision, 'keep-current-polarity');
assert(proposal.tapReview.current100 > proposal.tapReview.inverted100);
for (const r of proposal.tapReview.rows) {
  const s = evidence.studies.tapPolarity.rows.find((s) => s.id === r.id);
  assert(s);
  assert.equal(r.current, s.trials.find((t) => t.candidate.id === 'aligned-current').metric.score);
  assert.equal(
    r.inverted,
    s.trials.find((t) => t.candidate.id === 'aligned-positive').metric.score,
  );
}
console.log(
  'Fourth land study retains18 source panels,15 exact native controls,one shared body proposal improving all15 basics,and an explicitly rejected tap-polarity change;no defaults or set approval changed.',
);
