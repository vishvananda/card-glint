import type { RenderedCardInput } from './face-layout.js';
import { paintRetroLetterEdges } from './retro-lettering.js';

const profiles = {
  arn: { size: 22, x: 49.75, y: 638.5, width: 1.02, edge: 1.25 },
  atq: { size: 21, x: 48.75, y: 638.5, width: 1.075, edge: 1.5 },
  drk: { size: 18, x: 48.75, y: 639.5, width: 1.045, edge: 1.25 },
} as const;

/** Shared printing geometry, fitted on development names with fixed scan poses.
 * These expansions use edge lettering; ABU's solid gray credits stay separate.
 * See early-expansion-artist.json for reserved examples and native isolation. */
export function paintEarlyExpansionArtist(
  c: CanvasRenderingContext2D,
  face: RenderedCardInput,
): boolean {
  const set = face.setCode?.toLowerCase();
  if (!face.artist || (set !== 'arn' && set !== 'atq' && set !== 'drk')) return false;
  const p = profiles[set];
  c.save();
  c.translate(p.x, p.y);
  c.scale(p.width, 1);
  c.font = `${p.size}px "CardRenderer MTG MPlantin", Georgia`;
  c.textAlign = 'left';
  c.textBaseline = 'alphabetic';
  c.letterSpacing = '0px';
  paintRetroLetterEdges(
    c,
    `Illus. © ${set === 'drk' ? '1994 ' : ''}${face.artist}`,
    0,
    0,
    338 / p.width,
    p.edge,
  );
  c.restore();
  return true;
}
