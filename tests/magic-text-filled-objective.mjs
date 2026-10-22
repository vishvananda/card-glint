import test from 'node:test';
import assert from 'node:assert/strict';
import { TextFilledObjective } from '../games/magic/tools/accuracy/text-filled-objective.mjs';
const width = 100,
  height = 50;
const raster = (dx = 0, hollow = false, offset = 0, badge = false) => {
  const gray = new Float32Array(width * height).fill(205 + offset);
  for (let y = 11; y < 38; y++)
    for (let x = 12; x < 43; x++) {
      const inside = x < 17 || x > 37 || (y >= 22 && y <= 26);
      const edge =
        inside &&
        (!(x > 12 && x < 16 && y > 11 && y < 37) || y === 22 || y === 26 || x === 38 || x === 42);
      if (inside && (!hollow || edge)) gray[y * width + x + dx] = 32 + offset;
    }
  if (badge)
    for (let y = 15; y < 35; y++) for (let x = 70; x < 90; x++) gray[y * width + x] = 32 + offset;
  return gray;
};
const mask = new Uint8Array(width * height).fill(1);
test('Exact filled ink wins over shifted or hollow shapes', () => {
  const objective = new TextFilledObjective(raster(), width, height, mask);
  const exact = objective.score(raster()),
    shifted = objective.score(raster(3)),
    hollow = objective.score(raster(0, true));
  assert(Math.abs(exact.score - 1) < 1e-12);
  assert(exact.filled > hollow.filled);
  assert(exact.score > hollow.score);
  assert(exact.score > shifted.score);
});
test('A photometric offset preserves the local-contrast measurement', () => {
  const objective = new TextFilledObjective(raster(), width, height, mask);
  assert(
    Math.abs(objective.score(raster()).score - objective.score(raster(0, false, 25)).score) < 1e-12,
  );
});
test('Fixed semantic exclusions remove a badge without moving glyphs', () => {
  const exclude = mask.slice();
  for (let y = 8; y < 42; y++) for (let x = 63; x < 97; x++) exclude[y * width + x] = 0;
  const objective = new TextFilledObjective(raster(0, false, 0, true), width, height, exclude);
  assert(Math.abs(objective.score(raster()).score - 1) < 1e-12);
});
test('Empty and mismatched rasters cannot produce a plausible score', () => {
  const objective = new TextFilledObjective(raster(), width, height, mask);
  assert.equal(objective.score(new Float32Array(width * height).fill(205)).score, -1);
  assert.throws(() => objective.score(new Float32Array(1)), /changed/);
  assert.throws(
    () => new TextFilledObjective(raster(), width, height, new Uint8Array(1)),
    /dimensions/,
  );
});
