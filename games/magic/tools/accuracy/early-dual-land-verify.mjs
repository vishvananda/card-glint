// Native verification of one shared geometry across the ten Unlimited duals.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
import { nativeFrameProfiles } from './frame-native-profiles.mjs';
import { scoreOpaqueFamily } from './frame-family-score.mjs';
const [nativeDirectory, searchDirectory, trialDirectory, output] = process.argv.slice(2);
assert(output, 'Usage: early-dual-land-verify.mjs NATIVE_CAPTURE SEARCH TRIAL_CAPTURE OUTPUT');
const read = async (file) => {
  const bytes = await readFile(file);
  return { data: JSON.parse(bytes), hash: hash(bytes) };
};
const native = await read(path.join(nativeDirectory, 'capture.json')),
  input = await read(path.join(nativeDirectory, 'inputs.json')),
  search = await read(path.join(searchDirectory, 'search.json')),
  definition = await read(path.join(searchDirectory, 'definition.json')),
  trial = await read(path.join(trialDirectory, 'capture.json'));
assert.equal(search.data.nativeCaptureHash, native.hash);
assert.equal(search.data.nativeInputsHash, input.hash);
assert.equal(trial.data.source.nativeCaptureHash, native.hash);
assert.equal(trial.data.source.rendererHash, search.data.rendererHash);
assert.equal(trial.data.source.definitionHash, definition.hash);
assert.deepEqual(definition.data.trials[0].materials.L, search.data.material);
assert.equal(search.data.sources.length, 10);
assert.equal(trial.data.rows.length, 10);
const image = async (file, expected) => {
  const bytes = await readFile(file);
  assert.equal(hash(bytes), expected);
  const data = PNG.sync.read(bytes);
  assert.equal(data.width, 732);
  assert.equal(data.height, 1020);
  return data;
};
const rows = [];
for (const [i, source] of search.data.sources.entries()) {
  const record = trial.data.rows.find((r) => r.id === source.id),
    before = native.data.rows.find((r) => r.id === source.id),
    e = input.data.entries.find((e) => e.id === source.id);
  assert(record.baselineParity && before.accepted);
  assert.equal(e.face.wordingMode, 'original');
  assert.equal(e.reference.sha256, before.referenceHash);
  for (const field of ['referenceHash', 'poseHash']) assert.equal(record[field], source[field]);
  assert.equal(record.trials.current.faceHash, before.renderHash);
  const reference = await image(
      path.join(nativeDirectory, '2ed', source.id + '-scan.png'),
      before.scanHash,
    ),
    current = await image(
      path.join(trialDirectory, 'current', source.id + '.png'),
      record.trials.current.faceHash,
    ),
    selected = await image(
      path.join(trialDirectory, 'shared-dual-search', source.id + '.png'),
      record.trials['shared-dual-search'].faceHash,
    );
  for (let a = 3; a < current.data.length; a += 4)
    assert.equal(selected.data[a], current.data[a], 'Face silhouette changed');
  assert.equal(record.trials.current.etchingHash, record.trials['shared-dual-search'].etchingHash);
  for (const variant of ['current', 'shared-dual-search'])
    await image(
      path.join(trialDirectory, variant, source.id + '-etching.png'),
      record.trials[variant].etchingHash,
    );
  const target = nativeFrameProfiles(reference),
    a = scoreOpaqueFamily(target, nativeFrameProfiles(current), search.data.support),
    b = scoreOpaqueFamily(target, nativeFrameProfiles(selected), search.data.support);
  assert(a.score !== null && b.score !== null);
  assert(
    Math.abs(a.score - search.data.nativeControl[i].score) < 1e-12,
    'Native control differs from search',
  );
  const aperture = search.data.apertures.find((r) => r.id === source.id),
    [x, y, w, h] = search.data.material.art;
  assert(
    x * 732 < aperture.left &&
      y * 1020 < aperture.top &&
      (x + w) * 732 > aperture.right + 1 &&
      (y + h) * 1020 > aperture.bottom + 1,
    'Art does not underlap the whole source aperture',
  );
  rows.push({
    id: source.id,
    name: source.name,
    cohort: source.cohort,
    referenceHash: source.referenceHash,
    poseHash: source.poseHash,
    beforeHash: record.trials.current.faceHash,
    afterHash: record.trials['shared-dual-search'].faceHash,
    etchingHash: record.trials.current.etchingHash,
    before: a,
    after: b,
    prediction: search.data.selected.scores[i].score,
    predictionError: b.score - search.data.selected.scores[i].score,
    alphaUnchanged: true,
    artUnderlap: true,
    outerBoundaryBefore: record.trials.current.outerBoundary,
    outerBoundaryAfter: record.trials['shared-dual-search'].outerBoundary,
  });
}
const groups = Object.fromEntries(
  ['calibration', 'validation', 'all'].map((cohort) => {
    const selected = cohort === 'all' ? rows : rows.filter((r) => r.cohort === cohort),
      mean = (field) => selected.reduce((s, r) => s + r[field].score, 0) / selected.length;
    assert(selected.length > 0);
    return [
      cohort,
      {
        count: selected.length,
        before: mean('before'),
        after: mean('after'),
        improved: selected.filter((r) => r.after.score > r.before.score + 1e-9).length,
        worstRegression: Math.max(0, ...selected.map((r) => r.before.score - r.after.score)),
        maximumPredictionError: Math.max(...selected.map((r) => Math.abs(r.predictionError))),
      },
    ];
  }),
);
const eligible =
  groups.calibration.after - 0.25 * groups.calibration.worstRegression >
    groups.calibration.before &&
  groups.validation.after > groups.validation.before &&
  groups.all.worstRegression <= 0.05;
await writeJson(output, {
  schema: 1,
  status: eligible ? 'native-shared-dual-geometry-candidate' : 'retain-current-dual-geometry',
  scope:
    'One transform for ten duals. Eight calibration names select it; two reserved names are reused development validation. Source preparation uses the unchanged production material pipeline. Fixed opaque support excludes art and nearby text. Exact original printing inputs, independent scan poses, source/definition hashes, current native PNGs, face alpha and empty etching layers are checked. A common one-pixel art underlap covers all ten source apertures; art placement changes and is not scored here. These regional indices do not certify colors, typography, full-card scores or complete the set.',
  nativeCaptureHash: native.hash,
  inputHash: input.hash,
  searchHash: search.hash,
  trialCaptureHash: trial.hash,
  definitionHash: definition.hash,
  rendererHash: search.data.rendererHash,
  toolHash: hash(await readFile(new URL(import.meta.url))),
  nativeProfilesHash: hash(await readFile(new URL('./frame-native-profiles.mjs', import.meta.url))),
  support: search.data.support,
  material: search.data.material,
  groups,
  rows,
});
console.log(JSON.stringify({ eligible, groups }));
