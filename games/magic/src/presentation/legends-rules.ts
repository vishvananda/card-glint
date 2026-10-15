import type { RenderedCardInput, RulesParagraph } from './face-layout.js';
import { legendsFrame } from './legends-frame.js';

/** Legends prints generic values in body text without mana discs. Keep tokens
 * in the public wording so switching to modern symbols remains reversible. */
export function legendsRulesParagraphs(
  face: RenderedCardInput,
  paragraphs: readonly RulesParagraph[],
): readonly RulesParagraph[] {
  if (
    !legendsFrame(face) ||
    face.symbolStyle === 'modern' ||
    (face.symbolStyle === undefined && face.wordingMode !== 'original')
  )
    return paragraphs;
  return paragraphs.map((paragraph) =>
    paragraph.role !== 'rules'
      ? paragraph
      : {
          ...paragraph,
          runs: paragraph.runs.map((run) => ({
            ...run,
            text: run.text.replace(/\{(\d+|[XYZ])\}/g, '$1'),
          })),
        },
  );
}
