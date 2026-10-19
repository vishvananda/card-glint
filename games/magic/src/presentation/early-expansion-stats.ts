import {
  type CanvasContext,
  rasterCanvas,
} from '../../../../packages/browser/src/canvas-raster.js';
import type { CardTextInk, RenderedCardInput } from './face-layout.js';
import { earlyExpansionArtist } from './early-expansion-artist.js';
import { paintTextInk } from './text-ink.js';

const profiles = {
  arn: { x: 452, y: 638, size: 26, width: 1.03, trim: 0.9, shadow: 2, shadowTrim: 0.4 },
  atq: { x: 452.5, y: 639, size: 27.5, width: 0.97, trim: 0.9, shadow: 1.5, shadowTrim: 0.2 },
  drk: { x: 452, y: 640, size: 27, width: 1.01, trim: 0.8, shadow: 1.25, shadowTrim: 0.3 },
} as const;

/** Same reviewed ordinary-frame scope as the artist credits. Shared set values;
 * no per-printing placement. Both DRK gold creatures pass the same-profile transfer. */
export function earlyExpansionStats(face: RenderedCardInput) {
  const set = face.setCode?.toLowerCase();
  if (
    (set !== 'arn' && set !== 'atq' && set !== 'drk') ||
    face.power == null ||
    face.toughness == null ||
    !earlyExpansionArtist(face)
  )
    return undefined;
  return profiles[set];
}

export function paintEarlyExpansionStats(c: CanvasContext, face: RenderedCardInput) {
  const p = earlyExpansionStats(face);
  if (!p) return false;
  c.save();
  try {
    c.translate(p.x, p.y);
    c.scale(p.width, 1);
    c.font = `${p.size}px "CardRenderer MTG MPlantin", Georgia`;
    c.textAlign = 'right';
    c.textBaseline = 'alphabetic';
    c.letterSpacing = '0px';
    // MPlantin maps U+2212 to blank ink. Its en dash supplies the printed long
    // minus while leaving the source's semantic power/toughness strings intact.
    const text = `${face.power}/${face.toughness}`.replaceAll('-', '–');
    paintStatsInk(c, text, 132 / p.width, p, face.textInk);
  } finally {
    c.restore();
  }
  return true;
}

/** Filled light strokes and a separately thinned lower-right shadow. The mask
 * is prepared with the face, with no pixel readback, decoding or font loading. */
function paintStatsInk(
  c: CanvasContext,
  text: string,
  maxWidth: number,
  p: { width: number; trim: number; shadow: number; shadowTrim: number },
  changes?: CardTextInk,
) {
  const layer = rasterCanvas();
  c.save();
  try {
    layer.width = c.canvas.width;
    layer.height = c.canvas.height;
    const ink = layer.getContext('2d');
    if (!ink) throw Error('Stats ink needs a Canvas2D context');
    const matrix = c.getTransform();
    ink.font = c.font;
    ink.textAlign = c.textAlign;
    ink.textBaseline = c.textBaseline;
    ink.letterSpacing = c.letterSpacing;
    c.shadowColor = 'transparent';
    c.shadowOffsetX = c.shadowOffsetY = 0;
    c.resetTransform();
    for (const [shift, trim, color] of [
      [p.shadow, p.shadowTrim, '#17140f'],
      [0, p.trim, '#f2eee3'],
    ] as const) {
      ink.resetTransform();
      ink.clearRect(0, 0, layer.width, layer.height);
      ink.setTransform(matrix);
      ink.globalAlpha = 1;
      ink.globalCompositeOperation = 'source-over';
      ink.fillStyle = color;
      const x = shift / p.width;
      paintTextInk(ink, text, x, shift, maxWidth, changes, 'stats', () => {
        // Span colors change the foreground, retaining the printing's shadow.
        if (shift) ink.fillStyle = color;
        ink.fillText(text, x, shift, maxWidth);
      });
      if (trim > 0) {
        ink.globalCompositeOperation = 'destination-out';
        ink.globalAlpha = 0.65;
        ink.lineWidth = trim * 2;
        ink.strokeText(text, x, shift, maxWidth);
      }
      c.drawImage(layer, 0, 0);
    }
  } finally {
    layer.width = layer.height = 0;
    c.restore();
  }
}
