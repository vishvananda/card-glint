import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
const base = 'games/magic/fixtures/accuracy/3ed-recheck/';
const bytes = async (name) => gunzipSync(await fs.readFile(base + name + '.json.gz'));
const review = JSON.parse(await fs.readFile(base + 'footer-proposal-review.json'));
const coarse = JSON.parse(await bytes('footer-coarse-study')),
  fine = JSON.parse(await bytes('footer-fine-study')),
  definitionBytes = await bytes('footer-fine-definition'),
  definition = JSON.parse(definitionBytes),
  poses = JSON.parse(await bytes('vertical-interior-normalization')),
  native = JSON.parse(await bytes('body-request-native'));
assert.equal(review.status, 'footer-geometry-proposal-not-adopted');
for (const [file, expected] of Object.entries(review.artifacts))
  assert.equal(hash(gunzipSync(await fs.readFile(base + file))), expected, file);
assert.equal(fine.source.posesHash, hash(await bytes('vertical-interior-normalization')));
assert.equal(fine.source.definitionHash, hash(definitionBytes));
assert.deepEqual(fine.definition, definition);
assert.equal(
  fine.source.toolHash,
  hash(await fs.readFile('games/magic/tools/accuracy/revised-footer-native-study.mjs')),
);
for (const [file, expected] of Object.entries(fine.source.kernels))
  assert.equal(hash(await fs.readFile('games/magic/tools/accuracy/' + file)), expected, file);
assert.equal(fine.source.rendererHash, native.rendererHash);
assert.equal(fine.source.nativeCaptureHash, hash(await bytes('body-request-native')));
assert.equal(review.rendererHash, native.rendererHash);
assert.equal(fine.source.inputHash, hash(await bytes('corrected-original-inputs')));
assert.deepEqual(coarse.source.proof, fine.source.proof);
const eligible = Object.values(poses.groups)
  .flatMap((g) => g.rows)
  .filter((r) => r.accepted);
assert.deepEqual(fine.rows.map((r) => r.id).sort(), eligible.map((r) => r.id).sort());
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
let repeated = 0,
  regions = 0;
for (const r of fine.rows) {
  const p = eligible.find((p) => p.id === r.id),
    c = coarse.rows.find((c) => c.id === r.id),
    n = native.rows.find((n) => n.id === r.id);
  assert.equal(r.nativeHash, n.modes.original.sha256);
  assert.equal(r.referenceHash, p.referenceHash);
  assert.equal(r.poseHash, hash(JSON.stringify(p.transform)));
  for (const key of ['referenceHash', 'poseHash', 'nativeHash', 'cohort', 'material'])
    assert.deepEqual(r[key], c[key]);
  for (const [role, data] of Object.entries(r.roles)) {
    regions++;
    assert(data.parity <= 1.001);
    assert.equal(data.scores.length, definition[role].length);
    for (const [i, proposal] of definition[role].entries()) {
      const previous = coarse.candidates.findIndex((p) => p.id === proposal.id);
      if (previous >= 0) {
        assert.deepEqual(data.scores[i], c.roles[role].scores[previous]);
        repeated++;
      }
    }
    assert(data.tone.support >= 0 && data.tone.outside <= data.tone.support);
    assert.deepEqual(
      data.tone.geometry,
      definition[role].find((p) => p.id === definition.selection[role]),
    );
    if (data.tone.support)
      assert(
        data.tone.q10 <= data.tone.q25 &&
          data.tone.q25 <= data.tone.median &&
          data.tone.median <= data.tone.q75 &&
          data.tone.q75 <= data.tone.q90,
      );
  }
}
assert.equal(regions, 302);
assert.equal(repeated, review.reproducedCandidateScores);
for (const role of ['artist', 'stats']) {
  const rr = fine.rows.filter((r) => r.roles[role]),
    cal = rr.filter((r) => r.cohort === 'calibration'),
    val = rr.filter((r) => r.cohort === 'validation');
  const ranking = definition[role]
    .map((candidate, index) => ({
      candidate,
      index,
      calibration: mean(cal.map((r) => r.roles[role].scores[index].score)),
      validation: mean(val.map((r) => r.roles[role].scores[index].score)),
    }))
    .sort((a, b) => b.calibration - a.calibration);
  assert.deepEqual(fine.rank[role].candidates, ranking);
  assert.deepEqual(review.roles[role].selected, ranking[0].candidate);
  const i = ranking[0].index;
  for (const [cohort, rows] of [
    ['all', rr],
    ['calibration', cal],
    ['validation', val],
  ]) {
    const s = review.roles[role][cohort];
    assert.equal(s.cards, rows.length);
    assert.equal(s.before100, 100 * mean(rows.map((r) => r.roles[role].scores[0].score)));
    assert.equal(s.after100, 100 * mean(rows.map((r) => r.roles[role].scores[i].score)));
  }
  assert(review.roles[role].calibration.after100 > review.roles[role].calibration.before100);
  assert(review.roles[role].validation.after100 > review.roles[role].validation.before100);
  assert(
    review.roles[role].worst.some((r) => r.delta100 < 0),
    'Retain individual regressions',
  );
}
assert.deepEqual(review.roles.artist.selected, {
  id: '-2/0.5/0/1.02',
  dx: -2,
  dy: 0.5,
  sizeDelta: 0,
  width: 1.02,
});
assert.deepEqual(review.roles.stats.selected, {
  id: '-0.5/0.5/0/1',
  dx: -0.5,
  dy: 0.5,
  sizeDelta: 0,
  width: 1,
});
assert.equal(review.pigment.status, 'diagnostic-not-adopted');
console.log(
  'Revised footer study:223 exact native controls,302 default region replays,calibration-only ranking,shared geometry gains and explicit regressions; tone and runtime adoption remain pending.',
);

const artistState = JSON.parse(await bytes('footer-artist-state'));
assert.equal(artistState.length, 2);
for (const row of artistState) {
  assert.equal(row.records.length, 2);
  for (const draw of row.records) {
    assert.equal(draw.text, 'Illus. © Douglas Shuler');
    assert.equal(draw.naturalWidth, 226);
    assert.equal(draw.font, '22px "CardRenderer MTG MPlantin", Georgia');
  }
}
assert.deepEqual(artistState[0].records, artistState[1].records);
