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
  const code = face.setCode?.toLowerCase() ?? '';
  // Exact-only consumers must not prepare an unrelated donor merely to discover
  // that it has no exact entry. The registry checks prepared ownership on get.
  const exact = Object.hasOwn(EIGHTH_PRINTING_PROFILES, code)
    ? EIGHTH_PRINTING_PROFILES[code]
    : undefined;
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
