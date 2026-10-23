// Fixed-patch scan evidence and complete native before/after census; no fitting.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { sampleColor, delta, median } from './hsb-color.mjs';
const [inputFile, beforeDir, afterDir, scoreDir, output] = process.argv.slice(2);
assert(output, 'Usage: modern-stock-native-audit.mjs INPUTS BEFORE AFTER SCORES OUTPUT');
const read = async (file) => {
  const bytes = await readFile(file);
  return { bytes, value: JSON.parse(bytes) };
};
const [input, before, after, scores] = await Promise.all([
  read(inputFile),
  read(path.join(beforeDir, 'capture.json')),
  read(path.join(afterDir, 'capture.json')),
  read(path.join(scoreDir, 'scores.json')),
]);
const ids = new Set(input.value.entries.map((e) => e.id));
assert.equal(ids.size, input.value.entries.length);
for (const c of [before.value, after.value]) {
  assert.equal(c.completed, ids.size);
  assert.equal(c.denominator, ids.size);
  assert.deepEqual(c.faults, []);
  assert.equal(c.source.inputsHash, hash(input.bytes));
  assert.equal(c.rows.length, ids.size);
  assert.equal(new Set(c.rows.map((r) => r.id)).size, ids.size);
  assert(!c.source.study && !c.source.materialStudy && !c.source.manaStudy);
}
for (const key of ['rasterHelpers', 'packMetadata', 'components', 'toolHash', 'browser'])
  assert.deepEqual(
    before.value.source[key],
    after.value.source[key],
    'Changed native dependency: ' + key,
  );
assert.equal(scores.value.definition.inputsHash, hash(input.bytes));
const stockRects = [7, 475].flatMap((x) => [130, 210, 290].map((y) => [x, y, 6, 20]));
// One predeclared common paper region is inside both ordinary and walker boxes.
// Ink rejection is shared with the HSB audit. No window search or per-card tuning.
const materialWindows = {
  frame: {
    rects: [
      [26, 100, 7, 250],
      [455, 100, 7, 250],
    ],
    paper: false,
  },
  paper: { rects: [[110, 470, 310, 100]], paper: true },
  name: { rects: [[75, 33, 337, 13]], paper: true },
};
const checkedBytes = async (directory, layer) => {
  const bytes = await readFile(path.join(directory, layer.file));
  assert.equal(hash(bytes), layer.sha256);
  return bytes;
};
const stock = (image) => {
  const pixels = [];
  for (const [x, y, w, h] of stockRects)
    for (let row = y; row < y + h; row++)
      for (let col = x; col < x + w; col++) {
        const i = (row * image.width + col) * 4;
        assert.equal(image.data[i + 3], 255, 'Stock samples must be opaque');
        pixels.push([...image.data.slice(i, i + 3)]);
      }
  return [0, 1, 2].map((c) => median(pixels.map((p) => p[c])));
};
const rows = [];
for (const e of input.value.entries) {
  assert.equal(e.face.wordingMode, 'original');
  const b = before.value.rows.find((r) => r.id === e.id),
    a = after.value.rows.find((r) => r.id === e.id);
  const s = scores.value.rows.find((r) => r.id === e.id);
  assert(b && a && s && !b.issue && !a.issue);
  for (const r of [b, a]) {
    assert.equal(r.inputHash, hash(JSON.stringify(e.face)));
    assert.equal(r.referenceHash, e.reference.sha256);
    assert.equal(r.artHash, e.art.sha256);
  }
  assert.equal(s.referenceHash, e.reference.sha256);
  assert(s.poseAccepted, 'Requires independently accepted frozen scan poses');
  const [oldBytes, currentBytes, oldEtch, currentEtch] = await Promise.all([
    checkedBytes(beforeDir, b.layers.face),
    checkedBytes(afterDir, a.layers.face),
    checkedBytes(beforeDir, b.layers.etching),
    checkedBytes(afterDir, a.layers.etching),
  ]);
  const oldRaw = PNG.sync.read(oldBytes, { checkCRC: true });
  const identical = oldBytes.equals(currentBytes);
  const currentRaw = identical ? oldRaw : PNG.sync.read(currentBytes, { checkCRC: true });
  assert.deepEqual([oldRaw.width, oldRaw.height], [currentRaw.width, currentRaw.height]);
  let changedPixels = 0,
    alphaChanges = 0;
  if (!identical)
    for (let i = 0; i < oldRaw.data.length; i += 4) {
      const x = oldRaw.data,
        y = currentRaw.data;
      if (x[i] !== y[i] || x[i + 1] !== y[i + 1] || x[i + 2] !== y[i + 2] || x[i + 3] !== y[i + 3])
        changedPixels++;
      if (x[i + 3] !== y[i + 3]) alphaChanges++;
    }
  assert.equal(alphaChanges, 0, 'Stock policy must preserve silhouette coverage');
  const row = {
    id: e.id,
    name: e.card.name,
    number: e.card.collector_number,
    inputHash: b.inputHash,
    referenceHash: b.referenceHash,
    poseHash: s.poseHash,
    normalizedReferenceHash: s.normalizedReference.sha256,
    nonfoilEligible: s.nonfoilEligible,
    before: Object.fromEntries(Object.entries(b.layers).map(([k, v]) => [k, v.sha256])),
    after: Object.fromEntries(Object.entries(a.layers).map(([k, v]) => [k, v.sha256])),
    changedPixels,
    alphaChanges,
    etchingUnchanged: oldEtch.equals(currentEtch),
  };
  assert(row.etchingUnchanged);
  if (s.nonfoilEligible) {
    const raw = await readFile(path.join(scoreDir, s.normalizedReference.file));
    assert.equal(hash(raw), s.normalizedReference.sha256);
    const ref = PNG.sync.read(raw, { checkCRC: true });
    assert.deepEqual([ref.width, ref.height], [488, 680]);
    const old = normalize(oldRaw),
      current = identical ? old : normalize(currentRaw);
    row.stock = { reference: stock(ref), before: stock(old), after: stock(current) };
    row.stock.beforeDistance = Math.hypot(
      ...row.stock.before.map((v, i) => v - row.stock.reference[i]),
    );
    row.stock.afterDistance = Math.hypot(
      ...row.stock.after.map((v, i) => v - row.stock.reference[i]),
    );
    if (changedPixels) {
      row.materials = {};
      for (const [part, w] of Object.entries(materialWindows)) {
        try {
          const r = sampleColor(ref, w.rects, { paper: w.paper }),
            b = sampleColor(old, w.rects, { paper: w.paper }),
            a = sampleColor(current, w.rects, { paper: w.paper });
          row.materials[part] = {
            before: delta(b.rgb, r.rgb),
            after: delta(a.rgb, r.rgb),
            referenceRgb: r.rgb,
            beforeRgb: b.rgb,
            afterRgb: a.rgb,
          };
        } catch (error) {
          if (!/Too few usable color tiles/.test(error.message)) throw error;
          row.materials[part] = { missing: error.message };
        }
      }
    }
  }
  rows.push(row);
}
const mean = (a) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : null);
const nonfoil = rows.filter((r) => r.nonfoilEligible),
  changed = rows.filter((r) => r.changedPixels);
