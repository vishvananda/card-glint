// Exact-source colored-artifact paper review. No fitting, registration or downloads.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { delta } from './hsb-color.mjs';

const [inputFile, beforeDir, afterDir, scoreDir, output] = process.argv.slice(2);
assert(output, 'Usage: modern-artifact-paper-audit.mjs INPUTS BEFORE AFTER SCORES OUTPUT');
const read = async (file) => {
  const bytes = await readFile(file);
  return { bytes, data: JSON.parse(bytes) };
};
const input = await read(inputFile),
  before = await read(path.join(beforeDir, 'capture.json')),
  after = await read(path.join(afterDir, 'capture.json')),
  scores = await read(path.join(scoreDir, 'scores.json'));
for (const c of [before, after]) {
  assert.equal(c.data.completed, input.data.entries.length);
  assert.equal(c.data.denominator, c.data.completed);
  assert.equal(c.data.source.inputsHash, hash(input.bytes));
  assert.deepEqual(c.data.faults, []);
  assert.equal(new Set(c.data.rows.map((r) => r.id)).size, c.data.completed);
}
assert.equal(scores.data.definition.inputsHash, hash(input.bytes));
assert.equal(input.data.set, 'm21');
const index = (rows) => new Map(rows.map((r) => [r.id, r]));
const prior = index(before.data.rows),
  next = index(after.data.rows),
  refs = index(scores.data.rows);
const selected = input.data.entries.filter(
  (e) =>
    e.face.artifact &&
    e.face.colors?.length === 1 &&
    !e.face.legendary &&
    !/\bLegendary\b/.test(e.face.canonicalTypeLine ?? e.face.typeLine ?? ''),
);
assert.equal(selected.length, 3, 'Require the full ordinary M21 colored-artifact cohort');
const ids = new Set(selected.map((e) => e.id)),
  rows = [];
const panels = { paper: [50, 442, 388, 142], name: [75, 36, 280, 11], type: [70, 387, 305, 11] };
// Bounds enclose the reviewed source-local masks and their resampling/feather support.
// They are isolation guards, not pigment-fitting windows.
const support = [
  [29, 32, 431, 40],
  [30, 382, 431, 39],
  [34, 424, 421, 206],
];
let identicalFaces = 0,
  identicalEtchings = 0;
