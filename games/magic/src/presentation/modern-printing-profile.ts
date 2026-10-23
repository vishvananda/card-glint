import { modernDefaultProfile } from './modern-default-profile.js';
import { supportsModernStyleDefaults } from './modern-style-scope.js';
import { resolveCardProfile, resolveFrameColors } from './profile.js';
import manifest from '../../assets.json' with { type: 'json' };
import type { RenderedCardInput } from './face-layout.js';
import {
  MODERN_PRINTING_PROFILES,
  ORDINARY_COLOR_PROFILES,
  PRINTING_COLOR_PROFILES,
  LEGENDS_COLOR_PROFILES,
} from '../data/tables.js';
import { componentPrintingColorSource } from './printing-color-source.js';

type ModernPrintingInput = Pick<
  RenderedCardInput,
  | 'setCode'
  | 'frameStyle'
  | 'frameAssetFamily'
  | 'frameTreatment'
  | 'frameTemplate'
  | 'layout'
  | 'faces'
  | 'typeLine'
  | 'canonicalTypeLine'
  | 'calibration'
>;
export function modernPrintingProfile(face: ModernPrintingInput) {
  if (!supportsModernPrintingProfile(face)) return undefined;
  const exact = MODERN_PRINTING_PROFILES[face.setCode?.toLowerCase() ?? ''];
  const exactScope =
    !face.frameTemplate &&
    !face.faces?.length &&
    (!face.layout || face.layout === 'normal' || face.layout === 'planeswalker') &&
    !/\b(Saga|Class|Battle)\b/.test(face.canonicalTypeLine ?? face.typeLine ?? '');
  return exact && exactScope ? exact : modernDefaultProfile(face);
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
      modernArtifactPinline(face) ?? null,
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

/** Shared M15-era styles may reach dedicated layouts; each painter still owns
 * its apertures and geometry. Older families never inherit these styles. */
export function supportsModernPrintingProfile(face: ModernPrintingInput): boolean {
  return supportsModernStyleDefaults(face);
}

/** Exact pinned M15 land sources; no inferred calibration for crowns or other sets. */
export function modernLandPlates(face: RenderedCardInput) {
  const profile = modernPrintingProfile(face)?.landPlates;
  if (
    !profile ||
    profile.root !== manifest.CONJURER_ROOT + '/img/frames/m15/new' ||
    face.frameTemplate ||
    face.faces?.length
  )
    return undefined;
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
  const sources =
    colors.length > 2
      ? [profile.root + '/lm.png']
      : colors.length
        ? colors.map((c) => profile.root + '/l' + c.toLowerCase() + '.png')
        : [profile.root + '/l.png'];
  if (!sources.every((source) => Object.hasOwn(profile.materials, source))) return undefined;
  return { profile, sources, dual: colors.length === 2 };
}

/** Exact-source pinlines over an artifact plate. The ordinary selector owns
 * frame eligibility; source-local color fits never transfer between bitmaps. */
export function modernArtifactPinline(face: RenderedCardInput) {
  const colors = face.frameColors ?? face.colors ?? [];
  const type = face.canonicalTypeLine ?? face.typeLine ?? '';
  if (
    !(face.artifact ?? /\bArtifact\b/.test(type)) ||
    colors.length !== 1 ||
    !modernOrdinaryPlates(face)
  )
    return undefined;
  const root = manifest.CONJURER_ROOT + '/img/frames/m15/new';
  const source = root + '/' + colors[0]!.toLowerCase() + '.png';
  const correction = modernPrintingProfile(face)?.ordinaryPlates?.[source];
  if (!correction) return undefined;
  return { source, mask: root + '/pinline.png', correction };
}

/** Compatible planeswalker styles; inherited values remain labeled as defaults. */
export function modernWalkerProfile(face: RenderedCardInput) {
  return /\bPlaneswalker\b/.test(face.canonicalTypeLine ?? face.typeLine ?? '')
    ? modernPrintingProfile(face)?.planeswalkers
    : undefined;
}

/** Coverage belongs to the exact foreground source/palette. Raw-source policy
 * retains the original alpha, and unmeasured sets retain their prior behavior. */
export function modernWalkerFrameRepaint(face: RenderedCardInput, palette: string): number {
  return face.colorCalibration === 'set-hsb-v1' && face.calibration !== 'source'
    ? (modernWalkerProfile(face)?.frameRepaint?.[palette] ?? 0)
    : 0;
}

/** Booster/tall body fits are not transferred to unmeasured deck printings. */
export function modernWalkerBodyProfile(face: RenderedCardInput) {
  const profile = modernWalkerProfile(face);
  return profile?.deckCollectorNumbers.includes(face.collectorNumber ?? '') ? undefined : profile;
}

/** Source-bound ordinary source selection. Crowns and specialty frames keep
 * their independently owned sources and geometry. */
export function modernOrdinaryPlates(face: RenderedCardInput) {
  const land = modernLandPlates(face);
  if (land)
    return Object.fromEntries(
      land.sources.map((source) => [source, land.profile.materials[source]!]),
    );

  const style = modernPrintingProfile(face);
  if (style?.inheritedFrom && independentModernComponentMaterials(face)) return undefined;
  const plates = style?.ordinaryPlates;
  const type = face.canonicalTypeLine ?? face.typeLine ?? '';
  const colors = face.frameColors ?? face.colors ?? [];
  const artifact = face.artifact ?? /\bArtifact\b/.test(type);
  const sourceColor = artifact ? 'a' : colors[0]?.toLowerCase();
  const source = `${manifest.CONJURER_ROOT}/img/frames/m15/new/${sourceColor}.png`;
  if (
    !plates ||
    face.frameTemplate ||
    face.faces?.length ||
    !Object.hasOwn(plates, source) ||
    (face.layout && face.layout !== 'normal') ||
    face.legendary ||
    face.land ||
    (face.borderColor !== undefined && face.borderColor !== 'black') ||
    /\b(Legendary|Land|Planeswalker|Saga|Class|Battle|Vehicle)\b/.test(type) ||
    /^Level up\b/m.test(face.rulesText ?? '') ||
    colors.length > 1 ||
    (!artifact && colors.length !== 1)
  )
    return undefined;
  const base = plates[source]!;
  const paper = artifact
    ? modernPrintingProfile(face)?.artifactPapers?.[colors[0] ?? '']
    : undefined;
  if (!paper) return { [source]: base };
  if (!('mask' in base) || base.regions?.length !== 2)
    throw Error('Colored artifact paper requires the source-local three-panel masks.');
  return {
    [source]: {
      ...base,
      paper: paper.paper,
      regions: [
        { ...base.regions[0]!, adjustment: paper.name },
        { ...base.regions[1]!, adjustment: paper.type },
      ],
    },
  };
}

/** Material identity distinguishes palettes that share the same artifact bitmap. */
export function modernArtifactPaperPalette(face: RenderedCardInput): string | undefined {
  const colors = face.frameColors ?? face.colors ?? [];
  const palette = colors.length === 1 ? colors[0] : undefined;
  const source = manifest.CONJURER_ROOT + '/img/frames/m15/new/a.png';
  return palette &&
    modernPrintingProfile(face)?.artifactPapers?.[palette] &&
    modernOrdinaryPlates(face)?.[source]
    ? palette
    : undefined;
}

/** Existing source-bound component pigment wins over a new donor plate. */
export function independentModernComponentMaterials(face: RenderedCardInput) {
  const source = componentPrintingColorSource(face);
  if (!source) return undefined;
  const legendary = resolveCardProfile(face).legendary;
  const fit =
    (!legendary ? ORDINARY_COLOR_PROFILES[source.key] : undefined) ??
    PRINTING_COLOR_PROFILES[source.key] ??
    LEGENDS_COLOR_PROFILES[source.key];
  return fit?.source === source.source &&
    (fit.legendary === undefined || fit.legendary === legendary)
    ? fit.materials
    : undefined;
}
