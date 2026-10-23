// Complete native adoption proof for reviewed crown and exact-printing land sources.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
const [beforeDir, afterDir, crownDir, goldDir, output] = process.argv.slice(2);
assert(output, 'Usage: modern-frame-source-native-audit.mjs BEFORE AFTER CROWNS GOLD OUT');
const read = async (file) => {
  const bytes = await readFile(file);
  return { bytes, value: JSON.parse(bytes) };
};
const before = await read(path.join(beforeDir, 'capture.json'));
const after = await read(path.join(afterDir, 'capture.json'));
const oldInputs = await read(path.join(beforeDir, 'inputs.json'));
const inputs = await read(path.join(afterDir, 'inputs.json'));
const crowns = await read(path.join(crownDir, 'capture.json'));
const gold = await read(path.join(goldDir, 'capture.json'));
for (const [capture, input] of [
  [before, oldInputs],
  [after, inputs],
]) {
  assert.equal(capture.value.completed, 297);
  assert.equal(capture.value.denominator, 297);
  assert.deepEqual(capture.value.faults, []);
  assert.equal(capture.value.source.inputsHash, hash(input.bytes));
}
const { components: oldAssets, ...oldData } = oldInputs.value;
const { components: newAssets, ...newData } = inputs.value;
assert.deepEqual(newData, oldData, 'Only the bound asset inventory may extend');
const oldByUrl = new Map(oldAssets.map((a) => [a.url, a]));
const newByUrl = new Map(newAssets.map((a) => [a.url, a]));
assert.equal(oldByUrl.size, oldAssets.length);
assert.equal(newByUrl.size, newAssets.length);
for (const [url, asset] of oldByUrl) assert.deepEqual(newByUrl.get(url), asset);
const additions = newAssets.filter((a) => !oldByUrl.has(a.url));
const expected = [...crowns.value.source.extraAssets, ...gold.value.source.extraAssets];
assert.equal(additions.length, 3);
assert.deepEqual(additions, expected);
for (const key of ['rasterHelpers', 'packMetadata'])
  assert.deepEqual(after.value.source[key], before.value.source[key]);
const proposal = new Map();
for (const [dir, capture] of [
  [crownDir, crowns],
  [goldDir, gold],
]) {
  assert.deepEqual(capture.value.faults, []);
  assert.equal(capture.value.source.renderer, before.value.source.rendererHash);
  assert.equal(capture.value.source.inputsHash, hash(oldInputs.bytes));
  for (const row of capture.value.rows) {
    assert(!proposal.has(row.id));
    proposal.set(row.id, { dir, row });
  }
}
assert.equal(proposal.size, 3);
const prior = new Map(before.value.rows.map((r) => [r.id, r]));
const next = new Map(after.value.rows.map((r) => [r.id, r]));
assert.equal(prior.size, 297);
assert.equal(next.size, 297);
const pixels = async (dir, layer) => {
  const bytes = await readFile(path.join(dir, layer.file));
  assert.equal(hash(bytes), layer.sha256);
  return PNG.sync.read(bytes, { checkCRC: true });
};
const rows = [];
for (const entry of inputs.value.entries) {
  const b = prior.get(entry.id),
    a = next.get(entry.id);
  assert(b && a && !b.issue && !a.issue);
  for (const row of [b, a]) {
    assert.equal(row.inputHash, hash(JSON.stringify(entry.face)));
    assert.equal(row.referenceHash, entry.reference.sha256);
  }
  const old = await pixels(beforeDir, b.layers.face);
  const current = await pixels(afterDir, a.layers.face);
  assert.deepEqual([old.width, old.height], [current.width, current.height]);
  let changedPixels = 0,
    alphaChanges = 0;
  for (let i = 0; i < old.data.length; i += 4) {
    if (old.data[i + 3] !== current.data[i + 3]) alphaChanges++;
    if ([0, 1, 2, 3].some((c) => old.data[i + c] !== current.data[i + c])) changedPixels++;
  }
  assert.equal(alphaChanges, 0);
  // Verify etching file integrity, not just matching strings in manifests.
  await pixels(beforeDir, b.layers.etching);
  await pixels(afterDir, a.layers.etching);
  assert.equal(a.layers.etching.sha256, b.layers.etching.sha256);
  const p = proposal.get(entry.id);
  if (p) {
    assert(changedPixels > 0);
    assert.equal(p.row.referenceHash, entry.reference.sha256);
    const expectedInput =
      entry.card.collector_number === '246'
        ? { ...entry.face, frameColors: ['W', 'U', 'B', 'R', 'G'] }
        : entry.face;
    assert.equal(p.row.inputHash, hash(JSON.stringify(expectedInput)));
    await pixels(p.dir, p.row.layers.face);
    await pixels(p.dir, p.row.layers.etching);
    assert.equal(
      a.layers.face.sha256,
      p.row.layers.face.sha256,
      'Independent source proposal drift',
    );
    assert.equal(a.layers.etching.sha256, p.row.layers.etching.sha256);
  } else {
    assert.equal(changedPixels, 0, 'Unrelated printing changed: ' + entry.card.name);
    assert.equal(a.layers.face.sha256, b.layers.face.sha256);
  }
  rows.push({
    id: entry.id,
    name: entry.card.name,
    number: entry.card.collector_number,
    inputHash: a.inputHash,
    referenceHash: a.referenceHash,
    before: { face: b.layers.face.sha256, etching: b.layers.etching.sha256 },
    after: { face: a.layers.face.sha256, etching: a.layers.etching.sha256 },
    changedPixels,
    alphaChanges,
    proposalExact: Boolean(p),
  });
}
const result = {
  schema: 1,
  status: 'source-adoption-native-verified',
  scope:
    'All297 Original native M21 faces and etchings. Only Niambi, Radha and Fabled Passage change; each equals its independent frozen-source proposal. Input entries, font/raster helpers, existing assets, alpha and every etching remain unchanged. Three pinned assets extend the inventory. Source adoption is not set completion, independent pigment validation or a new scan normalization.',
  definition: {
    beforeRenderer: before.value.source.rendererHash,
    afterRenderer: after.value.source.rendererHash,
    beforeCaptureHash: hash(before.bytes),
    afterCaptureHash: hash(after.bytes),
    beforeInputsHash: hash(oldInputs.bytes),
    afterInputsHash: hash(inputs.bytes),
    crownProposalHash: hash(crowns.bytes),
    goldProposalHash: hash(gold.bytes),
    toolHash: hash(await readFile(new URL(import.meta.url))),
    assetAdditions: additions,
  },
  summary: {
    faces: 297,
    unchangedFaces: 294,
    changedFaces: 3,
    exactIndependentProposals: 3,
    unchangedEtchings: 297,
    alphaChanges: 0,
  },
  rows,
};
assert.equal(rows.filter((r) => r.changedPixels).length, 3);
await writeJson(output, result);
console.log(JSON.stringify(result.summary));
