import { type FaceRect, type RenderedCardInput } from './face-layout.js';
import { faceRects } from './special-frames.js';
import { splitPanels, panelRect } from './split-layout.js';
/** Visible illustration, excluding the opaque planeswalker rules panel. */
export function visibleArt(face: RenderedCardInput): FaceRect {
  return faceRects(face).art;
}
const cache = new WeakMap<RenderedCardInput, readonly [FaceRect, FaceRect]>();
const uv = ([x, y, w, h]: FaceRect): FaceRect => [x, 1 - y - h, x + w, 1 - y];
export const DEFAULT_ART_BOUNDS = [uv(faceRects({ name: '' }).art), [0, 0, 0, 0]] as const;
export function faceArtBounds(face?: RenderedCardInput): readonly [FaceRect, FaceRect] {
  if (!face) return DEFAULT_ART_BOUNDS;
  const old = cache.get(face);
  if (old) return old;
  const panels = splitPanels(face);
  const result: readonly [FaceRect, FaceRect] = panels.length
    ? [
        uv(panelRect(panels[0]!, visibleArt(panels[0]!.face))),
        uv(panelRect(panels[1]!, visibleArt(panels[1]!.face))),
      ]
    : [uv(visibleArt(face)), [0, 0, 0, 0]];
  cache.set(face, result);
  return result;
}
