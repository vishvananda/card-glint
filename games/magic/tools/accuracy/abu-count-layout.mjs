import { layoutRules, rulesLayoutRequest } from '../../src/presentation/rules-layout.ts';
import { alphaRulesLayout } from '../../src/presentation/alpha-rules.ts';
import { retroPx, retroRects } from '../../src/presentation/retro-frame.ts';

/** Experimental tier selection only: retain the native measured geometry when
 * its tier already agrees. Never use a scan, card name, or printing ID. */
export function countLayout(context, face, options = {}, base) {
  if (!base) throw Error('Count study requires the native base layout');
  const request = rulesLayoutRequest(base);
  if (!request) throw Error('Missing native typography request');
  const paragraphs = face.rulesParagraphs ?? [];
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
  let chosen;
  if (characters <= (options.largeMaximum ?? 117) && face.rulesAlignment?.mode !== 'left') {
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
    if (characters > (options.mediumMaximum ?? 274)) {
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
  if (chosen.size >= 19) return alphaRulesLayout(context, face, chosen);
  const r = rulesLayoutRequest(chosen);
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
