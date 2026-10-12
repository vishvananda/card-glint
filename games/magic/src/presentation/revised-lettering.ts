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
  paintLetterEdges(c, text, 40, y, maxWidth + originalX - 40, 1);
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
  c.font = '22px "CardRenderer MTG MPlantin", Georgia';
  c.textAlign = 'left';
  c.textBaseline = 'alphabetic';
  paintLetterEdges(c, `Illus. © ${artist}`, 50, 642, 338, 1.25);
  c.restore();
}

/**
 * Printed light/dark letter edges with the frame visible through the interior.
 * Two translated masks are subtracted during cached face composition only;
 * fonts are already loaded, and no pixel readback or per-frame work is needed.
 */
function paintLetterEdges(
  c: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  offset: number,
) {
  c.save();
  c.shadowColor = 'transparent';
  c.shadowOffsetX = c.shadowOffsetY = 0;
  const layer = document.createElement('canvas');
  layer.width = c.canvas.width;
  layer.height = c.canvas.height;
  const ink = layer.getContext('2d');
  if (!ink) throw Error('Revised lettering needs a Canvas2D context');
  const matrix = c.getTransform();
  ink.font = c.font;
  ink.textAlign = c.textAlign;
  ink.textBaseline = c.textBaseline;
  ink.letterSpacing = c.letterSpacing;
  c.resetTransform();
  for (const [shift, subtract, color] of [
    [0, offset, '#f2eee3'],
    [offset, 0, '#17140f'],
  ] as const) {
    ink.resetTransform();
    ink.clearRect(0, 0, layer.width, layer.height);
    ink.setTransform(matrix);
    ink.globalCompositeOperation = 'source-over';
    ink.fillStyle = color;
    ink.fillText(text, x + shift, y + shift, maxWidth);
    ink.globalCompositeOperation = 'destination-out';
    ink.fillText(text, x + subtract, y + subtract, maxWidth);
    c.drawImage(layer, 0, 0);
  }
  layer.width = layer.height = 0;
  c.restore();
}
