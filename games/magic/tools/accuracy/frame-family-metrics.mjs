import { luminance, WIDTH, HEIGHT } from './pixels.mjs';
import { median, quantile } from './metrics.mjs';
// Fixed strips avoid names, type lines, symbols, artist and body text centers.
export const PROFILE_WINDOWS = {
  artLeft: { axis: 'x', lo: 43, hi: 78, along: [120, 220, 320] },
  artRight: { axis: 'x', lo: 410, hi: 446, along: [120, 220, 320] },
  artTop: { axis: 'y', lo: 53, hi: 86, along: [125, 244, 363] },
  artBottom: { axis: 'y', lo: 356, hi: 382, along: [125, 244, 363] },
  rulesLeft: { axis: 'x', lo: 44, hi: 87, along: [444, 492, 545] },
  rulesRight: { axis: 'x', lo: 399, hi: 447, along: [444, 492, 545] },
  rulesTop: { axis: 'y', lo: 399, hi: 429, along: [106, 244, 382] },
  rulesBottom: { axis: 'y', lo: 580, hi: 618, along: [125, 244, 363] },
};
function profile(gray, axis, lo, hi, along, half = 15) {
  const result = [];
  for (let p = lo; p <= hi; p++) {
    let sum = 0;
    for (let a = along - half; a <= along + half; a++)
      sum += gray[(axis === 'x' ? a : p) * WIDTH + (axis === 'x' ? p : a)];
    result.push(sum / (half * 2 + 1));
  }
  return result;
}
const smooth = (a) =>
  a.map((v, i) => (a[Math.max(0, i - 1)] + 2 * v + a[Math.min(a.length - 1, i + 1)]) / 4);
export function frameProfiles(image) {
  if (image.width !== WIDTH || image.height !== HEIGHT) throw Error('Expected canonical image');
  const gray = luminance(image);
  return Object.fromEntries(
    Object.entries(PROFILE_WINDOWS).map(([key, w]) => [
      key,
      w.along.map((a) => smooth(profile(gray, w.axis, w.lo, w.hi, a))),
    ]),
  );
}
export function profileSimilarity(a, b) {
  if (a.length !== b.length) throw Error('Profile lengths disagree');
  const gradient = (x) => x.slice(1, -1).map((_, i) => (x[i + 2] - x[i]) / 2),
    ga = gradient(a),
    gb = gradient(b);
  const aa = ga.reduce((s, x) => s + x * x, 0),
    bb = gb.reduce((s, x) => s + x * x, 0);
  if (aa < 20 || bb < 20) return { status: 'weak', score: null, cosine: null, census: null };
  const cosine = ga.reduce((s, x, i) => s + x * gb[i], 0) / Math.sqrt(aa * bb);
  const threshold = Math.max(1, (quantile(a, 0.95) - quantile(a, 0.05)) * 0.04);
  let same = 0,
    total = 0;
  for (let i = 0; i < a.length; i++)
    for (const d of [1, 2, 4])
      if (i + d < a.length && Math.abs(a[i + d] - a[i]) > threshold) {
        total++;
        if (a[i + d] > a[i] === b[i + d] > b[i]) same++;
      }
  const census = total ? same / total : null;
  return {
    status: 'measured',
    cosine,
    census,
    score: (0.7 * (1 + cosine)) / 2 + 0.3 * (census ?? 0.5),
  };
}
/** Outer stock transition only; never fit scan placement against a candidate's
 * internal bevels. Dark/weak sides and endpoint peaks remain uncertain. */
export function stockBounds(image, border) {
  const gray = luminance(image),
    specs = {
      left: ['x', 12, 39, [150, 300, 530]],
      right: ['x', 449, 476, [150, 300, 530]],
      top: ['y', 16, 43, [100, 244, 388]],
      bottom: ['y', 638, 666, [100, 244, 388]],
    };
  const sides = {};
  for (const [side, [axis, lo, hi, positions]] of Object.entries(specs)) {
    const sign = (side === 'left' || side === 'top' ? 1 : -1) * (border === 'white' ? -1 : 1),
      found = [];
    for (const along of positions) {
      const a = smooth(profile(gray, axis, lo - 2, hi + 2, along, 22)),
        g = [];
      for (let i = 2; i < a.length - 2; i++) g.push(sign * (a[i + 2] - a[i - 2]));
      const threshold = Math.max(12, Math.max(...g) * 0.5);
      let peaks = g.flatMap((v, i) =>
        i > 0 && i + 1 < g.length && v >= threshold && v > g[i - 1] && v >= g[i + 1]
          ? [{ i, v }]
          : [],
      );
      if (side === 'right' || side === 'bottom') peaks.reverse();
      const peak = peaks[0];
      if (!peak) continue;
      const { i, v } = peak,
        at = lo + i + (g[i - 1] - g[i + 1]) / (2 * (g[i - 1] - 2 * v + g[i + 1]));
      if (at < lo + 1 || at > hi - 1) continue;
      found.push(at);
    }
    const center = median(found),
      spread = center === null ? null : Math.max(...found.map((p) => Math.abs(p - center)));
    sides[side] = {
      position: center,
      count: found.length,
      spread,
      reliable: found.length >= 2 && spread <= 1.5,
    };
  }
  const valid = Object.values(sides).every((s) => s.reliable);
  return {
    sides,
    reliable: valid,
    width: valid ? sides.right.position - sides.left.position : null,
    height: valid ? sides.bottom.position - sides.top.position : null,
  };
}
/** One transform per set/printed-frame/stock group, fitted on calibration only.
 * A fixed card-stock rectangle is the target, independent of candidate families. */
export function sharedRegistration(rows) {
  const valid = rows.filter((r) => r.cohort === 'calibration' && r.bounds.reliable),
    hold = rows.filter((r) => r.cohort === 'validation' && r.bounds.reliable);
  if (valid.length < 6 || new Set(valid.map((r) => r.material)).size < 3 || hold.length < 2)
    return {
      status: 'insufficient-outer-anchors',
      transform: {},
      calibration: valid.length,
      validation: hold.length,
    };
  const width = median(valid.map((r) => r.bounds.width)),
    height = median(valid.map((r) => r.bounds.height)),
    scale = 439.2 / width;
  const cx = median(
      valid.map((r) => (r.bounds.sides.left.position + r.bounds.sides.right.position) / 2),
    ),
    cy = median(
      valid.map((r) => (r.bounds.sides.top.position + r.bounds.sides.bottom.position) / 2),
    );
  const transform = { scale, tx: (244 - cx) * scale, ty: (340 - cy) * scale };
  const widthMad = median(valid.map((r) => Math.abs(r.bounds.width - width))),
    verticalError = Math.abs(height * scale - 625.6),
    validationError = median(hold.map((r) => Math.abs(r.bounds.width * scale - 439.2)));
  const status =
    Math.abs(scale - 1) > 0.02 || Math.abs(transform.tx) > 5 || Math.abs(transform.ty) > 5
      ? 'out-of-bounds'
      : widthMad > 1 || verticalError > 2 || validationError > 2
        ? 'inconsistent-outer-geometry'
        : 'accepted';
  return {
    status,
    transform: status === 'accepted' ? transform : {},
    proposed: transform,
    widthMad,
    verticalError,
    validationError,
    calibration: valid.length,
    validation: hold.length,
  };
}
