import { type CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import { FACE_WIDTH, FACE_HEIGHT, type FaceRect } from './face-layout.js';

// Aperture landmarks measured from the pinned 2736×3810 planeswalker plates,
// expressed at the 768px decode width. The one-pixel bleed stays beneath the
// opaque inner keyline. Curves are shared by colors; no scan-specific crop.
const SIDES: readonly (readonly (readonly [number, number])[])[] = [
  [
    [84, 53],
    [86, 52],
    [87, 50],
    [88, 48],
    [89, 47],
    [90, 46],
    [91, 45],
    [92, 44],
    [93, 44],
    [94, 43],
    [95, 43],
    [106, 41],
    [126, 37],
    [146, 34],
    [166, 31],
    [186, 28],
    [206, 26],
    [226, 25],
    [246, 24],
    [266, 23],
    [286, 22],
    [306, 22],
    [326, 21],
    [346, 21],
    [366, 21],
    [386, 22],
    [406, 22],
    [426, 22],
    [446, 23],
    [466, 24],
    [486, 24],
    [506, 25],
    [526, 27],
    [546, 29],
    [566, 32],
    [586, 36],
    [606, 40],
    [611, 42],
    [612, 43],
    [613, 43],
    [614, 44],
    [615, 44],
    [616, 45],
    [617, 46],
    [618, 47],
    [619, 48],
    [620, 50],
    [622, 53],
  ],
  [
    [84, 53],
    [86, 52],
    [87, 50],
    [88, 48],
    [89, 47],
    [90, 46],
    [91, 45],
    [92, 44],
    [93, 44],
    [94, 43],
    [95, 43],
    [106, 41],
    [126, 37],
    [146, 34],
    [166, 31],
    [186, 28],
    [206, 26],
    [226, 24],
    [246, 23],
    [266, 22],
    [286, 22],
    [306, 21],
    [326, 21],
    [346, 22],
    [366, 22],
    [386, 23],
    [406, 24],
    [426, 25],
    [446, 27],
    [466, 29],
    [486, 32],
    [506, 36],
    [526, 41],
    [530, 42],
    [531, 42],
    [532, 43],
    [533, 43],
    [534, 44],
    [535, 45],
    [536, 46],
    [537, 47],
    [538, 48],
    [539, 50],
    [541, 53],
  ],
];
const SCALE = (0.91339 * FACE_WIDTH) / 768;
const LEFT = 0.04724 * FACE_WIDTH;
const TOP = 0.02655 * FACE_HEIGHT;

export function planeswalkerArtBounds(large: boolean): FaceRect {
  return [
    (LEFT + 20 * SCALE) / FACE_WIDTH,
    (TOP + 84 * SCALE) / FACE_HEIGHT,
    (728 * SCALE) / FACE_WIDTH,
    (((large ? 541 : 622) - 84) * SCALE) / FACE_HEIGHT,
  ];
}

/** Clip during face preparation; no image decoding or alpha readback. */
export function clipPlaneswalkerArt(c: CanvasContext, large: boolean) {
  const side = SIDES[large ? 1 : 0]!;
  c.beginPath();
  side.forEach(([y, x], i) => {
    const px = LEFT + (x - 1) * SCALE,
      py = TOP + y * SCALE;
    if (i === 0) c.moveTo(px, py);
    else c.lineTo(px, py);
  });
  for (let i = side.length - 1; i >= 0; i--) {
    const [y, x] = side[i]!;
    c.lineTo(LEFT + (769 - x) * SCALE, TOP + y * SCALE);
  }
  c.closePath();
  c.clip();
}
