import manifest from '../../assets.json' with { type: 'json' };
import type { RenderedCardInput } from './face-layout.js';
import type { CanvasImages } from './canvas-assets.js';
import { paintMana } from './canvas-text.js';
import { futureTreatment } from './future-frame.js';

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
    // Ordinary cards share the fitted curved rail. Textless plates have their
    // own curve and retain source geometry pending independent validation.
    const fitted = futureTreatment(face) === 'regular' && i < 4,
      size = fitted ? (/^[WUBRG]$/.test(symbol) ? 37.125 : 38.125) : (59 * 488) / 744,
      px = fitted ? [78.1626, 59.4852, 51.6465, 51.6465][i]! - size / 2 : (x[i]! * 488) / 744,
      py = fitted ? [111.851, 154.0759, 202.5071, 252.3427][i]! - size / 2 : (y[i]! * 680) / 1039;
    const url = futureManaAsset(symbol),
      image = url ? images.get(url) : undefined;
    if (url && !image) throw Error(`Futureshifted mana asset unavailable: ${url}`);
    if (image) c.drawImage(image, px, py, size, size);
    else paintMana(c, symbol, px, py, size, images, false);
  });
}
