import { WIDTH, HEIGHT } from './pixels-pure.mjs';
import { SCAN_ANCHOR_WINDOWS } from './scan-frame-anchors.mjs';

export const ABU_ANCHOR_VERSION = 'abu-coherent-outer-print-v1';
/** Analysis-only ABU detector. A coherent outer print boundary is selected from
 * fit strips; independent validation strips may reject it. No card content,
 * renderer pixels or learned per-card parameters enter the boundary search. */
export function abuFrameAnchors(image) {
  if (image.width !== WIDTH || image.height !== HEIGHT) throw Error('Expected canonical image');
  const points = [],
    rejected = [],
    rails = {};
  for (const [side, spec] of Object.entries(SCAN_ANCHOR_WINDOWS)) {
    const { axis, lo, hi, start, step, count } = spec;
    const sign = side === 'left' || side === 'top' ? 1 : -1;
    const samples = Array.from({ length: count }, (_, index) => {
      const along = start + step * index,
        channels = [[], [], []];
      for (let p = lo - 3; p <= hi + 3; p++)
        for (let c = 0; c < 3; c++) {
          let sum = 0;
          for (let k = along - 5; k <= along + 5; k++) {
            const q = ((axis === 'x' ? k : p) * WIDTH + (axis === 'x' ? p : k)) * 4;
            sum += image.data[q + c];
          }
          channels[c].push(sum / 11);
        }
      const smooth = channels.map((v) =>
        v.map((n, i) => (v[Math.max(0, i - 1)] + 2 * n + v[Math.min(v.length - 1, i + 1)]) / 4),
      );
      const gradients = [];
      for (let i = 3; i < channels[0].length - 3; i++)
        gradients.push(Math.max(...smooth.map((v) => sign * (v[i + 2] - v[i - 2]))));
      const peaks = gradients.flatMap((v, i) => {
        if (
          i === 0 ||
          i === gradients.length - 1 ||
          v < 3 ||
          v <= gradients[i - 1] ||
          v < gradients[i + 1]
        )
          return [];
        const offset =
          (gradients[i - 1] - gradients[i + 1]) /
          (2 * (gradients[i - 1] - 2 * v + gradients[i + 1]));
        return [{ position: lo + i + offset, strength: v }];
      });
      return { side, index, cohort: index % 2 ? 'validation' : 'fit', along, peaks };
    });
    const fit = samples.filter((s) => s.cohort === 'fit'),
      center = start + (step * (count - 1)) / 2,
      candidates = [];
    for (let n = -20; n <= 20; n++) {
      const slope = n / 1000,
        bins = new Set(
          fit.flatMap((s) =>
            s.peaks.map((p) => Math.round((p.position - slope * (s.along - center)) * 2) / 2),
          ),
        );
      for (const position of bins) {
        const near = fit
          .map((s) => ({
            sample: s,
            peak: s.peaks
              .filter((p) => Math.abs(p.position - position - slope * (s.along - center)) <= 0.75)
              .sort(
                (a, b) =>
                  Math.abs(a.position - position - slope * (s.along - center)) -
                  Math.abs(b.position - position - slope * (s.along - center)),
              )[0],
          }))
          .filter((s) => s.peak);
        const span = near.length
          ? Math.max(...near.map((s) => s.sample.along)) -
            Math.min(...near.map((s) => s.sample.along))
          : 0;
        if (near.length < 9 || span < (axis === 'x' ? 300 : 210)) continue;
        const error =
          near.reduce(
            (sum, { sample: s, peak: p }) =>
              sum + (p.position - position - slope * (s.along - center)) ** 2,
            0,
          ) / near.length;
        candidates.push({ position, slope, support: near.length, error });
      }
    }
    // The secondary inner border and texture can be stronger than the true
    // boundary. Choose the outermost well-supported rail, not the biggest edge.
    candidates.sort(
      (a, b) => sign * (a.position - b.position) || b.support - a.support || a.error - b.error,
    );
    let rail = candidates[0];
    if (rail)
      for (let pass = 0; pass < 3; pass++) {
        const near = fit.flatMap((s) => {
          const expected = rail.position + rail.slope * (s.along - center),
            peak = s.peaks
              .filter((p) => Math.abs(p.position - expected) <= 1.25)
              .sort((a, b) => Math.abs(a.position - expected) - Math.abs(b.position - expected))[0];
          return peak ? [{ x: s.along - center, y: peak.position }] : [];
        });
        let xx = 0,
          xy = 0,
          x = 0,
          y = 0;
        for (const p of near) {
          xx += p.x * p.x;
          xy += p.x * p.y;
          x += p.x;
          y += p.y;
        }
        const det = near.length * xx - x * x;
        if (det <= 0) break;
        const slope = (near.length * xy - x * y) / det,
          position = (y - slope * x) / near.length;
        rail = { ...rail, position, slope, support: near.length };
      }
    rails[side] = rail ?? null;
    for (const sample of samples) {
      const { peaks, ...identity } = sample;
      if (!rail) {
        rejected.push({ ...identity, reason: 'no-coherent-outer-boundary' });
        continue;
      }
      const expected = rail.position + rail.slope * (sample.along - center),
        peak = peaks
          .filter((p) => Math.abs(p.position - expected) <= 1.25)
          .sort((a, b) => Math.abs(a.position - expected) - Math.abs(b.position - expected))[0];
      if (!peak) {
        rejected.push({ ...identity, reason: 'boundary-disagreement' });
        continue;
      }
      points.push({
        ...identity,
        x: axis === 'x' ? peak.position : sample.along,
        y: axis === 'x' ? sample.along : peak.position,
        strength: peak.strength,
      });
    }
  }
  return { version: ABU_ANCHOR_VERSION, points, rejected, rails };
}
