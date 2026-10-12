import {
  paintRetroLetterEdges as paintLetterEdges,
  paintRetroGrayText,
} from './retro-lettering.js';
import type { RenderedCardInput } from './face-layout.js';
import { retroFamily } from './retro-frame.js';

/** Frozen Revised study; early frames and Revised lands have separate geometry. */
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

export function paintRevisedStats(c: CanvasRenderingContext2D, text: string, y: number) {
  c.save();
  c.font = '26px "CardRenderer MTG MPlantin", Georgia';
  c.textAlign = 'right';
  paintLetterEdges(c, text, 451, y + 12, 130, 1.25);
  c.restore();
}

export function paintRevisedCredits(c: CanvasRenderingContext2D, artist: string) {
  c.save();
  c.font = '22px "CardRenderer MTG Goudy", Georgia';
  c.textAlign = 'left';
  c.textBaseline = 'alphabetic';
  paintRetroGrayText(c, `Illus. © ${artist}`, 50, 642, 338, 1.25);
  c.restore();
}