const summary = {
  faces: rows.length,
  unchangedFaces: rows.length - changed.length,
  changedFaces: changed.length,
  unchangedEtchings: rows.filter((r) => r.etchingUnchanged).length,
  alphaChanges: rows.reduce((n, r) => n + r.alphaChanges, 0),
  stock: {
    nonfoil: nonfoil.length,
    referenceRGB: [0, 1, 2].map((c) => median(nonfoil.map((r) => r.stock.reference[c]))),
    beforeMeanDistance: mean(nonfoil.map((r) => r.stock.beforeDistance)),
    afterMeanDistance: mean(nonfoil.map((r) => r.stock.afterDistance)),
    changedNonfoil: nonfoil.filter((r) => r.changedPixels).length,
  },
  materials: Object.fromEntries(
    Object.keys(materialWindows).map((part) => {
      const rs = changed.map((r) => r.materials?.[part]).filter((r) => r?.before !== undefined);
      return [
        part,
        {
          measured: rs.length,
          before: mean(rs.map((r) => r.before)),
          after: mean(rs.map((r) => r.after)),
        },
      ];
    }),
  ),
};
await writeJson(output, {
  schema: 1,
  scope:
    'Complete native Original census. Fixed stock patches and common paper windows; foil-only scans excluded from all pigment measurements. RGB distances are diagnostic bytes, material deltas are Oklab×100. This is stock adoption evidence, not whole-set completion.',
  definition: {
    inputsHash: hash(input.bytes),
    beforeCaptureHash: hash(before.bytes),
    afterCaptureHash: hash(after.bytes),
    beforeRenderer: before.value.source.rendererHash,
    afterRenderer: after.value.source.rendererHash,
    scoresHash: hash(scores.bytes),
    normalizationHash: scores.value.definition.normalizationHash,
    metricGraph: scores.value.definition.metricGraph,
    toolHash: hash(await readFile(new URL(import.meta.url))),
    stockRects,
    materialWindows,
  },
  summary,
  rows,
});
console.log(JSON.stringify(summary));
