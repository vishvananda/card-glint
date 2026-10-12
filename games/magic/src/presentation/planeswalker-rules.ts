import { FACE_HEIGHT, FACE_WIDTH, type RenderedCardInput } from './face-layout.js';
import { faceFrame, faceRects, specialRules } from './special-frames.js';
import { layoutRules, RULES_TYPOGRAPHY } from './rules-layout.js';
import { planeswalkerInkLimits } from './planeswalker-lower-frame.js';

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
  const abilities = specialRules(face),
    sparse = !large && abilities.length < 3;
  const rect = faceRects(face).rules;
  const x = rect[0] * FACE_WIDTH,
    y = rect[1] * FACE_HEIGHT,
    width = rect[2] * FACE_WIDTH,
    height = rect[3] * FACE_HEIGHT - (large ? 24 : sparse ? 4 : 16),
    topInset = large ? 8 : sparse ? 3 : 0;
  const typography = large ? { ...RULES_TYPOGRAPHY, leading: 0.9 } : RULES_TYPOGRAPHY;
  const rows = abilities.map((row, index) => ({
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
        typography,
      ),
    );
  let font = large ? 17.5 : sparse ? 24 : 19,
    measured = measure(font);
  const [inkTop, inkBottom] = planeswalkerInkLimits(large);
  const paperTops = () => {
    const step = height / Math.max(1, rows.length);
    const tops = measured.map((layout, i) => y + topInset + step * (i + 0.5) - layout.height / 2);
    let previous = inkTop - 8;
    for (let i = 0; i < tops.length; i++) {
      tops[i] = Math.max(tops[i]!, previous + 8);
      previous = tops[i]! + measured[i]!.height;
    }
    let next = inkBottom + 8;
    for (let i = tops.length - 1; i >= 0; i--) {
      tops[i] = Math.min(tops[i]!, next - 8 - measured[i]!.height);
      next = tops[i]!;
    }
    return tops;
  };
  const paperFits = () => (paperTops()[0] ?? inkTop) >= inkTop;
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
    (minimum().reduce((sum, h) => sum + h, 0) > height || !fixedRowsFit() || !paperFits())
  ) {
    font -= 0.25;
    measured = measure(font);
  }
  const share = height / Math.max(1, rows.length);
  const textTops = paperTops();
  let top = topInset;
  return rows.map((row, index) => {
    const h = share;
    // Keep evenly spaced ability anchors, including a short static row. Text may
    // extend slightly across a nominal row edge, with explicit ink-gap checks.
    const textHeight = measured[index]!.height;
    const layout = layoutRules(
      context,
      [{ role: 'rules', runs: row.runs }],
      {
        x: x + row.left,
        y: textTops[index]!,
        width: width - row.left - 8,
        height: textHeight,
      },
      font,
      font,
      typography,
    );
    layout.overflow ||= top + h > topInset + height + 0.01;
    layout.overflow ||= !fixedRowsFit();
    layout.overflow ||= !paperFits();
    layout.overflow ||= layout.lines.some(
      (line) =>
        line.inkBounds[1] < inkTop - 0.01 ||
        line.inkBounds[1] + line.inkBounds[3] > inkBottom + 0.01,
    );
    const result = { ...row, top, height: h, font, width: layout.width, layout };
    top += h;
    return result;
  });
}
