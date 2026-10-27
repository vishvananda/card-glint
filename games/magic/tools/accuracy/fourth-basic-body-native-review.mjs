// Check a data-only Fourth basic-land body integration against complete native captures.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
const [inputFile, beforeFile, historicalFile, afterFile, prototypeDirectory, proposalFile, output] =
  process.argv.slice(2);
assert(
  output,
  'Usage: fourth-basic-body-native-review.mjs INPUTS BEFORE_ORIGINAL HISTORICAL_VARIANTS AFTER_VARIANTS PROTOTYPE_DIRECTORY PROPOSAL NEW_OUTPUT',
);
const files = [
    inputFile,
    beforeFile,
    historicalFile,
    afterFile,
    path.join(prototypeDirectory, 'study.json'),
    proposalFile,
  ],
  bytes = await Promise.all(files.map((f) => fs.readFile(f))),
  [inputs, before, historical, after, prototype, proposal] = bytes.map((b) => JSON.parse(b));
assert.equal(inputs.set, '4ed');
assert.equal(inputs.entries.length, 378);
const ids = inputs.entries.map((e) => e.id).sort(),
  changedIds = proposal.rows.map((r) => r.id).sort();
assert.equal(changedIds.length, 15);
assert.equal(new Set(changedIds).size, 15);
for (const capture of [before, historical, after]) {
  assert.equal(capture.status, 'complete');
  assert.deepEqual(capture.faults, []);
  assert.equal(capture.inputHash, hash(bytes[0]));
  assert.deepEqual(capture.rows.map((r) => r.id).sort(), ids);
}
assert.equal(before.rendererHash, proposal.rendererHash);
assert.equal(prototype.rendererHash, proposal.rendererHash);
assert.equal(prototype.status, 'complete-exploratory');
assert.deepEqual(prototype.rows.map((r) => r.id).sort(), changedIds);
await fs.writeFile(output, JSON.stringify({ status: 'running' }), { flag: 'wx' });
const rows = [],
  counts = Object.fromEntries(
    ['original', 'oracle', 'oracle-modern', 'etching'].map((m) => [
      m,
      { changed: 0, unchanged: 0, keysChanged: 0 },
    ]),
  );
