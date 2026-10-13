import assert from 'node:assert/strict';
import {
  measureSymbolBounds,
  fittedSymbolBounds,
  measureRenderedSymbol,
} from '../games/magic/tools/accuracy/symbol-bounds.mjs';
const profile = {
  region: [100, 100, 80, 80],
  limits: { width: [8, 60], height: [8, 60] },
  thresholds: [90, 130, 170],
};
function scene(scale = 1, background = 220, ink = 40, second = false, touch = false) {
  const width = 488 * scale,
    height = 680 * scale,
    data = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const sx = x / scale,
        sy = y / scale,
        inside =
          (sx >= 115 && sx < 135 && sy >= 120 && sy < 155) ||
          (second && sx >= 145 && sx < 165 && sy >= 120 && sy < 155) ||
          (touch && sy >= 116 && sy < 156 && sx >= 140 && sx < 185),
        p = (y * width + x) * 4;
      data[p] = data[p + 1] = data[p + 2] = inside ? ink : background;
      data[p + 3] = 255;
    }
  return { width, height, data };
}
const edgeProfile = { ...profile, signal: 'contrast', thresholds: [40, 60, 80] };
assert.deepEqual(measureSymbolBounds(scene(), edgeProfile).rect, [115, 120, 20, 35]);
assert.deepEqual(measureSymbolBounds(scene(2), edgeProfile).rect, [115, 120, 20, 35]);
assert.deepEqual(
  measureRenderedSymbol(scene(), scene(1, 220, 220), { ...profile, thresholds: [8, 16, 24] }).rect,
  [115, 120, 20, 35],
);
const a = measureSymbolBounds(scene(), profile),
  double = measureSymbolBounds(scene(2), profile);
assert.deepEqual(a.rect, [115, 120, 20, 35]);
assert.deepEqual(double.rect, a.rect);
assert.equal(a.stable, true);
assert.equal(double.sourcePixelSize, 0.5);
assert.deepEqual(measureSymbolBounds(scene(1, 195, 65), profile).rect, a.rect);
assert.deepEqual(
  measureSymbolBounds(scene(1, 220, 40, false, true), profile).rect,
  a.rect,
  'A frame line touching the window must not replace the symbol.',
);
assert.equal(
  measureSymbolBounds(scene(1, 220, 40, true), profile).stable,
  false,
  'Two equally plausible symbols must be flagged.',
);
assert.ok(
  measureSymbolBounds(scene(1, 220, 40, true), profile).review.includes('competing-components'),
);
assert.equal(measureSymbolBounds(scene(1, 220, 220), profile).rect, null);
assert.deepEqual(measureSymbolBounds(scene(1, 35, 240), { ...profile, light: true }).rect, a.rect);
assert.deepEqual(fittedSymbolBounds(a.rect, { scale: 1.1, tx: 5, ty: -3, rotation: 0 }), {
  width: 22,
  height: 38.5,
  centerX: 118.1,
  centerY: 114.24999999999997,
});
assert.throws(() => measureSymbolBounds(scene(), { ...profile, region: [480, 100, 80, 80] }));
function detachedBar(scale, frame = false) {
  const im = scene(scale);
  for (let y = 158 * scale; y < 162 * scale; y++)
    for (let x = 118 * scale; x < 132 * scale; x++) {
      const p = (y * im.width + x) * 4;
      im.data[p] = im.data[p + 1] = im.data[p + 2] = 40;
    }
  if (frame)
    for (let y = 164 * scale; y < 166 * scale; y++)
      for (let x = 95 * scale; x < 185 * scale; x++) {
        const p = (y * im.width + x) * 4;
        im.data[p] = im.data[p + 1] = im.data[p + 2] = 40;
      }
  return im;
}
for (const scale of [1, 2]) {
  assert.deepEqual(measureSymbolBounds(detachedBar(scale), profile).rect, a.rect);
  assert.deepEqual(
    measureSymbolBounds(detachedBar(scale), { ...profile, componentGap: 2 }).rect,
    a.rect,
    'A detached part outside the declared gap must not join the main symbol.',
  );
  assert.deepEqual(
    measureSymbolBounds(detachedBar(scale), { ...profile, componentGap: 3 }).rect,
    [115, 120, 20, 42],
    'Joining disconnected parts must preserve the original ink bounds at either resolution.',
  );
  assert.equal(
    measureSymbolBounds(detachedBar(scale, true), { ...profile, componentGap: 3 }).rect,
    null,
    'A grouped symbol that reaches a frame at the window boundary must be rejected.',
  );
}
assert.throws(() => measureSymbolBounds(scene(), { ...profile, componentGap: -1 }));
const outlined = scene();
for (let y = 117; y < 158; y++)
  for (let x = 112; x < 138; x++) {
    if (x >= 115 && x < 135 && y >= 120 && y < 155) continue;
    const p = (y * outlined.width + x) * 4;
    outlined.data[p] = outlined.data[p + 1] = outlined.data[p + 2] = 255;
  }
assert.deepEqual(
  measureRenderedSymbol(outlined, scene(1, 220, 220), { ...profile, thresholds: [8, 16, 24] }).rect,
  [112, 117, 26, 41],
);
assert.deepEqual(
  measureRenderedSymbol(outlined, scene(1, 220, 220), { ...profile, foreground: 'dark' }).rect,
  a.rect,
  'A white outer rim must not enlarge rendered dark-ink bounds.',
);
console.log(
  'Native symbol bounds: independent axes, image resolution, contrast, light rims, disconnected parts, touching frames, ambiguous/missing symbols and shared transforms passed.',
);
