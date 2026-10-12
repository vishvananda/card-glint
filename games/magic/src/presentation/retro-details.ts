import type { RenderedCardInput } from './face-layout.js';
import { paintMana } from './canvas-text.js';

/** Verified against ordinary Mirage/Tempest scans. Other eras keep their existing policy. */
export function retroPrintDetails(face: RenderedCardInput) {
  const set = face.setCode?.toLowerCase();
  if (set !== 'mir' && set !== 'tmp') return null;
  return {
    manaRight: 450,
    manaTop: 33,
    manaSize: 23.4,
    manaGap: 1.7,
    setRight: 434,
    setCenterY: 385,
    setOutline: 1.25,
    artistX: 52,
    artistBaseline: 624,
    artistSize: 19.5,
    legalBaseline: 637.5,
    legalSize: 10.5,
    legalLight:
      !/\bLand\b/.test(face.typeLine ?? '') &&
      !(face.colors?.length === 1 && ['W', 'R'].includes(face.colors[0]!)),
    legalText:
      face.legalText === undefined
        ? set === 'mir'
          ? '©1996 Wizards of the Coast, Inc. All rights reserved.'
          : '©1997 Wizards of the Coast, Inc.'
        : face.legalText,
  };
}

/** The tilted-card tap mark, distinct from both the diagonal T and modern arrow. */
export const paintHistoricMana: typeof paintMana = (c, symbol, x, y, size, images) => {
  if (symbol !== 'T') return paintMana(c, symbol, x, y, size, images);
  c.save();
  c.shadowColor = 'transparent';
  c.shadowOffsetX = c.shadowOffsetY = 0;
  c.fillStyle = '#c9c4be';
  c.beginPath();
  c.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = '#0d0f0f';
  c.font = `${size * 0.88}px "CardRenderer MTG Historic Symbols"`;
  c.textAlign = 'left';
  c.textBaseline = 'alphabetic';
  const glyph = '\uea31',
    m = c.measureText(glyph);
  c.fillText(
    glyph,
    x + (size - m.actualBoundingBoxLeft - m.actualBoundingBoxRight) / 2 + m.actualBoundingBoxLeft,
    y + (size + m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2,
  );
  c.restore();
};

/** Outline the existing monochrome bitmap during composition; no mask readback. */
export function paintOutlinedRetroSet(
  c: CanvasRenderingContext2D,
  image: ImageBitmap,
  x: number,
  y: number,
  w: number,
  h: number,
  outline: number,
) {
  const layer = document.createElement('canvas');
  const pad = Math.ceil(outline * 2) + 1;
  layer.width = Math.ceil(w * 2) + pad * 2;
  layer.height = Math.ceil(h * 2) + pad * 2;
  const ink = layer.getContext('2d')!;
  ink.drawImage(image, pad, pad, w * 2, h * 2);
  ink.globalCompositeOperation = 'source-in';
  ink.fillStyle = '#fff';
  ink.fillRect(0, 0, layer.width, layer.height);
  c.save();
  c.shadowColor = 'transparent';
  for (let i = 0; i < 16; i++) {
    const angle = (i * Math.PI) / 8;
    c.drawImage(
      layer,
      x - pad / 2 + Math.cos(angle) * outline,
      y - pad / 2 + Math.sin(angle) * outline,
      layer.width / 2,
      layer.height / 2,
    );
  }
  ink.fillStyle = '#17140f';
  ink.fillRect(0, 0, layer.width, layer.height);
  c.drawImage(layer, x - pad / 2, y - pad / 2, layer.width / 2, layer.height / 2);
  c.restore();
  layer.width = layer.height = 0;
}

export function paintRetroCredits(
  c: CanvasRenderingContext2D,
  face: RenderedCardInput,
  details: NonNullable<ReturnType<typeof retroPrintDetails>>,
) {
  c.save();
  c.textAlign = 'left';
  c.textBaseline = 'alphabetic';
  if (face.artist) {
    c.fillStyle = '#f2eee3';
    c.shadowColor = '#000';
    c.shadowOffsetX = c.shadowOffsetY = c.getTransform().a;
    c.font = `${details.artistSize}px "CardRenderer MTG MPlantin", Georgia`;
    c.fillText(`Illus. ${face.artist}`, details.artistX, details.artistBaseline, 338);
  }
  c.shadowColor = 'transparent';
  c.fillStyle = details.legalLight ? '#f2eee3' : '#17140f';
  c.font = `${details.legalSize}px "CardRenderer MTG MPlantin", Georgia`;
  if (details.legalText) c.fillText(details.legalText, details.artistX, details.legalBaseline, 380);
  c.restore();
}
