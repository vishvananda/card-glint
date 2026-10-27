import { usesFourthDefaults, calibrationForFace } from '../calibration/selection.js';
import { earlyReprintFrame } from './early-reprint-frame.js';
import { eighthPrintingProfile } from './eighth-printing-profile.js';
import { eighthLandPalettes } from './eighth-land-material.js';
import { supportsEighthStyleDefaults } from './eighth-style-scope.js';
import { modernPrintingProfile } from './modern-printing-profile.js';
import { colorCalibrationCoverage } from './color-calibration-coverage.js';
import { eighthBasicProfile } from './eighth-basic-profile.js';
import { isRevisedLand, REVISED_LAND_ASSET } from './revised-land-frame.js';
import type { RenderedCardInput } from './face-layout.js';
import type { FrameHsb } from './frame-hsb.js';
import type {
  PrintingCalibrationComponent,
  PrintingCalibrationReport,
} from './printing-calibration-types.js';
import { printingCalibrationProfiles } from './printing-calibration-types.js';
import {
  printingCalibrationMaterials,
  calibratedManaTarget,
  supportsModernCalibration,
} from './printing-calibration-materials.js';
export * from './printing-calibration-types.js';

const pigment = (m: FrameHsb) =>
  'mask' in m ||
  m.hueDegrees !== 0 ||
  m.saturationScale !== 1 ||
  m.brightnessScale !== 1 ||
  m.rgbScale !== undefined ||
  m.valueGamma !== undefined;