async function png(captureFile, id, m) {
  const p = path.join(path.dirname(captureFile), m.file),
    b = await fs.readFile(p);
  assert.equal(hash(b), m.sha256, id + ' changed native file');
  return b;
}
function diff(a, b, rect) {
  assert.deepEqual([a.width, a.height], [b.width, b.height]);
  let changed = 0,
    outside = 0,
    alpha = 0,
    max = 0;
  for (let p = 0; p < a.width * a.height; p++) {
    const i = p * 4;
    if (a.data[i + 3] !== b.data[i + 3]) alpha++;
    let n = 0;
    for (let k = 0; k < 3; k++) n = Math.max(n, Math.abs(a.data[i + k] - b.data[i + k]));
    if (n) {
      changed++;
      max = Math.max(max, n);
      const x = p % a.width,
        y = Math.floor(p / a.width);
      if (x < rect[0] || y < rect[1] || x >= rect[0] + rect[2] || y >= rect[1] + rect[3]) outside++;
    }
  }
  return { changed, outside, alpha, max };
}
for (const e of inputs.entries) {
  const b = before.rows.find((r) => r.id === e.id),
    h = historical.rows.find((r) => r.id === e.id),
    a = after.rows.find((r) => r.id === e.id),
    isBasic = changedIds.includes(e.id);
  assert.equal(e.face.wordingMode, 'original');
  for (const r of [b, h, a]) {
    assert.equal(r.referenceHash, e.reference.sha256);
    assert.equal(r.artHash, e.art.sha256);
  }
  const actualBefore = await png(beforeFile, e.id, b.modes.original);
  assert.equal(
    b.modes.original.sha256,
    h.modes.original.sha256,
    'Historical/current Original baseline differs',
  );
  assert.deepEqual(b.modes.original.layout, h.modes.original.layout);
  const modes = {};
  for (const mode of Object.keys(counts)) {
    const old = h.modes[mode],
      next = a.modes[mode];
    assert(old && next);
    assert.equal(old.inputHash, next.inputHash);
    const priorBytes = mode === 'original' ? actualBefore : await png(historicalFile, e.id, old),
      nextBytes = await png(afterFile, e.id, next);
    const changed = old.sha256 !== next.sha256;
    counts[mode][changed ? 'changed' : 'unchanged']++;
    if ((mode === 'original' ? b.modes.original.keyHash : old.keyHash) !== next.keyHash)
      counts[mode].keysChanged++;
    if (changed)
      assert(
        isBasic && (mode === 'original' || mode === 'etching'),
        'Changed an unrelated face ' + e.name + ' ' + mode,
      );
    let delta = { changed: 0, outside: 0, alpha: 0, max: 0 };
    if (changed)
      delta = diff(PNG.sync.read(priorBytes), PNG.sync.read(nextBytes), [90, 622, 555, 280]);
    assert.equal(delta.outside, 0);
    assert.equal(delta.alpha, 0);
    if (!changed && !(isBasic && mode === 'etching')) assert.deepEqual(old.layout, next.layout);
    if (isBasic && mode === 'etching') assert.deepEqual(next.layout, a.modes.original.layout);
    let prototypeHash;
    if (isBasic && mode === 'original') {
      const pr = prototype.rows.find((r) => r.id === e.id),
        pbytes = await fs.readFile(path.join(prototypeDirectory, e.id + '-best.png'));
      prototypeHash = hash(pbytes);
      assert.equal(pr.replayDifference, 0);
      assert.equal(pr.baselineHash, b.modes.original.sha256);
      assert.equal(prototypeHash, next.sha256, 'Shared prototype and native body differ ' + e.name);
      const selected = pr.trials.find((t) => t.id === 'selected' || t.candidate?.id === 'selected');
      assert(selected);
      for (const k of ['size', 'x', 'top', 'width', 'height'])
        assert.equal(next.layout[k], selected.layout[k]);
      assert.equal(next.layout.size, 25);
      assert.equal(next.layout.lines.length, 1);
      assert.equal(next.layout.overflow, false);
    }
    modes[mode] = {
      before: old.sha256,
      after: next.sha256,
      beforeKey: mode === 'original' ? b.modes.original.keyHash : old.keyHash,
      afterKey: next.keyHash,
      ...delta,
      ...(prototypeHash ? { prototypeHash } : {}),
    };
  }
  rows.push({
    id: e.id,
    name: e.name,
    referenceHash: e.reference.sha256,
    artHash: e.art.sha256,
    inputHash: hash(JSON.stringify(e.face)),
    basic: isBasic,
    modes,
  });
  if (rows.length % 50 === 0) console.log('Body native isolation', rows.length, '/', ids.length);
}
assert.deepEqual(counts.original.changed, 15);
assert.equal(counts.oracle.changed, 0);
assert.equal(counts['oracle-modern'].changed, 0);
await writeJson(output, {
  schema: 1,
  set: '4ed',
  status: 'complete-native-fourth-basic-body-isolation',
  scope:
    'All378 original inputs and1512 native after variants. All current before Original faces also equal the archived baseline. Only15 one-line basic-land bodies may change; every Original candidate matches the shared native-font prototype. Oracle variants,artist/art/frame/alpha and unrelated printings are checked independently. This is regional integration evidence,not printed-interior normalization or complete-set certification.',
  beforeRenderer: before.rendererHash,
  historicalRenderer: historical.rendererHash,
  afterRenderer: after.rendererHash,
  inputHash: hash(bytes[0]),
  sources: Object.fromEntries(
    ['inputs', 'before', 'historical', 'after', 'prototype', 'proposal'].map((k, i) => [
      k,
      hash(bytes[i]),
    ]),
  ),
  toolHash: hash(await fs.readFile(new URL(import.meta.url))),
  originals: 378,
  nativeVariants: 1512,
  ids: changedIds,
  counts,
  rows,
});
console.log('Fourth native body verified', JSON.stringify(counts));
