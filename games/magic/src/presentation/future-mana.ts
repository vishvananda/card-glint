import { type CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import manifest from '../../assets.json' with { type: 'json' };
import type { RenderedCardInput } from './face-layout.js';
import type { CanvasImages } from './canvas-assets.js';
import { paintMana } from './canvas-text.js';
import { futureTreatment } from './future-frame.js';

export function futureManaAsset(symbol: string): string | null {
  if (/^[WUBRG]$/.test(symbol))
    return `${manifest.MSE_TEMPLATE_ROOT}/magic-mana-future.mse-symbol-font/mana_${symbol.toLowerCase()}.png`;
  if (/^(?:[0-9]|1[0-9]|20|X)$/.test(symbol))
    return `${manifest.CONJURER_ROOT}/img/manaSymbols/future/f0.png`;
  if (/^[WUBRG]\/[WUBRG]$/.test(symbol))
    return `${manifest.CONJURER_ROOT}/img/manaSymbols/future/f${symbol.toLowerCase().replace('/', '')}.png`;
  return null;
}
export function futureManaAssets(face: RenderedCardInput): string[] {
  const symbols = face.manaSymbols ?? [];
  return [
    ...new Set([
      ...symbols.map(futureManaAsset).filter((u): u is string => u !== null),
      ...(symbols.some((s) => /^(?:\d+|X)$/.test(s)) ? futureGenericSources() : []),
    ]),
  ];
}

/** These pinned numerical rasters share a background. Their lightest pixels
 * recover that exact blank medallion without changing its bevel or alpha. */
export function futureGenericSources(): string[] {
  return ['0', '1', '2', '3', '4', '5', '6', 'x'].map(
    (s) => `${manifest.CONJURER_ROOT}/img/manaSymbols/future/f${s}.png`,
  );
}

/** Source cost positions follow the curved left rail. Inline mana keeps the
 * ordinary text glyphs; it is not printed in these framed cost medallions. */
export function paintFutureMana(c: CanvasContext, face: RenderedCardInput, images: CanvasImages) {
  const x = [91, 61, 46, 46, 59, 106],
    y = [140, 207, 281, 356, 437, 512];
  const symbols = face.manaSymbols ?? [];
  if (symbols.length > x.length) throw Error('Futureshifted cost exceeds the six source positions');
  symbols.forEach((symbol, i) => {
    // The full-art rail gets taller after the first medallion. Keep the first
    // source position: its proposed fit regressed on reserved cards. Slot two
    // has separate validation; slot three has one local reference.
    const full = futureTreatment(face) === 'full-art' && i > 0 && i < 3,
      fitted = full || (futureTreatment(face) === 'regular' && i < 4),
      size = fitted ? (/^[WUBRG]$/.test(symbol) ? 37.125 : 38.125) : (59 * 488) / 744,
      centersX = full ? [79.0376, 58.6102, 56.1465] : [78.1626, 59.4852, 51.6465, 51.6465],
      centersY = full ? [113.101, 161.7009, 217.5071] : [111.851, 154.0759, 202.5071, 252.3427],
      px = fitted ? centersX[i]! - size / 2 : (x[i]! * 488) / 744,
      py = fitted ? centersY[i]! - size / 2 : (y[i]! * 680) / 1039;
    const url = futureManaAsset(symbol),
      image = url ? images.get(url) : undefined;
    if (url && !image) throw Error(`Futureshifted mana asset unavailable: ${url}`);
    if (image) {
      c.drawImage(image, px, py, size, size);
      if (/^(?:\d+|X)$/.test(symbol)) {
        // MSE's Future symbol font specifies bold MPlantin. Keep the numeral
        // separate from its blank medallion, matching the fitted shared ink box.
        c.save();
        c.translate(px + size / 2 - (0.75 * size) / 38.125, py + size / 2 + (1.75 * size) / 38.125);
        c.scale(0.9375, 1);
        c.font = `700 ${(size * 31.25) / 38.125}px "CardRenderer MTG MPlantin"`;
        c.fillStyle = '#111';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText(symbol, 0, 0, size * 0.73);
        c.restore();
      }
    } else paintMana(c, symbol, px, py, size, images, false);
  });
}
