import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { hash, objectFile, root, writeJson } from './common.mjs';
import { normalizedRgbaRegion } from './normalized-rgba-region.mjs';
const [inputFile, captureFile, poseFile, refinementFile, out] = process.argv.slice(2);
assert(out, 'Use INPUTS NATIVE_CAPTURE PARENT_POSES LAND_REFINEMENT OUTPUT');
const raw = await Promise.all(
  [inputFile, captureFile, poseFile, refinementFile].map((f) => fs.readFile(f)),
);
const [input, capture, poses, refinement] = raw.map((b) => JSON.parse(b));
assert.equal(capture.inputHash, hash(raw[0]));
assert.equal(refinement.inputHash, hash(raw[0]));
assert.equal(refinement.parentHash, hash(raw[2]));
const entries = input.entries.filter((e) => e.card.set === '4ed');
assert.equal(entries.length, 378);
assert.equal(new Set(entries.map((e) => e.id)).size, 378);
const quantile = (values, p) => {
  const a = [...values].sort((a, b) => a - b),
    x = (a.length - 1) * p,
    lo = Math.floor(x);
  return a[lo] + (a[Math.ceil(x)] - a[lo]) * (x - lo);
};
const rgbMedian = (values) =>
  [0, 1, 2].map((c) =>
    quantile(
      values.map((p) => p[c]),
      0.5,
    ),
  );
const methodFiles = [
  'fourth-frame-dark-audit.mjs',
  'normalized-rgba-region.mjs',
  'scan-transform.mjs',
  'common.mjs',
];
const methodGuards = Object.fromEntries(
  await Promise.all(
    methodFiles.map(async (f) => [f, hash(await fs.readFile(new URL(f, import.meta.url)))]),
  ),
);
const keylineStrips = [
  [44, 120, 7, 24, 'x'],
  [44, 230, 7, 24, 'x'],
  [44, 320, 7, 24, 'x'],
  [434, 120, 8, 24, 'x'],
  [434, 230, 8, 24, 'x'],
  [434, 320, 8, 24, 'x'],
];
const patches = {
  stock: [
    [7, 120, 7, 40],
    [474, 120, 7, 40],
    [7, 300, 7, 40],
    [474, 300, 7, 40],
  ],
  frame: [
    [26, 120, 16, 40],
    [446, 120, 16, 40],
    [26, 260, 16, 40],
    [446, 260, 16, 40],
  ],
};
function sample(image, transform) {
  const result = {};
  for (const [kind, rects] of Object.entries(patches)) {
    const values = rects.flatMap((rect) => {
      const { data } = normalizedRgbaRegion(image, rect, transform),
        v = [];
      for (let i = 0; i < data.length; i += 4) {
        assert.equal(data[i + 3], 255, 'Sample escaped opaque card face');
        v.push([data[i], data[i + 1], data[i + 2]]);
      }
      return v;
    });
    const ordered = [...values].sort((a, b) => Math.max(...a) - Math.max(...b));
    result[kind] = {
      samples: values.length,
      rgb: rgbMedian(values),
      darkRgb: rgbMedian(ordered.slice(0, Math.ceil(ordered.length * 0.05))),
      maxChannelQuantiles: [0.01, 0.05, 0.1, 0.5, 0.9, 0.95, 0.99].map((p) =>
        quantile(
          values.map((v) => Math.max(...v)),
          p,
        ),
      ),
    };
  }
  const keylineValues = keylineStrips.flatMap(([x, y, w, h, axis]) => {
    assert.equal(axis, 'x');
    const { data } = normalizedRgbaRegion(image, [x, y, w, h], transform);
    return Array.from({ length: h }, (_, row) => {
      const pixels = Array.from({ length: w }, (_, col) => {
        const i = (row * w + col) * 4;
        assert.equal(data[i + 3], 255);
        return [data[i], data[i + 1], data[i + 2]];
      });
      return pixels.reduce((a, b) => (Math.max(...a) <= Math.max(...b) ? a : b));
    });
  });
  result.keyline = {
    samples: keylineValues.length,
    rgb: rgbMedian(keylineValues),
    darkRgb: rgbMedian(keylineValues),
    maxChannelQuantiles: [0.01, 0.05, 0.1, 0.5, 0.9, 0.95, 0.99].map((p) =>
      quantile(
        keylineValues.map((v) => Math.max(...v)),
        p,
      ),
    ),
  };
  return result;
}
const rows = [];
for (const e of entries) {
  const native = capture.rows.find((r) => r.id === e.id)?.modes.original,
    parent = poses.rows.find((r) => r.id === e.id),
    refined = refinement.rows.find((r) => r.id === e.id && r.acceptedExperimental);
  assert(native && parent?.accepted);
  assert.equal(native.inputHash, hash(JSON.stringify(e.face)));
  assert.equal(parent.referenceHash, e.reference.sha256);
  const transform = refined?.transform ?? parent.transform;
  const refBytes = await fs.readFile(objectFile(e.reference)),
    faceBytes = await fs.readFile(path.join(path.dirname(captureFile), native.file));
  assert.equal(hash(refBytes), e.reference.sha256);
  assert.equal(hash(faceBytes), native.sha256);
  rows.push({
    id: e.id,
    name: e.name,
    material: e.material,
    referenceHash: e.reference.sha256,
    nativeHash: native.sha256,
    poseHash: hash(JSON.stringify(transform)),
    transform,
    reference: sample(PNG.sync.read(refBytes), transform),
    rendered: sample(PNG.sync.read(faceBytes), {}),
  });
  if (rows.length % 50 === 0) console.log('Measured', rows.length, '/', entries.length);
}
const groups = {};
for (const material of [...new Set(rows.map((r) => r.material))].sort()) {
  const selected = rows.filter((r) => r.material === material);
  groups[material] = { count: selected.length };
  for (const kind of ['stock', 'frame', 'keyline']) {
    const ref = rgbMedian(selected.map((r) => r.reference[kind].darkRgb)),
      rendered = rgbMedian(selected.map((r) => r.rendered[kind].darkRgb));
    groups[material][kind] = {
      referenceDarkRgb: ref,
      renderedDarkRgb: rendered,
      channelDelta: rendered.map((v, c) => v - ref[c]),
      referenceMedianRgb: rgbMedian(selected.map((r) => r.reference[kind].rgb)),
      renderedMedianRgb: rgbMedian(selected.map((r) => r.rendered[kind].rgb)),
    };
  }
}
for (const [file, expected] of Object.entries(methodGuards))
  assert.equal(hash(await fs.readFile(new URL(file, import.meta.url))), expected);
await writeJson(out, {
  schema: 1,
  set: '4ed',
  status: 'frame-dark-tail-and-stock-diagnostic',
  scope:
    'All 378 current native Original faces against fixed normalized scans. Four stock and four frame-only patches exclude illustration, titles, rules, artist and symbols. Darkest five-percent frame samples measure pigment tails, not pure black ink. Six outside-art vertical normal strips independently measure dark keylines. Stock observations include provider-cleaned white backgrounds and do not certify physical paper. No geometry, material or per-card adjustment is fitted; keylines and bevels require separate review before changing black points.',
  inputHash: hash(raw[0]),
  captureHash: hash(raw[1]),
  parentPoseHash: hash(raw[2]),
  refinementHash: hash(raw[3]),
  rendererHash: capture.rendererHash,
  patches,
  keylineStrips,
  methodGuards,
  quantiles: [0.01, 0.05, 0.1, 0.5, 0.9, 0.95, 0.99],
  darkFraction: 0.05,
  groups,
  rows,
});
console.log(JSON.stringify(groups, null, 2));
