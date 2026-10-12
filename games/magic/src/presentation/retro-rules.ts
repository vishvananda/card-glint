import { retroBasicPrinting } from './retro-basic.js';
import type { RenderedCardInput } from './face-layout.js';
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
  const paragraphs =
    basic?.paragraphs ??
    face.rulesParagraphs ??
    (face.rulesText ?? '')
      .split('\n')
      .filter(Boolean)
      .map((text) => ({ role: 'rules' as const, runs: [{ text }] }));
  const set = face.setCode?.toLowerCase();
  // Fourth's long, left-aligned blocks sit inside the textured panel. Short
  // centered passages need a separate policy; keep their existing layout here.
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
    paragraphs,
    {
      x: fourthBlock ? 72 : x,
      y: y + (basic ? 1.5 : fourthBlock ? 0 : 4),
      width: fourthBlock ? 344 : width + (whiteExpansion ? 10 : 0),
      height: height - 8,
    },
    basic ? 24 : 22.5,
    15,
    fourthBlock ? { ...RETRO_TYPOGRAPHY, paragraphGap: 0, flavorGap: 0 } : RETRO_TYPOGRAPHY,
  );
}
