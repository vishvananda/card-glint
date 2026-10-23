// Offline footer diagnostics use HSV value and filled ink, not scan color/saturation.
import assert from 'node:assert/strict';
import { compareRegion, quantile } from './metrics.mjs';
export const FOOTER_REGION_POLICY = {
  version: 'm21-footer-regions-v1',
  margin: 4,
  contrastFloor: 12,
  floorQuantile: 0.15,
  inkQuantile: 0.995,
  inkLow: 0.2,
  inkHigh: 0.8,
  displacementLimit: 2,
  coarseStep: 0.5,
  fineStep: 0.25,
};
export function footerRegions(face) {
  const stats = (face.power != null && face.toughness != null) || face.loyalty != null;
  return {
    collector: [
      [28, 635, 150, 14],
      [28, 649, 60, 18],
    ],
    artist: [[88, 648, stats ? 185 : 369, 19]],
    legal: [[275, stats ? 648 : 635, 184, stats ? 19 : 14]],
  };
}
function at(image, x, y) {
  const sx = ((x + 0.5) * image.width) / 488 - 0.5,
    sy = ((y + 0.5) * image.height) / 680 - 0.5;
  const left = Math.max(0, Math.min(image.width - 1, Math.floor(sx)));
  const top = Math.max(0, Math.min(image.height - 1, Math.floor(sy)));
  const right = Math.min(image.width - 1, left + 1),
    bottom = Math.min(image.height - 1, top + 1);
  const fx = Math.max(0, sx - left),
    fy = Math.max(0, sy - top);
  const pixel = (x, y) => {
    const i = (y * image.width + x) * 4;
    return Math.max(image.data[i], image.data[i + 1], image.data[i + 2]);
  };
  return (
    (pixel(left, top) * (1 - fx) + pixel(right, top) * fx) * (1 - fy) +
    (pixel(left, bottom) * (1 - fx) + pixel(right, bottom) * fx) * fy
  );
}
const clamp = (v) => Math.max(0, Math.min(1, v));
export function footerPatch(image, rect) {
  assert(
    image.width > 0 && image.height > 0 && image.data.length === image.width * image.height * 4,
  );
  const [x, y, width, height] = rect,
    margin = FOOTER_REGION_POLICY.margin;
  const w = width + 2 * margin,
    h = height + 2 * margin,
    values = new Float32Array(w * h),
    inside = [];
  for (let row = 0; row < h; row++)
    for (let col = 0; col < w; col++) {
      const value = at(image, x + col - margin, y + row - margin);
      values[row * w + col] = value;
      if (row >= margin && row < margin + height && col >= margin && col < margin + width)
        inside.push(value);
    }
  const lo = quantile(inside, FOOTER_REGION_POLICY.floorQuantile);
  const hi = quantile(inside, FOOTER_REGION_POLICY.inkQuantile);
  const signal = hi - lo;
  const ink = Float32Array.from(values, (v) =>
    signal < FOOTER_REGION_POLICY.contrastFloor
      ? 0
      : clamp(
          ((v - lo) / signal - FOOTER_REGION_POLICY.inkLow) /
            (FOOTER_REGION_POLICY.inkHigh - FOOTER_REGION_POLICY.inkLow),
        ),
  );
  return { rect, width, height, w, h, margin, signal, ink };
}
export function shiftedInk(patch, dx = 0, dy = 0) {
  const { width, height, w, margin, ink } = patch,
    out = new Float32Array(width * height);
  assert(Math.abs(dx) <= 2.5 && Math.abs(dy) <= 2.5);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const sx = x + margin - dx,
        sy = y + margin - dy,
        left = Math.floor(sx),
        top = Math.floor(sy),
        fx = sx - left,
        fy = sy - top,
        i = top * w + left;
      out[y * width + x] =
        (ink[i] * (1 - fx) + ink[i + 1] * fx) * (1 - fy) +
        (ink[i + w] * (1 - fx) + ink[i + w + 1] * fx) * fy;
    }
  return out;
}
export function softDice(a, b) {
  assert.equal(a.length, b.length);
  let dot = 0,
    norm = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    norm += a[i] * a[i] + b[i] * b[i];
  }
  return norm > 0 ? (2 * dot) / norm : null;
}
function boundaryContacts(bounds, width, height) {
  if (!bounds) return [];
  const [x, y, w, h] = bounds;
  return [
    ...(x === 0 ? ['left'] : []),
    ...(y === 0 ? ['top'] : []),
    ...(x + w >= width ? ['right'] : []),
    ...(y + h >= height ? ['bottom'] : []),
  ];
}
export function patchMeasurement(reference, rendered, dx = 0, dy = 0) {
  assert.deepEqual(reference.rect, rendered.rect);
  const target = shiftedInk(reference),
    candidate = shiftedInk(rendered, dx, dy);
  if (reference.signal < FOOTER_REGION_POLICY.contrastFloor)
    return { status: 'low-reference-signal', fillDice: null };
  const metric = compareRegion(
    Float32Array.from(target, (v) => 255 * v),
    Float32Array.from(candidate, (v) => 255 * v),
    reference.width,
    reference.height,
    true,
  );
  return {
    status: metric.status,
    fillDice: softDice(target, candidate),
    edgeF1: metric.edgeF1 ?? null,
    meanDistance: metric.meanDistance ?? null,
    censusSimilarity: metric.censusSimilarity ?? null,
    referenceSignal: reference.signal,
    renderedSignal: rendered.signal,
    boundaryReview: {
      reference: boundaryContacts(
        metric.geometry?.reference.bounds,
        reference.width,
        reference.height,
      ),
      rendered: boundaryContacts(metric.geometry?.rendered.bounds, rendered.width, rendered.height),
    },
    referenceBounds: metric.geometry?.reference.bounds ?? null,
    renderedBounds: metric.geometry?.rendered.bounds ?? null,
  };
}
const targets = new WeakMap();
function fixedTarget(patch) {
  if (!targets.has(patch)) {
    const ink = shiftedInk(patch);
    targets.set(patch, { ink, norm: ink.reduce((s, v) => s + v * v, 0) });
  }
  return targets.get(patch);
}
export function displacementDice(pairs, dx, dy) {
  assert(Math.abs(dx) <= 2.5 && Math.abs(dy) <= 2.5);
  let total = 0,
    count = 0;
  for (const [a, b] of pairs) {
    if (a.signal < FOOTER_REGION_POLICY.contrastFloor) continue;
    const target = fixedTarget(a),
      { width, height, w, margin, ink } = b;
    const xb = margin - Math.ceil(dx),
      yb = margin - Math.ceil(dy);
    const fx = Math.ceil(dx) - dx,
      fy = Math.ceil(dy) - dy;
    const aa = (1 - fx) * (1 - fy),
      ab = fx * (1 - fy),
      ac = (1 - fx) * fy,
      ad = fx * fy;
    let dot = 0,
      norm = 0;
    for (let y = 0; y < height; y++) {
      let from = (y + yb) * w + xb,
        to = y * width;
      for (let x = 0; x < width; x++, from++, to++) {
        const value =
          ink[from] * aa + ink[from + 1] * ab + ink[from + w] * ac + ink[from + w + 1] * ad;
        dot += value * target.ink[to];
        norm += value * value;
      }
    }
    if (norm + target.norm > 0) {
      total += (2 * dot) / (norm + target.norm);
      count++;
    }
  }
  return count ? total / count : null;
}
