import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  preEarlyCalibrationSource,
  earlyCalibrationAffected,
  EARLY_SOURCE_RECEIPT,
} from '../games/magic/tools/accuracy/abu-source-ancestry.mjs';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
const proof = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/early-through-fourth/source-proof.json'),
);
for (const [file, entry] of Object.entries(proof.files)) {
  const current = await readFile(file),
    before = await preEarlyCalibrationSource(file, current);
  assert.equal(hash(current), entry.after);
  assert.equal(hash(before), entry.before);
  assert.deepEqual(await preEarlyCalibrationSource(file, before), before);
  await assert.rejects(
    preEarlyCalibrationSource(file, Buffer.concat([current, Buffer.from('\n// unknown change\n')])),
    /Unreviewed early source/,
  );
}
const unrelated = Buffer.from('Unrelated source is not rewritten');
assert.deepEqual(await preEarlyCalibrationSource('unknown.ts', unrelated), unrelated);
console.log(
  'Early source ancestry: exact four-file restoration, immutable ancestor acceptance and unknown-edit rejection pass.',
);

const ledger = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/calibration-progress.json'),
);
const lea = structuredClone(ledger.sets.find((s) => s.set === 'lea'));
const group = lea.groups.find((g) =>
  g.printingIds.includes('f13ad58a-6f9b-420a-bac1-40929f5e616a'),
);
assert(await earlyCalibrationAffected('lea', group, 'rules'));
assert.equal(await earlyCalibrationAffected('lea', group, 'headings'), false);
assert.equal(await earlyCalibrationAffected('lea', group, 'rules', true), false);
const { calibrationReport } = await import('../games/magic/tools/accuracy/calibration-report.mjs');
lea.groups = [group];
lea.inventory.ordinaryPrintings = group.printings;
group.tasks.rules.status = 'validated';
delete group.tasks.rules.proof.earlyBatchReceipt;
group.tasks.rules.guards['games/magic/src/presentation/early-text-tiers.ts'] =
  proof.files['games/magic/src/presentation/early-text-tiers.ts'].before;
const [reopened] = await calibrationReport({ ...ledger, sets: [lea] });
assert.equal(reopened.byTask.rules['needs-audit'], 1);
assert.equal(reopened.byTask.headings.validated, 1);
group.tasks.rules.proof.earlyBatchReceipt = EARLY_SOURCE_RECEIPT;
const [stale] = await calibrationReport({ ...ledger, sets: [lea] });
assert.equal(stale.byTask.rules.stale, 1, 'A marker cannot authorize old source guards');
console.log(
  'Component scope: changed rules reopen, unchanged headings survive, marker-only evidence fails closed.',
);
