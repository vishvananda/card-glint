import assert from 'node:assert/strict';
import {
  footerRegions,
  footerPatch,
  patchMeasurement,
  displacementDice,
} from '../games/magic/tools/accuracy/modern-footer-regions.mjs';
const rect = [88, 648, 185, 19];
function glyphs({
  dx = 0,
  empty = false,
  hollow = false,
  contrast = false,
  saturated = false,
  adjacent = false,
} = {}) {
  const width = 488,
    height = 680,
    data = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const sx = x - dx;
      const shape =
        !empty &&
        ((sx >= 100 && sx < 107 && y >= 651 && y < 662) ||
          (sx >= 116 && sx < 125 && y >= 651 && y < 662) ||
          (sx >= 137 && sx < 144 && y >= 651 && y < 662));
      const neighbor = adjacent && sx >= 300 && sx < 440 && y >= 646 && y < 651;
      const inside = neighbor || (shape && !(hollow && sx % 3 === 1 && y > 652 && y < 661));
      let value = inside ? 240 : 20;
      if (contrast) value = 0.6 * value + 30;
      const i = (y * width + x) * 4;
      data[i] = value;
      data[i + 1] = saturated ? Math.round(value * 0.4) : value;
      data[i + 2] = saturated ? Math.round(value * 0.2) : value;
      data[i + 3] = 255;
    }
  return { width, height, data };
}
const reference = footerPatch(glyphs(), rect);
const identity = footerPatch(glyphs(), rect);
assert.equal(patchMeasurement(reference, identity).fillDice, 1);
assert.equal(patchMeasurement(reference, identity).edgeF1[1], 1);
assert.equal(
  patchMeasurement(reference, footerPatch(glyphs({ saturated: true }), rect)).fillDice,
  1,
);
assert(
  patchMeasurement(reference, footerPatch(glyphs({ contrast: true }), rect)).fillDice > 0.99999,
);
const wideRect = footerRegions({}).artist[0];
const croppedNeighbor = footerPatch(glyphs({ adjacent: true }), wideRect);
const wideIdentity = footerPatch(glyphs(), wideRect);
assert(
  patchMeasurement(croppedNeighbor, wideIdentity).boundaryReview.reference.includes('top'),
  'An adjacent row entering the artist cell must trigger region review',
);
assert.deepEqual(patchMeasurement(reference, identity).boundaryReview, {
  reference: [],
  rendered: [],
});
const shifted = footerPatch(glyphs({ dx: 2 }), rect);
assert(patchMeasurement(reference, shifted).fillDice < 0.9);
assert.equal(patchMeasurement(reference, shifted, -2, 0).fillDice, 1);
const hollow = footerPatch(glyphs({ hollow: true }), rect);
assert(
  patchMeasurement(reference, hollow).fillDice < 0.9,
  'Extra contours cannot replace filled ink',
);
const absent = patchMeasurement(reference, footerPatch(glyphs({ empty: true }), rect));
assert.equal(absent.status, 'missing-ink');
assert.equal(absent.fillDice, 0);
assert.equal(
  patchMeasurement(footerPatch(glyphs({ empty: true }), rect), identity).status,
  'low-reference-signal',
);
for (const dx of [-2, -0.5, 0, 0.25, 2])
  for (const dy of [-2, -0.25, 0, 0.5, 2]) {
    assert(
      Math.abs(
        displacementDice([[reference, shifted]], dx, dy) -
          patchMeasurement(reference, shifted, dx, dy).fillDice,
      ) < 1e-7,
    );
  }
const plain = footerRegions({}),
  stats = footerRegions({ power: '0', toughness: '1' }),
  walker = footerRegions({ loyalty: '0' });
assert.deepEqual(stats, walker, 'Zero-valued stats retain their physical footer row');
assert.notDeepEqual(stats.legal, plain.legal);
assert(stats.artist[0][2] < plain.artist[0][2]);
console.log(
  'Footer regions: color/saturation and affine contrast controls, known shifts, missing/hollow ink, zero stats and optimized displacement parity pass.',
);
