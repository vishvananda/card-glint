import { type CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import type { RenderedCardInput, RulesParagraph } from './face-layout.js';
import { layoutRules, rulesLayoutRequest, type RulesLayout } from './rules-layout.js';
import { alphaRulesLayout, earlyRulesModel } from './alpha-rules.js';
import { retroPx, retroRects } from './retro-frame.js';
import { wordingParagraphs } from './wording.js';
import {
  reviewedSmallOriginal,
  reviewedOriginalTextLayout,
  earlyKeywordBlock,
} from './alpha-typography.js';

export interface EarlyTextTierOptions {
  readonly largeMaximum?: number;
  readonly regularWidthDelta?: number;
  readonly centeredWidth?: number;
  readonly regularDx?: number;
  readonly regularDy?: number;
  readonly centeredDx?: number;
  readonly centeredDy?: number;
  readonly shortRegularDy?: number;
  readonly mediumSizeDelta?: number;
  readonly largeFitWidth?: number;
  readonly mediumMaximum?: number;
  readonly mediumSize?: number;
  readonly denseWidth?: number;
  /** Diagnostic size-class probe; omitted uses exact reviewed original text. */
  readonly forceSmall?: boolean;
  /** Comparison-only activation on another printing; never moves its frame. */
  readonly transferAlphaModel?: boolean;
}

/** Face-cache identity for the shared Alpha original-only wrap safeguard. */
export const ALPHA_RULES_REVISION = 'abu-original-fractional-tiers-v3';

/** Reviewed Alpha defaults. Oracle retains its established fitting/safe inset. */
export function alphaTextLayout(
  context: CanvasContext,
  face: RenderedCardInput,
  base: RulesLayout | null,
  fractionalMetrics = false,
): RulesLayout | null {
  if (!['lea', 'leb'].includes(face.setCode?.toLowerCase() ?? '') || !base) return base;
  if (face.wordingMode === 'oracle') return alphaRulesLayout(context, face, base);
  return earlyTextTierLayout(context, face, base, {}, fractionalMetrics);
}

/** Shared count-and-wrap policy in canonical card pixels. A size tier already
 * selected correctly keeps its established physical geometry. Scan poses never
 * enter this policy; two original-printing size reviews are separate data. */
export function earlyTextTierLayout(
  context: CanvasContext,
  face: RenderedCardInput,
  base: RulesLayout,
  options: EarlyTextTierOptions = {},
  fractionalMetrics = false,
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
  options = { ...reviewedOriginalTextLayout(face, reference), ...options };
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
  if (!forceSmall && earlyKeywordBlock(face, paragraphs, characters)) {
    const keyword = layoutRules(
      context,
      paragraphs.map((p) => ({ ...p, align: 'left' as const })),
      { x: 80, y: y + 6, width: options.largeFitWidth ?? 374, height: height - 8 },
      32.5,
      32.5,
      { ...typography, leading: 1.1, balanceLines: true, centerOffset: 0 },
    );
    if (!keyword.overflow && keyword.lines.length <= 5) return keyword;
  }
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
      {
        x: 70,
        y: y - 6,
        width: options.largeFitWidth ?? options.centeredWidth ?? 340,
        height: height - 8,
      },
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
          { x: 70, y: y - 6, width: options.centeredWidth ?? 348, height: height - 8 },
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
  if (fractionalMetrics && chosen.size < 30) {
    const r = rulesLayoutRequest(chosen);
    if (!r) throw Error('Missing selected early metrics request');
    const precise = layoutRules(context, r.paragraphs, r.bounds, chosen.size, chosen.size, {
      ...r.typography,
      fractionalMetrics: true,
    });
    if (!precise.overflow)
      chosen =
        precise.lines.length === chosen.lines.length && precise.lines.length
          ? shiftEarlyRules(precise, chosen.lines[0]!.baseline - precise.lines[0]!.baseline)
          : precise;
  }
  if (chosen.size >= 19) {
    const r = rulesLayoutRequest(chosen);
    if (!r) throw Error('Missing selected typography request');
    const centered = r.paragraphs.every((p) => p.align === 'center');
    const width = centered && chosen.size >= 30 ? options.centeredWidth : undefined;
    const sizeDelta = !centered && chosen.size < 30 ? options.mediumSizeDelta : undefined;
    if (width !== undefined || sizeDelta) {
      const size = chosen.size + (sizeDelta ?? 0);
      const shaped = layoutRules(
        context,
        r.paragraphs,
        {
          ...r.bounds,
          ...(width !== undefined ? { x: (488 - width) / 2, width } : {}),
        },
        size,
        size,
        r.typography,
      );
      if (!shaped.overflow) chosen = shaped;
    }
    // Predeclared short/long medium-text cohorts validate different widths.
    // Alpha's longer passages retain their narrower box; Beta also gains here.
    const regularWidthDelta =
      options.regularWidthDelta ??
      (characters < 180 || face.setCode?.toLowerCase() === 'leb' ? 8 : 0);
    let model = options.transferAlphaModel
      ? (earlyRulesModel(context, face, chosen, regularWidthDelta) ?? chosen)
      : (alphaRulesLayout(context, face, chosen, regularWidthDelta) ?? chosen);
    // Preserve a plain passage's established wrapping when the tighter Alpha
    // inset alone adds a line. The existing Beta allowance restores the inset
    // without changing the face size. Mixed/flavor passages keep their policy;
    // explicit diagnostic width overrides remain exact. No scan or card-name
    // lookup participates in this physical fit.
    if (
      face.setCode?.toLowerCase() === 'lea' &&
      face.wordingMode !== 'oracle' &&
      !fractionalMetrics &&
      options.regularWidthDelta === undefined &&
      regularWidthDelta === 0 &&
      !centered &&
      r.paragraphs.every((p) => p.role === 'rules') &&
      model.lines.length > chosen.lines.length
    ) {
      const wider = alphaRulesLayout(context, face, chosen, 8);
      if (wider && wider !== chosen && wider.lines.length < model.lines.length) model = wider;
    }
    const dx = centered ? (options.centeredDx ?? 0) : (options.regularDx ?? 0);
    const dy = centered
      ? (options.centeredDy ?? 0)
      : options.regularDy !== undefined
        ? options.regularDy
        : chosen.lines.length <= 5
          ? (options.shortRegularDy ?? 0)
          : 0;
    if (!dx && !dy) return model;
    const candidate = {
      ...model,
      x: model.x + dx / (model.horizontalScale ?? 1),
      top: model.top + dy,
      lines: model.lines.map((l) => ({
        ...l,
        x: (l.x ?? model.x) + dx / (model.horizontalScale ?? 1),
        baseline: l.baseline + dy,
        inkBounds: [
          l.inkBounds[0] + dx / (model.horizontalScale ?? 1),
          l.inkBounds[1] + dy,
          l.inkBounds[2],
          l.inkBounds[3],
        ] as const,
      })),
    };
    const top = face.wordingMode === 'oracle' ? 428 : 405;
    const bottom = face.wordingMode === 'oracle' ? 590 : 602;
    return candidate.lines.some(
      (l) => l.inkBounds[1] < top || l.inkBounds[1] + l.inkBounds[3] > bottom,
    )
      ? model
      : candidate;
  }
  const r = rulesLayoutRequest(chosen);
  if (!r) throw Error('Missing selected early typography request');
  const shape = layoutRules(
    context,
    r.paragraphs,
    { ...r.bounds, x: r.bounds.x + 10.5, width: r.bounds.width - 10.5 },
    chosen.size,
    chosen.size,
    { ...r.typography, textWidth: options.denseWidth ?? (fractionalMetrics ? 1 : 0.98) },
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

/** Preserve the printing's physical panel and line budget with unhinted advances.
 * A quarter-pixel reduction can avoid a new row; no wider fallback is permitted. */
export function fractionalEarlyRules(
  context: CanvasContext,
  original: RulesLayout,
  smallTextWidth = 1,
  printing?: Readonly<{ textWidth: number; right: number }>,
): RulesLayout {
  if (
    printing &&
    (!Number.isFinite(printing.textWidth) ||
      printing.textWidth <= 0 ||
      !Number.isFinite(printing.right) ||
      printing.right <= original.x ||
      printing.right > 488)
  )
    throw RangeError('Invalid printing text geometry');
  if (original.size >= 30 || !original.lines.length) return original;
  const request = rulesLayoutRequest(original);
  if (!request) throw Error('Missing final early text request');
  const precise = layoutRules(
    context,
    request.paragraphs,
    printing
      ? {
          ...request.bounds,
          width: Math.min(
            printing.right - request.bounds.x,
            request.bounds.width * printing.textWidth,
          ),
        }
      : request.bounds,
    original.size,
    Math.max(10, original.size - 0.5),
    {
      ...request.typography,
      ...(printing
        ? { textWidth: printing.textWidth }
        : original.size < 19
          ? { textWidth: smallTextWidth }
          : {}),
      fractionalMetrics: true,
      maximumLines: original.lines.length,
    },
  );
  if (precise.overflow) return original;
  const dy = original.lines[0]!.baseline - precise.lines[0]!.baseline;
  const candidate: RulesLayout = {
    ...precise,
    ...(original.horizontalScale === undefined
      ? {}
      : { horizontalScale: original.horizontalScale }),
    top: precise.top + dy,
    lines: precise.lines.map((line) => ({
      ...line,
      baseline: line.baseline + dy,
      inkBounds: [line.inkBounds[0], line.inkBounds[1] + dy, line.inkBounds[2], line.inkBounds[3]],
    })),
    separators: precise.separators.map((y) => y + dy),
  };
  return candidate.lines.some(
    ({ inkBounds: [x, y, w, h] }) =>
      y < 399 ||
      y + h > 604 ||
      x * (candidate.horizontalScale ?? 1) < 48 ||
      (x + w) * (candidate.horizontalScale ?? 1) > 449,
  )
    ? original
    : candidate;
}

/** Unchanged row counts retain their calibrated baseline grid; glyph bounds
 * quantization alone must not move the printed block. */
function shiftEarlyRules(layout: RulesLayout, dy: number): RulesLayout {
  if (!dy) return layout;
  return {
    ...layout,
    top: layout.top + dy,
    lines: layout.lines.map((line) => ({
      ...line,
      baseline: line.baseline + dy,
      inkBounds: [line.inkBounds[0], line.inkBounds[1] + dy, line.inkBounds[2], line.inkBounds[3]],
    })),
    separators: layout.separators.map((y) => y + dy),
  };
}