async function load(dir, meta) {
  const bytes = await readFile(path.join(dir, meta.file));
  assert.equal(hash(bytes), meta.sha256);
  return PNG.sync.read(bytes, { checkCRC: true });
}
for (const e of input.data.entries) {
  const b = prior.get(e.id),
    a = next.get(e.id),
    s = refs.get(e.id);
  assert(b && a && s && !b.issue && !a.issue);
  for (const r of [b, a]) {
    assert.equal(r.inputHash, hash(JSON.stringify(e.face)));
    assert.equal(r.referenceHash, e.reference.sha256);
  }
  for (const layer of ['face', 'etching']) {
    const x = await load(beforeDir, b.layers[layer]),
      y = await load(afterDir, a.layers[layer]);
    assert.deepEqual([x.width, x.height], [y.width, y.height]);
    const identical = x.data.equals(y.data);
    if (layer === 'etching') {
      assert(identical, 'Changed etching: ' + e.card.name);
      identicalEtchings++;
      continue;
    }
    if (!ids.has(e.id)) {
      assert(identical, 'Changed unrelated face: ' + e.card.name);
      identicalFaces++;
      continue;
    }
    assert(!identical, 'Colored paper did not change: ' + e.card.name);
    let changedPixels = 0;
    for (let py = 0; py < x.height; py++)
      for (let px = 0; px < x.width; px++) {
        const i = (py * x.width + px) * 4;
        if ([0, 1, 2, 3].every((c) => x.data[i + c] === y.data[i + c])) continue;
        assert.equal(x.data[i + 3], y.data[i + 3], 'Changed silhouette');
        const cx = ((px + 0.5) * 488) / x.width,
          cy = ((py + 0.5) * 680) / x.height;
        assert(
          support.some(([sx, sy, w, h]) => cx >= sx && cx < sx + w && cy >= sy && cy < sy + h),
          'Changed pixel outside paper support: ' + e.card.name + '/' + cx + '/' + cy,
        );
        changedPixels++;
      }
    const old = normalize(x),
      current = normalize(y),
      ref = await load(scoreDir, s.normalizedReference);
    assert.deepEqual([ref.width, ref.height], [488, 680]);
    assert(s.poseAccepted && s.nonfoilEligible, 'Requires accepted nonfoil reference');
    const result = {
      id: e.id,
      name: e.card.name,
      number: e.card.collector_number,
      palette: e.face.colors[0],
      inputHash: a.inputHash,
      referenceHash: s.referenceHash,
      poseHash: s.poseHash,
      normalizedReferenceHash: s.normalizedReference.sha256,
      beforeFaceHash: b.layers.face.sha256,
      afterFaceHash: a.layers.face.sha256,
      changedPixels,
      panels: {},
    };
    for (const [name, [rx, ry, w, h]] of Object.entries(panels)) {
      const values = [[], [], []];
      let pixels = 0;
      for (let py = ry; py < ry + h; py++)
        for (let px = rx; px < rx + w; px++) {
          let ink = false;
          for (let dy = -2; dy <= 2 && !ink; dy++)
            for (let dx = -2; dx <= 2 && !ink; dx++) {
              const i = ((py + dy) * 488 + px + dx) * 4;
              ink = [0, 1, 2].some((c) => Math.min(old.data[i + c], ref.data[i + c]) < 150);
            }
          if (ink) continue;
          const i = (py * 488 + px) * 4;
          for (const [n, image] of [old, current, ref].entries())
            values[n].push([image.data[i] / 255, image.data[i + 1] / 255, image.data[i + 2] / 255]);
          pixels++;
        }
      assert(pixels >= 100, 'Insufficient shared unlettered panel');
      const mean = (v) => [0, 1, 2].map((c) => v.reduce((n, r) => n + r[c], 0) / v.length);
      const [oldRGB, newRGB, refRGB] = values.map(mean);
      result.panels[name] = {
        rect: panels[name],
        pixels,
        beforeRGB: oldRGB,
        afterRGB: newRGB,
        referenceRGB: refRGB,
        beforeDeltaOKLab100: delta(oldRGB, refRGB),
        afterDeltaOKLab100: delta(newRGB, refRGB),
      };
    }
    rows.push(result);
  }
}
const fields = rows.flatMap((r) => Object.values(r.panels));
const report = {
  schema: 1,
  set: 'm21',
  status: 'native-paper-palette-review-not-set-completion',
  definition: {
    inputsHash: hash(input.bytes),
    beforeCaptureHash: hash(before.bytes),
    afterCaptureHash: hash(after.bytes),
    referenceScoresHash: hash(scores.bytes),
    beforeRenderer: before.data.source.rendererHash,
    afterRenderer: after.data.source.rendererHash,
    toolHash: hash(await readFile(new URL(import.meta.url))),
    normalizationHash: scores.data.definition.normalizationHash,
    panels,
    support,
    method:
      'Full native Original faces, frozen frame-normalized nonfoil scans. Identical fixed paper windows and shared baseline/reference dark-ink exclusions, dilated two canonical pixels. No per-card shifts or pigment exceptions. OKLab distance is on a100 scale; lower is better.',
  },
  summary: {
    cards: rows.length,
    fields: fields.length,
    unrelatedFacesByteIdentical: identicalFaces,
    etchingsByteIdentical: identicalEtchings,
    beforeMeanDeltaOKLab100: fields.reduce((n, r) => n + r.beforeDeltaOKLab100, 0) / fields.length,
    afterMeanDeltaOKLab100: fields.reduce((n, r) => n + r.afterDeltaOKLab100, 0) / fields.length,
    improved: fields.filter((r) => r.afterDeltaOKLab100 < r.beforeDeltaOKLab100 - 1e-7).length,
    regressed: fields.filter((r) => r.afterDeltaOKLab100 > r.beforeDeltaOKLab100 + 1e-7).length,
  },
  review: [
    'All three ordinary colored artifacts are used: one white and two black printings. There is no independent white-card holdout; this is native verification of a shared palette fit, not independent fit validation.',
    'U/R/G colored-artifact paper remains unmeasured and unchanged. The neutral artifact paper and metal surround retain their own source calibration.',
    'Before and after must use matching font environments. Every unrelated face and every etching is decoded and compared exactly; source hashes alone do not prove cross-environment raster parity.',
  ],
  rows,
};
await writeJson(output, report);
console.log(JSON.stringify(report.summary));
