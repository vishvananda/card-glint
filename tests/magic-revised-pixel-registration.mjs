import assert from 'node:assert/strict';
import { normalizedRgbaRegion } from '../games/magic/tools/accuracy/normalized-rgba-region.mjs';
import { normalize } from '../games/magic/tools/accuracy/pixels-pure.mjs';
import {
  warpedFrameProfiles,
  refinePrintedFramePixels,
  selectPixelRefinement,
  verifyWarpedFrame,
} from '../games/magic/tools/accuracy/revised-frame-pixel-fit.mjs';

let parity = 0;
for (const [width, height] of [
  [244, 340],
  [672, 936],
  [750, 1050],
]) {
  const image = {
    width,
    height,
    data: Uint8Array.from(
      { length: width * height * 4 },
      (_, i) => (i * 17 + Math.floor(i / 11) * 31) % 256,
    ),
  };
  for (const transform of [
    {},
    { tx: 0.375, ty: -0.625, scale: 1.007, rotation: 0.003 },
    { matrix: [1.002, 0.002, -0.001, 0.999, 0.3125, -0.125] },
  ]) {
    const full = normalize(image, transform);
    for (const rect of [
      [42, 445, 22, 25],
      [426, 550, 28, 25],
      [0, 0, 17, 13],
      [477, 667, 11, 13],
    ]) {
      const actual = normalizedRgbaRegion(image, rect, transform),
        expected = [];
      for (let y = rect[1]; y < rect[1] + rect[3]; y++)
        expected.push(
          ...full.data.subarray((y * 488 + rect[0]) * 4, (y * 488 + rect[0] + rect[2]) * 4),
        );
      assert.deepEqual(actual.data, Uint8Array.from(expected));
      parity++;
    }
  }
}
const width = 488,
  height = 680,
  image = { width, height, data: new Uint8Array(width * height * 4) };
for (let y = 0; y < height; y++)
  for (let x = 0; x < width; x++) {
    const ink = x === 54 || x === 55 || x === 436 || x === 437,
      paper = x > 55 && x < 436,
      value = ink ? 12 : paper ? 210 : 75;
    image.data.set([value, value - 3, value - 5, 255], (y * width + x) * 4);
  }
const templates = warpedFrameProfiles(image, {});
const normal = refinePrintedFramePixels(image, {}, templates);
assert.equal(normal.accepted, true);
assert.equal(normal.refinement, 0);
const displaced = refinePrintedFramePixels(image, { tx: 0.5 }, templates);
assert.equal(displaced.refinement, -0.5);
assert.equal(displaced.accepted, true);
assert.equal(displaced.transform.matrix[4], 0);

const toned = { ...image, data: image.data.map((v, i) => (i % 4 === 3 ? v : v + 20)) };
const benign = refinePrintedFramePixels(toned, {}, templates);
assert.equal(benign.refinement, 0);
assert.equal(benign.accepted, true);
const wrongGeometry = { ...image, data: image.data.slice() };
for (let y = 500; y < 575; y++)
  for (let x = 426; x < 454; x++)
    wrongGeometry.data.set(
      image.data.subarray((y * width + x + 2) * 4, (y * width + x + 2) * 4 + 4),
      (y * width + x) * 4,
    );
const inconsistent = refinePrintedFramePixels(wrongGeometry, {}, templates);
assert.equal(inconsistent.refinement, 0);
assert.equal(inconsistent.fitPassed, true);
assert.equal(inconsistent.independentPassed, false);
assert.equal(inconsistent.accepted, false);
const missing = { ...image, data: new Uint8Array(image.data.length).fill(128) };
assert.equal(refinePrintedFramePixels(missing, {}, templates).accepted, false);

// Verification fields never select a fit; poisoning them must instead reject it.
const poisonedTrials = structuredClone(normal.trials);
for (const trial of poisonedTrials) trial.profiles.validationRight = [NaN];
assert.deepEqual(selectPixelRefinement(poisonedTrials, templates), {
  delta: normal.refinement,
  score: normal.fitScore,
});
const poisonedChecks = structuredClone(normal.profiles);
poisonedChecks.certificateRight.fill(0);
assert.equal(
  verifyWarpedFrame(poisonedChecks, templates, { delta: normal.refinement, score: normal.fitScore })
    .accepted,
  false,
);

