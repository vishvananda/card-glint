// A modern disc can be darker OR lighter than its name panel. Use RGB
// perimeter contrast, not the signed light-inside contrast of ABU symbols.
export function modernManaCircle(
  image,
  { x, y, range = 3, radiusRange = [9, 14], paper: prior, rayMask, rayThresholds } = {},
) {
  if (
    !Number.isFinite(x) ||
    !Number.isFinite(y) ||
    !Number.isFinite(range) ||
    range <= 0 ||
    radiusRange.length !== 2 ||
    !radiusRange.every(Number.isFinite) ||
    radiusRange[0] <= 1 ||
    radiusRange[0] >= radiusRange[1] ||
    (prior &&
      (prior.length !== 3 || !prior.every((v) => Number.isFinite(v) && v >= 0 && v <= 255))) ||
    image.data.length !== image.width * image.height * 4
  )
    throw Error('Invalid modern mana circle search');
  const reach = range + radiusRange[1] + 2;
  if (
    x - reach < 0 ||
    y - reach < 0 ||
    x + reach >= image.width - 1 ||
    y + reach >= image.height - 1
  )
    throw Error('Modern mana perimeter leaves its crop');
  const samples = [];
  for (let py = Math.ceil(y - radiusRange[0] * 0.6); py <= y + radiusRange[0] * 0.6; py++)
    for (let px = Math.ceil(x - radiusRange[0] * 0.6); px <= x + radiusRange[0] * 0.6; px++)
      if (Math.hypot(px - x, py - y) <= radiusRange[0] * 0.6) {
        const at = (py * image.width + px) * 4;
        samples.push([image.data[at], image.data[at + 1], image.data[at + 2]]);
      }
  const sorted = samples.map((p) => Math.max(...p)).sort((a, b) => a - b);
  const cutoff = sorted[Math.floor((sorted.length - 1) * 0.98)] * 0.55;
  const paperSamples = samples.filter((p) => Math.max(...p) >= cutoff);
  const middle = (values) => {
    values.sort((a, b) => a - b);
    return (
      (values[Math.floor((values.length - 1) / 2)] + values[Math.ceil((values.length - 1) / 2)]) / 2
    );
  };
  const paper = prior ?? [0, 1, 2].map((c) => middle(paperSamples.map((p) => p[c])));
  const distance = Float32Array.from(
    { length: image.width * image.height },
    (_, i) =>
      Math.hypot(
        image.data[i * 4] - paper[0],
        image.data[i * 4 + 1] - paper[1],
        image.data[i * 4 + 2] - paper[2],
      ) / Math.sqrt(3),
  );
  const sample = (x, y) => {
    const ix = Math.floor(x),
      iy = Math.floor(y),
      fx = x - ix,
      fy = y - iy,
      at = iy * image.width + ix;
    return (
      (distance[at] * (1 - fx) + distance[at + 1] * fx) * (1 - fy) +
      (distance[at + image.width] * (1 - fx) + distance[at + image.width + 1] * fx) * fy
    );
  };
  const rays = Array.from({ length: 96 }, (_, i) => {
    const angle = ((i + 0.5) * Math.PI) / 48;
    return [Math.cos(angle), Math.sin(angle)];
  });
  if (rayMask && (rayMask.length !== 96 || !rayMask.every((v) => typeof v === 'boolean')))
    throw Error('Invalid semantic mana ray mask');
  if (
    rayThresholds &&
    (rayThresholds.length !== 96 || !rayThresholds.every((v) => Number.isFinite(v) && v > 0))
  )
    throw Error('Invalid semantic mana edge thresholds');
  const counts = Array.from({ length: 12 }, (_, sector) =>
    rays
      .slice(sector * 8, sector * 8 + 8)
      .reduce((n, _, j) => n + Number(!rayMask || rayMask[sector * 8 + j]), 0),
  );
  const usableSectors = counts.filter((n) => n >= 2).length;
  if (usableSectors < 8)
    return {
      x,
      y,
      radius: (radiusRange[0] + radiusRange[1]) / 2,
      score: 0,
      paper,
      status: 'insufficient-source-arcs',
      usableSectors,
    };
  const quality = (cx, cy, radius) => {
    const sectors = Array(12).fill(0);
    for (let i = 0; i < rays.length; i++) {
      if (rayMask && !rayMask[i]) continue;
      const [dx, dy] = rays[i];
      // Moving out of the disc should move away from its paper color.
      // A dark drop shadow's *outer* edge does the reverse and is rejected.
      const contrast = Math.max(
        0,
        sample(cx + dx * (radius + 0.65), cy + dy * (radius + 0.65)) -
          sample(cx + dx * (radius - 0.65), cy + dy * (radius - 0.65)),
      );
      const relative = contrast / (rayThresholds?.[i] ?? 12);
      const coverage = (32 * relative) / (1 + relative);
      sectors[Math.floor(i / 8)] += coverage / counts[Math.floor(i / 8)];
    }
    const measured = sectors.filter((_, i) => counts[i] >= 2).sort((a, b) => a - b);
    const lo = Math.floor(measured.length * 0.15),
      hi = measured.length - Math.floor(measured.length * 0.2);
    return (
      (0.75 * measured.slice(lo, hi).reduce((n, v) => n + v, 0)) / (hi - lo) + 0.25 * measured[lo]
    );
  };
  const search = (cx, cy, r, xyRange, rRange, step) => {
    let best = { score: -Infinity };
    for (let dy = -xyRange; dy <= xyRange + 1e-6; dy += step)
      for (let dx = -xyRange; dx <= xyRange + 1e-6; dx += step)
        for (let dr = -rRange; dr <= rRange + 1e-6; dr += step) {
          const score = quality(cx + dx, cy + dy, r + dr);
          if (score > best.score) best = { x: cx + dx, y: cy + dy, radius: r + dr, score };
        }
    return best;
  };
  const mid = (radiusRange[0] + radiusRange[1]) / 2;
  const coarse = search(x, y, mid, range, (radiusRange[1] - radiusRange[0]) / 2, 0.5);
  const best = search(coarse.x, coarse.y, coarse.radius, 0.5, 0.5, 0.125);
  return {
    ...best,
    paper,
    paperSamples: paperSamples.length,
    status:
      best.score < 3 || Math.max(...paper) < 64
        ? 'weak-edge'
        : Math.abs(best.x - x) >= range ||
            Math.abs(best.y - y) >= range ||
            best.radius <= radiusRange[0] ||
            best.radius >= radiusRange[1]
          ? 'search-boundary'
          : 'measured',
  };
}

