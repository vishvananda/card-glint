import type { RenderedCardInput } from './face-layout.js';
import { isRetro, retroFrameAsset, retroFrameRect, retroBorder } from './retro-frame.js';
import type { Rgb } from './hsb.js';
import type { DualFrameHsb } from './frame-hsb.js';
import { DUAL_HSB_PROFILES, DUAL_MANA_TARGETS } from './old-dual-hsb-profiles.js';
export function hasColorCalibration(face: RenderedCardInput): boolean {
  const early = ['lea', 'leb', '2ed', '3ed'].includes(face.setCode?.toLowerCase() ?? '');
  return (
    isRetro(face) &&
    (!face.layout || face.layout === 'normal') &&
    (face.colorCalibration === 'set-hsb-v1' || (early && face.colorCalibration === 'early-hsb-v1'))
  );
}
/** Exact source, stock and placement guards. Rejected/new sources do not inherit
 * obsolete joint fits: those could create a good mean while tinting shadows. */
export function calibratedDualFrameProfile(face: RenderedCardInput): DualFrameHsb | undefined {
  if (!hasColorCalibration(face)) return undefined;
  const asset = retroFrameAsset(face),
    material = asset.split('/').at(-1)!.replace('.png', '').toUpperCase(),
    profile = DUAL_HSB_PROFILES[`${face.setCode?.toLowerCase()}-${retroBorder(face)}-${material}`];
  return profile?.asset === asset && profile.rect.every((v, i) => v === retroFrameRect(face)[i])
    ? profile.adjustment
    : undefined;
}
export function calibratedManaTarget(face: RenderedCardInput, symbol: string): Rgb | undefined {
  if (!hasColorCalibration(face)) return undefined;
  return DUAL_MANA_TARGETS[`${face.setCode?.toLowerCase()}-${retroBorder(face)}-${symbol}`];
}
