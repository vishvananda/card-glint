import { distances, inkEdges } from './edges.mjs';

export const METRIC_VERSION = 'structural-v2';
export const median = (values) => quantile(values, 0.5);
export function quantile(values, q) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b),
    p = (sorted.length - 1) * q;
  return sorted[Math.floor(p)] * (1 - (p % 1)) + sorted[Math.ceil(p)] * (p % 1);
}

export function compareRegion(reference, rendered, width, height, lightInk = false) {
  if (reference.length !== width * height || rendered.length !== reference.length)
    throw Error('Metric dimensions disagree');
  const a = inkEdges(reference, width, height, lightInk),
    b = inkEdges(rendered, width, height, lightInk);
  const da = distances(a.edges, width, height),
    db = distances(b.edges, width, height);
  const forward = [],
    reverse = [];
  for (let i = 0; i < a.edges.length; i++) {
    if (a.edges[i]) forward.push(db[i]);
    if (b.edges[i]) reverse.push(da[i]);
  }
  if (forward.length < 5 && reverse.length < 5)
    return { status: 'empty', referenceEdges: forward.length, renderedEdges: reverse.length };
  if (forward.length < 5 || reverse.length < 5)
    return {
      status: 'missing-ink',
      referenceEdges: forward.length,
      renderedEdges: reverse.length,
      edgeF1: [0, 0, 0],
      meanDistance: null,
      p95Distance: null,
      censusSimilarity: 0,
      geometry: {
        reference: geometry(a.ink, width, height),
        rendered: geometry(b.ink, width, height),
      },
    };
  const precision = [0, 1, 2].map((t) => reverse.filter((v) => v <= t).length / reverse.length);
  const recall = [0, 1, 2].map((t) => forward.filter((v) => v <= t).length / forward.length);
  const edgeF1 = precision.map((p, i) =>
    p + recall[i] ? (2 * p * recall[i]) / (p + recall[i]) : 0,
  );
  const mean = (values) => values.reduce((a, b) => a + b, 0) / values.length;
  return {
    status: 'measured',
    referenceEdges: forward.length,
    renderedEdges: reverse.length,
    edgeF1,
    precision,
    recall,
    meanDistance: (mean(forward) + mean(reverse)) / 2,
    p95Distance: Math.max(quantile(forward, 0.95), quantile(reverse, 0.95)),
    censusSimilarity: census(a.smooth, b.smooth, da, width, height),
    geometry: {
      reference: geometry(a.ink, width, height),
      rendered: geometry(b.ink, width, height),
    },
  };
}

function census(a, b, distance, width, height) {
  let compared = 0,
    matching = 0;
  for (let y = 2; y < height - 2; y++)
    for (let x = 2; x < width - 2; x++) {
      const i = y * width + x;
      if (distance[i] > 2) continue;
      for (let dy = -2; dy <= 2; dy++)
        for (let dx = -2; dx <= 2; dx++) {
          if (!dx && !dy) continue;
          const j = i + dy * width + dx;
          // Ignore tied/noisy reference comparisons; confidence cannot depend on candidate ink.
          if (Math.abs(a[i] - a[j]) < 8) continue;
          compared++;
          if (a[i] > a[j] === b[i] > b[j]) matching++;
        }
    }
  return compared ? matching / compared : null;
}

function geometry(ink, width, height) {
  let left = width,
    right = -1,
    top = height,
    bottom = -1;
  const rows = new Uint32Array(height);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++)
      if (ink[y * width + x]) {
        rows[y]++;
        left = Math.min(left, x);
        right = Math.max(right, x);
        top = Math.min(top, y);
        bottom = Math.max(bottom, y);
      }
  const bands = [];
  let start = -1;
  for (let y = 0; y <= height; y++) {
    const active = y < height && rows[y] >= Math.max(2, width * 0.008);
    if (active && start < 0) start = y;
    if (!active && start >= 0) {
      if (y - start >= 2) bands.push([start, y - 1]);
      start = -1;
    }
  }
  return {
    bounds: right < 0 ? null : [left, top, right - left + 1, bottom - top + 1],
    inkBands: bands,
  };
}
