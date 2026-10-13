import { cropGray, luminance } from './pixels-pure.mjs';
import { compareRegion, median, quantile } from './metrics.mjs';
import { scanFrameAnchors } from './scan-frame-anchors.mjs';
import { fitScanFrame } from './scan-frame-fit.mjs';
import { FRAME_PLATE_WINDOWS } from './frame-plate-registration.mjs';
import { fitAffineScan } from './scan-affine-fit.mjs';

export function registerMajorFrame(reference, baseline, family, border) {
  const windows = ['component', 'm15-accurate'].includes(family) ? FRAME_PLATE_WINDOWS : undefined;
  const anchors = scanFrameAnchors(baseline, border, windows);
  const sides = Object.fromEntries(
    ['left', 'right', 'top', 'bottom'].map((side) => {
      const a = anchors.points
        .filter((p) => p.side === side)
        .map((p) => (['left', 'right'].includes(side) ? p.x : p.y));
      const position = median(a),
        spread = quantile(
          a.map((v) => Math.abs(v - position)),
          0.9,
        );
      return [
        side,
        { position, spread, count: a.length, reliable: a.length >= 16 && spread < 0.8 },
      ];
    }),
  );
  const target = { reliable: Object.values(sides).every((s) => s.reliable), sides };
  const source = scanFrameAnchors(reference, border, windows);
  return { target, ...fitAffineScan(source, target, fitScanFrame(source, target)) };
}

/** Compare internal rails after outer-stock normalization. Multiple disjoint
 * strips and opposite sides must agree. Signed gradients ignore hue and gain. */
export function internalFrameOffsets(reference, baseline, family) {
  const retro = family === 'retro',
    eighth = family === 'eighth';
  const regions = {
    artLeft: ['x', retro ? 56 : eighth ? 44 : 37, [120, 220, 320]],
    artRight: ['x', retro ? 434 : eighth ? 447 : 452, [120, 220, 320]],
    rulesLeft: ['x', retro ? 60 : eighth ? 40 : 34, [445, 500, 550]],
    rulesRight: ['x', retro ? 429 : eighth ? 448 : 452, [445, 500, 550]],
    rulesTop: ['y', retro ? 411 : eighth ? 426 : 425, [110, 240, 370]],
  };
  const a = luminance(reference),
    b = luminance(baseline),
    rows = {};
  for (const [key, [axis, center, spans]] of Object.entries(regions)) {
    const lo = center - 9,
      hi = center + 9;
    const sample = (gray, along, shift) =>
      Array.from({ length: hi - lo - 3 }, (_, i) => {
        const p = lo + 2 + i + shift;
        let sum = 0;
        for (let k = along - 9; k <= along + 9; k++) {
          const at = (t) => gray[(axis === 'x' ? k : t) * 488 + (axis === 'x' ? t : k)];
          sum += at(p + 1) - at(p - 1);
        }
        return sum / 19;
      });
    const strips = spans.map((along) => {
      const template = sample(b, along, 0),
        energy = template.reduce((n, v) => n + v * v, 0);
      const scores = Array.from({ length: 13 }, (_, i) => {
        const shift = i - 6,
          ref = sample(a, along, shift),
          e = ref.reduce((n, v) => n + v * v, 0);
        const score =
          e > 30 && energy > 30
            ? ref.reduce((n, v, j) => n + v * template[j], 0) / Math.sqrt(e * energy)
            : null;
        return { shift, score };
      })
        .filter((s) => s.score !== null)
        .sort((a, b) => b.score - a.score);
      const best = scores[0];
      return { along, ...best, reliable: !!best && best.score > 0.75 && Math.abs(best.shift) < 6 };
    });
    const good = strips.filter((s) => s.reliable),
      shift = median(good.map((s) => s.shift));
    rows[key] = {
      strips,
      shift,
      reliable: good.length >= 2 && good.every((s) => Math.abs(s.shift - shift) <= 1),
    };
  }
  return rows;
}

