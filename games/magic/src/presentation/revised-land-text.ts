import { type CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import type { RenderedCardInput, RulesParagraph, CardTextInk } from './face-layout.js';
import { layoutRules, type RulesLayout } from './rules-layout.js';
import { shortCenteredRules } from './short-centered-rules.js';
import { paintRetroGrayText } from './retro-lettering.js';

const TEXT = {
  title: { x: 38, y: 47.312, size: 25.75, width: 1 },
  type: { x: 49, y: 395.71, size: 21.95, width: 1 },
  artist: { x: 48, y: 642.5, size: 22.25, width: 1.01 },
  basic: {
    x: 70,
    y: 406.556,
    width: 348,
    height: 177.232,
    size: 27.5,
    leading: 1.1,
    offset: 0,
    paragraph: 0,
  },
  dual: {
    x: 71.5,
    y: 420,
    width: 342,
    height: 187,
    size: 15.5,
    leading: 1.2,
    offset: -18,
    paragraph: 0.075,
  },
};
/** One shared printing style, independent of per-card reference transforms. */
export function revisedLandText() {
  return TEXT;
}

export function paintRevisedLandText(
  c: CanvasContext,
  text: string,
  kind: 'title' | 'type' | 'artist',
  maxWidth: number,
  liveChanges?: CardTextInk,
) {
  const p = revisedLandText()[kind];
  c.save();
  c.translate(p.x, p.y);
  c.scale(p.width, 1);
  c.font = `${p.size}px "CardRenderer MTG ${kind === 'title' ? 'Goudy' : 'MPlantin'}", Georgia`;
  c.textAlign = 'left';
  c.textBaseline = kind === 'artist' ? 'alphabetic' : 'middle';
  paintRetroGrayText(
    c,
    text,
    0,
    0,
    maxWidth / p.width,
    kind === 'artist' ? 1.25 : 1,
    '#ababab',
    kind === 'type' ? liveChanges : undefined,
    'type',
  );
  c.restore();
}

export function revisedLandRules(
  c: CanvasContext,
  face: RenderedCardInput,
  paragraphs: readonly RulesParagraph[],
  reference: readonly RulesParagraph[],
): RulesLayout {
  const p = revisedLandText(),
    minimum = face.wordingMode === 'oracle' ? 10 : 15,
    dense = paragraphs.reduce((n, b) => n + b.runs.reduce((s, r) => s + r.text.length, 0), 0) > 150;
  const typography = (s: typeof p.basic) => ({
    leading: s.leading,
    paragraphGap: s.paragraph,
    flavorGap: 0,
    flavorOrphans: false,
    flavorSeparator: false,
    centerOffset: s.offset,
  });
  if (face.rulesAlignment?.mode !== 'left') {
    const centered = shortCenteredRules(
      c,
      paragraphs,
      reference,
      p.basic,
      p.basic.size,
      minimum,
      5,
      { ...typography(p.basic), balanceLines: true },
      150,
    );
    if (centered) {
      if (!dense) return centered;
      // The chosen reference decides alignment only. A short Oracle reminder
      // must not enlarge the original dual-land paragraph or lift it above the
      // paper's safe inset. Retain its measured dense printing style.
      return layoutRules(
        c,
        paragraphs.map((block) => ({ ...block, align: 'center' })),
        p.dual,
        p.dual.size,
        Math.min(minimum, p.dual.size),
        { ...typography(p.dual), balanceLines: true },
      );
    }
  }
  const size = dense ? p.dual.size : p.basic.size;
  return layoutRules(c, paragraphs, p.dual, size, Math.min(minimum, size), typography(p.dual));
}
