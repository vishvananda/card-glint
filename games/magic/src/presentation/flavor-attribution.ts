import type { RulesParagraph, RulesRun } from './face-layout.js';

/** For a printing that uses right-aligned credits, a final dash-prefixed
 * flavor line is an attribution, including when its
 * dash/name have different styles. Split before wrapping so continuations and
 * ink/exclusion bounds use the same alignment as painting. Explicit paragraph
 * alignment (including centered passages) takes precedence. */
export function flavorAttribution(paragraph: RulesParagraph): readonly RulesParagraph[] {
  if (paragraph.role !== 'flavor' || paragraph.align !== undefined) return [paragraph];
  const text = paragraph.runs.map((run) => run.text).join('');
  const match = [...text.matchAll(/(?:^|\n)[^\S\n]*(?:—|–|--)[^\S\n]*(?=\S)/g)].at(-1);
  if (!match) return [paragraph];
  const start = match.index!;
  const nameStart = start + (text[start] === '\n' ? 1 : 0);
  const slice = (from: number, to: number): RulesRun[] => {
    let offset = 0;
    return paragraph.runs.flatMap((run) => {
      const value = run.text.slice(Math.max(0, from - offset), Math.max(0, to - offset));
      offset += run.text.length;
      return value ? [{ ...run, text: value }] : [];
    });
  };
  return [
    ...(start ? [{ ...paragraph, runs: slice(0, start) }] : []),
    { ...paragraph, align: 'right', runs: slice(nameStart, text.length) },
  ];
}
