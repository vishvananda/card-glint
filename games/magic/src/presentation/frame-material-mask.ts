import type { FramePixels } from './frame-paper-mask.js';

/** Expand the native pinline selection outward only, clipped by its companion
 * frame selection. The source pack supplies panel/illustration boundaries.
 * Two sliding maxima are linear in pixel count; this runs only on cache misses. */
export function outsetFrameMask(mask: FramePixels, frame: FramePixels, radius: number): void {
  const { width, height, data } = mask;
  if (
    frame.width !== width ||
    frame.height !== height ||
    frame.data.length !== data.length ||
    !Number.isInteger(radius) ||
    radius < 0 ||
    radius > Math.max(width, height)
  )
    throw RangeError('Invalid frame material selection');
  const horizontal = new Uint8Array(width * height),
    expanded = new Uint8Array(width * height);
  const queue = new Int32Array(Math.max(width, height));
  for (const vertical of [false, true]) {
    const length = vertical ? height : width,
      lines = vertical ? width : height;
    for (let line = 0; line < lines; line++) {
      let head = 0,
        tail = 0,
        added = -1;
      const index = (v: number) => (vertical ? v * width + line : line * width + v);
      const value = (v: number) => (vertical ? horizontal[index(v)]! : data[index(v) * 4 + 3]!);
      for (let v = 0; v < length; v++) {
        const end = Math.min(length - 1, v + radius);
        while (added < end) {
          added++;
          while (tail > head && value(queue[tail - 1]!) <= value(added)) tail--;
          queue[tail++] = added;
        }
        while (head < tail && queue[head]! < v - radius) head++;
        (vertical ? expanded : horizontal)[index(v)] = value(queue[head]!);
      }
    }
  }
  for (let p = 0; p < expanded.length; p++)
    data[p * 4 + 3] = Math.max(
      data[p * 4 + 3]!,
      Math.round((expanded[p]! * frame.data[p * 4 + 3]!) / 255),
    );
}
