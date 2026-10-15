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

/** The pinned ordinary mount has a translucent pure-white glow outside its
 * colored arc. Clear only that source decoration; the opaque white pinline,
 * colored ring, black mount and complete oval (including pale logos) survive.
 * Native dimensions and the interior ellipse prevent a global white-key edit. */
export function removeStampPaperGlow(pixels: ImageData): void {
  if (pixels.width !== 192 || pixels.height !== 96) return;
  for (let y = 0; y < 52; y++) {
    for (let x = 0; x < pixels.width; x++) {
      if (((x + 0.5 - 96) / 67) ** 2 + ((y + 0.5 - 62.5) / 33.5) ** 2 <= 1.05) continue;
      const i = (y * pixels.width + x) * 4;
      if (
        pixels.data[i] === 255 &&
        pixels.data[i + 1] === 255 &&
        pixels.data[i + 2] === 255 &&
        pixels.data[i + 3]! < 255
      ) {
        pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = pixels.data[i + 3] = 0;
      }
    }
  }
}
