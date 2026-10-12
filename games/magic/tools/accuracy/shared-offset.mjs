import { median } from './metrics.mjs';

/** Compare the same displacement across a development cohort; never fit each scan. */
export function sharedOffset(reports) {
  if (reports.length < 3) throw Error('Shared placement needs at least three measured examples');
  const grids = reports.map((r) => {
    if (!Number.isFinite(r.rawEdgeF1) || !r.surface?.length)
      throw Error('Shared placement requires complete measured search surfaces');
    const grid = new Map(r.surface.map((c) => [`${c.dx},${c.dy}`, c]));
    if (grid.size !== r.surface.length) throw Error('Duplicate search offsets');
    return grid;
  });
  const candidates = reports[0].surface.map(({ dx, dy }) => {
    const cells = grids.map((grid) => grid.get(`${dx},${dy}`));
    if (cells.some((c) => !c || !Number.isFinite(c.edgeF1) || !Number.isFinite(c.distance)))
      throw Error('Incompatible search surfaces');
    const deltas = cells.map((c, i) => c.edgeF1 - reports[i].rawEdgeF1);
    return {
      dx,
      dy,
      medianEdgeF1: median(cells.map((c) => c.edgeF1)),
      medianDistance: median(cells.map((c) => c.distance)),
      medianDelta: median(deltas),
      improved: deltas.filter((d) => d > 0.02).length,
      regressed: deltas.filter((d) => d < -0.02).length,
      worstDelta: Math.min(...deltas),
    };
  });
  if (grids.some((grid) => grid.size !== candidates.length))
    throw Error('Incompatible search extents');
  candidates.sort(
    (a, b) =>
      b.medianEdgeF1 - a.medianEdgeF1 ||
      a.medianDistance - b.medianDistance ||
      Math.hypot(a.dx, a.dy) - Math.hypot(b.dx, b.dy),
  );
  return {
    count: reports.length,
    rawMedian: median(reports.map((r) => r.rawEdgeF1)),
    candidate: candidates[0],
    candidates,
    note: 'Diagnostic foreground translations only. Confirm the candidate with production renders and fixed scores; retain every regression and inspect foreground contamination.',
  };
}
