import { resolveCardProfile, resolveFrameColors } from './profile.js';
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
  const { ordinaryPlates: _ordinary, landPlates: _lands, ...style } = profile;
  const land = modernLandPlates(face);
  return [
    [
      'modern-printing',
      face.setCode?.toLowerCase(),
      style,
      modernOrdinaryPlates(face) ?? null,
      land
        ? [
            land.profile.root,
            land.profile.commonTexture,
            land.dual ? land.profile.neutralHeaders : null,
          ]
        : null,
    ],
  ];
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

/** Exact pinned M15 land sources; no inferred calibration for crowns or other sets. */
export function modernLandPlates(face: RenderedCardInput) {
  const profile = modernPrintingProfile(face)?.landPlates;
  if (!profile || profile.root !== manifest.CONJURER_ROOT + '/img/frames/m15/new') return undefined;
  const traits = resolveCardProfile(face);
  if (
    !traits.land ||
    traits.legendary ||
    traits.artifact ||
    face.legendary ||
    (face.layout && face.layout !== 'normal') ||
    (face.borderColor !== undefined && face.borderColor !== 'black')
  )
    return undefined;
  const colors = resolveFrameColors(face);
  if (colors.length > 2) return undefined;
  const sources = colors.length
    ? colors.map((c) => profile.root + '/l' + c.toLowerCase() + '.png')
    : [profile.root + '/l.png'];
  if (!sources.every((source) => Object.hasOwn(profile.materials, source))) return undefined;
  return { profile, sources, dual: colors.length === 2 };
}

/** Exact-set ordinary source selection. Crowns, colored artifacts and
 * specialty frames keep their independently owned sources and geometry. */
export function modernOrdinaryPlates(face: RenderedCardInput) {
  const land = modernLandPlates(face);
  if (land)
    return Object.fromEntries(
      land.sources.map((source) => [source, land.profile.materials[source]!]),
    );

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
  return { [source]: plates[source]! };
}
