import type { RenderedCardInput, RulesParagraph } from './face-layout.js';
import { layoutRules, rulesLayoutRequest, type RulesLayout } from './rules-layout.js';
import { alphaRulesLayout, earlyRulesModel } from './alpha-rules.js';
import { retroPx, retroRects } from './retro-frame.js';
import { wordingParagraphs } from './wording.js';
import { reviewedSmallOriginal } from './alpha-typography.js';

export interface EarlyTextTierOptions {
  readonly largeMaximum?: number;
  readonly largeFitWidth?: number;
  readonly mediumMaximum?: number;
  readonly mediumSize?: number;
  readonly denseWidth?: number;
  /** Diagnostic size-class probe; omitted uses exact reviewed original text. */
  readonly forceSmall?: boolean;
  /** Comparison-only activation on another printing; never moves its frame. */
  readonly transferAlphaModel?: boolean;
}

/** Reviewed Alpha defaults. Oracle retains its established fitting/safe inset. */
export function alphaTextLayout(
  context: CanvasRenderingContext2D,
  face: RenderedCardInput,
  base: RulesLayout | null,
): RulesLayout | null {
  if (!['lea', 'leb'].includes(face.setCode?.toLowerCase() ?? '') || !base) return base;
  if (face.wordingMode === 'oracle') return alphaRulesLayout(context, face, base);
  return earlyTextTierLayout(context, face, base);
}

/** Shared count-and-wrap policy in canonical card pixels. A size tier already
 * selected correctly keeps its established physical geometry. Scan poses never
 * enter this policy; two original-printing size reviews are separate data. */
export function earlyTextTierLayout(
  context: CanvasRenderingContext2D,
  face: RenderedCardInput,
  base: RulesLayout,
  options: EarlyTextTierOptions = {},
): RulesLayout {
  const request = rulesLayoutRequest(base);
  if (!request) throw Error('Missing native typography request');
  const visible = wordingParagraphs({
    rulesText: face.rulesText ?? '',
    rulesParagraphs: face.rulesParagraphs,
  });
  const paragraphs: readonly RulesParagraph[] =
    face.rulesAlignment?.mode === 'left'
      ? visible.map((p) => (p.role === 'rules' ? { ...p, align: 'left' } : p))
      : visible;
  const reference =
    face.rulesAlignment?.mode === 'auto'
      ? (face.rulesAlignment.reference ?? paragraphs)
      : paragraphs;
  const characters = reference.reduce(
    (n, p) => n + p.runs.reduce((n, r) => n + r.text.length, 0),
    0,
  );
  const [, y, , height] = retroPx(retroRects(face).rules);
  const typography = {
    leading: 1,
    paragraphGap: 0,
    flavorGap: 0,
    flavorOrphans: false,
    flavorSeparator: false,
  };
  const forceSmall = options.forceSmall ?? reviewedSmallOriginal(face, reference);
  let chosen: RulesLayout | undefined;
  if (
    !forceSmall &&
    characters <= (options.largeMaximum ?? 117) &&
    face.rulesAlignment?.mode !== 'left'
  ) {
    const blocks = paragraphs.map((p) => ({ ...p, align: p.align ?? 'center' }));
    const fit = layoutRules(
      context,
      blocks,
      { x: 70, y: y - 6, width: options.largeFitWidth ?? 340, height: height - 8 },
      32.5,
      32.5,
      { ...typography, leading: 1.1, balanceLines: true, centerOffset: 0 },
    );
    if (!fit.overflow && fit.lines.length <= 5) {
      if (base.size >= 30) chosen = base;
      else {
        const trial = layoutRules(
          context,
          blocks,
          { x: 70, y: y - 6, width: 348, height: height - 8 },
          32.5,
          32.5,
          { ...typography, leading: 1.1, balanceLines: true, centerOffset: 0 },
        );
        if (!trial.overflow && trial.lines.length <= 5) chosen = trial;
      }
    }
  }
  if (!chosen) {
    if (forceSmall || characters > (options.mediumMaximum ?? 274)) {
      chosen =
        base.size < 19
          ? base
          : layoutRules(
              context,
              paragraphs,
              { x: 70, y: y + 4, width: 346, height: height + 8 },
              15.5,
              15.5,
              { ...typography, leading: 1.25, centerOffset: -18 },
            );
    } else {
      chosen =
        base.size >= 19 && base.size < 30
          ? base
          : layoutRules(
              context,
              paragraphs,
              { x: 70, y: y + 4, width: 346, height: height - 8 },
              options.mediumSize ?? 22.5,
              19,
              { ...typography, centerOffset: -10 },
            );
    }
  }
  if (chosen.overflow) chosen = base;
  if (chosen.size >= 19)
    return options.transferAlphaModel
      ? (earlyRulesModel(context, face, chosen) ?? chosen)
      : (alphaRulesLayout(context, face, chosen) ?? chosen);
  const r = rulesLayoutRequest(chosen);
  if (!r) throw Error('Missing selected early typography request');
  const shape = layoutRules(
    context,
    r.paragraphs,
    { ...r.bounds, x: r.bounds.x + 10.5, width: r.bounds.width - 10.5 },
    chosen.size,
    chosen.size,
    { ...r.typography, textWidth: options.denseWidth ?? 0.98 },
  );
  if (shape.overflow) return chosen;
  // Narrowing may add a line. Preserve the block's optical center instead of
  // its old first-line position, and keep a full-height passage below the rim.
  const top = Math.max(r.bounds.y, chosen.top + (chosen.height - shape.height) / 2 - 5);
  const dy = top - shape.top;
  return {
    ...shape,
    top: shape.top + dy,
    lines: shape.lines.map((l) => ({
      ...l,
      baseline: l.baseline + dy,
      inkBounds: [l.inkBounds[0], l.inkBounds[1] + dy, l.inkBounds[2], l.inkBounds[3]],
    })),
  };
}
