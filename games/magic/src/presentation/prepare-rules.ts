import { hasOvalSecurityStamp } from './security-stamp-policy.js';
import type { FaceRect, RenderedCardInput } from './face-layout.js';
import { layoutRules } from './rules-layout.js';
import { wordingParagraphs } from './wording.js';
import { PREPARE_RECTS, PREPARE_SPELL_RECTS, preparedSpell } from './prepare-frame.js';

export function prepareRuleLayouts(c: CanvasRenderingContext2D, face: RenderedCardInput) {
  const spell = preparedSpell(face);
  const layout = (
    input: RenderedCardInput,
    rect: FaceRect,
    maximumSize: number,
    exclusions: FaceRect[],
  ) => {
    const paragraphs = wordingParagraphs({
      rulesText: input.rulesText ?? '',
      rulesParagraphs: input.rulesParagraphs,
    });
    return layoutRules(
      c,
      input.rulesAlignment?.mode === 'left'
        ? paragraphs.map((p) => (p.role === 'rules' ? { ...p, align: 'left' as const } : p))
        : paragraphs,
      {
        x: rect[0] * 488,
        y: rect[1] * 680,
        width: rect[2] * 488,
        height: rect[3] * 680,
        exclusions,
      },
      maximumSize,
      9,
      { leading: 1, paragraphGap: 0.4, flavorGap: 0.75, flavorSeparator: true },
    );
  };
  return {
    permanent: layout(
      face,
      PREPARE_RECTS.rules,
      21.75,
      hasOvalSecurityStamp(face) ? [[213, 620, 63, 26]] : [],
    ),
    spell: layout(
      spell,
      PREPARE_SPELL_RECTS.rules,
      21.75,
      face.power != null && face.toughness != null ? [[370, 603, 93, 49]] : [],
    ),
  };
}
