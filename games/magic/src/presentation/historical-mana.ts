import type { RenderedCardInput } from './face-layout.js';
import { HISTORICAL_MANA_GLYPHS, HISTORICAL_MANA_ASSETS } from './historical-mana-profiles.js';

/** Glyph choice belongs to each printing/color, independently of its frame and
 * wording. Explicit original symbols also work with Oracle text. */
export function historicalManaFamily(face: RenderedCardInput, symbol: string) {
  if (
    face.symbolStyle === 'modern' ||
    (face.symbolStyle === undefined && face.wordingMode === 'oracle')
  )
    return undefined;
  return HISTORICAL_MANA_GLYPHS[face.setCode?.toLowerCase() ?? '']?.[symbol];
}

export function historicalManaAsset(face: RenderedCardInput, symbol: string) {
  const family = historicalManaFamily(face, symbol);
  return family && family !== 'modern' && family !== 'historic-font'
    ? HISTORICAL_MANA_ASSETS[`${symbol}/${family}`]
    : undefined;
}
