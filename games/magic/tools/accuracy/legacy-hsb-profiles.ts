// Historical pre-dual baseline for reproducible diagnostics, never runtime.
import type { RenderedCardInput, FaceRect } from '../../src/presentation/face-layout.js';
import {
  isRetro,
  retroFrameAsset,
  retroFrameRect,
  retroBorder,
} from '../../src/presentation/retro-frame.js';
import type { HsbAdjustment } from '../../src/presentation/hsb.js';
import {
  EARLY_HSB_PROFILES,
  EARLY_HSB_FRAME_ASSETS,
  EARLY_HSB_FRAME_RECTS,
} from '../../src/presentation/early-hsb-profiles.js';
import { OLD_HSB_PROFILES, OLD_HSB_FRAME_ROOT } from '../../src/presentation/old-hsb-profiles.js';
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
