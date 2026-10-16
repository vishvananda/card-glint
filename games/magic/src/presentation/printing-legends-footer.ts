import type { RenderedCardInput } from './face-layout.js';
import { paintLegendsFooter } from './legends-footer.js';
import { paintPrintingElement } from './printing-elements.js';

/** Keep the scan-validated native painter and its source evidence unchanged.
 * Only explicit artist controls split its disjoint artist/stats groups. */
export function paintPrintingLegendsFooter(
  c: CanvasRenderingContext2D,
  face: RenderedCardInput,
): boolean {
  if (!face.printingElements?.artist) return paintLegendsFooter(c, face);
  if (!paintLegendsFooter(c, { ...face, artist: null })) return false;
  paintPrintingElement(c, face, 'artist', () => {
    paintLegendsFooter(c, { ...face, power: null, toughness: null });
  });
  return true;
}
