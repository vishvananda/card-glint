import type { RulesLayout } from './rules-layout.js';
import type { RenderedCardInput } from './face-layout.js';
import { eighthPrintingProfile } from './eighth-printing-profile.js';
/** Shared size ceilings, plus reviewed Original line-break exceptions. The latter
 * match printed content and collector identity and never transfer with a donor. */
export function eighthRulesMaximum(face: RenderedCardInput): number | undefined {
  const p = eighthPrintingProfile(face);
  if (!p) return undefined;
  if (face.wordingMode === 'original' && !p.inheritedFrom) {
    const key = face.collectorNumber?.replace(/★$/, '') ?? '';
    const exact = p.originalRules[key];
    const text =
      face.rulesParagraphs?.map((p) => p.runs.map((r) => r.text).join('')).join('\n') ??
      face.rulesText ??
      '';
    if (exact && text.replace(/\s/g, '') === exact.text.replace(/\s/g, ''))
      return exact.maximumSize;
  }
  return /\bLand\b/.test(face.canonicalTypeLine ?? face.typeLine ?? '')
    ? p.rules.landMaximumSize
    : p.rules.maximumSize;
}

/** For moderately crowded multi-paragraph copy, retain a readable size by
 * tightening leading. Very dense text keeps its measured smaller typography. */
export function eighthCompactRules(
  face: RenderedCardInput,
  baseline: RulesLayout,
  scale: number,
  fit: (leading: number) => RulesLayout,
): RulesLayout {
  const rule = eighthPrintingProfile(face)?.rules.compact;
  const count =
    face.rulesParagraphs?.length ?? (face.rulesText ?? '').split('\n').filter(Boolean).length;
  if (
    !rule ||
    baseline.size >= rule.minimumSize * scale ||
    count < rule.minimumParagraphs ||
    /\bLand\b/.test(face.canonicalTypeLine ?? face.typeLine ?? '')
  )
    return baseline;
  const candidate = fit(rule.leading);
  return !candidate.overflow && candidate.size >= rule.minimumSize * scale ? candidate : baseline;
}
