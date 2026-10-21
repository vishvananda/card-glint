// Registration signal only: a linear projection of encoded RGB, not a
// linear-light color conversion. Read no pixels outside the reviewed strip.
export const RGB_PCA_CHANNEL = 'RGB-PCA-strip-before-native-frame-filter-v1';
export const RGB_PCA_FILTER = 'native-grid-gaussian-0.4-f32-frame-only-v4';
export function stripRgbAxis(image, rect) {
  const sum = [0, 0, 0],
    second = Array.from({ length: 3 }, () => [0, 0, 0]);
  let count = 0;
  for (let y = rect[1]; y <= rect[3]; y++)
    for (let x = rect[0]; x <= rect[2]; x++) {
      const at = (y * image.width + x) * 4,
        rgb = [image.data[at], image.data[at + 1], image.data[at + 2]];
      count++;
      for (let a = 0; a < 3; a++) {
        sum[a] += rgb[a];
        for (let b = 0; b < 3; b++) second[a][b] += rgb[a] * rgb[b];
      }
    }
  const cov = second.map((row, a) => row.map((v, b) => v / count - (sum[a] * sum[b]) / count ** 2));
  const pivot = [0, 1, 2].sort((a, b) => cov[b][b] - cov[a][a])[0];
  let axis = cov.map((row) => row[pivot]);
  for (let i = 0; i < 64; i++) {
    const next = cov.map((row) => row.reduce((n, v, j) => n + v * axis[j], 0)),
      norm = Math.hypot(...next);
    if (norm < 1e-12) return [1 / Math.sqrt(3), 1 / Math.sqrt(3), 1 / Math.sqrt(3)];
    axis = next.map((v) => v / norm);
  }
  if (axis.reduce((a, b) => a + b, 0) < 0) axis = axis.map((v) => -v);
  return axis;
}
