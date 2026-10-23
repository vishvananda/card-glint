// Publication is a separate task from the unfinished regional calibration reviews.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash, sourceHash } from './common.mjs';
import { EARLY_SOURCE_RECEIPT } from './abu-source-ancestry.mjs';
import { checkPublication } from './modern-publication-review.mjs';
export const M21_PUBLICATION = 'games/magic/fixtures/accuracy/m21/release-0612-publication.json';
export async function m21PublicationEvidence() {
  const bytes = await readFile(M21_PUBLICATION),
    receipt = JSON.parse(bytes);
  assert.equal(receipt.status, 'published-renderer-and-matching-score-revision');
  assert.equal(receipt.checksumsVerified, true);
  checkPublication(receipt.release, receipt.workflow, receipt.published);
  assert.equal(receipt.summary.printings, 297);
  assert.equal(receipt.summary.variants, 85);
  assert.equal(new Set(receipt.groups.flatMap((g) => g.printingIds)).size, 297);
  const guards = {
    ...receipt.evidenceGuards,
    [M21_PUBLICATION]: hash(bytes),
    [receipt.toolFile]: receipt.toolHash,
  };
  const current =
    (await sourceHash('games/magic/src')) === receipt.rendererHash &&
    (
      await Promise.all(Object.entries(guards).map(async ([f, h]) => hash(await readFile(f)) === h))
    ).every(Boolean);
  return { receipt, guards, current };
}
export function applyM21Publication(group, { receipt, guards, current }) {
  const variant = receipt.groups.find((g) => g.key === group.key);
  assert(variant, 'Unpublished variant');
  assert.equal(variant.scopeHash, group.scopeHash);
  assert.deepEqual(variant.printingIds, group.printingIds);
  group.tasks.release = {
    status: current ? 'validated' : 'stale',
    reviewedAt: receipt.reviewedAt,
    reason: current
      ? 'Published0.6.12 artifacts and complete renderer CI match the native/scoring census for every printing. Publication only; remaining component and outlier reviews stay open.'
      : 'Runtime or paired publication evidence changed after the published replay.',
    evidence: [M21_PUBLICATION, ...Object.keys(receipt.evidenceGuards)],
    guards,
    runtimeGuards: { 'games/magic/src': receipt.rendererHash },
    coveredPrintings: group.printings,
    proof: {
      sourceHash: group.sourceHash,
      scopeHash: group.scopeHash,
      gatesPassed: current,
      rendererHash: receipt.rendererHash,
      methodHash: receipt.toolHash,
      nativeReplayHash: receipt.nativeReplayHash,
      metricsHash: receipt.metricsHash,
      coveredPrintings: group.printings,
      version: receipt.published.version,
      publishedCommit: receipt.published.sourceCommit,
      checksPassed: true,
      earlyBatchReceipt: EARLY_SOURCE_RECEIPT,
    },
  };
}
