import { WIDTH, HEIGHT } from './pixels-pure.mjs';
import { inverseScanMatrix } from './scan-transform.mjs';

/** The normalize() bilinear/byte contract, evaluated only in a canonical window.
 * Kept separate so adding a measurement fast path does not change the existing
 * full-image metric implementation or invalidate its stored score identities. */
export function normalizedRgbaRegion(image, rect, transform = {}) {
  const [left, top, width, height] = rect;
  if (
    rect.length !== 4 ||
    !rect.every(Number.isInteger) ||
    width < 1 ||
    height < 1 ||
    left < 0 ||
    top < 0 ||
    left + width > WIDTH ||
    top + height > HEIGHT ||
    !Number.isInteger(image.width) ||
    !Number.isInteger(image.height) ||
    image.width < 1 ||
    image.height < 1 ||
    image.data.length !== image.width * image.height * 4
  )
    throw RangeError('Invalid source image or canonical RGBA window');
  const { tx = 0, ty = 0, scale = 1, rotation = 0 } = transform,
    matrix = inverseScanMatrix(transform),
    factor = Math.min(WIDTH / image.width, HEIGHT / image.height),
    padX = (WIDTH - image.width * factor) / 2,
    padY = (HEIGHT - image.height * factor) / 2,
    cosine = Math.cos(rotation) / scale,
    sine = Math.sin(rotation) / scale,
    data = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const cx = x + left,
        cy = y + top,
        dx = cx - WIDTH / 2 - tx,
        dy = cy - HEIGHT / 2 - ty,
        px = transform.matrix
          ? matrix[0] * (cx - WIDTH / 2) + matrix[2] * (cy - HEIGHT / 2) + matrix[4]
          : cosine * dx + sine * dy,
        py = transform.matrix
          ? matrix[1] * (cx - WIDTH / 2) + matrix[3] * (cy - HEIGHT / 2) + matrix[5]
          : -sine * dx + cosine * dy,
        sx = (px + WIDTH / 2 - padX + 0.5) / factor - 0.5,
        sy = (py + HEIGHT / 2 - padY + 0.5) / factor - 0.5;
      if (sx < 0 || sy < 0 || sx > image.width - 1 || sy > image.height - 1) continue;
      const l = Math.floor(sx),
        t = Math.floor(sy),
        r = Math.min(l + 1, image.width - 1),
        b = Math.min(t + 1, image.height - 1),
        fx = sx - l,
        fy = sy - t,
        p = (y * width + x) * 4;
      for (let channel = 0; channel < 4; channel++) {
        const a = image.data[(t * image.width + l) * 4 + channel],
          c = image.data[(t * image.width + r) * 4 + channel],
          d = image.data[(b * image.width + l) * 4 + channel],
          e = image.data[(b * image.width + r) * 4 + channel];
        data[p + channel] = Math.round(
          (a * (1 - fx) + c * fx) * (1 - fy) + (d * (1 - fx) + e * fx) * fy,
        );
      }
    }
  return { width, height, data };
}
