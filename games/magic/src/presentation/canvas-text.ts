import { paintOriginalWhite } from './historical-white.js';
import { colorGlyphTransform } from './symbol-adjustment.js';
import { MANA_COLORS, GENERIC_MANA_COLOR } from './mana-colors.js';
import { manaSymbolAsset } from './assets.js';
import { FACE_TEXT, symbolTextParts, type FaceRect } from './face-layout.js';
import type { ManaSymbolTransform } from './symbol-adjustment.js';
import type { CanvasImages } from './canvas-assets.js';

interface Token {
  text: string;
  symbol: boolean;
  width: number;
}

/** Greedy wrapping measures the actual loaded font, keeping mana glyphs indivisible. */
export function rulesLines(
  context: CanvasRenderingContext2D,
  text: string,
  width: number,
  size: number,
): Token[][] {
  const output: Token[][] = [];
  for (const paragraph of text.split('\n')) {
    let line: Token[] = [],
      used = 0;
    const tokens = symbolTextParts(paragraph).flatMap((part) =>
      part.symbol
        ? [{ text: part.symbol, symbol: true }]
        : (part.value.match(/\s+|\S+/g) ?? []).map((text) => ({ text, symbol: false })),
    );
    for (const token of tokens) {
      // Break a long unspaced word, too: effective text and localization may contain one.
      const parts =
        !token.symbol && context.measureText(token.text).width > width
          ? [...token.text].map((text) => ({ text, symbol: false }))
          : [token];
      for (const part of parts) {
        const measured = part.symbol ? size * 0.94 : context.measureText(part.text).width;
        if (used + measured > width && line.length) {
          output.push(line);
          line = [];
          used = 0;
        }
        if (!line.length && /^\s+$/.test(part.text)) continue;
        line.push({ ...part, width: measured });
        used += measured;
      }
    }
    output.push(line);
  }
  return output;
}

export function paintMana(
  context: CanvasRenderingContext2D,
  symbol: string,
  x: number,
  y: number,
  size: number,
  images: CanvasImages,
  shadow = false,
  adjustment?: ManaSymbolTransform,
) {
  if (symbol === 'W' && images.originalWhiteGlyph) {
    paintOriginalWhite(
      context,
      x,
      y,
      size,
      size * 0.87,
      images.manaColors?.W,
      colorGlyphTransform(adjustment, symbol),
    );
    return;
  }
  const numeric = /^\d+$/.test(symbol);
  const glyphDelta = colorGlyphTransform(adjustment, symbol);
  const defaultScale = images.manaGlyphScales?.[symbol] ?? 1;
  const numeral = numeric
    ? adjustment
      ? images.manaNumerals?.get(symbol)
      : undefined
    : defaultScale !== 1 || glyphDelta
      ? images.manaGlyphs?.get(symbol)
      : undefined;
  const image = images.get(manaSymbolAsset(symbol) ?? '');
  context.save();
  // A title's shadow must not leak into a shadow-free inline or historical symbol.
  context.shadowColor = 'transparent';
  context.shadowOffsetX = context.shadowOffsetY = 0;
  // These are the shared --m-* token defaults, also used behind loaded DOM glyphs.
  if (shadow) {
    const matrix = context.getTransform();
    context.shadowColor = '#000d';
    // Canvas shadows use device pixels. Rotate the local down-left vector with
    // the panel; matrix.a alone becomes zero on a quarter-turned split card.
    const [dx, dy] = images.manaCostShadow ?? [-1.5372, 1.5372];
    context.shadowOffsetX = dx * matrix.a + dy * matrix.c;
    context.shadowOffsetY = dx * matrix.b + dy * matrix.d;
  }
  context.fillStyle = images.manaColors?.[symbol] ?? MANA_COLORS[symbol] ?? GENERIC_MANA_COLOR;
  context.beginPath();
  context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  context.fill();
  context.shadowColor = 'transparent';
  if (numeral)
    context.drawImage(numeral.image, 0, 0, numeral.width, numeral.height, x, y, size, size);
  // Prepared glyphs contain only the numeral; the disc and its shadow stay put.
  if (numeral) {
    const numberDx = numeric ? (adjustment?.numberDx ?? 0) : (glyphDelta?.dx ?? 0);
    const numberDy = numeric ? (adjustment?.numberDy ?? 0) : (glyphDelta?.dy ?? 0);
    const numberScale = numeric
      ? (adjustment?.numberScale ?? 1)
      : defaultScale * (glyphDelta?.scale ?? 1);
    // Keep colored ink inside its stationary disc, including extreme editor deltas.
    if (!numeric) {
      context.beginPath();
      context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
      context.clip();
    }
    if (numberDx || numberDy || numberScale !== 1) {
      context.translate(x + size / 2 + numberDx, y + size / 2 + numberDy);
      context.scale(numberScale, numberScale);
      context.translate(-x - size / 2, -y - size / 2);
    }
  }
  if (numeral || image) {
    if (numeral)
      context.drawImage(
        numeral.image,
        numeral.width,
        0,
        numeral.width,
        numeral.height,
        x,
        y,
        size,
        size,
      );
    else context.drawImage(image!, x, y, size, size);
    context.restore();
    return;
  }
  context.fillStyle = symbol === 'B' ? 'white' : '#17140f';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = `bold ${size * 0.62}px Georgia`;
  context.fillText(symbol, x + size / 2, y + size / 2, size * 0.9);
  context.restore();
}

