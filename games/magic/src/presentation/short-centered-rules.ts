import type { RulesParagraph } from './face-layout.js';
import { layoutRules, type RulesTypography } from './rules-layout.js';

/** Classify the chosen wording at its printed size, then fit the visible text.
 * A longer Oracle passage must not change an original-based classification.
 */
export function shortCenteredRules(
  context: CanvasRenderingContext2D,
  paragraphs: readonly RulesParagraph[],
  reference: readonly RulesParagraph[],
  bounds: Parameters<typeof layoutRules>[2],
  size: number,
  minimum: number,
  maximumLines: number,
  typography: RulesTypography,
  maximumCharacters = Infinity,
) {
  const eligible = (p: RulesParagraph) =>
    (p.align === undefined || p.align === 'center') &&
    p.runs.length > 0 &&
    p.runs.every((run) => !run.text.includes('\n'));
  if (!reference.length || !reference.every(eligible) || !paragraphs.every(eligible)) return null;
  // A symbol occupies one printed character regardless of its source token.
  const visibleText = reference.map((p) => p.runs.map((r) => r.text).join('')).join('\n');
  if (Array.from(visibleText.replace(/\{[^}]+\}/g, '●')).length > maximumCharacters) return null;
  const center = (blocks: readonly RulesParagraph[]) =>
    blocks.map((p) => ({ ...p, align: 'center' as const }));
  const trial = layoutRules(context, center(reference), bounds, size, size, typography);
  if (trial.overflow || trial.lines.length > maximumLines) return null;
  return layoutRules(context, center(paragraphs), bounds, size, minimum, typography);
}
