import type { RenderedCardInput } from './face-layout.js';

type OmissionCheck = (text: string, x: number, y: number) => boolean;
const active = new WeakMap<CanvasRenderingContext2D, OmissionCheck>();

/** Staged glyphs must honor the same physical-face omissions as direct text. */
export function isPrintingTextOmitted(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
): boolean {
  return active.get(context)?.(text, x, y) ?? false;
}

/** Affect only this canvas, synchronously, after assets/calibration are ready.
 * Region coordinates refer to the whole physical face, including rotated panels.
 * Never patch global Canvas methods or change rules used to choose the frame. */
export function withPrintingOmissions(
  context: CanvasRenderingContext2D,
  face: RenderedCardInput,
  paint: () => void,
) {
  const omissions = face.printingOmissions;
  if (!omissions?.length) return paint();
  const fill = context.fillText,
    stroke = context.strokeText;
  const omitted = (text: string, x: number, y: number) => {
    const point = context.getTransform().transformPoint({ x, y });
    const px = (point.x * 488) / context.canvas.width,
      py = (point.y * 680) / context.canvas.height;
    return omissions.some(({ rect, rotation = 0, texts }) => {
      if (!texts.includes(String(text))) return false;
      const angle = (rotation * Math.PI) / 180,
        dx = px - rect[0] * 488,
        dy = py - rect[1] * 680;
      const localX = dx * Math.cos(angle) + dy * Math.sin(angle),
        localY = -dx * Math.sin(angle) + dy * Math.cos(angle);
      return (
        localX >= -8 && localX <= rect[2] * 488 + 8 && localY >= -8 && localY <= rect[3] * 680 + 25
      );
    });
  };
  const prior = active.get(context);
  active.set(context, (text, x, y) => omitted(text, x, y) || (prior?.(text, x, y) ?? false));
  context.fillText = function (text, x, y, maxWidth) {
    if (!omitted(text, x, y))
      fill.call(this, text, x, y, ...(maxWidth === undefined ? [] : [maxWidth]));
  };
  context.strokeText = function (text, x, y, maxWidth) {
    if (!omitted(text, x, y))
      stroke.call(this, text, x, y, ...(maxWidth === undefined ? [] : [maxWidth]));
  };
  try {
    paint();
  } finally {
    if (prior) active.set(context, prior);
    else active.delete(context);
    context.fillText = fill;
    context.strokeText = stroke;
  }
}
