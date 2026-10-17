import type { CardTextInk } from './face-layout.js';

export function paintTextInk(
  c: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  width: number | undefined,
  ink?: CardTextInk,
  role: 'type' | 'stats' = 'stats',
  paint = () => (width == null ? c.fillText(text, x, y) : c.fillText(text, x, y, width)),
  measure = (value: string) => c.measureText(value).width,
) {
  const spans = role === 'type' ? ink?.typeLine : ink?.stats;
  if (!spans?.length) {
    paint();
    return;
  }
  const natural = measure(text);
  const scale = natural > 0 && width != null ? Math.min(1, width / natural) : 1;
  const drawn = natural * scale;
  const right =
    c.textAlign === 'right' ||
    (c.textAlign === 'end' && c.direction !== 'rtl') ||
    (c.textAlign === 'start' && c.direction === 'rtl');
  const left = x - (c.textAlign === 'center' ? drawn / 2 : right ? drawn : 0);
  const padding = role === 'type' ? 1 : 0;
  const part = (from: number, to: number, color?: string) => {
    if (to <= from || (color && ink?.omitInk)) return;
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
  for (const span of spans) {
    const from = Math.max(
      previous,
      span.start === 0 ? -10000 : left + measure(text.slice(0, span.start)) * scale - padding,
    );
    const to =
      span.end == null || span.end >= text.length
        ? 10000
        : left + measure(text.slice(0, span.end)) * scale + padding;
    part(previous, from);
    part(from, to, span.color);
    previous = to;
  }
  part(previous, 10000);
}
