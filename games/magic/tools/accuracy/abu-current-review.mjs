import { wallWordingAffected } from './wall-wording-data.mjs';
// Current finite ABU review: exact native evidence plus disclosed residuals.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from './common.mjs';
import { abuFlowDelta } from './abu-flow-ancestry.mjs';
import { abuArtDelta } from './abu-art-ancestry.mjs';
export const ABU_CURRENT_REVIEW =
  'games/magic/fixtures/accuracy/early-through-fourth/abu-current-review.json';
const REVIEW_HASH = '08479a718a56f132e2b580b7704094328af3f554b30b962e7281bd09e849b5a8';
let checked;
export async function abuCurrentAudit() {
  return (checked ??= (async () => {
    const reviewBytes = await readFile(ABU_CURRENT_REVIEW),
      review = JSON.parse(reviewBytes);
    assert.equal(hash(JSON.stringify(review)), REVIEW_HASH, 'Changed finite ABU review');
    const p = await abuFlowDelta(),
      art = await abuArtDelta();
    assert.equal(review.rendererHash, p.afterRenderer);
    assert.deepEqual(review.coverage, {
      ordinaryPrintings: 899,
      changedImages: 33,
      unchangedImages: 866,
      scopedKeys: 47,
      pairedLayers: 376,
      visualChanges: 33,
      heldOut: false,
    });
    assert.deepEqual(review.approvedTasks, [
      'references',
      'frameGeometry',
      'rules',
      'flavor',
      'fullCard',
    ]);
    const artifacts = {};
    for (const [name, ref] of Object.entries(review.artifacts)) {
      const bytes = await readFile(ref.file);
      assert.equal(hash(bytes), ref.sha256, 'Changed reviewed ABU artifact: ' + ref.file);
      artifacts[name] = JSON.parse(ref.file.endsWith('.gz') ? gunzipSync(bytes) : bytes);
    }
    const native = artifacts['abu-flow-native.json.gz'],
      scores = artifacts['abu-flow-current-scores.json.gz'];
    assert.equal(scores.source.rendererHash, p.afterRenderer);
    assert.equal(scores.source.nativeHash, p.native.contentSha256);
    assert.equal(scores.source.inputsHash, native.source.afterInputHash);
    assert.equal(scores.rows.length, 899);
    assert.equal(new Set(scores.rows.map((r) => r.id)).size, 899);
    assert.equal(scores.recomputedPrintings, 33);
    assert.equal(scores.reusedPrintings, 866);
    assert.deepEqual(scores.summary, review.summary);
    const previousBytes = await readFile(
      'games/magic/fixtures/accuracy/early-through-fourth/abu-art-current-scores.json.gz',
    );
    assert.equal(hash(previousBytes), scores.source.priorSummaryHash);
    const previousScores = JSON.parse(gunzipSync(previousBytes));
    assert.equal(previousScores.source.rendererHash, p.beforeRenderer);
    assert.deepEqual(scores.source.metricGraph, previousScores.source.metricGraph);

    const parent = JSON.parse(gunzipSync(await readFile(art.native.file)));
    for (const r of scores.rows) {
      const n = native.rows.find((v) => v.id === r.id);
      assert(n);
      assert.equal(r.referenceHash, n.referenceHash);
      assert.equal(r.poseHash, n.poseHash);
      assert.equal(r.inputHash, n.inputHash);
      assert.equal(r.nativeFaceHash, n.original.hashes['after-face']);
      assert.equal(r.normalizationAccepted, true);
      if (art.members.some((m) => m.id === r.id)) {
        const a = parent.rows.find((v) => v.id === r.id);
        assert.equal(r.nativeFaceHash, a.original.hashes['after-face']);
        assert.equal(n.original.keys.after.face, a.original.keys.after.face);
      }
    }
    assert.equal(review.visualReview.rows.length, 33);
    assert.equal(new Set(review.visualReview.rows.map((r) => r.id)).size, 33);
    for (const v of review.visualReview.rows) {
      const s = scores.changes.find((r) => r.id === v.id),
        n = native.rows.find((r) => r.id === v.id);
      assert(s && n?.pixelsChanged);
      for (const field of ['referenceHash', 'poseHash', 'inputHash'])
        assert.equal(v[field], n[field]);
      assert.equal(v.beforeFaceHash, s.beforeFaceHash);
      assert.equal(v.afterFaceHash, s.afterFaceHash);
      assert.equal(v.delta100, s.delta100);
      assert.equal(v.accepted, true);
      assert(v.note.trim());
    }
    const losses = scores.changes.filter((r) => r.delta100 < 0);
    assert.equal(losses.length, 1);
    assert.equal(losses[0].set, '2ed');
    assert.equal(losses[0].name, 'Stasis');
    for (const [set, outliers] of Object.entries(review.outliers)) {
      assert.equal(outliers.length, 12);
      for (const r of outliers) {
        const s = scores.rows.find((v) => v.id === r.id);
        assert.equal(s.set, set);
        assert.equal(r.nativeFaceHash, s.nativeFaceHash);
        assert.equal(r.rules100, s.components.rules.score100);
        assert(r.disposition.trim());
      }
    }
    return {
      review,
      reviewHash: hash(reviewBytes),
      flow: p,
      art,
      native,
      scores,
      previousScores,
      metricsHash: hash(
        gunzipSync(await readFile(review.artifacts['abu-flow-current-scores.json.gz'].file)),
      ),
    };
  })());
}
/** A review marker alone is insufficient: every current member and dependency
 * must be the exact reviewed native/source/metric identity. No other component
 * or original field inherits this review. Publication has its own ledger gate. */
