import { blur } from './edges.mjs';
import { luminance, WIDTH, HEIGHT } from './pixels.mjs';
import { median } from './metrics.mjs';

export const IDENTITY = { tx: 0, ty: 0, scale: 1, rotation: 0 };
export const ALIGNMENT_VERSION = 'fixed-frame-v2';

export function frameFamily(result) {
  if (result.frame !== 'normal') return result.frame;
  return /\bLegendary\b/.test(result.face.typeLine) ? 'modern-legendary' : 'modern-normal';
}

/** Search strips contain frame borders, not names or rules. Coordinates are independent reference landmarks. */
export function landmarks(family) {
  if (family === 'retro-seventh')
    return [
      ...[90, 240, 400].flatMap((x) => [67, 370, 406].map((y) => ({ x, y, axis: 'y' }))),
      ...[130, 230, 310].flatMap((y) => [
        { x: 56, y, axis: 'x' },
        { x: 432, y, axis: 'x' },
      ]),
    ];
  if (family.startsWith('retro-')) return [];
  const large = family === 'planeswalker-large',
    walker = family.startsWith('planeswalker');
  const artTop = walker ? 64 : 72,
    artBottom = large ? 331 : 378;
  const typeBottom = large ? 371 : 421;
  return [
    ...[90, 240, 400].map((x) => ({ x, y: artTop, axis: 'y' })),
    ...[90, 240, 400].map((x) => ({ x, y: artBottom, axis: 'y' })),
    ...[90, 240, 400].map((x) => ({ x, y: typeBottom, axis: 'y' })),
    ...[130, 230, 310].flatMap((y) => [
      { x: 34, y, axis: 'x' },
      { x: 454, y, axis: 'x' },
    ]),
  ];
}

/** Locate border ridges for calibration/diagnostics; never fit a transform for an individual scan. */
export function measureLandmarks(image, family) {
  const gray = blur(luminance(image), WIDTH, HEIGHT);
  return landmarks(family).map((point) => {
    const axisX = point.axis === 'x';
    let best = -Infinity,
      offset = 0;
    for (let d = -5; d <= 5; d += 0.5) {
      const x = Math.round(point.x + (axisX ? d : 0)),
        y = Math.round(point.y + (axisX ? 0 : d));
      let ridge = 0;
      for (let along = -15; along <= 15; along++) {
        const i = (y + (axisX ? along : 0)) * WIDTH + x + (axisX ? 0 : along);
        const stride = axisX ? 1 : WIDTH;
        ridge += (gray[i - 4 * stride] + gray[i + 4 * stride]) / 2 - gray[i];
      }
      const score = ridge / 31;
      if (score > best) {
        best = score;
        offset = d;
      }
    }
    return { ...point, detected: point[point.axis] + offset, strength: best };
  });
}

/** One robust median observation per landmark over the calibration cohort. */
export function fitSharedTransform(samples) {
  if (samples.length < 3)
    return { transform: IDENTITY, status: 'insufficient-calibration', sampleCount: samples.length };
  const rows = [];
  for (let i = 0; i < samples[0].reference.length; i++) {
    const pairs = samples.filter((s) => s.reference[i].strength > 8 && s.rendered[i].strength > 8);
    if (pairs.length < Math.ceil(samples.length / 2)) continue;
    const point = pairs[0].reference[i];
    const source = median(pairs.map((p) => p.reference[i].detected));
    const target = median(pairs.map((p) => p.rendered[i].detected));
    const x = (point.axis === 'x' ? source : point.x) - WIDTH / 2;
    const y = (point.axis === 'y' ? source : point.y) - HEIGHT / 2;
    rows.push({ a: point.axis === 'x' ? [1, 0, x, -y] : [0, 1, y, x], b: target - source });
  }
  if (rows.length < 8)
    return { transform: IDENTITY, status: 'insufficient-landmarks', sampleCount: samples.length };
  const solution = leastSquares(rows);
  if (!solution)
    return { transform: IDENTITY, status: 'singular-fit', sampleCount: samples.length };
  const [tx, ty, deltaScale, angle] = solution;
  const scale = Math.hypot(1 + deltaScale, angle),
    rotation = Math.atan2(angle, 1 + deltaScale);
  const transform = { tx, ty, scale, rotation };
  const residual = Math.sqrt(
    rows.reduce(
      (sum, row) => sum + (row.a.reduce((v, a, i) => v + a * solution[i], 0) - row.b) ** 2,
      0,
    ) / rows.length,
  );
  const bounded =
    Math.abs(tx) <= 6 &&
    Math.abs(ty) <= 6 &&
    Math.abs(scale - 1) <= 0.015 &&
    Math.abs(rotation) <= Math.PI / 360;
  return {
    transform: bounded && residual < 3 ? transform : IDENTITY,
    status: bounded && residual < 3 ? 'calibrated' : 'rejected-fit',
    proposedTransform: transform,
    residualPx: residual,
    landmarkCount: rows.length,
    sampleCount: samples.length,
  };
}

function leastSquares(rows) {
  const m = Array.from({ length: 4 }, () => new Array(5).fill(0));
  for (const { a, b } of rows)
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) m[i][j] += a[i] * a[j];
      m[i][4] += a[i] * b;
    }
  for (let i = 0; i < 4; i++) {
    let pivot = i;
    for (let j = i + 1; j < 4; j++) if (Math.abs(m[j][i]) > Math.abs(m[pivot][i])) pivot = j;
    [m[i], m[pivot]] = [m[pivot], m[i]];
    if (Math.abs(m[i][i]) < 1e-8) return null;
    const scale = m[i][i];
    for (let j = i; j < 5; j++) m[i][j] /= scale;
    for (let k = 0; k < 4; k++)
      if (k !== i) {
        const factor = m[k][i];
        for (let j = i; j < 5; j++) m[k][j] -= factor * m[i][j];
      }
  }
  return m.map((row) => row[4]);
}

export function alignmentDiagnostic(reference, rendered, family) {
  const a = measureLandmarks(reference, family),
    b = measureLandmarks(rendered, family);
  const residuals = a.flatMap((p, i) =>
    p.strength > 8 && b[i].strength > 8 ? [Math.abs(p.detected - b[i].detected)] : [],
  );
  return {
    medianResidualPx: median(residuals),
    measuredLandmarks: residuals.length,
    uncertain: residuals.length < 8 || median(residuals) > 3,
  };
}
