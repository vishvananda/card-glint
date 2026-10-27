import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { reviewGroupMembership } from '../games/magic/tools/accuracy/calibration-group-membership.mjs';
import { calibrationApplicability } from '../games/magic/tools/accuracy/calibration-groups.mjs';
const base = new URL('../games/magic/fixtures/accuracy/', import.meta.url);
const inputRaw = await fs.readFile(new URL('4ed/flavor-fractional-inputs.json.gz', base));
const inputBytes = gunzipSync(inputRaw),
  input = JSON.parse(inputBytes);
const entries = input.entries.filter((e) => e.card.set === '4ed');
const ledger = JSON.parse(await fs.readFile(new URL('calibration-progress.json', base)));
const set = ledger.sets.find((s) => s.set === '4ed');
const receipt = JSON.parse(await fs.readFile(new URL('4ed/membership-review.json', base)));
assert.equal(receipt.status, 'exact-membership-and-component-applicability-review');
assert.equal(receipt.inputHash, hash(inputBytes));
assert.equal(receipt.inputArchiveHash, hash(inputRaw));
assert.equal(receipt.printings, 378);
assert.equal(receipt.groups, 18);
assert.equal(receipt.changes, 60);
const snapshot = JSON.stringify(set);
const current = reviewGroupMembership(set, entries);
assert.equal(JSON.stringify(set), snapshot, 'Review must not mutate caller data');
assert.equal(
  current.rows.reduce((n, r) => n + r.changes.length, 0),
  0,
);
for (const row of current.rows) {
  const recorded = receipt.rows.find((r) => r.key === row.key);
  assert(recorded);
  assert.deepEqual(row.printingIds, recorded.printingIds);
  assert.equal(row.membershipHash, recorded.membershipHash);
  assert.deepEqual(row.applicable, recorded.applicable);
  assert.equal(row.applicable.setSymbol, false);
  const group = set.groups.find((g) => g.key === row.key);
  for (const [task, applies] of Object.entries(row.applicable))
    if (!applies) assert.equal(group.tasks[task].status, 'not-applicable');
}
assert.equal(set.priority, 'active');
assert(
  set.groups.some((g) => g.tasks.rules?.status !== 'validated'),
  'Membership review must not manufacture text completion',
);
assert.equal(calibrationApplicability([{ set: '4ed' }]).applicable.setSymbol, false);
assert.equal(calibrationApplicability([{ set: '6ed' }]).applicable.setSymbol, true);
const copied = structuredClone(set);
copied.groups[0].tasks.headings = { status: 'needs-audit', reason: 'Preserve current outlier' };
assert.deepEqual(
  reviewGroupMembership(copied, entries).set.groups[0].tasks.headings,
  copied.groups[0].tasks.headings,
);
assert.throws(() => reviewGroupMembership(set, entries.slice(1)), /Incomplete/);
assert.throws(() => reviewGroupMembership(set, [...entries.slice(1), entries[1]]), /Duplicate/);
const badEntries = structuredClone(entries);
badEntries[0].card.set = '3ed';
assert.throws(() => reviewGroupMembership(set, badEntries), /Foreign/);
const badGroup = structuredClone(set);
badGroup.groups[0].scopeHash = 'f'.repeat(64);
assert.throws(() => reviewGroupMembership(badGroup, entries), /membership changed/);
const badIds = structuredClone(set);
badIds.groups[0].printingIds[0] = 'foreign';
assert.throws(() => reviewGroupMembership(badIds, entries), /Explicit members changed/);
const noFlavor = current.rows.find((r) => !r.applicable.flavor);
const flavored = structuredClone(entries);
flavored.find((e) => e.id === noFlavor.printingIds[0]).face.rulesParagraphs = [
  { role: 'flavor', runs: [{ text: 'Reviewed Original flavor' }] },
];
assert.throws(() => reviewGroupMembership(set, flavored), /Original flavor contradicts/);
const noCost = current.rows.find((r) => !r.applicable.manaGeometry);
const cost = structuredClone(entries);
cost.find((e) => e.id === noCost.printingIds[0]).face.manaSymbols = ['W'];
assert.throws(() => reviewGroupMembership(set, cost), /Original mana cost contradicts/);
const excluded = structuredClone(set);
const hasCost = current.rows.find((r) => r.applicable.manaGeometry);
excluded.groups.find((g) => g.key === hasCost.key).tasks.manaGeometry = {
  status: 'not-applicable',
  reason: 'Invalid exclusion',
};
assert.throws(() => reviewGroupMembership(excluded, entries), /Present component was excluded/);
console.log(
  'Fourth membership:378 exact printings,18 unchanged groups,60 absent-component flags; incomplete,foreign,duplicate,contradictory and hidden-component cases reject. Existing audit tasks remain open.',
);
