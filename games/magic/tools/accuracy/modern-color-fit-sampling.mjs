import assert from 'node:assert/strict';

/** Do not stride through repeated source strips: a periodic sampling step can
 * select only one part of their texture. Identical strips need one full copy. */
export function poolColorTiles(samples, limit = 1024) {
  assert(samples.length && samples.every((s) => s.tiles.length));
  const first = JSON.stringify(samples[0].tiles);
  if (samples.every((s) => JSON.stringify(s.tiles) === first)) return samples[0].tiles;
  const tiles = samples.flatMap((s) => s.tiles);
  if (tiles.length <= limit) return tiles;
  return Array.from(
    { length: limit },
    (_, i) => tiles[Math.floor(((i + 0.5) * tiles.length) / limit)],
  );
}

/** Allocate half the pooled clipping budget to each component. Use the entire
 * source distribution for limits, not its reduced optimization sample. */
export function colorScaleLimits(tiles, budget, math) {
  assert(tiles.length && Number.isFinite(budget) && budget >= 0 && budget <= 0.1);
  const at = Math.min(tiles.length - 1, Math.floor(tiles.length * (1 - budget / 2)));
  return [1, 2].map((channel) => {
    const values = tiles.map((t) => math.rgbToHsb(t)[channel]).sort((a, b) => a - b);
    return (1 - 1e-10) / Math.max(values[at], 0.005);
  });
}
