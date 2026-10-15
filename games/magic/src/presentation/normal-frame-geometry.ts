import type { RenderedCardInput } from './face-layout.js';
import { cardStock, FACE_RECTS, FACE_WIDTH, FACE_HEIGHT, type FaceRect } from './face-layout.js';
import { resolveCardProfile } from './profile.js';
import { RENDERER_COMPONENT_ROOT } from './assets.js';
import { MAJOR_FRAME_INSETS, MAJOR_FRAME_SOURCE } from './major-frame-profiles.js';
/** Ordinary modern frames, in the pack's 488px reference coordinates.
 * Art needs its own aperture: painting to the asset's outer bevel erases the
 * inner black rim. The frame's horizontal adjustment preserves its height. */
export const NORMAL_FRAME_GEOMETRY = {
  artInset: 3,
  artRim: 0.75,
  frameInset: 1.5,
  typeWidthScale: 1.02,
} as const;

/** Frozen set-level checks support this inset on these ordinary frames. M21's
 * wider reference paper rejects it; unmeasured sets keep the existing panel. */
export function normalFrameInset(face: RenderedCardInput): number {
  if (
    !face.frameAssetFamily &&
    !resolveCardProfile(face).legendary &&
    (face.layout ?? 'normal') === 'normal' &&
    RENDERER_COMPONENT_ROOT === MAJOR_FRAME_SOURCE
  ) {
    const border =
      face.borderColor ?? (cardStock(face.setCode).border === '#eeedeb' ? 'white' : 'black');
    const key = `${face.setCode?.toLowerCase() ?? ''}/${border}`;
    if (Object.hasOwn(MAJOR_FRAME_INSETS, key)) return MAJOR_FRAME_INSETS[key]!;
  }
  return ['m15', 'm19', 'm20', 'war'].includes(face.setCode?.toLowerCase() ?? '')
    ? NORMAL_FRAME_GEOMETRY.frameInset
    : 0;
}

/** Follow the frame's horizontal rescaling, not a fixed inset for every set.
 * The inner aperture leaves the same fine rim on all four sides. Its rectangle
 * also drives artwork-only layers, foil masks and semantic geometry. */
export function normalArtRect(face: RenderedCardInput): FaceRect {
  const inset = normalFrameInset(face);
  const frameLeft = FACE_RECTS.frame[0] * FACE_WIDTH;
  const frameWidth = FACE_RECTS.frame[2] * FACE_WIDTH;
  const artLeft = FACE_RECTS.art[0] * FACE_WIDTH + NORMAL_FRAME_GEOMETRY.artInset;
  const left = frameLeft + inset + (artLeft - frameLeft) * (1 - (2 * inset) / frameWidth);
  const rim = NORMAL_FRAME_GEOMETRY.artRim;
  return [
    left / FACE_WIDTH,
    FACE_RECTS.art[1] + rim / FACE_HEIGHT,
    1 - (2 * left) / FACE_WIDTH,
    FACE_RECTS.art[3] - (2 * rim) / FACE_HEIGHT,
  ];
}
