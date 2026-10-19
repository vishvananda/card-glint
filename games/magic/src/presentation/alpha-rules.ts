import type { RenderedCardInput } from './face-layout.js';
import { layoutRules, rulesLayoutRequest, type RulesLayout } from './rules-layout.js';

// Shared full-set model replayed against current native ink, then reviewed on
// all 45 white printings. Dense/mixed passages and unsafe fits retain the base.
// Deltas are canonical 488px-card pixels, not scan-specific offsets.
const models = {
  centered: { left: 10.5, right: -2.5, y: -5, size: 0.5, width: 0.975, leading: -0.5 },
  regular: { left: 10.5, right: -1, y: -2, size: 0, width: 1.005, leading: -0.5 },
  long: { left: 10.5, right: -2, y: 9.5, size: 0, width: 0.99, leading: -0.25 },
} as const;

export function alphaRulesLayout(
  context: CanvasRenderingContext2D,
  face: RenderedCardInput,
  original: RulesLayout | null,
): RulesLayout | null {
  if (!['lea', 'leb'].includes(face.setCode?.toLowerCase() ?? '')) return original;
  return earlyRulesModel(context, face, original);
}

/** Shared physical model exposed internally for independent transfer trials. */
export function earlyRulesModel(
  context: CanvasRenderingContext2D,
  face: RenderedCardInput,
  original: RulesLayout | null,
): RulesLayout | null {
  if (!original) return original;
  const request = rulesLayoutRequest(original);
  if (!request || !request.paragraphs.length) return original;
  const paragraphs = request.paragraphs;
  const centered = paragraphs.every((p) => p.align === 'center');
  const model = centered
    ? original.lines.length >= 5 && original.size >= 30
      ? models.long
      : models.centered
    : paragraphs.some((p) => p.align === 'center') || original.size < 19
      ? null
      : models.regular;
  if (!model) return original;
  const size = original.size + model.size;
  const shape = layoutRules(
    context,
    paragraphs,
    { x: 0, y: 0, width: (original.width - model.left - model.right) / model.width, height: 200 },
    size,
    size,
    {
      ...request.typography,
      leading: request.typography.leading + model.leading / size,
      flavorSeparator: original.separators.length > 0,
    },
  );
  const dx = (original.x + model.left) / model.width;
  const dy = original.top + model.y - shape.top;
  const candidate: RulesLayout = {
    ...shape,
    x: dx,
    top: shape.top + dy,
    horizontalScale: model.width,
    lines: shape.lines.map((l) => ({
      ...l,
      x: (l.x ?? shape.x) + dx,
      baseline: l.baseline + dy,
      inkBounds: [l.inkBounds[0] + dx, l.inkBounds[1] + dy, l.inkBounds[2], l.inkBounds[3]],
    })),
    separators: shape.separators.map((y) => y + dy),
  };
  // The Oracle path also keeps its tighter safe inset when reminders expand.
  const top = face.wordingMode === 'oracle' ? 428 : Math.min(412, original.top - 1);
  const bottom = face.wordingMode === 'oracle' ? 590 : 600;
  const overflow =
    shape.overflow ||
    candidate.lines.some(
      ({ inkBounds: [x, y, w, h] }) =>
        y < top || y + h > bottom || x * model.width < 48 || (x + w) * model.width > 448,
    );
  return overflow ? original : candidate;
}
