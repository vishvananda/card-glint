import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import {
  eighthSourceAncestry,
  preEighthSource,
  eighthProfileSource,
  eighthDefaultSetAffected,
  eighthRuntimeCompatible,
} from '../games/magic/tools/accuracy/eighth-source-ancestry.mjs';
import {
  parseEighthProfileData,
  eighthPayloadData,
  eighthAggregateData,
  runtimeCalibrationDataModules,
} from '../games/magic/tools/accuracy/eighth-profile-data.mjs';
const proof = await eighthSourceAncestry();
assert.equal(proof.native.cases, 266);
assert.equal(proof.native.pairs, 1596);
for (const [file, entry] of Object.entries(proof.files)) {
  const current = await readFile(file),
    prior = await preEighthSource(file, current);
  assert.equal(hash(prior), entry.before);
  assert.deepEqual(await preEighthSource(file, prior), prior);
  await assert.rejects(
    preEighthSource(file, Buffer.concat([current, Buffer.from('\n// unknown\n')])),
    /Unreviewed Eighth/,
  );
  const donor = await eighthProfileSource(file, current, '8ed', {
    frame: '2003',
    layout: 'normal',
  });
  assert.equal(donor.changedProfile, true);
  assert.deepEqual(donor.bytes, current);
  const unrelated = await eighthProfileSource(file, current, 'm21', {
    frame: '2015',
    layout: 'normal',
  });
  assert.equal(unrelated.changedProfile, false);
  assert.deepEqual(unrelated.bytes, prior);
}
for (const [file, digest] of Object.entries(proof.newModules)) {
  const current = await readFile(file);
  assert.equal(hash(await preEighthSource(file, current)), digest);
  await assert.rejects(
    preEighthSource(file, Buffer.concat([current, Buffer.from('\n// unknown\n')])),
    /Unreviewed Eighth module/,
  );
}
for (const [set, group, expected] of [
  ['8ed', { frame: '2003', layout: 'normal' }, true],
  ['9ed', { frame: '2003', layout: 'normal' }, true],
  ['mrd', { frame: '2003', layout: 'normal' }, true],
  ['plc', { frame: '2003', layout: 'normal' }, false],
  ['plc', { frame: '2003', layout: 'normal', frameTreatment: 'colorshifted' }, false],
  ['m21', { frame: '2015', layout: 'normal' }, false],
  ['tsp', { frame: '2003', layout: 'split' }, false],
  ['lor', { frame: '2003', kind: 'planeswalker' }, false],
  ['mh2', { frame: '1993', layout: 'normal' }, false],
])
  assert.equal(await eighthDefaultSetAffected(set, group), expected);
assert(
  await eighthRuntimeCompatible('games/magic/src', proof.runtimeBeforeRenderer, 'm21', {
    frame: '2015',
    layout: 'normal',
  }),
);
assert.equal(await eighthRuntimeCompatible('games/magic/src', '0'.repeat(64), 'm21'), false);
assert.equal(
  await eighthRuntimeCompatible('games/magic/src', proof.runtimeBeforeRenderer, '9ed', {
    frame: '2003',
  }),
  false,
);
assert.equal(
  await eighthRuntimeCompatible('another/runtime', proof.runtimeBeforeRenderer, 'm21'),
  false,
);
const manifest = JSON.parse(await readFile('games/magic/assets.json'));
const masks = { paper: {}, title: {}, type: {} };
for (const expression of [
  '(()=>({}))()',
  '{get root(){return "x"}}',
  '{...other}',
  '{root:globalThis.root}',
  '{["root"]:"x"}',
])
  assert.throws(() =>
    parseEighthProfileData('export const profile = ' + expression + ';', manifest, masks),
  );
assert.throws(() =>
  parseEighthProfileData('import sideEffect from "x"; export const profile={};', manifest, masks),
);
assert.throws(() =>
  eighthPayloadData('const data={}; globalThis.sideEffect=true; export default data;'),
);
assert.throws(() =>
  eighthAggregateData('import {registerSet} from "./registry.js"; registerSet((()=>({}))());'),
);
assert(
  (await runtimeCalibrationDataModules()).includes('games/magic/src/calibration/eighth/8ed.ts'),
);
console.log(
  'Eighth compatibility:266 cases/1596 native pairs, exact historical rewind, inert profile grammar, source scope and unrelated-runtime reuse; unknown code and unrelated runtime hashes rejected.',
);
