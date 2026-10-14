import { compareRegion } from './metrics.mjs';
import { distances, inkEdges } from './edges.mjs';

/** Cache the reference edges once for CPU-only placement/font sweeps. This
 * computes exactly the two-polarity one-pixel F1 used by compareLettering;
 * full distance/census diagnostics remain part of final verification. */
export function prepareLetteringEdges(gray, width, height) {
  if (gray.length !== width * height) throw Error('Metric dimensions disagree');
  return {
    width,
    height,
    polarities: [false, true].map((light) => {
      const edges = inkEdges(gray, width, height, light).edges;
      return {
        edges,
        distance: distances(edges, width, height),
        count: edges.reduce((n, v) => n + v, 0),
      };
    }),
  };
}

export function scoreLetteringEdges(reference, gray) {
  const { width, height } = reference;
  if (gray.length !== width * height) throw Error('Metric dimensions disagree');
  return reference.polarities.reduce((total, a, polarity) => {
    const b = inkEdges(gray, width, height, Boolean(polarity)).edges;
    const db = distances(b, width, height);
    let count = 0,
      forward = 0,
      reverse = 0;
    for (let i = 0; i < b.length; i++) {
      if (b[i]) {
        count++;
        if (a.distance[i] <= 1) reverse++;
      }
      if (a.edges[i] && db[i] <= 1) forward++;
    }
    if (a.count < 5 || count < 5) return total;
    const p = reverse / count,
      r = forward / a.count;
    return total + (p + r ? (2 * p * r) / (p + r) : 0) / 2;
  }, 0);
}

/** Outlined printing has both light and dark ink; neither polarity alone certifies it. */
export function compareLettering(a, b, width, height) {
  const dark = compareRegion(a, b, width, height);
  const light = compareRegion(a, b, width, height, true);
  return {
    edgeF1: ((dark.edgeF1?.[1] ?? 0) + (light.edgeF1?.[1] ?? 0)) / 2,
    darkEdgeF1: dark.edgeF1?.[1] ?? 0,
    lightEdgeF1: light.edgeF1?.[1] ?? 0,
    darkStatus: dark.status,
    lightStatus: light.status,
    meanDistance:
      dark.meanDistance == null || light.meanDistance == null
        ? null
        : (dark.meanDistance + light.meanDistance) / 2,
    censusSimilarity:
      dark.censusSimilarity == null || light.censusSimilarity == null
        ? null
        : (dark.censusSimilarity + light.censusSimilarity) / 2,
  };
}
