import type { RenderedCardInput } from './face-layout.js';
import { earlyReprintFrame } from './early-reprint-frame.js';
import { calibrationForFace } from '../calibration/selection.js';

/** Replacements bypass older pigment/stock curves fitted to different plates. */
export function earlyReprintColors(face: RenderedCardInput) {
  if (face.colorCalibration !== 'set-hsb-v1') return undefined;
  const frame = earlyReprintFrame(face);
  if (!frame) return undefined;
  const profile = calibrationForFace(face)!.colors[frame.profile.split('/')[1]!];
  if (profile?.source !== JSON.stringify([frame.asset, frame.frame])) return undefined;
  return { materials: { [frame.asset]: profile.adjustment }, stock: profile.stock };
}
