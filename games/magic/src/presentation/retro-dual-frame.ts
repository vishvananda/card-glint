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

/** Canonical art-height correction shared by Alpha/Beta duals. */
export function abuDualArtBottom(face: RenderedCardInput): number {
  return hasAbuDualPerimeter(face) ? 2 : 0;
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
    // This is a material-selection boundary, not a visible frame edge.
    // Partial clip coverage would apply twice (stock fill, then frame draw),
    // leaving a dark seam and differing between browser/worker backends.
    const matrix = c.getTransform();
    if (matrix.b !== 0 || matrix.c !== 0 || matrix.a <= 0 || matrix.d <= 0)
      throw Error('Historical perimeter composition requires axis-aligned raster scaling.');
    const x = (v: number) => (Math.round(v * matrix.a + matrix.e) - matrix.e) / matrix.a;
    const y = (v: number) => (Math.round(v * matrix.d + matrix.f) - matrix.f) / matrix.d;
    const left = x(45),
      top = y(45);
    c.rect(left, top, x(443) - left, y(632) - top);
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
  if (hasAbuDualPerimeter(face)) return 'abu-dual-perimeter-up2-paper-up6-art-up2-v4';
  const dual = retroDualFrame(face);
  return dual && dual.outline !== dual.overlay ? 'abu-dual-outline-raster-v4' : undefined;
}
