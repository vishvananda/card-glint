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
import { applyEarlyOriginalWording } from '../games/magic/tools/accuracy/calibration-original-wording.mjs';

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
const earlyScores = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/early-expansion-full-scores.json'),
);
assert.equal(earlyScores.total, 316);
assert.equal(earlyScores.scored, 282);
assert.equal(earlyScores.normalizationReview, 34);
assert.equal(earlyScores.summary.improved, 281);
assert.equal(earlyScores.summary.worstRegression, 0);
for (const row of earlyScores.rows.filter((r) => r.after)) {
  assert.equal(row.after.components.type.eligible, false);
  assert.equal(row.before.components.type.eligible, false);
  if (/unverified|fallback|oracle/i.test(row.wording.rules))
    assert.equal(row.after.components.rules.eligible, false);
}
for (const set of ledger.sets.filter((s) => ['arn', 'atq', 'drk'].includes(s.set)))
  for (const group of set.groups) assert.equal(group.tasks.fullCard.status, 'partial');
const earlyWording = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/early-expansion-original-wording.json'),
);
assert.equal(earlyWording.rows.length, 316);
assert.equal(earlyWording.summary.rules['mtgjson-original'], 309);
assert.equal(earlyWording.summary.rules['scan-reviewed'], 7);
assert.equal(earlyWording.native.summary.cards, 316);
assert.equal(earlyWording.native.summary.frameAndOtherRegionsUnchanged, 313);
assert.equal(earlyWording.renderingBlockers.length, 3);
for (const blocker of earlyWording.renderingBlockers) {
  const group = ledger.sets
    .find((s) => s.set === blocker.set)
    .groups.find((g) => g.printingIds.includes(blocker.id));
  assert.equal(group.tasks.frameGeometry.status, 'pending');
  assert.ok(group.tasks.frameGeometry.blockers.some((r) => r.id === blocker.id));
}
for (const [set, count] of [
  ['arn', 92],
  ['atq', 102],
  ['drk', 122],
]) {
  const report = reports.find((r) => r.set === set);
  assert.equal(report.originalRulesInputs.ready, count);
  assert.equal(report.originalTypeInputs.ready, count);
  assert.equal(report.complete, false);
}
const altered = structuredClone(ledger.sets.find((s) => s.set === 'arn'));
const first = altered.groups[0],
  originalStatus = first.tasks.headings.status;
applyEarlyOriginalWording(first, earlyWording, false);
assert.equal(first.tasks.headings.originalInput.status, 'stale');
assert.equal(first.tasks.headings.status, originalStatus, 'Input audit cannot approve placement');
first.tasks.rules.originalInput.guards = { 'missing-original-wording': h };
first.tasks.headings.originalInput.guards = { 'missing-original-wording': h };
const [alteredReport] = await calibrationReport({ sets: [altered] });
assert.equal(alteredReport.originalRulesInputs.stale, first.printings);
assert.equal(alteredReport.originalTypeInputs.stale, first.printings);
console.log(
  'Calibration ledger: full inventory, completion gates, stale evidence and foil denominators passed.',
);
