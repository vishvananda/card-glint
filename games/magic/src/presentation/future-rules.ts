import type { RenderedCardInput, FaceRect } from './face-layout.js';
import { layoutRules } from './rules-layout.js';

/** The shared FUT body fit retains the existing font and wrapping. Larger
 * size/leading changes had discontinuous wrap regressions on reserved cards. */
export function futureRulesLayout(
  c: CanvasRenderingContext2D,
  face: RenderedCardInput,
  rect: FaceRect,
) {
  const [x, y, width, height] = rect;
  const paragraphs =
    face.rulesParagraphs ??
    (face.rulesText ?? '')
      .split('\n')
      .filter(Boolean)
      .map((text) => ({ role: 'rules' as const, runs: [{ text }] }));
  return layoutRules(
    c,
    paragraphs,
    { x: x - 0.375, y, width, height },
    (17.6 * 4) / 3,
    (8 * 4) / 3,
    {
      leading: 0.95,
      paragraphGap: 0.4,
      flavorGap: 0.5,
      flavorOrphans: false,
      flavorSeparator: false,
      centerOffset: 0.875,
    },
  );
}
