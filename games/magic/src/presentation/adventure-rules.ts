import type { RenderedCardInput } from './face-layout.js';
import { layoutRules } from './rules-layout.js';
import { wordingParagraphs } from './wording.js';
import { shortCenteredRules } from './short-centered-rules.js';

export function adventureRuleLayouts(c: CanvasRenderingContext2D, face: RenderedCardInput) {
  const spell = face.faces?.[1];
  if (!spell) throw Error('Adventure spell is missing.');
  const paragraphs = (f: RenderedCardInput) => {
    const p = wordingParagraphs({
      rulesText: f.rulesText ?? '',
      rulesParagraphs: f.rulesParagraphs,
    });
    return f.rulesAlignment?.mode === 'left' ? p.map((p) => ({ ...p, align: 'left' as const })) : p;
  };
  const typography = { leading: 1, paragraphGap: 0.4, flavorGap: 0.75, flavorSeparator: true };
  const permanentParagraphs = paragraphs(face),
    bounds = {
      x: 261,
      y: 438,
      width: 189,
      height: 178,
      exclusions: face.power != null && face.toughness != null ? [[368, 601, 94, 51] as const] : [],
    };
  // Single-keyword permanent pages center in the scan; two-line rules such as
  // Rimrock Knight remain left aligned. Explicit wording alignment still wins.
  const reference =
    face.rulesAlignment?.mode === 'auto'
      ? (face.rulesAlignment.reference ?? permanentParagraphs)
      : permanentParagraphs;
  const centered =
    face.rulesAlignment?.mode !== 'left' && reference.length === 1 && reference[0]!.role === 'rules'
      ? shortCenteredRules(c, permanentParagraphs, reference, bounds, 22.5, 9, 1, typography)
      : null;
  return {
    permanent: centered || layoutRules(c, permanentParagraphs, bounds, 22.5, 9, typography),
    spell: layoutRules(
      c,
      paragraphs(spell),
      { x: 41.7, y: 499, width: 191, height: 122 },
      24,
      9,
      typography,
    ),
  };
}
