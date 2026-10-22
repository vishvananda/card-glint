import assert from 'node:assert/strict';
import { selectedColorPatches } from '../games/magic/tools/accuracy/modern-land-role-fit.mjs';
const mask = { width: 40, height: 30, data: new Uint8Array(40 * 30 * 4) };
for (let y = 2; y < 28; y++) for (let x = 2; x < 38; x++) mask.data[(y * 40 + x) * 4 + 3] = 255;
// An internal hole and a weak antialiased pixel cannot drive a pigment fit.
for (let y = 12; y < 17; y++) for (let x = 17; x < 23; x++) mask.data[(y * 40 + x) * 4 + 3] = 0;
mask.data[(8 * 40 + 8) * 4 + 3] = 249;
assert.throws(() => selectedColorPatches(mask, { size: 2, erosion: -1 }));
assert.throws(() => selectedColorPatches(mask, { size: 2, side: 'middle' }));
const options = { size: 3, erosion: 1 };
const all = selectedColorPatches(mask, options);
assert(all.length > 10);
for (const [x, y, w, h] of all) {
  assert.equal(w, 3);
  assert.equal(h, 3);
  for (let yy = y - 1; yy < y + h + 1; yy++)
    for (let xx = x - 1; xx < x + w + 1; xx++) assert.equal(mask.data[(yy * 40 + xx) * 4 + 3], 255);
}
const left = selectedColorPatches(mask, { ...options, side: 'left' });
const right = selectedColorPatches(mask, { ...options, side: 'right' });
assert(left.length && right.length);
assert(left.every(([x, , w]) => x + w <= 40 * 0.45));
assert(right.every(([x]) => x >= 40 * 0.55));
const before = JSON.stringify(all);
for (let i = 0; i < mask.data.length; i += 4) mask.data[i] = (i * 17) % 255;
assert.equal(JSON.stringify(selectedColorPatches(mask, options)), before);
mask.data.fill(0);
assert.deepEqual(selectedColorPatches(mask, options), []);
console.log(
  'Authored-mask pigment sampling excludes edges, holes, weak alpha and blended center; RGB does not select its geometry.',
);
