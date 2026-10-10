import type { CardDocument, Instance, Finish } from '@card-glint/browser';

export function sceneSize(width: number, count: number) {
  const columns = count === 3 ? (width < 600 ? 1 : 3) : 1;
  const height =
    count === 3
      ? Math.ceil((width / columns) * 1.46 * Math.ceil(3 / columns))
      : Math.round(width / 1.6);
  return { width, height };
}

function transform(x: number, y: number, w: number, h: number, z: number, angle: number) {
  const c = Math.cos(angle),
    s = Math.sin(angle);
  return [
    w * c,
    0,
    w * s,
    0,
    0,
    -h,
    0,
    0,
    -s,
    0,
    c,
    0,
    x + (w * (1 - c)) / 2,
    y,
    -z - (w * s) / 2,
    1,
  ];
}

/** Fit every recipe's native aspect into a cell in screen pixels, then convert to clip space. */
export function layoutCards(
  documents: readonly CardDocument[],
  width: number,
  height: number,
  count: number,
  finish: Finish,
  overlap: boolean,
  time = 0,
): Instance[] {
  const cols =
      count === 3 ? (width < 600 ? 1 : 3) : Math.ceil(Math.sqrt((count * width) / height / 0.718)),
    rows = Math.ceil(count / cols),
    cellWidth = width / cols,
    cellHeight = height / rows;
  return Array.from({ length: count }, (_, i) => {
    const d =
      documents[
        count === 3 ? i : Math.min(documents.length - 1, Math.floor(i / (count / documents.length)))
      ]!;
    const [nativeWidth, nativeHeight] = d.recipe.color.size;
    const scale = Math.min((cellWidth * 0.92) / nativeWidth, (cellHeight * 0.92) / nativeHeight);
    const pixelWidth = nativeWidth * scale,
      pixelHeight = nativeHeight * scale;
    const x = (i % cols) * cellWidth + (cellWidth - pixelWidth) / 2,
      y = Math.floor(i / cols) * cellHeight + (cellHeight - pixelHeight) / 2;
    const w = (2 * pixelWidth) / width,
      h = (2 * pixelHeight) / height;
    const stack = overlap && count === 3;
    return {
      id: i + 1,
      card: d.id,
      finish,
      transform: transform(
        stack ? -w / 2 + (i - 1) * w * 0.25 : (2 * x) / width - 1,
        stack ? h / 2 + (1 - i) * h * 0.1 : 1 - (2 * y) / height,
        w,
        h,
        stack ? i * 0.08 : 0,
        count === 3 ? 0.08 * Math.sin(time / 2500 + i) : 0,
      ),
      normal: [0.1 * Math.sin(time / 2500 + i), 0.06, 1],
    };
  });
}
