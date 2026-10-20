import './magic-early-mana-trial.mjs';
import './magic-early-body-refresh.mjs';
import './magic-native-text-window.mjs';
import assert from 'node:assert/strict';
import {
  JsTextObjective,
  nativeGrayCrop,
} from '../games/magic/tools/accuracy/abu-type-objective.mjs';
import { normalize, cropGray } from '../games/magic/tools/accuracy/pixels-pure.mjs';

const image = { width: 732, height: 1020, data: new Uint8Array(732 * 1020 * 4) };
for (let y = 0; y < 1020; y++)
  for (let x = 0; x < 732; x++) {
    const p = (y * 732 + x) * 4;
    image.data[p] = (x * 3 + y * 5) % 256;
    image.data[p + 1] = (x + y * 7) % 256;
    image.data[p + 2] = (x * 11 + y) % 256;
    image.data[p + 3] = 255;
  }
const rect = [54, 411, 390, 190];
assert.deepEqual(nativeGrayCrop(image, rect), cropGray(normalize(image), rect).gray);
const w = 96,
  h = 64,
  gray = new Float32Array(w * h).fill(210);
for (let y = 12; y < 47; y++)
  for (let x = 10; x < 80; x++) if (x % 14 < 3 || y % 13 < 3) gray[y * w + x] = 30;
const objective = new JsTextObjective(gray, w, h);
assert.ok(objective.score(gray)[0] > 0.999999);
const shifted = new Float32Array(w * h).fill(210);
for (let y = 0; y < h - 4; y++)
  for (let x = 0; x < w - 5; x++) shifted[(y + 4) * w + x + 5] = gray[y * w + x];
assert.ok(objective.score(shifted)[0] < objective.score(gray)[0] - 0.1);
assert.equal(objective.score(new Float32Array(w * h).fill(210))[0], -1);
assert.throws(() => objective.score(new Float32Array(5)), /dimensions/);
console.log(
  'ABU text objective: native crop parity, exact ink, displacement and missing-ink penalties pass.',
);
