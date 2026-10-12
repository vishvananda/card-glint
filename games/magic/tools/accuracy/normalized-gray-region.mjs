import { WIDTH, HEIGHT } from './pixels.mjs';

/** Exactly the same bilinear sampling/byte rounding as normalize()+cropGray(),
 * evaluated only inside the requested canonical region. No registration fit. */
export function normalizedGrayRegion(image, rect, transform = {}) {
  const [left, top, width, height] = rect;
  if (
    rect.length !== 4 ||
    !rect.every(Number.isInteger) ||
    width < 1 ||
    height < 1 ||
    left < 0 ||
    top < 0 ||
    left + width > WIDTH ||
    top + height > HEIGHT
  )
    throw Error('Invalid canonical comparison region');
  const { tx = 0, ty = 0, scale = 1, rotation = 0 } = transform;
  if (![tx, ty, scale, rotation].every(Number.isFinite) || scale <= 0)
    throw Error('Invalid normalization transform');
  const factor = Math.min(WIDTH / image.width, HEIGHT / image.height),
    padX = (WIDTH - image.width * factor) / 2,
    padY = (HEIGHT - image.height * factor) / 2,
    cosine = Math.cos(rotation) / scale,
    sine = Math.sin(rotation) / scale,
    gray = new Float32Array(width * height);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const dx = x + left - WIDTH / 2 - tx,
        dy = y + top - HEIGHT / 2 - ty;
      const sx = (cosine * dx + sine * dy + WIDTH / 2 - padX + 0.5) / factor - 0.5,
        sy = (-sine * dx + cosine * dy + HEIGHT / 2 - padY + 0.5) / factor - 0.5;
      if (sx < 0 || sy < 0 || sx > image.width - 1 || sy > image.height - 1) continue;
      const l = Math.floor(sx),
        t = Math.floor(sy),
        r = Math.min(l + 1, image.width - 1),
        b = Math.min(t + 1, image.height - 1),
        fx = sx - l,
        fy = sy - t;
      let luminance = 0;
      for (const [channel, weight] of [
        [0, 0.2126],
        [1, 0.7152],
        [2, 0.0722],
      ]) {
        const a = image.data[(t * image.width + l) * 4 + channel],
          c = image.data[(t * image.width + r) * 4 + channel],
          d = image.data[(b * image.width + l) * 4 + channel],
          e = image.data[(b * image.width + r) * 4 + channel];
        luminance +=
          weight * Math.round((a * (1 - fx) + c * fx) * (1 - fy) + (d * (1 - fx) + e * fx) * fy);
      }
      gray[y * width + x] = luminance;
    }
  return { gray, width, height };
}
