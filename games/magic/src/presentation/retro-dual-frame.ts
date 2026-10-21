import manifest from '../../assets.json' with { type: 'json' };
import type { RenderedCardInput } from './face-layout.js';
import { retroLandColors } from './retro-land-colors.js';
import { earlyReprintFrame } from './early-reprint-frame.js';
export { retroLandColors } from './retro-land-colors.js';
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
  const calibrated = earlyReprintFrame(face)?.dual;
  if (calibrated) return calibrated;
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
    pinline: undefined,
    base: `${root}${bands[0]!.toLowerCase()}l.png`,
    overlay: `${root}${bands[1]!.toLowerCase()}l.png`,
    mask: `${manifest.CONJURER_ROOT}/img/frames/old/abu/dualLand.png`,
    outline: `${root}${abuLandOutlineColor(colors, face.setCode)!.toLowerCase()}l.png`,
  };
}

/** Only these two printed outlines change. Other face cache identities stay byte-identical. */
export function retroDualFrameRevision(face: RenderedCardInput): string | undefined {
  if (face.setCode?.toLowerCase() !== 'leb' || !retroDualFrame(face)) return undefined;
  return ['WU', 'UR'].includes(retroLandColors(face).join('')) ? 'beta-outline-ink-v2' : undefined;
}
