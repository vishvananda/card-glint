import { hasOvalSecurityStamp } from './security-stamp-policy.js';
import { FACE_RECTS, type RenderedCardInput } from './face-layout.js';
import { resolveCardProfile, resolveFrameColors } from './profile.js';
import { CONJURER_ROOT } from './styled-set-symbols.js';
import { SAGA_STAMP } from './saga-frame.js';

export const ADVENTURE_ROOT = `${CONJURER_ROOT}/img/frames/adventure/regular`;
export const ADVENTURE_LEFT_MASK = `${ADVENTURE_ROOT}/bookLeft.png`;
export const ADVENTURE_PINLINE_MASK = `${ADVENTURE_ROOT}/pinline.svg`;
export const ADVENTURE_NEUTRAL_PAPER =
  'https://cdn.jsdelivr.net/gh/MagicSetEditorPacks/Full-Magic-Pack@16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-m15-split-fusable.mse-style/namebox/texture/normal/c.png';
export const isAdventure = (face: RenderedCardInput) =>
  face.layout === 'adventure' && face.faces?.length === 2;
export function adventureHybrid(face: RenderedCardInput) {
  const symbols = face.manaSymbols ?? [];
  return (
    resolveFrameColors(face).length === 2 &&
    symbols.some((s) => /^[WUBRG]\/[WUBRG]$/.test(s)) &&
    !symbols.some((s) => /^[WUBRG]$/.test(s))
  );
}
export function adventureMaterial(face: RenderedCardInput): string {
  const profile = resolveCardProfile(face),
    colors = resolveFrameColors(face);
  return profile.land
    ? 'l'
    : profile.artifact
      ? 'a'
      : colors.length > 1
        ? 'm'
        : (colors[0]?.toLowerCase() ?? 'a');
}
export const adventurePlate = (face: RenderedCardInput) =>
  `${ADVENTURE_ROOT}/${adventureMaterial(face)}.png`;
export function adventurePt(face: RenderedCardInput) {
  const key = adventureHybrid(face) ? 'W' : adventureMaterial(face).toUpperCase();
  return `${CONJURER_ROOT}/img/frames/m15/regular/m15PT${key === 'L' ? 'C' : key}.png`;
}
export const adventureCrown = (face: RenderedCardInput) =>
  `${CONJURER_ROOT}/img/frames/m15/crowns/m15Crown${adventureMaterial(face).toUpperCase()}.png`;
export function adventureAssets(face: RenderedCardInput): string[] {
  const spell = face.faces?.[1];
  if (!isAdventure(face) || !spell) throw Error('Adventure needs a permanent and an inset spell.');
  const plates = (f: RenderedCardInput) => {
    const colors = resolveFrameColors(f);
    return [
      adventurePlate(f),
      ...(colors.length === 2
        ? colors.map((color) => `${ADVENTURE_ROOT}/${color.toLowerCase()}.png`)
        : []),
    ];
  };
  return [
    ...new Set([
      ...plates(face),
      ...plates(spell),
      ADVENTURE_LEFT_MASK,
      ...(resolveFrameColors(face).length === 2 && !adventureHybrid(face)
        ? [ADVENTURE_PINLINE_MASK]
        : []),
      ...(adventureHybrid(face) ? [ADVENTURE_NEUTRAL_PAPER] : []),
      ...(resolveCardProfile(face).legendary ? [adventureCrown(face)] : []),
      ...(face.power != null && face.toughness != null ? [adventurePt(face)] : []),
      ...(hasOvalSecurityStamp(face) ? [SAGA_STAMP] : []),
    ]),
  ];
}
/** Source-native full plate, book pages and shared art/effect aperture. */
export const ADVENTURE_RECTS = {
  ...FACE_RECTS,
  background: [0, 0, 1, 1],
  frame: [0, 0, 1, 1],
  title: [0.0854, 0.0522, 0.8292, 0.0543],
  art: [0.0767, 0.1129, 0.8476, 0.4429],
  type: [0.0854, 0.5664, 0.8292, 0.0543],
  rules: [0.5267, 0.65, 0.3867, 0.2647],
  stats: [0.7573, 0.8848, 0.188, 0.0733],
  stamp: [0.58, 0.74, 0.25, 0.1794],
} as const;
