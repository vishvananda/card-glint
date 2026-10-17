import type { FramePixels } from './frame-paper-mask.js';
import type { Rgb } from './hsb.js';

/** Native stock masks preserve beveled source edges. FUT plates without a mask
 * use neutral dark pixels connected to the source edge, confined to its outer
 * band. Enclosed ink and colored texture cannot join that fallback selection.
 * Built once from the existing material readback, never during animation. */
export function frameStockInk(image: FramePixels, mask?: FramePixels): Uint32Array {
  const { width: w, height: h, data } = image;
  const seen = new Uint8Array(w * h),
    queue = new Uint32Array(w * h);
  let size = 0;
  if (mask) {
    for (let i = 0; i < w * h; i++) {
      const p = i * 4;
      if (data[p + 3] && mask.data[p + 3] && Math.max(data[p]!, data[p + 1]!, data[p + 2]!) < 96)
        queue[size++] = i;
    }
    return queue.slice(0, size);
  }
  const add = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    if (x > w * 0.075 && x < w * 0.925 && y > h * 0.06 && y < h * 0.94) return;
    const i = y * w + x;
    if (seen[i]) return;
    seen[i] = 1;
    const p = i * 4,
      r = data[p]!,
      g = data[p + 1]!,
      b = data[p + 2]!;
    if (!data[p + 3] || Math.max(r, g, b) >= 96 || Math.max(r, g, b) - Math.min(r, g, b) > 6)
      return;
    queue[size++] = i;
  };
  // Transparent corners do not bridge into isolated interior ink.
  for (let x = 0; x < w; x++) {
    add(x, 0);
    add(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    add(0, y);
    add(w - 1, y);
  }
  for (let head = 0; head < size; head++) {
    const i = queue[head]!,
      x = i % w,
      y = Math.floor(i / w);
    add(x - 1, y);
    add(x + 1, y);
    add(x, y - 1);
    add(x, y + 1);
  }
  return queue.slice(0, size);
}

/** A separate stock curve prevents a texture fit from choosing the border's
 * black level. Keep the monotone 96-byte transition and the original alpha. */
export function colorFrameStockInk(
  image: FramePixels,
  before: Uint8ClampedArray | Uint8Array,
  selection: Uint32Array,
  stock: Rgb,
  mask?: FramePixels,
): void {
  validateFrameStock(stock);
  for (const i of selection) {
    const p = i * 4;
    const weight = Math.max(0, 1 - Math.max(before[p]!, before[p + 1]!, before[p + 2]!) / 96) ** 2;
    const alpha = mask ? mask.data[p + 3]! / 255 : 1;
    for (let c = 0; c < 3; c++)
      image.data[p + c] = Math.round(
        image.data[p + c]! * (1 - alpha) + (before[p + c]! + stock[c]! * 255 * weight) * alpha,
      );
  }
}

export function validateFrameStock(stock: Rgb): void {
  if (stock.length !== 3 || stock.some((v) => !Number.isFinite(v) || v < 0 || v > 48 / 255))
    throw RangeError('Invalid baked stock black level');
}
