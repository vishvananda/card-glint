// Full native replay for a reviewed Original paragraph correction.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
import { fourthParagraphId as id } from './fourth-paragraph-data-check.mjs';
const [
  beforeInputsFile,
  afterInputsFile,
  beforeFile,
  afterFile,
  prototypeFile,
  annotationFile,
  output,
] = process.argv.slice(2);
assert(
  output,
  'Usage: fourth-paragraph-native-review.mjs BEFORE_INPUTS AFTER_INPUTS BEFORE_NATIVE AFTER_NATIVE PROTOTYPE_NATIVE ANNOTATION NEW_OUTPUT',
);
const files = [
  beforeInputsFile,
  afterInputsFile,
  beforeFile,
  afterFile,
  prototypeFile,
  annotationFile,
];
const raw = await Promise.all(files.map((f) => fs.readFile(f)));
const [inputs, nextInputs, before, after, prototype, annotation] = raw.map((b) => JSON.parse(b));
for (const c of [before, after, prototype]) {
  assert.equal(c.status, 'complete');
  assert.deepEqual(c.faults, []);
}
assert.equal(inputs.entries.length, 378);
assert.equal(nextInputs.entries.length, 378);
assert.equal(before.inputHash, hash(raw[0]));
assert.equal(after.inputHash, hash(raw[1]));
assert.equal(before.rows.length, 378);
assert.equal(after.rows.length, 378);
assert.equal(prototype.rows.length, 1);
assert.equal(prototype.rows[0].id, id);
assert.equal(prototype.rendererHash, before.rendererHash);
assert.deepEqual(after.rows.map((r) => r.id).sort(), inputs.entries.map((r) => r.id).sort());
const review = annotation.cards[id],
  modes = ['original', 'oracle', 'oracle-modern', 'etching'];
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
const counts = Object.fromEntries(
    modes.map((m) => [m, { changed: 0, unchanged: 0, keysChanged: 0 }]),
  ),
  rows = [];
for (const e of inputs.entries) {
  const next = nextInputs.entries.find((r) => r.id === e.id),
    b = before.rows.find((r) => r.id === e.id),
    a = after.rows.find((r) => r.id === e.id);
  const scoped = e.id === id;
  assert.deepEqual(next.card, e.card);
  assert.deepEqual(next.reference, e.reference);
  assert.deepEqual(next.art, e.art);
  if (scoped) {
    assert.equal(review.referenceHash, e.reference.sha256);
    assert.equal(review.rulesText.replace('\n', ' '), e.face.rulesText);
    assert.deepEqual(next.face, {
      ...e.face,
      rulesText: review.rulesText,
      rulesParagraphs: review.paragraphs,
      rulesAlignment: { ...e.face.rulesAlignment, reference: review.paragraphs },
    });
  } else assert.deepEqual(next.face, e.face);
  assert.equal(b.artHash, e.art.sha256);
  assert.equal(a.artHash, b.artHash);
  assert.equal(b.referenceHash, e.reference.sha256);
  assert.equal(a.referenceHash, b.referenceHash);
  const observations = {};
  for (const mode of modes) {
    const old = b.modes[mode],
      n = a.modes[mode],
      bb = await bytes(beforeFile, old),
      ab = await bytes(afterFile, n);
    if (!scoped) assert.equal(old.inputHash, n.inputHash);
    assert.equal(content(n.layout), content(old.layout), 'Visible wording changed');
    if (n.layout) assert.equal(n.layout.overflow, false);
    else assert.equal(n.layout, old.layout);
    const changed = old.sha256 !== n.sha256;
    assert.equal(
      changed,
      scoped && mode === 'original',
      'Unrelated pixels changed: ' + e.name + ' ' + mode,
    );
    counts[mode][changed ? 'changed' : 'unchanged']++;
    if (old.keyHash !== n.keyHash) counts[mode].keysChanged++;
    const delta = changed ? difference(bb, ab) : { changed: 0, outside: 0, alpha: 0 };
    assert.equal(delta.outside, 0);
    assert.equal(delta.alpha, 0);
    if (!scoped || mode.startsWith('oracle')) assert.deepEqual(n.layout, old.layout);
    let prototypeHash;
    if (scoped) {
      const pr = prototype.rows[0].modes[mode],
        pb = await bytes(prototypeFile, pr);
      assert.equal(hash(pb), n.sha256, 'Public-input native differs from reviewed prototype');
      assert.equal(n.inputHash, pr.inputHash);
      if (mode === 'original') {
        prototypeHash = hash(pb);
        assert.equal(n.layout.size, 25);
        assert.equal(n.layout.lines.length, 5);
      }
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
    referenceHash: e.reference.sha256,
    artHash: e.art.sha256,
    beforeInputHash: hash(JSON.stringify(e.face)),
    inputHash: hash(JSON.stringify(next.face)),
    modes: observations,
  });
  if (rows.length % 50 === 0) console.log('Fourth paragraph isolation', rows.length, '/378');
}
for (const mode of modes) assert.equal(counts[mode].changed, mode === 'original' ? 1 : 0);
await writeJson(output, {
  schema: 1,
  set: '4ed',
  status: 'complete-native-fourth-paragraph-isolation',
  scope:
    'One reviewed Original paragraph break with identical lexical content.378 printings×4 native modes;377 Original controls,all Oracle faces and masks unchanged. All changes are confined to Gloom rules;no scan pose,geometry,frame,art,shader,font or pigment adjustment.',
  beforeRenderer: before.rendererHash,
  afterRenderer: after.rendererHash,
  beforeInputHash: hash(raw[0]),
  inputHash: hash(raw[1]),
  originals: 378,
  nativeVariants: 1512,
  ids: [id],
  counts,
  rows,
  sources: Object.fromEntries(files.map((_, i) => [i, hash(raw[i])])),
  toolHash: hash(await fs.readFile(new URL(import.meta.url))),
});
