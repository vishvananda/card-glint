import { FACE_HEIGHT, FACE_WIDTH, type RenderedCardInput } from './face-layout.js';
import { faceFrame, faceRects, specialRules } from './special-frames.js';
import { layoutRules } from './rules-layout.js';

/** Match explicit styles to the visible ability, stripping only its loyalty prefix.
 * rulesText remains the special-frame source; unrelated ordinary paragraphs do
 * not replace it or introduce duplicate/flavor rows. */
function abilityRuns(face: RenderedCardInput, text: string, index: number) {
  const paragraph = face.rulesParagraphs?.filter((p) => p.role === 'rules')[index];
  const source = (face.rulesText ?? '').split('\n').filter((line) => line.trim())[index];
  if (!paragraph || paragraph.runs.map((r) => r.text).join('') !== source) return [{ text }];
  let skip = source.length - text.length;
  return paragraph.runs.flatMap((run) => {
    const start = Math.min(skip, run.text.length);
    skip -= start;
    return start === run.text.length ? [] : [{ ...run, text: run.text.slice(start) }];
  });
}

/** Measured ability geometry, in reference pixels, computed only at composition.
 * Reserve the curved lower panel/loyalty plate; static text has no badge indent. */
export function planeswalkerRuleRows(context: CanvasRenderingContext2D, face: RenderedCardInput) {
  const large = faceFrame(face) === 'planeswalker-large';
  const rect = faceRects(face).rules;
  const x = rect[0] * FACE_WIDTH,
    y = rect[1] * FACE_HEIGHT,
    width = rect[2] * FACE_WIDTH,
    height = rect[3] * FACE_HEIGHT - (large ? 24 : 16),
    topInset = large ? 4 : 0;
  const rows = specialRules(face).map((row, index) => ({
    ...row,
    runs: abilityRuns(face, row.text, index),
    left: row.badges.length ? 67 : 45,
  }));
  const measure = (size: number) =>
    rows.map((row) =>
      layoutRules(
        context,
        [{ role: 'rules', runs: row.runs }],
        { x: x + row.left, y: 0, width: width - row.left - 8, height: 1000 },
        size,
        size,
      ),
    );
  let font = large ? 18 : 19,
    measured = measure(font);
  const minimum = () => measured.map((layout) => Math.max(34, layout.height + 16));
  const fixedRowsFit = () => {
    const step = height / Math.max(1, rows.length);
    return measured.every((layout, i) => {
      const center = step * (i + 0.5);
      return (
        center - layout.height / 2 >= 6 &&
        center + layout.height / 2 <= height + 6 &&
        (!i || step - (layout.height + measured[i - 1]!.height) / 2 >= 8)
      );
    });
  };
  while (
    font > 8 &&
    (minimum().reduce((sum, h) => sum + h, 0) > height || (!large && !fixedRowsFit()))
  ) {
    font -= 0.25;
    measured = measure(font);
  }
  const heights = minimum();
  // Equal rows where possible; a longer ability reserves its measured demand.
  let share = height / Math.max(1, rows.length),
    remaining = height,
    count = rows.length;
  for (const needed of large ? [...heights].sort((a, b) => b - a) : []) {
    if (needed <= share) break;
    remaining -= needed;
    share = remaining / Math.max(1, --count);
  }
  let top = topInset;
  return rows.map((row, index) => {
    const h = large ? Math.max(share, heights[index]!) : share;
    // Three-ability cards keep evenly spaced badge anchors. Measured text may
    // extend slightly across a nominal row edge, with explicit ink-gap checks.
    const textHeight = Math.max(h, measured[index]!.height);
    const layout = layoutRules(
      context,
      [{ role: 'rules', runs: row.runs }],
      {
        x: x + row.left,
        y: y + top - (textHeight - h) / 2,
        width: width - row.left - 8,
        height: textHeight,
      },
      font,
      font,
    );
    layout.overflow ||= top + h > topInset + height + 0.01;
    layout.overflow ||= !large && !fixedRowsFit();
    const result = { ...row, top, height: h, font, width: layout.width, layout };
    top += h;
    return result;
  });
}
