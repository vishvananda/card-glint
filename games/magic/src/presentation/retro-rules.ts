import { retroBasicPrinting } from './retro-basic.js';
import type { RenderedCardInput, RulesParagraph } from './face-layout.js';
import { layoutRules, type RulesTypography } from './rules-layout.js';
import { retroBasicSymbol, retroFamily, retroPx, retroRects } from './retro-frame.js';
import { resolveFrameColors } from './profile.js';
import { revisedLargeRules } from './revised-large-rules.js';
import { wordingParagraphs } from './wording.js';

/** Shared old-border policy. Historical print references never enter the painter. */
export const RETRO_TYPOGRAPHY: Readonly<RulesTypography> = {
  leading: 1,
  paragraphGap: 0.25,
  flavorGap: 0.8,
  flavorOrphans: false,
  flavorSeparator: false,
};

/** Null denotes the existing large-basic-symbol path, which has no body text. */
export function retroTextLayout(context: CanvasRenderingContext2D, face: RenderedCardInput) {
  if (retroBasicSymbol(face)) return null;
  const [x, y, width, height] = retroPx(retroRects(face).rules);
  const basic = retroBasicPrinting(face);
  const visible =
    basic?.paragraphs ??
    wordingParagraphs({
      rulesText: face.rulesText ?? '',
      rulesParagraphs: face.rulesParagraphs,
    });
  const forcedLeft = face.rulesAlignment?.mode === 'left';
  const paragraphs: readonly RulesParagraph[] = forcedLeft
    ? visible.map((p) => ({ ...p, align: 'left' }))
    : visible;
  const reference =
    face.rulesAlignment?.mode === 'auto'
      ? (face.rulesAlignment.reference ?? paragraphs)
      : paragraphs;
  // Oracle reminders can be much longer than the original printing. Fit the
  // complete text; retain the historical minimum for original comparisons.
  const minimum = face.wordingMode === 'oracle' ? 10 : 15;
  const set = face.setCode?.toLowerCase();
  // Alpha's printed ink stays inside the panel even when Oracle adds reminders.
  // Keep the established optical center; shrink only blocks crossing this inset.
  const verticalLimits = set === 'lea' ? ([428, 590] as const) : undefined;
  const early = ['lea', 'leb', '2ed'].includes(set ?? '');
  const revisedStyle = early || (set === '3ed' && retroFamily(face) === 'fourth');
  if (revisedStyle && !forcedLeft) {
    const large = revisedLargeRules(
      context,
      paragraphs,
      reference,
      y,
      height,
      early ? 32.5 : 27.5,
      minimum,
      verticalLimits,
    );
    if (large) return large;
  }
  const paragraph = reference.length === 1 ? reference[0] : undefined;
  const plain = paragraph?.runs.length === 1 ? paragraph.runs[0] : undefined;
  // Short Revised/Fourth passages use larger, centered and balanced lines.
  // Explicit host alignment, hard breaks and styled passages retain their policy.
  const centered =
    !forcedLeft &&
    set === '4ed' &&
    retroFamily(face) === 'fourth' &&
    paragraphs.every((p) => p.align === undefined || p.align === 'center') &&
    paragraph?.role === 'rules' &&
    (paragraph.align === undefined || paragraph.align === 'center') &&
    plain &&
    !plain.italic &&
    !plain.text.includes('\n') &&
    plain.text.length > 0 &&
    plain.text.length <= 100;
  // Revised has larger printing and about 30px between baselines. Its frame
  // registration, leading and width were checked on separate reserved examples.

  // Long Revised/Fourth blocks sit inside the textured panel. Revised's
  // optical center is higher, but dense text must stay below the panel's top.
  const longBlock =
    (revisedStyle || (set === '4ed' && retroFamily(face) === 'fourth')) &&
    (paragraphs.length > 1 ||
      paragraphs.reduce((n, p) => n + p.runs.reduce((n, r) => n + r.text.length, 0), 0) > 100);
  const revisedBlock = longBlock && revisedStyle;
  const fourthBlock = longBlock && set === '4ed';
  // Reviewed white plates allow another word near the right edge. Extending
  // every color regresses multicolor examples, so do not generalize this inset.
  const whiteExpansion =
    (set === 'mir' || set === 'tmp') &&
    !basic &&
    !/\b(?:Land|Artifact)\b/.test(face.typeLine ?? '') &&
    resolveFrameColors(face).join('') === 'W';
  const regular = layoutRules(
    context,
    centered ? paragraphs.map((p) => ({ ...p, align: 'center' })) : paragraphs,
    {
      x: revisedStyle ? 70 : fourthBlock || centered ? 72 : x,
      y: y + (basic ? 1.5 : centered ? -6 : fourthBlock ? 0 : 4),
      // Insets belong to the frame, not paragraph count or italic styling.
      width: revisedStyle ? 346 : fourthBlock || centered ? 344 : width + (whiteExpansion ? 10 : 0),
      height: height - 8,
      verticalLimits,
    },
    basic ? 24 : centered ? 25 : 22.5,
    minimum,
    centered
      ? { ...RETRO_TYPOGRAPHY, leading: 1, balanceLines: true }
      : longBlock
        ? {
            ...RETRO_TYPOGRAPHY,
            paragraphGap: 0,
            flavorGap: 0,
            centerOffset: revisedBlock ? -10 : 0,
          }
        : RETRO_TYPOGRAPHY,
  );
  // Revised uses a distinct small face for dense passages. Character count
  // alone misclassifies wide/italic blocks; fit alone misclassifies short
  // multi-paragraph printing. Both gates are checked against the full set.
  const length = paragraphs.reduce(
    (sum, p) => sum + p.runs.reduce((n, run) => n + run.text.length, 0),
    0,
  );
  if (!revisedBlock || length <= 270 || regular.size >= 22) return regular;
  return layoutRules(
    context,
    paragraphs,
    { x: 70, y: y + 4, width: 346, height: height + 8, verticalLimits },
    15.5,
    minimum,
    {
      ...RETRO_TYPOGRAPHY,
      leading: 1.25,
      paragraphGap: 0,
      flavorGap: 0,
      centerOffset: -18,
    },
  );
}
