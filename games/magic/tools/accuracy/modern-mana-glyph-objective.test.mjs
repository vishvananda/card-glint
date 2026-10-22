import assert from 'node:assert/strict';
import { test } from 'node:test';
import { extractManaGlyphPair, ManaGlyphObjective } from './modern-mana-glyph-objective.mjs';
test('filled overlap favors complete glyphs and recovers an unchanged native control', () => {
  const side = 41,
    a = new Float32Array(side * side),
    hollow = new Float32Array(side * side);
  for (let y = 12; y <= 28; y++)
    for (let x = 17; x <= 23; x++) {
      a[y * side + x] = 1;
      if (x === 17 || x === 23 || y === 12 || y === 28) hollow[y * side + x] = 1;
    }
  const target = new ManaGlyphObjective(a, a, side, 9);
  assert.equal(target.score(), 1);
  assert(target.score() > target.score({ scale: 0.95, dx: 0.5, dy: 0.5 }));
  assert(target.score() > new ManaGlyphObjective(hollow, a, side, 9).score());
  assert.throws(() => target.score({ scale: 0.8 }), /bounds/);
  assert.throws(
    () => new ManaGlyphObjective(a, new Float32Array(a.length), side, 9),
    /too little ink/,
  );
});
test('fixed interior excludes an outer circle and shadow', () => {
  const side = 41,
    a = new Float32Array(side * side),
    b = new Float32Array(side * side);
  for (let y = 0; y < side; y++)
    for (let x = 0; x < side; x++) {
      if (x >= 18 && x <= 22 && y >= 13 && y <= 27) a[y * side + x] = b[y * side + x] = 1;
      if (Math.hypot(x - 20, y - 20) > 10) b[y * side + x] = 1;
    }
  assert.equal(new ManaGlyphObjective(a, b, side, 8).score(), 1);
});

test('ink extraction removes a changed paper and ink palette without moving the glyph', () => {
  const make = (paper, ink) => {
    const width = 48,
      height = 48,
      data = new Uint8ClampedArray(width * height * 4);
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) {
        const color = x >= 21 && x <= 27 && y >= 17 && y <= 31 ? ink : paper;
        data.set([...color, 255], (y * width + x) * 4);
      }
    return { width, height, data };
  };
  const pair = extractManaGlyphPair(
    make([190, 221, 249], [13, 15, 15]),
    make([180, 210, 240], [29, 25, 23]),
    { x: 24, y: 24, radius: 11, paper: [190, 221, 249] },
  );
  assert(pair.pigment.referencePaper.points >= 3);
  assert.equal(
    new ManaGlyphObjective(pair.source, pair.nativeControl, pair.side, pair.maskRadius).score(),
    1,
  );
  assert.equal(
    new ManaGlyphObjective(pair.source, pair.reference, pair.side, pair.maskRadius).score(),
    1,
  );
});
