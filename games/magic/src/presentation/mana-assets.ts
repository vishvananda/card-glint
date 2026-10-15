import { symbolTextParts, type RenderedCardInput } from './face-layout.js';
import { historicalManaAsset, historicalManaFamily } from './historical-mana.js';
import { modernCostNumeralAsset } from './modern-cost-mana.js';
import { manaSymbolAsset } from './assets.js';

/** Explicit paragraph runs can supply mana independently of rulesText. */
export function faceManaAssets(face: RenderedCardInput): (string | null)[] {
  const text = [
    face.rulesText ?? '',
    ...(face.rulesParagraphs ?? []).flatMap((paragraph) => paragraph.runs.map((run) => run.text)),
  ];
  const symbols = new Set([
    ...(face.manaSymbols ?? []),
    ...text.flatMap((value) =>
      symbolTextParts(value).flatMap((part) => (part.symbol ? [part.symbol] : [])),
    ),
  ]);
  return [
    ...(face.manaSymbols ?? []).flatMap((symbol) => {
      const url = modernCostNumeralAsset(face, symbol);
      return url ? [url] : [];
    }),
    ...[...symbols].map((symbol) =>
      historicalManaFamily(face, symbol) === 'historic-font'
        ? null
        : (historicalManaAsset(face, symbol)?.url ?? manaSymbolAsset(symbol)),
    ),
  ];
}
