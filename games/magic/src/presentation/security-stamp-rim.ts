/** Blend source mounts with premultiplied alpha, preserving their common oval
 * artwork and silhouette. Only the colored pinlines differ between sources.
 * This runs once in the bounded material cache, never during animation. */
export function blendStampRim(left: ImageData, right: ImageData) {
  if (left.width !== right.width || left.height !== right.height)
    throw Error('Stamp palette dimensions differ.');
  for (let y = 0; y < left.height; y++) {
    for (let x = 0; x < left.width; x++) {
      const i = (y * left.width + x) * 4;
      const weight = Math.max(0, Math.min(1, ((x + 0.5) / left.width - 0.35) / 0.3));
      const a = left.data[i + 3]! * (1 - weight),
        b = right.data[i + 3]! * weight;
      const alpha = a + b;
      for (let channel = 0; channel < 3; channel++)
        left.data[i + channel] = alpha
          ? (left.data[i + channel]! * a + right.data[i + channel]! * b) / alpha
          : 0;
      left.data[i + 3] = alpha;
    }
  }
}
