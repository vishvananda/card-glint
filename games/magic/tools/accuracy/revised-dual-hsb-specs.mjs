/** Source geometry measured on the pinned 1500 × 2100 Fourth plates.
 * These are the paper interiors; surrounding bevels retain the frame fit. */
const interiors = {
  W: [174, 1275, 1320, 1872],
  U: [177, 1275, 1320, 1867],
  R: [176, 1273, 1320, 1867],
  A: [184, 1280, 1320, 1867],
};
export function revisedDualSpecs(candidates) {
  const rect = [0.012, 0.01, 0.974, 0.982];
  return candidates.rows
    .filter((row) => row.family === 'fourth')
    .map((row) => {
      let mask;
      if (['G', 'B'].includes(row.material)) {
        const point = (x, y) => [(x / 488 - rect[0]) / rect[2], (y / 680 - rect[1]) / rect[3]];
        const [left, top] = point(48, 395),
          [right, bottom] = point(443, 615);
        mask = {
          kind: 'chroma',
          bounds: [left, top, right - left, bottom - top],
          seed: point(244, 500),
          frameRgb: row.sourceRgb.frame,
          paperRgb: row.sourceRgb.paper,
        };
      } else {
        const [left, top, right, bottom] = interiors[row.material];
        mask = {
          kind: 'rect',
          rect: [left / 1500, top / 2100, (right - left) / 1500, (bottom - top) / 2100],
          feather: 2 / 1500,
        };
      }
      return {
        material: row.material,
        asset: row.url,
        sourceHash: row.sourceHash,
        rect,
        adjustment: { ...row.independent, mask },
      };
    });
}
