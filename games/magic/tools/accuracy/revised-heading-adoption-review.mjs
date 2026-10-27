// Validate native heading adoption against the independently replayed source prototype.
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs/promises';
import { PNG } from 'pngjs';
import { root, hash, sourceHash, writeJson } from './common.mjs';
const [inputFile, beforeDir, afterDir, prototypeDir, output] = process.argv.slice(2);
assert(
  output,
  'Usage: revised-heading-adoption-review.mjs INPUTS BEFORE AFTER PROTOTYPE NEW_OUTPUT',
);
const files = [
    inputFile,
    ...[beforeDir, afterDir, prototypeDir].map((d) => path.join(d, 'capture.json')),
  ],
  bytes = await Promise.all(files.map((f) => fs.readFile(f))),
  [inputs, before, after, prototype] = bytes.map((b) => JSON.parse(b));
for (const c of [before, after, prototype]) {
  assert.equal(c.status, 'complete');
  assert.deepEqual(c.faults, []);
  assert.equal(c.inputHash, hash(bytes[0]));
  assert.deepEqual(
    c.rows.map((r) => r.id),
    inputs.entries.map((e) => e.id),
  );
}
assert.equal(after.rendererHash, await sourceHash(path.join(root, 'games/magic/src')));
assert.equal(prototype.experiment.sourceRendererHash, before.rendererHash);
assert.equal(inputs.entries.length, 306);
await fs.writeFile(output, JSON.stringify({ status: 'running' }), { flag: 'wx' });
const rows = [],
  counts = {};
for (const e of inputs.entries) {
  const b = before.rows.find((r) => r.id === e.id),
    a = after.rows.find((r) => r.id === e.id),
    t = prototype.rows.find((r) => r.id === e.id),
    land = !!e.face.land,
    modes = {};
  assert.equal(e.face.wordingMode, 'original');
  for (const r of [a, t]) {
    assert.equal(r.referenceHash, b.referenceHash);
    assert.equal(r.artHash, b.artHash);
  }
  for (const [mode, actual] of Object.entries(a.modes)) {
    const previous = b.modes[mode],
      trial = t.modes[mode],
      images = await Promise.all(
        [
          [beforeDir, previous],
          [afterDir, actual],
          [prototypeDir, trial],
        ].map(async ([d, r]) => {
          const data = await fs.readFile(path.join(d, r.file));
          assert.equal(hash(data), r.sha256);
          return PNG.sync.read(data);
        }),
      ),
      [old, image] = images;
    assert.equal(actual.sha256, trial.sha256, 'Actual painter must equal the measured prototype');
    assert.equal(actual.inputHash, previous.inputHash);
    assert.equal(actual.inputHash, trial.inputHash);
    assert.deepEqual(actual.layout, previous.layout);
    assert.deepEqual(actual.layout, trial.layout);
    assert.equal(image.width, 732);
    assert.equal(image.height, 1020);
    assert.equal(old.width, image.width);
    assert.equal(old.height, image.height);
    const changed = actual.sha256 !== previous.sha256,
      keyChanged = actual.keyHash !== previous.keyHash,
      headings = [
        [30, 30, 432, 42],
        [32, 374, 430, 48],
      ].map((r) => r.map((v) => v * 1.5));
    let pixels = 0,
      outside = 0,
      alpha = 0,
      left = image.width,
      top = image.height,
      right = -1,
      bottom = -1;
    for (let y = 0; y < image.height; y++)
      for (let x = 0; x < image.width; x++) {
        const i = (y * image.width + x) * 4;
        if (old.data[i + 3] !== image.data[i + 3]) alpha++;
        if ([0, 1, 2].some((k) => old.data[i + k] !== image.data[i + k])) {
          pixels++;
          left = Math.min(left, x);
          top = Math.min(top, y);
          right = Math.max(right, x);
          bottom = Math.max(bottom, y);
          if (!headings.some(([a, b, w, h]) => x >= a && x < a + w && y >= b && y < b + h))
            outside++;
        }
      }
    assert.equal(alpha, 0);
    assert.equal(outside, 0, 'Only the printed heading bands may change');
    if (land || mode === 'etching') {
      assert(!changed);
      assert(!keyChanged);
    } else {
      assert(changed);
      assert(keyChanged);
      assert(pixels > 0);
    }
    const c = (counts[mode] ??= { changed: 0, unchanged: 0, keysChanged: 0 });
    c[changed ? 'changed' : 'unchanged']++;
    c.keysChanged += Number(keyChanged);
    modes[mode] = {
      before: previous.sha256,
      after: actual.sha256,
      prototype: trial.sha256,
      inputHash: actual.inputHash,
      changed,
      keyChanged,
      isolation: {
        pixels,
        outside,
        alpha,
        bounds: pixels ? [left, top, right - left + 1, bottom - top + 1] : null,
      },
    };
  }
  rows.push({
    id: e.id,
    name: e.name,
    land,
    referenceHash: b.referenceHash,
    artHash: b.artHash,
    modes,
  });
}
await writeJson(output, {
  schema: 1,
  status: 'native-revised-heading-adoption-isolation',
  scope:
    '306 frozen Original inputs and four render modes each. Actual output must exactly equal the independent measured prototype. Body layouts, input/art/reference identities,alpha and pixels outside heading bands are unchanged. All25lands and306etching outputs retain their pixels and keys. This is adoption isolation, not full-set certification.',
  rendererHash: after.rendererHash,
  beforeRenderer: before.rendererHash,
  sourceHashes: Object.fromEntries(
    files.map((f, i) => [i ? ['before', 'after', 'prototype'][i - 1] : 'inputs', hash(bytes[i])]),
  ),
  toolHash: hash(await fs.readFile(new URL(import.meta.url))),
  counts,
  rows,
  faults: [],
});
console.log(JSON.stringify(counts));