/** Coverage is descriptive, not a full-card accuracy guarantee. No IO or mutable tables escape. */
export function resolvePrintingCalibration(input: RenderedCardInput): PrintingCalibrationReport {
  const result = printingCalibrationMaterials(input),
    { face, materials, assets } = result;
  const inheritedStyle = modernPrintingProfile(face);
  const eighth = eighthPrintingProfile(face);
  const sharedRevision =
    eighth?.revision ?? inheritedStyle?.revision ?? printingCalibrationProfiles[0]!.revision;
  const printingRevision = ['m21', '8ed'].includes(face.setCode?.toLowerCase() ?? '')
    ? sharedRevision
    : 1;
  const entries = Object.entries(materials);
  const component = (urls: string[]): PrintingCalibrationComponent => {
    if (!urls.length) return { status: 'source', assets: [] };
    const fallback = urls.filter((url) => result.fallbackAssets.includes(url));
    return {
      status: fallback.length === urls.length ? 'fallback' : fallback.length ? 'mixed' : 'measured',
      ...(fallback.length === urls.length
        ? { profile: result.fallbackProfile, revision: sharedRevision }
        : !fallback.length
          ? { profile: `printing:${face.setCode?.toLowerCase() ?? ''}`, revision: printingRevision }
          : {}),
      assets: urls,
    };
  };
  const textBox = component(
    entries
      .filter(
        ([url, m]) =>
          pigment(m) && ('mask' in m || url === assets.boxes || url.includes('/pt_boxes/')),
      )
      .map(([url]) => url),
  );
  const frame = component(
    entries
      .filter(
        ([url, m]) =>
          pigment(m) && ((url !== assets.boxes && !url.includes('/pt_boxes/')) || 'mask' in m),
      )
      .map(([url]) => url),
  );
  const coverage = colorCalibrationCoverage(face);
  const basic = eighthBasicProfile(face);
  const landPalettes = eighthLandPalettes(face);
  const procedural =
    landPalettes[0]?.url ?? basic?.frame ?? (isRevisedLand(face) ? REVISED_LAND_ASSET : undefined);
  if (procedural && coverage.frame) {
    for (const c of [frame, textBox])
      Object.assign(c, {
        status: eighth?.inheritedFrom ? 'fallback' : 'measured',
        profile: eighth?.inheritedFrom ? '8ed-eighth' : `printing:${face.setCode?.toLowerCase()}`,
        revision: 1,
        assets: [procedural],
      });
  }
  const interiorInk = component(entries.filter(([, m]) => m.blackPoint).map(([url]) => url));
  const symbols = new Set([
    ...(face.manaSymbols ?? []),
    ...[...(face.rulesText ?? '').matchAll(/\{([^}]+)\}/g)].map((m) => m[1]!),
    ...(face.rulesParagraphs ?? []).flatMap((p) =>
      p.runs.flatMap((r) => [...r.text.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]!)),
    ),
  ]);
  const correctedSymbols = [...symbols].filter((s) =>
    calibratedManaTarget(face, /^\d+$/.test(s) ? 'N' : s),
  );
  const manaSymbols: PrintingCalibrationComponent = correctedSymbols.length
    ? {
        status: 'measured',
        profile: `printing:${face.setCode?.toLowerCase() ?? ''}`,
        revision: 1,
        assets: [],
        symbols: correctedSymbols,
      }
    : basic?.glyph
      ? { status: 'measured', profile: 'printing:8ed', revision: 1, assets: [basic.glyph] }
      : { status: 'source', assets: [] };
  const border: PrintingCalibrationComponent = result.border
    ? {
        status: result.fallbackStock ? 'fallback' : 'measured',
        profile: result.fallbackStock
          ? result.fallbackProfile
          : `printing:${face.setCode?.toLowerCase() ?? ''}`,
        revision: result.fallbackStock ? sharedRevision : printingRevision,
        color: result.border,
        assets: entries.filter(([, m]) => m.outerStock).map(([url]) => url),
      }
    : { status: 'source', assets: [] };
  const defaults = eighth?.inheritedFrom
    ? { status: 'inherited' as const, profile: '8ed-eighth' as const, revision: eighth.revision }
    : inheritedStyle?.inheritedFrom
      ? {
          status: 'inherited' as const,
          profile: 'm21-modern' as const,
          revision: inheritedStyle.revision,
        }
      : undefined;
  if (defaults && manaSymbols.status === 'measured' && correctedSymbols.length) {
    manaSymbols.status = 'fallback';
    manaSymbols.profile = defaults.profile;
    manaSymbols.revision = defaults.revision;
  }
  const notices: string[] = [];
  if (usesFourthDefaults(face) && earlyReprintFrame(face)) {
    const donor = calibrationForFace(face)!;
    for (const part of [frame, textBox, interiorInk])
      if (part.status !== 'source') {
        part.status = 'fallback';
        part.profile = 'printing:4ed';
        part.revision = donor.revision;
      }
    notices.push(
      'Using Fourth Edition frame and layout defaults with Ice Age symbols and black surround; this printing has not been independently calibrated.',
    );
  }
  if (defaults)
    notices.push(
      eighth?.inheritedFrom
        ? 'Using shared 8ED layout and typography defaults; this printing has not been independently calibrated.'
        : 'Using shared M21 layout and typography defaults; this printing has not been independently calibrated.',
    );
  if (result.fallbackStock || result.fallbackAssets.length)
    notices.push(
      eighth?.inheritedFrom
        ? 'Using provisional 8ED defaults for compatible materials; black and white surrounds remain separate. This is not a measured calibration of this printing.'
        : 'Using provisional M21 defaults for compatible materials; this is not a measured calibration of this printing.',
    );
  if (
    (face.calibration === 'auto' || typeof face.calibration === 'object') &&
    [frame, textBox, interiorInk].some((c) => c.status === 'source')
  )
    notices.push('Some frame materials retain source colors or ink levels.');
  return {
    mode: face.calibration ?? 'legacy',
    components: { frame, textBox, border, interiorInk, manaSymbols },
    ...(defaults ? { defaults } : {}),
    notices,
  };
}
/** The host can show compatible named defaults beside the three policy choices. */
export function printingCalibrationOptions(face: RenderedCardInput) {
  return printingCalibrationProfiles.map((profile) => {
    const supported =
      profile.id === '8ed-eighth'
        ? supportsEighthStyleDefaults(face)
        : supportsModernCalibration(face);
    return {
      ...profile,
      supported,
      ...(!supported
        ? {
            reason:
              profile.id === '8ed-eighth'
                ? 'Requires an ordinary Eighth frame.'
                : 'Requires a modern frame.',
          }
        : {}),
    };
  });
}
