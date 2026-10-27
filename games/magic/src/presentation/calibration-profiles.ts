import { revisedManaSource } from './historical-mana.js';
import { eighthFrameMaterials } from './eighth-materials.js';
import { cardStock } from './face-layout.js';
import { eighthPrintingProfile } from './eighth-printing-profile.js';
import { faceFrame } from './special-frames.js';
import {
  independentModernComponentMaterials,
  modernOrdinaryPlates,
  modernPrintingProfile,
  modernWalkerProfile,
} from './modern-printing-profile.js';
import {
  hasPrintingStockCandidate,
  printingBlackPointMaterials,
  type PrintingStockSource,
} from './printing-blackpoint.js';
import { FACE_RECTS, type RenderedCardInput } from './face-layout.js';
import { profileAssets } from './assets.js';
import { framePlate } from './frame-plates.js';
import { resolveCardProfile, resolveFrameColors } from './profile.js';
import {
  isRetro,
  retroFrameAsset,
  retroFrameRect,
  retroBorder,
  retroBorderMask,
} from './retro-frame.js';
import type { Rgb } from './hsb.js';
import type { DualFrameHsb, FrameHsb } from './frame-hsb.js';
import { componentPrintingColorSource, printingColorSource } from './printing-color-source.js';
import { PRINTING_COLOR_PROFILES } from '../data/tables.js';
import { ORDINARY_COLOR_PROFILES } from '../data/tables.js';
import { LEGENDS_COLOR_PROFILES } from '../data/tables.js';
import { DUAL_HSB_PROFILES, DUAL_MANA_TARGETS } from '../data/tables.js';
import { earlyExpansionMana, arabianManaVariant } from './early-expansion-mana.js';
import { EARLY_EXPANSION_MANA_TARGETS } from '../data/tables.js';
import { MANA_PRINTING_TARGETS } from '../data/tables.js';
import { retroDualFrame } from './retro-dual-frame.js';
import { legendsFrame } from './legends-frame.js';
import { futureFrameMaterials } from './future-color-profiles.js';
import { planarFrameMaterials } from './planar-color-profiles.js';
import { earlyExpansionColors } from './early-expansion-colors.js';
import { earlyReprintColors } from './early-reprint-colors.js';
import { earlyReprintManaTarget } from './early-reprint-mana.js';
export function hasColorCalibration(face: RenderedCardInput): boolean {
  if (face.frameTemplate) return false;
  const early = ['lea', 'leb', '2ed', '3ed'].includes(face.setCode?.toLowerCase() ?? '');
  return (
    (isRetro(face) || !!printingColorSource(face)) &&
    (!face.layout || face.layout === 'normal') &&
    (face.colorCalibration === 'set-hsb-v1' || (early && face.colorCalibration === 'early-hsb-v1'))
  );
}
/** Exact source, stock and placement guards. Rejected/new sources do not inherit
 * obsolete joint fits: those could create a good mean while tinting shadows. */
export function calibratedDualFrameProfile(face: RenderedCardInput): DualFrameHsb | undefined {
  if (!hasColorCalibration(face) || !isRetro(face) || retroDualFrame(face)) return undefined;
  const asset = retroFrameAsset(face),
    material = asset.split('/').at(-1)!.replace('.png', '').toUpperCase(),
    profile = DUAL_HSB_PROFILES[`${face.setCode?.toLowerCase()}-${retroBorder(face)}-${material}`];
  if (profile?.asset !== asset || !profile.rect.every((v, i) => v === retroFrameRect(face)[i]))
    return undefined;
  // Fourth white's paper begins at the printed keyline, not the bright inner
  // ridge. Leaving that ridge on the frame transform produced a false white rim.
  return asset.endsWith('/old/fourth/w.png')
    ? {
        ...profile.adjustment,
        mask: {
          kind: 'rect',
          rect: [162 / 1500, 1259 / 2100, 1174 / 1500, 627 / 2100],
          feather: 2 / 1500,
        },
      }
    : profile.adjustment;
}
export function calibratedManaTarget(face: RenderedCardInput, symbol: string): Rgb | undefined {
  const eighth =
    face.colorCalibration === 'set-hsb-v1' &&
    face.calibration !== 'source' &&
    eighthPrintingProfile(face)?.mana.paperTargets[symbol];
  if (eighth) {
    const inherited = eighthPrintingProfile(face)?.inheritedFrom;
    const key = `${face.setCode?.toLowerCase()}-${retroBorder(face)}-${symbol}`;
    const exact = inherited && (MANA_PRINTING_TARGETS[key] ?? DUAL_MANA_TARGETS[key]);
    return exact || [eighth[0] / 255, eighth[1] / 255, eighth[2] / 255];
  }
  const measured = face.colorCalibration === 'set-hsb-v1' && face.calibration !== 'source';
  const style = measured ? modernPrintingProfile(face) : undefined;
  if (
    !hasColorCalibration(face) &&
    !(measured && (modernWalkerProfile(face) || style?.inheritedFrom))
  )
    return undefined;
  if (face.calibration !== 'source' && revisedManaSource(face)) {
    const target = MANA_PRINTING_TARGETS[`3ed-original-white-${symbol}`];
    if (target) return target;
  }
  const key = `${face.setCode?.toLowerCase()}-${retroBorder(face)}-${symbol}`;
  const exact = MANA_PRINTING_TARGETS[key] ?? DUAL_MANA_TARGETS[key];
  if (style?.inheritedFrom && exact) return exact;
  const modern = style?.mana?.paperTargets[symbol];
  if (modern) return [modern[0] / 255, modern[1] / 255, modern[2] / 255];
  const reprint = earlyReprintManaTarget(face, symbol);
  if (reprint) return reprint;
  if (face.setCode?.toLowerCase() === 'leg' && !legendsFrame(face)) return undefined;
  if (earlyExpansionMana(face)) {
    const variant = arabianManaVariant(face);
    return variant && (symbol === 'W' || symbol === 'B')
      ? EARLY_EXPANSION_MANA_TARGETS[`arn-${variant}-black-${symbol}`]
      : EARLY_EXPANSION_MANA_TARGETS[key];
  }
  return MANA_PRINTING_TARGETS[key] ?? DUAL_MANA_TARGETS[key];
}

