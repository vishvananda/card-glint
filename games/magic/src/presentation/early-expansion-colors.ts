import type { RenderedCardInput } from './face-layout.js';
import { earlyExpansionFrame } from './early-expansion-frame.js';
import { EARLY_EXPANSION_COLORS } from '../data/tables.js';

/** Exact source/geometry binding. These replacements must not receive legacy
 * source ink curves or stock masks after their component colors are applied. */
export function earlyExpansionColors(face: RenderedCardInput) {
  if (face.colorCalibration !== 'set-hsb-v1') return undefined;
  const frame = earlyExpansionFrame(face);
  if (!frame) return undefined;
  const profile = EARLY_EXPANSION_COLORS[`${face.setCode?.toLowerCase()}/${frame.material}`];
  if (profile?.source !== JSON.stringify([frame.asset, frame.frame])) return undefined;
  return { materials: { [frame.asset]: profile.adjustment }, stock: profile.stock };
}
