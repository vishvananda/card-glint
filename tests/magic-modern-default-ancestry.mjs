import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { preEighthSource } from '../games/magic/tools/accuracy/eighth-source-ancestry.mjs';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import {
  modernDefaultAncestry,
  preModernDefaultSource,
  modernDefaultProfileSource,
  modernDefaultSetAffected,
} from '../games/magic/tools/accuracy/modern-default-ancestry.mjs';
const proof = await modernDefaultAncestry();
assert.equal(proof.preM15Sets.length, 390);
assert.equal(new Set(proof.preM15Sets).size, 390);
assert(proof.preM15Sets.includes('8ed'));
assert(!proof.preM15Sets.includes('m21'));
assert.equal(await modernDefaultSetAffected('war', { frame: '2015' }), true);
assert.equal(await modernDefaultSetAffected('war', { frame: '1993' }), false);
assert.equal(await modernDefaultSetAffected('m14', { frame: '2003' }), false);
assert.equal(await modernDefaultSetAffected('m21', { frame: '2015' }), false);
for (const [file, e] of Object.entries(proof.files)) {
  const current = await readFile(file),
    prior = await preModernDefaultSource(file, current);
  assert.equal(hash(prior), e.before);
  assert.deepEqual(await preModernDefaultSource(file, prior), prior);
  await assert.rejects(
    preModernDefaultSource(file, Buffer.concat([current, Buffer.from('\n// unknown\n')])),
    /Unreviewed modern defaults/,
  );
  const old = await modernDefaultProfileSource(file, current, 'lea');
  assert.equal(old.changedProfile, false);
  assert.deepEqual(old.bytes, prior);
  const m21 = await modernDefaultProfileSource(file, current, 'm21');
  assert.equal(m21.changedProfile, false);
  assert.deepEqual(m21.bytes, await preEighthSource(file, current));
  const changed = await modernDefaultProfileSource(file, current, 'war');
  assert.equal(changed.changedProfile, true);
  assert.deepEqual(changed.bytes, await preEighthSource(file, current));
}
for (const file of Object.keys(proof.newModules)) {
  const current = await readFile(file);
  assert.equal(hash(await preModernDefaultSource(file, current)), proof.newModules[file]);
  await assert.rejects(
    preModernDefaultSource(file, Buffer.concat([current, Buffer.from('\n// unknown\n')])),
    /Unreviewed modern defaults module/,
  );
}
console.log(
  'Modern default ancestry: historical independent proposal and297 unchanged pre-refinement M21 faces/etchings, exact restoration, unknown-change rejection and scoped modern invalidation pass.',
);
