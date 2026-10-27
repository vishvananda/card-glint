// Exact Fourth body-class replay; scan poses never enter the painter.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
const [
  inputFile,
  beforeFile,
  afterFile,
  prototypeDirectory,
  selectedFile,
  darkBeforeFile,
  darkAfterFile,
  output,
] = process.argv.slice(2);
assert(
  output,
  'Usage: fourth-nonland-native-review.mjs INPUTS BEFORE AFTER PROTOTYPES SELECTED DARK_BEFORE DARK_AFTER NEW_OUTPUT',
);
const files = [
  inputFile,
  beforeFile,
  afterFile,
  path.join(prototypeDirectory, 'study.json'),
  selectedFile,
  darkBeforeFile,
  darkAfterFile,
];
const raw = await Promise.all(files.map((f) => fs.readFile(f)));
const [inputs, before, after, prototype, selected, darkBefore, darkAfter] = raw.map((b) =>
  JSON.parse(b),
);
const modes = ['original', 'oracle', 'oracle-modern', 'etching'];
assert.equal(inputs.entries.length, 378);
assert.equal(selected.length, 37);
assert.equal(new Set(selected).size, 37);
assert.equal(before.inputHash, hash(raw[0]));
assert.equal(after.inputHash, hash(raw[0]));
assert.equal(prototype.rendererHash, before.rendererHash);
for (const c of [before, after, darkBefore, darkAfter]) {
  assert.equal(c.status, 'complete');
  assert.deepEqual(c.faults, []);
}
assert.equal(after.rows.length, 378);
assert.equal(before.rows.length, 378);
assert.deepEqual(after.rows.map((r) => r.id).sort(), inputs.entries.map((e) => e.id).sort());
await fs.writeFile(output, JSON.stringify({ status: 'running' }), { flag: 'wx' });
async function bytes(file, mode) {
  const b = await fs.readFile(path.join(path.dirname(file), mode.file));
  assert.equal(hash(b), mode.sha256);
  return b;
}
function difference(bb, ab) {
  const a = PNG.sync.read(ab),
    b = PNG.sync.read(bb);
  assert.deepEqual([a.width, a.height], [b.width, b.height]);
  let changed = 0,
    outside = 0,
    alpha = 0;
  for (let p = 0; p < a.width * a.height; p++) {
    const i = 4 * p;
    if (a.data[i + 3] !== b.data[i + 3]) alpha++;
    if (
      a.data[i] !== b.data[i] ||
      a.data[i + 1] !== b.data[i + 1] ||
      a.data[i + 2] !== b.data[i + 2]
    ) {
      changed++;
      const x = p % a.width,
        y = Math.floor(p / a.width);
      if (x < 90 || x >= 645 || y < 607 || y >= 910) outside++;
    }
  }
  return { changed, outside, alpha };
}
const content = (l) => l?.lines.join('').replace(/\s/g, '');
const rows = [],
  counts = Object.fromEntries(modes.map((m) => [m, { changed: 0, unchanged: 0, keysChanged: 0 }]));
for (const e of inputs.entries) {
  const b = before.rows.find((r) => r.id === e.id),
    a = after.rows.find((r) => r.id === e.id);
  assert.equal(b.artHash, e.art.sha256);
  assert.equal(a.artHash, b.artHash);
  assert.equal(b.referenceHash, e.reference.sha256);
  assert.equal(a.referenceHash, b.referenceHash);
  const scoped = selected.includes(e.id),
    observations = {};
  for (const mode of modes) {
    const old = b.modes[mode],
      n = a.modes[mode];
    const bb = await bytes(beforeFile, old),
      ab = await bytes(afterFile, n);
    assert.equal(old.inputHash, n.inputHash);
    assert.equal(content(old.layout), content(n.layout), 'Wording changed: ' + e.name + ' ' + mode);
    if (n.layout) assert.equal(n.layout.overflow, false);
    else assert.equal(old.layout, null);
    const changed = old.sha256 !== n.sha256;
    counts[mode][changed ? 'changed' : 'unchanged']++;
    if (old.keyHash !== n.keyHash) counts[mode].keysChanged++;
    if (mode === 'original') assert.equal(changed, scoped);
    if (mode === 'etching' || e.face.land) assert(!changed);
    const delta = changed ? difference(bb, ab) : { changed: 0, outside: 0, alpha: 0 };
    assert.equal(delta.outside, 0);
    assert.equal(delta.alpha, 0);
    let prototypeHash;
    if (scoped && mode === 'original') {
      const p = prototype.rows.find((r) => r.id === e.id);
      const pb = await fs.readFile(path.join(prototypeDirectory, e.id + '-candidate.png'));
      prototypeHash = hash(pb);
      assert.equal(p.candidateHash, prototypeHash);
      assert.equal(n.sha256, prototypeHash, 'Native/prototype mismatch: ' + e.name);
      assert.equal(p.replayDifference, 0);
    }
    observations[mode] = {
      before: old.sha256,
      after: n.sha256,
      beforeKey: old.keyHash,
      afterKey: n.keyHash,
      ...delta,
      ...(prototypeHash ? { prototypeHash } : {}),
    };
  }
  rows.push({
    id: e.id,
    name: e.name,
    scoped,
    land: !!e.face.land,
    referenceHash: e.reference.sha256,
    artHash: e.art.sha256,
    inputHash: hash(JSON.stringify(e.face)),
    modes: observations,
  });
  if (rows.length % 50 === 0) console.log('Fourth nonland isolation', rows.length, '/378');
}
assert.deepEqual(Object.fromEntries(modes.map((m) => [m, counts[m].changed])), {
  original: 37,
  oracle: 106,
  'oracle-modern': 106,
  etching: 0,
});
assert.equal(darkBefore.rows.length, 122);
assert.equal(darkAfter.rows.length, 122);
assert.equal(darkBefore.inputHash, darkAfter.inputHash);
assert.equal(darkAfter.rendererHash, after.rendererHash);
const darkRows = [];
for (const b of darkBefore.rows) {
  const a = darkAfter.rows.find((r) => r.id === b.id);
  assert(a);
  assert.equal(a.artHash, b.artHash);
  assert.equal(a.referenceHash, b.referenceHash);
  const checked = {};
  for (const mode of modes) {
    const old = b.modes[mode],
      n = a.modes[mode];
    await bytes(darkBeforeFile, old);
    await bytes(darkAfterFile, n);
    assert.equal(n.sha256, old.sha256);
    assert.equal(n.inputHash, old.inputHash);
    assert.deepEqual(n.layout, old.layout);
    checked[mode] = n.sha256;
  }
  darkRows.push({ id: b.id, modes: checked });
}
await writeJson(output, {
  schema: 1,
  set: '4ed',
  status: 'complete-native-fourth-nonland-isolation',
  scope:
    'All378 Original/Oracle/modern-symbol/etching variants;37 Original bodies exactly match the exploratory prototype. All lands,etching,wording,art,frame and alpha unchanged.122 Dark printings×4 modes are pixel/layout controls. This is reused development evidence,not full-set certification.',
  beforeRenderer: before.rendererHash,
  afterRenderer: after.rendererHash,
  inputHash: hash(raw[0]),
  originals: 378,
  nativeVariants: 1512,
  ids: [...selected].sort(),
  counts,
  rows,
  darkControls: { printings: 122, nativeVariants: 488, changed: 0, rows: darkRows },
  sources: Object.fromEntries(files.map((f, i) => [i, hash(raw[i])])),
  toolHash: hash(await fs.readFile(new URL(import.meta.url))),
});
