import { wrapRules } from '../../src/presentation/rules-wrap.ts';

/** Offline proposal: one shared cap for the complete rules/flavor block.
 * Only wording and actual font advances select it; scan pixels are never read. */
export function orphanParagraphCap(
  context,
  paragraphs,
  bounds,
  maximumSize,
  typography,
  fill,
  scope = 'all',
) {
  if (!(fill > 0 && fill <= 0.45)) throw Error('Invalid orphan fill threshold');
  const selected = orphanParagraphs(paragraphs, scope);
  context.save();
  try {
    if (typography.fractionalMetrics) {
      context.textRendering = 'geometricPrecision';
      context.fontKerning = 'normal';
    }
    context.letterSpacing = '0px';
    const hasOrphan = (size) =>
      selected.some((paragraph) => {
        if (paragraph.align === 'right') return false;
        const rows = wrapRules(
          context,
          paragraph.runs,
          bounds.width,
          size,
          false,
          typography.textWidth ?? 1,
        );
        return (
          rows.length > 1 &&
          rows.at(-1).reduce((sum, run) => sum + run.width, 0) < bounds.width * fill
        );
      });
    if (!hasOrphan(maximumSize)) return maximumSize;
    for (let size = maximumSize - 0.25; size >= Math.max(15, maximumSize * 0.9); size -= 0.25)
      if (!hasOrphan(size)) return size;
    // An unresolved orphan never licenses arbitrary shrinking.
    return maximumSize;
  } finally {
    context.restore();
  }
}

/** A bounded paragraph-role hypothesis, independent of names or scan pixels. */
export function orphanParagraphs(paragraphs, scope = 'all') {
  if (scope === 'all') return paragraphs;
  const rules = paragraphs.filter((paragraph) => paragraph.role === 'rules');
  if (scope === 'rules') return rules;
  if (scope === 'single-rules') return rules.length === 1 ? rules : [];
  if (scope === 'first-prose') {
    const first = rules[0];
    const text =
      first?.runs
        .map((run) => run.text)
        .join('')
        .trim() ?? '';
    // Preserve keyword headings, activation-cost blocks and explicit captions.
    return first && /[.!?]$/.test(text) && !/[{}\n]/.test(text) ? [first] : [];
  }
  throw Error('Invalid orphan paragraph scope');
}
