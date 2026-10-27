// Exact source/native boundaries; no per-card renderer fitting.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { hash, sourceHash, writeJson } from './common.mjs';
const [inputsFile, beforeFile, extraBeforeFile, afterFile, prototypeFile, out] =
  process.argv.slice(2);
assert(
  out,
  'Usage: fourth-flavor-native-review.mjs INPUTS BEFORE EXTRA_ICE_BEFORE AFTER PROTOTYPE OUTPUT',
);
const files = [inputsFile, beforeFile, extraBeforeFile, afterFile, prototypeFile],
  raw = await Promise.all(files.map((f) => fs.readFile(f)));
const [inputs, before, extra, after, prototype] = raw.map((b) => JSON.parse(b));
for (const c of [before, extra, after]) {
  assert.equal(c.status, 'complete');
  assert.deepEqual(c.faults, []);
}
assert.equal(inputs.entries.length, 492);
assert.equal(after.rows.length, 492);
assert.equal(after.inputHash, hash(raw[0]));
assert.equal(after.rendererHash, await sourceHash('games/magic/src'));
assert.equal(before.rendererHash, extra.rendererHash);
assert.equal(prototype.rendererHash, before.rendererHash);
assert.equal(prototype.captureHash, hash(raw[1]));
assert.equal(prototype.status, 'complete-native-flavor-request-study');
assert.equal(prototype.rows.length, 19);
const old = new Map([...before.rows, ...extra.rows].map((r) => [r.id, r]));
const fourthIds = prototype.rows.map((r) => r.id).sort(),
  iceIds = extra.rows.map((r) => r.id).sort();
assert.equal(iceIds.length, 4);
const allowed = [53, 405, 392, 199],
  rows = [],
  counts = {};
const load = async (base, m) => {
  const bytes = await fs.readFile(path.join(path.dirname(base), m.file));
  assert.equal(hash(bytes), m.sha256);
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(bytes.readUInt32BE(16), 732);
  assert.equal(bytes.readUInt32BE(20), 1020);
  return bytes;
};
let exactPngPairs = 0,
  nativeImagesDecoded = 0;