/** Native geometry supplies the semantic paper arcs. Neither a glyph's
 * internal outline nor a drop shadow is a valid substitute for a disc edge. */
export function modernManaRayTemplate(image, { x, y, radius, paper }) {
  const sample = (px, py) => {
    const ix = Math.floor(px),
      iy = Math.floor(py),
      fx = px - ix,
      fy = py - iy;
    const value = (c) => {
      const at = (iy * image.width + ix) * 4 + c;
      return (
        (image.data[at] * (1 - fx) + image.data[at + 4] * fx) * (1 - fy) +
        (image.data[at + image.width * 4] * (1 - fx) + image.data[at + image.width * 4 + 4] * fx) *
          fy
      );
    };
    return Math.hypot(...paper.map((v, c) => value(c) - v)) / Math.sqrt(3);
  };
  const samples = Array.from({ length: 96 }, (_, i) => {
    const angle = ((i + 0.5) * Math.PI) / 48,
      dx = Math.cos(angle),
      dy = Math.sin(angle);
    const inside = sample(x + dx * (radius - 0.8), y + dy * (radius - 0.8)),
      outside = sample(x + dx * (radius + 0.8), y + dy * (radius + 0.8));
    return {
      visible: inside <= 25 && outside - inside >= 4,
      threshold: Math.max(4, (outside - inside) * 0.65),
    };
  });
  return { mask: samples.map((s) => s.visible), thresholds: samples.map((s) => s.threshold) };
}
