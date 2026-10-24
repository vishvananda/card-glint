// Freeze an exact narrow renderer delta, never rewrite historical receipts.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { gzipSync, gunzipSync } from 'node:zlib';
import { root, hash, sourceHash } from './common.mjs';
const [referenceRoot, nativeDir, inputFile] = process.argv.slice(2);
assert(inputFile, 'Usage: record-abu-perimeter-delta.mjs REFERENCE NATIVE INPUTS');
const nb = await readFile(path.join(nativeDir, 'proof.json')),
  native = JSON.parse(nb);
const ib = await readFile(inputFile),
  inputs = JSON.parse(ib);
assert.equal(hash(ib), native.source.inputHash);
assert.equal(
  await sourceHash(path.join(referenceRoot, 'games/magic/src')),
  native.source.beforeRenderer,
);
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), native.source.afterRenderer);
assert.equal(native.completed, 899);
assert.equal(native.faces.length, 114);
assert.deepEqual(native.faults, []);
const listed = async (directory) =>
  (await readdir(path.join(directory, 'games/magic/src'), { recursive: true, withFileTypes: true }))
    .filter((e) => e.isFile() && /\.(?:ts|mjs|css|json)$/.test(e.name))
    .map((e) => path.relative(directory, path.join(e.parentPath, e.name)))
    .sort();
const names = await listed(root);
assert.deepEqual(names, await listed(referenceRoot));
const files = {};
for (const file of names) {
  const before = await readFile(path.join(referenceRoot, file)),
    after = await readFile(path.join(root, file));
  if (hash(before) !== hash(after))
    files[file] = { before: hash(before), after: hash(after), beforeSource: before.toString() };
}
assert.deepEqual(Object.keys(files), [
  'games/magic/src/data/generated-manifest.json',
  'games/magic/src/presentation/retro-dual-frame.ts',
  'games/magic/src/presentation/retro-paint.ts',
]);
// Freeze only source identities already recorded under these exact file names.
// The older ancestry readers still verify their own immutable receipts.
const history = new Map(Object.keys(files).map((f) => [f, new Set()]));
const collect = (value) => {
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) {
    if (history.has(value[0]) && /^[a-f0-9]{64}$/.test(value[1] ?? ''))
      history.get(value[0]).add(value[1]);
    for (const item of value) collect(item);
    return;
  }
  for (const [key, entry] of Object.entries(value)) {
    if (history.has(key)) {
      const add = (v) => {
        if (typeof v === 'string' && /^[a-f0-9]{64}$/.test(v)) history.get(key).add(v);
      };
      if (typeof entry === 'string') add(entry);
      else if (entry && typeof entry === 'object') {
        for (const name of ['before', 'after', 'sha256']) add(entry[name]);
        for (const v of entry.historicalHashes ?? []) add(v);
        if (typeof entry.beforeSource === 'string') add(hash(entry.beforeSource));
      }
    }
    collect(entry);
  }
};
const fixtureBase = path.join(referenceRoot, 'games/magic/fixtures/accuracy');
for (const item of await readdir(fixtureBase, { recursive: true, withFileTypes: true })) {
  if (!item.isFile() || !/\.json(?:\.gz)?$/.test(item.name)) continue;
  if (
    item.name.endsWith('.gz') &&
    !/(?:source|metadata|compatibility|printing-artist-data-delta)/.test(item.name)
  )
    continue;
  const bytes = await readFile(path.join(item.parentPath, item.name));
  collect(JSON.parse(item.name.endsWith('.gz') ? gunzipSync(bytes) : bytes));
}
for (const [file, entry] of Object.entries(files))
  entry.historicalHashes = [...history.get(file)].sort();
const members = native.rows
  .filter((r) => r.affected)
  .map((r) => ({ ...r, face: inputs.entries.find((e) => e.id === r.id).face }));
assert.equal(members.length, 19);
const base = 'games/magic/fixtures/accuracy/early-through-fourth/';
const nf = base + 'abu-perimeter-native.json.gz',
  nz = gzipSync(nb, { mtime: 0 });
await writeFile(nf, nz);
const p = {
  schema: 1,
  beforeRenderer: native.source.beforeRenderer,
  afterRenderer: native.source.afterRenderer,
  scope:
    'Shared Alpha/Beta ordinary dual-land outer perimeter translated up two canonical pixels only. The exact two-file painter/cache edit and generated source-metadata change are reversible; historical source reconstruction is not calibration approval. Original and both Oracle symbol modes retain interior pixels, silhouette and default etching. Other880 Original faces and their face/etching identities remain exact. Existing art, rules, title, artist, source pigments and scan transforms are fixed.',
  files,
  members,
  native: {
    file: nf,
    sha256: hash(nz),
    contentSha256: hash(nb),
    tool: 'games/magic/tools/accuracy/abu-perimeter-native.mjs',
    toolSha256: hash(await readFile(new URL('./abu-perimeter-native.mjs', import.meta.url))),
  },
  toolHash: hash(await readFile(new URL(import.meta.url))),
};
const b = gzipSync(Buffer.from(JSON.stringify(p) + '\n'), { mtime: 0 }),
  f = base + 'abu-perimeter-source-delta.json.gz';
await writeFile(f, b);
console.log(
  JSON.stringify({ file: f, sha256: hash(b), before: p.beforeRenderer, after: p.afterRenderer }),
);
