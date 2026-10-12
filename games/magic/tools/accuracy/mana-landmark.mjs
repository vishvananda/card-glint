import { blur } from './edges.mjs';
import { median } from './metrics.mjs';

/** Measure every disc against fixed nominal positions; never walk from a previously fitted disc. */
export function manaRowLandmarks(gray, width, height, { count, rightX, y, pitch, range = 9 }) {
  if (
    !Number.isInteger(count) ||
    count < 1 ||
    ![rightX, y, pitch, range].every(Number.isFinite) ||
    pitch <= 0 ||
    range <= 0
  )
    throw Error('Invalid mana row target');
  const circles = Array.from({ length: count }, (_, index) => {
    const x = rightX - index * pitch;
    if (
      x - range - 15 < 0 ||
      x + range + 15 >= width ||
      y - range - 15 < 0 ||
      y + range + 15 >= height
    )
      return { symbolIndex: count - index - 1, status: 'outside-search-window' };
    return {
      symbolIndex: count - index - 1,
      ...manaLandmark(gray, width, height, { x, y, range }),
    };
  });
  const measured = circles.every((c) => c.status === 'measured');
  const separations = circles.slice(1).map((c, i) => circles[i].x - c.x);
  const conflict = measured && separations.some((v) => v < pitch / 2 || v > pitch * 1.5);
  return {
    status: conflict ? 'conflicting-disc-order' : measured ? 'measured' : 'partial',
    circles,
    pitch: measured && !conflict ? median(separations) : null,
    verticalSpread:
      measured && !conflict
        ? Math.max(...circles.map((c) => c.y)) - Math.min(...circles.map((c) => c.y))
        : null,
  };
}

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
