import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import {
  softwareFinishProof,
  preSoftwareFinishSource,
} from '../games/magic/tools/accuracy/software-finish-ancestry.mjs';
for (const [file, e] of Object.entries((await softwareFinishProof()).files)) {
  const bytes = await readFile(file);
  assert.equal(hash(bytes), e.after, 'Unreviewed software finish source');
  assert.equal(hash(await preSoftwareFinishSource(file, bytes)), e.before);
  const unknown = Buffer.concat([bytes, Buffer.from('// unknown edit')]);
  assert.strictEqual(await preSoftwareFinishSource(file, unknown), unknown);
}
const painter = 'games/magic/src/presentation/canvas-face.ts',
  bytes = await readFile(painter);
assert.strictEqual(await preSoftwareFinishSource(painter, bytes), bytes);
console.log('Exact historical browser parent; future edits and game painters receive no approval.');
