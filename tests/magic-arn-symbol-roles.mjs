import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { root, hash, sourceHash } from '../games/magic/tools/accuracy/common.mjs';
import {
  arnSymbolRoleDelta,
  preArnSymbolRoleSource,
  arnSymbolRoleHistoricalFiles,
  arnSymbolRoleRuntimeParent,
} from '../games/magic/tools/accuracy/arn-symbol-role-ancestry.mjs';
const p = await arnSymbolRoleDelta();
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), p.afterRenderer);
const entries = (
  await fs.readdir(path.join(root, 'games/magic/src'), { recursive: true, withFileTypes: true })
)
  .filter((e) => e.isFile() && /\.(ts|mjs|css|json)$/.test(e.name))
  .map((e) => path.join(e.parentPath, e.name))
  .sort();
const parent = [];
for (const file of await arnSymbolRoleHistoricalFiles(entries)) {
  const key = path.relative(root, file),
    bytes = await fs.readFile(file);
  parent.push([
    path.relative(path.join(root, 'games/magic/src'), file),
    hash(await preArnSymbolRoleSource(key, bytes)),
  ]);
}
assert.equal(hash(JSON.stringify(parent)), p.beforeRenderer);
const native = [];
for (const file of entries) {
  const key = path.relative(root, file),
    bytes = await fs.readFile(file),
    metadata = p.metadataOnly.files[key];
  if (metadata) {
    assert.equal(hash(bytes), metadata.after);
    if (key.endsWith('/arn.ts'))
      assert.equal(
        bytes.toString().split('export const review =')[0],
        metadata.nativeSource.split('export const review =')[0],
      );
    else {
      const profile = p.metadataOnly.files['games/magic/src/calibration/sets/arn.ts'];
      assert.equal(bytes.toString().split(profile.after).length, 2);
      assert.equal(
        bytes.toString().replace(profile.after, profile.nativeHash),
        metadata.nativeSource,
      );
    }
  }
  native.push([
    path.relative(path.join(root, 'games/magic/src'), file),
    metadata?.nativeHash ?? hash(bytes),
  ]);
}
assert.equal(
  hash(JSON.stringify(native)),
  p.native.source.afterRenderer,
  'Native replay source no longer reconstructs exactly',
);
for (const [file, e] of Object.entries(p.files)) {
  const bytes = await fs.readFile(path.join(root, file));
  assert.equal(hash(bytes), e.after, file);
  const foreign = Buffer.concat([bytes, Buffer.from('\n// foreign source\n')]);
  assert.equal(await preArnSymbolRoleSource(file, foreign), foreign);
}
assert.equal(
  await arnSymbolRoleRuntimeParent(p.afterRenderer, 'arn'),
  p.afterRenderer,
  'Changed ARN cannot inherit old scores',
);
for (const set of ['lea', 'leb', '2ed', 'atq', 'mir', 'ons', '8ed', 'm21'])
  assert.equal(await arnSymbolRoleRuntimeParent(p.afterRenderer, set), p.beforeRenderer);
assert.equal(await arnSymbolRoleRuntimeParent('f'.repeat(64), 'ons'), 'f'.repeat(64));
assert.equal(await arnSymbolRoleRuntimeParent(p.afterRenderer), p.afterRenderer);
console.log(
  'ARN: exact native source/metadata reconstruction, 276 symbol-mode comparisons, 182 unchanged foreign controls, no unrelated pixel or silhouette changes; unknown revisions cannot reuse evidence.',
);
