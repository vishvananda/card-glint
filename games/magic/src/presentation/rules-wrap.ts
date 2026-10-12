import { symbolTextParts, type RulesRun } from './face-layout.js';

export interface MeasuredRun {
  text: string;
  italic: boolean;
  symbol: boolean;
  width: number;
  size: number;
  ascent: number;
  descent: number;
  inkLeft: number;
  inkRight: number;
}
export const rulesFont = (size: number, italic = false) =>
  `${italic ? 'italic ' : ''}${size}px "CardRenderer MTG MPlantin", Georgia`;

interface Piece {
  text: string;
  italic: boolean;
  symbol: boolean;
}
interface Word {
  pieces: Piece[];
  space: boolean;
  newline?: boolean;
}

function words(runs: readonly RulesRun[]): Word[] {
  const output: Word[] = [];
  let pieces: Piece[] = [],
    space = false;
  const flush = () => {
    if (pieces.length) {
      output.push({ pieces, space });
      pieces = [];
      space = false;
    }
  };
  for (const run of runs)
    for (const part of symbolTextParts(run.text)) {
      if (part.symbol) pieces.push({ text: part.symbol, symbol: true, italic: false });
      else
        for (const text of part.value.split(/(\n|[^\S\n]+)/).filter(Boolean)) {
          if (/^\s+$/.test(text)) {
            flush();
            if (text === '\n') {
              output.push({ pieces: [], space: false, newline: true });
              space = false;
            } else space = true;
          } else pieces.push({ text, symbol: false, italic: Boolean(run.italic) });
        }
    }
  flush();
  return output;
}

/** Measure the same contiguous style runs that Canvas paints, retaining shaping/kerning. */
function measure(context: CanvasRenderingContext2D, pieces: Piece[], size: number): MeasuredRun[] {
  const merged: Piece[] = [];
  for (const piece of pieces) {
    const last = merged.at(-1);
    if (last && !last.symbol && !piece.symbol && last.italic === piece.italic)
      last.text += piece.text;
    else merged.push({ ...piece });
  }
  return merged.map((piece) => {
    context.font = rulesFont(size, piece.italic);
    const metrics = context.measureText(piece.text);
    return {
      ...piece,
      size,
      width: piece.symbol ? size * 0.88 : metrics.width,
      ascent: piece.symbol ? size * 0.72 : metrics.actualBoundingBoxAscent,
      descent: piece.symbol ? size * 0.08 : metrics.actualBoundingBoxDescent,
      inkLeft: piece.symbol ? size * 0.025 : -metrics.actualBoundingBoxLeft,
      inkRight: piece.symbol ? size * 0.825 : metrics.actualBoundingBoxRight,
    };
  });
}

function wrapWords(
  context: CanvasRenderingContext2D,
  tokens: readonly Word[],
  width: number,
  size: number,
) {
  const output: MeasuredRun[][] = [];
  let current: Piece[] = [];
  for (const word of tokens) {
    if (word.newline) {
      output.push(measure(context, current, size));
      current = [];
      continue;
    }
    const gap: Piece[] =
      current.length && word.space
        ? [{ text: ' ', italic: word.pieces[0]?.italic ?? false, symbol: false }]
        : [];
    const trial = measure(context, [...current, ...gap, ...word.pieces], size);
    if (current.length && trial.reduce((n, r) => n + r.width, 0) > width) {
      output.push(measure(context, current, size));
      current = [...word.pieces];
    } else current.push(...gap, ...word.pieces);
  }
  if (current.length) output.push(measure(context, current, size));
  return output;
}

/** Keep the minimum feasible line count, then balance unused width on every line. */
function balanceWords(
  context: CanvasRenderingContext2D,
  tokens: readonly Word[],
  width: number,
  size: number,
): MeasuredRun[][] {
  const greedy = wrapWords(context, tokens, width, size);
  if (greedy.length < 2) return greedy;
  const measured = new Map<string, MeasuredRun[]>();
  const range = (start: number, end: number) => {
    const key = `${start}:${end}`;
    let value = measured.get(key);
    if (!value) {
      const pieces: Piece[] = [];
      for (let i = start; i < end; i++) {
        const word = tokens[i]!;
        if (i > start && word.space)
          pieces.push({ text: ' ', italic: word.pieces[0]?.italic ?? false, symbol: false });
        pieces.push(...word.pieces);
      }
      value = measure(context, pieces, size);
      measured.set(key, value);
    }
    return value;
  };
  interface Breaks {
    cost: number;
    cuts: number[];
  }
  const memo = new Map<string, Breaks | null>();
  const solve = (start: number, lines: number): Breaks | null => {
    if (!lines) return start === tokens.length ? { cost: 0, cuts: [] } : null;
    const key = `${start}:${lines}`;
    if (memo.has(key)) return memo.get(key)!;
    let best: Breaks | null = null;
    for (let end = start + 1; end <= tokens.length - lines + 1; end++) {
      const used = range(start, end).reduce((n, run) => n + run.width, 0);
      if (used > width) break;
      const rest = solve(end, lines - 1);
      if (!rest) continue;
      const cost = rest.cost + (width - used) ** 2;
      if (!best || cost < best.cost) best = { cost, cuts: [end, ...rest.cuts] };
    }
    memo.set(key, best);
    return best;
  };
  const solution = solve(0, greedy.length);
  if (!solution) return greedy; // Preserve explicit overflow for an oversized word.
  let start = 0;
  return solution.cuts.map((end) => {
    const line = range(start, end);
    start = end;
    return line;
  });
}

export function wrapRules(
  context: CanvasRenderingContext2D,
  runs: readonly RulesRun[],
  width: number,
  size: number,
  balanced = false,
): MeasuredRun[][] {
  const tokens = words(runs);
  // Balancing measures O(words²) ranges; bound preparation work for host-supplied
  // passages. The short historical policy has at most 100 source characters.
  if (!balanced || tokens.length > 64) return wrapWords(context, tokens, width, size);
  const lines: MeasuredRun[][] = [];
  let segment: Word[] = [];
  for (const token of tokens) {
    if (token.newline) {
      lines.push(...(segment.length ? balanceWords(context, segment, width, size) : [[]]));
      segment = [];
    } else segment.push(token);
  }
  if (segment.length) lines.push(...balanceWords(context, segment, width, size));
  return lines;
}
