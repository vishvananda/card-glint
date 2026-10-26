import { type CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import { paintRetroGrayText } from './retro-lettering.js';
import type { RenderedCardInput, CardTextInk } from './face-layout.js';
import { retroFamily } from './retro-frame.js';

/** Revised printing uses solid gray ink over a lower-right shadow. */
export function usesRevisedLettering(face: RenderedCardInput): boolean {
  return face.setCode?.toLowerCase() === '3ed' && retroFamily(face) === 'fourth';
}

export function paintRevisedTitle(
  c: CanvasContext,
  text: string,
  originalX: number,
  y: number,
  maxWidth: number,
) {
  c.save();
  c.font = '26px "CardRenderer MTG Goudy", Georgia';
  paintRetroGrayText(c, text, 40, y, maxWidth + originalX - 40, 1);
  c.restore();
}

export function paintRevisedStats(
  c: CanvasContext,
  text: string,
  y: number,
  liveChanges?: CardTextInk,
) {
  c.save();
  c.font = '27.25px "CardRenderer MTG MPlantin", Georgia';
  c.textAlign = 'right';
  // Stats use lighter ink than the title/artist on the reviewed W/G/B scans.
  paintRetroGrayText(c, text, 450.5, y + 11.5, 130, 1.25, '#d4d4d4', liveChanges);
  c.restore();
}

export function paintRevisedCredits(c: CanvasContext, artist: string) {
  c.save();
  c.font = '22px "CardRenderer MTG MPlantin", Georgia';
  c.textAlign = 'left';
  c.textBaseline = 'alphabetic';
  c.translate(48, 642.5);
  c.scale(1.02, 1);
  paintRetroGrayText(c, `Illus. © ${artist}`, 0, 0, 338 / 1.02, 1.25);
  c.restore();
}