// Observe the sampling footprint, then alter every source byte outside it.
const reads = new Set(),
  tracked = new Proxy(image.data, {
    get(target, key) {
      if (/^\d+$/.test(String(key))) reads.add(Number(key));
      return Reflect.get(target, key, target);
    },
  });
const rect = [426, 550, 28, 25],
  transform = { matrix: [1.002, 0.002, -0.001, 0.999, 0.3125, -0.125] };
const observed = normalizedRgbaRegion({ ...image, data: tracked }, rect, transform);
assert(reads.size < image.data.length / 50, 'Window sampling must avoid full-card work');
const mutated = { ...image, data: image.data.map((v, i) => (reads.has(i) ? v : (i * 71) % 256)) };
assert.deepEqual(normalizedRgbaRegion(mutated, rect, transform), observed);
const altered = { ...image, data: image.data.slice() };
for (const index of reads) altered.data[index] = 128;
assert.notDeepEqual(normalizedRgbaRegion(altered, rect, transform).data, observed.data);
for (const invalid of [
  [-1, 0, 10, 10],
  [0, 0, 0, 10],
  [480, 0, 20, 10],
  [0.5, 0, 10, 10],
])
  assert.throws(() => normalizedRgbaRegion(image, invalid));
assert.throws(() => normalizedRgbaRegion(image, rect, { matrix: [-1, 0, 0, 1, 0, 0] }));
assert.throws(() => normalizedRgbaRegion(image, rect, { matrix: [1, 0, 0, 1, 0, 0], scale: 1 }));
assert.throws(() => selectPixelRefinement([], templates));
console.log(
  'Pixel frame refinement:',
  parity,
  'exact RGBA windows; subpixel recovery, tone invariance, missing/contradictory edge rejection, fit/check separation and sampling isolation passed.',
);

// Frozen real-reference profiles verify selector and independent-check decisions
// without distributing card scans or requiring a network/cache in CI.
const { readFile } = await import('node:fs/promises');
const { gunzipSync } = await import('node:zlib');
const { hash } = await import('../games/magic/tools/accuracy/common.mjs');
const { revisedArtifactGeometryDelta } = await import(
  '../games/magic/tools/accuracy/revised-artifact-geometry-ancestry.mjs'
);
const proof = await revisedArtifactGeometryDelta();
const entry = proof.artifacts['artifact-pixel-normalization.json.gz'],
  packed = await readFile(entry.file),
  raw = gunzipSync(packed);
assert.equal(hash(packed), entry.sha256);
assert.equal(hash(raw), entry.contentSha256);
const frozen = JSON.parse(raw);
assert.equal(frozen.rows.length, 51);
for (const row of frozen.rows) {
  const selected = selectPixelRefinement(row.trials, frozen.templates);
  assert.equal(selected.delta, row.refinement);
  assert.equal(selected.score, row.fitScore);
  const validation = verifyWarpedFrame(row.profiles, frozen.templates, selected);
  for (const key of ['validation', 'fitPassed', 'independentPassed', 'boundary', 'accepted'])
    assert.deepEqual(validation[key], row[key], row.name + ' ' + key);
  const { scanMatrix } = await import('../games/magic/tools/accuracy/scan-transform.mjs');
  const expected = scanMatrix(row.originalTransform).slice();
  expected[4] += row.refinement;
  assert.deepEqual(row.transform, { matrix: expected });
  const poisoned = structuredClone(row.profiles);
  poisoned.certificateLeft.fill(0);
  assert.equal(verifyWarpedFrame(poisoned, frozen.templates, selected).accepted, false);
}
assert.equal(frozen.rows.filter((r) => r.accepted).length, 47);
assert.deepEqual(frozen.summary.rejected, proof.normalization.rejected);
assert.equal(frozen.summary.calibrationMedianRefinement, 0);
console.log(
  'Frozen51 exact-pixel frame decisions replay;47 pass,4 retained exclusions;verification cannot select a pose.',
);
