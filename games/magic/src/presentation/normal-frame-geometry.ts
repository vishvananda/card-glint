import type { RenderedCardInput } from './face-layout.js';
/** Ordinary modern frames, in the pack's 488px reference coordinates.
 * Art needs its own aperture: painting to the asset's outer bevel erases the
 * inner black rim. The frame's horizontal adjustment preserves its height. */
export const NORMAL_FRAME_GEOMETRY = {
  artInset: 4.5,
  artRim: 1.5,
  frameInset: 1.5,
  typeWidthScale: 1.02,
} as const;

/** Frozen set-level checks support this inset on these ordinary frames. M21's
 * wider reference paper rejects it; unmeasured sets keep the existing panel. */
export function normalFrameInset(face: RenderedCardInput): number {
  return ['m15', 'm19', 'm20', 'war'].includes(face.setCode?.toLowerCase() ?? '')
    ? NORMAL_FRAME_GEOMETRY.frameInset
    : 0;
}
