// Full native isolation for reviewed physical artist strings;no layout fitting.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { hash, objectFile, sourceHash, writeJson } from './common.mjs';
import { nativeReferenceWindow } from './native-reference-window.mjs';
import { nativeGrayCrop } from './abu-type-objective.mjs';
import { cropGray } from './pixels-pure.mjs';
import { compareLettering } from './lettering-metrics.mjs';
const [beforeFile, afterFile, beforeCapture, afterCapture, posesFile, annotationsFile, output] =
  process.argv.slice(2);
assert(
  output,
  'Usage: printing-artist-native-review.mjs BEFORE_INPUTS AFTER_INPUTS BEFORE_CAPTURE AFTER_CAPTURE POSES ANNOTATIONS NEW_OUTPUT',
);
const files = [beforeFile, afterFile, beforeCapture, afterCapture, posesFile, annotationsFile],
  bytes = await Promise.all(files.map((f) => fs.readFile(f))),
  [beforeInputs, afterInputs, before, after, poses, annotations] = bytes.map((b) => JSON.parse(b)),
  toolHash = hash(await fs.readFile(new URL(import.meta.url))),
  names = [
    'native-reference-window.mjs',
    'scan-transform.mjs',
    'pixels-pure.mjs',
    'abu-type-objective.mjs',
    'lettering-metrics.mjs',
    'metrics.mjs',
    'edges.mjs',
  ],
  identities = async () =>
    Object.fromEntries(
      await Promise.all(
        names.map(async (n) => [n, hash(await fs.readFile(new URL(n, import.meta.url)))]),
      ),
    ),
  modules = await identities(),
  ids = beforeInputs.entries.map((e) => e.id).sort(),
  rows = [],
  rect = [38, 608, 356, 48];
for (const c of [before, after]) {
  assert.equal(c.status, 'complete');
  assert.deepEqual(c.faults, []);
  assert.deepEqual(c.rows.map((r) => r.id).sort(), ids);
}
assert.deepEqual(afterInputs.entries.map((e) => e.id).sort(), ids);
assert.equal(before.inputHash, hash(bytes[0]));
assert.equal(after.inputHash, hash(bytes[1]));
assert.equal(poses.inputHash, hash(bytes[0]));
assert.equal(beforeInputs.set, afterInputs.set);
assert.equal(annotations.set, beforeInputs.set);
assert.equal(after.artist, 'reviewed-artist');
await fs.writeFile(output, JSON.stringify({ status: 'running' }), { flag: 'wx' });
for (const e of beforeInputs.entries) {
  const next = afterInputs.entries.find((n) => n.id === e.id),
    b = before.rows.find((n) => n.id === e.id),
    a = after.rows.find((n) => n.id === e.id),
    p = poses.rows.find((p) => p.id === e.id),
    annotation = annotations.cards[e.id],
    changedArtist = e.face.artist !== next.face.artist;
  assert(p);
  assert.equal(p.referenceHash, e.reference.sha256);
  assert.equal(b.referenceHash, e.reference.sha256);
  assert.equal(a.referenceHash, b.referenceHash);
  assert.equal(a.artHash, b.artHash);
  assert.deepEqual(next.card, e.card);
  assert.deepEqual(next.reference, e.reference);
  assert.deepEqual(next.art, e.art);
  const { artist: ignoredBefore, ...oldFace } = e.face,
    { artist: ignoredAfter, ...newFace } = next.face;
  assert.deepEqual(newFace, oldFace, 'Only the provided physical artist string may change');
  assert.equal(changedArtist, Boolean(annotation));
  if (annotation) {
    assert.equal(annotation.referenceHash, e.reference.sha256);
    assert.deepEqual(annotation.reviewedFields, ['artist']);
    assert.equal(next.face.artist, annotation.artist);
    assert.equal(a.artistProvenance.status, 'applied');
  } else assert.equal(a.artistProvenance.status, 'unreviewed');
  assert.deepEqual(Object.keys(a.modes).sort(), ['etching', 'oracle', 'oracle-modern', 'original']);
  const modes = {};
  let metric;
  for (const mode of Object.keys(a.modes)) {
    const old = b.modes[mode],
      current = a.modes[mode],
      oldBytes = await fs.readFile(path.join(path.dirname(beforeCapture), old.file)),
      currentBytes = await fs.readFile(path.join(path.dirname(afterCapture), current.file));
    assert.equal(hash(oldBytes), old.sha256);
    assert.equal(hash(currentBytes), current.sha256);
    assert.deepEqual(current.layout, old.layout);
    if (mode === 'original') {
      assert.equal(old.inputHash, hash(JSON.stringify(e.face)));
      assert.equal(current.inputHash, hash(JSON.stringify(next.face)));
    }
    const changed = old.sha256 !== current.sha256,
      keyChanged = old.keyHash !== current.keyHash;
    assert.equal(changed, changedArtist && mode !== 'etching');
    assert.equal(keyChanged, changed);
    let pixels = 0,
      alpha = 0,
      outside = 0;
    if (changed) {
      const oi = PNG.sync.read(oldBytes),
        ni = PNG.sync.read(currentBytes);
      assert.equal(oi.width, ni.width);
      assert.equal(oi.height, ni.height);
      const scale = oi.width / 488;
      for (let y = 0; y < oi.height; y++)
        for (let x = 0; x < oi.width; x++) {
          const i = (y * oi.width + x) * 4;
          if (oi.data[i + 3] !== ni.data[i + 3]) alpha++;
          if ([0, 1, 2, 3].some((k) => oi.data[i + k] !== ni.data[i + k])) {
            pixels++;
            if (
              x < Math.floor(rect[0] * scale) ||
              x >= Math.ceil((rect[0] + rect[2]) * scale) ||
              y < Math.floor(rect[1] * scale) ||
              y >= Math.ceil((rect[1] + rect[3]) * scale)
            )
              outside++;
          }
        }
      assert.equal(alpha, 0);
      assert.equal(outside, 0);
      if (mode === 'original') {
        const ref = await fs.readFile(objectFile(e.reference));
        assert.equal(hash(ref), e.reference.sha256);
        const scan = nativeReferenceWindow(PNG.sync.read(ref), rect, p.transform, 1),
          gray = cropGray(scan, [0, 0, rect[2], rect[3]]).gray;
        metric = {
          before: compareLettering(gray, nativeGrayCrop(oi, rect), rect[2], rect[3]),
          after: compareLettering(gray, nativeGrayCrop(ni, rect), rect[2], rect[3]),
        };
      }
    }
    modes[mode] = {
      before: old.sha256,
      after: current.sha256,
      beforeInputHash: old.inputHash,
      inputHash: current.inputHash,
      changed,
      keyChanged,
      pixels,
      alpha,
      outside,
    };
  }
  rows.push({
    id: e.id,
    name: e.name,
    referenceHash: e.reference.sha256,
    poseHash: hash(JSON.stringify(p.transform)),
    poseAccepted: p.accepted,
    beforeArtist: e.face.artist,
    artist: next.face.artist,
    changedArtist,
    modes,
    artistMetric: metric ?? null,
  });
  if (rows.length % 30 === 0) console.log('Artist native isolation', rows.length, '/', ids.length);
}
const counts = Object.fromEntries(
    ['original', 'oracle', 'oracle-modern', 'etching'].map((m) => [
      m,
      {
        changed: rows.filter((r) => r.modes[m].changed).length,
        unchanged: rows.filter((r) => !r.modes[m].changed).length,
        keysChanged: rows.filter((r) => r.modes[m].keyChanged).length,
      },
    ]),
  ),
  measured = rows.filter((r) => r.artistMetric),
  mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
