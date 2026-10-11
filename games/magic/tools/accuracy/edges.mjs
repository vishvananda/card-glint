export function blur(values, width, height, radius = 1) {
  const integral = new Float64Array((width + 1) * (height + 1));
  for (let y = 0; y < height; y++) {
    let row = 0;
    for (let x = 0; x < width; x++) {
      row += values[y * width + x];
      integral[(y + 1) * (width + 1) + x + 1] = integral[y * (width + 1) + x + 1] + row;
    }
  }
  const result = new Float32Array(values.length);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const l = Math.max(0, x - radius),
        r = Math.min(width, x + radius + 1);
      const t = Math.max(0, y - radius),
        b = Math.min(height, y + radius + 1),
        stride = width + 1;
      result[y * width + x] =
        (integral[b * stride + r] -
          integral[b * stride + l] -
          integral[t * stride + r] +
          integral[t * stride + l]) /
        ((r - l) * (b - t));
    }
  return result;
}

/** Local contrast suppresses scan paper/color. A fixed light blur suppresses halftone grain. */
export function inkEdges(gray, width, height, lightInk = false) {
  const smooth = blur(gray, width, height);
  const mean = blur(smooth, width, height, 7);
  const variance = blur(
    Float32Array.from(smooth, (v) => v * v),
    width,
    height,
    7,
  );
  const ink = new Uint8Array(gray.length),
    edges = new Uint8Array(gray.length);
  for (let i = 0; i < gray.length; i++) {
    const contrast = (lightInk ? 1 : -1) * (smooth[i] - mean[i]);
    ink[i] =
      contrast > Math.max(7, Math.sqrt(Math.max(0, variance[i] - mean[i] ** 2)) * 0.65) ? 1 : 0;
  }
  // Keep boundaries on the ink side. Do not remove isolated components: punctuation matters.
  for (let y = 1; y < height - 1; y++)
    for (let x = 1; x < width - 1; x++) {
      const i = y * width + x;
      edges[i] =
        ink[i] && (!ink[i - 1] || !ink[i + 1] || !ink[i - width] || !ink[i + width]) ? 1 : 0;
    }
  return { edges, ink, smooth };
}

/** Eight-neighbor chamfer distances in canonical pixels (diagonal weight sqrt(2)). */
export function distances(edges, width, height) {
  const d = Float32Array.from(edges, (v) => (v ? 0 : width + height));
  const diagonal = Math.SQRT2;
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      if (x) d[i] = Math.min(d[i], d[i - 1] + 1);
      if (y) {
        d[i] = Math.min(d[i], d[i - width] + 1);
        if (x) d[i] = Math.min(d[i], d[i - width - 1] + diagonal);
        if (x + 1 < width) d[i] = Math.min(d[i], d[i - width + 1] + diagonal);
      }
    }
  for (let y = height - 1; y >= 0; y--)
    for (let x = width - 1; x >= 0; x--) {
      const i = y * width + x;
      if (x + 1 < width) d[i] = Math.min(d[i], d[i + 1] + 1);
      if (y + 1 < height) {
        d[i] = Math.min(d[i], d[i + width] + 1);
        if (x) d[i] = Math.min(d[i], d[i + width - 1] + diagonal);
        if (x + 1 < width) d[i] = Math.min(d[i], d[i + width + 1] + diagonal);
      }
    }
  return d;
}
