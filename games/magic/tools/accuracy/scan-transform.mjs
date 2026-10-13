// Comparison-space affine matrices are centered at the canonical card center.
// [a,b,c,d,tx,ty] maps (x,y) to (a*x+c*y+tx,b*x+d*y+ty).
export function scanMatrix(transform = {}) {
  if (transform.matrix !== undefined) {
    if (
      !Array.isArray(transform.matrix) ||
      transform.matrix.length !== 6 ||
      !transform.matrix.every(Number.isFinite) ||
      ['tx', 'ty', 'scale', 'rotation'].some((key) => transform[key] !== undefined)
    )
      throw Error('Invalid or ambiguous normalization transform');
    const [a, b, c, d] = transform.matrix;
    if (a * d - b * c <= 1e-8) throw Error('Singular or reflected normalization transform');
    return transform.matrix;
  }
  const { scale = 1, rotation = 0, tx = 0, ty = 0 } = transform;
  if (![scale, rotation, tx, ty].every(Number.isFinite) || scale <= 0)
    throw Error('Invalid normalization transform');
  const a = scale * Math.cos(rotation),
    b = scale * Math.sin(rotation);
  return [a, b, -b, a, tx, ty];
}

export function inverseScanMatrix(transform = {}) {
  const [a, b, c, d, tx, ty] = scanMatrix(transform),
    det = a * d - b * c;
  return [d / det, -b / det, -c / det, a / det, (c * ty - d * tx) / det, (b * tx - a * ty) / det];
}

export function projectScanPoint(x, y, transform = {}) {
  const [a, b, c, d, tx, ty] = scanMatrix(transform);
  return [244 + a * (x - 244) + c * (y - 340) + tx, 340 + b * (x - 244) + d * (y - 340) + ty];
}

export function projectedScanRect(rect, transform = {}) {
  const [x, y, width, height] = rect;
  const points = [
    [x, y],
    [x + width, y],
    [x, y + height],
    [x + width, y + height],
  ].map(([px, py]) => projectScanPoint(px, py, transform));
  const left = Math.min(...points.map((p) => p[0])),
    right = Math.max(...points.map((p) => p[0])),
    top = Math.min(...points.map((p) => p[1])),
    bottom = Math.max(...points.map((p) => p[1]));
  return [left, top, right - left, bottom - top];
}
