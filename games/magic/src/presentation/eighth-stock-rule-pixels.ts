import type { FramePixels } from './frame-paper-mask.js';
import type { Rgb } from './hsb.js';
/** Symmetric subpixel outline of the existing alpha contour, in raster texels.
 * Eight bilinear directions preserve rounded corners without tracing a new frame. */
export function eighthStockRulePixels(image: FramePixels, radius: number, rgb: Rgb): void {
  if (
    !Number.isFinite(radius) ||
    radius <= 0 ||
    radius > 2 ||
    rgb.some((v) => !Number.isFinite(v) || v < 0 || v > 255)
  )
    throw RangeError('Invalid Eighth stock-rule parameters');
  const { width: w, height: h, data } = image,
    alpha = new Uint8ClampedArray(w * h);
  for (let i = 0; i < alpha.length; i++) alpha[i] = data[i * 4 + 3]!;
  const sample = (x: number, y: number) => {
    x = Math.max(0, Math.min(w - 1, x));
    y = Math.max(0, Math.min(h - 1, y));
    const ix = Math.floor(x),
      iy = Math.floor(y),
      fx = x - ix,
      fy = y - iy;
    const at = (xx: number, yy: number) => alpha[Math.min(h - 1, yy) * w + Math.min(w - 1, xx)]!;
    return (
      (at(ix, iy) * (1 - fx) + at(ix + 1, iy) * fx) * (1 - fy) +
      (at(ix, iy + 1) * (1 - fx) + at(ix + 1, iy + 1) * fx) * fy
    );
  };
  const rays = Array.from(
    { length: 8 },
    (_, i) => [Math.cos((i * Math.PI) / 4) * radius, Math.sin((i * Math.PI) / 4) * radius] as const,
  );
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      let lo = 255,
        hi = 0;
      for (const [dx, dy] of rays) {
        const v = sample(x + dx, y + dy);
        lo = Math.min(lo, v);
        hi = Math.max(hi, v);
      }
      const i = (y * w + x) * 4;
      data[i] = rgb[0];
      data[i + 1] = rgb[1];
      data[i + 2] = rgb[2];
      data[i + 3] = Math.round(hi - lo);
    }
}
