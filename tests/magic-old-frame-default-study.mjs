// Frozen development experiments do not certify or change production profiles.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
const read = async (ref) => {
  const z = await fs.readFile(ref.file);
  assert.equal(hash(z), ref.sha256);
  const raw = gunzipSync(z);
  assert.equal(hash(raw), ref.contentSha256);
  assert(!/\/home\/|\/Users\/|127\.0\.0\.1/.test(raw.toString()));
  return raw;
};
const review = JSON.parse(
  await fs.readFile('games/magic/fixtures/accuracy/old-frame-defaults/review.json'),
);
assert.equal(review.status, 'development-default-comparison-no-production-adoption');
assert.equal(review.decision.productionChanges, false);
const raw = {};
for (const [k, v] of Object.entries(review.artifacts)) raw[k] = await read(v);
const numerical = JSON.parse(raw.numericalSources),
  isolation = JSON.parse(raw.frameIsolation),
  viewer = JSON.parse(raw.viewerCheck);
assert.equal(viewer.status, 'passed');
assert.deepEqual(viewer.pageErrors, []);
assert.equal(isolation.rows.length, 110);
const types = JSON.parse(
  await fs.readFile('games/magic/fixtures/accuracy/old-frame-defaults/pilot-type-reviews.json'),
).rows;
assert.equal(types.length, 110);
assert.equal(types.filter((r) => r.changed).length, 51);
const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length,
  close = (a, b) => assert(Math.abs(a - b) < 1e-10);
let cards = 0,
  ranked = 0;
