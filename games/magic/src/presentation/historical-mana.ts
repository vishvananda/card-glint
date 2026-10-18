import type { RenderedCardInput } from './face-layout.js';
import { HISTORICAL_MANA_GLYPHS, HISTORICAL_MANA_ASSETS } from './historical-mana-profiles.js';
import { MANA_PRINTING_INK } from './mana-printing-profiles.js';
import { earlyExpansionMana } from './early-expansion-mana.js';

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
  const asset =
    family && family !== 'modern' && family !== 'historic-font'
      ? HISTORICAL_MANA_ASSETS[`${symbol}/${family}`]
      : undefined;
  const ink = printingInk(face, symbol);
  return asset && ink ? { ...asset, inkExpansion: ink.pixels } : asset;
}

/** Source-bound preparation policy; unmeasured printing/frame combinations keep
 * their existing sampler and glyph pixels. */
export function historicalManaPaperSample(face: RenderedCardInput, symbol: string) {
  return printingInk(face, symbol)?.paperSample;
}

function printingInk(face: RenderedCardInput, symbol: string) {
  const ink = MANA_PRINTING_INK[`${face.setCode?.toLowerCase()}/${symbol}`];
  if (!ink || ink.family !== historicalManaFamily(face, symbol)) return undefined;
  if (ink.paperSample && !earlyExpansionMana(face)) return undefined;
  return ink;
}