// A small premultiplied raster prevents transparent SVG RGB from bleeding into
// antialiased edges. Two by two samples per pixel approximate the production
// raster for search only; final adoption needs a fresh browser export.
export function stampStyledSymbol(background, rect, icon, bounds) {
  const gray = Float32Array.from(background),
    [bx, by, bw, bh] = bounds,
    [rx, ry, rw, rh] = rect;
  const at = (x, y) => {
    if (x < 0 || y < 0 || x >= icon.width || y >= icon.height) return [0, 0];
    const i = (y * icon.width + x) * 4,
      a = icon.data[i + 3] / 255;
    return [a, (0.2126 * icon.data[i] + 0.7152 * icon.data[i + 1] + 0.0722 * icon.data[i + 2]) * a];
  };
  for (let y = Math.max(0, Math.floor(by - ry)); y < Math.min(rh, Math.ceil(by + bh - ry)); y++)
    for (let x = Math.max(0, Math.floor(bx - rx)); x < Math.min(rw, Math.ceil(bx + bw - rx)); x++) {
      let total = 0;
      for (const oy of [0.25, 0.75])
        for (const ox of [0.25, 0.75]) {
          const sx = ((rx + x + ox - bx) / bw) * icon.width - 0.5,
            sy = ((ry + y + oy - by) / bh) * icon.height - 0.5;
          const ix = Math.floor(sx),
            iy = Math.floor(sy),
            fx = sx - ix,
            fy = sy - iy;
          const v = [at(ix, iy), at(ix + 1, iy), at(ix, iy + 1), at(ix + 1, iy + 1)];
          const interp = (k) =>
            (v[0][k] * (1 - fx) + v[1][k] * fx) * (1 - fy) +
            (v[2][k] * (1 - fx) + v[3][k] * fx) * fy;
          total += interp(1) + background[y * rw + x] * (1 - interp(0));
        }
      gray[y * rw + x] = total / 4;
    }
  return gray;
}
export const shiftedSymbolBounds = (b, p) => [
  b[0] + b[2] + p[0] - b[2] * p[2],
  b[1] + b[3] / 2 + p[1] - (b[3] * p[3]) / 2,
  b[2] * p[2],
  b[3] * p[3],
];
export function symbolSample(reference, blank, icon, bounds, family) {
  const rect = family === 'retro' ? [350, 370, 112, 46] : [377, 379, 86, 45];
  return {
    rect,
    reference: cropGray(reference, rect).gray,
    blank: cropGray(blank, rect).gray,
    icon,
    bounds,
  };
}
export function scoreSymbol(s, params) {
  const rendered = stampStyledSymbol(
    s.blank,
    s.rect,
    s.icon,
    shiftedSymbolBounds(s.bounds, params),
  );
  const dark = compareRegion(s.reference, rendered, s.rect[2], s.rect[3]);
  return {
    f1: dark.edgeF1?.[1] ?? 0,
    distance: dark.meanDistance ?? 20,
    census: dark.censusSimilarity ?? 0,
  };
}
export function searchSymbols(samples) {
  const cache = new Map(),
    fields = [0, 1, 2, 3];
  const evaluate = (params) => {
    const key = params.map((p) => Math.round(p * 10000) / 10000).join('/');
    if (cache.has(key)) return cache.get(key);
    const rows = samples.map((s) => scoreSymbol(s, params));
    const f1 = rows.reduce((n, r) => n + r.f1, 0) / rows.length,
      distance = rows.reduce((n, r) => n + r.distance, 0) / rows.length;
    const value = { params: [...params], f1, distance, score: f1 - 0.01 * distance, rows };
    cache.set(key, value);
    return value;
  };
  let best = evaluate([0, 0, 1, 1]);
  for (const [move, scale] of [
    [3, 0.12],
    [1, 0.04],
    [0.5, 0.02],
  ])
    for (let round = 0; round < 12; round++) {
      let next = best;
      const moves = fields.flatMap((field) => [-1, 1].map((direction) => [[field, direction]]));
      // Translation and size are correlated: moving the right edge while
      // growing width can keep the left edge fixed. Single-axis hill climbing
      // otherwise stops at a visibly undersized but well-overlapped glyph.
      for (const [position, size] of [
        [0, 2],
        [1, 3],
      ])
        for (const a of [-1, 1])
          for (const b of [-1, 1])
            moves.push([
              [position, a],
              [size, b],
            ]);
      for (const changes of moves) {
        const p = [...best.params];
        for (const [field, direction] of changes)
          p[field] += direction * (field < 2 ? move : scale);
        if (
          Math.abs(p[0]) > 8 ||
          Math.abs(p[1]) > 6 ||
          p[2] < 0.65 ||
          p[2] > 1.35 ||
          p[3] < 0.65 ||
          p[3] > 1.35
        )
          continue;
        const v = evaluate(p);
        if (v.score > next.score + 1e-6) next = v;
      }
      if (next === best) break;
      best = next;
    }
  return {
    baseline: evaluate([0, 0, 1, 1]),
    best,
    evaluated: cache.size,
    boundary:
      Math.abs(best.params[0]) >= 7.5 ||
      Math.abs(best.params[1]) >= 5.5 ||
      best.params.slice(2).some((s) => s <= 0.67 || s >= 1.33),
  };
}
