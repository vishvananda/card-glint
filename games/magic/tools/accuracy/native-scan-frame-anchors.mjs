// Native-resolution outer-edge samples for offline scan normalization.
// Quarter-pixel profiles avoid a second 8-bit resize before subpixel fitting.
import { WIDTH, HEIGHT } from './pixels-pure.mjs';
export const NATIVE_SCAN_ANCHOR_POLICY = Object.freeze({
  step: 0.25,
  sigma: 0.8,
  gradientSpan: 2,
  halfStrip: 5,
  padding: 5,
  minimumBottom: 652,
});
export function nativeScanFrameAnchors(image, border, windows) {
  if (!['white', 'black'].includes(border)) throw Error('Unsupported stock color');
  if (
    !Number.isInteger(image.width) ||
    !Number.isInteger(image.height) ||
    image.width < WIDTH ||
    image.height < HEIGHT ||
    image.data.length !== image.width * image.height * 4
  )
    throw Error('Invalid native scan raster');
  const { step, sigma, gradientSpan, halfStrip, padding } = NATIVE_SCAN_ANCHOR_POLICY;
  const w = image.width,
    h = image.height,
    f = Math.min(WIDTH / w, HEIGHT / h),
    padX = (WIDTH - w * f) / 2,
    padY = (HEIGHT - h * f) / 2;
  const gray = new Float32Array(w * h);
  for (let i = 0; i < gray.length; i++) {
    const j = i * 4,
      alpha = image.data[j + 3] / 255;
    gray[i] =
      alpha * (0.2126 * image.data[j] + 0.7152 * image.data[j + 1] + 0.0722 * image.data[j + 2]) +
      (1 - alpha) * 128;
  }
  const value = (x, y) => {
    const px = (x + 0.5 - padX) / f - 0.5,
      py = (y + 0.5 - padY) / f - 0.5;
    const l = Math.floor(px),
      t = Math.floor(py),
      fx = px - l,
      fy = py - t;
    const get = (x, y) =>
      gray[Math.max(0, Math.min(h - 1, y)) * w + Math.max(0, Math.min(w - 1, x))];
    return (
      (get(l, t) * (1 - fx) + get(l + 1, t) * fx) * (1 - fy) +
      (get(l, t + 1) * (1 - fx) + get(l + 1, t + 1) * fx) * fy
    );
  };
  const radius = Math.ceil((3 * sigma) / step),
    weights = Array.from({ length: radius * 2 + 1 }, (_, i) =>
      Math.exp(-0.5 * (((i - radius) * step) / sigma) ** 2),
    );
  const mass = weights.reduce((s, x) => s + x, 0),
    offset = gradientSpan / step,
    points = [],
    rejected = [];
  for (const [side, spec] of Object.entries(windows)) {
    const { axis, lo, hi, start, step: alongStep, count } = spec,
      sign = (side === 'left' || side === 'top' ? 1 : -1) * (border === 'white' ? -1 : 1);
    for (let index = 0; index < count; index++) {
      const along = start + index * alongStep,
        origin = lo - padding,
        n = Math.round((hi - lo + padding * 2) / step) + 1;
      const values = Array.from({ length: n }, (_, i) => {
        const p =
          side === 'bottom'
            ? Math.max(NATIVE_SCAN_ANCHOR_POLICY.minimumBottom, origin + i * step)
            : origin + i * step;
        let sum = 0;
        for (let a = along - halfStrip; a <= along + halfStrip; a++)
          sum += axis === 'x' ? value(p, a) : value(a, p);
        return sum / (halfStrip * 2 + 1);
      });
      const smooth = values.map(
        (_, i) =>
          weights.reduce(
            (s, v, j) => s + v * values[Math.max(0, Math.min(n - 1, i + j - radius))],
            0,
          ) / mass,
      );
      const gradient = values.map((_, i) =>
        i >= offset && i < n - offset ? sign * (smooth[i + offset] - smooth[i - offset]) : 0,
      );
      const begin = Math.round((lo - origin) / step),
        end = Math.round((hi - origin) / step),
        threshold = Math.max(12, Math.max(...gradient.slice(begin, end + 1)) * 0.5);
      const peaks = [];
      for (let i = begin + 1; i < end; i++)
        if (
          gradient[i] >= threshold &&
          gradient[i] > gradient[i - 1] &&
          gradient[i] >= gradient[i + 1]
        )
          peaks.push(i);
      if (side === 'right' || side === 'bottom') peaks.reverse();
      const i = peaks[0],
        sample = { side, index, cohort: index % 2 ? 'validation' : 'fit', along };
      if (i === undefined) {
        rejected.push({ ...sample, reason: 'weak-edge' });
        continue;
      }
      const shift =
        (gradient[i - 1] - gradient[i + 1]) /
        (2 * (gradient[i - 1] - 2 * gradient[i] + gradient[i + 1]));
      const p = origin + (i + shift) * step;
      if (p < lo + 1 || p > hi - 1) {
        rejected.push({ ...sample, reason: 'search-boundary' });
        continue;
      }
      points.push({
        ...sample,
        x: axis === 'x' ? p : along,
        y: axis === 'x' ? along : p,
        strength: gradient[i],
      });
    }
  }
  return { version: 'native-outer-frame-strips-v1', points, rejected };
}
