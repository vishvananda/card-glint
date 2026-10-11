import type { AbilityEmblem } from '../emblems.js';

const paths = new WeakMap<AbilityEmblem, Path2D>();

/** Paint the DOM emblem's exact outline into its existing 24-unit canvas slot. */
export function paintAbilityEmblem(context: CanvasRenderingContext2D, emblem: AbilityEmblem): void {
  let path = paths.get(emblem);
  if (!path) {
    path = new Path2D(emblem.path);
    paths.set(emblem, path);
  }
  context.save();
  if (emblem.viewBox) {
    const [x, y, width, height] = emblem.viewBox;
    context.scale(24 / width, 24 / height);
    context.translate(-x, -y);
  }
  if (emblem.transform) context.transform(...emblem.transform);
  if (emblem.filled) {
    context.fillStyle = context.strokeStyle;
    context.fill(path);
  } else context.stroke(path);
  context.restore();
}
