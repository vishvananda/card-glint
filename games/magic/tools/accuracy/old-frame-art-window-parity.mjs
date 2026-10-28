// Verify that moving only the art aperture preserves all lower-card pixels.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
const [parentDirectory, candidateDirectory, profileFile, out] = process.argv.slice(2);
assert(out, 'Use PARENT_NATIVE_DIRECTORY CANDIDATE_NATIVE_DIRECTORY PROFILE NEW_OUTPUT');
const raw = await Promise.all(
  [
    path.join(parentDirectory, 'capture.json'),
    path.join(candidateDirectory, 'capture.json'),
    profileFile,
  ].map((f) => fs.readFile(f)),
);
const [parent, candidate, profile] = raw.map((b) => JSON.parse(b));
assert(parent.complete && candidate.complete);
assert.deepEqual(parent.faults, []);
assert.deepEqual(candidate.faults, []);
assert.equal(parent.set, candidate.set);
assert.equal(profile.set, candidate.set);
assert.equal(parent.source.inputHash, candidate.source.inputHash);
assert.equal(parent.source.posesHash, candidate.source.posesHash);
assert.equal(candidate.source.profileHash, hash(raw[2]));
assert.equal(parent.rows.length, candidate.rows.length);
assert.equal(new Set(candidate.rows.map((r) => r.id)).size, candidate.rows.length);
const rows = [];
for (const row of candidate.rows) {
  const old = parent.rows.find((r) => r.id === row.id);
  assert(old);
  assert.equal(old.key, row.key);
  assert.equal(old.referenceHash, row.referenceHash);
  assert.equal(old.inputHash, row.inputHash);
  assert.equal(row.profileHash, hash(JSON.stringify(profile)));
  for (const f of [old.file, row.file]) assert.match(f, /^[a-z0-9-]+\.png$/i);
  const bytes = await Promise.all([
    fs.readFile(path.join(parentDirectory, old.file)),
    fs.readFile(path.join(candidateDirectory, row.file)),
  ]);
  assert.equal(hash(bytes[0]), old.sha256);
  assert.equal(hash(bytes[1]), row.sha256);
  const [a, b] = bytes.map((p) => PNG.sync.read(p));
  assert.equal(a.width, b.width);
  assert.equal(a.height, b.height);
  const key = /^[WUBRG]L$/.test(row.key) ? 'L-' + row.key[0] : row.key,
    frame = profile.frames[key];
  assert(frame?.artWindow);
  // Two native pixels exclude only the clipping antialias support at the anchor.
  const firstRow =
    Math.floor((frame.frame[1] + frame.frame[3] * frame.artWindow.lowerAnchor) * b.height) + 2;
  assert(firstRow > 0 && firstRow < b.height);
  let changed = 0;
  for (let i = firstRow * b.width * 4; i < b.data.length; i += 4)
    if (
      a.data[i] !== b.data[i] ||
      a.data[i + 1] !== b.data[i + 1] ||
      a.data[i + 2] !== b.data[i + 2] ||
      a.data[i + 3] !== b.data[i + 3]
    )
      changed++;
  rows.push({
    id: row.id,
    key: row.key,
    parentHash: old.sha256,
    nativeHash: row.sha256,
    firstRow,
    changed,
  });
}
await writeJson(out, {
  schema: 1,
  status: rows.some((r) => r.changed) ? 'failed-lower-pixel-parity' : 'unchanged-below-art-anchor',
  scope:
    'Exact native RGBA comparison below the profile source anchor, excluding two raster pixels of clip antialias support. All captured printings are included, even rejected scan poses. No scan resampling.',
  sources: {
    parent: hash(raw[0]),
    candidate: hash(raw[1]),
    profile: hash(raw[2]),
    toolHash: hash(await fs.readFile(new URL(import.meta.url))),
  },
  count: rows.length,
  changed: rows.filter((r) => r.changed).length,
  rows,
});
assert.equal(rows.filter((r) => r.changed).length, 0, 'Art-window adjustment changed lower pixels');
console.log(candidate.set, rows.length, 'unchanged below the art anchor');
