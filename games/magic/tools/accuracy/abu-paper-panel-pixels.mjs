// Study-only vertical panel reflow, run on an already prepared static material.
// Canonical coordinates are 488x680; the outer band keeps its physical width.
export function reflowAbuPaperPanel(image, options) {
  if (!options || options.bottomUp === 0) return;
  const { bottomUp, pad = 2 } = options;
  if (
    !Number.isFinite(bottomUp) ||
    bottomUp < 0 ||
    bottomUp > 12 ||
    !Number.isFinite(pad) ||
    pad < 1 ||
    pad > 4
  )
    throw Error('Invalid paper-panel trial');
  const { width, height, data } = image;
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width < 1 ||
    height < 1 ||
    data.length !== width * height * 4
  )
    throw Error('Invalid paper-panel raster');
  const scaleX = width / 488,
    scaleY = height / 680;
  const box = {
    left: 61.063333333333325 - pad,
    right: 427.9656666666666 + pad,
    top: 404.6309523809524 - pad,
    bottom: 606.325 + pad,
  };
  const cap = 6.375 + pad + 0.5,
    newBottom = box.bottom - bottomUp;
  const oldMiddle = box.bottom - box.top - 2 * cap,
    newMiddle = oldMiddle - bottomUp;
  const original = data.slice();
  const ease = (v) => {
    const t = Math.max(0, Math.min(1, v));
    return t * t * (3 - 2 * t);
  };
  for (
    let y = Math.max(0, Math.floor(box.top * scaleY));
    y < Math.min(height, Math.ceil(box.bottom * scaleY));
    y++
  ) {
    const cy = (y + 0.5) / scaleY;
    let sy = cy;
    if (cy >= newBottom) sy = cy + bottomUp;
    else if (cy >= newBottom - cap) sy = cy + bottomUp;
    else if (cy > box.top + cap)
      sy = box.top + cap + ((cy - box.top - cap) * oldMiddle) / newMiddle;
    const source = Math.max(0, Math.min(height - 1, sy * scaleY - 0.5)),
      lo = Math.floor(source),
      hi = Math.min(height - 1, lo + 1),
      fy = source - lo;
    for (
      let x = Math.max(0, Math.floor(box.left * scaleX));
      x < Math.min(width, Math.ceil(box.right * scaleX));
      x++
    ) {
      const cx = (x + 0.5) / scaleX;
      const weight =
        ease((cx - box.left) / pad) * ease((box.right - cx) / pad) * ease((box.bottom - cy) / pad);
      if (!weight) continue;
      const i = (y * width + x) * 4,
        a = (lo * width + x) * 4,
        b = (hi * width + x) * 4;
      for (let k = 0; k < 3; k++) {
        const sample = original[a + k] * (1 - fy) + original[b + k] * fy;
        data[i + k] = original[i + k] * (1 - weight) + sample * weight;
      }
      // Retain exact coverage; paper stock is not a silhouette operation.
    }
  }
}
