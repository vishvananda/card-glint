// Cached counterpart of the audited perimeter observer. Scores use the same
// source-only semantic arcs; one distance field serves every parameter trial.
export function createModernManaObjective(image, { paper, mask, thresholds }) {
  if (
    image.data.length !== image.width * image.height * 4 ||
    paper.length !== 3 ||
    !paper.every((v) => Number.isFinite(v) && v >= 0 && v <= 255) ||
    mask.length !== 96 ||
    !mask.every((v) => typeof v === 'boolean') ||
    thresholds.length !== 96 ||
    !thresholds.every((v) => Number.isFinite(v) && v > 0)
  )
    throw Error('Invalid cached mana perimeter objective');
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
  const counts = Array.from({ length: 12 }, (_, sector) =>
    rays.slice(sector * 8, sector * 8 + 8).reduce((n, _, j) => n + Number(mask[sector * 8 + j]), 0),
  );
  const usableSectors = counts.filter((n) => n >= 2).length;
  const score = (cx, cy, radius) => {
    if (
      !Number.isFinite(cx) ||
      !Number.isFinite(cy) ||
      !Number.isFinite(radius) ||
      radius <= 1 ||
      cx - radius - 0.65 < 0 ||
      cy - radius - 0.65 < 0 ||
      cx + radius + 0.65 >= image.width - 1 ||
      cy + radius + 0.65 >= image.height - 1
    )
      throw Error('Mana candidate leaves its fixed crop');
    if (usableSectors < 8) return 0;
    const sectors = Array(12).fill(0);
    for (let i = 0; i < rays.length; i++) {
      if (!mask[i]) continue;
      const [dx, dy] = rays[i];
      const contrast = Math.max(
        0,
        sample(cx + dx * (radius + 0.65), cy + dy * (radius + 0.65)) -
          sample(cx + dx * (radius - 0.65), cy + dy * (radius - 0.65)),
      );
      const relative = contrast / (thresholds[i] ?? 12);
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
  return { score, usableSectors };
}

/** Physical coordinates decouple radius from group anchoring and pitch. */
export function manaCandidateCircle(disc, { diameter = 0, pitch = 0, dx = 0, dy = 0 }) {
  return {
    x: disc.x + dx - disc.fromRight * pitch,
    y: disc.y + dy,
    radius: disc.radius + diameter / 2,
  };
}
export function manaCandidateControls(candidate, { size, gap, scale }) {
  const nextScale = scale + candidate.diameter / size;
  return {
    scaleX: nextScale,
    scaleY: nextScale,
    spacing: ((size + gap) * scale + candidate.pitch) / nextScale - size - gap,
    dx: candidate.dx - (size / 2) * (scale - nextScale),
    dy: candidate.dy,
  };
}
