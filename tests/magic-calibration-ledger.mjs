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
import { preserveCalibrationReviews } from '../games/magic/tools/accuracy/calibration-reviews.mjs';
import { calibrationReport } from '../games/magic/tools/accuracy/calibration-report.mjs';
import { unlimitedCalibrationEvidence } from '../games/magic/tools/accuracy/calibration-unlimited-current.mjs';
import { applyEarlyOriginalWording } from '../games/magic/tools/accuracy/calibration-original-wording.mjs';
import { preDarkWordingSource } from './magic-dark-wording-source-guard.mjs';
import { preDarkBodySource } from './magic-dark-body-source-guard.mjs';

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
const beforePalette = structuredClone(card);
assert.equal(
  calibrationVariant(card, { frameColors: ['G', 'W', 'G', 'B', 'R', 'U'] }).palette,
  'WUBRG',
);
assert.equal(calibrationVariant(card, { frameColors: [] }).palette, 'C');
assert.equal(calibrationVariant(card).paletteSource, undefined);
assert.equal(calibrationVariant(card, { frameColors: ['U'] }).paletteSource, 'reviewed-printing');
assert.deepEqual(card, beforePalette);
for (const frameColors of ['U', ['C'], [''], [null], [12]])
  assert.throws(() => calibrationVariant(card, { frameColors }), /Reviewed frame palette/);

// Deliberate reviews belong to an exact population; do not transfer a former
// two-card decision to either newly separated material singleton.
const reviewedGroup = {
  scopeHash: h,
  tasks: { rules: { status: 'rejected', reviewedAt: '2026-10-23', reason: 'Manual review' } },
};
const samePopulation = { scopeHash: h, tasks: {} };
preserveCalibrationReviews(samePopulation, reviewedGroup);
assert.deepEqual(samePopulation.tasks, reviewedGroup.tasks);
samePopulation.tasks.rules.reason = 'Changed';
assert.equal(reviewedGroup.tasks.rules.reason, 'Manual review');
const changedPopulation = {
  scopeHash: 'c'.repeat(64),
  tasks: { rules: { status: 'needs-audit' } },
};
preserveCalibrationReviews(changedPopulation, reviewedGroup);
assert.equal(changedPopulation.tasks.rules.status, 'needs-audit');

const scanCertificate = {
  status: 'validated',
  reviewedAt: '2026-10-23',
  proof: {
    validationKind: 'source-census',
    methodHash: h,
    metricsHash: h,
    scanTemplateHash: h,
    sourceHash: h,
    sourceCensus: { parametersHash: h },
  },
};
const scanGroup = {
  scopeHash: h,
  tasks: {
    normalization: {
      ...structuredClone(scanCertificate),
      proof: {
        ...structuredClone(scanCertificate.proof),
        sourceHash: 'd'.repeat(64),
      },
    },
  },
};
preserveCalibrationReviews(scanGroup, { scopeHash: h, tasks: { normalization: scanCertificate } });
assert.equal(scanGroup.tasks.normalization.proof.sourceHash, 'd'.repeat(64));
const manualRejection = { ...scanCertificate, status: 'rejected' };
preserveCalibrationReviews(scanGroup, { scopeHash: h, tasks: { normalization: manualRejection } });
assert.equal(scanGroup.tasks.normalization.status, 'rejected');
const changedMethod = structuredClone(scanCertificate);
changedMethod.proof.methodHash = 'e'.repeat(64);
scanGroup.tasks.normalization = changedMethod;
preserveCalibrationReviews(scanGroup, { scopeHash: h, tasks: { normalization: scanCertificate } });
assert.equal(scanGroup.tasks.normalization.proof.methodHash, h);

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
// The live ledger follows reviewed Dark input corrections. Reconstruct the
// earlier Electric Eel-only catalog to keep older receipts byte-identical.
const wordingDelta = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/dark-wording-compatibility.json'),
);
const annotations = JSON.parse(await preDarkBodySource(wordingDelta.review.source));
const previousAnnotations = JSON.parse(await preDarkWordingSource(wordingDelta.review.source));
const withoutEel = structuredClone(annotations);
delete withoutEel.cards[wordingDelta.review.id];
assert.deepEqual(withoutEel, previousAnnotations);
const eelGroup = ledger.sets
  .find((s) => s.set === 'drk')
  .groups.find((g) => g.printingIds.includes(wordingDelta.review.id));
assert.deepEqual(eelGroup.tasks.rules.originalInput.sources, {
  'mtgjson-original': 5,
  'scan-reviewed': 3,
});
assert.deepEqual(
  eelGroup.tasks.references.wording.rules,
  eelGroup.tasks.rules.originalInput.sources,
);
assert.equal(reports.length, 272);
const unlimitedReceipt = (await unlimitedCalibrationEvidence()).receipt;
const unlimitedReleased = ledger.sets
  .find((s) => s.set === '2ed')
  .groups.every(
    (g) =>
      g.tasks.release.status === 'validated' &&
      g.tasks.release.proof.rendererHash === unlimitedReceipt.rendererHash,
  );
