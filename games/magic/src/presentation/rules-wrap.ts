import { type CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
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
  /** Horizontal letter scale; inline symbol metrics remain unscaled. */
  textWidth?: number;
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
function measure(
  context: CanvasContext,
  pieces: Piece[],
  size: number,
  textWidth = 1,
): MeasuredRun[] {
  const merged: Piece[] = [];
  for (const input of pieces) {
    // Soft hyphens describe permitted printing breaks, not visible ink.
    const piece = input.symbol ? input : { ...input, text: input.text.replaceAll('\u00ad', '') };
    if (!piece.text) continue;
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
      ...(piece.symbol || textWidth === 1 ? {} : { textWidth }),
      size,
      width: piece.symbol ? size * 0.88 : metrics.width * textWidth,
      ascent: piece.symbol ? size * 0.72 : metrics.actualBoundingBoxAscent,
      descent: piece.symbol ? size * 0.08 : metrics.actualBoundingBoxDescent,
      inkLeft: piece.symbol ? size * 0.025 : -metrics.actualBoundingBoxLeft * textWidth,
      inkRight: piece.symbol ? size * 0.825 : metrics.actualBoundingBoxRight * textWidth,
    };
  });
}

/** Break at a supplied soft hyphen or after an inline em dash. Keep the printed
 * dash, preserve style runs, and choose the longest prefix whose ink fits.
 * A leading attribution dash stays attached to its following word. */
function discretionaryBreak(
  context: CanvasContext,
  prefix: Piece[],
  pieces: Piece[],
  width: number,
  size: number,
  textWidth = 1,
) {
  let best: { head: Piece[]; tail: Piece[] } | null = null;
  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i]!;
    if (piece.symbol) continue;
    for (let j = 0; j < piece.text.length; j++) {
      const dash = piece.text[j] === '—';
      if (piece.text[j] !== '\u00ad' && !dash) continue;
      if (
        ![...pieces.slice(0, i), { ...piece, text: piece.text.slice(0, j) }].some(
          (p) => p.text.replaceAll('\u00ad', '').length,
        )
      )
        continue;
      const head = [
        ...pieces.slice(0, i),
        { ...piece, text: piece.text.slice(0, j) + (dash ? '—' : '-') },
      ];
      const tail = [{ ...piece, text: piece.text.slice(j + 1) }, ...pieces.slice(i + 1)];
      if (!tail.some((p) => p.text.replaceAll('\u00ad', '').length)) continue;
      if (
        measure(context, [...prefix, ...head], size, textWidth).reduce((n, r) => n + r.width, 0) <=
        width
      )
        best = { head, tail };
    }
  }
  return best;
}

function wrapWords(
  context: CanvasContext,
  tokens: readonly Word[],
  width: number,
  size: number,
  textWidth = 1,
) {
  const output: MeasuredRun[][] = [];
  let current: Piece[] = [];
  for (const word of tokens) {
    if (word.newline) {
      output.push(measure(context, current, size, textWidth));
      current = [];
      continue;
    }
    let pieces = word.pieces;
    let gap: Piece[] =
      current.length && word.space
        ? [{ text: ' ', italic: word.pieces[0]?.italic ?? false, symbol: false }]
        : [];
    for (;;) {
      const trial = measure(context, [...current, ...gap, ...pieces], size, textWidth);
      if (trial.reduce((n, r) => n + r.width, 0) <= width) {
        current.push(...gap, ...pieces);
        break;
      }
      const split = discretionaryBreak(
        context,
        [...current, ...gap],
        pieces,
        width,
        size,
        textWidth,
      );
      if (split) {
        output.push(measure(context, [...current, ...gap, ...split.head], size, textWidth));
        current = [];
        gap = [];
        pieces = split.tail;
      } else if (current.length) {
        output.push(measure(context, current, size, textWidth));
        current = [];
        gap = [];
      } else {
        current.push(...pieces); // Preserve overflow for an unbreakable oversized word.
        break;
      }
    }
  }
  if (current.length) output.push(measure(context, current, size, textWidth));
  return output;
}

/** Keep the minimum feasible line count, then balance unused width on every line. */
function balanceWords(
  context: CanvasContext,
  tokens: readonly Word[],
  width: number,
  size: number,
  textWidth = 1,
): MeasuredRun[][] {
  const greedy = wrapWords(context, tokens, width, size, textWidth);
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
      value = measure(context, pieces, size, textWidth);
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
  context: CanvasContext,
  runs: readonly RulesRun[],
  width: number,
  size: number,
  balanced = false,
  textWidth = 1,
): MeasuredRun[][] {
  const tokens = words(runs);
  // Balancing measures O(words²) ranges; bound preparation work for host-supplied
  // passages. The short historical policy has at most 100 source characters.
  // Reviewed discretionary breaks retain greedy placement; balancing currently
  // optimizes only inter-word cuts and would otherwise discard those hints.
  if (!balanced || tokens.length > 64 || runs.some((r) => r.text.includes('\u00ad')))
    return wrapWords(context, tokens, width, size, textWidth);
  const lines: MeasuredRun[][] = [];
  let segment: Word[] = [];
  for (const token of tokens) {
    if (token.newline) {
      lines.push(
        ...(segment.length ? balanceWords(context, segment, width, size, textWidth) : [[]]),
      );
      segment = [];
    } else segment.push(token);
  }
  if (segment.length) lines.push(...balanceWords(context, segment, width, size, textWidth));
  return lines;
}
