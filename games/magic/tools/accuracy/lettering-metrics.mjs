import { compareRegion } from './metrics.mjs';

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
