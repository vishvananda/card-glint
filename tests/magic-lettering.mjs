import assert from 'node:assert/strict';
import { compareLettering } from '../games/magic/tools/accuracy/lettering-metrics.mjs';
import { letteringContrast } from '../games/magic/tools/accuracy/lettering-contrast.mjs';

// Paired dark strokes and pale highlights model the failure seen in Revised:
// a dark-only match can stay high even when the pale half is completely absent.
const width = 96,
  height = 32;
const reference = new Float32Array(width * height).fill(125);
const missingHighlight = reference.slice();
for (let left = 10; left < 85; left += 18)
  for (let y = 7; y < 25; y++)
    for (let x = left; x < left + 8; x++) {
      reference[y * width + x] = x < left + 3 ? 30 : 225;
      missingHighlight[y * width + x] = x < left + 3 ? 30 : 125;
    }
const exact = compareLettering(reference, reference, width, height);
const changedTone = compareLettering(
  reference,
  Float32Array.from(reference, (v) => v * 0.8 + 25),
  width,
  height,
);
const incomplete = compareLettering(reference, missingHighlight, width, height);
const inverted = compareLettering(
  reference,
  Float32Array.from(reference, (v) => 255 - v),
  width,
  height,
);
assert.equal(exact.edgeF1, 1);
assert.equal(changedTone.edgeF1, 1);
assert.equal(changedTone.censusSimilarity, 1);
assert.ok(incomplete.darkEdgeF1 > 0.9);
assert.ok(incomplete.edgeF1 < 0.5);
assert.equal(incomplete.lightStatus, 'missing-ink');
assert.equal(incomplete.meanDistance, null);
assert.ok(inverted.edgeF1 < 0.1 && inverted.censusSimilarity < 0.1);
const solid = new Float32Array(width * height).fill(70),
  hollow = solid.slice(),
  shifted = solid.slice();
for (let left = 10; left < 85; left += 18)
  for (let y = 7; y < 25; y++)
    for (let x = left; x < left + 8; x++) {
      solid[y * width + x] = 210;
      hollow[y * width + x] = x === left || y === 7 ? 210 : 70;
      shifted[y * width + x + 4] = 210;
    }
assert.ok(letteringContrast(solid, solid, width, height) > 0.999999);
assert.ok(
  letteringContrast(
    solid,
    Float32Array.from(solid, (v) => v * 0.7 + 30),
    width,
    height,
  ) > 0.999999,
);
assert.ok(letteringContrast(solid, hollow, width, height) < 0.7);
assert.ok(letteringContrast(solid, shifted, width, height) < 0.7);
assert.equal(letteringContrast(new Float32Array(32), new Float32Array(32), 8, 4), null);
assert.throws(() => letteringContrast(solid, solid.slice(1), width, height), /dimensions/);
console.log(
  'Lettering metrics tolerate tone changes and reject missing highlights, hollow strokes and displacement.',
);
