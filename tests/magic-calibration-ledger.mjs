import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  CALIBRATION_TASKS,
  calibrationTaskStatus,
  calibrationSetStatus,
} from '../games/magic/tools/accuracy/calibration-ledger.mjs';
import {
  calibrationVariant,
  calibrationApplicability,
} from '../games/magic/tools/accuracy/calibration-groups.mjs';
import { calibrationReport } from '../games/magic/tools/accuracy/calibration-report.mjs';

const h = 'a'.repeat(64);
const proof = {
  scopeHash: h,
  gatesPassed: true,
  sourceHash: h,
  rendererHash: h,
  methodHash: h,
  nativeReplayHash: h,
  metricsHash: h,
  scanTemplateHash: h,
  coveredPrintings: 6,
  calibrationNames: 3,
  validationNames: 3,
  validationKind: 'fresh',
  version: '1.0.0',
  publishedCommit: 'b'.repeat(40),
  checksPassed: true,
};
const group = {
  scopeHash: h,
  key: 'test',
  sourceHash: h,
  printings: 6,
  references: { nonfoil: 6, foilOnly: 0 },
  tasks: Object.fromEntries(
    Object.keys(CALIBRATION_TASKS).map((task) => [
      task,
      { status: 'validated', evidence: ['receipt.json'], proof: { ...proof } },
    ]),
  ),
};
const set = {
  set: 'test',
  inventory: { status: 'verified', ordinaryPrintings: 6, classificationReview: 0 },
  groups: [group],
};
assert.equal(calibrationSetStatus(set).complete, true);
assert.equal(calibrationSetStatus({ ...set, groups: [] }).complete, false);
assert.equal(
  calibrationSetStatus({ ...set, inventory: { ...set.inventory, classificationReview: 1 } })
    .complete,
  false,
);
assert.equal(
  calibrationSetStatus({ ...set, inventory: { ...set.inventory, ordinaryPrintings: 7 } }).complete,
  false,
);
assert.equal(
  calibrationSetStatus({ ...set, groups: [{ ...group, tasks: {} }] }).outstanding.length,
  18,
);
assert.throws(() => calibrationSetStatus({ ...set, groups: [group, group] }), /Duplicate/);
assert.equal(
  calibrationTaskStatus({ ...group, sourceHash: 'b'.repeat(64) }, 'rules').status,
  'stale',
);
for (const [change, pattern] of [
  [{ evidence: [] }, /Missing calibration evidence/],
  [{ proof: { ...proof, coveredPrintings: 5 } }, /printing coverage/],
  [{ proof: { ...proof, calibrationNames: 0 } }, /independent names/],
  [{ proof: { ...proof, scanTemplateHash: '' } }, /normalization identity/],
  [{ status: 'validated-default' }, /absent override/],
  [{ status: 'not-applicable', reason: 'guess' }, /Unproven/],
])
  assert.throws(
    () =>
      calibrationTaskStatus(
        { ...group, tasks: { rules: { ...group.tasks.rules, ...change } } },
        'rules',
      ),
    pattern,
  );
assert.equal(
  calibrationTaskStatus(
    {
      ...group,
      tasks: {
        rules: {
          ...group.tasks.rules,
          status: 'validated-default',
          proof: { ...proof, choice: 'source-default' },
        },
      },
    },
    'rules',
  ).status,
  'validated-default',
);
assert.throws(
  () =>
    calibrationTaskStatus(
      {
        ...group,
        tasks: {
          release: {
            ...group.tasks.release,
            proof: { ...proof, checksPassed: false },
          },
        },
      },
      'release',
    ),
  /local checkpoint/,
);
const changed = structuredClone(set);
changed.groups[0].tasks.rules.guards = { 'games/magic/tools/accuracy/calibration-ledger.mjs': h };
const stale = (await calibrationReport({ sets: [changed] }))[0];
assert.equal(stale.complete, false);
assert.equal(stale.counts.stale, 1);
assert.equal(
  changed.groups[0].tasks.rules.status,
  'validated',
  'Report must not mutate stored evidence',
);

const card = {
  frame: '2015',
  border_color: 'black',
  layout: 'normal',
  set: 'm21',
  type_line: 'Land',
  produced_mana: ['R', 'U'],
  nonfoil: true,
};
assert.equal(calibrationVariant(card).palette, 'UR');
assert.notEqual(
  calibrationVariant(card).key,
  calibrationVariant({ ...card, type_line: 'Legendary Land' }).key,
);
assert.notEqual(
  calibrationVariant(card).key,
  calibrationVariant({ ...card, type_line: 'Basic Land — Island' }).key,
);
assert.notEqual(
  calibrationVariant(card).key,
  calibrationVariant({ ...card, security_stamp: 'oval' }).key,
);
assert.equal(calibrationApplicability([{ ...card, set: 'lea' }]).applicable.setSymbol, false);
assert.equal(
  calibrationApplicability([
    { ...card, type_line: 'Creature', card_faces: [{ mana_cost: '{R}', power: '2' }] },
  ]).applicable.stats,
  true,
);

const ledger = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/calibration-progress.json'),
);
const reports = await calibrationReport(ledger);
assert.equal(reports.length, 272);
assert.ok(reports.every((s) => !s.complete));
for (const s of ledger.sets) {
  assert.equal(
    reports.find((r) => r.set === s.set).inventoryReady,
    s.inventory.classificationReview === 0,
  );
  assert.equal(
    s.groups.reduce((n, g) => n + g.printings, 0),
    s.inventory.ordinaryPrintings,
  );
  for (const g of s.groups) {
    assert.equal(g.references.nonfoil + g.references.foilOnly, g.printings);
    assert.equal(
      Object.values(g.rarities).reduce((a, b) => a + b, 0),
      g.printings,
    );
    if (g.printingIds) assert.equal(new Set(g.printingIds).size, g.printings);
  }
}
const m21 = ledger.sets.find((s) => s.set === 'm21');
assert.equal(m21.inventory.ordinaryPrintings, 297);
assert.equal(
  m21.groups.filter((g) => g.kind === 'planeswalker').reduce((n, g) => n + g.printings, 0),
  14,
);
assert.equal(
  m21.groups
    .filter((g) => g.kind === 'planeswalker')
    .reduce((n, g) => n + g.references.foilOnly, 0),
  5,
);
const eighth = reports.find((s) => s.set === '8ed');
assert.equal(eighth.nonfoil, 357);
assert.equal(eighth.foilOnly, 350);
console.log(
  'Calibration ledger: full inventory, completion gates, stale evidence and foil denominators passed.',
);
