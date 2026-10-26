// Stable dark-going frame strokes, separated from bright bevels and illustration contrast.
import assert from 'node:assert/strict';
import { median } from './metrics.mjs';
export function medianDarkeningGradient(image, [x, y, w, h, axis]) {
  assert(['x', 'y'].includes(axis));
  assert([image.width, image.height, x, y, w, h].every(Number.isInteger));
  assert(image.width > 0 && image.height > 0 && w > 0 && h > 0 && x >= 0 && y >= 0);
  assert(x + w <= image.width && y + h <= image.height);
  assert.equal(image.data.length, image.width * image.height * 4);
  const n = axis === 'x' ? w : h,
    along = axis === 'x' ? h : w;
  const light = Array.from({ length: n }, (_, i) => {
    const rgb = [0, 1, 2].map((k) =>
      median(
        Array.from(
          { length: along },
          (_, j) =>
            image.data[
              ((y + (axis === 'x' ? j : i)) * image.width + x + (axis === 'x' ? i : j)) * 4 + k
            ],
        ),
      ),
    );
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  });
  let gradient = light.slice(1).map((v, i) => Math.max(0, light[i] - v));
  // Clip polarity before smoothing: a bright illustration at the opposite side
  // of a dark keyline must not cancel the frame's dark-going transition.
  for (let pass = 0; pass < 2; pass++)
    gradient = gradient.map(
      (v, i) =>
        (gradient[Math.max(0, i - 1)] + 2 * v + gradient[Math.min(gradient.length - 1, i + 1)]) / 4,
    );
  return gradient;
}
