/** Offline, native-resolution component measurement. Reject components touching
 * the search window so a frame edge cannot silently become the symbol bounds.
 * Callers must check threshold stability; this is not a universal segmenter. */
export function symbolComponentBounds(image, threshold, light = false) {
  const factor = Math.min(488 / image.width, 680 / image.height),
    padX = (488 - image.width * factor) / 2,
    padY = (680 - image.height * factor) / 2,
    box = [363, 374, 76, 31],
    x0 = Math.floor((box[0] - padX) / factor),
    y0 = Math.floor((box[1] - padY) / factor),
    width = Math.ceil(box[2] / factor),
    height = Math.ceil(box[3] / factor),
    mask = new Uint8Array(width * height);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const p = ((y + y0) * image.width + x + x0) * 4,
        value = 0.2126 * image.data[p] + 0.7152 * image.data[p + 1] + 0.0722 * image.data[p + 2];
      mask[y * width + x] = Number(light ? value > threshold : value < threshold);
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
    const rect = [
      (x0 + left) * factor + padX,
      (y0 + top) * factor + padY,
      (right - left + 1) * factor,
      (bottom - top + 1) * factor,
    ];
    if (rect[2] < 40 || rect[2] > 72 || rect[3] < (light ? 18 : 12) || rect[3] > 29) continue;
    components.push({
      threshold,
      rect,
      nativeRect: [x0 + left, y0 + top, right - left + 1, bottom - top + 1],
      area: tail * factor ** 2,
    });
  }
  return components.sort((a, b) => b.area - a.area)[0] ?? null;
}
