// Verify every Fourth face,reviewed-wording stage,and existing Dark layout control.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
const [
  beforeInputsFile,
  afterInputsFile,
  beforeFile,
  afterFile,
  wordingFile,
  prototypeDirectory,
  darkBeforeFile,
  darkAfterFile,
  annotationFile,
  output,
] = process.argv.slice(2);
assert(
  output,
  'Usage: fourth-nonbasic-native-review.mjs BEFORE_INPUTS AFTER_INPUTS BEFORE_NATIVE AFTER_NATIVE REVIEWED_WORDING_NATIVE PROTOTYPE_DIR DARK_BEFORE DARK_AFTER ANNOTATION NEW_OUTPUT',
);
const fileList = [
    beforeInputsFile,
    afterInputsFile,
    beforeFile,
    afterFile,
    wordingFile,
    path.join(prototypeDirectory, 'study.json'),
    darkBeforeFile,
    darkAfterFile,
    annotationFile,
  ],
  raw = await Promise.all(fileList.map((f) => fs.readFile(f))),
  [
    beforeInputs,
    afterInputs,
    before,
    after,
    wording,
    prototype,
    darkBefore,
    darkAfter,
    annotation,
  ] = raw.map((b) => JSON.parse(b));
const modes = ['original', 'oracle', 'oracle-modern', 'etching'],
  ids = beforeInputs.entries.map((e) => e.id).sort(),
  scoped = beforeInputs.entries
    .filter((e) => e.face.land && !/\bBasic Land\b/.test(e.face.canonicalTypeLine ?? ''))
    .map((e) => e.id)
    .sort(),
  corrected = Object.keys(annotation.cards);
