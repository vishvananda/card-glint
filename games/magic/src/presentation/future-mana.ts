import manifest from '../../assets.json' with { type: 'json' };
import type { RenderedCardInput } from './face-layout.js';
import type { CanvasImages } from './canvas-assets.js';
import { paintMana } from './canvas-text.js';

export function futureManaAsset(symbol: string): string | null {
  if (/^[WUBRG]$/.test(symbol))
    return `${manifest.MSE_TEMPLATE_ROOT}/magic-mana-future.mse-symbol-font/mana_${symbol.toLowerCase()}.png`;
  if (/^(?:[0-9]|1[0-9]|20|X|[WUBRG]\/[WUBRG])$/.test(symbol))
    return `${manifest.CONJURER_ROOT}/img/manaSymbols/future/f${symbol.toLowerCase().replace('/', '')}.png`;
  return null;
}
export function futureManaAssets(face: RenderedCardInput): string[] {
  return (face.manaSymbols ?? []).map(futureManaAsset).filter((u): u is string => u !== null);
}

/** Source cost positions follow the curved left rail. Inline mana keeps the
 * ordinary text glyphs; it is not printed in these framed cost medallions. */
export function paintFutureMana(
  c: CanvasRenderingContext2D,
  face: RenderedCardInput,
  images: CanvasImages,
) {
  const x = [91, 61, 46, 46, 59, 106],
    y = [140, 207, 281, 356, 437, 512];
  const symbols = face.manaSymbols ?? [];
  if (symbols.length > x.length) throw Error('Futureshifted cost exceeds the six source positions');
  symbols.forEach((symbol, i) => {
    const px = (x[i]! * 488) / 744,
      py = (y[i]! * 680) / 1039,
      size = (59 * 488) / 744;
    const url = futureManaAsset(symbol),
      image = url ? images.get(url) : undefined;
    if (url && !image) throw Error(`Futureshifted mana asset unavailable: ${url}`);
    if (image) c.drawImage(image, px, py, size, size);
    else paintMana(c, symbol, px, py, size, images, false);
  });
}
