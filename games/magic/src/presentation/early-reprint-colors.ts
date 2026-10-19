import type { RenderedCardInput } from './face-layout.js';
import { earlyReprintFrame } from './early-reprint-frame.js';
import { calibrationForFace } from '../calibration/selection.js';
import { retroDualFrame } from './retro-dual-frame.js';

/** Replacements bypass older pigment/stock curves fitted to different plates. */
export function earlyReprintColors(face: RenderedCardInput) {
  if (face.colorCalibration !== 'set-hsb-v1') return undefined;
  const frame = earlyReprintFrame(face);
  if (!frame) return undefined;
  const profile = calibrationForFace(face)!.colors[frame.profile.split('/')[1]!];
  if (profile?.source !== JSON.stringify([frame.asset, frame.frame])) return undefined;
  const materials = { [frame.asset]: profile.adjustment },
    dual = retroDualFrame(face);
  if (dual) {
    const color = dual.overlay.split('/').at(-1)![0]!.toUpperCase(),
      overlay = calibrationForFace(face)!.colors[`L-${color}`];
    if (overlay?.source !== JSON.stringify([dual.overlay, frame.frame])) return undefined;
    materials[dual.overlay] = overlay.adjustment;
  }
  return { materials, stock: profile.stock };
}
