import assert from 'node:assert/strict';
import { center, median, quantile, delta } from './hsb-color.mjs';
/** Fixed source-alpha labels; scans never choose the classification. */
export function createDualPaperSampler(mask, { window, tileSize, erosion }) {
  assert.equal(mask.width, 488);
  assert.equal(mask.height, 680);
  const labels = new Int8Array(488 * 680).fill(-1);
  for (let y = window[1]; y < window[1] + window[3]; y++)
    for (let x = window[0]; x < window[0] + window[2]; x++) {
      const a = mask.data[(y * 488 + x) * 4 + 3];
      const label = a <= 2 ? 0 : a >= 253 ? 1 : -1;
      if (label < 0) continue;
      let stable = true;
      for (let dy = -erosion; dy <= erosion && stable; dy++)
        for (let dx = -erosion; dx <= erosion; dx++) {
          const n = mask.data[((y + dy) * 488 + x + dx) * 4 + 3];
          if (label === 0 ? n > 2 : n < 253) {
            stable = false;
            break;
          }
        }
      if (stable) labels[y * 488 + x] = label;
    }
  const sample = (image, label) => {
    const tiles = [],
      support = [];
    let pixels = 0,
      rejected = 0;
    for (let y = window[1]; y < window[1] + window[3]; y += tileSize)
      for (let x = window[0]; x < window[0] + window[2]; x += tileSize) {
        const colors = [];
        for (let yy = y; yy < Math.min(y + tileSize, window[1] + window[3]); yy++)
          for (let xx = x; xx < Math.min(x + tileSize, window[0] + window[2]); xx++) {
            if (labels[yy * 488 + xx] !== label) continue;
            const i = (yy * 488 + xx) * 4;
            assert.equal(image.data[i + 3], 255);
            colors.push([0, 1, 2].map((k) => image.data[i + k] / 255));
          }
        if (colors.length < 8) continue;
        const cutoff = median(colors.map((p) => Math.max(...p))) * 0.65;
        const kept = colors.filter((p) => Math.max(...p) >= cutoff);
        pixels += colors.length;
        rejected += colors.length - kept.length;
        if (kept.length / colors.length < 0.65) continue;
        tiles.push(center(kept));
        support.push([x, y, colors.length, kept.length]);
      }
    assert(tiles.length >= 10, 'Insufficient eroded paper sample');
    const rgb = center(tiles);
    return {
      rgb,
      tiles,
      spread: quantile(
        tiles.map((t) => delta(t, rgb)),
        0.9,
      ),
      pixels,
      rejectedFraction: rejected / pixels,
      support,
    };
  };
  return sample;
}
