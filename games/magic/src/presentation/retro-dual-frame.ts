import manifest from '../../assets.json' with { type: 'json' };
import type { RenderedCardInput } from './face-layout.js';
import { resolveFrameColors } from './profile.js';

/** ABU uses concentric bands, not a modern split-color gradient. Retain the
 * palette separately from the visible original type line, which is just Land.
 * Revised has different paper geometry and is deliberately not inferred here. */
export function retroDualFrame(face: RenderedCardInput) {
  if (
    !['lea', 'leb', '2ed'].includes(face.setCode?.toLowerCase() ?? '') ||
    face.frameStyle === 'modern' ||
    /\b(Saga|Class|Planeswalker|Battle)\b/.test(face.typeLine ?? '') ||
    !(face.land ?? /\bLand\b/.test(face.typeLine ?? '')) ||
    (face.layout && face.layout !== 'normal')
  )
    return undefined;
  const colors = face.frameColors
    ? resolveFrameColors(face)
    : [
        ['Plains', 'W'],
        ['Island', 'U'],
        ['Swamp', 'B'],
        ['Mountain', 'R'],
        ['Forest', 'G'],
      ]
        .filter(([type]) => new RegExp(`\\b${type}\\b`).test(face.typeLine ?? ''))
        .map(([, color]) => color!);
  if (colors.length !== 2) return undefined;
  const root = `${manifest.RETRO_ROOT}/img/frames/old/abu/`;
  return {
    base: `${root}${colors[0]!.toLowerCase()}l.png`,
    overlay: `${root}${colors[1]!.toLowerCase()}l.png`,
    mask: `${manifest.CONJURER_ROOT}/img/frames/old/abu/dualLand.png`,
  };
}
