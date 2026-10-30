import { setFont } from './font-geometry.js';
import { type CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import { alphaTypography } from './alpha-typography.js';
import type { RenderedCardInput } from './face-layout.js';
import { paintRetroGrayText } from './retro-lettering.js';

/** Early gray credits retain the measured credit face and shared ABU geometry. */
export function usesEarlyCredits(face: RenderedCardInput): boolean {
  return ['lea', 'leb', '2ed'].includes(face.setCode?.toLowerCase() ?? '');
}

export function paintEarlyCredits(c: CanvasContext, artist: string, setCode?: string | null) {
  c.save();
  setFont(c, '22.5px "CardRenderer MTG MPlantin", Georgia');
  c.textAlign = 'left';
  c.textBaseline = 'alphabetic';
  paintRetroGrayText(
    c,
    `Illus. © ${artist}`,
    49,
    alphaTypography(setCode)?.artistBaseline ?? 631,
    338,
    1.25,
    alphaTypography(setCode)?.artistInk,
  );
  c.restore();
}
