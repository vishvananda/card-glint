import type { RenderedCardInput } from './face-layout.js';
import { paintRetroGrayText } from './retro-lettering.js';

/** Early gray credits retain the measured credit face and shared ABU geometry. */
export function usesEarlyCredits(face: RenderedCardInput): boolean {
  return ['lea', 'leb', '2ed'].includes(face.setCode?.toLowerCase() ?? '');
}

export function paintEarlyCredits(c: CanvasRenderingContext2D, artist: string) {
  c.save();
  c.font = '22.5px "CardRenderer MTG MPlantin", Georgia';
  c.textAlign = 'left';
  c.textBaseline = 'alphabetic';
  paintRetroGrayText(c, `Illus. © ${artist}`, 49, 631, 338, 1.25);
  c.restore();
}
