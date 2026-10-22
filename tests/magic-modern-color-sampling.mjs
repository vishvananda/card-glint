import assert from 'node:assert/strict';
import { createServer } from 'vite';
import {
  poolColorTiles,
  colorScaleLimits,
} from '../games/magic/tools/accuracy/modern-color-fit-sampling.mjs';

const strip = Array.from({ length: 72 }, (_, i) => [(i % 3) / 2, 0.25, 0.5]);
const repeated = Array.from({ length: 42 }, () => ({ tiles: strip }));
const pooled = poolColorTiles(repeated);
assert.deepEqual(
  pooled,
  strip,
  'Periodic source strips retain every region, rather than a stride alias',
);
const unequal = Array.from({ length: 41 }, (_, i) => ({
  tiles: strip.map((t) => t.map((v) => v + i / 1000)),
}));
assert.equal(poolColorTiles(unequal).length, 1024);
assert.deepEqual(poolColorTiles([{ tiles: strip.slice(0, 3) }, { tiles: strip.slice(1, 4) }]), [
  ...strip.slice(0, 3),
  ...strip.slice(1, 4),
]);
const server = await createServer({
  configFile: false,
  server: { middlewareMode: true, hmr: false, ws: false },
});
try {
  const math = await server.ssrLoadModule('/games/magic/src/presentation/hsb.ts');
  const tiles = Array.from({ length: 600 }, (_, i) =>
    math.hsbToRgb([i % 360, 0.1 + (0.9 * (i % 101)) / 100, 0.3 + (0.7 * (i % 37)) / 36]),
  );
  for (const budget of [0, 0.01, 0.1]) {
    const [s, b] = colorScaleLimits(tiles, budget, math);
    const clipped =
      tiles.filter((t) => {
        const hsb = math.rgbToHsb(t);
        return hsb[1] * s > 1 || hsb[2] * b > 1;
      }).length / tiles.length;
    assert(clipped <= budget, 'Combined component clipping respects the pooled budget');
  }
  assert.throws(() => colorScaleLimits(tiles, -1, math));
  assert.throws(() => poolColorTiles([]));
} finally {
  await server.close();
}
console.log(
  'Modern color fitting preserves periodic source coverage and bounds combined pooled clipping.',
);
