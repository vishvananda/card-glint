import { retroBasicPrinting } from './retro-basic.js';
import type { RenderedCardInput, RulesParagraph } from './face-layout.js';
import { layoutRules, type RulesTypography } from './rules-layout.js';
import { retroBasicSymbol, retroFamily, retroPx, retroRects } from './retro-frame.js';
import { normalizeColors } from './profile.js';

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
  const paragraphs: readonly RulesParagraph[] =
    basic?.paragraphs ??
    face.rulesParagraphs ??
    (face.rulesText ?? '')
      .split('\n')
      .filter(Boolean)
      .map((text) => ({ role: 'rules' as const, runs: [{ text }] }));
  const set = face.setCode?.toLowerCase();
  const paragraph = paragraphs.length === 1 ? paragraphs[0] : undefined;
  const plain = paragraph?.runs.length === 1 ? paragraph.runs[0] : undefined;
  // Short Fourth Edition passages use larger, centered and balanced lines.
  // Explicit host alignment, hard breaks and styled passages retain their policy.
  const centered =
    set === '4ed' &&
    retroFamily(face) === 'fourth' &&
    paragraph?.role === 'rules' &&
    (paragraph.align === undefined || paragraph.align === 'center') &&
    plain &&
    !plain.italic &&
    !plain.text.includes('\n') &&
    plain.text.length > 0 &&
    plain.text.length <= 100;
  // Fourth's long, left-aligned blocks sit inside the textured panel.
  const fourthBlock =
    set === '4ed' &&
    retroFamily(face) === 'fourth' &&
    (paragraphs.length > 1 ||
      paragraphs.reduce((n, p) => n + p.runs.reduce((n, r) => n + r.text.length, 0), 0) > 100);
  // Reviewed white plates allow another word near the right edge. Extending
  // every color regresses multicolor examples, so do not generalize this inset.
  const whiteExpansion =
    (set === 'mir' || set === 'tmp') &&
    !basic &&
    !/\b(?:Land|Artifact)\b/.test(face.typeLine ?? '') &&
    normalizeColors(face.colors ?? []).join('') === 'W';
  return layoutRules(
    context,
    centered ? [{ ...paragraph, align: 'center' }] : paragraphs,
    {
      x: fourthBlock || centered ? 72 : x,
      y: y + (basic ? 1.5 : centered ? -6 : fourthBlock ? 0 : 4),
      width: fourthBlock || centered ? 344 : width + (whiteExpansion ? 10 : 0),
      height: height - 8,
    },
    basic ? 24 : centered ? 25 : 22.5,
    15,
    centered
      ? { ...RETRO_TYPOGRAPHY, balanceLines: true }
      : fourthBlock
        ? { ...RETRO_TYPOGRAPHY, paragraphGap: 0, flavorGap: 0 }
        : RETRO_TYPOGRAPHY,
  );
}
