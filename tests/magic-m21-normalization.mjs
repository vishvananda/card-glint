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
assert.equal(groups.length, 85);
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
// Reviewed physical palettes separate gold Fabled Passage from neutral
// Animal Sanctuary. Both retain their own independently certified scan pose.
for (const [name, palette] of [
  ['Fabled Passage', 'WUBRG'],
  ['Animal Sanctuary', 'C'],
]) {
  const row = data.receipt.rows.find((row) => row.name === name);
  const group = groups.find((group) => group.printingIds.includes(row.id));
  assert.equal(group.printings, 1);
  assert.equal(group.palette, palette);
  assert.equal(calibrationTaskStatus(group, 'normalization').status, 'validated');
}
const scanOnly = structuredClone(groups[0]);
const scanIdentity = scanOnly.sourceHashes.normalization;
scanOnly.sourceHash = 'a'.repeat(64);
scanOnly.sourceHashes.frameColor = 'b'.repeat(64);
applyM21Normalization(scanOnly, data);
assert.equal(
  scanOnly.sourceHashes.normalization,
  scanIdentity,
  'Rendering assets cannot invalidate scan poses',
);
const alteredScan = structuredClone(data);
const member = alteredScan.receipt.rows.find((row) => scanOnly.printingIds.includes(row.id));
member.referenceHash = 'c'.repeat(64);
applyM21Normalization(scanOnly, alteredScan);
assert.notEqual(
  scanOnly.sourceHashes.normalization,
  scanIdentity,
  'Different scan bytes must change pose identity',
);
const alteredPose = structuredClone(data);
const pose = alteredPose.receipt.rows.find((row) => scanOnly.printingIds.includes(row.id));
pose.transform = { ...pose.transform, tx: 1 };
applyM21Normalization(scanOnly, alteredPose);
assert.notEqual(
  scanOnly.sourceHashes.normalization,
  scanIdentity,
  'Different matrices must change pose identity',
);
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
  'M21 scan normalization: 297 printings/85 variants, 1,716 recovery controls, narrow foil-boundary eligibility, stale guards, missing-member rejection and unrelated-task preservation pass.',
);
