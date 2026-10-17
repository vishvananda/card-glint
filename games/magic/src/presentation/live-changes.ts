import type { LiveChanges } from './face-layout.js';

/** Measure in the painter's current font/transform; never change its advances. */
function lineGeometry(
  c: CanvasRenderingContext2D,
  text: string,
  x: number,
  width: number | undefined,
  measure = (value: string) => c.measureText(value).width,
) {
  const natural = measure(text);
  const scale = natural > 0 && width != null ? Math.min(1, width / natural) : 1;
  const drawn = natural * scale;
  const right =
    c.textAlign === 'right' ||
    (c.textAlign === 'end' && c.direction !== 'rtl') ||
    (c.textAlign === 'start' && c.direction === 'rtl');
  const left = x - (c.textAlign === 'center' ? drawn / 2 : right ? drawn : 0);
  return { left, scale, measure };
}

/** Accents leave the complete original type line and its kerning untouched. */
export function paintLiveType(
  c: CanvasRenderingContext2D,
  changes: LiveChanges | undefined,
  text: string,
  x: number,
  y: number,
  width?: number,
  paint = () => (width == null ? c.fillText(text, x, y) : c.fillText(text, x, y, width)),
) {
  const type = changes?.typeLine;
  if (!type) return;
  const { left, scale, measure } = lineGeometry(c, text, x, width);
  const added = new Set(type.added.map((word) => word.toLocaleLowerCase('en-US')));
  const spans = type.added.length
    ? [...text.matchAll(/[\p{L}\p{N}]+(?:[-'’][\p{L}\p{N}]+)*/gu)]
        .filter((match) => added.has(match[0].toLocaleLowerCase('en-US')))
        .map(
          (match) =>
            [
              left + measure(text.slice(0, match.index)) * scale - 1,
              left + measure(text.slice(0, match.index + match[0].length)) * scale + 1,
            ] as const,
        )
    : [[-10000, 10000] as const];
  const part = (from: number, to: number, color?: string) => {
    if (to <= from || (color && changes?.omitInk)) return;
    c.save();
    c.beginPath();
    c.rect(from, -10000, to - from, 20000);
    c.clip();
    if (color) {
      c.fillStyle = color;
      c.shadowColor = 'transparent';
    }
    paint();
    c.restore();
  };
  let previous = -10000;
  for (const [from, to] of spans) {
    part(previous, from);
    part(from, to, type.color);
    previous = to;
  }
  part(previous, 10000);
}

/** Repaint the same native line through disjoint ink clips. This preserves
 * shaping, squeezing, variable-stat symbols and calibrated painter callbacks. */
export function paintLiveStats(
  c: CanvasRenderingContext2D,
  changes: LiveChanges | undefined,
  text: string,
  x: number,
  width: number | undefined,
  paint: () => void,
  measure?: (value: string) => number,
) {
  if (!changes) {
    paint();
    return;
  }
  const slash = text.indexOf('/');
  const { left, scale, measure: advance } = lineGeometry(c, text, x, width, measure);
  if (slash < 0 || (!changes.power && !changes.toughness)) paint();
  else {
    const powerEnd = left + advance(text.slice(0, slash)) * scale;
    const toughnessStart = left + advance(text.slice(0, slash + 1)) * scale;
    for (const [from, to, color] of [
      [-10000, powerEnd, changes.power],
      [powerEnd, toughnessStart, undefined],
      [toughnessStart, 10000, changes.toughness],
    ] as const) {
      if (color && changes.omitInk) continue;
      c.save();
      c.beginPath();
      c.rect(from, -10000, to - from, 20000);
      c.clip();
      if (color) {
        c.fillStyle = color;
        c.shadowColor = 'transparent';
      }
      paint();
      c.restore();
    }
  }
}

export function paintLiveText(
  c: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  width: number | undefined,
  changes?: LiveChanges,
  role: 'type' | 'stats' = 'stats',
  paint = () => (width == null ? c.fillText(text, x, y) : c.fillText(text, x, y, width)),
) {
  if (!changes || (role === 'type' ? !changes.typeLine : !changes.power && !changes.toughness)) {
    paint();
    return;
  }
  if (role === 'stats') paintLiveStats(c, changes, text, x, width, paint);
  else paintLiveType(c, changes, text, x, y, width, paint);
}
