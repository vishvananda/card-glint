// Sample a scan directly into a painter-resolution window, without an
// intermediate 488px raster. Coordinates and the affine remain canonical.
import assert from 'node:assert/strict';
import { WIDTH, HEIGHT } from './pixels-pure.mjs';
import { inverseScanMatrix } from './scan-transform.mjs';
export function nativeReferenceWindow(image, rect, transform = {}, rasterScale = 1.5) {
  const [left, top, w, h] = rect;
  assert(rect.length === 4 && rect.every(Number.isInteger));
  assert(left >= 0 && top >= 0 && w > 0 && h > 0 && left + w <= WIDTH && top + h <= HEIGHT);
  assert(Number.isFinite(rasterScale) && rasterScale > 0 && rasterScale <= 4);
  assert(
    Number.isInteger(image.width) &&
      Number.isInteger(image.height) &&
      image.width > 0 &&
      image.height > 0,
  );
  assert.equal(image.data.length, image.width * image.height * 4);
  const width = Math.ceil(w * rasterScale),
    height = Math.ceil(h * rasterScale);
  assert(width * height <= 4194304);
  const m = inverseScanMatrix(transform),
    factor = Math.min(WIDTH / image.width, HEIGHT / image.height),
    padX = (WIDTH - image.width * factor) / 2,
    padY = (HEIGHT - image.height * factor) / 2,
    data = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const cx = left + (x + 0.5) / rasterScale - 0.5 - WIDTH / 2,
        cy = top + (y + 0.5) / rasterScale - 0.5 - HEIGHT / 2,
        sx = (m[0] * cx + m[2] * cy + m[4] + WIDTH / 2 - padX + 0.5) / factor - 0.5,
        sy = (m[1] * cx + m[3] * cy + m[5] + HEIGHT / 2 - padY + 0.5) / factor - 0.5;
      if (sx < 0 || sy < 0 || sx > image.width - 1 || sy > image.height - 1) continue;
      const l = Math.floor(sx),
        t = Math.floor(sy),
        r = Math.min(l + 1, image.width - 1),
        b = Math.min(t + 1, image.height - 1),
        fx = sx - l,
        fy = sy - t,
        p = (y * width + x) * 4;
      for (let k = 0; k < 4; k++) {
        const a = image.data[(t * image.width + l) * 4 + k],
          c = image.data[(t * image.width + r) * 4 + k],
          d = image.data[(b * image.width + l) * 4 + k],
          e = image.data[(b * image.width + r) * 4 + k];
        data[p + k] = Math.round((a * (1 - fx) + c * fx) * (1 - fy) + (d * (1 - fx) + e * fx) * fy);
      }
    }
  return { width, height, data };
}
