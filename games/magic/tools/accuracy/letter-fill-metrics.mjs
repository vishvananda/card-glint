// Comparison-only metrics. Local contrast removes additive brightness and
// normalizes multiplicative contrast; filled area is kept, not just its edge.
export function box(values, w, h, r) {
  const sum = new Float64Array((w + 1) * (h + 1));
  for (let y = 0; y < h; y++) {
    let row = 0;
    for (let x = 0; x < w; x++) {
      row += values[y * w + x];
      sum[(y + 1) * (w + 1) + x + 1] = sum[y * (w + 1) + x + 1] + row;
    }
  }
  const out = new Float32Array(values.length);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const l = Math.max(0, x - r),
        rr = Math.min(w, x + r + 1),
        t = Math.max(0, y - r),
        b = Math.min(h, y + r + 1);
      out[y * w + x] =
        (sum[b * (w + 1) + rr] -
          sum[b * (w + 1) + l] -
          sum[t * (w + 1) + rr] +
          sum[t * (w + 1) + l]) /
        ((rr - l) * (b - t));
    }
  return out;
}
export function titleShape(gray, w, h) {
  const smooth = box(gray, w, h, 1),
    mean = box(smooth, w, h, 7),
    contrast = Float32Array.from(smooth, (v, i) => v - mean[i]);
  const rms = Math.sqrt(contrast.reduce((s, v) => s + v * v, 0) / contrast.length);
  if (rms < 1e-5) return { status: 'empty' };
  const normalized = Float32Array.from(contrast, (v) => v / rms),
    ink = [-1, 1].map((sign) => Uint8Array.from(normalized, (v) => (sign * v > 0.65 ? 1 : 0)));
  const widths = ink.map((mask) => {
    let area = 0,
      perimeter = 0;
    for (let y = 1; y < h - 1; y++)
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        if (mask[i]) {
          area++;
          for (const delta of [-1, 1, -w, w]) if (!mask[i + delta]) perimeter++;
        }
      }
    return perimeter ? (2 * area) / perimeter : 0;
  });
  return { status: 'measured', normalized, ink, widths };
}
export function compareTitleShape(a, b) {
  if (a.status !== 'measured' || b.status !== 'measured')
    return { status: 'empty', contrast: 0, filledArea: 0, strokeWidthError: null };
  let dot = 0,
    aa = 0,
    bb = 0;
  for (let i = 0; i < a.normalized.length; i++) {
    const x = a.normalized[i],
      y = b.normalized[i];
    dot += x * y;
    aa += x * x;
    bb += y * y;
  }
  const dice = a.ink.map((mask, p) => {
    let overlap = 0,
      total = 0;
    for (let i = 0; i < mask.length; i++) {
      overlap += mask[i] && b.ink[p][i] ? 1 : 0;
      total += mask[i] + b.ink[p][i];
    }
    return total ? (2 * overlap) / total : 0;
  });
  return {
    status: 'measured',
    contrast: Math.max(-1, Math.min(1, dot / Math.sqrt(aa * bb))),
    filledArea: (dice[0] + dice[1]) / 2,
    strokeWidthError: a.widths.reduce((s, v, i) => s + Math.abs(v - b.widths[i]), 0) / 2,
  };
}
