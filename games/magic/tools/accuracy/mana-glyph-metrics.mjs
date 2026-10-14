import { distances } from './edges.mjs';
import { quantile } from './metrics.mjs';

export const GLYPH_SIZE = 40;
/** Identity diagnostic only: isolate dark glyph ink inside the measured disc,
 * then normalize the ink bounds. This never changes a renderer placement. */
export function manaGlyphMask(
  image,
  circle,
  removeBoundaryInk = false,
  { normalizeBounds = true, thresholdFraction = 0.48 } = {},
) {
  const n = 64,
    values = [],
    samples = new Float32Array(n * n).fill(NaN);
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const dx = (x + 0.5 - n / 2) / (n / 2),
        dy = (y + 0.5 - n / 2) / (n / 2);
      if (Math.hypot(dx, dy) > 0.92) continue;
      const sx = circle.x + dx * circle.radius,
        sy = circle.y + dy * circle.radius;
      const ix = Math.floor(sx),
        iy = Math.floor(sy),
        fx = sx - ix,
        fy = sy - iy;
      if (ix < 0 || iy < 0 || ix + 1 >= image.width || iy + 1 >= image.height) continue;
      if (image.data[(Math.round(sy) * image.width + Math.round(sx)) * 4 + 3] < 128) continue;
      const rgb = [0, 1, 2].map((c) => {
        const a = image.data[(iy * image.width + ix) * 4 + c],
          b = image.data[(iy * image.width + ix + 1) * 4 + c],
          d = image.data[((iy + 1) * image.width + ix) * 4 + c],
          e = image.data[((iy + 1) * image.width + ix + 1) * 4 + c];
        return (a * (1 - fx) + b * fx) * (1 - fy) + (d * (1 - fx) + e * fx) * fy;
      });
      const value = Math.max(...rgb);
      samples[y * n + x] = value;
      values.push(value);
    }
  const low = quantile(values, 0.12),
    high = quantile(values, 0.88),
    threshold = low + (high - low) * thresholdFraction;
  if (high - low < 35) return { status: 'weak-ink-contrast' };
  const mask = Uint8Array.from(samples, (v) => (Number.isFinite(v) && v < threshold ? 1 : 0));
  // Frame/background ink is connected to the outer crop. Remove it while
  // retaining disconnected interior details such as the old sun's center.
  const seen = new Uint8Array(mask.length);
  for (let start = 0; start < mask.length; start++) {
    if (!mask[start] || seen[start]) continue;
    const queue = [start];
    seen[start] = 1;
    let outer = false;
    for (let head = 0; head < queue.length; head++) {
      const i = queue[head],
        x = i % n,
        y = Math.floor(i / n);
      if (Math.hypot(x + 0.5 - n / 2, y + 0.5 - n / 2) > n * 0.435) outer = true;
      for (const j of [x ? i - 1 : -1, x + 1 < n ? i + 1 : -1, i - n, i + n])
        if (j >= 0 && j < mask.length && mask[j] && !seen[j]) {
          seen[j] = 1;
          queue.push(j);
        }
    }
    if ((removeBoundaryInk && outer) || queue.length < 5) for (const i of queue) mask[i] = 0;
  }
  let l = n,
    t = n,
    r = 0,
    b = 0,
    count = 0;
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++)
      if (mask[y * n + x]) {
        l = Math.min(l, x);
        t = Math.min(t, y);
        r = Math.max(r, x);
        b = Math.max(b, y);
        count++;
      }
  if (count < 80 || count > 2500) return { status: 'ink-occupancy' };
  const size = GLYPH_SIZE,
    scale = (size - 4) / (normalizeBounds ? Math.max(r - l + 1, b - t + 1) : n),
    out = new Uint8Array(size * size);
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const sx = Math.round((x - size / 2) / scale + (normalizeBounds ? (l + r) / 2 : n / 2 - 0.5)),
        sy = Math.round((y - size / 2) / scale + (normalizeBounds ? (t + b) / 2 : n / 2 - 0.5));
      if (sx >= 0 && sy >= 0 && sx < n && sy < n) out[y * size + x] = mask[sy * n + sx];
    }
  return {
    status: 'measured',
    ink: out,
    contrast: high - low,
    occupancy: count / (Math.PI * (n * 0.46) ** 2),
    bounds: [l, t, r, b],
    discRatio: [(r - l + 1) / n, (b - t + 1) / n],
  };
}
function boundary(ink) {
  const n = GLYPH_SIZE;
  return Uint8Array.from(ink, (v, i) =>
    v &&
    (i < n ||
      i >= n * (n - 1) ||
      i % n === 0 ||
      i % n === n - 1 ||
      !ink[i - 1] ||
      !ink[i + 1] ||
      !ink[i - n] ||
      !ink[i + n])
      ? 1
      : 0,
  );
}
export function compareManaGlyph(a, b) {
  let intersection = 0,
    union = 0;
  for (let i = 0; i < a.length; i++) {
    intersection += a[i] && b[i] ? 1 : 0;
    union += a[i] || b[i] ? 1 : 0;
  }
  const ea = boundary(a),
    eb = boundary(b),
    da = distances(ea, GLYPH_SIZE, GLYPH_SIZE),
    db = distances(eb, GLYPH_SIZE, GLYPH_SIZE);
  const forward = [],
    reverse = [];
  for (let i = 0; i < a.length; i++) {
    if (ea[i]) forward.push(db[i]);
    if (eb[i]) reverse.push(da[i]);
  }
  const precision = reverse.filter((d) => d <= 1).length / reverse.length,
    recall = forward.filter((d) => d <= 1).length / forward.length;
  const f1 = (2 * precision * recall) / (precision + recall || 1),
    iou = intersection / union;
  return { score: 0.7 * iou + 0.3 * f1, iou, edgeF1: f1 };
}
