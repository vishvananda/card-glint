import { FACE_RECTS, type RenderedCardInput } from './face-layout.js';
import { resolveCardProfile, resolveFrameColors } from './profile.js';
import { CONJURER_ROOT } from './styled-set-symbols.js';
import { adventurePt } from './adventure-frame.js';
import { SAGA_STAMP } from './saga-frame.js';

export const PREPARE_ROOT = `${CONJURER_ROOT}/img/frames/prepare/regular`;
export const isPrepared = (face: RenderedCardInput) => face.layout === 'prepare';
export function preparedSpell(face: RenderedCardInput): RenderedCardInput {
  if (face.faces?.length !== 2) throw Error('Prepared needs a creature and an inset spell.');
  return face.faces[1]!;
}
export function prepareMaterial(face: RenderedCardInput): string {
  const profile = resolveCardProfile(face),
    colors = resolveFrameColors(face);
  if (profile.land) return 'l';
  if (/\bVehicle\b/.test(face.typeLine ?? '')) return 'v';
  if (profile.artifact) return 'a';
  if (colors.length > 1) return 'm';
  if (colors.length) return colors[0]!.toLowerCase();
  throw Error('The pinned Prepared source has no colorless plate.');
}
export const preparePlate = (face: RenderedCardInput) =>
  `${PREPARE_ROOT}/${prepareMaterial(face)}.png`;
export const prepareMask = (name: string) => `${PREPARE_ROOT}/${name}.png`;
export function prepareColors(face: RenderedCardInput) {
  const colors = resolveFrameColors(face);
  if (colors.length === 2 && 'WUBRG'.indexOf(colors[1]!) - 'WUBRG'.indexOf(colors[0]!) > 2)
    colors.reverse();
  return colors;
}
export const prepareCrown = (color: string) =>
  `${CONJURER_ROOT}/img/frames/m15/crowns/m15Crown${color.toUpperCase()}.png`;
export const preparePt = (face: RenderedCardInput) => adventurePt(face);
export function prepareAssets(face: RenderedCardInput): string[] {
  const spell = preparedSpell(face),
    pair = (f: RenderedCardInput) =>
      prepareColors(f).length === 2
        ? prepareColors(f).map((color) => `${PREPARE_ROOT}/${color.toLowerCase()}.png`)
        : [];
  const colors = prepareColors(face);
  return [
    ...new Set([
      preparePlate(face),
      preparePlate(spell),
      prepareMask('prepare'),
      ...pair(face),
      ...pair(spell),
      ...(colors.length === 2 ? ['pinline', 'rules', 'rulesRight'].map(prepareMask) : []),
      ...(prepareColors(spell).length === 2
        ? ['prepareRight', 'prepareTypeTitle'].map(prepareMask)
        : []),
      ...(resolveCardProfile(face).legendary
        ? (colors.length === 2 ? colors : [prepareMaterial(face)]).map(prepareCrown)
        : []),
      ...(face.power != null && face.toughness != null ? [preparePt(face)] : []),
      ...(['rare', 'mythic'].includes(face.rarity ?? '') ? [SAGA_STAMP] : []),
    ]),
  ];
}
/** One physical face: creature on the left, inset spell on the right. */
export const PREPARE_RECTS = {
  ...FACE_RECTS,
  background: [0, 0, 1, 1],
  frame: [0, 0, 1, 1],
  title: [0.0854, 0.0522, 0.8292, 0.0543],
  art: [0.0767, 0.1129, 0.8476, 0.4429],
  type: [0.0854, 0.5664, 0.8292, 0.0543],
  rules: [0.086, 0.6303, 808 / 2010, 0.2875],
  stats: [0.7573, 0.8848, 0.188, 0.0733],
  stamp: [0.17, 0.72, 0.25, 0.1794],
} as const;
export const PREPARE_SPELL_RECTS = {
  title: [1042 / 2010, 0.6391, 0.4, 0.0296],
  type: [1042 / 2010, 1932 / 2814, 0.4, 0.0296],
  rules: [1035 / 2010 + 2 / 488, 2059 / 2814, 0.3947, 438 / 2814],
} as const;
