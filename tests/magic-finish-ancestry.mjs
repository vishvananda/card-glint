import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import {
  finishAncestryProof,
  preFinishSource,
} from '../games/magic/tools/accuracy/finish-ancestry.mjs';

const proof = await finishAncestryProof();
assert.equal(Object.keys(proof.files).length, 10);
for (const [file, change] of Object.entries(proof.files)) {
  const bytes = await readFile(file);
  assert.equal(hash(await preFinishSource(file, bytes)), change.before);
  await assert.rejects(
    () => preFinishSource(file, Buffer.concat([bytes, Buffer.from('// later edit')])),
    /Unreviewed finish source/,
  );
}
const painter = 'games/magic/src/presentation/canvas-face.ts',
  bytes = await readFile(painter);
assert.strictEqual(await preFinishSource(painter, bytes), bytes);
console.log(
  'Exact finish-only ancestry preserves historical guards; future edits and game painters receive no approval.',
);
