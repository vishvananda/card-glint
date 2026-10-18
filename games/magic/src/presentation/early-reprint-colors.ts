import type { RenderedCardInput } from './face-layout.js';
import { earlyReprintFrame } from './early-reprint-frame.js';
import { COLORS as fem } from './early-reprint-fem-colors.js';
import { COLORS as fourth } from './early-reprint-4ed-colors.js';
import { COLORS as chronicles } from './early-reprint-chr-colors.js';

const profiles = { ...fem, ...fourth, ...chronicles };
/** Replacements bypass older pigment/stock curves fitted to different plates. */
export function earlyReprintColors(face: RenderedCardInput) {
  if (face.colorCalibration !== 'set-hsb-v1') return undefined;
  const frame = earlyReprintFrame(face);
  if (!frame) return undefined;
  const profile = profiles[frame.profile];
  if (profile?.source !== JSON.stringify([frame.asset, frame.frame])) return undefined;
  return { materials: { [frame.asset]: profile.adjustment }, stock: profile.stock };
}
