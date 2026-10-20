// Verify shared source-search choices through full native printing captures.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { frameProfiles } from './frame-family-metrics.mjs';
import { scoreOpaqueFamily } from './frame-family-score.mjs';
const [nativeDirectory, searchDirectory, output] = process.argv.slice(2);
assert(output, 'Usage: early-basic-land-verify.mjs NATIVE_CAPTURE SEARCH_DIRECTORY OUTPUT');
const nativeBytes = await readFile(path.join(nativeDirectory, 'capture.json')),
  native = JSON.parse(nativeBytes),
  searchBytes = await readFile(path.join(searchDirectory, 'search.json')),
  search = JSON.parse(searchBytes),
  groups = [];
assert.equal(hash(nativeBytes), search.nativeCaptureHash);
assert.equal(native.source.rendererHash, search.rendererHash);
const inputBytes = await readFile(path.join(nativeDirectory, 'inputs.json')),
  inputs = JSON.parse(inputBytes);
assert.equal(hash(inputBytes), search.nativeInputsHash);

const readImage = async (file, expected) => {
  const bytes = await readFile(file);
  assert.equal(hash(bytes), expected);
  return PNG.sync.read(bytes);
};
for (const group of search.groups) {
  const folder = path.join(searchDirectory, group.key + '-native'),
    captureBytes = await readFile(path.join(folder, 'capture.json')),
    capture = JSON.parse(captureBytes),
    definitionBytes = await readFile(path.join(searchDirectory, group.key + '-definition.json')),
    definition = JSON.parse(definitionBytes),
    rows = [];
  assert.equal(capture.source.nativeCaptureHash, hash(nativeBytes));
  assert.equal(capture.source.rendererHash, search.rendererHash);
  assert.equal(capture.source.definitionHash, hash(definitionBytes));
  assert.deepEqual(definition.trials[0].materials.L, group.recipe);
  assert.deepEqual(
    new Set(capture.rows.map((r) => r.id)),
    new Set(group.identities.map((r) => r.id)),
  );
  for (const [i, identity] of group.identities.entries()) {
    const before = native.rows.find((r) => r.id === identity.id),
      row = capture.rows.find((r) => r.id === identity.id);
    assert(row.baselineParity && before.accepted);
    const input = inputs.entries.find((e) => e.id === identity.id);
    assert(input && input.face.wordingMode === 'original', 'Original printing required');
    assert.equal(input.reference.sha256, before.referenceHash);

    for (const field of ['referenceHash', 'poseHash']) assert.equal(row[field], identity[field]);
    assert.equal(row.trials.current.faceHash, before.renderHash);
    const current = await readImage(
        path.join(folder, 'current', row.id + '.png'),
        row.trials.current.faceHash,
      ),
      after = await readImage(
        path.join(folder, 'shared-search', row.id + '.png'),
        row.trials['shared-search'].faceHash,
      ),
      reference = await readImage(
        path.join(nativeDirectory, '2ed', row.id + '-scan.png'),
        before.scanHash,
      );
    assert.equal(current.width, 732);
    assert.equal(current.height, 1020);
    assert.equal(after.width, current.width);
    assert.equal(after.height, current.height);
    for (let a = 3; a < current.data.length; a += 4)
      assert.equal(current.data[a], after.data[a], 'Face silhouette changed');
    assert.equal(
      row.trials.current.etchingHash,
      row.trials['shared-search'].etchingHash,
      'Etching changed',
    );
    for (const variant of ['current', 'shared-search'])
      await readImage(
        path.join(folder, variant, row.id + '-etching.png'),
        row.trials[variant].etchingHash,
      );
    const target = frameProfiles(normalize(reference)),
      a = scoreOpaqueFamily(target, frameProfiles(normalize(current)), group.support),
      b = scoreOpaqueFamily(target, frameProfiles(normalize(after)), group.support);
    assert(a.score !== null && b.score !== null, 'Insufficient frame signal');
    assert(Math.abs(a.score - group.nativeControl[i].score) < 1e-12, 'Search control changed');
    const predicted = group.selected.scores[i].score;
    rows.push({
      id: row.id,
      name: row.name,
      referenceHash: row.referenceHash,
      poseHash: row.poseHash,
      beforeHash: row.trials.current.faceHash,
      afterHash: row.trials['shared-search'].faceHash,
      etchingHash: row.trials.current.etchingHash,
      before: a,
      after: b,
      predicted,
      predictionError: b.score - predicted,
      alphaUnchanged: true,
      outerBoundaryBefore: row.trials.current.outerBoundary,
      outerBoundaryAfter: row.trials['shared-search'].outerBoundary,
    });
  }
  const mean = (key) => rows.reduce((a, r) => a + r[key].score, 0) / rows.length,
    worst = Math.max(0, ...rows.map((r) => r.before.score - r.after.score)),
    improved = rows.filter((r) => r.after.score > r.before.score + 1e-9).length,
    baseline = mean('before'),
    candidate = mean('after'),
    objective = candidate - 0.25 * worst,
    accepted = objective > baseline + 1e-6 && improved >= 2 && worst <= 0.05;
  groups.push({
    key: group.key,
    name: group.name,
    recipe: group.recipe,
    status: accepted ? 'candidate-for-integration' : 'retain-current-frame',
    selectionScope: 'All three development illustrations; no independent-name holdout.',
    summary: {
      count: rows.length,
      before: baseline,
      after: candidate,
      worstRegression: worst,
      improved,
      objective,
      maximumPredictionError: Math.max(...rows.map((r) => Math.abs(r.predictionError))),
    },
    captureHash: hash(captureBytes),
    definitionHash: hash(definitionBytes),
    support: group.support,
    rows,
  });
  console.log(
    group.name,
    accepted ? 'candidate' : 'retain current',
    baseline.toFixed(4),
    '->',
    candidate.toFixed(4),
    'improved',
    improved + '/3',
  );
}
await writeJson(output, {
  schema: 1,
  status: 'native-basic-land-geometry-candidates-remaining-components-open',
  scope:
    'Native 732x1020 full-painter verification of one shared source transform per basic-land color. All three illustrations are development references; no blind validation. Fixed opaque support excludes art for the full search envelope, and omits the upper art strip where headings can intrude. No scan transforms or per-card renderer values change. Native baseline parity, source/definition identities, face alpha and empty etching layers are checked. Art placement follows the source aperture and is intentionally changed; these are frame-strip indices, not whole-card or art-match scores. Typography, color, dual lands and complete-set certification remain open.',
  nativeCaptureHash: hash(nativeBytes),
  searchHash: hash(searchBytes),
  rendererHash: search.rendererHash,
  toolHash: hash(await readFile(new URL(import.meta.url))),
  groups,
});
