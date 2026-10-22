import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import {
  m21StyleAncestry,
  preM21StyleSource,
  m21StyleProfileSource,
} from '../games/magic/tools/accuracy/m21-style-ancestry.mjs';
import { earlyCalibrationAffected } from '../games/magic/tools/accuracy/abu-source-ancestry.mjs';
const proof = await m21StyleAncestry();
for (const [file, e] of Object.entries(proof.files)) {
  const current = await readFile(file),
    prior = await preM21StyleSource(file, current);
  assert.equal(hash(prior), e.before);
  assert.deepEqual(await preM21StyleSource(file, prior), prior);
  await assert.rejects(
    preM21StyleSource(file, Buffer.concat([current, Buffer.from('\n// unreviewed change\n')])),
    /Unreviewed M21 style/,
  );
  const unrelated = await m21StyleProfileSource(file, current, 'lea');
  assert.equal(unrelated.changedProfile, false);
  assert.deepEqual(unrelated.bytes, prior);
  const affected = await m21StyleProfileSource(file, current, 'm21');
  assert.equal(affected.changedProfile, true);
  assert.deepEqual(affected.bytes, current);
}
for (const file of Object.keys(proof.newModules)) {
  const current = await readFile(file);
  assert.deepEqual(await preM21StyleSource(file, current), current);
  await assert.rejects(
    preM21StyleSource(file, Buffer.concat([current, Buffer.from('\n// unknown\n')])),
    /Unreviewed M21 style module/,
  );
}
assert.equal(await earlyCalibrationAffected('m21', {}, 'rules'), true);
assert.equal(await earlyCalibrationAffected('m21', {}, 'references', true), false);
assert.equal(await earlyCalibrationAffected('m21', {}, 'references'), false);
const unrelated = Buffer.from('unrelated source');
assert.deepEqual(await preM21StyleSource('unknown.ts', unrelated), unrelated);
console.log(
  'M21 style ancestry: exact reversal/idempotence, unknown-edit rejection and changed-M21 score invalidation passed.',
);
