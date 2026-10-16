import type { FaceRect, RenderedCardInput } from './face-layout.js';
import type { ManaSymbolTransform } from './symbol-adjustment.js';
import { framePlate } from './frame-plates.js';
import { usesPlanarFrameGeometry } from './planar-frame-geometry.js';
import { CONJURER_ROOT } from './styled-set-symbols.js';

/** Shared ordinary/colorshifted PLC cost fit. Caller deltas are composed by
 * printingManaAdjustment; symbols keep the existing glyphs and shadow. */
export function planarManaDefaults(face: RenderedCardInput): ManaSymbolTransform | undefined {
  if (
    face.setCode?.toLowerCase() !== 'plc' ||
    face.frameAssetFamily !== 'eighth' ||
    face.frameTemplate ||
    (face.layout && face.layout !== 'normal')
  )
    return undefined;
  const plate = framePlate(face);
  if (!plate || !usesPlanarFrameGeometry(face, plate.frame)) return undefined;
  return { dx: 1.25, dy: -2.9375, scaleX: 1.005, scaleY: 0.99375 };
}

/** Exact pinned PLC SVGs share this measured viewport rectangle. This replaces
 * the earlier ordinary-only translation; custom symbols keep their own fit. */
export function planarSetSymbolBounds(
  face: RenderedCardInput,
  source: string,
  url: string | null,
): FaceRect | undefined {
  if (
    face.setSymbol ||
    !usesPlanarFrameGeometry(face, source) ||
    !['c', 'u', 'r'].some(
      (rarity) => url === `${CONJURER_ROOT}/img/setSymbols/official/plc-${rarity}.svg`,
    )
  )
    return undefined;
  return [411, 388.75, 34, 25.5];
}