export async function abuCurrentApproval(item, group, task, original = false, setCode) {
  if (await wallWordingAffected(setCode, task, original, group)) return false;
  const proof = item.proof;
  if (!proof?.abuCurrentReview || !['lea', 'leb', '2ed'].includes(setCode)) return false;
  const a = await abuCurrentAudit(),
    p = a.flow;
  if (
    (!a.review.approvedTasks.includes(task) && task !== 'release') ||
    (original && task !== 'rules')
  )
    return false;
  if (!Array.isArray(group.printingIds) || group.printingIds.length !== group.printings)
    return false;
  const intersects = (members) => group.printingIds.some((id) => members.some((m) => m.id === id));
  if ((original || task === 'references') && !intersects(p.members.filter((m) => m.wording)))
    return false;
  if (task === 'frameGeometry' && !intersects(a.art.members)) return false;
  if (
    proof.abuCurrentReview !== a.reviewHash ||
    proof.rendererHash !== p.afterRenderer ||
    proof.nativeReplayHash !== p.native.contentSha256 ||
    proof.metricsHash !== a.metricsHash ||
    item.runtimeGuards?.['games/magic/src'] !== p.afterRenderer ||
    item.guards?.[ABU_CURRENT_REVIEW] !== a.reviewHash ||
    proof.coveredPrintings !== group.printings ||
    proof.validationKind !== 'source-census' ||
    proof.sourceCensus?.heldOut !== false
  )
    return false;
  for (const [file, entry] of Object.entries(p.files))
    if (item.guards?.[file] !== entry.after) return false;
  for (const name of ['abu-flow-native.json.gz', 'abu-flow-current-scores.json.gz']) {
    const ref = a.review.artifacts[name];
    if (item.guards?.[ref.file] !== ref.sha256) return false;
  }
  if (proof.groupGuardsHash !== hash(JSON.stringify(group.guards ?? {}))) return false;
  const members = proof.sourceCensus.members;
  if (
    !Array.isArray(members) ||
    members.length !== group.printings ||
    new Set(members.map((m) => m.id)).size !== group.printings
  )
    return false;
  return group.printingIds.every((id) => {
    const r = a.native.rows.find((r) => r.id === id),
      m = members.find((m) => m.id === id);
    return (
      r &&
      r.set === setCode &&
      r.name === m?.name &&
      m &&
      r.referenceHash === m.referenceHash &&
      r.poseHash === m.poseHash &&
      r.inputHash === m.inputHash &&
      r.original.hashes['after-face'] === m.nativeFaceHash
    );
  });
}
