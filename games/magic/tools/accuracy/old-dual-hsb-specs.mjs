/** Paper interiors in canonical 488 × 680 coordinates, measured on pinned plates.
 * Keep rectangular bevels outside the paper transform. B/G use source chroma
 * and connectedness so the irregular shadows remain part of the paper. */
const interiors = {
  abu: {
    W: [62, 407, 427, 602],
    U: [62, 407, 427, 601],
    R: [61, 407, 429, 601],
    A: [63, 409, 427, 603],
    L: [68, 414, 421, 598],
  },
  fourth: {
    W: [61, 412, 424, 602],
    U: [62, 412, 424, 600],
    R: [62, 412, 424, 600],
    A: [65, 414, 424, 600],
    L: [66, 413, 423, 598],
    M: [61, 408, 429, 605],
  },
  seventh: {
    W: [52, 407, 437, 602],
    U: [52, 407, 437, 602],
    R: [52, 407, 437, 602],
    A: [52, 407, 437, 602],
    L: [58, 412, 432, 597],
    M: [58, 412, 432, 597],
    C: [53, 407, 437, 602],
  },
  legends: { M: [57, 409, 432, 608] },
};
export function oldDualMask(plate, source) {
  const [family, material] = plate.split('/'),
    r = source.rect;
  const point = (x, y) => [(x / 488 - r[0]) / r[2], (y / 680 - r[1]) / r[3]];
  if (['B', 'G'].includes(material)) {
    const [l, t] = point(45, 396),
      [right, bottom] = point(444, 612);
    return {
      kind: 'chroma',
      bounds: [l, t, right - l, bottom - t],
      seed: point(244, 500),
      frameRgb: source.components.frame.rgb,
      paperRgb: source.components.paper.rgb,
    };
  }
  const box = interiors[family]?.[material.endsWith('L') ? 'L' : material];
  if (!box) return undefined;
  const [l, t] = point(box[0], box[1]),
    [right, bottom] = point(box[2], box[3]);
  return { kind: 'rect', rect: [l, t, right - l, bottom - t], feather: 2 / 1500 };
}
