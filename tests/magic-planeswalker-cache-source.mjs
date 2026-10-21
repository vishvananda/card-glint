import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import {
  preWalkerMaterialCacheSource,
  walkerMaterialCacheProof,
} from '../games/magic/tools/accuracy/walker-material-cache-ancestry.mjs';
const proof = await walkerMaterialCacheProof();
assert.equal(Object.keys(proof.files).length, 2);
for (const [file, entry] of Object.entries(proof.files)) {
  const current = await readFile(file);
  const before = await preWalkerMaterialCacheSource(file, current);
  assert.equal(hash(before), entry.before);
  assert.equal(hash(current), entry.after);
  assert.deepEqual(await preWalkerMaterialCacheSource(file, before), before);
  await assert.rejects(
    () =>
      preWalkerMaterialCacheSource(
        file,
        Buffer.concat([current, Buffer.from('\n// unrelated painter edit\n')]),
      ),
    /Unreviewed walker cache source/,
  );
}
const other = Buffer.from('unrelated source');
assert.deepEqual(await preWalkerMaterialCacheSource('other.ts', other), other);
console.log(
  'Walker cache historical ancestry: exact reversal and idempotence; unrelated painter edits remain rejected.',
);
