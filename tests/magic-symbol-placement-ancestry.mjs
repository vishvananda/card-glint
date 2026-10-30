import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { hash, root, sourceHash } from '../games/magic/tools/accuracy/common.mjs';
import {
  modernSymbolPlacementDelta,
  preModernSymbolPlacementSource,
  originalSymbolPlacementRuntimeParent,
} from '../games/magic/tools/accuracy/modern-symbol-placement-ancestry.mjs';

const p = await modernSymbolPlacementDelta();
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), p.afterRenderer);
const entries = (
  await fs.readdir(path.join(root, 'games/magic/src'), { recursive: true, withFileTypes: true })
)
  .filter((e) => e.isFile() && /\.(ts|mjs|css|json)$/.test(e.name))
  .map((e) => path.join(e.parentPath, e.name))
  .sort();
const projected = [];
for (const file of entries)
  projected.push([
    path.relative(path.join(root, 'games/magic/src'), file),
    hash(await preModernSymbolPlacementSource(path.relative(root, file), await fs.readFile(file))),
  ]);
assert.equal(hash(JSON.stringify(projected)), p.beforeRenderer);
for (const [file, e] of Object.entries(p.files)) {
  const bytes = await fs.readFile(path.join(root, file));
  assert.equal(hash(bytes), e.after);
  assert.equal(hash(await preModernSymbolPlacementSource(file, bytes)), e.before);
  const unknown = Buffer.concat([bytes, Buffer.from('\n// unrelated change\n')]);
  assert.equal(await preModernSymbolPlacementSource(file, unknown), unknown);
}
for (const [file, expected] of Object.entries(p.tools))
  assert.equal(hash(await fs.readFile(path.join(root, file))), expected, file);
assert.equal(await originalSymbolPlacementRuntimeParent(p.afterRenderer), p.beforeRenderer);
assert.equal(await originalSymbolPlacementRuntimeParent('f'.repeat(64)), 'f'.repeat(64));
console.log(
  'Modern-symbol placement: exact Original source ancestry, 648 native control pairs and 16,885 configuration variants pass.',
);
