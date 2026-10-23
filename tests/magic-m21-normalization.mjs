import { hash } from '../games/magic/tools/accuracy/common.mjs';
import {
  normalizationCensusReview,
  preNormalizationCensusSource,
} from '../games/magic/tools/accuracy/normalization-census-ancestry.mjs';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  m21NormalizationEvidence,
  applyM21Normalization,
} from '../games/magic/tools/accuracy/calibration-m21-normalization.mjs';
import { calibrationTaskStatus } from '../games/magic/tools/accuracy/calibration-ledger.mjs';
const censusReview = await normalizationCensusReview();
const checker = await readFile(censusReview.file);
const prior = await preNormalizationCensusSource(censusReview.file, checker);
assert.equal(hash(prior), censusReview.before);
assert.deepEqual(await preNormalizationCensusSource(censusReview.file, prior), prior);
await assert.rejects(
  preNormalizationCensusSource(
    censusReview.file,
    Buffer.concat([checker, Buffer.from('\n// unknown\n')]),
  ),
  /Unreviewed normalization census checker/,
);
const data = await m21NormalizationEvidence();
assert.equal(data.current, true);
const ledger = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/calibration-progress.json'),
);
const groups = ledger.sets.find((s) => s.set === 'm21').groups;
assert.equal(groups.length, 84);
let covered = 0,
  foilOnly = 0;
for (const group of groups) {
  const before = structuredClone(group.tasks);
  applyM21Normalization(group, data);
  const item = calibrationTaskStatus(group, 'normalization');
  assert.equal(item.status, 'validated');
  covered += item.proof.coveredPrintings;
  foilOnly += group.references.foilOnly;
  for (const [task, entry] of Object.entries(before))
    if (task !== 'normalization') assert.deepEqual(group.tasks[task], entry);
  const stale = structuredClone(group);
  applyM21Normalization(stale, { ...data, current: false });
  assert.equal(calibrationTaskStatus(stale, 'normalization').status, 'stale');
}
assert.equal(covered, 297);
assert.equal(foilOnly, 5);
const foil = structuredClone(groups.find((g) => g.references.foilOnly));
assert(foil);
foil.tasks.frameColor = structuredClone(foil.tasks.normalization);
foil.tasks.frameColor.proof.sourceHash = foil.sourceHashes?.frameColor ?? foil.sourceHash;
assert.throws(() => calibrationTaskStatus(foil, 'frameColor'), /Foil-only/);
const unsupported = structuredClone(foil);
delete unsupported.tasks.normalization.proof.sourceCensus.referenceUse;
assert.throws(() => calibrationTaskStatus(unsupported, 'normalization'));
const absent = structuredClone(groups[0]);
absent.printingIds.push('missing-scan');
absent.printings++;
assert.throws(() => applyM21Normalization(absent, data), /Missing M21 pose census/);
console.log(
  'M21 scan normalization: 297 printings/84 variants, 1,716 recovery controls, narrow foil-boundary eligibility, stale guards, missing-member rejection and unrelated-task preservation pass.',
);
