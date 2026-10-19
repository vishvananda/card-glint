import { type CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
const hidden = new WeakSet<CanvasContext>();

export function rulesInkVisible(context: CanvasContext): boolean {
  return !hidden.has(context);
}

export function withRulesInk(context: CanvasContext, visible: boolean, paint: () => void): void {
  const wasHidden = hidden.has(context);
  if (!visible) hidden.add(context);
  try {
    paint();
  } finally {
    if (!wasHidden) hidden.delete(context);
  }
}
