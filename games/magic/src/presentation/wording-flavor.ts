import type { RulesParagraph } from './face-layout.js';
import type { CardWording } from './wording.js';

function flavorParagraphs(wording: CardWording | undefined): readonly RulesParagraph[] {
  if (!wording) return [];
  const styled = wording.rulesParagraphs?.filter((p) => p.role === 'flavor');
  if (styled?.length) return styled;
  return (wording.flavorText ?? '')
    .split('\n')
    .filter(Boolean)
    .map((text) => ({
      role: 'flavor' as const,
      runs: text
        .split('*')
        .map((text, i) => ({ text, italic: i % 2 === 0 }))
        .filter((run) => run.text),
    }));
}

/** Optional Oracle display assembly; neither supplied wording is mutated. */
export function oracleFlavorWording(
  oracle: CardWording,
  original: CardWording | undefined,
  include: boolean,
): CardWording {
  const selectedFlavor = flavorParagraphs(oracle);
  const flavor = include
    ? selectedFlavor.length
      ? selectedFlavor
      : flavorParagraphs(original)
    : [];
  if (!selectedFlavor.length && !flavor.length) return oracle;
  const rules =
    oracle.rulesParagraphs?.filter((p) => p.role !== 'flavor') ??
    oracle.rulesText
      .split('\n')
      .filter(Boolean)
      .map((text) => ({ role: 'rules' as const, runs: [{ text }] }));
  const rulesParagraphs = [...rules, ...flavor];
  return {
    ...oracle,
    flavorText: undefined,
    rulesText: rulesParagraphs.map((p) => p.runs.map((r) => r.text).join('')).join('\n'),
    rulesParagraphs,
  };
}