assert.deepEqual(await identities(), modules);
assert.equal(hash(await fs.readFile(new URL(import.meta.url))), toolHash);
assert.deepEqual(
  await Promise.all(files.map(async (f) => hash(await fs.readFile(f)))),
  bytes.map(hash),
);
assert.equal(await sourceHash('games/magic/src'), after.rendererHash);
await writeJson(output, {
  schema: 1,
  set: beforeInputs.set,
  status: 'complete-native-physical-artist-isolation',
  scope:
    'All Original/Oracle-symbol modes and etching compared. Only exact reviewed artist input strings may differ;provider cards,body/type wording,assets,layouts,alpha and pixels outside artist strip remain fixed. Credits-region metrics are diagnostics,not font/layout or full-set approval.',
  beforeRenderer: before.rendererHash,
  afterRenderer: after.rendererHash,
  toolHash,
  modules,
  sources: Object.fromEntries(
    ['beforeInputs', 'afterInputs', 'beforeCapture', 'afterCapture', 'poses', 'annotations'].map(
      (n, i) => [n, hash(bytes[i])],
    ),
  ),
  originals: rows.length,
  nativeVariants: 4 * rows.length,
  changedArtists: measured.length,
  rect,
  counts,
  artistMetric: {
    measured: measured.length,
    before100: 100 * mean(measured.map((r) => r.artistMetric.before.edgeF1)),
    after100: 100 * mean(measured.map((r) => r.artistMetric.after.edgeF1)),
    gains: measured.filter((r) => r.artistMetric.after.edgeF1 > r.artistMetric.before.edgeF1)
      .length,
    losses: measured.filter((r) => r.artistMetric.after.edgeF1 < r.artistMetric.before.edgeF1)
      .length,
  },
  rows,
});
console.log(JSON.stringify({ counts, changedArtists: measured.length }));
