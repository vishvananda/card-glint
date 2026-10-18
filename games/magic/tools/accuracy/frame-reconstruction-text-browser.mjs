// Local-only replay of archived shared typography candidates. This is not a
// renderer default or a printing-ID override. Current native ink stays intact.
export async function prepareTextReplay(context, face, model) {
  if (!model) return null;
  if (face.setCode !== 'lea') throw Error('This archived candidate is Alpha-only');
  const { retroTextLayout } = await import('/games/magic/src/presentation/retro-rules.ts');
  const { layoutRules, rulesLayoutRequest } = await import(
    '/games/magic/src/presentation/rules-layout.ts'
  );
  const { paintRulesLayout } = await import('/games/magic/src/presentation/rules-paint.ts');
  const { originalRulesSymbols } = await import('/games/magic/src/presentation/retro-details.ts');
  const original = retroTextLayout(context, face);
  const request = original && rulesLayoutRequest(original);
  if (!request) throw Error('Missing native typography request');
  const paragraphs = request.paragraphs;
  const centered = paragraphs.every((p) => p.align === 'center');
  const group = centered
    ? original.lines.length >= 5 && original.size >= 30
      ? 'centered-long'
      : 'centered'
    : paragraphs.some((p) => p.align === 'center')
      ? 'mixed'
      : original.size < 19
        ? 'dense'
        : 'regular';
  const adjustment = model.rules[`lea:${group}`]?.adjustment;
  if (!adjustment) return { summary: { group, applied: false, reason: 'no-shared-candidate' } };
  const a = adjustment;
  for (const value of Object.values(a))
    if (!Number.isFinite(value)) throw Error('Invalid text candidate');
  const scale = 1 + a.widthScale / 100;
  const size = original.size + a.fontSize;
  const width = (original.width - a.leftMargin - a.rightMargin) / scale;
  if (scale <= 0 || size <= 0 || width <= 0) throw Error('Invalid candidate bounds');
  const shape = layoutRules(context, paragraphs, { x: 0, y: 0, width, height: 200 }, size, size, {
    ...request.typography,
    leading: request.typography.leading + a.lineSpacing / size,
    paragraphGap: Math.max(0, request.typography.paragraphGap + a.paragraphSpacing / size),
    flavorGap: Math.max(0, request.typography.flavorGap + a.flavorSpacing / size),
    flavorSeparator: original.separators.length > 0,
  });
  const dx = (original.x + a.leftMargin) / scale;
  const dy = original.top + a.verticalOffset - shape.top;
  const candidate = {
    ...shape,
    x: dx,
    top: shape.top + dy,
    lines: shape.lines.map((l) => ({
      ...l,
      x: l.x + dx,
      baseline: l.baseline + dy,
      inkBounds: [l.inkBounds[0] + dx, l.inkBounds[1] + dy, l.inkBounds[2], l.inkBounds[3]],
    })),
    separators: shape.separators.map((y) => y + dy),
  };
  const top = Math.min(412, original.top - 1);
  const overflow =
    shape.overflow ||
    candidate.lines.some(
      (l) =>
        l.inkBounds[1] < top ||
        l.inkBounds[1] + l.inkBounds[3] > 600 ||
        l.inkBounds[0] * scale < 48 ||
        (l.inkBounds[0] + l.inkBounds[2]) * scale > 448,
    );
  return {
    summary: {
      group,
      applied: !overflow,
      reason: overflow ? 'overflow-retained-native' : 'shared-candidate',
      adjustment,
      baseline: {
        size: original.size,
        x: original.x,
        top: original.top,
        lines: original.lines.length,
      },
      candidate: {
        size,
        x: candidate.x * scale,
        top: candidate.top,
        lines: candidate.lines.length,
      },
    },
    paint: overflow
      ? null
      : (images) => {
          context.save();
          context.shadowColor = 'transparent';
          context.globalAlpha = 1;
          context.globalCompositeOperation = 'source-over';
          context.scale(scale, 1);
          // 0.5.1 removed Alpha's earlier 0.012em thinning. Replay only layout.
          paintRulesLayout(context, candidate, images, originalRulesSymbols(face.setCode));
          context.restore();
        },
  };
}
