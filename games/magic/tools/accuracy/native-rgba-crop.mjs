/** Canonical RGBA pixels from a native 732px readback with a device-pixel origin.
 * Matches normalize()'s sampling phase without allocating a full card per trial. */
export function nativeRgbaCrop(image, rect, origin = [0, 0], scale = 1.5) {
  if (!(scale > 0) || !Number.isFinite(scale)) throw Error('Invalid native scale');
  const [x, y, width, height] = rect;
  if (![x, y, width, height, ...origin].every(Number.isInteger) || width <= 0 || height <= 0)
    throw Error('Invalid native RGBA window');
  const data = new Uint8Array(width * height * 4);
  for (let py = 0; py < height; py++)
    for (let px = 0; px < width; px++) {
      const sx = (x + px + 0.5) * scale - 0.5 - origin[0],
        sy = (y + py + 0.5) * scale - 0.5 - origin[1],
        left = Math.floor(sx),
        top = Math.floor(sy),
        fx = sx - left,
        fy = sy - top;
      if (left < 0 || top < 0 || left + 1 >= image.width || top + 1 >= image.height)
        throw Error('Native RGBA window lacks source padding');
      for (let c = 0; c < 4; c++) {
        const at = (top * image.width + left) * 4 + c;
        data[(py * width + px) * 4 + c] = Math.round(
          (image.data[at] * (1 - fx) + image.data[at + 4] * fx) * (1 - fy) +
            (image.data[at + image.width * 4] * (1 - fx) +
              image.data[at + (image.width + 1) * 4] * fx) *
              fy,
        );
      }
    }
  return { width, height, data };
}
