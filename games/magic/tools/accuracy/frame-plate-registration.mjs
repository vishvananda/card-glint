import { scanFrameAnchors } from './scan-frame-anchors.mjs';
import { fitScanFrame } from './scan-frame-fit.mjs';
import { median, quantile } from './metrics.mjs';

// M15 has a black collector area: use the lower rules frame rather than the
// absent lower outer rail. The right end stops before P/T; the fit rejects
// stamp bumps and disagreements between these independent boundaries.
export const FRAME_PLATE_WINDOWS = Object.freeze({
  left: { axis: 'x', lo: 12, hi: 32, start: 100, step: 20, count: 24 },
  right: { axis: 'x', lo: 455, hi: 476, start: 100, step: 20, count: 24 },
  top: { axis: 'y', lo: 12, hi: 30, start: 76, step: 14, count: 26 },
  bottom: { axis: 'y', lo: 621, hi: 639, start: 60, step: 10, count: 29 },
});

/** Comparison only: one frozen baseline template, independent of all candidate
 * mana/symbol positions. Reuse the existing bounded scale/rotation/skew fitter
 * and its disjoint validation strips; rejected fits never contribute scores. */
export function framePlateRegistration(reference, template, family, border) {
  if (!['eighth', 'm15-accurate'].includes(family)) throw Error('Unknown frame plate family');
  const windows = family === 'm15-accurate' ? FRAME_PLATE_WINDOWS : undefined;
  const anchors = scanFrameAnchors(template, border, windows);
  const sides = Object.fromEntries(
    ['left', 'right', 'top', 'bottom'].map((side) => {
      const values = anchors.points
        .filter((p) => p.side === side)
        .map((p) => (side === 'left' || side === 'right' ? p.x : p.y));
      const position = median(values),
        spread = quantile(
          values.map((v) => Math.abs(v - position)),
          0.9,
        );
      return [
        side,
        { position, spread, count: values.length, reliable: values.length >= 16 && spread < 0.8 },
      ];
    }),
  );
  const target = { reliable: Object.values(sides).every((s) => s.reliable), sides };
  return { target, ...fitScanFrame(scanFrameAnchors(reference, border, windows), target) };
}
