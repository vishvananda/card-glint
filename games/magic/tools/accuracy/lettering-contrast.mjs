import { blur } from './edges.mjs';

/** Signed local-contrast correlation retains stroke interiors that edge-only
 * metrics discard. Positive affine luminance changes cancel. No registration
 * search: every sample remains at the frozen frame-family coordinates.
 * Background texture and font width still affect this diagnostic.
 */
export function letteringContrast(a, b, width, height) {
  if (a.length !== width * height || b.length !== a.length)
    throw Error('Contrast windows must have matching dimensions');
  const residual = (values) => {
    const smooth = blur(values, width, height, 1);
    const background = blur(smooth, width, height, 7);
    return Float32Array.from(smooth, (v, i) => v - background[i]);
  };
  const x = residual(a),
    y = residual(b);
  const mx = x.reduce((sum, v) => sum + v, 0) / x.length,
    my = y.reduce((sum, v) => sum + v, 0) / y.length;
  let xy = 0,
    xx = 0,
    yy = 0;
  for (let i = 0; i < x.length; i++) {
    const dx = x[i] - mx,
      dy = y[i] - my;
    xy += dx * dy;
    xx += dx * dx;
    yy += dy * dy;
  }
  if (xx < 1e-8 || yy < 1e-8) return null;
  return Math.max(-1, Math.min(1, xy / Math.sqrt(xx * yy)));
}
