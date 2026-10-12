import { retroBasicPrinting } from './retro-basic.js';
import type { RenderedCardInput } from './face-layout.js';
import { layoutRules, type RulesTypography } from './rules-layout.js';
import { retroBasicSymbol, retroPx, retroRects } from './retro-frame.js';

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
  return layoutRules(
    context,
    paragraphs,
    { x, y: y + (basic ? 1.5 : 4), width, height: height - 8 },
    basic ? 24 : 22.5,
    15,
    RETRO_TYPOGRAPHY,
  );
}
