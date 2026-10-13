import assert from 'node:assert/strict';

/** Offline, native-resolution component measurement. Reject components touching
 * the search window so a frame edge cannot silently become the symbol bounds.
 * Callers must check threshold stability; this is not a universal segmenter. */
export function symbolComponentBounds(image, threshold, light = false, profile = {}) {
  const signal = profile.signal ?? 'luminance';
  assert.ok(['luminance', 'contrast'].includes(signal));
  const region = profile.region ?? [363, 374, 76, 31],
    limits = profile.limits ?? { width: [40, 72], height: [light ? 18 : 12, 29] };
  assert.ok(Number.isFinite(threshold) && threshold >= 0 && threshold <= 255);
  assert.ok(region.length === 4 && region.every(Number.isFinite));
  assert.ok(
    region[0] >= 0 &&
      region[1] >= 0 &&
      region[2] > 0 &&
      region[3] > 0 &&
      region[0] + region[2] <= 488 &&
      region[1] + region[3] <= 680,
  );
  for (const range of [limits.width, limits.height])
    assert.ok(
      range.length === 2 && range.every(Number.isFinite) && range[0] > 0 && range[1] >= range[0],
    );
  assert.ok(
    Number.isInteger(image.width) &&
      image.width > 0 &&
      Number.isInteger(image.height) &&
      image.height > 0 &&
      image.data.length === image.width * image.height * 4,
  );
  const factor = Math.min(488 / image.width, 680 / image.height),
    padX = (488 - image.width * factor) / 2,
    padY = (680 - image.height * factor) / 2,
    box = region,
    x0 = Math.floor((box[0] - padX) / factor),
    y0 = Math.floor((box[1] - padY) / factor),
    width = Math.ceil(box[2] / factor),
    height = Math.ceil(box[3] / factor),
    mask = new Uint8Array(width * height);
  assert.ok(
    x0 >= 1 && y0 >= 1 && x0 + width < image.width && y0 + height < image.height,
    'Measurement window must be inside the source image.',
  );
  const gray = (x, y) => {
    const p = (y * image.width + x) * 4;
    return 0.2126 * image.data[p] + 0.7152 * image.data[p + 1] + 0.0722 * image.data[p + 2];
  };
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const px = x + x0,
        py = y + y0,
        p = (py * image.width + px) * 4;
      let selected;
      if (signal === 'contrast') {
        let low = 255,
          high = 0;
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) {
            const value = gray(px + dx, py + dy);
            low = Math.min(low, value);
            high = Math.max(high, value);
          }
        selected = high - low > threshold;
      } else {
        const value = gray(px, py);
        selected = light ? value > threshold : value < threshold;
      }
      mask[y * width + x] = Number(image.data[p + 3] > 0 && selected);
    }
  const queue = new Int32Array(mask.length),
    components = [];
  for (let start = 0; start < mask.length; start++) {
    if (mask[start] !== 1) continue;
    let head = 0,
      tail = 0,
      left = width,
      right = 0,
      top = height,
      bottom = 0;
    queue[tail++] = start;
    mask[start] = 2;
    while (head < tail) {
      const i = queue[head++],
        x = i % width,
        y = Math.floor(i / width);
      left = Math.min(left, x);
      right = Math.max(right, x);
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx,
            ny = y + dy,
            j = ny * width + nx;
          if (nx < 0 || nx >= width || ny < 0 || ny >= height || mask[j] !== 1) continue;
          mask[j] = 2;
          queue[tail++] = j;
        }
    }
    if (left === 0 || right === width - 1 || top === 0 || bottom === height - 1) continue;
    // The 3 × 3 contrast kernel extends the envelope one native pixel on
    // each side. Remove that known support before comparing scan/raster sizes.
    const support = signal === 'contrast' ? 1 : 0;
    left += support;
    top += support;
    right -= support;
    bottom -= support;
    const rect = [
      (x0 + left) * factor + padX,
      (y0 + top) * factor + padY,
      (right - left + 1) * factor,
      (bottom - top + 1) * factor,
    ];
    if (
      rect[2] < limits.width[0] ||
      rect[2] > limits.width[1] ||
      rect[3] < limits.height[0] ||
      rect[3] > limits.height[1]
    )
      continue;
    components.push({
      threshold,
      rect,
      nativeRect: [x0 + left, y0 + top, right - left + 1, bottom - top + 1],
      area: tail * factor ** 2,
    });
  }
  components.sort((a, b) => b.area - a.area);
  if (!components.length) return null;
  return {
    ...components[0],
    candidateCount: components.length,
    ambiguous: components.length > 1 && components[1].area > components[0].area * 0.8,
  };
}
