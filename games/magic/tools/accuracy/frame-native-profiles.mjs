// Exact frame profiles without normalizing every pixel of a native card.
import { PROFILE_WINDOWS } from './frame-family-metrics.mjs';
/** Equal to frameProfiles(normalize(image)) for the native 732x1020 capture.
 * Only the 24 thin sample strips are resampled. This is analysis-time CPU work,
 * not an animation-frame mask readback or a GPU-completion benchmark. */
function nativeGrayCrop(image, [rx, ry, width, height]) {
  const out = new Float32Array(width * height),
    data = image.data;
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const px = (x + rx + 0.5) * 1.5 - 0.5,
        py = (y + ry + 0.5) * 1.5 - 0.5;
      const left = Math.floor(px),
        top = Math.floor(py),
        fx = px - left,
        fy = py - top,
        index = (top * image.width + left) * 4;
      const sample = (channel) =>
        Math.round(
          (data[index + channel] * (1 - fx) + data[index + 4 + channel] * fx) * (1 - fy) +
            (data[index + image.width * 4 + channel] * (1 - fx) +
              data[index + image.width * 4 + 4 + channel] * fx) *
              fy,
        );
      const alpha = sample(3) / 255;
      out[y * width + x] =
        alpha * (0.2126 * sample(0) + 0.7152 * sample(1) + 0.0722 * sample(2)) + (1 - alpha) * 128;
    }
  return out;
}

export function nativeFrameProfiles(image) {
  if (image.width !== 732 || image.height !== 1020 || image.data.length !== 732 * 1020 * 4)
    throw Error('Expected a native 732x1020 RGBA capture');
  return Object.fromEntries(
    Object.entries(PROFILE_WINDOWS).map(([key, w]) => [
      key,
      w.along.map((along) => {
        const horizontal = w.axis === 'x',
          length = w.hi - w.lo + 1;
        const rect = horizontal ? [w.lo, along - 15, length, 31] : [along - 15, w.lo, 31, length];
        const gray = nativeGrayCrop(image, rect);
        const profile = Array.from({ length }, (_, i) => {
          let sum = 0;
          for (let a = 0; a < 31; a++) sum += gray[horizontal ? a * length + i : i * 31 + a];
          return sum / 31;
        });
        return profile.map(
          (v, i) =>
            (profile[Math.max(0, i - 1)] + 2 * v + profile[Math.min(profile.length - 1, i + 1)]) /
            4,
        );
      }),
    ]),
  );
}

/** Exact opaqueSupport([normalize(image)]) without a full-image resample. */
export function nativeOpaqueSupport(image) {
  if (image.width !== 732 || image.height !== 1020 || image.data.length !== 732 * 1020 * 4)
    throw Error('Expected a native 732x1020 RGBA capture');
  const opacity = (x, y) => {
    const px = (x + 0.5) * 1.5 - 0.5,
      py = (y + 0.5) * 1.5 - 0.5,
      l = Math.floor(px),
      t = Math.floor(py),
      fx = px - l,
      fy = py - t;
    const i = (t * image.width + l) * 4 + 3,
      d = image.data,
      stride = image.width * 4;
    return Math.round(
      (d[i] * (1 - fx) + d[i + 4] * fx) * (1 - fy) +
        (d[i + stride] * (1 - fx) + d[i + stride + 4] * fx) * fy,
    );
  };
  return Object.fromEntries(
    Object.entries(PROFILE_WINDOWS).map(([name, w]) => {
      if (!name.startsWith('art')) return [name, [0, w.hi - w.lo + 1]];
      const safe = [];
      for (let p = w.lo; p <= w.hi; p++) {
        let opaque = true;
        for (const along of w.along)
          for (let a = along - 17; a <= along + 17 && opaque; a++)
            for (let d = -2; d <= 2; d++) {
              if (opacity(w.axis === 'x' ? p + d : a, w.axis === 'y' ? p + d : a) < 254) {
                opaque = false;
                break;
              }
            }
        safe.push(opaque);
      }
      const reverse = name.endsWith('Right') || name.endsWith('Bottom');
      let n = 0;
      while (n < safe.length && safe[reverse ? safe.length - 1 - n : n]) n++;
      return [name, reverse ? [safe.length - n, safe.length] : [0, n]];
    }),
  );
}
