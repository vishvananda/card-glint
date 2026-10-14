import assert from 'node:assert/strict';
import {
  plateStockMaskProof,
  plateStockTarget,
  normalizePlateStock,
} from '../games/magic/tools/accuracy/plate-stock-target.mjs';

const raster = () => ({ width: 488, height: 680, data: new Uint8Array(488 * 680 * 4) });
const frame = raster(),
  mask = raster(),
  geometry = raster();
for (let y = 0; y < 680; y++)
  for (let x = 0; x < 488; x++) {
    const inside = x >= 26 && x < 462 && y >= 29 && y < 650;
    const i = (y * 488 + x) * 4;
    frame.data.set(inside ? [80, 80, 80, 255] : [0, 0, 0, 255], i);
    mask.data.set([0, 0, 0, inside ? 0 : 255], i);
    geometry.data.set(inside ? [80, 80, 80, 255] : [235, 235, 235, 255], i);
  }
const proof = plateStockMaskProof(frame, mask);
assert.equal(proof.accepted, true);
assert.ok(Object.values(proof.sides).every((s) => s.matching === 26));
const dark = structuredClone(frame);
for (let y = 640; y < 680; y++)
  for (let x = 0; x < 488; x++) dark.data.fill(0, (y * 488 + x) * 4, (y * 488 + x) * 4 + 3);
assert.equal(plateStockMaskProof(dark, mask).accepted, true, 'Three visible source sides suffice');
const wrong = structuredClone(mask);
for (let y = 0; y < 680; y++)
  for (let x = 0; x < 488; x++)
    wrong.data[(y * 488 + x) * 4 + 3] = x >= 30 && x < 458 && y >= 33 && y < 646 ? 0 : 255;
assert.equal(
  plateStockMaskProof(frame, wrong).accepted,
  false,
  'Sibling mask cannot certify a plate',
);
assert.throws(() => plateStockMaskProof(frame, { ...mask, width: 490 }));
const target = plateStockTarget(geometry, proof, 'white');
assert.equal(target.reliable, true);
assert.equal(normalizePlateStock(geometry, target, 'white').accepted, true);
const rejected = plateStockTarget(geometry, plateStockMaskProof(frame, wrong), 'white');
assert.equal(rejected.reliable, false);
assert.equal(
  normalizePlateStock(geometry, rejected, 'white').accepted,
  false,
  'Good scan anchors cannot override a failed source proof',
);
const empty = raster();
assert.equal(normalizePlateStock(empty, target, 'white').accepted, false);
console.log(
  'Exact plate targets: native mask proof, dark material, wrong mask and scan rejection pass.',
);
