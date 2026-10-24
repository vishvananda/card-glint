// Freeze a typed one-printing data delta and its actual native output.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { gunzipSync, gzipSync } from 'node:zlib';
import { root, hash, sourceHash } from './common.mjs';
import { validatePrintingArtistDelta } from './printing-artist-data-check.mjs';
const [beforeFile, nativeDir, referenceRoot] = process.argv.slice(2);
assert(
  referenceRoot,
  'Usage: record-printing-artist-delta.mjs BEFORE_SNAPSHOT NATIVE REFERENCE_ROOT',
);
const snapshot = JSON.parse(gunzipSync(await readFile(beforeFile)));
const nativeBytes = await readFile(path.join(nativeDir, 'proof.json')),
  native = JSON.parse(nativeBytes);
assert.equal(
  hash(await readFile(new URL('./abu-artist-native.mjs', import.meta.url))),
  native.tool,
);
assert.deepEqual(native.faults, []);
assert.equal(native.comparisons.length, 6);
for (const r of native.comparisons) {
  assert.equal(r.outside, 0);
  assert.equal(r.alpha, 0);
}
for (const r of native.rows)
  assert.equal(hash(await readFile(path.join(nativeDir, r.file))), r.sha256);
const beforeSource = Object.entries(snapshot)
  .filter(([f]) => f.startsWith('games/magic/src/'))
  .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
  .map(([f, b]) => [f.slice('games/magic/src/'.length), hash(Buffer.from(b, 'base64'))]);
assert.equal(hash(JSON.stringify(beforeSource)), native.beforeRenderer);
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), native.afterRenderer);
const currentFiles = (
  await readdir(path.join(root, 'games/magic/src'), { recursive: true, withFileTypes: true })
)
  .filter((e) => e.isFile() && /\.(?:ts|mjs|css|json)$/.test(e.name))
  .map((e) => path.relative(path.join(root, 'games/magic/src'), path.join(e.parentPath, e.name)))
  .sort();
assert.deepEqual(
  currentFiles,
  beforeSource.map(([f]) => f),
);
const files = {},
  after = {};
for (const [file, b64] of Object.entries(snapshot)) {
  const before = Buffer.from(b64, 'base64'),
    bytes = await readFile(path.join(root, file));
  if (hash(before) === hash(bytes)) continue;
  files[file] = { before: hash(before), after: hash(bytes), beforeSource: before.toString() };
  after[file] = bytes.toString();
}
const sharedAssets = {};
for (const file of ['games/magic/assets.json', 'games/magic/fonts.css']) {
  const a = await readFile(path.join(referenceRoot, file)),
    b = await readFile(path.join(root, file));
  assert.deepEqual(a, b);
  sharedAssets[file] = hash(b);
}
const browserHash = await sourceHash(path.join(root, 'packages/browser/src'));
assert.equal(browserHash, await sourceHash(path.join(referenceRoot, 'packages/browser/src')));
const base = 'games/magic/fixtures/accuracy/early-through-fourth/';
const nativeFile = base + 'abu-tropical-artist-native.json.gz',
  z = gzipSync(nativeBytes, { mtime: 0 });
await writeFile(path.join(root, nativeFile), z);
const proof = {
  schema: 1,
  set: 'lea',
  id: native.id,
  artist: 'Mark Poole',
  previousArtist: 'Jesper Myrfors',
  referenceHash: native.referenceHash,
  beforeRenderer: native.beforeRenderer,
  afterRenderer: native.afterRenderer,
  browserHash,
  sharedAssets,
  files,
  native: { file: nativeFile, sha256: hash(z), contentSha256: hash(nativeBytes) },
  toolHash: hash(await readFile(new URL(import.meta.url))),
  scope:
    'One source-reviewed physical credit only. All previous wording/artist records remain exact; no painter, geometry, font, illustration, calibration or scan data changes. Historical-source restoration is not approval of the changed artist/full-card result.',
};
proof.summary = validatePrintingArtistDelta(proof, after);
const bytes = gzipSync(Buffer.from(JSON.stringify(proof, null, 2) + '\n'), { mtime: 0 }),
  file = base + 'printing-artist-data-delta.json.gz';
await writeFile(path.join(root, file), bytes);
console.log(
  JSON.stringify({
    file,
    sha256: hash(bytes),
    summary: proof.summary,
    before: proof.beforeRenderer,
    after: proof.afterRenderer,
  }),
);
