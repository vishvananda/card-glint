import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from './common.mjs';
import { CALIBRATION_TASKS } from './calibration-ledger.mjs';
import { EARLY_SOURCE_RECEIPT } from './abu-source-ancestry.mjs';
const file = 'games/magic/fixtures/accuracy/early-through-fourth/2ed-crop-adoption.json';
export async function unlimitedCalibrationEvidence() {
  const bytes = await readFile(file);
  const receipt = JSON.parse(bytes);
  assert.equal(receipt.set, '2ed');
  assert.equal(receipt.rows.length, 302);
  assert.equal(new Set(receipt.rows.map((r) => r.id)).size, 302);
  const current = (
    await Promise.all(
      Object.entries(receipt.guards).map(async ([f, h]) => hash(await readFile(f)) === h),
    )
  ).every(Boolean);
  return { receipt, current, receiptHash: hash(bytes) };
}
/** Install only exact, replayed variants. This does not approve a release. */
export function applyUnlimitedEvidence(group, { receipt, current, receiptHash }) {
  const variant = receipt.groups.find((g) => g.key === group.key);
  assert(variant, 'Uncertified Unlimited variant');
  assert.deepEqual(variant.printingIds, group.printingIds);
  const geometryCurrent =
    variant.sourceHash === group.sourceHash &&
    JSON.stringify(variant.sourceHashes) === JSON.stringify(group.sourceHashes);
  group.guards = { ...receipt.guards, ...receipt.artifacts, [file]: receiptHash };
  const rows = receipt.rows.filter((r) => group.printingIds.includes(r.id));
  assert.equal(rows.length, group.printings);
  group.sourceCensus = {
    scope: 'all-ordinary-printings-in-variant',
    heldOut: false,
    names: [...new Set(rows.map((r) => r.name))].sort(),
    parametersHash: receipt.parametersHash,
    parameterScope:
      'Shared Unlimited set/material profile; fixed independent scan poses. No printing-specific render offsets.',
    members: rows,
  };
  for (const task of Object.keys(CALIBRATION_TASKS)) {
    if (task === 'release' || group.applicable?.[task] === false) continue;
    assert(receipt.taskEvidence[task], 'Missing task-specific evidence ' + task);
    const before = group.tasks[task];
    group.tasks[task] = {
      ...before,
      status: current && geometryCurrent ? 'validated' : 'stale',
      reviewedAt: receipt.reviewedAt,
      reason:
        current && geometryCurrent
          ? `${rows.length}/${group.printings} observed printings checked with the installed shared Unlimited profile; all regional losses remain in the receipt. Complete source census, no independent holdout or unseen-printing claim.`
          : 'Unlimited source or geometry changed after its final native replay.',
      evidence: [
        file,
        receipt.visualReview,
        ...new Set([...receipt.taskEvidence[task], ...receipt.taskEvidence.fullCard]),
      ],
      proof: {
        sourceHash: group.sourceHashes?.[task] ?? group.sourceHash,
        scopeHash: group.scopeHash,
        gatesPassed: true,
        rendererHash: receipt.rendererHash,
        methodHash: receipt.methodHash,
        nativeReplayHash: receipt.nativeReplayHash,
        metricsHash: receipt.metricsHash,
        scanTemplateHash: receipt.scanTemplateHash,
        coveredPrintings: group.printings,
        calibrationNames: new Set(rows.map((r) => r.name)).size,
        validationNames: new Set(rows.map((r) => r.name)).size,
        validationKind: 'source-census',
        earlyBatchReceipt: EARLY_SOURCE_RECEIPT,
      },
      ...(task === 'fullCard'
        ? { metrics: receipt.summary, metricCoverage: receipt.metricCoverage }
        : {}),
    };
    if (task === 'rules' || task === 'headings')
      group.tasks[task].originalInput = {
        status: current && geometryCurrent ? 'ready' : 'stale',
        coveredPrintings: group.printings,
        field: task === 'rules' ? 'rules' : 'type',
        sources: { 'exact-printing-reviewed': group.printings },
        proof: { earlyBatchReceipt: EARLY_SOURCE_RECEIPT },
        evidence: group.tasks[task].evidence,
        reason: 'Exact original printing inputs used by the certified final native replay.',
      };
  }
}
