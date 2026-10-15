import type { CardDocument, Instance, Finish } from '@card-glint/browser';
import { tiltedQuad } from './motion.js';

function smallColumns(width: number, count: number) {
  return width < 600 ? 1 : count === 4 && width < 1000 ? 2 : count;
}
export function sceneSize(width: number, count: number) {
  const columns = count <= 4 ? smallColumns(width, count) : 1;
  const height =
    count <= 4
      ? Math.ceil((width / columns) * 1.46 * Math.ceil(count / columns))
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
  poses?: ReadonlyMap<number, { x: number; y: number }>,
): Instance[] {
  const cols =
      count <= 4
        ? smallColumns(width, count)
        : Math.ceil(Math.sqrt((count * width) / height / 0.718)),
    rows = Math.ceil(count / cols),
    cellWidth = width / cols,
    cellHeight = height / rows;
  return Array.from({ length: count }, (_, i) => {
    const d =
      documents[
        count <= 4 ? i : Math.min(documents.length - 1, Math.floor(i / (count / documents.length)))
      ]!;
    const [nativeWidth, nativeHeight] = d.recipe.color.size;
    const scale = Math.min((cellWidth * 0.92) / nativeWidth, (cellHeight * 0.92) / nativeHeight);
    const pixelWidth = nativeWidth * scale,
      pixelHeight = nativeHeight * scale;
    const x = (i % cols) * cellWidth + (cellWidth - pixelWidth) / 2,
      y = Math.floor(i / cols) * cellHeight + (cellHeight - pixelHeight) / 2;
    const w = (2 * pixelWidth) / width,
      h = (2 * pixelHeight) / height;
    const stack = overlap && count <= 4;
    const left = stack ? -w / 2 + (i - (count - 1) / 2) * w * 0.25 : (2 * x) / width - 1;
    const top = stack ? h / 2 + ((count - 1) / 2 - i) * h * 0.1 : 1 - (2 * y) / height;
    const depth = stack ? i * 0.08 : 0;
    const pose = count <= 4 ? poses?.get(i + 1) : undefined;
    return {
      id: i + 1,
      card: d.id,
      finish,
      transform: transform(
        left,
        top,
        w,
        h,
        depth,
        count <= 4 ? 0.08 * Math.sin(time / 2500 + i) : 0,
      ),
      normal: [0.1 * Math.sin(time / 2500 + i), 0.06, 1],
      ...(pose ? tiltedQuad(left, top, w, h, depth, width, height, pose) : {}),
    };
  });
}
