import { inverseScanMatrix } from './scan-transform.mjs';
import { bounded, profileMatrix } from './scan-gradient-fit.mjs';
const W = 488,
  H = 680,
  PATCH = 13,
  SIGMA = 0.45;
const finite = (v, lo, hi) => typeof v === 'number' && Number.isFinite(v) && v >= lo && v <= hi;
const need = (v, message) => {
  if (!v) throw Error(message);
};
const quantile = (a, q) => {
  const b = [...a].sort((x, y) => x - y),
    p = (b.length - 1) * q,
    l = Math.floor(p);
  return b[l] + (b[Math.ceil(p)] - b[l]) * (p - l);
};
function validateTemplate(t) {
  need(
    t?.version === 1 && t.scale === 1.5 && Array.isArray(t.corners) && t.corners.length === 2,
    'Invalid printed-corner template',
  );
  for (const c of t.corners) {
    need(
      typeof c.id === 'string' &&
        Array.isArray(c.window) &&
        c.window.length === 4 &&
        c.window.every(Number.isInteger),
      'Invalid corner window',
    );
    const [l, top, r, b] = c.window;
    need(
      l >= 0 && top >= 0 && r <= W && b <= H && r > l && b > top && r - l <= 32 && b - top <= 32,
      'Corner window exceeds frame bounds',
    );
    need(
      Array.isArray(c.point) &&
        c.point.length === 2 &&
        finite(c.point[0], l, r) &&
        finite(c.point[1], top, b),
      'Invalid corner position',
    );
    need(
      Array.isArray(c.patch) &&
        c.patch.length === PATCH * PATCH &&
        c.patch.every((v) => finite(v, 0, 1)) &&
        c.patch.some((v) => v > 0.5),
      'Invalid corner shape',
    );
    need(
      finite(c.maxResidual, 0.25, 1.5) &&
        finite(c.minScore, 0.85, 1) &&
        finite(c.minContrast, 80, 255),
      'Unbounded corner certificate',
    );
  }
  need(new Set(t.corners.map((c) => c.id)).size === 2, 'Duplicate printed corners');
}
function blur(a, w, h) {
  const radius = 2,
    kernel = Array.from({ length: 5 }, (_, i) =>
      Math.exp(-((i - radius) ** 2) / (2 * SIGMA * SIGMA)),
    ),
    sum = kernel.reduce((s, v) => s + v, 0);
  for (let i = 0; i < 5; i++) kernel[i] /= sum;
  const reflect = (i, n) => (i < 0 ? -i - 1 : i >= n ? 2 * n - i - 1 : i),
    tmp = new Float64Array(a.length),
    out = new Float64Array(a.length);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      for (let k = -radius; k <= radius; k++)
        tmp[y * w + x] += kernel[k + radius] * a[y * w + reflect(x + k, w)];
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      for (let k = -radius; k <= radius; k++)
        out[y * w + x] += kernel[k + radius] * tmp[reflect(y + k, h) * w + x];
  return out;
}
/** Samples only small comparison-space windows from the raw scan. Reference
 * pixels and the frozen transform are inputs; renderer pixels are never used. */
