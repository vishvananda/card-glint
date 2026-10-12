import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { compatibleCapture, reusableFace } from '../games/magic/tools/accuracy/capture-cache.mjs';

const identity = {
  rendererHash: 'renderer',
  fontStylesheetHash: 'font',
  browser: 'browser',
  os: 'os',
  snapshotIdentity: 'snapshot',
  study: null,
  components: [{ url: 'asset', sha256: 'bytes' }],
};
assert.ok(compatibleCapture(identity, identity));
for (const key of [
  'rendererHash',
  'fontStylesheetHash',
  'browser',
  'os',
  'snapshotIdentity',
  'study',
])
  assert.ok(!compatibleCapture(identity, { ...identity, [key]: 'changed' }), key);
assert.ok(
  !compatibleCapture(identity, {
    ...identity,
    components: [{ url: 'asset', sha256: 'new-bytes' }],
  }),
);
assert.ok(!compatibleCapture({}, {}));
const directory = await mkdtemp(path.join(os.tmpdir(), 'magic-capture-cache-'));
try {
  const bytes = Buffer.from('verified raster bytes'),
    digest = hash(bytes);
  await writeFile(path.join(directory, 'card.png'), bytes);
  const image = { file: 'card.png', sha256: digest };
  const previous = {
    issue: null,
    inputHash: 'face',
    images: { inspect: image, table: image, reference: image },
    frame: 'frame',
    specialLayout: [{ layout: { overflow: false } }],
  };
  assert.ok(await reusableFace(previous, { inputHash: 'face' }, digest, directory));
  assert.deepEqual(
    (await reusableFace(previous, { inputHash: 'face' }, digest, directory)).specialLayout,
    previous.specialLayout,
    'Reusing a raster must retain its measured special-frame diagnostics',
  );
  assert.equal(await reusableFace(previous, { inputHash: 'changed' }, digest, directory), null);
  assert.equal(
    await reusableFace(previous, { inputHash: 'face' }, 'changed-reference', directory),
    null,
  );
  assert.equal(
    await reusableFace(
      { ...previous, issue: 'overflow' },
      { inputHash: 'face' },
      digest,
      directory,
    ),
    null,
  );
  await writeFile(path.join(directory, 'card.png'), 'corrupted');
  assert.equal(await reusableFace(previous, { inputHash: 'face' }, digest, directory), null);
  await rm(path.join(directory, 'card.png'));
  assert.equal(await reusableFace(previous, { inputHash: 'face' }, digest, directory), null);
} finally {
  await rm(directory, { recursive: true, force: true });
}
console.log(
  'Capture reuse rejects changed inputs, references, environment, missing files and corrupted rasters.',
);
