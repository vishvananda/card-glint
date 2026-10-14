import assert from 'node:assert/strict';
import {
  symbolAlignmentRegion,
  containedSymbol,
  compareSymbolAlignment,
} from '../games/magic/tools/accuracy/symbol-alignment-region.mjs';

const width = 72,
  height = 40;
function symbol(dx = 0, rim = true) {
  const gray = new Float32Array(width * height).fill(140);
  const fill = (x, y, w, h, value) => {
    for (let v = y; v < y + h; v++)
      for (let u = x; u < x + w; u++) gray[v * width + u + dx] = value;
  };
  if (rim) fill(20, 7, 26, 26, 235);
  fill(23, 10, 20, 20, 25);
  fill(29, 16, 8, 8, 140);
  return gray;
}
const reference = symbol(),
  exact = compareSymbolAlignment(reference, reference, width, height),
  moved = compareSymbolAlignment(reference, symbol(5), width, height),
  faded = compareSymbolAlignment(
    reference,
    Float32Array.from(reference, (v) => v * 0.8 + 20),
    width,
    height,
  ),
  missingRim = compareSymbolAlignment(reference, symbol(0, false), width, height);
for (const ink of ['dark', 'light']) {
  assert.equal(exact[ink].status, 'measured');
  assert.equal(exact[ink].f1, 1);
  assert.ok(moved[ink].f1 < 0.75, `${ink} must detect a shifted symbol`);
  assert.ok(faded[ink].f1 > 0.98, `${ink} must tolerate affine brightness/contrast differences`);
}
assert.ok(
  missingRim.light.f1 < missingRim.dark.f1,
  'Separate light score must reveal a lost white rim',
);
assert.equal(
  compareSymbolAlignment(new Float32Array(40), new Float32Array(40), 10, 4).dark.status,
  'empty',
);
const bounds = [418.5, 379.8, 17, 23.4],
  region = symbolAlignmentRegion(bounds);
assert.ok(containedSymbol(region, bounds));
assert.ok(containedSymbol(region, [410.4, 377.9, 22.1, 25.3]));
assert.ok(
  !containedSymbol(region, [395, 377.9, 37, 25.3]),
  'Clipped candidates cannot benefit from a smaller crop',
);
assert.throws(() => symbolAlignmentRegion([NaN, 0, 20, 20]));
assert.throws(() => symbolAlignmentRegion([0, 0, 0, 20]));
console.log(
  'Symbol alignment: displacement, brightness, lost light rim and frozen crop containment pass.',
);
