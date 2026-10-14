import type { RenderedCardInput } from './face-layout.js';
import { isRetro, retroFrameAsset, retroFrameRect, retroBorder } from './retro-frame.js';
import type { Rgb } from './hsb.js';
import type { DualFrameHsb, FrameHsb } from './frame-hsb.js';
import { printingColorSource } from './printing-color-source.js';
import { PRINTING_COLOR_PROFILES } from './printing-color-profiles.js';
import { DUAL_HSB_PROFILES, DUAL_MANA_TARGETS } from './old-dual-hsb-profiles.js';
import { MANA_PRINTING_TARGETS } from './mana-printing-profiles.js';
export function hasColorCalibration(face: RenderedCardInput): boolean {
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
  if (!hasColorCalibration(face) || !isRetro(face)) return undefined;
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
  if (!hasColorCalibration(face)) return undefined;
  const key = `${face.setCode?.toLowerCase()}-${retroBorder(face)}-${symbol}`;
  return MANA_PRINTING_TARGETS[key] ?? DUAL_MANA_TARGETS[key];
}

/** Every binding retains the exact pinned asset and geometry it was fitted to. */
export function calibratedFrameMaterials(
  face: RenderedCardInput,
): Readonly<Record<string, FrameHsb>> {
  if (!hasColorCalibration(face)) return {};
  const source = printingColorSource(face),
    profile = source && PRINTING_COLOR_PROFILES[source.key];
  if (profile && profile.source === source?.source) return profile.materials;
  const old = calibratedDualFrameProfile(face);
  return old ? { [retroFrameAsset(face)]: old } : {};
}
