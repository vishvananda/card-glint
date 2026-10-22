import manifest from '../../assets.json' with { type: 'json' };
import type { RenderedCardInput } from './face-layout.js';
import { MODERN_PRINTING_PROFILES } from '../data/tables.js';

export function modernPrintingProfile(face: RenderedCardInput) {
  if (!supportsModernPrintingProfile(face)) return undefined;
  return MODERN_PRINTING_PROFILES[face.setCode?.toLowerCase() ?? ''];
}
export function modernPrintingProfileKey(face: RenderedCardInput): readonly unknown[] {
  const profile = modernPrintingProfile(face);
  if (!profile) return [];
  // A face key carries only the material it can paint, rather than six copies
  // of the shared source masks for every card in a collection.
  const { ordinaryPlates: _plates, ...style } = profile;
  const plates = modernOrdinaryPlates(face);
  const type = face.canonicalTypeLine ?? face.typeLine ?? '';
  const color =
    (face.artifact ?? /\bArtifact\b/.test(type))
      ? 'a'
      : (face.frameColors ?? face.colors ?? [])[0]?.toLowerCase();
  const material =
    plates && Object.entries(plates).find(([url]) => url.endsWith('/' + color + '.png'));
  return [['modern-printing', face.setCode?.toLowerCase(), style, material ?? null]];
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

/** Exact-set ordinary source selection. Crowns, lands, colored artifacts and
 * specialty frames keep their independently owned sources and geometry. */
export function modernOrdinaryPlates(face: RenderedCardInput) {
  const plates = modernPrintingProfile(face)?.ordinaryPlates;
  const type = face.canonicalTypeLine ?? face.typeLine ?? '';
  const colors = face.frameColors ?? face.colors ?? [];
  const artifact = face.artifact ?? /\bArtifact\b/.test(type);
  const sourceColor = artifact ? 'a' : colors[0]?.toLowerCase();
  const source = `${manifest.CONJURER_ROOT}/img/frames/m15/new/${sourceColor}.png`;
  if (
    !plates ||
    !Object.hasOwn(plates, source) ||
    (face.layout && face.layout !== 'normal') ||
    face.legendary ||
    face.land ||
    (face.borderColor !== undefined && face.borderColor !== 'black') ||
    /\b(Legendary|Land|Planeswalker|Saga|Class|Battle|Vehicle)\b/.test(type) ||
    /^Level up\b/m.test(face.rulesText ?? '') ||
    colors.length > 1 ||
    (artifact ? colors.length > 0 : colors.length !== 1)
  )
    return undefined;
  return plates;
}
