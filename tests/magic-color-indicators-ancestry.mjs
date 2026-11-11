import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import {
  colorIndicatorAncestry,
  preColorIndicatorSource,
  colorIndicatorHistoricalFiles,
} from '../games/magic/tools/accuracy/color-indicator-ancestry.mjs';
import { preOracleFlavorSource } from '../games/magic/tools/accuracy/oracle-flavor-ancestry.mjs';
import { preM21BodyFieldSource } from '../games/magic/tools/accuracy/m21-body-field-ancestry.mjs';
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
const adapter = 'games/magic/tools/accuracy/adapter.mjs';
const adapterBytes = await readFile(adapter);
assert.deepEqual(
  await preM21BodyFieldSource(adapter, adapterBytes, 'm21'),
  await preColorIndicatorSource(adapter, adapterBytes),
);
const foreignAdapter = Buffer.concat([adapterBytes, Buffer.from('\n// unreviewed\n')]);
assert.deepEqual(await preM21BodyFieldSource(adapter, foreignAdapter, 'm21'), foreignAdapter);
assert.deepEqual(await preM21BodyFieldSource(adapter, adapterBytes, 'lea'), adapterBytes);
const provider = 'games/magic/src/presentation/provider-card.ts';
await assert.rejects(
  () =>
    preOracleFlavorSource(
      provider,
      Buffer.from(proof.files[provider].beforeSource + '\n// unreviewed\n'),
    ),
  /Unreviewed Oracle flavor API source/,
);
console.log(
  'Exact optional-indicator ancestry: default pixel evidence, all runtime dependencies, added modules and unknown edits checked; changed indicator scores are not reused.',
);
