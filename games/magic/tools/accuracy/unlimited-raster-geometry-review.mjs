// Verify unchanged Unlimited geometry after the raster-selection correction.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { gzipSync, gunzipSync } from 'node:zlib';
import { PNG } from 'pngjs';
import { hash, objectFile, sourceHash } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { abuPaperDelta } from './abu-paper-ancestry.mjs';
import { abuRasterDelta } from './abu-raster-ancestry.mjs';
const [nativeDirectory, inputFile, output] = process.argv.slice(2);
assert(output, 'Usage: unlimited-raster-geometry-review.mjs RASTER_NATIVE INPUTS OUTPUT_GZ');
const paper = await abuPaperDelta(),
  raster = await abuRasterDelta();
assert.equal(await sourceHash('games/magic/src'), paper.afterRenderer);
const ib = await readFile(inputFile),
  inputs = JSON.parse(ib);
const native = JSON.parse(gunzipSync(await readFile(paper.native.file)));
const priorNative = JSON.parse(gunzipSync(await readFile(raster.native.file)));
assert.equal(hash(ib), native.source.inputHash);
const patches = {
  left: [10, 100, 25, 500, 'x'],
  right: [454, 100, 25, 500, 'x'],
  top: [80, 10, 330, 21, 'y'],
  bottom: [80, 644, 330, 28, 'y'],
  artLeft: [44, 125, 34, 200, 'x'],
  artRight: [408, 125, 36, 200, 'x'],
  artTop: [110, 60, 275, 30, 'y'],
  artBottom: [110, 350, 275, 40, 'y'],
  paperLeft: [45, 450, 40, 125, 'x'],
  paperRight: [402, 450, 45, 125, 'x'],
  paperTop: [110, 392, 275, 40, 'y'],
  paperBottom: [110, 583, 275, 40, 'y'],
};
const median = (a) => {
  const b = a.toSorted((x, y) => x - y);
  return (b[Math.floor((b.length - 1) / 2)] + b[Math.ceil((b.length - 1) / 2)]) / 2;
};
function edge(image, [x, y, w, h, axis]) {
  const n = axis === 'x' ? w : h,
    along = axis === 'x' ? h : w;
  let rgb = Array.from({ length: n }, (_, i) =>
    [0, 1, 2].map((k) =>
      median(
        Array.from(
          { length: along },
          (_, j) =>
            image.data[((y + (axis === 'x' ? j : i)) * 488 + x + (axis === 'x' ? i : j)) * 4 + k],
        ),
      ),
    ),
  );
  for (let pass = 0; pass < 2; pass++)
    rgb = rgb.map((v, i) =>
      v.map((_, k) => (rgb[Math.max(0, i - 1)][k] + 2 * v[k] + rgb[Math.min(n - 1, i + 1)][k]) / 4),
    );
  return rgb.slice(1).map((v, i) => Math.hypot(...v.map((c, k) => c - rgb[i][k])));
}
const sample = (a, x) => {
  const i = Math.floor(x),
    f = x - i;
  return (a[i] ?? 0) * (1 - f) + (a[i + 1] ?? 0) * f;
};
function overlap(a, b, shift = 0) {
  let dot = 0,
    aa = 0,
    bb = 0;
  for (let i = 4; i < a.length - 4; i++) {
    const x = sample(a, i - shift),
      y = b[i];
    dot += x * y;
    aa += x * x;
    bb += y * y;
  }
  if (aa <= 1 || bb <= 1) return 0; // A displaced/missing edge cannot match.
  return (100 * dot) / Math.sqrt(aa * bb);
}
const rows = [];
for (const m of raster.members.filter((m) => m.set === '2ed')) {
  const e = inputs.entries.find((e) => e.id === m.id),
    current = native.rows.find((r) => r.id === m.id);
  assert.equal(current.referenceHash, m.referenceHash);
  assert.equal(current.poseHash, m.poseHash);
  assert.equal(current.inputHash, m.inputHash);
  assert.equal(current.original.hashes['after-face'], m.original.hashes['after-face']);
  const paired = priorNative.faces.filter((r) => r.id === m.id);
  assert.equal(paired.length, 6);
  assert(paired.every((r) => r.alpha === 0 && r.interior === 0));
  const rb = await readFile(objectFile(e.reference));
  assert.equal(hash(rb), e.reference.sha256);
  const ref = normalize(PNG.sync.read(rb), e.pose.transform),
    images = {};
  for (const version of ['before', 'after']) {
    const bytes = await readFile(
      path.join(nativeDirectory, m.id + '-original-original-' + version + '-face.png'),
    );
    assert.equal(hash(bytes), m.original.hashes[version + '-face']);
    images[version] = normalize(PNG.sync.read(bytes));
  }
  const strips = {};
  for (const [key, rect] of Object.entries(patches)) {
    const before = edge(images.before, rect),
      after = edge(images.after, rect),
      reference = edge(ref, rect);
    for (const [label, values] of Object.entries({ before, after, reference }))
      assert(
        values.slice(4, -4).reduce((sum, v) => sum + v * v, 0) > 1,
        'Weak base strip: ' + m.name + '/' + key + '/' + label,
      );
    let best = { shift: 0, score: overlap(before, after) };
    for (let n = -40; n <= 40; n++) {
      const shift = n * 0.05,
        score = overlap(before, after, shift);
      if (score > best.score + 1e-10) best = { shift, score };
    }
    // Deliberate two-pixel moves must be distinguishable from the retained geometry.
    const negative = [-2, 2].map((shift) => ({ shift, score: overlap(before, after, shift) }));
    strips[key] = {
      samePosition100: overlap(before, after),
      best,
      negative,
      referenceBefore100: overlap(before, reference),
      referenceAfter100: overlap(after, reference),
    };
  }
  rows.push({
    id: m.id,
    name: m.name,
    set: m.set,
    referenceHash: m.referenceHash,
    poseHash: m.poseHash,
    inputHash: m.inputHash,
    beforeFaceHash: m.original.hashes['before-face'],
    currentFaceHash: current.original.hashes['after-face'],
    nativeInteriorExact: true,
    pairedLayers: paired.length,
    strips,
  });
}
assert.equal(rows.length, 5);
const result = {
  schema: 1,
  status: 'unlimited-raster-geometry-measurement',
  scope:
    'Five Unlimited outline-selection variants. Layout/stock/art/paper coordinates and scan poses are unchanged. Current Original pixels reproduce the scoped raster replay; latest899 census confirms identical current Unlimited faces. Four frame-only outer rails exclude title and credit text. Eight interior strips are secondary diagnostics; the complete native interior is already byte-exact in all six paired layers. No content is used to fit a pose. This is not a new scan fit or a full-card/text completion.',
  source: {
    rendererHash: paper.afterRenderer,
    nativeFile: paper.native.file,
    nativeHash: paper.native.contentSha256,
    priorNativeFile: raster.native.file,
    priorNativeHash: raster.native.contentSha256,
    inputHash: hash(ib),
    toolHash: hash(await readFile(new URL(import.meta.url))),
    samplerHash: hash(await readFile(new URL('./pixels-pure.mjs', import.meta.url))),
  },
  patches,
  rows,
};
await writeFile(output, gzipSync(Buffer.from(JSON.stringify(result) + '\n'), { mtime: 0 }));
console.log(
  JSON.stringify(
    rows.map((r) => ({
      name: r.name,
      minPosition100: Math.min(...Object.values(r.strips).map((s) => s.samePosition100)),
      maxShift: Math.max(...Object.values(r.strips).map((s) => Math.abs(s.best.shift))),
      maxReferenceLoss: Math.max(
        ...Object.values(r.strips).map((s) => s.referenceBefore100 - s.referenceAfter100),
      ),
      minNegativeLoss: Math.min(
        ...Object.values(r.strips).flatMap((s) =>
          s.negative.map((n) => s.samePosition100 - n.score),
        ),
      ),
    })),
  ),
);