function rawSampler(image, transform, scale) {
  need(
    Number.isInteger(image.width) &&
      Number.isInteger(image.height) &&
      image.width > 0 &&
      image.height > 0 &&
      (image.data instanceof Uint8Array || image.data instanceof Uint8ClampedArray) &&
      image.data.length === image.width * image.height * 4,
    'Invalid scan raster',
  );
  const m = inverseScanMatrix(transform),
    f = Math.min(W / image.width, H / image.height),
    px = (W - image.width * f) / 2,
    py = (H - image.height * f) / 2,
    cache = new Map();
  const integer = (x, y) => {
    const key = y * (W * scale) + x;
    if (cache.has(key)) return cache.get(key);
    const cx = (x + 0.5) / scale - 0.5 - W / 2,
      cy = (y + 0.5) / scale - 0.5 - H / 2;
    const sx = (m[0] * cx + m[2] * cy + m[4] + W / 2 - px + 0.5) / f - 0.5,
      sy = (m[1] * cx + m[3] * cy + m[5] + H / 2 - py + 0.5) / f - 0.5;
    if (sx < 0 || sy < 0 || sx > image.width - 1 || sy > image.height - 1) return 128;
    const l = Math.floor(sx),
      top = Math.floor(sy),
      r = Math.min(l + 1, image.width - 1),
      b = Math.min(top + 1, image.height - 1),
      fx = sx - l,
      fy = sy - top,
      rgba = [];
    for (let k = 0; k < 4; k++)
      rgba.push(
        Math.round(
          (image.data[(top * image.width + l) * 4 + k] * (1 - fx) +
            image.data[(top * image.width + r) * 4 + k] * fx) *
            (1 - fy) +
            (image.data[(b * image.width + l) * 4 + k] * (1 - fx) +
              image.data[(b * image.width + r) * 4 + k] * fx) *
              fy,
        ),
      );
    const alpha = rgba[3] / 255,
      g = alpha * (0.2126 * rgba[0] + 0.7152 * rgba[1] + 0.0722 * rgba[2]) + (1 - alpha) * 128;
    cache.set(key, g);
    return g;
  };
  return (x, y) => {
    const l = Math.floor(x),
      top = Math.floor(y),
      fx = x - l,
      fy = y - top;
    return (
      (integer(l, top) * (1 - fx) + integer(l + 1, top) * fx) * (1 - fy) +
      (integer(l, top + 1) * (1 - fx) + integer(l + 1, top + 1) * fx) * fy
    );
  };
}
function feature(gray, c, scale) {
  // Match the frozen template's nearest-even quantization of half-pixel windows.
  const roundEven = (v) => {
    const n = Math.floor(v);
    return v - n === 0.5 ? n + (n % 2) : Math.round(v);
  };
  const [l, top, r, b] = c.window.map((v) => roundEven(v * scale)),
    w = r - l,
    h = b - top,
    a = Float64Array.from({ length: w * h }, (_, i) => gray(l + (i % w), top + Math.floor(i / w))),
    g = blur(a, w, h),
    floor = quantile(g, 0.2),
    peak = Math.max(...g),
    threshold = Math.max(110, floor + 0.45 * (peak - floor));
  const visited = new Uint8Array(g.length);
  let best;
  for (let i = 0; i < g.length; i++) {
    if (visited[i] || g[i] <= threshold) continue;
    const queue = [i];
    visited[i] = 1;
    let mass = 0,
      x = 0,
      y = 0;
    for (let q = 0; q < queue.length; q++) {
      const index = queue[q],
        xx = index % w,
        yy = Math.floor(index / w),
        weight = (g[index] - floor) ** 2;
      mass += weight;
      x += xx * weight;
      y += yy * weight;
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const nx = xx + dx,
            ny = yy + dy,
            j = ny * w + nx;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h || visited[j] || g[j] <= threshold) continue;
          visited[j] = 1;
          queue.push(j);
        }
    }
    if (queue.length >= 3 && queue.length <= 80 && (!best || queue.length > best.area))
      best = { area: queue.length, x: x / mass, y: y / mass };
  }
  if (!best || peak - floor < 80) return { id: c.id, detected: false };
  const patch = Float64Array.from({ length: PATCH * PATCH }, (_, i) =>
      gray(l + best.x + (i % PATCH) - 6, top + best.y + Math.floor(i / PATCH) - 6),
    ),
    smooth = blur(patch, PATCH, PATCH);
  let ab = 0,
    aa = 0,
    bb = 0;
  for (let i = 0; i < smooth.length; i++) {
    const v = Math.max(0, Math.min(1, (smooth[i] - floor) / (peak - floor)));
    ab += v * c.patch[i];
    aa += v * v;
    bb += c.patch[i] * c.patch[i];
  }
  return {
    id: c.id,
    detected: true,
    x: (l + best.x) / scale,
    y: (top + best.y) / scale,
    area: best.area,
    contrast: peak - floor,
    shape: aa && bb ? ab / Math.sqrt(aa * bb) : 0,
  };
}
/** Small numeric evidence only; no scan pixels leave the measuring client. */
export function measurePrintedCorners(image, transform, template) {
  validateTemplate(template);
  const gray = rawSampler(image, transform, template.scale);
  return { version: 1, corners: template.corners.map((c) => feature(gray, c, template.scale)) };
}
/** The server can repeat geometry/bounds decisions from compact evidence. As
 * with existing client strip correlations, image-derived measurements remain
 * reported measurements rather than a server-side pixel re-evaluation. */
export function validatePrintedCorners(value, template) {
  validateTemplate(template);
  need(
    value?.version === 1 && Array.isArray(value.corners) && value.corners.length === 2,
    'Missing corner evidence',
  );
  const corners = template.corners.map((c, i) => {
    const v = value.corners[i];
    need(v?.id === c.id && typeof v.detected === 'boolean', 'Corner evidence order differs');
    if (!v.detected) return { id: c.id, detected: false, accepted: false };
    need(
      finite(v.x, c.window[0], c.window[2]) &&
        finite(v.y, c.window[1], c.window[3]) &&
        Number.isInteger(v.area) &&
        v.area >= 3 &&
        v.area <= 80 &&
        finite(v.contrast, 0, 255) &&
        finite(v.shape, 0, 1.000000000001),
      'Invalid measured corner',
    );
    const dx = v.x - c.point[0],
      dy = v.y - c.point[1],
      residual = Math.max(Math.abs(dx), Math.abs(dy));
    return {
      ...v,
      dx,
      dy,
      residual,
      accepted: residual <= c.maxResidual && v.shape >= c.minScore && v.contrast >= c.minContrast,
    };
  });
  return { accepted: corners.every((c) => c.accepted), corners };
}
/** Optional recovery only. Do not alter any previously accepted registration
 * or its transform. Three disjoint profile stages must support all other sides,
 * and the same uniform pose must independently place both bottom corner marks. */
export function certifyUniformBottomRecovery(registration, evidence, template) {
  const corners = validatePrintedCorners(evidence, template),
    p = registration.parameters;
  const model = registration.selectedModel ?? registration.model;
  const stages = [
    registration.fit,
    registration.independent ?? registration.validation,
    registration.certification,
  ];
  const profiles = stages.every(
    (s) => s?.count === 12 && ['left', 'right', 'top'].every((k) => finite(s.sides?.[k], 0.85, 1)),
  );
  const uniform =
    model === 'uniform' && p && bounded(p) && p.sx === p.sy && p.rotation === 0 && p.shear === 0;
  const matrix = uniform ? profileMatrix(p) : null;
  const samePose =
    matrix &&
    registration.transform?.matrix?.length === 6 &&
    matrix.every((v, i) => Math.abs(v - registration.transform.matrix[i]) < 1e-9);
  const accepted =
    registration.accepted === false && profiles && uniform && samePose && corners.accepted;
  return {
    accepted,
    method: 'three-sides-and-printed-corners-v1',
    profiles,
    uniform: Boolean(uniform),
    samePose: Boolean(samePose),
    ...{ corners: corners.corners },
  };
}
