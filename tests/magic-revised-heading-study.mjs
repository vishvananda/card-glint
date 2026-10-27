import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { revisedManaFitDelta } from '../games/magic/tools/accuracy/revised-mana-fit-ancestry.mjs';
const base = 'games/magic/fixtures/accuracy/3ed-recheck/',
  review = JSON.parse(await readFile(base + 'heading-coarse-review.json')),
  load = async (ref) => {
    const z = await readFile(base + ref.file);
    assert.equal(hash(z), ref.sha256);
    const b = gunzipSync(z);
    assert.equal(hash(b), ref.contentSha256);
    return b;
  },
  study = JSON.parse(await load(review.artifacts.study)),
  definition = JSON.parse(await load(review.artifacts.definition)),
  source = await load(review.artifacts.tool),
  modules = JSON.parse(await load(review.artifacts.modules)),
  poses = JSON.parse(gunzipSync(await readFile(base + 'vertical-interior-normalization.json.gz'))),
  native = JSON.parse(gunzipSync(await readFile(base + 'mana-fit-after.json.gz')));
assert.equal(review.status, 'coarse-native-heading-proposals-not-adopted');
assert.equal(review.rendererHash, (await revisedManaFitDelta()).afterRenderer);
assert.equal(study.rendererHash, review.rendererHash);
assert.equal(study.status, 'native-revised-heading-study-not-adopted');
assert.equal(study.toolHash, hash(source));
for (const [file, h] of Object.entries(study.modules)) assert.equal(hash(modules[file]), h);
assert.deepEqual(study.definition, definition);
assert.deepEqual(study.faults, []);
assert.equal(study.rows.length, 223);
assert.equal(new Set(study.rows.map((r) => r.id)).size, 223);
const expected = Object.values(poses.groups)
  .flatMap((g) => g.rows)
  .filter((r) => r.accepted);
assert.equal(expected.length, 223);
assert.deepEqual(study.rows.map((r) => r.id).sort(), expected.map((r) => r.id).sort());
for (const row of study.rows) {
  const pose = expected.find((p) => p.id === row.id),
    n = native.rows.find((n) => n.id === row.id);
  assert.equal(row.referenceHash, pose.referenceHash);
  assert.equal(row.poseHash, hash(JSON.stringify(pose.transform)));
  assert.equal(row.nativeHash, n.modes.original.sha256);
  assert.equal(row.fullHash, row.nativeHash);
  assert.equal(row.cohort, pose.cohort);
  for (const role of ['title', 'type']) {
    const r = row.roles[role];
    assert.equal(r.baselineParity, 0);
    assert.equal(r.scores.length, definition[role].length);
    assert.equal(r.inverted, row.material !== 'W');
    for (const s of r.scores) {
      assert(Number.isFinite(s.score) && s.score >= -1 && s.score <= 1);
      if (s.score >= 0) assert(Math.abs(s.score - (0.55 * s.edge + 0.45 * s.filled)) < 1e-12);
    }
  }
}
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length,
  close = (a, b) => assert(Math.abs(a - b) < 1e-10);
for (const role of ['title', 'type']) {
  const cal = study.rows.filter((r) => r.cohort === 'calibration'),
    p = review.roles[role],
    objective = (i) => {
      const before = cal.map((r) => r.roles[role].scores[0].score),
        after = cal.map((r) => r.roles[role].scores[i].score);
      return mean(after) - 0.25 * Math.max(0, ...before.map((b, k) => b - after[k]));
    };
  let best = 0;
  for (let i = 1; i < definition[role].length; i++) if (objective(i) > objective(best)) best = i;
  assert.equal(p.selectedIndex, best);
  assert.deepEqual(p.candidate, definition[role][best]);
  close(p.objective, objective(best));
  for (const [key, g] of Object.entries(p.summaries)) {
    const rs = study.rows.filter((r) => key === 'all' || r.cohort === key || r.material === key);
    assert.equal(g.cards, rs.length);
    const before = rs.map((r) => r.roles[role].scores[0].score),
      after = rs.map((r) => r.roles[role].scores[best].score);
    close(g.before100, 100 * mean(before));
    close(g.after100, 100 * mean(after));
    assert.equal(g.gains, after.filter((v, i) => v > before[i]).length);
    assert.equal(g.losses, after.filter((v, i) => v < before[i]).length);
    close(g.worstLoss100, 100 * Math.max(0, ...before.map((b, i) => b - after[i])));
  }
}
assert.equal(review.roles.title.candidate.id, 'current');
assert.equal(review.roles.type.candidate.id, 'xy/-2/4');
assert.equal(review.roles.type.summaries.all.gains, 221);
assert.deepEqual(review.roles.type.losses.map((r) => r.name).sort(), ['Flight', 'Psychic Venom']);
for (const cohort of ['calibration', 'validation']) {
  const g = review.roles.type.summaries[cohort];
  assert(g.after100 > g.before100);
}
console.log(
  'Revised heading study:223 accepted native controls with zero replay error, frozen tool/module versions, calibration-only selection, type improvement and two retained outliers pass. No heading defaults adopted.',
);
