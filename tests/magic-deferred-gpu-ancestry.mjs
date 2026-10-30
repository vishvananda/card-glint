import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import {
  deferredGpuProof,
  preDeferredGpuSource,
} from '../games/magic/tools/accuracy/deferred-gpu-ancestry.mjs';
const proof = await deferredGpuProof();
for (const [file, e] of Object.entries(proof.files)) {
  const bytes = await readFile(file);
  assert.equal(hash(bytes), e.after, 'Unreviewed current GPU source: ' + file);
  assert.equal(hash(await preDeferredGpuSource(file, bytes)), e.before);
  const future = Buffer.concat([bytes, Buffer.from('// future edit')]);
  assert.strictEqual(
    await preDeferredGpuSource(file, future),
    future,
    'Unknown edits gained approval',
  );
  const parent = Buffer.from(e.beforeSource);
  assert.strictEqual(await preDeferredGpuSource(file, parent), parent);
}
const game = 'games/magic/src/presentation/canvas-face.ts',
  bytes = await readFile(game);
assert.strictEqual(await preDeferredGpuSource(game, bytes), bytes);
console.log(
  'Exact browser-only GPU parent; unchanged painters and future edits receive no approval.',
);
