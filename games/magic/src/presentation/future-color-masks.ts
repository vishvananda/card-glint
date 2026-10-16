import type { PaperMask } from './frame-paper-mask.js';

// Traced from the pinned 744 × 1039 source plate, before frame registration.
// The outline includes its curved paper edge and preserves the lower pinline.
export const paperMask: PaperMask = {
  kind: 'polygon',
  feather: 2 / 744,
  points: [
    [65.5, 651.5],
    [678, 651.5],
    [680, 660],
    [682, 675],
    [686, 700],
    [689, 725],
    [691, 750],
    [692, 775],
    [691, 800],
    [690, 825],
    [687, 850],
    [683, 875],
    [677, 900],
    [668.5, 919.5],
    [568, 919.5],
    [566.5, 922.5],
    [74.5, 922.5],
    [73.5, 920],
    [66.5, 900],
    [60.5, 875],
    [55.5, 850],
    [53, 825],
    [51.5, 800],
    [51, 775],
    [51.5, 750],
    [54, 725],
    [57, 700],
    [60.5, 675],
    [63.5, 660],
  ].map(([x, y]) => [x! / 744, y! / 1039] as const),
};

// Panel outlines follow the same pinned source plate; the artwork, paper and
// outer texture stay on their own transforms. Feather in source pixels only.
const panel = (points: readonly (readonly [number, number])[]): PaperMask => ({
  kind: 'polygon',
  feather: 2 / 744,
  points: points.map(([x, y]) => [x / 744, y / 1039] as const),
});
export const titleMask = panel([
  [87, 118],
  [92, 100],
  [104, 79],
  [120, 62],
  [135, 51],
  [149, 44],
  [681, 44],
  [689, 47],
  [693, 54],
  [693, 118],
]);
export const typeMask = panel([
  [74, 582],
  [677, 582],
  [688, 590],
  [696, 605],
  [705, 615],
  [705, 628],
  [696, 642],
  [682, 650],
  [82, 650],
]);
