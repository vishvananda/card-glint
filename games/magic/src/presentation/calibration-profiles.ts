import type { RenderedCardInput, FaceRect } from './face-layout.js';
import { isRetro, retroFrameAsset, retroFrameRect, retroBorder } from './retro-frame.js';
import type { HsbAdjustment, Rgb } from './hsb.js';
import {
  EARLY_HSB_PROFILES,
  EARLY_HSB_FRAME_ASSETS,
  EARLY_HSB_FRAME_RECTS,
  EARLY_MANA_TARGETS,
} from './early-hsb-profiles.js';
import { OLD_HSB_PROFILES, OLD_HSB_FRAME_ROOT, OLD_MANA_TARGETS } from './old-hsb-profiles.js';
import { REVISED_DUAL_HSB_PROFILES } from './revised-dual-hsb-profiles.js';
import type { DualFrameHsb } from './frame-hsb.js';
export function hasColorCalibration(face: RenderedCardInput): boolean {
  return (
    isRetro(face) &&
    (!face.layout || face.layout === 'normal') &&
    (face.colorCalibration === 'early-hsb-v1' || face.colorCalibration === 'set-hsb-v1')
  );
}
const earlyStockMatches = (face: RenderedCardInput) => {
  const set = face.setCode?.toLowerCase() ?? '';
  return ['lea', 'leb'].includes(set)
    ? retroBorder(face) === 'black'
    : ['2ed', '3ed'].includes(set) && retroBorder(face) === 'white';
};
const sameRect = (a: FaceRect | undefined, b: FaceRect) => a?.every((v, i) => v === b[i]) ?? false;
/** Separate frame/paper profiles take precedence over legacy shared fits. */
export function calibratedDualFrameProfile(face: RenderedCardInput): DualFrameHsb | undefined {
  if (
    !hasColorCalibration(face) ||
    face.setCode?.toLowerCase() !== '3ed' ||
    !earlyStockMatches(face)
  )
    return undefined;
  const asset = retroFrameAsset(face),
    material = asset.split('/').at(-1)!.replace('.png', '').toUpperCase(),
    profile = REVISED_DUAL_HSB_PROFILES[material];
  return profile?.asset === asset && sameRect(profile.rect, retroFrameRect(face))
    ? profile.adjustment
    : undefined;
}
/** A source or placement change invalidates the fit instead of silently reusing it. */
export function calibratedFrameProfile(face: RenderedCardInput): HsbAdjustment | undefined {
  if (!hasColorCalibration(face)) return undefined;
  const asset = retroFrameAsset(face),
    rect = retroFrameRect(face),
    material = asset.split('/').at(-1)!.replace('.png', '').toUpperCase(),
    set = face.setCode?.toLowerCase() ?? '',
    earlyKey = `${set}-${material}`;
  if (
    earlyStockMatches(face) &&
    EARLY_HSB_FRAME_ASSETS[earlyKey] === asset &&
    sameRect(EARLY_HSB_FRAME_RECTS[earlyKey], rect)
  )
    return EARLY_HSB_PROFILES[earlyKey];
  if (face.colorCalibration !== 'set-hsb-v1') return undefined;
  const profile = OLD_HSB_PROFILES[`${set}-${retroBorder(face)}-${material}`];
  return profile && OLD_HSB_FRAME_ROOT + profile.asset === asset && sameRect(profile.rect, rect)
    ? profile.adjustment
    : undefined;
}
export function calibratedManaTarget(face: RenderedCardInput, symbol: string): Rgb | undefined {
  if (!hasColorCalibration(face)) return undefined;
  const set = face.setCode?.toLowerCase() ?? '';
  return (
    (earlyStockMatches(face) ? EARLY_MANA_TARGETS[`${set}-${symbol}`] : undefined) ??
    (face.colorCalibration === 'set-hsb-v1'
      ? OLD_MANA_TARGETS[`${set}-${retroBorder(face)}-${symbol}`]
      : undefined)
  );
}
