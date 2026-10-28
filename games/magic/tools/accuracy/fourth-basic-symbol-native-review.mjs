import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { createServer } from 'vite';
import { hash, sourceHash, root, writeJson } from './common.mjs';
const [inputsFile, beforeFile, afterFile, prototypeFile, out] = process.argv.slice(2);
assert(out, 'Use INPUTS BEFORE_CAPTURE AFTER_CAPTURE SHARED_PROTOTYPE OUTPUT');
const raw = await Promise.all(
  [inputsFile, beforeFile, afterFile, prototypeFile].map((f) => fs.readFile(f)),
);
const [input, before, after, prototype] = raw.map((b) => JSON.parse(b));
assert.equal(input.entries.length, 492);
for (const c of [before, after]) {
  assert.equal(c.status, 'complete');
  assert.deepEqual(c.faults, []);
  assert.equal(c.inputHash, hash(raw[0]));
  assert.equal(c.rows.length, 492);
}
assert.equal(after.rendererHash, await sourceHash(root + '/games/magic/src'));
assert.equal(prototype.rendererHash, before.rendererHash);
assert.equal(prototype.captureHash, hash(raw[1]));
assert.equal(prototype.rows.length, 20);
const ssr = await createServer({
  root,
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
});
let keyIds;
try {
  await ssr.ssrLoadModule('/games/magic/src/data/eager.ts');
  const { usesFourthDefaults } = await ssr.ssrLoadModule(
    '/games/magic/src/calibration/selection.ts',
  );
  keyIds = new Set(
    input.entries
      .filter((e) => e.card.set === '4ed' || usesFourthDefaults(e.face))
      .map((e) => e.id),
  );
} finally {
  await ssr.close();
}
const ids = prototype.rows.map((r) => r.id).sort();
assert.equal(new Set(ids).size, 20);
const counts = Object.fromEntries(
  ['original', 'oracle', 'oracle-modern', 'etching'].map((m) => [
    m,
    { changed: 0, unchanged: 0, keysChanged: 0 },
  ]),
);
const rows = [],
  rect = [60, 468, 368, 48];
let decoded = 0,
  exact = 0;
for (const e of input.entries) {
  const b = before.rows.find((r) => r.id === e.id),
    a = after.rows.find((r) => r.id === e.id),
    p = prototype.rows.find((r) => r.id === e.id);
  assert(a && b);
  assert.equal(a.referenceHash, e.reference.sha256);
  assert.equal(a.artHash, e.art.sha256);
  const row = {
    id: e.id,
    set: e.card.set,
    name: e.name,
    referenceHash: e.reference.sha256,
    artHash: e.art.sha256,
    changedBody: !!p,
    modes: {},
  };
  for (const [mode, count] of Object.entries(counts)) {
    const x = b.modes[mode],
      y = a.modes[mode];
    assert.equal(x.inputHash, y.inputHash);
    assert.deepEqual(x.layout, y.layout, e.name + '/' + mode + ' text layout changed');
    const xb = await fs.readFile(path.join(path.dirname(beforeFile), x.file)),
      yb = await fs.readFile(path.join(path.dirname(afterFile), y.file));
    assert.equal(hash(xb), x.sha256);
    assert.equal(hash(yb), y.sha256);
    const changed = x.sha256 !== y.sha256,
      keyChanged = x.keyHash !== y.keyHash;
    assert.equal(
      changed,
      !!p && mode === 'original',
      e.name + '/' + mode + ' unexpected pixel change',
    );
    assert.equal(keyChanged, keyIds.has(e.id), e.name + '/' + mode + ' wrong revision scope');
    count[changed ? 'changed' : 'unchanged']++;
    count.keysChanged += Number(keyChanged);
    const v = {
      before: x.sha256,
      after: y.sha256,
      beforeKey: x.keyHash,
      afterKey: y.keyHash,
      inputHash: y.inputHash,
      changedPixels: 0,
      outside: 0,
      alpha: 0,
    };
    if (changed) {
      assert.equal(p.modes.current.sha256, x.sha256);
      assert.equal(
        p.modes.shared.sha256,
        y.sha256,
        'Native profile differs from measured prototype',
      );
      assert.equal(p.modes.shared.keyHash, y.keyHash, 'Native profile key differs from prototype');
      const old = PNG.sync.read(xb),
        current = PNG.sync.read(yb);
      decoded += 2;
      assert.equal(old.width, 732);
      assert.equal(old.height, 1020);
      assert.equal(current.width, 732);
      assert.equal(current.height, 1020);
      for (let i = 0; i < old.data.length; i += 4) {
        if (old.data[i + 3] !== current.data[i + 3]) v.alpha++;
        if (
          old.data[i] === current.data[i] &&
          old.data[i + 1] === current.data[i + 1] &&
          old.data[i + 2] === current.data[i + 2] &&
          old.data[i + 3] === current.data[i + 3]
        )
          continue;
        v.changedPixels++;
        const x = (i / 4) % 732,
          y = Math.floor(i / 4 / 732);
        if (
          x < rect[0] * 1.5 ||
          x >= (rect[0] + rect[2]) * 1.5 ||
          y < rect[1] * 1.5 ||
          y >= (rect[1] + rect[3]) * 1.5
        )
          v.outside++;
      }
      assert.equal(v.outside, 0);
      assert.equal(v.alpha, 0);
    } else {
      assert(xb.equals(yb));
      exact++;
    }
    row.modes[mode] = v;
  }
  rows.push(row);
}
assert.deepEqual(counts.original, { changed: 20, unchanged: 472, keysChanged: keyIds.size });
for (const mode of ['oracle', 'oracle-modern', 'etching'])
  assert.deepEqual(counts[mode], { changed: 0, unchanged: 492, keysChanged: keyIds.size });
await writeJson(out, {
  schema: 1,
  status: 'complete-native-basic-symbol-profile-isolation',
  scope:
    '492 frozen cards and four variants. Exactly 15 Fourth and five inherited Ice Age Original bodies move only their symbols up 0.1 diameter; every changed native face and key equals its independent data-table prototype. All other native PNGs remain byte-exact. Revision7 changes only Fourth/inherited Ice keys; this is no whole-set approval.',
  beforeRenderer: before.rendererHash,
  afterRenderer: after.rendererHash,
  inputHash: hash(raw[0]),
  beforeCaptureHash: hash(raw[1]),
  afterCaptureHash: hash(raw[2]),
  prototypeHash: hash(raw[3]),
  originals: 492,
  nativeVariants: 1968,
  ids,
  allowedBodyRect: rect,
  exactPngPairs: exact,
  nativeImagesDecoded: decoded,
  counts,
  toolHash: hash(await fs.readFile(new URL(import.meta.url))),
  rows,
});
console.log(JSON.stringify({ counts, exactPngPairs: exact, nativeImagesDecoded: decoded }));
