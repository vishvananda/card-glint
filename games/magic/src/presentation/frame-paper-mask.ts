import type { FaceRect } from './face-layout.js';
import type { Rgb } from './hsb.js';

/** All coordinates belong to the pinned source image, never a card scan. */
export type PaperMask =
  | { kind: 'rect'; rect: FaceRect; feather: number }
  | { kind: 'linear'; rect: FaceRect; feather: number }
  | {
      kind: 'polygon';
      points: readonly (readonly [number, number])[];
      /** Feather width in fractions of the source image width. */
      feather: number;
    }
  | {
      kind: 'chroma';
      bounds: FaceRect;
      seed: readonly [number, number];
      frameRgb: Rgb;
      paperRgb: Rgb;
    };
export interface FramePixels {
  width: number;
  height: number;
  data: Uint8ClampedArray;
}
const smooth = (value: number) => {
  const v = Math.max(0, Math.min(1, value));
  return v * v * (3 - 2 * v);
};
const chroma = (rgb: Rgb) => {
  const sum = Math.max(0.001, rgb[0] + rgb[1] + rgb[2]);
  return rgb.map((v) => v / sum);
};

/** Built only on a derived-material cache miss, discarded after recoloring.
 * Chroma keeps irregular parchment edges and the shadows crossing those edges. */
export function framePaperMask(image: FramePixels, spec: PaperMask): Float32Array {
  const { width, height, data } = image;
  const values = new Float32Array(width * height);
  if (spec.kind === 'polygon') {
    if (
      spec.points.length < 3 ||
      !Number.isFinite(spec.feather) ||
      spec.feather <= 0 ||
      spec.points.some((p) => p.some((v) => !Number.isFinite(v) || v < 0 || v > 1))
    )
      throw Error(
        'Paper outline requires at least three normalized points and positive feathering.',
      );
    const points = spec.points.map(([x, y]) => [x * width, y * height] as const),
      feather = spec.feather * width,
      left = Math.max(0, Math.floor(Math.min(...points.map((p) => p[0])) - feather)),
      right = Math.min(width, Math.ceil(Math.max(...points.map((p) => p[0])) + feather)),
      top = Math.max(0, Math.floor(Math.min(...points.map((p) => p[1])) - feather)),
      bottom = Math.min(height, Math.ceil(Math.max(...points.map((p) => p[1])) + feather));
    for (let y = top; y < bottom; y++)
      for (let x = left; x < right; x++) {
        let inside = false,
          distance = Infinity;
        const px = x + 0.5,
          py = y + 0.5;
        for (let i = 0; i < points.length; i++) {
          const [ax, ay] = points[i]!,
            [bx, by] = points[(i + 1) % points.length]!,
            dx = bx - ax,
            dy = by - ay,
            lengthSquared = dx * dx + dy * dy,
            t = lengthSquared
              ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSquared))
              : 0;
          distance = Math.min(distance, Math.hypot(px - ax - t * dx, py - ay - t * dy));
          if (ay > py !== by > py && px < ax + ((py - ay) * dx) / dy) inside = !inside;
        }
        values[y * width + x] = smooth((inside ? distance : -distance) / feather + 0.5);
      }
    return values;
  }
  if (spec.kind === 'rect' || spec.kind === 'linear') {
    if (
      spec.kind === 'linear' &&
      (![...spec.rect, spec.feather].every(Number.isFinite) ||
        spec.rect[0] < 0 ||
        spec.rect[1] < 0 ||
        spec.rect[2] <= 0 ||
        spec.rect[3] <= 0 ||
        spec.rect[0] + spec.rect[2] > 1 ||
        spec.rect[1] + spec.rect[3] > 1 ||
        spec.feather <= 0)
    )
      throw Error('Invalid linear paper mask');
    const [left, top, w, h] = spec.rect;
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) {
        const distance = Math.min(
          x / width - left,
          left + w - x / width,
          y / height - top,
          top + h - y / height,
        );
        values[y * width + x] =
          smooth(distance / spec.feather + 0.5) *
          (spec.kind === 'linear' ? Math.max(0, Math.min(1, (x / width - left) / w)) : 1);
      }
    return values;
  }
  const a = chroma(spec.frameRgb),
    b = chroma(spec.paperRgb),
    axis = b.map((v, i) => v - a[i]!),
    norm = axis.reduce((sum, v) => sum + v * v, 0);
  if (norm < 0.001) throw Error('Paper and frame chroma are too similar for this mask.');
  const [left, top, w, h] = spec.bounds;
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      if (x / width < left || x / width > left + w || y / height < top || y / height > top + h)
        continue;
      const p = y * width + x,
        i = p * 4;
      if (data[i + 3]! < 250) continue;
      const c = chroma([data[i]! / 255, data[i + 1]! / 255, data[i + 2]! / 255]);
      const t = c.reduce((sum, v, k) => sum + (v - a[k]!) * axis[k]!, 0) / norm;
      values[p] = smooth((t - 0.22) / 0.56);
    }
  // Ignore disconnected warm flecks in the frame. Dark paper shadows keep
  // their chroma, so they stay joined to the interior instead of being erased.
  const seen = new Uint8Array(values.length),
    queue = new Int32Array(values.length),
    seed = Math.round(spec.seed[1] * height) * width + Math.round(spec.seed[0] * width);
  if (!(values[seed]! > 0.08)) throw Error('Paper mask seed is outside the paper.');
  let head = 0,
    tail = 1;
  queue[0] = seed;
  seen[seed] = 1;
  while (head < tail) {
    const i = queue[head++]!,
      x = i % width;
    for (const n of [i - width, i + width, x ? i - 1 : -1, x < width - 1 ? i + 1 : -1])
      if (n >= 0 && n < seen.length && !seen[n] && values[n]! > 0.08) {
        seen[n] = 1;
        queue[tail++] = n;
      }
  }
  for (let i = 0; i < values.length; i++) if (!seen[i]) values[i] = 0;
  return values;
}
