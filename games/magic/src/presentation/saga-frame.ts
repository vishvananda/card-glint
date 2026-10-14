import { sagaColorAssets } from './saga-colors.js';
import { CONJURER_ROOT } from './styled-set-symbols.js';
import { resolveFrameColors } from './profile.js';
import { FACE_RECTS, type RenderedCardInput } from './face-layout.js';

const root = `${CONJURER_ROOT}/img/frames/saga`;
/** Full plates retain their native aperture, bookmark and type-bar geometry.
 * The legacy colored plates retain printed texture absent from the newer smooth set. */
export function sagaFrameAsset(face: RenderedCardInput): string {
  const colors = resolveFrameColors(face);
  const color = colors.length > 1 ? 'M' : colors[0];
  if (/\bLand\b/.test(face.typeLine ?? '') || face.land) return `${root}/regular/l.png`;
  if (face.layout === 'transform' && color) return `${root}/dfc/${color.toLowerCase()}.png`;
  if (color) return `${CONJURER_ROOT}/data/images/cardImages/saga/sagaFrame${color}.png`;
  throw Error('No ordinary colorless or artifact Saga plate is available.');
}
export function sagaTransformIcon(face: RenderedCardInput): string | null {
  return face.layout === 'transform' && face.setCode?.toLowerCase() === 'neo'
    ? `${CONJURER_ROOT}/img/frames/m15/transform/icons/fanClosed.svg`
    : null;
}
export const SAGA_CHAPTER = `${root}/sagaChapter.png`;
export const SAGA_DIVIDER = `${root}/sagaDivider.png`;
export const SAGA_STAMP = `${root}/stamp.png`;
export function sagaAssets(face: RenderedCardInput): string[] {
  return [
    sagaFrameAsset(face),
    ...sagaColorAssets(face),
    SAGA_CHAPTER,
    SAGA_DIVIDER,
    ...(sagaTransformIcon(face) ? [sagaTransformIcon(face)!] : []),
    ...(['rare', 'mythic'].includes(face.rarity ?? '') ? [SAGA_STAMP] : []),
  ];
}
export const SAGA_RECTS = {
  ...FACE_RECTS,
  background: [0, 0, 1, 1],
  frame: [0, 0, 1, 1],
  title: [0.0854, 0.0522, 0.8292, 0.0543],
  art: [0.5007, 0.1134, 0.4233, 0.724],
  type: [0.0854, 0.8481, 0.8292, 0.0543],
  rules: [0.0867, 0.1129, 0.404, 0.7248],
  stamp: [0.17, 0.48, 0.23, 0.16506],
} as const;
