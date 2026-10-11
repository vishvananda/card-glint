import { manaSymbolAsset } from './assets.js';
import { FACE_TEXT, symbolTextParts } from './face-layout.js';
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
) {
  const image = images.get(manaSymbolAsset(symbol) ?? '');
  context.save();
  // These are the shared --m-* token defaults, also used behind loaded DOM glyphs.
  const colors: Record<string, string> = {
    W: '#efe7cb',
    U: '#3d7ac3',
    B: '#33313c',
    R: '#c2432e',
    G: '#3b8a4e',
  };
  if (shadow) {
    const offset = 1.5372 * context.getTransform().a;
    context.shadowColor = '#000d';
    context.shadowOffsetX = -offset;
    context.shadowOffsetY = offset;
  }
  context.fillStyle = colors[symbol] ?? '#9aa4ae';
  context.beginPath();
  context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  context.fill();
  context.shadowColor = 'transparent';
  if (image) {
    context.drawImage(image, x, y, size, size);
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
) {
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
    context.drawImage(image, x, y, w, h);
    return;
  }
  const layer = document.createElement('canvas');
  layer.width = Math.max(1, Math.ceil(w * 2));
  layer.height = Math.max(1, Math.ceil(h * 2));
  const c = layer.getContext('2d')!;
  c.drawImage(image, 0, 0, layer.width, layer.height);
  c.globalCompositeOperation = 'source-in';
  c.fillStyle = ink;
  c.fillRect(0, 0, layer.width, layer.height);
  context.drawImage(layer, x, y, w, h);
  layer.width = layer.height = 0;
}
