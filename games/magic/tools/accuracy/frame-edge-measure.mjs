// Canonical frame-edge diagnostics, independent of glyphs, color scale and pose fitting.
import assert from 'node:assert/strict';
const median = (a) => {
  const b = a.toSorted((x, y) => x - y);
  return (b[Math.floor((b.length - 1) / 2)] + b[Math.ceil((b.length - 1) / 2)]) / 2;
};
export function medianFrameGradient(image, [x, y, w, h, axis]) {
  assert(['x', 'y'].includes(axis));
  assert([image.width, image.height, x, y, w, h].every(Number.isInteger));
  assert(image.width > 0 && image.height > 0);
  assert.equal(image.data.length, image.width * image.height * 4);
  assert(x >= 0 && y >= 0 && w > 0 && h > 0 && x + w <= image.width && y + h <= image.height);
  const n = axis === 'x' ? w : h,
    along = axis === 'x' ? h : w;
  let rgb = Array.from({ length: n }, (_, i) =>
    [0, 1, 2].map((k) =>
      median(
        Array.from(
          { length: along },
          (_, j) =>
            image.data[
              ((y + (axis === 'x' ? j : i)) * image.width + x + (axis === 'x' ? i : j)) * 4 + k
            ],
        ),
      ),
    ),
  );
  for (let pass = 0; pass < 2; pass++)
    rgb = rgb.map((v, i) =>
      v.map((_, k) => (rgb[Math.max(0, i - 1)][k] + 2 * v[k] + rgb[Math.min(n - 1, i + 1)][k]) / 4),
    );
  return rgb.slice(1).map((v, i) => Math.hypot(...v.map((c, k) => c - rgb[i][k])));
}
const sample = (a, x) => {
  const i = Math.floor(x),
    f = x - i;
  return (a[i] ?? 0) * (1 - f) + (a[i + 1] ?? 0) * f;
};
export function gradientOverlap(a, b, shift = 0) {
  assert.equal(a.length, b.length);
  assert(a.length >= 9 && Number.isFinite(shift) && Math.abs(shift) <= 4);
  assert(a.every((v) => Number.isFinite(v) && v >= 0));
  assert(b.every((v) => Number.isFinite(v) && v >= 0));
  let dot = 0,
    aa = 0,
    bb = 0;
  for (let i = 4; i < a.length - 4; i++) {
    const x = sample(a, i - shift),
      y = b[i];
    dot += x * y;
    aa += x * x;
    bb += y * y;
  }
  return aa <= 1 || bb <= 1 ? 0 : (100 * dot) / Math.sqrt(aa * bb);
}
export function bestGradientShift(a, b) {
  let best = { shift: 0, score: gradientOverlap(a, b) };
  for (let j = -32; j <= 32; j++) {
    const shift = j * 0.125,
      score = gradientOverlap(a, b, shift);
    if (score > best.score + 1e-10) best = { shift, score };
  }
  return best;
}
