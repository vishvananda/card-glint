import { rulesLines } from '../../src/presentation/canvas-text.ts';
import { FACE_TEXT } from '../../src/presentation/face-layout.ts';
import {
  retroBasicSymbol,
  retroPx,
  retroRects,
  retroRulesSize,
} from '../../src/presentation/retro-frame.ts';

/** Observation of the archived legacy painter, used only by the baseline harness.
 * Matches its per-token painting, top baseline, 3.84px centering estimate and
 * FACE_TEXT paragraph advance. Does not change the production painter or pixels.
 */
export function legacyRetroLayout(context, face) {
  if (retroBasicSymbol(face)) return null;
  const [x, y, width, height] = retroPx(retroRects(face).rules);
  const text = face.rulesText ?? '',
    size = retroRulesSize(face);
  context.save();
  try {
    context.font = `${size}px "CardRenderer MTG MPlantin", Georgia`;
    context.textAlign = 'left';
    context.letterSpacing = '0px';
    const estimatedHeight =
      rulesLines(context, text, width, size).length * size + (text.split('\n').length - 1) * 3.84;
    let top = y + Math.max(0, (height - estimatedHeight) / 2);
    const lines = [];
    for (const paragraph of text.split('\n')) {
      for (const tokens of rulesLines(context, paragraph, width, size)) {
        context.textBaseline = 'top';
        const topAscent = context.measureText('M').actualBoundingBoxAscent;
        context.textBaseline = 'alphabetic';
        const baseline = top + context.measureText('M').actualBoundingBoxAscent - topAscent;
        let cursor = x;
        const runs = tokens.map((token) => {
          const m = context.measureText(token.text);
          const ink = token.symbol
            ? [cursor + size * 0.07, top + size * 0.03, size * 0.8, size * 0.8]
            : [
                cursor - m.actualBoundingBoxLeft,
                baseline - m.actualBoundingBoxAscent,
                m.actualBoundingBoxLeft + m.actualBoundingBoxRight,
                m.actualBoundingBoxAscent + m.actualBoundingBoxDescent,
              ];
          cursor += token.width;
          return { ...token, italic: false, size, inkBounds: ink };
        });
        const present = runs.filter((r) => r.inkBounds[2] > 0);
        const left = Math.min(...present.map((r) => r.inkBounds[0]), cursor);
        const right = Math.max(...present.map((r) => r.inkBounds[0] + r.inkBounds[2]), x);
        const inkTop = present.length ? Math.min(...present.map((r) => r.inkBounds[1])) : top;
        const bottom = Math.max(...present.map((r) => r.inkBounds[1] + r.inkBounds[3]), top);
        lines.push({
          runs,
          width: cursor - x,
          baseline,
          role: 'rules',
          inkBounds: [left, inkTop, right - left, bottom - inkTop],
        });
        top += size;
      }
      top += FACE_TEXT.paragraphGap;
    }
    const overflow = lines.some(
      ({ inkBounds: [left, top, w, h] }) =>
        left < x - 0.01 ||
        left + w > x + width + 0.01 ||
        top < y - 0.01 ||
        top + h > y + height + 0.01,
    );
    return {
      size,
      x,
      width,
      top: y + Math.max(0, (height - estimatedHeight) / 2),
      height: estimatedHeight,
      overflow,
      lines,
      separators: [],
      method: 'legacy-observation',
    };
  } finally {
    context.restore();
  }
}