assert.equal(ids.length, 378);
assert.equal(scoped.length, 3);
assert.deepEqual(corrected, ['aff8d4f1-eaad-4afb-9097-2afab133f707']);
assert.deepEqual(afterInputs.entries.map((e) => e.id).sort(), ids);
for (const c of [before, after, wording, darkBefore, darkAfter]) {
  assert.equal(c.status, 'complete');
  assert.deepEqual(c.faults, []);
}
assert.equal(before.inputHash, hash(raw[0]));
assert.equal(after.inputHash, hash(raw[1]));
assert.deepEqual(before.rows.map((r) => r.id).sort(), ids);
assert.deepEqual(after.rows.map((r) => r.id).sort(), ids);
assert.deepEqual(wording.rows.map((r) => r.id).sort(), scoped);
assert.equal(prototype.status, 'complete-exploratory');
assert.deepEqual(prototype.rows.map((r) => r.id).sort(), scoped);
assert.equal(prototype.rendererHash, before.rendererHash);
assert.equal(wording.rendererHash, before.rendererHash);
await fs.writeFile(output, JSON.stringify({ status: 'running' }), { flag: 'wx' });
async function readNative(file, id, mode) {
  const bytes = await fs.readFile(path.join(path.dirname(file), mode.file));
  assert.equal(hash(bytes), mode.sha256, 'Changed native ' + id);
  return bytes;
}
function compare(a, b) {
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
const rows = [],
  counts = Object.fromEntries(modes.map((m) => [m, { changed: 0, unchanged: 0, keysChanged: 0 }]));
const content = (l) => l?.lines.join('').replace(/\s/g, '');
for (const e of beforeInputs.entries) {
  const next = afterInputs.entries.find((r) => r.id === e.id),
    b = before.rows.find((r) => r.id === e.id),
    a = after.rows.find((r) => r.id === e.id),
    selected = scoped.includes(e.id),
    wordingChanged = corrected.includes(e.id);
  assert.deepEqual(next.card, e.card);
  assert.deepEqual(next.art, e.art);
  assert.deepEqual(next.reference, e.reference);
  assert.equal(e.face.wordingMode, 'original');
  assert.equal(next.face.wordingMode, 'original');
  if (!wordingChanged) assert.deepEqual(next.face, e.face);
  else {
    const review = annotation.cards[e.id];
    assert.equal(review.referenceHash, e.reference.sha256);
    assert.equal(
      review.rulesText,
      e.face.rulesText.replace('Add 1 colorless', 'Add one colorless'),
    );
    assert(review.rulesText.includes('\n{1}:'));
    const expected = {
      ...e.face,
      rulesText: review.rulesText,
      rulesParagraphs: review.paragraphs,
      rulesAlignment: { ...e.face.rulesAlignment, reference: review.paragraphs },
    };
    assert.deepEqual(next.face, expected);
  }
  for (const r of [b, a]) {
    assert.equal(r.referenceHash, e.reference.sha256);
    assert.equal(r.artHash, e.art.sha256);
  }
  const observations = {};
  for (const mode of modes) {
    const old = b.modes[mode],
      n = a.modes[mode],
      bb = await readNative(beforeFile, e.id, old),
      ab = await readNative(afterFile, e.id, n);
    if (!wordingChanged) assert.equal(old.inputHash, n.inputHash);
    const changed = old.sha256 !== n.sha256;
    counts[mode][changed ? 'changed' : 'unchanged']++;
    if (old.keyHash !== n.keyHash) counts[mode].keysChanged++;
    if (changed)
      assert(
        selected && mode !== 'etching',
        'Unrelated native face changed ' + e.name + ' ' + mode,
      );
    const delta = changed
      ? compare(PNG.sync.read(bb), PNG.sync.read(ab))
      : { changed: 0, outside: 0, alpha: 0 };
    assert.equal(delta.outside, 0);
    assert.equal(delta.alpha, 0);
    if (!selected) assert.deepEqual(old.layout, n.layout);
    if (selected) {
      assert.equal(n.layout?.overflow, false);
      if (mode === 'etching') assert.deepEqual(n.layout, a.modes.original.layout);
      if (mode.startsWith('oracle'))
        assert.equal(content(n.layout), content(old.layout), 'Oracle text content changed');
    }
    let prototypeHash, wordingOnly;
    if (selected && mode === 'original') {
      assert(changed);
      const pr = prototype.rows.find((r) => r.id === e.id),
        wr = wording.rows.find((r) => r.id === e.id).modes.original,
        wb = await readNative(wordingFile, e.id, wr),
        pb = await fs.readFile(path.join(prototypeDirectory, e.id + '-best.png'));
      assert.equal(wr.sha256, pr.baselineHash);
      assert.equal(wr.inputHash, n.inputHash);
      assert.equal(pr.replayDifference, 0);
      prototypeHash = hash(pb);
      assert.equal(prototypeHash, n.sha256, 'Shared model differs from production ' + e.name);
      const d = compare(PNG.sync.read(bb), PNG.sync.read(wb));
      assert.equal(d.outside, 0);
      assert.equal(d.alpha, 0);
      if (!wordingChanged) assert.equal(wr.sha256, old.sha256);
      wordingOnly = { hash: wr.sha256, ...d };
      const model = pr.trials.find((t) => t.candidate.id === 'shared-model');
      assert(model);
      assert.equal(model.layout.size, n.layout.size);
      assert.equal(model.layout.top, n.layout.top);
      assert(model.metric.score > pr.trials[0].metric.score);
    }
    observations[mode] = {
      before: old.sha256,
      after: n.sha256,
      beforeKey: old.keyHash,
      afterKey: n.keyHash,
      ...delta,
      ...(prototypeHash ? { prototypeHash, wordingOnly } : {}),
    };
  }
  rows.push({
    id: e.id,
    name: e.name,
    scoped: selected,
    wordingChanged,
    referenceHash: e.reference.sha256,
    artHash: e.art.sha256,
    beforeInputHash: hash(JSON.stringify(e.face)),
    afterInputHash: hash(JSON.stringify(next.face)),
    modes: observations,
  });
  if (rows.length % 50 === 0) console.log('Nonbasic native review', rows.length, '/', ids.length);
}
assert.equal(counts.original.changed, 3);
assert.equal(counts.etching.changed, 0);
assert.equal(darkBefore.rows.length, 122);
assert.equal(darkAfter.rows.length, 122);
assert.equal(darkAfter.rendererHash, after.rendererHash);
assert.equal(darkBefore.inputHash, darkAfter.inputHash);
const darkRows = [];
for (const b of darkBefore.rows) {
  const a = darkAfter.rows.find((r) => r.id === b.id);
  assert(a);
  assert.equal(a.artHash, b.artHash);
  assert.equal(a.referenceHash, b.referenceHash);
  const checked = {};
  for (const mode of modes) {
    await readNative(darkBeforeFile, b.id, b.modes[mode]);
    await readNative(darkAfterFile, a.id, a.modes[mode]);
    assert.equal(a.modes[mode].sha256, b.modes[mode].sha256);
    assert.equal(a.modes[mode].inputHash, b.modes[mode].inputHash);
    assert.deepEqual(a.modes[mode].layout, b.modes[mode].layout);
    checked[mode] = a.modes[mode].sha256;
  }
  darkRows.push({ id: b.id, modes: checked });
}
await writeJson(output, {
  schema: 1,
  set: '4ed',
  status: 'complete-native-fourth-nonbasic-isolation',
  scope:
    'All378 printings/1512 after variants;one exact Original wording correction and three shared-class land layouts. Unrelated faces,Oracle content,art/frame/alpha and all122 Dark printings×4 modes are verified. Current before/after masks remain identical. Frozen stock poses and regional fits do not certify a whole set.',
  beforeRenderer: before.rendererHash,
  afterRenderer: after.rendererHash,
  inputHash: hash(raw[1]),
  sources: Object.fromEntries(
    [
      'beforeInputs',
      'afterInputs',
      'before',
      'after',
      'reviewedWording',
      'prototype',
      'darkBefore',
      'darkAfter',
      'annotation',
    ].map((k, i) => [k, hash(raw[i])]),
  ),
  toolHash: hash(await fs.readFile(new URL(import.meta.url))),
  ids: scoped,
  wordingIds: corrected,
  originals: 378,
  nativeVariants: 1512,
  counts,
  darkControls: { printings: 122, nativeVariants: 488, changed: 0, rows: darkRows },
  rows,
});
console.log('Nonbasic integration verified', JSON.stringify(counts));