/** Every binding retains the exact pinned asset and geometry it was fitted to. */
function baseFrameMaterials(face: RenderedCardInput): Readonly<Record<string, FrameHsb>> {
  const eighth = eighthPrintingProfile(face),
    shared = eighthFrameMaterials(face);
  if (shared && Object.keys(shared).length) {
    const independent = eighth?.inheritedFrom
      ? baseFrameMaterials({ ...face, calibration: 'printing' })
      : {};
    return { ...shared, ...independent };
  }
  const reprint = earlyReprintColors(face);
  if (reprint) return reprint.materials;
  const expansion = earlyExpansionColors(face);
  if (expansion) return expansion.materials;
  if (face.frameTemplate === 'future') return futureFrameMaterials(face);
  if (face.setCode?.toLowerCase() === 'plc') return planarFrameMaterials(face);
  // Exact multi-plate materials have a source census rather than a single
  // printingColorSource descriptor. This does not expand inline-mana coverage.
  if (modernPrintingProfile(face)?.inheritedFrom && face.colorCalibration === 'set-hsb-v1') {
    const independent = independentModernComponentMaterials(face);
    if (independent) return independent;
  }
  const ordinary = modernOrdinaryPlates(face);
  if (ordinary && face.colorCalibration === 'set-hsb-v1') return ordinary;
  if (!hasColorCalibration(face)) return {};
  const dualPlan = retroDualFrame(face);
  if (dualPlan) {
    const result: Record<string, FrameHsb> = {};
    for (const url of [dualPlan.base, dualPlan.overlay]) {
      const profile =
        PRINTING_COLOR_PROFILES[
          `${face.setCode?.toLowerCase()}/${retroBorder(face)}/retro/${url.split('/').at(-1)}`
        ];
      if (profile?.source === JSON.stringify([url, retroFrameRect(face)]))
        Object.assign(result, profile.materials);
    }
    return result;
  }
  const source = printingColorSource(face),
    profile =
      source &&
      ((!resolveCardProfile(face).legendary ? ORDINARY_COLOR_PROFILES[source.key] : undefined) ??
        PRINTING_COLOR_PROFILES[source.key] ??
        LEGENDS_COLOR_PROFILES[source.key]);
  if (
    profile &&
    profile.source === source?.source &&
    (profile.legendary === undefined || profile.legendary === resolveCardProfile(face).legendary)
  )
    return profile.materials;
  const old = calibratedDualFrameProfile(face);
  return old ? { [retroFrameAsset(face)]: old } : {};
}

/** An outer-stock-only correction does not establish pigment coverage. */
export function hasCalibratedFramePigment(face: RenderedCardInput): boolean {
  return (
    Object.keys(baseFrameMaterials(face)).length > 0 ||
    Object.keys(modernComponentMaterials(face)).length > 0
  );
}

/** Source-bound black levels layer over the existing pigment fit. */
export function calibratedFrameMaterials(
  face: RenderedCardInput,
): Readonly<Record<string, FrameHsb>> {
  const reprint = earlyReprintColors(face);
  if (reprint) return reprint.materials;
  const expansion = earlyExpansionColors(face);
  if (expansion) return expansion.materials;
  const source = printingStockSource(face),
    dual = retroDualFrame(face);
  let materials = printingBlackPointMaterials(face, baseFrameMaterials(face), source).materials;
  // Both plates contribute outside the striped-paper mask. Correct each plate's
  // outer stock before compositing, so the overlay cannot repaint it pure black.
  if (dual && source && hasColorCalibration(face))
    materials = printingBlackPointMaterials(face, materials, {
      ...source,
      url: dual.overlay,
    }).materials;
  const modern = modernComponentMaterials(face);
  return modernPrintingProfile(face)?.inheritedFrom
    ? { ...modern, ...materials }
    : { ...materials, ...modern };
}

