// Diagnostic outer-disc measurement. Sample a narrow perimeter, not the glyph
// or the mean of its interior. Keep this separate from whole-region scoring.
export function outerManaCircle(
  image,
  { x = 185, y = 32, range = 3, radiusRange = [10.5, 13.5] } = {},
) {
  const gray = Float32Array.from({ length: image.width * image.height }, (_, i) => {
    const p = i * 4;
    return 0.2126 * image.data[p] + 0.7152 * image.data[p + 1] + 0.0722 * image.data[p + 2];
  });
  const sample = (x, y) => {
    const ix = Math.floor(x),
      iy = Math.floor(y),
      fx = x - ix,
      fy = y - iy,
      p = iy * image.width + ix;
    return (
      (gray[p] * (1 - fx) + gray[p + 1] * fx) * (1 - fy) +
      (gray[p + image.width] * (1 - fx) + gray[p + image.width + 1] * fx) * fy
    );
  };
  const rays = Array.from({ length: 96 }, (_, i) => {
    const a = ((i + 0.5) * Math.PI) / 48;
    return [Math.cos(a), Math.sin(a)];
  });
  function quality(cx, cy, r) {
    const sectors = Array(12).fill(0);
    for (let i = 0; i < rays.length; i++) {
      const [dx, dy] = rays[i];
      sectors[Math.floor(i / 8)] +=
        (sample(cx + dx * (r - 0.55), cy + dy * (r - 0.55)) -
          sample(cx + dx * (r + 0.55), cy + dy * (r + 0.55))) /
        8;
    }
    sectors.sort((a, b) => a - b);
    return (0.75 * sectors.slice(3, 9).reduce((a, b) => a + b, 0)) / 6 + 0.25 * sectors[3];
  }
  function search(cx, cy, r, xyRange, rRange, step) {
    let best = { score: -Infinity };
    for (let dy = -xyRange; dy <= xyRange + 1e-6; dy += step)
      for (let dx = -xyRange; dx <= xyRange + 1e-6; dx += step)
        for (let dr = -rRange; dr <= rRange + 1e-6; dr += step) {
          const score = quality(cx + dx, cy + dy, r + dr);
          if (score > best.score) best = { x: cx + dx, y: cy + dy, radius: r + dr, score };
        }
    return best;
  }
  const coarse = search(
    x,
    y,
    (radiusRange[0] + radiusRange[1]) / 2,
    range,
    (radiusRange[1] - radiusRange[0]) / 2,
    0.5,
  );
  const best = search(coarse.x, coarse.y, coarse.radius, 0.5, 0.5, 0.125);
  return {
    ...best,
    status:
      Math.abs(best.x - x) >= range ||
      Math.abs(best.y - y) >= range ||
      best.radius <= radiusRange[0] ||
      best.radius >= radiusRange[1]
        ? 'search-boundary'
        : best.score < 3
          ? 'weak-edge'
          : 'measured',
  };
}