assert.deepEqual(
  reports
    .filter((s) => s.complete)
    .map((s) => s.set)
    .sort(),
  unlimitedReleased ? ['2ed'] : [],
);
const alphaReport = reports.find((s) => s.set === 'lea');
assert.equal(alphaReport.byTask.headings.validated, alphaReport.groups);
// The complete dual census has been rechecked; measured shape residuals stay open.
for (const [code, count] of [
  ['lea', 9],
  ['leb', 10],
]) {
  const current = reports.find((s) => s.set === code);
  assert.equal(current.byTask.frameGeometry.partial, count);
  assert.equal(current.byTask.frameColor.validated, current.groups);
  assert.equal(current.complete, false);
  const duals = ledger.sets
    .find((s) => s.set === code)
    .groups.filter((g) => g.tasks.frameGeometry.status === 'partial');
  assert.equal(duals.length, count);
  for (const g of duals) {
    assert.equal(g.tasks.frameGeometry.proof.gatesPassed, false);
    assert(
      g.tasks.frameGeometry.evidence.includes(
        'games/magic/fixtures/accuracy/early-through-fourth/abu-dual-frame-review.json',
      ),
    );
  }
}
for (const group of ledger.sets.find((s) => s.set === 'lea').groups)
  assert.match(group.tasks.headings.reason, /Fresh 0\.6\.5 native heading audit/);
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
assert.equal(earlyWording.native.summary.frameAndOtherRegionsUnchanged, 316);
assert.equal(earlyWording.renderingBlockers.length, 0);
assert.equal(earlyWording.resolvedRenderingBlockers.length, 3);
for (const [set, count] of [
  ['arn', 92],
  ['atq', 102],
  ['drk', 122],
]) {
  const report = reports.find((r) => r.set === set);
  assert.equal(report.originalRulesInputs.ready, count);
  assert.equal(report.originalTypeInputs.ready, count);
  assert.equal(report.originalRulesInputs.stale, 0);
  assert.equal(report.originalTypeInputs.stale, 0);
  assert.equal(report.complete, false);
}
const corrected = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/early-expansion-corrected-inputs.json'),
);
assert.deepEqual(corrected.native.summary, {
  cards: 316,
  changed: 21,
  unchanged: 295,
  outsideChanged: 0,
});
assert.equal(corrected.rows.length, 316);
assert.equal(corrected.native.rows.length, 316);
assert.equal(corrected.native.rows.filter((r) => r.changedPixels > 0).length, 21);
assert.ok(corrected.native.rows.every((r) => r.outsideChanged === 0));
assert.notEqual(corrected.native.rendererHash, earlyWording.native.rendererHash);
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

// Exhaustive one-name families disclose development reuse; no fake holdout.
const censusGroup = {
  ...group,
  printings: 1,
  printingIds: ['one-printing'],
  references: { nonfoil: 1, foilOnly: 0 },
};
const censusProof = {
  ...proof,
  coveredPrintings: 1,
  calibrationNames: 1,
  validationNames: 1,
  validationKind: 'source-census',
  sourceCensus: {
    scope: 'all-ordinary-printings-in-variant',
    heldOut: false,
    names: ['Plains'],
    parametersHash: h,
    parameterScope: 'Shared printing profile and material; no per-scan renderer offsets',
    members: [
      {
        id: 'one-printing',
        name: 'Plains',
        referenceHash: h,
        poseHash: h,
        inputHash: h,
        nativeFaceHash: h,
      },
    ],
  },
};
const censusTask = { ...group.tasks.rules, proof: censusProof };
assert.equal(
  calibrationTaskStatus({ ...censusGroup, tasks: { rules: censusTask } }, 'rules').status,
  'validated',
);
for (const change of [
  { heldOut: true },
  { members: [] },
  { members: [...censusProof.sourceCensus.members, ...censusProof.sourceCensus.members] },
  { names: ['Different name'] },
  { parametersHash: '' },
  { members: [{ ...censusProof.sourceCensus.members[0], nativeFaceHash: '' }] },
])
  assert.throws(() =>
    calibrationTaskStatus(
      {
        ...censusGroup,
        tasks: {
          rules: {
            ...censusTask,
            proof: { ...censusProof, sourceCensus: { ...censusProof.sourceCensus, ...change } },
          },
        },
      },
      'rules',
    ),
  );
assert.throws(() =>
  calibrationTaskStatus(
    { ...censusGroup, references: { nonfoil: 0, foilOnly: 1 }, tasks: { rules: censusTask } },
    'rules',
  ),
);
console.log(
  'Finite source census requires every exact native member and discloses that no holdout exists.',
);
