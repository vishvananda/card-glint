import manifest from '../../assets.json' with { type: 'json' };
import type { SetCalibrationProfile } from '../calibration/types.js';
import type { ManaColor } from './symbol-adjustment.js';

/** All five plate bindings must match the shared placement. A partial or stale
 * profile cannot mix new geometry with an older source calibration. */
export function earlyReprintDual(profile: SetCalibrationProfile, colors: readonly string[]) {
  const p = profile.dualLand,
    geometry = profile.frames['L-dual'];
  if (!p || !geometry || geometry.family !== 'abu' || colors.length !== 2) return undefined;
  const root = `${manifest.RETRO_ROOT}/img/frames/old/abu/`;
  const asset = (color: string) => `${root}${color.toLowerCase()}l.png`;
  for (const color of ['W', 'U', 'B', 'R', 'G'] as const)
    if (
      p.sources[color]?.source !== JSON.stringify([asset(color), geometry.frame]) ||
      !p.pinline.palette[color]
    )
      return undefined;
  const outline = p.outlines[colors.join('')];
  if (!outline) return undefined;
  const bands = ['WU', 'WG', 'UG', 'BG', 'RG'].includes(colors.join(''))
    ? [...colors].reverse()
    : colors;
  const materialColors = new Set([...bands, outline] as ManaColor[]);
  const materials = Object.fromEntries(
    [...materialColors].map((color) => [asset(color), p.sources[color]!.adjustment]),
  );
  return {
    base: asset(bands[0]!),
    overlay: asset(bands[1]!),
    mask: `${manifest.CONJURER_ROOT}/img/frames/old/abu/dualLand.png`,
    outline: asset(outline),
    pinline: p.pinline,
    materials,
  };
}
