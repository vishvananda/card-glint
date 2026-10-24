import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { preEighthSource } from '../games/magic/tools/accuracy/eighth-source-ancestry.mjs';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import {
  modernStockAncestry,
  preModernStockSource,
} from '../games/magic/tools/accuracy/modern-stock-ancestry.mjs';
const { modernDefaultProfileSource } = await import(
  '../games/magic/tools/accuracy/modern-default-ancestry.mjs'
);
const proof = await modernStockAncestry();
assert.equal(Object.keys(proof.files).length, 6);
assert.equal(proof.parents.length, 3);
for (const [file, e] of Object.entries(proof.files)) {
  const current = await readFile(file);
  const prior = await preModernStockSource(file, current);
  assert.equal(hash(prior), e.before);
  assert.deepEqual(await preModernStockSource(file, prior), prior);
  const modern = await modernDefaultProfileSource(file, current, 'war', { frame: '2015' });
  assert.equal(
    modern.changedProfile,
    true,
    'Shared modern owners must retain their real source: ' + file,
  );
  assert.deepEqual(modern.bytes, await preEighthSource(file, current));
  const older = await modernDefaultProfileSource(file, current, 'lea', { frame: '1993' });
  assert.equal(older.changedProfile, false);
  if (file.endsWith('/security-stamp-material.ts')) assert.deepEqual(older.bytes, prior);
  await assert.rejects(
    preModernStockSource(file, Buffer.concat([current, Buffer.from('\n// unknown\n')])),
    /Unreviewed modern stock source/,
  );
}
const unrelated = Buffer.from('unrelated');
assert.deepEqual(await preModernStockSource('unrelated.ts', unrelated), unrelated);
console.log(
  'Modern stock: complete297 native/policy evidence, exact six-file reconstruction and unknown-edit rejection pass.',
);
