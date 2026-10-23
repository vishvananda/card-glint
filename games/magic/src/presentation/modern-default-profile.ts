import type { RenderedCardInput } from './face-layout.js';
import type { ModernPrintingProfile } from './modern-printing-profiles.js';
import { MODERN_PRINTING_PROFILES } from '../data/tables.js';
import { supportsModernStyleDefaults } from './modern-style-scope.js';

const inherited = new WeakMap<ModernPrintingProfile, ModernPrintingProfile>();
/** Reuse shared style data; physical printing content always remains set-local. */
export function modernDefaultProfile(
  face: Pick<
    RenderedCardInput,
    | 'setCode'
    | 'frameStyle'
    | 'frameAssetFamily'
    | 'frameTreatment'
    | 'frameTemplate'
    | 'layout'
    | 'calibration'
  >,
): ModernPrintingProfile | undefined {
  if (face.calibration === 'printing' || !supportsModernStyleDefaults(face)) return undefined;
  const source = MODERN_PRINTING_PROFILES.m21;
  if (!source) return undefined;
  let profile = inherited.get(source);
  if (!profile) {
    profile = Object.freeze({
      ...source,
      inheritedFrom: 'm21',
      printedLandRarities: Object.freeze([]),
      printedFrameColors: Object.freeze({}),
      foilStarNumbers: Object.freeze([]),
      ...(source.planeswalkers
        ? {
            planeswalkers: Object.freeze({
              ...source.planeswalkers,
              deckCollectorNumbers: Object.freeze([]),
            }),
          }
        : {}),
    });
    inherited.set(source, profile);
  }
  return profile;
}
