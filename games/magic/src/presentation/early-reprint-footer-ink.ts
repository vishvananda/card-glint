import {
  type CanvasContext,
  rasterCanvas,
} from '../../../../packages/browser/src/canvas-raster.js';
/** MPlantin lacks precomposed o-macron. Compose its native o and visible
 * modifier macron without changing the word's advance or stored Unicode. */
function footerGlyphs(
  c: CanvasContext,
  method: 'fillText' | 'strokeText',
  text: string,
  maxWidth: number,
) {
  const base = text.replaceAll('ō', 'o');
  c[method](base, 0, 0, maxWidth);
  if (base === text) return;
  const natural = c.measureText(base).width,
    scale = Math.min(1, maxWidth / natural),
    o = c.measureText('o').width,
    bar = c.measureText('ˉ').width;
  const left = -(c.textAlign === 'right'
    ? natural * scale
    : c.textAlign === 'center'
      ? (natural * scale) / 2
      : 0);
  const align = c.textAlign;
  c.textAlign = 'left';
  try {
    for (let i = 0; i < text.length; i++)
      if (text[i] === 'ō') {
        const end = c.measureText(base.slice(0, i + 1)).width;
        c[method]('ˉ', left + (end - o + (o - bar) / 2) * scale, 0, bar * scale);
      }
  } finally {
    c.textAlign = align;
  }
}

/** Filled strokes, independent shadow and bounded perimeter thinning, prepared
 * once with the face. No font loading or pixel readback in the painter. */
export function paintEarlyReprintFooterInk(
  c: CanvasContext,
  text: string,
  maxWidth: number,
  p: { width: number; trim: number; shadow: number },
) {
  const layer = rasterCanvas();
  layer.width = c.canvas.width;
  layer.height = c.canvas.height;
  c.save();
  try {
    const matrix = c.getTransform(),
      ink = layer.getContext('2d');
    if (!ink) throw Error('Footer ink needs a Canvas2D context');
    ink.setTransform(matrix);
    ink.font = c.font;
    ink.textAlign = c.textAlign;
    ink.textBaseline = c.textBaseline;
    ink.letterSpacing = c.letterSpacing;
    ink.fillStyle = c.fillStyle;
    footerGlyphs(ink, 'fillText', text, maxWidth);
    if (p.trim > 0) {
      ink.globalCompositeOperation = 'destination-out';
      ink.lineWidth = p.trim * 2;
      footerGlyphs(ink, 'strokeText', text, maxWidth);
    }
    c.resetTransform();
    c.shadowBlur = 0;
    c.shadowOffsetX = (matrix.a / p.width) * p.shadow;
    c.shadowOffsetY = matrix.d * p.shadow;
    c.drawImage(layer, 0, 0);
  } finally {
    c.restore();
    layer.width = layer.height = 0;
  }
}
