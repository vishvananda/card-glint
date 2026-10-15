/** Canonical 488 × 680 placements shared by static printing and the coating.
 * Interior bounds are source pixels measured against the pinned plain oval;
 * the mounted assets include additional colored/black material outside it. */
export const SECURITY_STAMP_RECTS = {
  ordinary: [0.436 * 488, 0.9034 * 680, 0.128 * 488, 0.0458 * 680],
  planeswalker: [0.4394 * 488, 0.9015 * 680, 0.1214 * 488, 0.051 * 680],
  saga: [213.7, 620.2, 60.5, 25.3],
  aftermath: [222, 623, 43, 20],
  split: [223.5, 620, 43, 21.5],
} as const;

export const SECURITY_STAMP_SOURCES = {
  ordinary: { size: [192, 96], interior: [29, 29, 134, 67] },
  planeswalker: { size: [182, 107], interior: [24, 26, 134, 67] },
  saga: { size: [186, 78], interior: [26, 11, 134, 67] },
  plain: { size: [134, 67], interior: [0, 0, 134, 67] },
} as const;
