import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { applyM21PigmentAudit } from '../games/magic/tools/accuracy/calibration-m21-evidence.mjs';
const prefix = 'games/magic/fixtures/accuracy/';
const receipt = JSON.parse(await readFile(prefix + 'm21-existing-pigment-audit.json'));
const row = receipt.groups.U.rows[0];
const group = { palette: 'U', printingIds: [row.id], tasks: {} };
applyM21PigmentAudit(group, receipt);
assert.equal(group.tasks.frameColor.status, 'needs-audit');
assert.equal(group.tasks.frameColor.proposalReview.status, 'rejected');
assert.equal(group.tasks.frameColor.proposalReview.kind, 'historical-diagnostic');
assert.equal(receipt.status, 'diagnostic-not-adopted');
const ledger = JSON.parse(await readFile(prefix + 'calibration-progress.json'));
const m21 = ledger.sets.find((s) => s.set === 'm21'),
  reviews = m21.groups.filter((g) => g.tasks.frameColor.proposalReview);
assert.equal(reviews.length, 6);
assert(reviews.every((g) => g.tasks.frameColor.status === 'needs-audit'));
assert.equal(
  reviews.filter((g) => g.tasks.frameColor.proposalReview.kind === 'discarded-proposal').length,
  2,
);
assert(m21.groups.every((g) => g.tasks.release.status === 'validated'));
assert(m21.groups.every((g) => g.tasks.normalization.status === 'validated'));
console.log(
  'M21 retains six historical outcomes without rejecting the published calibration or granting new color approval.',
);

const currentGroup = { palette: 'U', printingIds: [row.id], tasks: {} };
applyM21PigmentAudit(currentGroup, { ...receipt, status: 'current-calibration-audit' });
assert.equal(currentGroup.tasks.frameColor.status, 'rejected');
assert.equal(currentGroup.tasks.frameColor.proposalReview, undefined);
