import manifest from '../../assets.json' with { type: 'json' };
import { EIGHTH_PRINTING_PROFILES } from '../data/tables.js';
import type { RenderedCardInput } from './face-layout.js';
import type { EighthPrintingProfile } from './eighth-printing-types.js';
import { supportsEighthStyleDefaults } from './eighth-style-scope.js';
const inherited = new WeakMap<EighthPrintingProfile, EighthPrintingProfile>();
/** Exact fits win; compatible source families may borrow style, never printing content.
 * The donor is descriptive and does not certify the receiving set. */
export function eighthPrintingProfile(face: RenderedCardInput): EighthPrintingProfile | undefined {
  if (!supportsEighthStyleDefaults(face)) return undefined;
  const exact = EIGHTH_PRINTING_PROFILES[face.setCode?.toLowerCase() ?? ''];
  const root = manifest.CONJURER_ROOT + '/img/frames/8th';
  if (exact?.root === root) return exact;
  if (face.calibration === 'printing') return undefined;
  const source = EIGHTH_PRINTING_PROFILES['8ed'];
  if (!source || source.root !== root) return undefined;
  let profile = inherited.get(source);
  if (!profile) {
    profile = Object.freeze({
      ...source,
      inheritedFrom: '8ed',
      rules: Object.freeze({ ...source.rules, shortCenterLines: undefined }),
      originalRules: Object.freeze({}),
    });
    inherited.set(source, profile);
  }
  return profile;
}
