// Verify a production semantic-detail change against native controls and its prototype.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { hash, sourceHash, writeJson } from './common.mjs';
import { verifyMetadataRefresh } from './abu-metadata-refresh.mjs';
const [inputsFile, beforeFile, afterFile, prototypeFile, output, metadataFile] =
  process.argv.slice(2);
assert(
  output,
  'Usage: fourth-details-native-review.mjs INPUTS BEFORE_CAPTURE AFTER_CAPTURE PROTOTYPE_STUDY NEW_OUTPUT',
);
const files = [inputsFile, beforeFile, afterFile, prototypeFile],
  raw = await Promise.all(files.map((f) => fs.readFile(f)));
const [inputs, before, after, prototype] = raw.map((b) => JSON.parse(b));
assert.equal(inputs.set, '4ed');
assert.equal(inputs.entries.length, 378);
assert.equal(before.status, 'complete');
assert.equal(after.status, 'complete');
assert.equal(before.inputHash, hash(raw[0]));
assert.equal(after.inputHash, hash(raw[0]));
assert.equal(prototype.baselineHash, hash(raw[1]));
assert.equal(prototype.inputHash, hash(raw[0]));
assert.equal(prototype.rendererHash, before.rendererHash);
let metadataRefresh;
const currentRenderer = await sourceHash('games/magic/src');
if (metadataFile) {
  const proof = JSON.parse(await fs.readFile(metadataFile));
  metadataRefresh = await verifyMetadataRefresh('games/magic/src', proof);
  assert.equal(after.rendererHash, metadataRefresh.beforeRendererHash);
  assert.equal(currentRenderer, metadataRefresh.afterRendererHash);
} else assert.equal(after.rendererHash, currentRenderer);
const ids = prototype.rows
  .filter((r) => r.changed)
  .map((r) => r.id)
  .sort();
assert.equal(ids.length, 7);
const counts = Object.fromEntries(
  ['original', 'oracle', 'oracle-modern', 'etching'].map((m) => [
    m,
    { changed: 0, unchanged: 0, keysChanged: 0 },
  ]),
);
const region = [510, 24, 201, 87],
  rows = [];
for (const e of inputs.entries) {
  const b = before.rows.find((n) => n.id === e.id),
    a = after.rows.find((n) => n.id === e.id),
    p = prototype.rows.find((n) => n.id === e.id),
    scoped = ids.includes(e.id);
  assert(b && a && p);
  assert.equal(a.referenceHash, e.reference.sha256);
  assert.equal(a.artHash, e.art.sha256);
  assert.equal(b.referenceHash, a.referenceHash);
  assert.equal(b.artHash, a.artHash);
  const row = {
    id: e.id,
    name: e.name,
    referenceHash: e.reference.sha256,
    artHash: e.art.sha256,
    inputHash: hash(JSON.stringify(e.face)),
    scoped,
    modes: {},
  };
  assert.equal(b.modes.original.inputHash, row.inputHash);
  for (const mode of Object.keys(counts)) {
    const x = b.modes[mode],
      y = a.modes[mode];
    assert.equal(x.inputHash, y.inputHash);
    assert(!(x.layout?.overflow ?? false));
    assert(!(y.layout?.overflow ?? false));
    const xb = await fs.readFile(path.join(path.dirname(beforeFile), x.file)),
      yb = await fs.readFile(path.join(path.dirname(afterFile), y.file));
    assert.equal(hash(xb), x.sha256);
    assert.equal(hash(yb), y.sha256);
    const changed = x.sha256 !== y.sha256,
      keyChanged = x.keyHash !== y.keyHash;
    assert.equal(changed, scoped && mode === 'original', e.name + '/' + mode);
    assert.equal(keyChanged, changed, 'Incorrect scoped key change ' + e.name + '/' + mode);
    counts[mode][changed ? 'changed' : 'unchanged']++;
    if (keyChanged) counts[mode].keysChanged++;
    let pixels = 0,
      outside = 0,
      alpha = 0;
    if (changed) {
      const a = PNG.sync.read(xb),
        b = PNG.sync.read(yb);
      assert.equal(a.width, 732);
      assert.equal(a.height, 1020);
      assert.equal(b.width, a.width);
      assert.equal(b.height, a.height);
      for (let i = 0; i < a.data.length; i += 4) {
        const x = (i / 4) % 732,
          y = Math.floor(i / 4 / 732);
        if (a.data[i + 3] !== b.data[i + 3]) alpha++;
        if (
          a.data[i] !== b.data[i] ||
          a.data[i + 1] !== b.data[i + 1] ||
          a.data[i + 2] !== b.data[i + 2]
        ) {
          pixels++;
          if (
            x < region[0] ||
            x >= region[0] + region[2] ||
            y < region[1] ||
            y >= region[1] + region[3]
          )
            outside++;
        }
      }
      assert.equal(outside, 0, 'Changed pixels outside cost band ' + e.name);
      assert.equal(alpha, 0);
      assert.equal(y.sha256, p.after, 'Production does not match prototype ' + e.name);
      row.prototypeHash = p.after;
    }
    row.modes[mode] = {
      before: x.sha256,
      after: y.sha256,
      beforeKey: x.keyHash,
      afterKey: y.keyHash,
      pixels,
      outside,
      alpha,
    };
  }
  rows.push(row);
}
assert.deepEqual(counts.original, { changed: 7, unchanged: 371, keysChanged: 7 });
for (const mode of ['oracle', 'oracle-modern', 'etching'])
  assert.deepEqual(counts[mode], { changed: 0, unchanged: 378, keysChanged: 0 });
assert.deepEqual(
  await Promise.all(files.map(async (f) => hash(await fs.readFile(f)))),
  raw.map(hash),
);
await writeJson(output, {
  schema: 1,
  set: '4ed',
  status: 'complete-native-semantic-details-isolation',
  beforeRenderer: before.rendererHash,
  afterRenderer: currentRenderer,
  capturedRenderer: after.rendererHash,
  ...(metadataRefresh ? { metadataRefresh } : {}),
  nativeVariants: 1512,
  ids,
  costRegionNative: region,
  counts,
  source: Object.fromEntries(
    ['inputs', 'beforeCapture', 'afterCapture', 'prototype'].map((k, i) => [k, hash(raw[i])]),
  ),
  toolHash: hash(await fs.readFile(new URL(import.meta.url))),
  scope:
    'Seven Original Enchant Land cost bands match the independent prototype exactly. All371 other Original PNGs,all Oracle PNGs,both symbol modes and etching masks retain exact bytes and keys. No words,frames,art,body text or footer pixels change.',
  rows,
});
console.log(counts);
