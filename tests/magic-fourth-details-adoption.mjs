import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash, sourceHash } from '../games/magic/tools/accuracy/common.mjs';
import {
  fourthDetailsDelta,
  fourthDetailsHistoricalHash,
  preFourthDetailsSource,
  fourthDetailsAffected,
  fourthDetailsApproval,
} from '../games/magic/tools/accuracy/fourth-details-ancestry.mjs';
import {
  fourthDetailsPaths as P,
  validateFourthDetailsData,
} from '../games/magic/tools/accuracy/fourth-details-data-check.mjs';
import { fourthCenteredApproval } from '../games/magic/tools/accuracy/fourth-centered-ancestry.mjs';
import { verifyMetadataRefresh } from '../games/magic/tools/accuracy/abu-metadata-refresh.mjs';
const p = await fourthDetailsDelta();
assert.equal(await sourceHash('games/magic/src'), p.afterRenderer);
assert.equal(await fourthDetailsHistoricalHash(), p.beforeRenderer);
for (const [file, r] of Object.entries(p.files)) {
  const b = await fs.readFile(file);
  assert.equal(hash(b), r.after);
  assert.equal(hash(await preFourthDetailsSource(file, b)), r.before);
  const unknown = Buffer.concat([b, Buffer.from('\n// unreviewed edit\n')]);
  assert.deepEqual(await preFourthDetailsSource(file, unknown), unknown);
}
const corrupt = structuredClone(p);
corrupt.files[P.details].afterSource = corrupt.files[P.details].afterSource.replace(
  '!resolveCardProfile(face).land',
  'true',
);
corrupt.files[P.details].after = hash(corrupt.files[P.details].afterSource);
assert.throws(() => validateFourthDetailsData(corrupt));
const read = async (ref) => {
  const z = await fs.readFile(ref.file);
  assert.equal(hash(z), ref.sha256);
  const raw = gunzipSync(z);
  assert.equal(hash(raw), ref.contentSha256);
  assert(!/\/home\/|\/Users\/|127\.0\.0\.1/.test(raw.toString()));
  return raw;
};
const native = JSON.parse(await read(p.native)),
  metadata = JSON.parse(await read(p.metadata)),
  prior = JSON.parse(await read(p.parentScores)),
  prototype = JSON.parse(await read(p.prototypeScores));
const verified = await verifyMetadataRefresh('games/magic/src', metadata);
assert.deepEqual(verified, native.metadataRefresh);
const badMeta = structuredClone(metadata);
badMeta.beforeRendererHash = '0'.repeat(64);
await assert.rejects(() => verifyMetadataRefresh('games/magic/src', badMeta));
const report = JSON.parse(
    await fs.readFile('games/magic/fixtures/accuracy/4ed/semantic-details-adoption.json'),
  ),
  artifacts = {};
for (const [k, r] of Object.entries(report.artifacts)) artifacts[k] = await read(r);
const scores = JSON.parse(artifacts.scores);
assert.equal(scores.rendererHash, p.afterRenderer);
assert.equal(scores.capturedRenderer, metadata.beforeRendererHash);
assert.equal(native.toolHash, hash(artifacts.nativeTool));
assert.equal(scores.toolHash, hash(artifacts.scoreTool));
assert.equal(scores.sources.native, p.native.contentSha256);
assert.equal(scores.sources.prototype, p.prototypeScores.contentSha256);
assert.equal(scores.sources.prior, p.parentScores.contentSha256);
assert.deepEqual(report.nativeCounts, native.counts);
assert.deepEqual(report.wholeCard, scores.summary);
assert.deepEqual(scores.reuse, { unchangedCurrent: 371, verifiedPrototype: 7, fresh: 0 });
assert.deepEqual(scores.metricGraph, prototype.metricGraph);
assert.deepEqual(scores.policyGraph, prototype.policyGraph);
assert.equal(scores.rows.length, 378);
assert.equal(scores.summary.improved, 7);
assert.equal(scores.summary.regressed, 0);
for (const r of scores.rows) {
  const old = prior.rows.find((o) => o.id === r.id),
    trial = prototype.rows.find((t) => t.id === r.id),
    n = native.rows.find((n) => n.id === r.id);
  assert(old && trial && n);
  assert.equal(r.beforeNativeHash, old.nativeHash);
  assert.equal(r.nativeHash, n.modes.original.after);
  assert.equal(r.nativeHash, trial.nativeHash);
  assert.deepEqual(r.score, trial.score);
  assert.deepEqual(r.beforeScore, old.score);
  for (const key of ['inputHash', 'referenceHash', 'poseHash', 'regionPlanHash'])
    assert.equal(r[key], old[key]);
  assert.equal(r.scoreReused, true);
  assert.equal(
    r.reusedFrom,
    n.scoped ? 'verified-identical-prototype' : 'unchanged-current-native',
  );
  assert.equal(r.delta100 > 0, n.scoped);
}
const n = native.rows.find((r) => r.name === 'Erosion'),
  old = prior.rows.find((r) => r.id === n.id),
  group = { printingIds: [n.id], printings: 1 };
for (const task of ['manaGeometry', 'manaColor', 'fullCard', 'release']) {
  assert(await fourthDetailsAffected('4ed', task, false, group));
  assert(!(await fourthDetailsAffected('4ed', task, true, group)));
  assert(!(await fourthDetailsAffected('4ed', task, false, { printingIds: ['other'] })));
}
for (const task of [
  'rules',
  'flavor',
  'headings',
  'artist',
  'footer',
  'stats',
  'normalization',
  'frameGeometry',
  'frameColor',
])
  assert(!(await fourthDetailsAffected('4ed', task, false, group)));
assert(!(await fourthDetailsAffected('3ed', 'fullCard', false, group)));
assert(
  !(await fourthDetailsApproval({ proof: { semanticDetailsSource: p.afterRenderer } }, group)),
);
const item = {
  runtimeGuards: { 'games/magic/src': p.afterRenderer },
  proof: {
    semanticDetailsSource: p.afterRenderer,
    nativeReplayHash: p.native.contentSha256,
    coveredPrintings: 1,
    validationKind: 'source-census',
    reviewedCenteringSource: p.beforeRenderer,
    sourceCensus: {
      members: [
        {
          id: n.id,
          name: n.name,
          referenceHash: n.referenceHash,
          inputHash: n.inputHash,
          poseHash: old.poseHash,
          nativeFaceHash: n.modes.original.after,
        },
      ],
    },
  },
};
assert(await fourthDetailsApproval(item, group));
assert(await fourthCenteredApproval(item, group));
for (const key of ['id', 'name', 'referenceHash', 'inputHash', 'poseHash', 'nativeFaceHash']) {
  const bad = structuredClone(item);
  bad.proof.sourceCensus.members[0][key] = 'foreign';
  assert(!(await fourthDetailsApproval(bad, group)));
  assert(!(await fourthCenteredApproval(bad, group)));
}
const wrongCenter = structuredClone(item);
wrongCenter.proof.reviewedCenteringSource = 'foreign';
assert(!(await fourthCenteredApproval(wrongCenter, group)));
console.log(
  'Fourth details adoption:1512 native variants,seven scoped cost/key changes,metadata-only graph reconstruction,378 exact score reuses,unchanged words/Oracle/masks and strict component/parent approval guards pass.',
);
