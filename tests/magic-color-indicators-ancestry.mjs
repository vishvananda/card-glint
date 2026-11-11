import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import {
  colorIndicatorAncestry,
  preColorIndicatorSource,
  colorIndicatorHistoricalFiles,
} from '../games/magic/tools/accuracy/color-indicator-ancestry.mjs';
const proof = await colorIndicatorAncestry();
for (const [file, e] of Object.entries(proof.files)) {
  const bytes = await readFile(file);
  assert.equal(hash(bytes), e.after);
  const before = await preColorIndicatorSource(file, bytes);
  assert.equal(hash(before), e.beforeSource === null ? e.after : e.before);
  assert.deepEqual(
    await preColorIndicatorSource(file, Buffer.concat([bytes, Buffer.from('\n// unknown\n')])),
    Buffer.concat([bytes, Buffer.from('\n// unknown\n')]),
    'Foreign bytes inherited old ancestry',
  );
  assert.deepEqual(
    await colorIndicatorHistoricalFiles([file]),
    e.beforeSource === null ? [] : [file],
  );
}
assert.equal(proof.scoreReuse, false);
console.log(
  'Exact optional-indicator ancestry: default pixel evidence, all runtime dependencies, added modules and unknown edits checked; changed indicator scores are not reused.',
);