/** Exact selected URLs only: unused material variants are not asset dependencies.
 * Ordinary plates, lands, specialty layouts and donor profiles retain their fits. */
function modernComponentMaterials(face: RenderedCardInput): Readonly<Record<string, FrameHsb>> {
  const fit = modernPrintingProfile(face)?.componentMaterials;
  if (!fit || face.colorCalibration !== 'set-hsb-v1' || face.calibration === 'source') return {};
  const kind = faceFrame(face);
  // Dedicated layouts own their source inventory. A matching semantic palette
  // does not make unused ordinary boxes or P/T assets part of that painter.
  if (
    face.frameTemplate ||
    face.faces?.length ||
    (face.layout && !['normal', 'planeswalker', 'token'].includes(face.layout)) ||
    !['normal', 'planeswalker', 'planeswalker-large'].includes(kind) ||
    (kind === 'normal' && framePlate(face))
  )
    return {};
  const traits = resolveCardProfile(face);
  if (
    traits.land ||
    (!modernWalkerProfile(face) && !traits.legendary && resolveFrameColors(face).length < 2)
  )
    return {};
  const assets = profileAssets(traits, faceFrame(face));
  const urls = [
    assets.frame,
    assets.background,
    assets.boxes,
    ...(traits.legendary ? [assets.crown] : []),
    assets.pt,
  ];
  return Object.fromEntries(
    urls.filter((url) => Object.hasOwn(fit, url)).map((url) => [url, fit[url]!]),
  );
}

/** Stock is measured separately; white stock and unknown sources stay unchanged. */
export function calibratedPrintingStock(face: RenderedCardInput): string | undefined {
  const eighth =
    face.colorCalibration === 'set-hsb-v1' &&
    face.calibration !== 'source' &&
    eighthPrintingProfile(face);
  if (eighth) {
    const independent = eighth.inheritedFrom
      ? calibratedPrintingStock({ ...face, calibration: 'printing' })
      : undefined;
    if (independent) return independent;
    const stock = cardStock(face.setCode, face.borderColor).border;
    return stock === '#eeedeb'
      ? eighth.stock.white
      : stock === '#090806'
        ? eighth.stock.black
        : undefined;
  }
  const reprint = earlyReprintColors(face);
  if (reprint) return reprint.stock;
  const expansion = earlyExpansionColors(face);
  if (expansion) return expansion.stock;
  return printingBlackPointMaterials(face, baseFrameMaterials(face), printingStockSource(face))
    .stock;
}

function printingStockSource(face: RenderedCardInput): PrintingStockSource | undefined {
  // Land-paper blends have no pigment fit. Their outer stock still uses the
  // same pinned component frame and placement as the measured set family.
  if (
    hasPrintingStockCandidate(face) &&
    !face.frameTemplate &&
    !isRetro(face) &&
    !framePlate(face) &&
    (face.layout ?? 'normal') === 'normal' &&
    !/\b(Saga|Class|Planeswalker|Battle)\b/.test(face.typeLine ?? '') &&
    resolveCardProfile(face).land
  )
    return {
      url: profileAssets(resolveCardProfile(face)).frame,
      geometry: JSON.stringify(FACE_RECTS.frame),
    };
  if (!hasColorCalibration(face)) return undefined;
  if (isRetro(face))
    return {
      url: retroFrameAsset(face),
      geometry: JSON.stringify(retroFrameRect(face)),
      mask: retroBorderMask(face),
    };
  const source = printingColorSource(face);
  return source?.family === 'components'
    ? { url: source.frame, geometry: JSON.stringify(source.rect) }
    : undefined;
}

/** Keep component-frame inheritance source-compatible when an exact set starts
 * using a newer plate. This is a donor lookup, not a second rendering policy. */
export function calibratedComponentDonorMaterials(
  face: RenderedCardInput,
): Readonly<Record<string, FrameHsb>> {
  if (!hasColorCalibration(face)) return {};
  const source = componentPrintingColorSource(face),
    profile =
      source &&
      ((!resolveCardProfile(face).legendary ? ORDINARY_COLOR_PROFILES[source.key] : undefined) ??
        PRINTING_COLOR_PROFILES[source.key] ??
        LEGENDS_COLOR_PROFILES[source.key]);
  const materials =
    profile &&
    profile.source === source?.source &&
    (profile.legendary === undefined || profile.legendary === resolveCardProfile(face).legendary)
      ? profile.materials
      : {};
  const assets = profileAssets(resolveCardProfile(face));
  const stockSource = hasPrintingStockCandidate(face)
    ? { url: assets.frame, geometry: JSON.stringify(FACE_RECTS.frame) }
    : undefined;
  return printingBlackPointMaterials(face, materials, stockSource).materials;
}
