import type { CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import type { RenderedCardInput, RulesParagraph } from '../presentation/face-layout.js';
import { layoutRules } from '../presentation/rules-layout.js';
import type { CalibratedBody } from './types.js';

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
