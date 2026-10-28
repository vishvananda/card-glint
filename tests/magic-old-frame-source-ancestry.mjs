import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  oldFrameSourceDelta,
  preOldFrameSource,
  oldFrameHistoricalSourceFiles,
} from '../games/magic/tools/accuracy/old-frame-source-ancestry.mjs';
import { root, hash } from '../games/magic/tools/accuracy/common.mjs';
const delta = await oldFrameSourceDelta();
const files = (
  await fs.readdir(path.join(root, 'games/magic/src'), { recursive: true, withFileTypes: true })
)
  .filter((e) => e.isFile() && /\.(?:ts|mjs|css|json)$/.test(e.name))
  .map((e) => path.join(e.parentPath, e.name))
  .sort();
const original = [];
for (const file of await oldFrameHistoricalSourceFiles(files)) {
  const key = path.relative(root, file),
    bytes = await fs.readFile(file);
  original.push([
    path.relative(path.join(root, 'games/magic/src'), file),
    hash(await preOldFrameSource(key, bytes)),
  ]);
}
assert.equal(hash(JSON.stringify(original)), delta.beforeRenderer);
for (const [file, entry] of Object.entries(delta.files)) {
  const foreign = Buffer.from('foreign source revision');
  assert.equal(
    await preOldFrameSource(file, foreign),
    foreign,
    'Foreign bytes were silently projected',
  );
  const actual = await fs.readFile(path.join(root, file));
  const projected = await preOldFrameSource(file, actual);
  assert.equal(hash(projected), entry.beforeSource === null ? entry.after : entry.before);
}
assert.equal(delta.nativeProof.count, 65);
console.log(
  'Exact source-family receipt reconstructs the parent renderer, verifies 65 unchanged native controls and refuses foreign source bytes.',
);
