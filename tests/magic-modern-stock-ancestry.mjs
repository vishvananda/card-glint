import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import {
  modernStockAncestry,
  preModernStockSource,
} from '../games/magic/tools/accuracy/modern-stock-ancestry.mjs';
const proof = await modernStockAncestry();
assert.equal(Object.keys(proof.files).length, 5);
assert.equal(proof.parents.length, 2);
for (const [file, e] of Object.entries(proof.files)) {
  const current = await readFile(file);
  const prior = await preModernStockSource(file, current);
  assert.equal(hash(prior), e.before);
  assert.deepEqual(await preModernStockSource(file, prior), prior);
  await assert.rejects(
    preModernStockSource(file, Buffer.concat([current, Buffer.from('\n// unknown\n')])),
    /Unreviewed modern stock source/,
  );
}
const unrelated = Buffer.from('unrelated');
assert.deepEqual(await preModernStockSource('unrelated.ts', unrelated), unrelated);
console.log(
  'Modern stock: complete297 native/policy evidence, exact five-file reconstruction and unknown-edit rejection pass.',
);
