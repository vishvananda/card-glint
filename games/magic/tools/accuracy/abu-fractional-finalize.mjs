// Approve only a generated dependency-digest refresh after native capture.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, readdir } from 'node:fs/promises';
import { root, hash, sourceHash, writeJson } from './common.mjs';
const [nativeDirectory, referenceRoot, output] = process.argv.slice(2);
assert(output, 'Usage: abu-fractional-finalize.mjs NATIVE REFERENCE_ROOT OUT');
const nativeBytes = await readFile(path.join(nativeDirectory, 'proof.json')),
  native = JSON.parse(nativeBytes);
assert.equal(native.completed, 899);
assert.equal(native.denominator, 899);
assert.equal(native.rows.length, 899);
assert.deepEqual(native.faults, []);
assert(
  native.rows.every((r) => r.sourceBound && !r.prototypeMatch && r.outside === 0 && r.alpha === 0),
);
const manifest = 'games/magic/src/data/generated-manifest.json';
const beforeBytes = await readFile(path.join(referenceRoot, manifest)),
  afterBytes = await readFile(path.join(root, manifest));
const before = JSON.parse(beforeBytes),
  after = JSON.parse(afterBytes);
assert.equal(after.schema, before.schema);
assert.deepEqual(after.files, before.files);
assert.deepEqual(Object.keys(after.sources).sort(), Object.keys(before.sources).sort());
const changed = Object.keys(after.sources)
  .filter((f) => after.sources[f] !== before.sources[f])
  .sort();
const allowed = ['alpha-typography', 'canvas-face', 'early-text-tiers', 'retro-rules']
  .map((f) => 'games/magic/src/presentation/' + f + '.ts')
  .sort();
assert.deepEqual(changed, allowed);
for (const file of changed) {
  assert.equal(hash(await readFile(path.join(root, file))), after.sources[file]);
  assert.equal(hash(await readFile(path.join(referenceRoot, file))), before.sources[file]);
}
const directory = path.join(root, 'games/magic/src');
const files = (await readdir(directory, { recursive: true, withFileTypes: true }))
  .filter((e) => e.isFile() && /\.(?:ts|mjs|css|json)$/.test(e.name))
  .map((e) => path.join(e.parentPath, e.name))
  .sort();
const inventory = [];
for (const file of files) {
  const relative = path.relative(root, file),
    bytes = await readFile(file);
  if (/\.(?:ts|mjs|css)$/.test(file))
    assert(
      !bytes.toString().includes('generated-manifest'),
      'Runtime imports dependency manifest: ' + relative,
    );
  inventory.push([
    path.relative(directory, file),
    hash(relative === manifest ? beforeBytes : bytes),
  ]);
}
assert.equal(
  hash(JSON.stringify(inventory)),
  native.source.afterRenderer,
  'Changes beyond dependency metadata occurred during capture',
);
const endRenderer = await sourceHash(directory);
assert.notEqual(endRenderer, native.source.afterRenderer);
await writeJson(output, {
  schema: 1,
  status: 'verified-generated-metadata-only',
  nativeHash: hash(nativeBytes),
  capturedRenderer: native.source.afterRenderer,
  currentRenderer: endRenderer,
  manifest: {
    file: manifest,
    beforeSha256: hash(beforeBytes),
    afterSha256: hash(afterBytes),
    changedSourceDigests: changed,
    generatedDataUnchanged: true,
    runtimeImports: 0,
  },
  scope:
    'The strict close guard rejected the source hash after all899 native outputs were written. Replacing only the generated dependency manifest with its frozen pre-capture bytes reconstructs the exact captured source identity. Only four source-digest entries changed; generated data and executable painter bytes did not. Native capture identities are retained, not relabeled.',
});
console.log(
  JSON.stringify({
    capturedRenderer: native.source.afterRenderer,
    currentRenderer: endRenderer,
    metadataOnly: true,
  }),
);
