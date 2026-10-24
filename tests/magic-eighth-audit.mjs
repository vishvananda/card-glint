import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  eighthAuditEvidence,
  applyEighthAudit,
} from '../games/magic/tools/accuracy/calibration-eighth-audit.mjs';
import { calibrationReport } from '../games/magic/tools/accuracy/calibration-report.mjs';
import {
  calibrationTaskStatus,
  calibrationSetStatus,
} from '../games/magic/tools/accuracy/calibration-ledger.mjs';
const data = await eighthAuditEvidence();
assert.equal(data.current, true);
const ledger = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/calibration-progress.json'),
);
const set = ledger.sets.find((s) => s.set === '8ed');
for (const g of set.groups.filter((g) => g.references.nonfoil === g.printings)) {
  assert.equal(calibrationTaskStatus(g, 'release').status, 'validated');
  assert.equal(g.tasks.release.proof.version, '0.7.0');
}
const clone = structuredClone(set);
const foils = clone.groups.filter((g) => g.references.nonfoil !== g.printings);
const saved = JSON.stringify(foils);
applyEighthAudit(clone, data);
assert.equal(JSON.stringify(foils), saved, 'Nonfoil audit cannot certify foil variants');
let count = 0;
for (const g of clone.groups) {
  if (g.references.nonfoil !== g.printings) continue;
  count += g.printings;
  for (const task of [
    'references',
    'normalization',
    'frameGeometry',
    'headings',
    'artist',
    'footer',
    'setSymbol',
  ]) {
    assert.equal(calibrationTaskStatus(g, task).status, 'validated', task);
    assert.equal(g.sourceCensus.heldOut, false);
  }
  for (const task of ['manaGeometry', 'manaColor', 'stats'])
    assert.equal(
      calibrationTaskStatus(g, task).status,
      g.applicable[task] === false ? 'not-applicable' : 'validated',
    );
  assert.equal(
    calibrationTaskStatus(g, 'release').status,
    'pending',
    'An audit alone cannot approve publication',
  );
  assert.equal(calibrationTaskStatus(g, 'fullCard').status, 'partial');
  assert.equal(calibrationTaskStatus(g, 'paperColor').status, 'partial');
}
assert.equal(count, 357);
assert.equal(calibrationSetStatus(clone).complete, false);
const [report] = await calibrationReport({ sets: [clone] });
const expected = clone.groups.filter((g) => g.references.nonfoil === g.printings).length;
assert.equal(report.byTask.normalization.validated, expected);
const corrupt = structuredClone(clone);
corrupt.groups.find((g) => g.references.nonfoil === g.printings).tasks.headings.runtimeGuards[
  'games/magic/src'
] = '0'.repeat(64);
const [badReport] = await calibrationReport({ sets: [corrupt] });
assert.equal(badReport.byTask.headings.stale, 1);
const omitted = structuredClone(data);
omitted.receipt.rows.pop();
assert.throws(() => applyEighthAudit(structuredClone(set), omitted), /omits/);
applyEighthAudit(clone, { ...data, current: false });
assert(
  clone.groups
    .filter((g) => g.references.nonfoil === g.printings)
    .every((g) => g.tasks.headings.status === 'stale'),
);
console.log(
  'Eighth audit:357 exact nonfoil ledger members, finite-census guards, changed-runtime rejection;350 foil-only records and known residuals remain open.',
);
