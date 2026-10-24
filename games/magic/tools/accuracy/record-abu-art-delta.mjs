// Freeze only the reviewed shared art-height delta; historical captures keep their identities.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { gzipSync, gunzipSync } from 'node:zlib';
import { root, hash, sourceHash } from './common.mjs';
const [referenceRoot, nativeDir, layerDir] = process.argv.slice(2);
assert(layerDir, 'Usage: record-abu-art-delta.mjs REFERENCE NATIVE LAYERS');
const nr = await readFile(path.join(nativeDir, 'proof.json')),
  native = JSON.parse(nr);
const lr = await readFile(path.join(layerDir, 'proof.json')),
  layers = JSON.parse(lr);
assert.equal(native.status, 'complete-native-art-height-adoption-census');
assert.equal(native.completed, 899);
assert.equal(native.faces.length, 114);
assert.equal(layers.status, 'complete-native-art-height-layer-pairs');
assert.equal(layers.rows.length, 57);
assert.equal(
  native.source.beforeRenderer,
  await sourceHash(path.join(referenceRoot, 'games/magic/src')),
);
assert.equal(native.source.afterRenderer, await sourceHash('games/magic/src'));
assert.equal(layers.source.beforeRenderer, native.source.beforeRenderer);
assert.equal(layers.source.afterRenderer, native.source.afterRenderer);
assert.equal(layers.source.inputHash, native.source.inputHash);
const list = async (dir) =>
  (await readdir(path.join(dir, 'games/magic/src'), { recursive: true, withFileTypes: true }))
    .filter((e) => e.isFile() && /\.(ts|mjs|css|json)$/.test(e.name))
    .map((e) => path.relative(dir, path.join(e.parentPath, e.name)))
    .sort();
const files = {},
  names = await list(root);
assert.deepEqual(names, await list(referenceRoot));
for (const file of names) {
  const before = await readFile(path.join(referenceRoot, file)),
    after = await readFile(path.join(root, file));
  if (hash(before) !== hash(after))
    files[file] = { before: hash(before), after: hash(after), beforeSource: before.toString() };
}
assert.deepEqual(Object.keys(files), [
  'games/magic/src/data/generated-manifest.json',
  'games/magic/src/presentation/canvas-face.ts',
  'games/magic/src/presentation/retro-dual-frame.ts',
  'games/magic/src/presentation/retro-dual-material.ts',
  'games/magic/src/presentation/retro-frame.ts',
]);
const base = 'games/magic/fixtures/accuracy/early-through-fourth/';
const receipt = async (file, raw, tool) => {
  const zipped = gzipSync(raw, { mtime: 0 });
  await writeFile(file, zipped);
  return {
    file,
    sha256: hash(zipped),
    contentSha256: hash(raw),
    tool,
    toolSha256: hash(await readFile(tool)),
  };
};
const p = {
  schema: 1,
  beforeRenderer: native.source.beforeRenderer,
  afterRenderer: native.source.afterRenderer,
  scope:
    'Shared two-pixel Alpha/Beta dual art-height reduction after source-color preparation. Fixed border caps, premultiplied aperture edges, coherent illustration and host-etch placement. Native899 census proves exact880 unaffected faces/cache identities and19 matches to the frozen candidate; source poses and pigment parameters stay fixed. Historical source reconstruction is not calibration approval.',
  files,
  members: native.rows
    .filter((r) => r.affected)
    .map((r) => ({ id: r.id, set: r.set, name: r.name })),
  native: await receipt(
    base + 'abu-art-native.json.gz',
    nr,
    'games/magic/tools/accuracy/abu-art-native.mjs',
  ),
  layers: await receipt(
    base + 'abu-art-layers.json.gz',
    lr,
    'games/magic/tools/accuracy/abu-art-layers.mjs',
  ),
  parent: {
    file: base + 'abu-flavor-native.json.gz',
    contentSha256: hash(gunzipSync(await readFile(base + 'abu-flavor-native.json.gz'))),
  },
  study: {
    file: base + 'abu-dual-art-height-trials.json.gz',
    sha256: hash(await readFile(base + 'abu-dual-art-height-trials.json.gz')),
  },
  toolHash: hash(await readFile(new URL(import.meta.url))),
};
const bytes = gzipSync(Buffer.from(JSON.stringify(p) + '\n'), { mtime: 0 }),
  file = base + 'abu-art-source-delta.json.gz';
await writeFile(file, bytes);
console.log(
  JSON.stringify({ file, sha256: hash(bytes), before: p.beforeRenderer, after: p.afterRenderer }),
);
