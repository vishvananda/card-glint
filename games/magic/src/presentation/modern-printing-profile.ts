import type { RenderedCardInput } from './face-layout.js';
import { MODERN_PRINTING_PROFILES } from '../data/tables.js';

export function modernPrintingProfile(face: RenderedCardInput) {
  if (!supportsModernPrintingProfile(face)) return undefined;
  return MODERN_PRINTING_PROFILES[face.setCode?.toLowerCase() ?? ''];
}
export function modernPrintingProfileKey(face: RenderedCardInput): readonly unknown[] {
  const profile = modernPrintingProfile(face);
  return profile ? [['modern-printing', face.setCode?.toLowerCase(), profile]] : [];
}

/** Source-compatible ordinary M15 information lines, including planeswalkers.
 * Source/color policies do not change typography. Explicit older/templates
 * retain their own footer. No donor or completion claim is made here. */
export function supportsModernPrintingProfile(face: RenderedCardInput): boolean {
  return (
    face.frameStyle !== 'retro' &&
    (!face.frameAssetFamily || face.frameAssetFamily === 'm15-accurate') &&
    !face.frameTemplate &&
    !face.faces?.length &&
    (!face.layout || face.layout === 'normal' || face.layout === 'planeswalker') &&
    !/\b(Saga|Class|Battle)\b/.test(face.canonicalTypeLine ?? face.typeLine ?? '')
  );
}
