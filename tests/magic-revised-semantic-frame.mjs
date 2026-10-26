import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { sourceHash, hash } from '../games/magic/tools/accuracy/common.mjs';
import {
  revisedSemanticDelta,
  preRevisedSemanticSource,
} from '../games/magic/tools/accuracy/revised-semantic-ancestry.mjs';
import {
  revisedWordingDelta,
  revisedWordingMatrixHistoricalHash,
  revisedWordingRuntimeCompatible,
} from '../games/magic/tools/accuracy/revised-wording-ancestry.mjs';
const p = await revisedSemanticDelta();
assert.equal(await sourceHash('games/magic/src'), p.afterRenderer);
for (const [file, entry] of Object.entries(p.files)) {
  const current = await readFile(file);
  assert.equal(hash(current), entry.after);
  assert.equal(hash(await preRevisedSemanticSource(file, current)), entry.before);
  const unknown = Buffer.concat([current, Buffer.from('\n// unrelated change\n')]);
  assert.deepEqual(await preRevisedSemanticSource(file, unknown), unknown);
}
const unknown = Buffer.from('unknown bytes');
assert.deepEqual(await preRevisedSemanticSource('unknown.ts', unknown), unknown);
const wording = await revisedWordingDelta();
assert.equal(await revisedWordingMatrixHistoricalHash(), wording.afterRenderer);
for (const set of ['lea', 'leb', '2ed', 'arn', 'atq'])
  assert(await revisedWordingRuntimeCompatible('games/magic/src', wording.beforeRenderer, set));
assert.equal(
  await revisedWordingRuntimeCompatible('games/magic/src', wording.beforeRenderer, '3ed'),
  false,
);
console.log(
  'Revised semantic fix:4 improved Originals;302 exact native controls;4 exact Oracle controls;306 unchanged layouts; unknown source bytes reject.',
);
