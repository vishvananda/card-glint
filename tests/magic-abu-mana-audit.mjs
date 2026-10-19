import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import {
  verifyManaStudyControls,
  manaStudySummary,
} from '../games/magic/tools/accuracy/mana-study-validation.mjs';
const root = 'games/magic/fixtures/accuracy/abu-mana-recheck/';
const review = JSON.parse(await readFile(root + 'study-review.json'));
const archives = new Map();
for (const [file, expected] of Object.entries(review.files)) {
  const bytes = await readFile(root + file),
    raw = gunzipSync(bytes);
  assert.equal(hash(bytes), expected.sha256, file);
  assert.equal(hash(raw), expected.uncompressedSha256, file);
  archives.set(file, JSON.parse(raw));
}
const load = async (set, kind) =>
  JSON.parse(
    gunzipSync(await readFile(`games/magic/fixtures/accuracy/abu-054/${set}-${kind}.json.gz`)),
  );
for (const [set, total] of [
  ['lea', 295],
  ['leb', 302],
]) {
  const inputs = await load(set, 'inputs'),
    poses = await load(set, 'normalization');
  const native = new Map((await load(set, 'native-replay')).rows.map((r) => [r.id, r]));
  const byId = new Map(inputs.entries.map((e) => [e.id, e]));
  for (const kind of ['global', 'axes', 'glyphs']) {
    const study = archives.get(`${set}-${kind}.json.gz`);
    assert.equal(study.rows.length, 54);
    verifyManaStudyControls(study, inputs.entries);
    for (const row of study.rows) {
      assert.equal(row.nativeHash, native.get(row.id).after);
      assert.equal(row.referenceHash, byId.get(row.id).reference.sha256);
      assert.equal(row.poseHash, hash(JSON.stringify(poses.rows.find((p) => p.id === row.id))));
    }
    if (kind !== 'glyphs')
      assert.deepEqual(manaStudySummary(study, inputs.entries), review.sets[set][kind]);
    else {
      assert.deepEqual(
        manaStudySummary(study, inputs.entries, { numerals: true }),
        review.sets[set].numerals,
      );
      const broken = structuredClone(study),
        row = broken.rows.find((r) => byId.get(r.id).face.manaSymbols.some((s) => /^\d+$/.test(s)));
      row.effects.fill(0);
      assert.throws(() => verifyManaStudyControls(broken, inputs.entries), /no pixel changes/);
      const missing = structuredClone(study),
        n = missing.rows.find((r) => byId.get(r.id).face.manaSymbols.some((s) => /^\d+$/.test(s)));
      delete n.candidateParities.number;
      assert.throws(
        () => verifyManaStudyControls(missing, inputs.entries),
        /full-native trial parity/,
      );
    }
  }
  const headers = archives.get('headers.json.gz').rows.filter((r) => r.set === set);
  assert.equal(headers.length, total);
  assert.deepEqual(headers.map((r) => r.id).sort(), inputs.entries.map((e) => e.id).sort());
  for (const row of headers) {
    assert.deepEqual(row.before, byId.get(row.id).face.manaSymbols);
    assert.equal(row.referenceHash, byId.get(row.id).reference.sha256);
  }
  const summaries = review.sets[set];
  assert.ok(
    [
      summaries.global,
      summaries.axes,
      ...Object.values(summaries.glyphs),
      summaries.numerals,
    ].every((s) => s.qualifies === false),
  );
}
const white = archives.get('lea-all-white.json.gz'),
  whiteInputs = archives.get('lea-all-white-inputs.json.gz');
assert.equal(white.rows.length, 45);
assert.deepEqual(
  manaStudySummary(white, whiteInputs.entries, { symbol: 'W' }),
  review.sets.lea.glyphs.W,
);
assert.equal(review.minimumGain, 0.003);
const nativeReview = JSON.parse(await readFile(root + 'native-review.json'));
const nativeFiles = new Map();
for (const [file, expected] of Object.entries(nativeReview.files)) {
  const bytes = await readFile(root + file),
    raw = gunzipSync(bytes);
  assert.equal(hash(bytes), expected.sha256, file);
  assert.equal(hash(raw), expected.uncompressedSha256, file);
  nativeFiles.set(file, JSON.parse(raw));
}
for (const [set, total, changed] of [
  ['lea', 295, 3],
  ['leb', 302, 0],
]) {
  const replay = nativeFiles.get(`${set}-native.json.gz`);
  const old = new Map((await load(set, 'native-replay')).rows.map((r) => [r.id, r]));
  assert.equal(replay.complete, true);
  assert.equal(replay.rendererHash, nativeReview.rendererHash);
  assert.equal(replay.rows.length, total);
  assert.equal(replay.rows.filter((r) => r.changedPixels).length, changed);
  for (const r of replay.rows) {
    assert.equal(r.before, old.get(r.id).after, 'Parent is the actual published 0.5.4 raster');
    assert.equal(r.outside, 0);
    assert.equal(r.silhouette, 0);
    assert.equal(r.artworkChanged, 0);
    if (set === 'leb') assert.equal(r.after, r.before);
  }
}
const corrected = nativeFiles.get('lea-inputs.json.gz');
const previous = new Map((await load('lea', 'inputs')).entries.map((e) => [e.id, e]));
for (const entry of corrected.entries) {
  const old = previous.get(entry.id);
  assert.equal(entry.reference.sha256, old.reference.sha256);
  assert.deepEqual(
    { ...entry.face, manaSymbols: old.face.manaSymbols },
    old.face,
    'Only original cost changes',
  );
}
console.log(
  'ABU mana audit: active controls, full-native trial parity, frozen scans, independent dimensions and exhaustive cost coverage pass.',
);
