import { symbolTextParts, type RulesParagraph, type RulesRun } from './face-layout.js';

export interface MeasuredRun {
  text: string;
  italic: boolean;
  symbol: boolean;
  width: number;
}
export interface RulesLine {
  runs: MeasuredRun[];
  width: number;
  baseline: number;
  role: RulesParagraph['role'];
}
export interface RulesLayout {
  size: number;
  x: number;
  top: number;
  width: number;
  height: number;
  overflow: boolean;
  lines: RulesLine[];
  separators: number[];
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
    return { ...piece, width: piece.symbol ? size * 0.88 : context.measureText(piece.text).width };
  });
}

function wrap(
  context: CanvasRenderingContext2D,
  runs: readonly RulesRun[],
  width: number,
  size: number,
) {
  const output: MeasuredRun[][] = [];
  let current: Piece[] = [];
  for (const word of words(runs)) {
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

/** Pure measured layout in reference pixels. Oversize words/blocks remain explicit errors. */
export function layoutRules(
  context: CanvasRenderingContext2D,
  paragraphs: readonly RulesParagraph[],
  bounds: { x: number; y: number; width: number; height: number },
  maximumSize = 24,
  minimumSize = 15,
): RulesLayout {
  context.save();
  context.letterSpacing = '0px';
  context.textBaseline = 'alphabetic';
  context.textAlign = 'left';
  try {
    let layout: RulesLayout;
    let size = maximumSize;
    do {
      context.font = rulesFont(size);
      const ink = context.measureText('Mg');
      const ascent = ink.actualBoundingBoxAscent,
        descent = ink.actualBoundingBoxDescent;
      const lines: RulesLine[] = [],
        separators: number[] = [];
      let top = 0,
        previous: RulesParagraph['role'] | undefined;
      for (const paragraph of paragraphs) {
        const rows = wrap(context, paragraph.runs, bounds.width, size);
        if (!rows.length) continue;
        if (previous) {
          if (previous === 'rules' && paragraph.role === 'flavor') {
            top += size * 0.28;
            separators.push(top);
            top += size * 0.4;
          } else if (previous !== 'flavor' || paragraph.role !== 'flavor') top += size * 0.25;
          else top += size * 0.04;
        }
        for (const [i, runs] of rows.entries()) {
          lines.push({
            runs,
            role: paragraph.role,
            baseline: top + ascent,
            width: runs.reduce((n, r) => n + r.width, 0),
          });
          top += i === rows.length - 1 ? ascent + descent : size * 1.04;
        }
        previous = paragraph.role;
      }
      const offset = Math.max(0, (bounds.height - top) / 2);
      layout = {
        size,
        x: bounds.x,
        top: bounds.y + offset,
        width: bounds.width,
        height: top,
        overflow:
          top > bounds.height + 0.01 || lines.some((line) => line.width > bounds.width + 0.01),
        lines: lines.map((line) => ({ ...line, baseline: line.baseline + bounds.y + offset })),
        separators: separators.map((y) => y + bounds.y + offset),
      };
      if (!layout.overflow || size <= minimumSize) break;
      size = Math.max(minimumSize, size - 0.25);
    } while (true);
    return layout;
  } finally {
    context.restore();
  }
}
