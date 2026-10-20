/** Exact 1.5x bilinear sampling footprint used by nativeGrayCrop. Read only
 * this rectangle from Canvas2D during an offline typography trial. */
export function nativeTextWindow(rect, origin, canvasSize) {
  if (
    rect.length !== 4 ||
    origin.length !== 2 ||
    canvasSize.length !== 2 ||
    ![...rect, ...origin, ...canvasSize].every(Number.isFinite) ||
    rect.slice(2).some((v) => !Number.isInteger(v) || v <= 0) ||
    canvasSize.some((v) => !Number.isInteger(v) || v <= 0)
  )
    throw RangeError(
      'Native text readback requires finite coordinates and positive integer dimensions',
    );
  const [rx, ry, w, h] = rect;
  const x = Math.floor((rx + 0.5) * 1.5 - 0.5 - origin[0]);
  const y = Math.floor((ry + 0.5) * 1.5 - 0.5 - origin[1]);
  const right = Math.floor((rx + w - 0.5) * 1.5 - 0.5 - origin[0]) + 2;
  const bottom = Math.floor((ry + h - 0.5) * 1.5 - 0.5 - origin[1]) + 2;
  if (x < 0 || y < 0 || right > canvasSize[0] || bottom > canvasSize[1])
    throw RangeError('Native typography sampling footprint is outside its canvas');
  return { x, y, width: right - x, height: bottom - y, origin: [origin[0] + x, origin[1] + y] };
}
