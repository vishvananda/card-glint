import type { CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import manifest from '../../assets.json' with { type: 'json' };
import type { RenderedCardInput } from './face-layout.js';
import { retroLandColors } from './retro-land-colors.js';
import { earlyReprintFrame } from './early-reprint-frame.js';
export { retroLandColors } from './retro-land-colors.js';
import { abuLandOutlineColor } from './abu-land-palette.js';

/** ABU uses concentric bands, not a modern split-color gradient. Retain the
 * palette separately from the visible original type line, which is just Land.
 * Revised has different paper geometry and is deliberately not inferred here. */
export function retroDualFrame(face: RenderedCardInput) {
  if (
    face.frameTemplate ||
    !['lea', 'leb', '2ed'].includes(face.setCode?.toLowerCase() ?? '') ||
    face.frameStyle === 'modern' ||
    /\b(Saga|Class|Planeswalker|Battle)\b/.test(face.typeLine ?? '') ||
    !(face.land ?? /\bLand\b/.test(face.typeLine ?? '')) ||
    (face.layout && face.layout !== 'normal')
  )
    return undefined;
  const calibrated = earlyReprintFrame(face)?.dual;
  if (calibrated) return calibrated;
  const colors = retroLandColors(face);
  if (colors.length !== 2) return undefined;
  // Printed concentric bands have their own color order. WUBRG is a semantic
  // palette order, not the band assignment. These five pairs reverse the
  // base/overlay in the ABU printings; the other five retain their order.
  const bands = ['WU', 'WG', 'UG', 'BG', 'RG'].includes(colors.join(''))
    ? [...colors].reverse()
    : colors;
  const root = `${manifest.RETRO_ROOT}/img/frames/old/abu/`;
  return {
    pinline: undefined,
    base: `${root}${bands[0]!.toLowerCase()}l.png`,
    overlay: `${root}${bands[1]!.toLowerCase()}l.png`,
    mask: `${manifest.CONJURER_ROOT}/img/frames/old/abu/dualLand.png`,
    outline: `${root}${abuLandOutlineColor(colors, face.setCode)!.toLowerCase()}l.png`,
  };
}

// The common AB dual perimeter sits two canonical pixels too low. Keep its
// stock window, art and paper geometry independent: moving the entire plate
// improves its outside edge but regresses the already aligned interior.
function hasAbuDualPerimeter(face: RenderedCardInput): boolean {
  return (
    ['lea', 'leb'].includes(face.setCode?.toLowerCase() ?? '') && retroDualFrame(face) !== undefined
  );
}

/** Face-composition only. Reuse the prepared material; no decode or readback. */
export function paintAbuDualPerimeter(
  c: CanvasContext,
  face: RenderedCardInput,
  frame: ImageBitmap,
  stock: string,
): void {
  if (!hasAbuDualPerimeter(face)) return;
  c.save();
  try {
    c.beginPath();
    c.rect(0, 0, 488, 680);
    c.rect(45, 45, 398, 587);
    c.clip('evenodd');
    const filter = c.filter;
    c.filter = 'none';
    c.fillStyle = stock;
    c.fillRect(0, 0, 488, 680);
    c.filter = filter;
    c.drawImage(frame, 0, -2, 488, 680);
  } finally {
    c.restore();
  }
}

/** Invalidate only affected face rasters; default etching is unchanged. */
export function retroDualFrameRevision(face: RenderedCardInput): string | undefined {
  return hasAbuDualPerimeter(face) ? 'abu-dual-perimeter-up2-v1' : undefined;
}
