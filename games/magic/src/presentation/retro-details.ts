import type { RenderedCardInput, FaceRect } from './face-layout.js';
import { paintMana } from './canvas-text.js';
import { paintEarlyMana } from './historic-cost.js';
import { resolveFrameColors } from './profile.js';
import type { RetroSymbolPalette } from './retro-symbol-material.js';

/** Shared right edge leaves room for wide expressions without squeezing their glyphs. */
export function retroStatsPlacement(face: RenderedCardInput) {
  return ['4ed', '5ed'].includes(face.setCode?.toLowerCase() ?? '') &&
    !/\bLand\b/.test(face.typeLine ?? '')
    ? { right: 451, yOffset: 3, maxWidth: 130 }
    : null;
}

/** Fourth Edition parenthesizes the subtractive toughness expression in print. */
export function retroStatsText(face: RenderedCardInput): string {
  const toughness = String(face.toughness ?? '');
  const printed =
    face.wordingMode !== 'oracle' &&
    face.setCode?.toLowerCase() === '4ed' &&
    /^\d+-\*$/.test(toughness)
      ? `(${toughness})`
      : toughness;
  return `${face.power ?? ''}/${printed}`;
}

/** Set policies measured from cached development scans; no per-card geometry. */
export function retroPrintDetails(face: RenderedCardInput) {
  const set = face.setCode?.toLowerCase();
  const fourth = set === '4ed' && !/\bLand\b/.test(face.typeLine ?? '');
  if (set !== 'mir' && set !== 'tmp' && !fourth) return null;
  const colors = resolveFrameColors(face);
  return {
    titleX: fourth ? 42.5 : undefined,
    titleYOffset: fourth ? -5 : 0,
    typeX: fourth ? 42.5 : undefined,
    manaRight: fourth ? 446.5 : 448,
    manaTop: fourth ? 27.5 : 33.5,
    manaSize: 23.4,
    manaGap: fourth ? 3.6 : 1.7,
    statsShadow: fourth ? 1 : 1.5,
    statsOpaqueShadow: !fourth,
    setRight: set === 'mir' ? 434 : 432.5,
    setCenterY: set === 'mir' ? 388 : 387.5,
    setHeight: set === 'mir' ? 26 : 23.4,
    setOutline: 1.25,
    artistX: fourth ? 42.5 : 52,
    artistBaseline: fourth ? 628.5 : 624,
    artistSize: 19.5,
    legalBaseline: fourth ? 640.5 : 637.5,
    legalSize: 10.5,
    legalLight: fourth
      ? /\bArtifact\b/.test(face.typeLine ?? '') ||
        (colors.length === 1 && ['B', 'G'].includes(colors[0]!))
      : !/\bLand\b/.test(face.typeLine ?? '') &&
        !(colors.length === 1 && ['W', 'R'].includes(colors[0]!)),
    legalText:
      face.legalText === undefined
        ? fourth
          ? '©1995 Wizards of the Coast, Inc. All rights reserved.'
          : set === 'mir'
            ? '©1996 Wizards of the Coast, Inc. All rights reserved.'
            : '©1997 Wizards of the Coast, Inc.'
        : face.legalText,
  };
}

/** The tilted-card tap mark, distinct from both the diagonal T and modern arrow. */
export const paintHistoricMana: typeof paintMana = (c, symbol, x, y, size, images) => {
  if (symbol !== 'T') return paintMana(c, symbol, x, y, size, images);
  paintTap(c, x, y, size, '\uea31', 0.88);
};

/** Revised prints a diagonal T inside the same pale disc, not the later card mark. */
export const paintRevisedMana: typeof paintMana = (c, symbol, x, y, size, images) => {
  if (symbol !== 'T') return paintEarlyMana(c, symbol, x, y, size, images);
  paintTap(c, x, y, size, '\ue61c', 0.8);
};

export const paintFourthMana: typeof paintMana = (c, symbol, x, y, size, images) => {
  if (symbol !== 'T') return paintMana(c, symbol, x, y, size, images);
  paintHistoricMana(c, symbol, x, y, size, images);
};

/** Explicit original-symbol selection follows printing era. Early printings
 * spelled out tapping; Oracle {T} tokens use the earliest glyph (Revised).
 * See Wizards' "25 Random Things About Magic", item 16 (2009-02-16).
 */
const historicTapSets = new Set(
  '5ed 6ed 7ed ice hml all chr mir vis wth tmp sth exo usg ulg uds mmq nem pcy inv pls apc ody tor jud ons lgn scg brb btd ath dkm s99 s00 por po2 ptk'.split(
    ' ',
  ),
);
export function originalRulesSymbols(setCode?: string | null): typeof paintMana {
  const set = setCode?.toLowerCase() ?? '';
  if (['3ed', 'leg', 'drk', 'fem'].includes(set)) return paintRevisedMana;
  if (['lea', 'leb', '2ed', 'arn', 'atq'].includes(set)) return paintRevisedMana;
  if (set === '4ed') return paintFourthMana;
  return historicTapSets.has(set) ? paintHistoricMana : paintMana;
}

function paintTap(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  glyph: '\uea31' | '\ue61c',
  fontScale: number,
) {
  c.save();
  c.shadowColor = 'transparent';
  c.shadowOffsetX = c.shadowOffsetY = 0;
  c.fillStyle = '#c9c4be';
  c.beginPath();
  c.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = '#0d0f0f';
  c.font = `${size * fontScale}px "CardRenderer MTG Historic Symbols"`;
  c.textAlign = 'left';
  c.textBaseline = 'alphabetic';
  const m = c.measureText(glyph);
  c.fillText(
    glyph,
    x + (size - m.actualBoundingBoxLeft - m.actualBoundingBoxRight) / 2 + m.actualBoundingBoxLeft,
    y + (size + m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2,
  );
  c.restore();
}

/** Outline the existing monochrome bitmap during composition; no mask readback. */
export function paintOutlinedRetroSet(
  c: CanvasRenderingContext2D,
  image: ImageBitmap,
  x: number,
  y: number,
  w: number,
  h: number,
  outline: number,
  crop: FaceRect = [0, 0, 1, 1],
  palette: RetroSymbolPalette | null = null,
  sampling: ImageSmoothingQuality = 'low',
) {
  const layer = document.createElement('canvas');
  const pad = Math.ceil(outline * 2) + 1;
  layer.width = Math.ceil(w * 2) + pad * 2;
  layer.height = Math.ceil(h * 2) + pad * 2;
  const ink = layer.getContext('2d')!;
  // Fine book lines need area downsampling on this temporary mask as well as
  // the main canvas. Keep uncalibrated stencils on their existing sampling.
  ink.imageSmoothingQuality = sampling;
  ink.drawImage(
    image,
    crop[0] * image.width,
    crop[1] * image.height,
    crop[2] * image.width,
    crop[3] * image.height,
    pad,
    pad,
    w * 2,
    h * 2,
  );
  ink.globalCompositeOperation = 'source-in';
  ink.fillStyle = '#fff';
  ink.fillRect(0, 0, layer.width, layer.height);
  c.save();
  c.shadowColor = 'transparent';
  for (let i = 0; outline > 0 && i < 16; i++) {
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
  if (palette) {
    const gradient = ink.createLinearGradient(pad, pad, pad + w * 2, pad);
    palette.forEach((color, index) => gradient.addColorStop(index / 2, color));
    ink.fillStyle = gradient;
  }
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
