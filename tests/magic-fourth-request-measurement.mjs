import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { wallWordingDelta } from '../games/magic/tools/accuracy/wall-wording-data.mjs';
const root = 'games/magic/fixtures/accuracy/4ed/';
const rawReview = await fs.readFile(root + 'native-request-review.json');
assert.equal(hash(rawReview), 'efdd30632ea9df98235f59e3dd64e820469e3bc942794bf409e0e81826f38902');
const review = JSON.parse(rawReview),
  data = {};
assert.equal(review.status, 'measurement-only-no-production-change');
assert.deepEqual(review.coverage, {
  ordinaryPrintings: 378,
  nonlandPrintings: 360,
  excludedLands: 18,
  nativeBaselineReplays: 720,
  sharedPolicies: 9,
  printedRowTargets: 6,
  holdout: false,
});
for (const [name, ref] of Object.entries(review.artifacts)) {
  const z = await fs.readFile(ref.file);
  assert.equal(hash(z), ref.sha256);
  const raw = name.endsWith('.gz') ? gunzipSync(z) : z;
  assert.equal(hash(raw), ref.contentSha256);
  assert(!/\/home\/vishvananda|\/Users\//.test(raw.toString()));
  data[name] = name.endsWith('.mjs.gz') ? raw.toString() : JSON.parse(raw);
}
const wall = await wallWordingDelta();
assert.equal(review.rendererHash, wall.afterRenderer);
const native = JSON.parse(gunzipSync(await fs.readFile(wall.native.file))).sets['4ed'];
const scores = JSON.parse(
  gunzipSync(
    await fs.readFile(
      'games/magic/fixtures/accuracy/early-through-fourth/wall-wording-4ed-scores.json.gz',
    ),
  ),
);
const expectedIds = scores.rows
  .filter((r) => r.material !== 'L')
  .map((r) => r.id)
  .sort();
const tools = data['native-request-objective-sources.json.gz'];
assert.deepEqual(Object.keys(tools).sort(), [
  'abu-type-objective.mjs',
  'browser.mjs',
  'edges.mjs',
  'pixels-pure.mjs',
  'scan-transform.mjs',
  'text-filled-objective.mjs',
]);
for (const mode of ['unconstrained', 'budget']) {
  const study = data['native-request-' + mode + '-study.json.gz'];
  const report = data['native-request-' + mode + '-report.json'];
  const definition = data['native-request-' + mode + '-definition.json'];
  const tool = data['native-request-' + mode + '-tool.mjs.gz'];
  assert.equal(study.status, 'complete-exploratory');
  assert.equal(study.rendererHash, wall.afterRenderer);
  assert.equal(study.toolHash, hash(tool));
  assert.deepEqual(study.requestStudy, definition);
  assert.equal(
    report.sources.study,
    review.artifacts['native-request-' + mode + '-study.json.gz'].contentSha256,
  );
  assert.equal(
    report.sources.printedRows,
    review.artifacts['printed-row-targets.json'].contentSha256,
  );
  assert.equal(report.toolHash, hash(data['native-request-report-tool.mjs.gz']));
  assert.equal(report.rowToolHash, hash(data['native-request-row-tool.mjs.gz']));
  assert.deepEqual(study.rows.map((r) => r.id).sort(), expectedIds);
  assert.deepEqual(review.comparisons[mode].summary, report.candidates[report.comparisonCandidate]);
  for (const r of study.rows) {
    const n = native.rows.find((n) => n.id === r.id),
      score = scores.rows.find((s) => s.id === r.id);
    assert.equal(r.baselineHash, n.modes.original.after);
    assert.equal(r.referenceHash, n.referenceHash);
    assert.equal(hash(JSON.stringify(r.pose)), score.poseHash);
    assert.equal(r.replayDifference, 0);
    const current = r.trials[0];
    for (const t of r.trials) {
      if (t.invalid) {
        assert(t.outside > 0 || t.reason === 'fixed class overflows the rules panel');
        continue;
      }
      assert.equal(t.outside, 0);
      assert.equal(t.alpha, 0);
      assert(t.metric.score >= 0 && t.metric.score <= 1);
      if (mode === 'budget') {
        assert(t.layout.size <= current.layout.size + 1e-8);
        assert(t.layout.size >= current.layout.size - 0.5 - 1e-8);
        assert(t.layout.lines.length <= current.layout.lines.length);
      }
    }
  }
  const selected = report.candidates[report.comparisonCandidate].all;
  const pairs = study.rows.map((r) => {
    const t = r.trials.find((t) => t.candidate.id === report.comparisonCandidate);
    assert(!t.invalid);
    return [r.trials[0].metric.score, t.metric.score];
  });
  assert.equal(pairs.length, 360);
  const average = (i) => (100 * pairs.reduce((n, p) => n + p[i], 0)) / pairs.length;
  assert(Math.abs(average(0) - selected.before100) < 1e-9);
  assert(Math.abs(average(1) - selected.current100) < 1e-9);
  assert.equal(report.rowChecks.length, 6 * definition.candidates.length);
}
const rawBird = data['native-request-unconstrained-study.json.gz'].rows.find(
  (r) => r.name === 'Bird Maiden',
);
const boundedBird = data['native-request-budget-study.json.gz'].rows.find(
  (r) => r.name === 'Bird Maiden',
);
assert.equal(rawBird.trials[0].layout.lines.length, 6);
assert.equal(
  rawBird.trials.find((t) => t.candidate.id === 'fractional-center-0').layout.lines.length,
  8,
);
assert.equal(
  boundedBird.trials.find((t) => t.candidate.id === 'fractional-budget-center').layout.lines.length,
  6,
);
for (const mode of ['unconstrained', 'budget']) {
  const report = data['native-request-' + mode + '-report.json'];
  const old = report.rowChecks.find((r) => r.name === 'Hill Giant' && r.candidate === 'current');
  const changed = report.rowChecks.find(
    (r) => r.name === 'Hill Giant' && r.candidate === report.comparisonCandidate,
  );
  assert.equal(old.rows.exact, true);
  assert.equal(changed.rows.exact, false);
  assert.equal(old.rows.referenceRows, changed.rows.renderedRows);
  assert(changed.overlap100 > old.overlap100);
  const scathe = report.rowChecks.find(
    (r) => r.name === 'Scathe Zombies' && r.candidate === report.comparisonCandidate,
  );
  assert.equal(scathe.rows.exact, true);
}
console.log(
  'Fourth:720 exact native baselines,shared metric/placement and bounded-row studies;all360 source/pose joins,content-aware printed-row counterexamples and retained regressions pass.',
);
