import manifest from '../../assets.json' with { type: 'json' };
import type { RenderedCardInput } from './face-layout.js';
import { resolveFrameColors } from './profile.js';
import { abuLandOutlineColor } from './abu-land-palette.js';

/** ABU uses concentric bands, not a modern split-color gradient. Retain the
 * palette separately from the visible original type line, which is just Land.
 * Revised has different paper geometry and is deliberately not inferred here. */
export function retroDualFrame(face: RenderedCardInput) {
  if (
    face.frameTemplate ||
    !['lea', 'leb', '2ed'].includes(face.setCode?.toLowerCase() ?? '') ||
    face.frameStyle === 'modern' ||
    /\b(Saga|Class|Planeswalker|Battle)\b/.test(face.typeLine ?? '') ||
    !(face.land ?? /\bLand\b/.test(face.typeLine ?? '')) ||
    (face.layout && face.layout !== 'normal')
  )
    return undefined;
  const colors = retroLandColors(face);
  if (colors.length !== 2) return undefined;
  // Printed concentric bands have their own color order. WUBRG is a semantic
  // palette order, not the band assignment. These five pairs reverse the
  // base/overlay in the ABU printings; the other five retain their order.
  const bands = ['WU', 'WG', 'UG', 'BG', 'RG'].includes(colors.join(''))
    ? [...colors].reverse()
    : colors;
  const root = `${manifest.RETRO_ROOT}/img/frames/old/abu/`;
  return {
    base: `${root}${bands[0]!.toLowerCase()}l.png`,
    overlay: `${root}${bands[1]!.toLowerCase()}l.png`,
    mask: `${manifest.CONJURER_ROOT}/img/frames/old/abu/dualLand.png`,
    outline: `${root}${abuLandOutlineColor(colors)!.toLowerCase()}l.png`,
  };
}

/** Semantic land colors survive original type lines such as just “Land”. */
export function retroLandColors(face: RenderedCardInput): string[] {
  return face.frameColors
    ? resolveFrameColors(face)
    : [
        ['Plains', 'W'],
        ['Island', 'U'],
        ['Swamp', 'B'],
        ['Mountain', 'R'],
        ['Forest', 'G'],
      ]
        .filter(([type]) =>
          new RegExp(String.raw`\b${type}\b`).test(face.canonicalTypeLine ?? face.typeLine ?? ''),
        )
        .map(([, color]) => color!);
}
