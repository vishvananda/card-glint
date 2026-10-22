import { profileAssets } from './assets.js';
import { framePlate } from './frame-plates.js';
import { isRetro, retroFrameAsset, retroFrameRect, retroBorder } from './retro-frame.js';
import { resolveCardProfile } from './profile.js';
import { normalFrameInset } from './normal-frame-geometry.js';
import { FACE_RECTS, type RenderedCardInput } from './face-layout.js';
import { retroDualFrame } from './retro-dual-frame.js';

import { isRevisedLand } from './revised-land-frame.js';

/** The calibration source is game-owned and independent of scan registration.
 * Multi-plate lands and special layouts require separate measured cohorts. */
export function printingColorSource(face: RenderedCardInput) {
  const set = face.setCode?.toLowerCase();
  if (
    !set ||
    !['lea', 'leb', '3ed', 'leg', '8ed', 'm21'].includes(set) ||
    (face.layout && face.layout !== 'normal') ||
    /\b(Saga|Class|Planeswalker|Battle)\b/.test(face.typeLine ?? '')
  )
    return undefined;
  const border = retroBorder(face);
  if (isRetro(face)) {
    if (retroDualFrame(face) || isRevisedLand(face)) return undefined;
    const frame = retroFrameAsset(face),
      rect = retroFrameRect(face);
    return {
      key: `${set}/${border}/retro/${frame.split('/').at(-1)}`,
      family: 'retro' as const,
      frame,
      rect,
      assets: { frame },
      source: JSON.stringify([frame, rect]),
    };
  }
  const plate = framePlate(face);
  if (plate) {
    if (plate.rightFrame) return undefined;
    return {
      key: `${set}/${border}/${face.frameAssetFamily ?? 'm15-accurate'}/${plate.frame.split('/').at(-1)}`,
      family: 'plate' as const,
      frame: plate.frame,
      rect: plate.rects.frame,
      assets: { frame: plate.frame, pt: plate.pt },
      source: JSON.stringify([plate.frame, plate.rects]),
    };
  }
  return componentPrintingColorSource(face);
}

/** Explicit component donor; a newer default plate must not change older hosts' sources. */
export function componentPrintingColorSource(face: RenderedCardInput) {
  const set = face.setCode?.toLowerCase(),
    border = retroBorder(face);
  const profile = resolveCardProfile(face);
  // Procedural land-paper tint needs independent calibration of the blend.
  if (profile.land) return undefined;
  const assets = profileAssets(profile);
  return {
    key: `${set}/${border}/components/${profile.boxes}/${profile.frame}`,
    family: 'components' as const,
    frame: assets.frame,
    rect: FACE_RECTS.frame,
    assets,
    source: JSON.stringify([assets, FACE_RECTS.frame, normalFrameInset(face)]),
  };
}