for (const entry of review.sets) {
  const inputsRaw = await read(entry.artifacts.inputs),
    nativeRaw = await read(entry.artifacts.native),
    studyRaw = await read(entry.artifacts.study);
  const inputs = JSON.parse(inputsRaw),
    native = JSON.parse(nativeRaw),
    study = JSON.parse(studyRaw);
  assert.equal(inputs.status, 'development-pilot-not-full-set');
  assert.equal(native.status, 'complete');
  assert.equal(study.status, 'complete-exploratory');
  assert.equal(native.toolHash, hash(raw['printing-native-replay']));
  assert.equal(study.toolHash, hash(raw['old-frame-default-study']));
  assert.equal(study.hooksHash, hash(raw['old-frame-default-hooks']));
  assert.equal(study.inputHash, hash(inputsRaw));
  assert.equal(native.inputHash, hash(inputsRaw));
  assert.equal(study.baselineHash, hash(nativeRaw));
  assert.equal(study.rendererHash, review.rendererHash);
  assert.equal(native.rendererHash, review.rendererHash);
  assert.equal(study.rows.length, entry.cards);
  assert.equal(native.rows.length, entry.cards);
  assert.deepEqual(study.summary, entry.summary);
  assert.deepEqual(study.alignment, entry.alignment);
  for (const [key, prefix] of [
    ['registrationGraph', 'registration'],
    ['metricGraph', 'metric'],
    ['policyGraph', 'policy'],
  ]) {
    const g = study[key];
    assert.equal(g.hash, hash(JSON.stringify({ node: g.node, sources: g.sources })));
    for (const [file, expected] of g.sources)
      assert.equal(hash(numerical[prefix + '/' + file]), expected);
  }
  for (const r of study.rows) {
    const e = inputs.entries.find((e) => e.id === r.id),
      n = native.rows.find((n) => n.id === r.id),
      t = types.find((t) => t.id === r.id),
      i = isolation.rows.find((i) => i.id === r.id);
    assert(e && n && t && i);
    assert.equal(e.face.wordingMode, 'original');
    assert.equal(e.face.symbolStyle, 'original');
    assert(e.card.finishes.includes('nonfoil'));
    assert.equal(e.card.lang, 'en');
    assert.equal(e.card.layout, 'normal');
    assert.equal(r.referenceHash, e.reference.sha256);
    assert.equal(r.artHash, e.art.sha256);
    assert.equal(r.inputHash, hash(JSON.stringify(e.face)));
    assert.equal(n.modes.original.inputHash, r.inputHash);
    assert.equal(r.modes.current.sha256, n.modes.original.sha256);
    assert.deepEqual(r.modes.current.frame, r.modes['fourth-layout'].frame);
    assert.equal(i.currentHash, r.modes.current.sha256);
    assert.equal(i.layoutHash, r.modes['fourth-layout'].sha256);
    assert.deepEqual(i.changedPixels, { leftFrame: 0, rightFrame: 0, artInterior: 0 });
    assert.equal(t.referenceHash, r.referenceHash);
    assert.equal(t.typeLine, e.face.typeLine);
    assert.equal(r.typeLine, t.typeLine);
    assert(t.reviewed);
    assert.equal(r.ranked, r.pose.accepted);
    if (r.ranked) assert(r.pose.transform);
    for (const c of Object.values(r.modes)) {
      assert(Number.isFinite(c.score.structuralScore));
      assert(!(c.layout?.overflow ?? false));
    }
    if (r.modes['fourth-frame-layout'].frameDonorAvailable === false)
      assert.deepEqual(r.modes['fourth-frame-layout'].frame, r.modes.current.frame);
  }
  const accepted = study.rows.filter((r) => r.ranked);
  assert.equal(accepted.length, entry.alignment.accepted);
  assert.equal(study.rows.length - accepted.length, entry.alignment.rejected);
  for (const [mode, summary] of Object.entries(study.summary)) {
    close(summary.whole100, 100 * mean(accepted.map((r) => r.modes[mode].score.structuralScore)));
    assert.equal(
      summary.improved,
      accepted.filter(
        (r) => r.modes[mode].score.structuralScore > r.modes.current.score.structuralScore,
      ).length,
    );
    assert.equal(
      summary.regressed,
      accepted.filter(
        (r) => r.modes[mode].score.structuralScore < r.modes.current.score.structuralScore,
      ).length,
    );
  }
  const delta = study.summary['fourth-frame-layout'].whole100 - study.summary.current.whole100;
  assert(entry.set === 'ice' ? delta > 0 : delta < 0);
  cards += study.rows.length;
  ranked += accepted.length;
}
assert.equal(cards, 110);
assert.equal(ranked, 69);
const proposal = JSON.parse(
  await fs.readFile('games/magic/fixtures/accuracy/4ed/semantic-details-proposal.json'),
);
assert.equal(proposal.status, 'measured-proposal-not-integrated');
const p = {};
for (const [k, r] of Object.entries(proposal.artifacts)) p[k] = await read(r);
const study = JSON.parse(p.study),
  scores = JSON.parse(p.scores);
assert.equal(study.toolHash, hash(p.studyTool));
assert.equal(scores.toolHash, hash(p.scoreTool));
assert.equal(scores.sources.study, hash(p.study));
assert.equal(study.rendererHash, review.rendererHash);
assert.equal(study.rows.length, 378);
assert.deepEqual(study.summary, { cards: 378, changed: 7, unchanged: 371 });
assert.deepEqual(proposal.summary, scores.summary);
assert.equal(scores.summary.improved, 7);
assert.equal(scores.summary.regressed, 0);
for (const r of study.rows) {
  const s = scores.rows.find((s) => s.id === r.id);
  assert(s);
  assert.equal(s.beforeNativeHash, r.before);
  assert.equal(s.nativeHash, r.after);
  assert.equal(s.poseHash, r.poseHash);
  assert.equal(s.referenceHash, r.referenceHash);
  assert.equal(s.inputHash, r.inputHash);
  assert.equal(r.changed, r.before !== r.after);
  if (!r.changed) assert.deepEqual(s.score, s.beforeScore);
  else {
    assert(s.delta100 > 0);
    assert(r.afterDetails);
    assert.equal(r.beforeDetails, null);
  }
}
console.log(
  'Old-frame pilot:110 exact native controls,330 exploratory faces,51 scan-checked type changes,69 frozen accepted poses,41 explicit rejections,frame/art isolation and seven measured Fourth semantic proposals pass. No production adoption.',
);
