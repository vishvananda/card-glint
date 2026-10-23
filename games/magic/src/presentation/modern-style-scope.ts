import type { RenderedCardInput } from './face-layout.js';
import { PRE_M15_SETS } from './modern-predecessor-sets.js';

/** Source-family eligibility, not a claim that an unmeasured printing is calibrated. */
export function supportsModernStyleDefaults(face: RenderedCardInput): boolean {
  if (
    face.frameStyle === 'retro' ||
    face.frameAssetFamily === 'eighth' ||
    face.frameTreatment === 'colorshifted' ||
    face.frameTemplate === 'future' ||
    face.frameTemplate === 'flip' ||
    /^(?:split-old|split-eighth|flip|leveler)/.test(face.layout ?? '')
  )
    return false;
  return face.frameAssetFamily === 'm15-accurate' || modernSetUsesDefaults(face.setCode ?? '');
}

/** Set-only callers conservatively load the shared style dependency. Face-aware
 * preparation can avoid it for later retro treatments and exact-only policies. */
export function modernSetUsesDefaults(setCode: string): boolean {
  return !PRE_M15_SETS.has(setCode.toLowerCase());
}
