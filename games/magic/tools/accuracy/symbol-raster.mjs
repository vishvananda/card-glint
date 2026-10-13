/** Analysis-only cached-stencil sampler. No browser, fonts or runtime readback.
 * Two-by-two supersampling approximates Canvas for candidate ranking; the final
 * decision must use fresh production captures, not this approximation's score. */
export function symbolRaster(stencil, crop, width, height, outline, ink, backing = null) {
  const pad = Math.ceil(outline + 2),
    w = Math.ceil((width + pad * 2) * 2),
    h = Math.ceil((height + pad * 2) * 2);
  const alpha = new Float32Array(w * h),
    premultiplied = new Float32Array(w * h);
  const sample = (x, y, source = stencil) => {
    if (x < 0 || y < 0 || x > width || y > height) return 0;
    const sx = (crop[0] + (x / width) * crop[2]) * source.width - 0.5,
      sy = (crop[1] + (y / height) * crop[3]) * source.height - 0.5;
    const left = Math.floor(sx),
      top = Math.floor(sy),
      fx = sx - left,
      fy = sy - top;
    const at = (xx, yy) =>
      xx < 0 || yy < 0 || xx >= source.width || yy >= source.height
        ? 0
        : source.data[(yy * source.width + xx) * 4 + 3] / 255;
    return (
      (at(left, top) * (1 - fx) + at(left + 1, top) * fx) * (1 - fy) +
      (at(left, top + 1) * (1 - fx) + at(left + 1, top + 1) * fx) * fy
    );
  };
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const xx = (x + 0.5) / 2 - pad,
        yy = (y + 0.5) / 2 - pad,
        a = sample(xx, yy);
      let white = backing ? sample(xx, yy, backing) : 0;
      if (outline)
        for (let i = 0; i < 16; i++) {
          const angle = (i * Math.PI) / 8;
          white =
            1 -
            (1 - white) *
              (1 - sample(xx - Math.cos(angle) * outline, yy - Math.sin(angle) * outline));
        }
      const index = y * w + x;
      alpha[index] = a + white * (1 - a);
      premultiplied[index] = ink * a + 255 * white * (1 - a);
    }
  return { width: w, height: h, alpha, premultiplied, pad };
}

export function stampSymbol(background, rect, tile, { right, centerY, width, height }) {
  const [rx, ry, rw, rh] = rect,
    result = Float32Array.from(background),
    left = right - width - tile.pad,
    top = centerY - height / 2 - tile.pad;
  // All searched placements use half-pixel units, matching the 2x tile lattice.
  for (
    let y = Math.max(0, Math.floor(top - ry));
    y < Math.min(rh, Math.ceil(top + tile.height / 2 - ry));
    y++
  )
    for (
      let x = Math.max(0, Math.floor(left - rx));
      x < Math.min(rw, Math.ceil(left + tile.width / 2 - rx));
      x++
    ) {
      let total = 0;
      for (let sy = 0; sy < 2; sy++)
        for (let sx = 0; sx < 2; sx++) {
          const tx = Math.round((rx + x - left) * 2 + sx),
            ty = Math.round((ry + y - top) * 2 + sy),
            i = ty * tile.width + tx;
          total +=
            tx >= 0 && ty >= 0 && tx < tile.width && ty < tile.height
              ? tile.premultiplied[i] + background[y * rw + x] * (1 - tile.alpha[i])
              : background[y * rw + x];
        }
      result[y * rw + x] = total / 4;
    }
  return result;
}
