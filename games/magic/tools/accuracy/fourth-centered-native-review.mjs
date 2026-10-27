import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { hash, sourceHash, writeJson } from './common.mjs';
const [configFile, output] = process.argv.slice(2);
assert(output, 'Usage: fourth-centered-native-review.mjs PRIVATE_CONFIG NEW_OUTPUT');
const config = JSON.parse(await fs.readFile(configFile));
const names = ['beforeInputs', 'afterInputs', 'beforeCapture', 'afterCapture', 'prototype'];
const raw = await Promise.all(names.map((k) => fs.readFile(config[k])));
const [before, after, bc, ac, prototype] = raw.map((b) => JSON.parse(b));
const annotation = JSON.parse(
  await fs.readFile('games/magic/fixtures/accuracy/4ed/annotations-typography.json'),
);
const ids = Object.keys(annotation.cards).sort();
assert.equal(ids.length, 12);
assert.equal(before.set, '4ed');
assert.equal(after.set, '4ed');
assert.equal(before.entries.length, 378);
assert.equal(after.entries.length, 378);
assert.equal(bc.status, 'complete');
assert.equal(ac.status, 'complete');
assert.equal(bc.inputHash, hash(raw[0]));
assert.equal(ac.inputHash, hash(raw[1]));
assert.equal(ac.rendererHash, await sourceHash('games/magic/src'));
assert.equal(prototype.status, 'complete-exploratory');
assert.equal(prototype.rendererHash, ac.rendererHash);
assert.equal(prototype.baselineHash, hash(raw[2]));
assert.equal(prototype.inputHash, hash(raw[0]));
assert.deepEqual(before.components, after.components);
assert.deepEqual(
  before.entries.map((e) => e.id),
  after.entries.map((e) => e.id),
);
const rows = [],
  counts = Object.fromEntries(
    ['original', 'oracle', 'oracle-modern', 'etching'].map((m) => [
      m,
      { changed: 0, unchanged: 0, keysChanged: 0 },
    ]),
  );
const noAlignment = (p) => p.map(({ align, ...rest }) => rest);
for (const e of after.entries) {
  const b = before.entries.find((b) => b.id === e.id),
    n0 = bc.rows.find((r) => r.id === e.id),
    n1 = ac.rows.find((r) => r.id === e.id);
  assert.equal(e.reference.sha256, b.reference.sha256);
  assert.equal(e.art.sha256, b.art.sha256);
  assert.equal(n0.referenceHash, e.reference.sha256);
  assert.equal(n1.referenceHash, e.reference.sha256);
  assert.equal(n0.artHash, e.art.sha256);
  assert.equal(n1.artHash, e.art.sha256);
  const scoped = ids.includes(e.id);
  if (scoped) {
    const expected = {
      ...b.face,
      rulesParagraphs: annotation.cards[e.id].paragraphs,
      rulesAlignment: { mode: 'auto', reference: annotation.cards[e.id].paragraphs },
    };
    assert.deepEqual(e.face, expected);
    assert.deepEqual(noAlignment(e.face.rulesParagraphs), b.face.rulesParagraphs);
    assert.equal(e.face.rulesText, b.face.rulesText);
  } else assert.deepEqual(e.face, b.face);
  const row = {
    id: e.id,
    name: e.name,
    scoped,
    referenceHash: e.reference.sha256,
    artHash: e.art.sha256,
    beforeInputHash: hash(JSON.stringify(b.face)),
    inputHash: hash(JSON.stringify(e.face)),
    beforeParagraphsHash: hash(JSON.stringify(b.face.rulesParagraphs)),
    paragraphsHash: hash(JSON.stringify(e.face.rulesParagraphs)),
    unstyledParagraphsHash: hash(JSON.stringify(noAlignment(e.face.rulesParagraphs))),
    modes: {},
  };
  for (const mode of ['original', 'oracle', 'oracle-modern', 'etching']) {
    const x = n0.modes[mode],
      y = n1.modes[mode];
    assert.equal(x.layout?.overflow ?? false, false);
    assert.equal(y.layout?.overflow ?? false, false);
    const xb = await fs.readFile(path.join(path.dirname(config.beforeCapture), x.file));
    const yb = await fs.readFile(path.join(path.dirname(config.afterCapture), y.file));
    assert.equal(hash(xb), x.sha256);
    assert.equal(hash(yb), y.sha256);
    const changed = x.sha256 !== y.sha256;
    assert.equal(
      changed,
      scoped && mode === 'original',
      'Unexpected native change ' + e.name + '/' + mode,
    );
    let outside = 0,
      alpha = 0,
      pixels = 0;
    if (changed) {
      const a = PNG.sync.read(xb),
        b = PNG.sync.read(yb);
      assert.equal(a.width, 732);
      assert.equal(a.height, 1020);
      assert.equal(b.width, a.width);
      assert.equal(b.height, a.height);
      for (let i = 0; i < a.data.length; i += 4) {
        const px = (i / 4) % 732,
          py = Math.floor(i / 4 / 732);
        if (a.data[i + 3] !== b.data[i + 3]) alpha++;
        if (
          a.data[i] !== b.data[i] ||
          a.data[i + 1] !== b.data[i + 1] ||
          a.data[i + 2] !== b.data[i + 2]
        ) {
          pixels++;
          if (px < 90 || px >= 645 || py < 607 || py >= 910) outside++;
        }
      }
      assert.equal(alpha, 0);
      assert.equal(outside, 0);
      const trial = prototype.rows.find((r) => r.id === e.id);
      assert(trial);
      const candidate = await fs.readFile(
        path.join(path.dirname(config.prototype), e.id + '-candidate.png'),
      );
      assert.equal(hash(candidate), trial.candidateHash);
      assert.equal(hash(candidate), y.sha256, 'Integrated style differs from prototype ' + e.name);
      row.prototypeHash = hash(candidate);
    }
    assert.match(x.keyHash, /^[a-f0-9]{64}$/);
    assert.match(y.keyHash, /^[a-f0-9]{64}$/);
    const keysChanged = x.keyHash !== y.keyHash;
    counts[mode][changed ? 'changed' : 'unchanged']++;
    if (keysChanged) counts[mode].keysChanged++;
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
  assert.equal(n0.modes.original.inputHash, row.beforeInputHash);
  assert.equal(n1.modes.original.inputHash, row.inputHash);
  rows.push(row);
}
assert.deepEqual(counts.original, { changed: 12, unchanged: 366, keysChanged: 378 });
for (const m of ['oracle', 'oracle-modern', 'etching'])
  assert.deepEqual(counts[m], { changed: 0, unchanged: 378, keysChanged: 378 });
await writeJson(output, {
  schema: 1,
  set: '4ed',
  status: 'complete-native-reviewed-centering-isolation',
  scope:
    '378 printings in4modes.12Original formatting changes exactly match one shared prototype;366Originals,allOracle/masks and every unrelated pixel retain exact native bytes. Cache keys change for the profile revision;unchanged pixels remain reusable.',
  beforeRenderer: bc.rendererHash,
  afterRenderer: ac.rendererHash,
  ids,
  nativeVariants: 1512,
  counts,
  source: Object.fromEntries(names.map((k, i) => [k, hash(raw[i])])),
  toolHash: hash(await fs.readFile(new URL(import.meta.url))),
  rows,
});
console.log(counts);
