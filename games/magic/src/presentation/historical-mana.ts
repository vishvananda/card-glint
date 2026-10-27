import type { RenderedCardInput } from './face-layout.js';
import { HISTORICAL_MANA_GLYPHS, HISTORICAL_MANA_ASSETS } from './historical-mana-profiles.js';
import { MANA_PRINTING_INK } from '../data/tables.js';
import { earlyExpansionMana } from './early-expansion-mana.js';
import { earlyReprintMana } from './early-reprint-mana.js';
import { calibrationForFace } from '../calibration/selection.js';
import type { ManaColor } from './symbol-adjustment.js';
import { isRetro, retroBorder, retroFamily } from './retro-frame.js';

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

/** Revised fits bind the complete reviewed frame and historical symbol inventory. */
export function revisedManaSource(face: RenderedCardInput): boolean {
  return (
    face.setCode?.toLowerCase() === '3ed' &&
    isRetro(face) &&
    (face.layout ?? 'normal') === 'normal' &&
    !(face.legendary ?? /\bLegendary\b/.test(face.typeLine ?? '')) &&
    !/^Level up\b/m.test(face.rulesText ?? '') &&
    retroBorder(face) === 'white' &&
    retroFamily(face) === 'fourth' &&
    historicalManaFamily(face, 'W') === 'historic-font' &&
    historicalManaFamily(face, 'U') === 'conjurer-old' &&
    historicalManaFamily(face, 'B') === 'mse-old' &&
    historicalManaFamily(face, 'R') === 'mse-old' &&
    historicalManaFamily(face, 'G') === 'conjurer-old'
  );
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
  if (
    symbol === 'B' &&
    earlyReprintMana(face) &&
    calibrationForFace(face)!.mana.paperSample !== 'printing'
  )
    return 'opaque-percentile';
  return printingInk(face, symbol)?.paperSample;
}

function printingInk(face: RenderedCardInput, symbol: string) {
  const reprint = earlyReprintMana(face);
  const measured =
    reprint && /^[WUBRG]$/.test(symbol)
      ? calibrationForFace(face)!.mana.sourceInk?.[symbol as ManaColor]
      : undefined;
  const ink = measured ?? MANA_PRINTING_INK[`${face.setCode?.toLowerCase()}/${symbol}`];
  if (!ink || ink.family !== historicalManaFamily(face, symbol)) return undefined;
  const revised =
    face.setCode?.toLowerCase() === '3ed' &&
    isRetro(face) &&
    (face.layout ?? 'normal') === 'normal' &&
    retroBorder(face) === 'white' &&
    retroFamily(face) === 'fourth';
  if (ink.paperSample && !earlyExpansionMana(face) && !reprint && !revised) return undefined;
  return ink;
}
