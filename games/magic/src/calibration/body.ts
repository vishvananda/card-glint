import type { CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import type { RenderedCardInput, RulesParagraph } from '../presentation/face-layout.js';
import { layoutRules, rulesLayoutRequest, type RulesLayout } from '../presentation/rules-layout.js';
import type { CalibratedBody, CalibratedBodyClasses } from './types.js';

/** Fit the displayed wording; select a short-text policy using the supplied
 * original/Oracle reference. Explicit paragraph alignment remains authoritative. */
export function calibratedBodyLayout(
  context: CanvasContext,
  face: RenderedCardInput,
  profile: CalibratedBody,
  paragraphs: readonly RulesParagraph[],
  reference: readonly RulesParagraph[],
) {
  const center = profile.centered;
  const length = reference.reduce((n, p) => n + p.runs.reduce((n, r) => n + r.text.length, 0), 0);
  const minimum =
    face.wordingMode === 'oracle' ? Math.min(10, profile.minimumSize) : profile.minimumSize;
  let centered = false;
  if (center && face.rulesAlignment?.mode !== 'left' && length <= center.maxCharacters) {
    const probe = layoutRules(
      context,
      reference,
      profile.bounds,
      center.maximumSize,
      center.maximumSize,
      profile.typography,
    );
    centered = !probe.overflow && probe.lines.length <= center.maxLines;
  }
  const visible = paragraphs.map((p) => ({
    ...p,
    align:
      p.align ?? (face.rulesAlignment?.mode === 'left' ? 'left' : centered ? 'center' : 'left'),
  }));
  return layoutRules(
    context,
    visible,
    profile.bounds,
    centered ? center!.maximumSize : profile.maximumSize,
    minimum,
    profile.typography,
  );
}

/** The same semantic pair selects both the fit and its scoped face revision. */
export function isPureFlavorPair(
  paragraphs: readonly RulesParagraph[],
  reference: readonly RulesParagraph[],
): boolean {
  return (
    paragraphs.length > 0 &&
    reference.length > 0 &&
    [...paragraphs, ...reference].every((p) => p.role === 'flavor')
  );
}

/** Refine measured size classes without reclassifying already-correct text.
 * The reference layout chooses a class; visible Oracle text still fits safely. */
export function calibratedBodyClasses(
  context: CanvasContext,
  face: RenderedCardInput,
  profile: CalibratedBodyClasses,
  base: RulesLayout,
  referenceBase: RulesLayout,
  paragraphs: readonly RulesParagraph[],
  reference: readonly RulesParagraph[],
): RulesLayout {
  // Pure flavor uses its existing physical request, not the rules-only
  // centering/compact classifier. Fractional advances remove word-by-word
  // rounding without changing margins, leading or the allowed type range.
  if (isPureFlavorPair(paragraphs, reference)) {
    if (!profile.typography.fractionalMetrics || referenceBase.size === profile.centered.size)
      return base;
    const request = rulesLayoutRequest(base);
    if (!request) throw Error('Missing native flavor layout request');
    // An explicit material-level choice, including false, remains authoritative.
    if (request.typography.fractionalMetrics !== undefined) return base;
    const precise = layoutRules(
      context,
      request.paragraphs,
      request.bounds,
      request.maximumSize,
      request.minimumSize,
      { ...request.typography, fractionalMetrics: true },
    );
    return precise.overflow ? base : precise;
  }
  if (
    !reference.length ||
    !paragraphs.length ||
    [...paragraphs, ...reference].some((p) => p.role !== 'rules' || p.align !== undefined) ||
    referenceBase.size === profile.centered.size
  )
    return base;
  const length = reference.reduce(
    (n, p) =>
      n +
      p.runs
        .map((r) => r.text)
        .join('')
        .replace(/\{[^}]+\}/g, '●').length,
    0,
  );
  const minimum = (size: number) => (face.wordingMode === 'oracle' ? Math.min(10, size) : size);
  const centered = (blocks: readonly RulesParagraph[]) =>
    blocks.map((p) => ({ ...p, align: 'center' as const }));
  if (
    face.rulesAlignment?.mode !== 'left' &&
    length <= profile.centered.maxCharacters &&
    reference.every((p) => p.runs.every((r) => !r.text.includes('\n')))
  ) {
    const typography = {
      ...profile.typography,
      balanceLines: true,
      balanceCenteredOnly: true,
    };
    const trial = layoutRules(
      context,
      centered(reference),
      profile.bounds,
      profile.centered.size,
      profile.centered.size,
      typography,
    );
    if (!trial.overflow && trial.lines.length <= profile.centered.maxLines) {
      const visible = layoutRules(
        context,
        centered(paragraphs),
        profile.bounds,
        profile.centered.size,
        minimum(profile.centered.size),
        typography,
      );
      return visible.overflow ? base : visible;
    }
  }
  if (
    referenceBase.size < profile.compact.nominalMinimum ||
    referenceBase.size >= profile.compact.nominalMaximum
  )
    return base;
  const compact = layoutRules(
    context,
    paragraphs,
    profile.bounds,
    profile.compact.size,
    minimum(profile.compact.size),
    { ...profile.typography, leading: profile.compact.leading },
  );
  return compact.overflow ? base : compact;
}
