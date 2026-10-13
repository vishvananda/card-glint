import { scanFrameAnchors } from './scan-frame-anchors.mjs';
import { fitScanFrame } from './scan-frame-fit.mjs';
import { fitAffineScan } from './scan-affine-fit.mjs';
import { median, quantile } from './metrics.mjs';

export function oldFrameTarget(image, geometry, border) {
  const summarize = (raster) => {
    const anchors = scanFrameAnchors(raster, border);
    const sides = Object.fromEntries(
      ['left', 'right', 'top', 'bottom'].map((side) => {
        const a = anchors.points
            .filter((p) => p.side === side)
            .map((p) => (['left', 'right'].includes(side) ? p.x : p.y)),
          position = median(a),
          spread = quantile(
            a.map((v) => Math.abs(v - position)),
            0.9,
          );
        return [
          side,
          { position, spread, count: a.length, reliable: a.length >= 16 && spread < 0.8 },
        ];
      }),
    );
    return { reliable: Object.values(sides).every((s) => s.reliable), sides };
  };
  const rgb = summarize(image);
  if (rgb.reliable) return { ...rgb, source: 'frame-rgb' };
  const mask = summarize(geometry),
    strong = Object.keys(rgb.sides).filter((k) => rgb.sides[k].reliable);
  // Never infer from a sibling color. The exact source family's stock mask
  // must agree with at least two independently visible RGB boundaries.
  const verified =
    mask.reliable &&
    strong.length >= 2 &&
    strong.every((k) => Math.abs(rgb.sides[k].position - mask.sides[k].position) <= 0.75);
  return verified
    ? { ...mask, source: 'verified-source-stock-mask', rgbVerification: rgb }
    : { ...rgb, source: 'frame-rgb', maskRejected: mask };
}
export function normalizeOldFrame(reference, target, border) {
  const source = scanFrameAnchors(reference, border);
  return { target, ...fitAffineScan(source, target, fitScanFrame(source, target)) };
}
