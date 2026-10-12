import { blur } from './edges.mjs';

/** Locate the printed cost disc independently of glyph, hue, and nearby frame edges.
 * Fixed rightmost-symbol search area; only reports measurements, never fits a scan.
 */
export function manaLandmark(gray, width, height, { x = 438, y = 45, range = 9 } = {}) {
  const smooth = blur(gray, width, height),
    candidates = [];
  function sample(x, y) {
    const ix = Math.floor(x),
      iy = Math.floor(y),
      fx = x - ix,
      fy = y - iy;
    if (ix < 0 || iy < 0 || ix + 1 >= width || iy + 1 >= height) return 0;
    const i = iy * width + ix;
    return (
      (smooth[i] * (1 - fx) + smooth[i + 1] * fx) * (1 - fy) +
      (smooth[i + width] * (1 - fx) + smooth[i + width + 1] * fx) * fy
    );
  }
  for (let cy = y - range; cy <= y + range; cy += 0.5)
    for (let cx = x - range; cx <= x + range; cx += 0.5)
      for (let r = 10; r <= 13; r += 0.5) {
        const quadrants = [[], [], [], []];
        for (let i = 0; i < 64; i++) {
          const angle = ((i + 0.5) * Math.PI) / 32,
            c = Math.cos(angle),
            s = Math.sin(angle);
          quadrants[Math.floor(i / 16)].push(
            sample(cx + c * (r - 1.5), cy + s * (r - 1.5)) -
              sample(cx + c * (r + 1.5), cy + s * (r + 1.5)),
          );
        }
        // Consistent signed contrast in all quadrants discounts straight frame lines.
        const sums = quadrants.map((q) => q.reduce((a, b) => a + b, 0) / q.length);
        const mean = sums.reduce((a, b) => a + b, 0) / 4,
          sign = Math.sign(mean);
        const score = Math.abs(mean) * 0.5 + Math.min(...sums.map((v) => v * sign)) * 0.5;
        candidates.push({ x: cx, y: cy, radius: r, score });
      }
  candidates.sort((a, b) => b.score - a.score);
  const best = candidates[0],
    second = candidates.find((c) => Math.hypot(c.x - best.x, c.y - best.y) > 2);
  const boundary =
    Math.abs(best.x - x) === range ||
    Math.abs(best.y - y) === range ||
    best.radius === 10 ||
    best.radius === 13;
  return {
    ...best,
    margin: best.score - second.score,
    status: boundary
      ? 'search-boundary'
      : best.score < 8 || best.score - second.score < 2
        ? 'uncertain'
        : 'measured',
  };
}
