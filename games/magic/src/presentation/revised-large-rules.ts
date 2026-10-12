import type { RulesParagraph } from './face-layout.js';
import { layoutRules } from './rules-layout.js';

/** Revised's large face covers longer passages and keyword headings when five
 * lines fit. Explicit host alignment and styling retain the normal policy.
 */
export function revisedLargeRules(
  context: CanvasRenderingContext2D,
  paragraphs: readonly RulesParagraph[],
  y: number,
  height: number,
) {
  const plain = paragraphs.every(
    (p) =>
      p.role === 'rules' &&
      p.runs.length === 1 &&
      !p.runs[0]!.italic &&
      !p.runs[0]!.text.includes('\n') &&
      p.align === undefined,
  );
  if (!plain) return null;
  const first = paragraphs[0]?.runs[0]?.text ?? '';
  const keyword = paragraphs.length === 2 && /^[A-Za-z ,]+$/.test(first) && first.length <= 20;
  const longerSingle = paragraphs.length === 1 && first.length > 100;
  if (!longerSingle && !keyword) return null;
  const layout = layoutRules(
    context,
    paragraphs.map((p, i) => ({ ...p, align: keyword && i === 0 ? 'left' : 'center' })),
    { x: 70, y: y - 6, width: 348, height: height - 8 },
    27.5,
    27.5,
    {
      leading: 1.1,
      paragraphGap: 0,
      flavorGap: 0,
      flavorOrphans: false,
      flavorSeparator: false,
      balanceLines: true,
      centerOffset: 0,
    },
  );
  return !layout.overflow && layout.lines.length <= 5 ? layout : null;
}
