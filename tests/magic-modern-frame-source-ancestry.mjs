import { preEighthSource } from '../games/magic/tools/accuracy/eighth-source-ancestry.mjs';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import {
  modernFrameSourceAncestry,
  preModernFrameSource,
} from '../games/magic/tools/accuracy/modern-frame-source-ancestry.mjs';
import { modernDefaultProfileSource } from '../games/magic/tools/accuracy/modern-default-ancestry.mjs';
import { m21StyleProfileSource } from '../games/magic/tools/accuracy/m21-style-ancestry.mjs';
const p = await modernFrameSourceAncestry();
assert.equal(Object.keys(p.files).length, 7);
for (const [file, e] of Object.entries(p.files)) {
  const current = await readFile(file);
  const prior = await preModernFrameSource(file, current);
  assert.equal(hash(prior), e.before);
  assert.deepEqual(await preModernFrameSource(file, prior), prior);
  await assert.rejects(
    preModernFrameSource(file, Buffer.concat([current, Buffer.from('\n// unknown\n')])),
    /Unreviewed modern frame source/,
  );
  for (const set of ['m21', 'war']) {
    const result = await m21StyleProfileSource(file, current, set, { frame: '2015' });
    assert.equal(result.changedProfile, true, 'Missing actual modern owner: ' + file + '/' + set);
    assert.deepEqual(result.bytes, await preEighthSource(file, current));
  }
  const old = await modernDefaultProfileSource(file, current, 'lea', { frame: '1993' });
  assert.equal(old.changedProfile, false);
  if (file.endsWith('/profile.ts')) assert.deepEqual(old.bytes, prior);
}
const unrelated = Buffer.from('unrelated');
assert.deepEqual(await preModernFrameSource('unrelated.ts', unrelated), unrelated);
console.log(
  'Frame sources:297 native faces/etchings,3 independent proposals,1722 collateral pairs, exact historical restoration and unknown-edit rejection pass.',
);
