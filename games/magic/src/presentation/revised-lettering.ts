import { paintRetroGrayText } from './retro-lettering.js';
import type { RenderedCardInput, LiveChanges } from './face-layout.js';
import { retroFamily } from './retro-frame.js';

/** Revised printing uses solid gray ink over a lower-right shadow. */
export function usesRevisedLettering(face: RenderedCardInput): boolean {
  return face.setCode?.toLowerCase() === '3ed' && retroFamily(face) === 'fourth';
}

export function paintRevisedTitle(
  c: CanvasRenderingContext2D,
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
  c: CanvasRenderingContext2D,
  text: string,
  y: number,
  liveChanges?: LiveChanges,
) {
  c.save();
  c.font = '27.25px "CardRenderer MTG MPlantin", Georgia';
  c.textAlign = 'right';
  // Stats use lighter ink than the title/artist on the reviewed W/G/B scans.
  paintRetroGrayText(c, text, 451, y + 11, 130, 1.25, '#d4d4d4', liveChanges);
  c.restore();
}

export function paintRevisedCredits(c: CanvasRenderingContext2D, artist: string) {
  c.save();
  c.font = '22px "CardRenderer MTG MPlantin", Georgia';
  c.textAlign = 'left';
  c.textBaseline = 'alphabetic';
  paintRetroGrayText(c, `Illus. © ${artist}`, 50, 642, 338, 1.25);
  c.restore();
}
