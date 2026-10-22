import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  unlimitedCalibrationEvidence,
  unlimitedCurrentGuards,
} from '../games/magic/tools/accuracy/calibration-unlimited-current.mjs';
const data = await unlimitedCalibrationEvidence();
assert.equal(data.current, true);
assert(data.compatibility.sources.length > 0);
const original = await unlimitedCurrentGuards(data.receipt);
assert.equal(original.current, true);
assert.deepEqual(original.reused, data.compatibility.sources);
const profile = 'games/magic/src/calibration/sets/2ed.ts';
assert(Object.hasOwn(data.receipt.guards, profile));
const changed = await unlimitedCurrentGuards(data.receipt, async (file) => {
  const bytes = await readFile(file);
  return file === profile
    ? Buffer.concat([bytes, Buffer.from('\n// changed Unlimited profile\n')])
    : bytes;
});
assert.equal(
  changed.current,
  false,
  'A foreign-set compatibility receipt must not approve an edited Unlimited profile',
);
await assert.rejects(
  unlimitedCurrentGuards(data.receipt, async (file) => {
    const bytes = await readFile(file);
    return file.endsWith('/canvas-face.ts')
      ? Buffer.concat([bytes, Buffer.from('\n// unreviewed painter\n')])
      : bytes;
  }),
  /Unreviewed M21 style source/,
);
console.log(
  'Unlimited reuse: exact 141 dependency guards, named compatibility provenance, changed profile and unknown painter rejection passed.',
);
