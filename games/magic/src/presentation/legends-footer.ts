import { paintTextInk } from './text-ink.js';
import type { RenderedCardInput, CardTextInk } from './face-layout.js';
import { legendsFrame } from './legends-frame.js';

interface Lettering {
  size: number;
  x: number;
  width: number;
  shadow: number;
  inset: number;
  align: CanvasTextAlign;
  maximum: number;
}
const artist: Lettering = {
  size: 18,
  x: 49.25,
  width: 1.04,
  shadow: 2,
  inset: 0.1,
  align: 'left',
  maximum: 338,
};
const stats: Lettering = {
  size: 27.8,
  x: 452.25,
  width: 0.99,
  shadow: 1.75,
  inset: 0.3,
  align: 'right',
  maximum: 68,
};
/** Prepare solid, slightly lighter-weight ink once with the cached face. The
 * transparent stroke removes only the glyph edge; it never erases frame pixels.
 * Shadows belong to the finished glyph, independent of the title's state. */
function paint(
  c: CanvasRenderingContext2D,
  text: string,
  style: Lettering,
  liveChanges?: CardTextInk,
) {
  const layer = document.createElement('canvas');
  layer.width = c.canvas.width;
  layer.height = c.canvas.height;
  const ink = layer.getContext('2d');
  if (!ink) throw Error('Legends footer needs a Canvas2D context');
  const matrix = c.getTransform();
  ink.setTransform(matrix);
  ink.translate(style.x, 640);
  ink.scale(style.width, 1);
  ink.font = `${style.size}px "CardRenderer MTG MPlantin", Georgia`;
  ink.textAlign = style.align;
  ink.textBaseline = 'alphabetic';
  ink.letterSpacing = '0px';
  ink.fillStyle = '#f2eee3';
  paintTextInk(ink, text, 0, 0, style.maximum / style.width, liveChanges);
  ink.globalCompositeOperation = 'destination-out';
  ink.lineWidth = 2 * style.inset;
  ink.strokeText(text, 0, 0, style.maximum / style.width);
  c.save();
  c.resetTransform();
  c.shadowColor = '#17140f';
  c.shadowBlur = 0;
  c.shadowOffsetX = c.shadowOffsetY = style.shadow * matrix.a;
  c.drawImage(layer, 0, 0);
  c.restore();
  layer.width = layer.height = 0;
}

/** One Legends footer profile fitted on training printings and validated on
 * reserved scans. Copyright is part of this set's illustrator credit. */
export function paintLegendsFooter(c: CanvasRenderingContext2D, face: RenderedCardInput): boolean {
  if (!legendsFrame(face) || (face.borderColor && face.borderColor !== 'black')) return false;
  if (face.artist) paint(c, `Illus. © 1994 ${face.artist}`, artist);
  if (face.power != null && face.toughness != null)
    paint(c, `${face.power}/${face.toughness}`, stats, face.textInk);
  return true;
}
