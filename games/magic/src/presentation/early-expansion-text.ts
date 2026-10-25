import { type CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import type { RenderedCardInput, RulesParagraph } from './face-layout.js';
import { layoutRules, type RulesTypography } from './rules-layout.js';
import { calibrationForFace } from '../calibration/selection.js';
import type { CalibratedExpansionBody } from '../calibration/types.js';

const profiles: Readonly<Record<'arn' | 'atq' | 'drk', CalibratedExpansionBody>> = {
  arn: {
    regular: 23,
    textWidth: 1,
    threshold: 130,
    offset: -10,
    compact: 17.5,
    compactLeading: 1.15,
  },
  atq: {
    regular: 22.5,
    textWidth: 1.02,
    threshold: 130,
    offset: -10,
    compact: 15.5,
    compactLeading: 1.2,
  },
  drk: {
    regular: 22.5,
    textWidth: 1,
    threshold: 130,
    offset: -4,
    compact: 15.5,
    compactLeading: 1.2,
  },
};
const defaultBounds = { x: 70, y: 414, width: 348, height: 184 };
const text = (p: RulesParagraph) => p.runs.map((run) => run.text).join('');
const length = (paragraphs: readonly RulesParagraph[]) =>
  paragraphs.reduce(
    (n, p) =>
      n +
      text(p)
        .replace(/\{[^}]+\}/g, '●')
        .replaceAll('\u00ad', '').length,
    0,
  );
const heading = (p: RulesParagraph) =>
  p.role === 'rules' && /^[A-Za-z ,]+$/.test(text(p)) && text(p).length <= 28;
const alignLarge = (
  paragraphs: readonly RulesParagraph[],
  centerRules = false,
): readonly RulesParagraph[] =>
  paragraphs.map((p, i) => ({
    ...p,
    align:
      !centerRules &&
      p.role === 'rules' &&
      (paragraphs.some((block) => block.role === 'flavor') ||
        (i === 0 && paragraphs.length > 1 && heading(p)))
        ? 'left'
        : 'center',
  }));

/** Shared early-expansion size classes, with scan normalization kept outside
 * the painter. Select centering from the host's wording reference, then fit all
 * visible text. Nominal regular fit keeps a small width adjustment from causing
 * a large jump to compact type. Inline symbols retain their own aspect/advance. */
export function earlyExpansionTextLayout(
  context: CanvasContext,
  face: RenderedCardInput,
  paragraphs: readonly RulesParagraph[],
  reference: readonly RulesParagraph[],
) {
  const set = face.setCode?.toLowerCase();
  if (
    (set !== 'arn' && set !== 'atq' && set !== 'drk') ||
    face.frameTemplate ||
    face.frameAssetFamily ||
    face.frameStyle === 'modern' ||
    (face.borderColor && face.borderColor !== 'black') ||
    (face.layout && face.layout !== 'normal') ||
    /\b(Saga|Class|Planeswalker|Battle)\b/.test(face.typeLine ?? '')
  )
    return null;
  const p = calibrationForFace(face)?.expansionBody ?? profiles[set];
  const baseline = expansionBodyLayout(context, face, paragraphs, reference, set, p);
  const freeSpace = (p.bounds ?? defaultBounds).height - baseline.height;
  if (
    !p.unconstrained ||
    (baseline.size >= 20 && freeSpace <= (p.unconstrained.minimumFreeSpace ?? 20) + 0.02)
  )
    return baseline;
  const refined = expansionBodyLayout(context, face, paragraphs, reference, set, {
    ...p,
    ...p.unconstrained,
    unconstrained: undefined,
  });
  return refined.overflow && !baseline.overflow ? baseline : refined;
}

function expansionBodyLayout(
  context: CanvasContext,
  face: RenderedCardInput,
  paragraphs: readonly RulesParagraph[],
  reference: readonly RulesParagraph[],
  set: 'arn' | 'atq' | 'drk',
  p: CalibratedExpansionBody,
) {
  const bounds = p.bounds ?? defaultBounds;
  const minimum = face.wordingMode === 'oracle' ? 10 : 15;
  const typography: RulesTypography = {
    fractionalMetrics: p.fractionalMetrics,
    textWidth: p.textWidth,
    leading: p.regularLeading ?? 1,
    paragraphGap: 0,
    flavorGap: 0,
    flavorOrphans: p.flavorOrphans ?? false,
    flavorOrphanMinCharacters: p.flavorOrphanMinCharacters,
    flavorSeparator: false,
    centerOffset: p.offset,
  };
  const eligible =
    face.rulesAlignment?.mode !== 'left' &&
    reference.length > 0 &&
    length(reference) <= p.threshold &&
    reference.every((block) => block.align === undefined && !text(block).includes('\n')) &&
    paragraphs.every((block) => block.align === undefined);
  if (eligible) {
    const dark = set === 'drk';
    const largeBounds = dark ? { ...bounds, x: 76, width: 336 } : bounds;
    const largeStyle = {
      ...typography,
      textWidth: 1,
      leading: p.largeLeading ?? 1.1,
      centerOffset: p.largeOffset ?? (dark ? 0 : -14),
      balanceLines: true,
      balanceCenteredOnly: true,
    };
    const trial = layoutRules(
      context,
      alignLarge(reference, dark),
      largeBounds,
      p.largeSize ?? 27.5,
      p.largeSize ?? 27.5,
      largeStyle,
    );
    if (!trial.overflow && trial.lines.length <= 5) {
      const centered = alignLarge(paragraphs, dark);
      const visible = layoutRules(
        context,
        centered,
        largeBounds,
        p.largeSize ?? 27.5,
        minimum,
        largeStyle,
      );
      if (!dark || visible.lines.length >= 5) return visible;
      // Short DRK blocks sit slightly above geometric center. Use visible line
      // count so a longer Oracle body does not inherit the short original's bias.
      return layoutRules(context, centered, largeBounds, p.largeSize ?? 27.5, minimum, {
        ...largeStyle,
        centerOffset: -2 * (5 - visible.lines.length),
      });
    }
  }
  const nominal = layoutRules(context, paragraphs, bounds, 22.5, 21.75, {
    ...typography,
    textWidth: 1,
  });
  if (!nominal.overflow) {
    const regular = layoutRules(
      context,
      paragraphs,
      bounds,
      p.regular,
      Math.min(p.regular, 21.75 / Math.max(1, p.textWidth)),
      typography,
    );
    if (set !== 'drk') return regular;
    // Choose from the unchanged nominal layout. Spacing must never promote
    // compact printing into regular type or alter the centered-size policy.
    const short = regular.lines.length <= 5;
    return layoutRules(
      context,
      paragraphs,
      { ...bounds, x: 71, y: short ? 415 : 418, width: short ? 348 : 351 },
      p.regular,
      Math.min(p.regular, 21.75 / Math.max(1, p.textWidth)),
      { ...typography, leading: 0.96 },
    );
  }
  return layoutRules(
    context,
    paragraphs,
    set === 'drk' ? { ...bounds, x: 73, y: 418, width: 342 } : bounds,
    p.compact,
    minimum,
    {
      ...typography,
      textWidth: 1,
      leading: set === 'drk' ? 1.22 : p.compactLeading,
    },
  );
}