export function paintRules(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  width: number,
  font: number | { size: number; italic: boolean },
  images: CanvasImages,
) {
  const size = typeof font === 'number' ? font : font.size;
  context.font = `${typeof font !== 'number' && font.italic ? 'italic ' : ''}${size}px "CardRenderer MTG MPlantin", Georgia`;
  const paragraphs = text
    .split('\n')
    .map((paragraph) => rulesLines(context, paragraph, width, size));
  context.textBaseline = 'top';
  for (const paragraph of paragraphs) {
    for (const line of paragraph) {
      let left = x;
      for (const token of line) {
        if (token.symbol)
          paintMana(context, token.text, left + size * 0.07, y + size * 0.03, size * 0.8, images);
        else context.fillText(token.text, left, y);
        left += token.width;
      }
      y += size;
    }
    y += FACE_TEXT.paragraphGap;
  }
}

/** Match the native single-line plates without horizontally squeezing the letters. */
export function ellipsizedText(
  context: CanvasRenderingContext2D,
  text: string,
  width: number,
): string {
  if (context.measureText(text).width <= width) return text;
  const letters = [...text];
  while (letters.length && context.measureText(`${letters.join('')}…`).width > width) letters.pop();
  return letters.length || context.measureText('…').width <= width ? `${letters.join('')}…` : '';
}

/** Preserve the complete printed line. Reduce size first, then fit the remaining width. */
export function paintFittedText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  width: number,
  size: number,
  bold = false,
  widthScale = 1,
  family:
    | 'CardRenderer MTG Beleren'
    | 'CardRenderer MTG Matrix'
    | 'CardRenderer MTG Goudy'
    | 'CardRenderer MTG MPlantin' = 'CardRenderer MTG Beleren',
) {
  if (!(width > 0)) throw Error('Magic title/type plate has no text space.');
  context.save();
  context.font = `${bold ? 'bold ' : ''}${size}px "${family}", Georgia`;
  const measured = context.measureText(text).width;
  // A long type already uses the available width. Expanding it would force a
  // smaller font height without gaining any horizontal space.
  if (widthScale > 1 && measured * widthScale > width) widthScale = 1;
  if (widthScale !== 1) {
    context.translate(x, 0);
    context.scale(widthScale, 1);
    x = 0;
    width /= widthScale;
  }
  if (measured > width) {
    size = Math.max(size * 0.78, (size * width) / measured);
    context.font = `${bold ? 'bold ' : ''}${size}px "${family}", Georgia`;
  }
  context.fillText(text, x, y, width);
  context.restore();
}

/** Recolor monochrome set vectors without relying on Canvas2D filter support. */
export function paintSetSymbol(
  context: CanvasRenderingContext2D,
  image: ImageBitmap,
  code: string | undefined | null,
  rarity: string | undefined,
  x: number,
  y: number,
  w: number,
  h: number,
  crop: FaceRect = [0, 0, 1, 1],
) {
  const source = [
    crop[0] * image.width,
    crop[1] * image.height,
    crop[2] * image.width,
    crop[3] * image.height,
  ] as const;
  const ink = (
    {
      uncommon: '#aaaeb2',
      rare: '#bc923f',
      mythic: '#c65c2d',
      special: '#8664af',
      bonus: '#bc923f',
    } as Record<string, string>
  )[rarity ?? 'common'];
  if (!ink || ['forge', 'glint'].includes(code?.toLowerCase() ?? '')) {
    context.drawImage(image, ...source, x, y, w, h);
    return;
  }
  const layer = document.createElement('canvas');
  layer.width = Math.max(1, Math.ceil(w * 2));
  layer.height = Math.max(1, Math.ceil(h * 2));
  const c = layer.getContext('2d')!;
  c.drawImage(image, ...source, 0, 0, layer.width, layer.height);
  c.globalCompositeOperation = 'source-in';
  c.fillStyle = ink;
  c.fillRect(0, 0, layer.width, layer.height);
  context.drawImage(layer, x, y, w, h);
  layer.width = layer.height = 0;
}