for (const e of inputs.entries) {
  const a = after.rows.find((r) => r.id === e.id),
    b = old.get(e.id),
    scoped = fourthIds.includes(e.id) || iceIds.includes(e.id);
  assert(a && b);
  assert.equal(a.referenceHash, e.reference.sha256);
  assert.equal(b.referenceHash, e.reference.sha256);
  assert.equal(a.artHash, e.art.sha256);
  assert.equal(b.artHash, e.art.sha256);
  const modes = {};
  for (const [mode, m] of Object.entries(a.modes)) {
    const previous = b.modes[mode];
    assert(previous);
    assert.equal(m.inputHash, previous.inputHash);
    const [ab, bb] = await Promise.all([
      load(afterFile, m),
      load(iceIds.includes(e.id) ? extraBeforeFile : beforeFile, previous),
    ]);
    const same = m.sha256 === previous.sha256;
    const p = prototype.rows.find((r) => r.id === e.id);
    if (same) exactPngPairs++;
    let ap = null,
      bp = null;
    if (!same || (p && mode === 'original')) {
      ap = PNG.sync.read(ab);
      bp = same ? ap : PNG.sync.read(bb);
      nativeImagesDecoded += same ? 1 : 2;
    }
    let changed = 0,
      outside = 0,
      alpha = 0;
    const bounds = [Infinity, Infinity, -Infinity, -Infinity];
    if (!same)
      for (let i = 0; i < ap.data.length; i += 4) {
        if (ap.data[i + 3] !== bp.data[i + 3]) alpha++;
        if (
          ap.data[i] === bp.data[i] &&
          ap.data[i + 1] === bp.data[i + 1] &&
          ap.data[i + 2] === bp.data[i + 2] &&
          ap.data[i + 3] === bp.data[i + 3]
        )
          continue;
        changed++;
        const x = (i / 4) % 732,
          y = Math.floor(i / 4 / 732);
        bounds[0] = Math.min(bounds[0], x);
        bounds[1] = Math.min(bounds[1], y);
        bounds[2] = Math.max(bounds[2], x);
        bounds[3] = Math.max(bounds[3], y);
        if (
          x < allowed[0] * 1.5 ||
          x >= (allowed[0] + allowed[2]) * 1.5 ||
          y < allowed[1] * 1.5 ||
          y >= (allowed[1] + allowed[3]) * 1.5
        )
          outside++;
      }
    assert.equal(alpha, 0);
    assert.equal(outside, 0);
    const keyChanged = m.keyHash !== previous.keyHash;
    assert.equal(keyChanged, scoped && mode === 'original', e.name + ' ' + mode + ' key scope');
    if (!scoped || mode !== 'original') {
      assert.equal(changed, 0);
      assert.equal(m.sha256, previous.sha256);
    }
    assert(!m.layout?.overflow || previous.layout?.overflow, 'New text overflow');
    if (p && mode === 'original') {
      assert.equal(p.beforeHash, previous.sha256);
      assert.equal(p.referenceHash, e.reference.sha256);
      assert.equal(p.inputHash, m.inputHash);
      assert.equal(
        hash(ap.data),
        p.trials[1].pixelHash,
        'Production differs from fixed prototype ' + e.name,
      );
      const bytes = await fs.readFile(
        path.join(path.dirname(prototypeFile), e.id + '-candidate.png'),
      );
      assert.equal(hash(bytes), p.candidateHash);
      assert.equal(hash(PNG.sync.read(bytes).data), hash(ap.data));
    }
    const count = (counts[mode] ??= { changed: 0, unchanged: 0, keysChanged: 0 });
    count[changed ? 'changed' : 'unchanged']++;
    if (keyChanged) count.keysChanged++;
    modes[mode] = {
      before: previous.sha256,
      after: m.sha256,
      beforeKey: previous.keyHash,
      afterKey: m.keyHash,
      beforePixels: bp ? hash(bp.data) : null,
      afterPixels: ap ? hash(ap.data) : null,
      verifiedBy: same ? 'exact-png-bytes' : 'rgba-isolation',
      changed,
      outside,
      alpha,
      bounds: changed ? bounds : null,
    };
  }
  rows.push({
    id: e.id,
    set: e.card.set,
    name: e.name,
    referenceHash: e.reference.sha256,
    inputHash: hash(JSON.stringify(e.face)),
    scoped,
    modes,
  });
}
assert.deepEqual(counts.original, { changed: 20, unchanged: 472, keysChanged: 23 });
for (const mode of ['oracle', 'oracle-modern', 'etching'])
  assert.deepEqual(counts[mode], { changed: 0, unchanged: 492, keysChanged: 0 });
assert.equal(after.rendererHash, await sourceHash('games/magic/src'));
assert.deepEqual(
  await Promise.all(files.map(async (f) => hash(await fs.readFile(f)))),
  raw.map(hash),
);
await writeJson(out, {
  schema: 1,
  status: 'complete-native-flavor-isolation',
  beforeRenderer: before.rendererHash,
  afterRenderer: after.rendererHash,
  fourthIds,
  iceIds,
  canonicalBodyRegion: allowed,
  counts,
  nativeVariants: 1968,
  verification: { exactPngPairs, nativeImagesDecoded, prototypeCandidatesDecoded: 19 },
  sources: Object.fromEntries(
    ['inputs', 'before', 'extraBefore', 'after', 'prototype'].map((k, i) => [k, hash(raw[i])]),
  ),
  toolHash: hash(await fs.readFile(new URL(import.meta.url))),
  scope:
    'Twenty Original bodies changed:16Fourth and4inherited Ice cases. Three centered Fourth bodies retain exact pixels but share the semantic cache revision. All words/references/art inputs,other Originals,Oracle faces and etching masks stay exact. Changed pixels are confined to the body region; all19Fourth candidates match the fixed native-request prototype exactly. No scan pose enters renderer data.',
  rows,
});
console.log(counts);
