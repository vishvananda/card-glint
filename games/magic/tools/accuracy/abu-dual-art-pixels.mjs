// Study-only art-aperture reflow, after color preparation and before printing.
export function reflowAbuDualArt(image, bottomUp) {
  if (!Number.isFinite(bottomUp) || bottomUp < 0 || bottomUp > 4)
    throw Error('Invalid art-height trial');
  const { width, height, data } = image;
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width < 1 ||
    height < 1 ||
    data.length !== width * height * 4
  )
    throw Error('Invalid art-height raster');
  if (bottomUp === 0) return;
  const original = data.slice(),
    sx = width / 488,
    sy = height / 680;
  const box = { left: 47, right: 441, top: 65, bottom: 384 },
    pad = 2,
    cap = 14;
  const oldMiddle = box.bottom - box.top - 2 * cap,
    newMiddle = oldMiddle - bottomUp;
  const end = box.bottom - bottomUp;
  const ease = (x) => {
    const t = Math.max(0, Math.min(1, x));
    return t * t * (3 - 2 * t);
  };
  for (let y = Math.floor(box.top * sy); y < Math.ceil(box.bottom * sy); y++) {
    const cy = (y + 0.5) / sy;
    if (cy <= box.top + cap) continue;
    const sourceY =
      cy >= end - cap
        ? cy + bottomUp
        : box.top + cap + ((cy - box.top - cap) * oldMiddle) / newMiddle;
    const source = Math.max(0, Math.min(height - 1, sourceY * sy - 0.5)),
      lo = Math.floor(source),
      hi = Math.min(height - 1, lo + 1),
      f = source - lo;
    for (let x = Math.floor(box.left * sx); x < Math.ceil(box.right * sx); x++) {
      const cx = (x + 0.5) / sx,
        w =
          ease((cx - box.left) / pad) *
          ease((box.right - cx) / pad) *
          ease((box.bottom - cy) / pad);
      if (!w) continue;
      const i = (y * width + x) * 4,
        a = (lo * width + x) * 4,
        b = (hi * width + x) * 4;
      const sampleAlpha = original[a + 3] * (1 - f) + original[b + 3] * f;
      const alpha = original[i + 3] * (1 - w) + sampleAlpha * w;
      for (let k = 0; k < 3; k++) {
        const sample =
          original[a + k] * original[a + 3] * (1 - f) + original[b + k] * original[b + 3] * f;
        data[i + k] = alpha
          ? (original[i + k] * original[i + 3] * (1 - w) + sample * w) / alpha
          : 0;
      }
      data[i + 3] = alpha;
    }
  }
}
