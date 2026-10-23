import { wrapRules } from '../../src/presentation/rules-wrap.ts';

/** Offline proposal: one shared cap for the complete rules/flavor block.
 * Only wording and actual font advances select it; scan pixels are never read. */
export function orphanParagraphCap(context, paragraphs, bounds, maximumSize, typography, fill) {
  if (!(fill > 0 && fill <= 0.45)) throw Error('Invalid orphan fill threshold');
  context.save();
  try {
    if (typography.fractionalMetrics) {
      context.textRendering = 'geometricPrecision';
      context.fontKerning = 'normal';
    }
    context.letterSpacing = '0px';
    const hasOrphan = (size) =>
      paragraphs.some((paragraph) => {
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
