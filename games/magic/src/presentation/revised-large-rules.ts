import type { RulesParagraph } from './face-layout.js';
import { layoutRules } from './rules-layout.js';

const textOf = (p: RulesParagraph | undefined) => p?.runs.map((r) => r.text).join('') ?? '';
const heading = (paragraphs: readonly RulesParagraph[]) =>
  paragraphs.length === 2 &&
  /^[A-Za-z ,]+$/.test(textOf(paragraphs[0])) &&
  textOf(paragraphs[0]).length <= 20;

/** Empirical early/Revised policy: a rules-only passage, optionally preceded
 * by a short keyword heading, uses the large face when it fits in five lines.
 * Measure the chosen reference; fit and paint the visible wording separately.
 */
export function revisedLargeRules(
  context: CanvasRenderingContext2D,
  paragraphs: readonly RulesParagraph[],
  reference: readonly RulesParagraph[],
  y: number,
  height: number,
  size: number,
  minimum: number,
) {
  const eligible = (p: RulesParagraph) =>
    p.role === 'rules' && p.runs.length > 0 && !textOf(p).includes('\n') && p.align === undefined;
  if (!reference.length || !reference.every(eligible) || paragraphs.some((p) => p.align))
    return null;
  if (reference.length !== 1 && !heading(reference)) return null;
  const align = (blocks: readonly RulesParagraph[]) =>
    blocks.map(
      (p, i) =>
        ({
          ...p,
          align:
            p.align ??
            (p.role === 'flavor' || (heading(blocks) && i === 0 && !/^Enchant\b/.test(textOf(p)))
              ? 'left'
              : 'center'),
        }) as RulesParagraph,
    );
  const bounds = { x: 70, y: y - 6, width: 348, height: height - 8 };
  const typography = {
    leading: 1.1,
    paragraphGap: 0,
    flavorGap: 0,
    flavorOrphans: false,
    flavorSeparator: false,
    balanceLines: true,
    centerOffset: 0,
  };
  const trial = layoutRules(context, align(reference), bounds, size, size, typography);
  if (trial.overflow || trial.lines.length > 5) return null;
  return layoutRules(context, align(paragraphs), bounds, size, minimum, typography);
}
