import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import {
  shaderSubmissionProof,
  preShaderSubmissionSource,
} from '../games/magic/tools/accuracy/shader-submission-ancestry.mjs';
for (const [file, e] of Object.entries((await shaderSubmissionProof()).files)) {
  const bytes = await readFile(file);
  assert.equal(hash(bytes), e.after, 'Unreviewed shader scheduling source');
  assert.equal(hash(await preShaderSubmissionSource(file, bytes)), e.before);
  const unknown = Buffer.concat([bytes, Buffer.from('// unknown edit')]);
  assert.strictEqual(await preShaderSubmissionSource(file, unknown), unknown);
}
import {
  softwareFinishProof,
  softwareOptimizationProof,
  preSoftwareOptimizationSource,
  preSoftwareFinishSource,
} from '../games/magic/tools/accuracy/software-finish-ancestry.mjs';
for (const [file, e] of Object.entries((await softwareFinishProof()).files)) {
  const bytes = await readFile(file);
  assert.equal(
    hash(await preSoftwareOptimizationSource(file, bytes)),
    e.after,
    'Unreviewed software finish source',
  );
  assert.equal(hash(await preSoftwareFinishSource(file, bytes)), e.before);
  const unknown = Buffer.concat([bytes, Buffer.from('// unknown edit')]);
  assert.strictEqual(await preSoftwareFinishSource(file, unknown), unknown);
}
for (const [file, e] of Object.entries((await softwareOptimizationProof()).files)) {
  const bytes = await readFile(file);
  assert.equal(hash(bytes), e.after, 'Unreviewed printing optimization source');
  assert.equal(hash(await preSoftwareOptimizationSource(file, bytes)), e.before);
  const unknown = Buffer.concat([bytes, Buffer.from('// unknown edit')]);
  assert.strictEqual(await preSoftwareOptimizationSource(file, unknown), unknown);
  assert.strictEqual(await preSoftwareFinishSource(file, unknown), unknown);
}
const painter = 'games/magic/src/presentation/canvas-face.ts',
  bytes = await readFile(painter);
assert.strictEqual(await preSoftwareFinishSource(painter, bytes), bytes);
console.log('Exact historical browser parent; future edits and game painters receive no approval.');
