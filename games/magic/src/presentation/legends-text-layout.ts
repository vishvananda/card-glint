import type { RenderedCardInput, RulesParagraph } from './face-layout.js';
import { legendsFrame } from './legends-frame.js';
import { layoutRules, type RulesTypography } from './rules-layout.js';

const text = (p: RulesParagraph) => p.runs.map((run) => run.text).join('');
const heading = (p: RulesParagraph) =>
  p.role === 'rules' && /^[A-Za-z ,]+$/.test(text(p)) && text(p).length <= 28;
const bounds = { x: 72, y: 413, width: 344, height: 182 };
const typography: Readonly<RulesTypography> = {
  leading: 1,
  paragraphGap: 0,
  flavorGap: 0,
  flavorOrphans: false,
  flavorSeparator: false,
  centerOffset: -14,
};
const alignLarge = (paragraphs: readonly RulesParagraph[]): readonly RulesParagraph[] =>
  paragraphs.map((p, i) => ({
    ...p,
    align:
      p.role === 'rules' &&
      (paragraphs.some((block) => block.role === 'flavor') ||
        (i === 0 && paragraphs.length > 1 && heading(p)))
        ? 'left'
        : 'center',
  }));

/** Shared printed size classes: short balanced passages, regular body, then
 * compact body when regular printing does not fit. Classify centering with the
 * host's chosen wording reference and fit all visible text independently.
 * See legends-rules-clean-proposal.json; no card names or scan poses enter here. */
export function legendsTextLayout(
  context: CanvasRenderingContext2D,
  face: RenderedCardInput,
  paragraphs: readonly RulesParagraph[],
  reference: readonly RulesParagraph[],
) {
  if (!legendsFrame(face) || (face.borderColor && face.borderColor !== 'black')) return null;
  const minimum = face.wordingMode === 'oracle' ? 10 : 15;
  const length = reference.reduce(
    (n, p) =>
      n +
      text(p)
        .replace(/\{[^}]+\}/g, '●')
        .replaceAll('\u00ad', '').length,
    0,
  );
  const eligible =
    face.rulesAlignment?.mode !== 'left' &&
    length <= (reference.every((p) => p.role === 'flavor') ? 135 : 130) &&
    reference.length > 0 &&
    reference.every((p) => p.align === undefined && !text(p).includes('\n')) &&
    paragraphs.every((p) => p.align === undefined);
  if (eligible) {
    const largeStyle = {
      ...typography,
      leading: 1.1,
      balanceLines: true,
      balanceCenteredOnly: true,
    };
    const trial = layoutRules(context, alignLarge(reference), bounds, 27.5, 27.5, largeStyle);
    if (!trial.overflow && trial.lines.length <= 5)
      return layoutRules(context, alignLarge(paragraphs), bounds, 27.5, minimum, largeStyle);
  }
  const regular = layoutRules(context, paragraphs, bounds, 22.25, 21.75, typography);
  if (!regular.overflow) return regular;
  return layoutRules(context, paragraphs, bounds, 15.5, minimum, {
    ...typography,
    leading: 1.2,
  });
}
