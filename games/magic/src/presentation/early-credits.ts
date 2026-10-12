import type { RenderedCardInput } from './face-layout.js';
import { paintRetroLetterEdges } from './retro-lettering.js';

/** Frozen across Alpha and Unlimited; Beta remains a separate transfer check. */
export function usesEarlyCredits(face: RenderedCardInput): boolean {
  return ['lea', '2ed'].includes(face.setCode?.toLowerCase() ?? '');
}

export function paintEarlyCredits(c: CanvasRenderingContext2D, artist: string) {
  c.save();
  c.font = '22.5px "CardRenderer MTG MPlantin", Georgia';
  c.textAlign = 'left';
  c.textBaseline = 'alphabetic';
  paintRetroLetterEdges(c, `Illus. © ${artist}`, 49, 631, 338, 1.25);
  c.restore();
}
