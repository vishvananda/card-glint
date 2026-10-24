import contours from './eighth-basic-contours.json' with { type: 'json' };
import type { PaperMask } from './frame-paper-mask.js';
/** Pinned Eighth plate contours in source UV; geometry moves these with the image. */
const outline = (part: typeof contours.paper): PaperMask => ({
  kind: 'polygon',
  points: [
    ...part.left.map(([y, x]) => [x! / 488, y! / 680] as const),
    ...[...part.right].reverse().map(([y, x]) => [x! / 488, y! / 680] as const),
  ],
  feather: 0.4 / 488,
});
export const EIGHTH_PAPER_MASKS = {
  paper: outline(contours.paper),
  title: outline(contours.title),
  type: outline(contours.type),
};
