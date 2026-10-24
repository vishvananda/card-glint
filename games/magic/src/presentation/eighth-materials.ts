import type { RenderedCardInput } from './face-layout.js';
import { eighthPrintingProfile } from './eighth-printing-profile.js';
import { framePlate } from './frame-plates.js';
/** Match exact pinned URLs. A selected frame does not authorize another source's mask. */
export function eighthFrameMaterials(face: RenderedCardInput) {
  if (face.colorCalibration !== 'set-hsb-v1' || face.calibration === 'source') return undefined;
  const p = eighthPrintingProfile(face),
    plate = p && framePlate(face);
  if (!p || !plate) return undefined;
  const entries = [
    plate.frame,
    ...(plate.rightFrame ? [plate.rightFrame] : []),
    ...(face.power != null && face.toughness != null ? [plate.pt] : []),
  ].flatMap((url) => {
    const key = url.startsWith(p.root + '/') ? url.slice(p.root.length + 1) : '';
    const material = p.materials[key];
    return material ? [[url, material] as const] : [];
  });
  return Object.fromEntries(entries);
}
