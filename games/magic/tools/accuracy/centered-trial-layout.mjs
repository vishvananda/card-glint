import { layoutRules } from '../../src/presentation/rules-layout.ts';
import { RETRO_TYPOGRAPHY } from '../../src/presentation/retro-rules.ts';

/** Development-only balanced line breaking for the single-style centered cohort.
 * Explicit newlines are used only to observe this candidate, never as scan targets.
 */
export function centeredTrial(context, face, { size, width, y = 404.556, balanced = true }) {
  const paragraphs = face.rulesParagraphs.map((paragraph) => {
    if (
      paragraph.runs.length !== 1 ||
      paragraph.runs[0].italic ||
      paragraph.runs[0].text.includes('\n')
    )
      throw Error('Centered trial requires one plain style run without forced line breaks');
    const tokens = paragraph.runs[0].text.trim().split(/\s+/);
    const measured = new Map();
    const measure = (a, b) => {
      const key = `${a}:${b}`;
      if (!measured.has(key))
        measured.set(
          key,
          layoutRules(
            context,
            [{ ...paragraph, runs: [{ text: tokens.slice(a, b).join(' ') }] }],
            { x: 0, y: 0, width: 10000, height: 10000 },
            size,
            size,
            RETRO_TYPOGRAPHY,
          ).lines[0].width,
        );
      return measured.get(key);
    };
    let greedy = 0,
      start = 0;
    while (start < tokens.length) {
      let end = start + 1;
      while (end < tokens.length && measure(start, end + 1) <= width) end++;
      greedy++;
      start = end;
    }
    const memo = new Map();
    const solve = (a, lines) => {
      if (!lines) return a === tokens.length ? { cost: 0, cuts: [] } : null;
      const key = `${a}:${lines}`;
      if (memo.has(key)) return memo.get(key);
      let best = null;
      for (let b = a + 1; b <= tokens.length - lines + 1; b++) {
        const w = measure(a, b);
        if (w > width) break;
        const rest = solve(b, lines - 1);
        if (!rest) continue;
        const cost = rest.cost + (width - w) ** 2;
        if (!best || cost < best.cost) best = { cost, cuts: [b, ...rest.cuts] };
      }
      memo.set(key, best);
      return best;
    };
    const solution = balanced ? solve(0, greedy) : null;
    let previous = 0;
    const text = solution
      ? solution.cuts
          .map((end) => {
            const line = tokens.slice(previous, end).join(' ');
            previous = end;
            return line;
          })
          .join('\n')
      : paragraph.runs[0].text;
    return { ...paragraph, align: 'center', runs: [{ text }] };
  });
  return layoutRules(
    context,
    paragraphs,
    { x: 244 - width / 2, y, width, height: 177.232 },
    size,
    size,
    RETRO_TYPOGRAPHY,
  );
}
