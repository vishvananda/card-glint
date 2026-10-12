import { inkEdges, distances } from './edges.mjs';

/** Diagnostic only. Never applies a transform or substitutes for the fixed-alignment score.
 * dx/dy describes moving rendered ink toward the reference in canonical pixels.
 * Both directions retain all edges; shifting ink out of the crop is penalized.
 */
export function componentOffset(reference, rendered, width, height, lightInk = false, radius = 10) {
  if (
    reference.length !== width * height ||
    rendered.length !== reference.length ||
    !Number.isInteger(radius) ||
    radius < 1
  )
    throw Error('Invalid component diagnostic dimensions or search radius');
  const a = inkEdges(reference, width, height, lightInk).edges;
  const b = inkEdges(rendered, width, height, lightInk).edges;
  const points = (mask) =>
    Array.from(mask.keys())
      .filter((i) => mask[i])
      .map((i) => [i % width, Math.floor(i / width)]);
  const pa = points(a),
    pb = points(b);
  if (pa.length < 5 || pb.length < 5)
    return {
      status: pa.length < 5 ? (pb.length < 5 ? 'empty' : 'missing-reference-ink') : 'missing-ink',
      rawEdgeF1: pa.length >= 5 ? 0 : null,
      diagnosticEdgeF1: null,
      referenceEdges: pa.length,
      renderedEdges: pb.length,
      dx: null,
      dy: null,
    };
  const da = distances(a, width, height),
    db = distances(b, width, height);
  function evaluate(dx, dy) {
    let hitsA = 0,
      hitsB = 0,
      sumA = 0,
      sumB = 0;
    for (const [x, y] of pa) {
      const xx = x - dx,
        yy = y - dy;
      const d = xx >= 0 && xx < width && yy >= 0 && yy < height ? db[yy * width + xx] : radius * 2;
      hitsA += d <= 1 ? 1 : 0;
      sumA += Math.min(radius * 2, d);
    }
    for (const [x, y] of pb) {
      const xx = x + dx,
        yy = y + dy;
      const d = xx >= 0 && xx < width && yy >= 0 && yy < height ? da[yy * width + xx] : radius * 2;
      hitsB += d <= 1 ? 1 : 0;
      sumB += Math.min(radius * 2, d);
    }
    const recall = hitsA / pa.length,
      precision = hitsB / pb.length;
    return {
      dx,
      dy,
      edgeF1: precision + recall ? (2 * precision * recall) / (precision + recall) : 0,
      distance: (sumA / pa.length + sumB / pb.length) / 2,
    };
  }
  const raw = evaluate(0, 0),
    candidates = [];
  for (let dy = -radius; dy <= radius; dy++)
    for (let dx = -radius; dx <= radius; dx++) candidates.push(evaluate(dx, dy));
  candidates.sort(
    (a, b) => a.distance - b.distance || Math.hypot(a.dx, a.dy) - Math.hypot(b.dx, b.dy),
  );
  const best = candidates[0];
  const alternative = candidates.find((c) => Math.hypot(c.dx - best.dx, c.dy - best.dy) > 2);
  const margin = alternative.distance - best.distance;
  const boundary = Math.abs(best.dx) === radius || Math.abs(best.dy) === radius;
  const ambiguous = margin < 0.15;
  const improvement = best.edgeF1 - raw.edgeF1;
  const status = boundary
    ? 'search-boundary'
    : ambiguous
      ? 'ambiguous'
      : best.edgeF1 < 0.65
        ? 'shape-or-content'
        : Math.hypot(best.dx, best.dy) >= 2 && improvement >= 0.08
          ? 'placement'
          : 'close';
  return {
    status,
    dx: best.dx,
    dy: best.dy,
    rawEdgeF1: raw.edgeF1,
    diagnosticEdgeF1: best.edgeF1,
    improvement,
    distance: best.distance,
    margin,
    boundary,
    ambiguous,
    referenceEdges: pa.length,
    renderedEdges: pb.length,
  };
}
