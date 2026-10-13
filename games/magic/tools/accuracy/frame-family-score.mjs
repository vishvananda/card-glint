import { median } from './metrics.mjs';
import { profileSimilarity, PROFILE_WINDOWS } from './frame-family-metrics.mjs';
export const FAMILY_SCORE_VERSION = 'old-family-opaque-profiles-v3';
/** The same opaque support is used for every family. Erosion covers profile
 * smoothing and small scan-registration uncertainty. Art pixels never score. */
export function opaqueSupport(plates) {
  return Object.fromEntries(
    Object.entries(PROFILE_WINDOWS).map(([name, w]) => {
      if (!name.startsWith('art')) return [name, [0, w.hi - w.lo + 1]];
      const safe = [];
      for (let p = w.lo; p <= w.hi; p++) {
        let opaque = true;
        for (const image of plates)
          for (const along of w.along)
            for (let a = along - 17; a <= along + 17 && opaque; a++)
              for (let d = -2; d <= 2; d++) {
                const x = w.axis === 'x' ? p + d : a;
                const y = w.axis === 'y' ? p + d : a;
                if (image.data[(y * image.width + x) * 4 + 3] < 254) {
                  opaque = false;
                  break;
                }
              }
        safe.push(opaque);
      }
      const reverse = name.endsWith('Right') || name.endsWith('Bottom');
      let n = 0;
      while (n < safe.length && safe[reverse ? safe.length - 1 - n : n]) n++;
      return [name, reverse ? [safe.length - n, safe.length] : [0, n]];
    }),
  );
}
export function scoreOpaqueFamily(reference, candidate, support) {
  const regions = Object.fromEntries(
    Object.entries(support).map(([name, [lo, hi]]) => {
      const samples = reference[name].flatMap((a, i) => {
        if (hi - lo < 5) return [];
        const r = a.slice(lo, hi),
          c = candidate[name][i].slice(lo, hi);
        if (profileSimilarity(r, r).score === null) return [];
        const s = profileSimilarity(r, c);
        return [{ score: s.score ?? 0, missing: s.score === null }];
      });
      return [
        name,
        {
          score: samples.length >= 2 ? median(samples.map((s) => s.score)) : null,
          referenceSamples: samples.length,
          candidateMissing: samples.filter((s) => s.missing).length,
        },
      ];
    }),
  );
  const valid = Object.values(regions).filter((r) => r.score !== null);
  return {
    score: valid.length >= 6 ? valid.reduce((n, r) => n + r.score, 0) / valid.length : null,
    validRegions: valid.length,
    regions,
  };
}
