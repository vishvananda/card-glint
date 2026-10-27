import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
const root = new URL('../games/magic/fixtures/accuracy/early-through-fourth/', import.meta.url),
  review = JSON.parse(await fs.readFile(new URL('later-native-baseline-review.json', root))),
  zipped = await fs.readFile(new URL(review.evidence.file, root));
assert.equal(hash(zipped), review.evidence.sha256);
const raw = gunzipSync(zipped);
assert.equal(hash(raw), review.evidence.contentSha256);
assert(!/\/home\/|\/Users\/|127\.0\.0\.1/.test(raw.toString()));
const bundle = JSON.parse(raw),
  counts = { leg: 310, drk: 122, fem: 187, '4ed': 378 };
assert.equal(bundle.status, 'complete-later-set-baselines-not-calibration-approval');
assert.equal(review.printings, 997);
assert.equal(review.nativeVariants, 3988);
let printings = 0,
  variants = 0,
  accepted = 0;
for (const [set, count] of Object.entries(counts)) {
  const data = bundle.sets[set],
    rows = data.rows;
  assert.equal(rows.length, count);
  assert.equal(new Set(rows.map((r) => r.id)).size, count);
  assert.equal(data.cards, count);
  assert.equal(data.nativeVariants, 4 * count);
  assert.equal(data.definition.rendererHash, bundle.rendererHash);
  assert.equal(data.definition.inputHash, data.hashes.inputs);
  assert.equal(data.definition.captureHash, data.hashes.nativeCapture);
  assert.equal(data.definition.posesHash, data.hashes.normalization);
  for (const r of rows) {
    assert.equal(typeof r.poseAccepted, 'boolean');
    assert.equal(r.aggregateEligible, r.poseAccepted && r.score100 !== null && r.coverage >= 0.65);
    assert.equal(
      r.components.credits.eligible,
      false,
      'Unreviewed legal text must not enter these baselines',
    );
    assert.equal(r.components.credits.status, 'content-review');
    assert(/^[a-f0-9]{64}$/.test(r.referenceHash));
  }
  const all = data.summary.all,
    ranked = rows.filter((r) => r.aggregateEligible),
    mean = ranked.reduce((s, r) => s + r.score100, 0) / ranked.length;
  assert(Math.abs(mean - all.acceptedPoseMean100) < 1e-10);
  assert.equal(all.rankedDiagnostics, ranked.length);
  assert.equal(all.acceptedPoses, rows.filter((r) => r.poseAccepted).length);
  assert.deepEqual(all, review.summary[set]);
  printings += count;
  variants += data.nativeVariants;
  accepted += all.acceptedPoses;
}
assert.equal(printings, 997);
assert.equal(variants, 3988);
assert.equal(accepted, 995);
assert.deepEqual(
  bundle.sets.leg.rows
    .filter((r) => !r.poseAccepted)
    .map((r) => r.name)
    .sort(),
  ['Demonic Torment', 'Evil Eye of Orms-by-Gore'],
);
console.log(
  'Later-set baseline evidence retains all997 printings/3988 native variants,995 provisional stock poses,two visible alignment rejections and unranked artist/legal diagnostics.',
);
