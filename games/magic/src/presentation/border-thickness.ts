import { cardStock, FACE_HEIGHT, FACE_WIDTH, type RenderedCardInput } from './face-layout.js';
import { calibratedPrintingStock } from './printing-calibration-materials.js';

export function validateBorderThickness(face: RenderedCardInput): void {
  const thickness = face.borderThickness;
  if (thickness !== undefined && (!Number.isFinite(thickness) || thickness < 0 || thickness > 0.2))
    throw Error('Invalid borderThickness: expected a finite number in [0, 0.2] card widths.');
  for (const child of face.faces ?? []) validateBorderThickness(child);
}

/** Cover native printing inward from the physical card edges, never child-panel edges.
 * This cannot remove baked-in borders or reveal pixels hidden by the native frame. */
export function paintBorderThickness(
  context: CanvasRenderingContext2D,
  face: RenderedCardInput,
): void {
  if (!face.borderThickness) return;
  const inset = face.borderThickness * FACE_WIDTH;
  context.save();
  try {
    context.setTransform(
      context.canvas.width / FACE_WIDTH,
      0,
      0,
      context.canvas.height / FACE_HEIGHT,
      0,
      0,
    );
    context.globalCompositeOperation = 'source-over';
    context.globalAlpha = 1;
    context.shadowColor = 'transparent';
    context.filter = 'none';
    context.fillStyle =
      calibratedPrintingStock(face) ?? cardStock(face.setCode, face.borderColor).border;
    context.beginPath();
    context.rect(0, 0, FACE_WIDTH, FACE_HEIGHT);
    context.rect(inset, inset, FACE_WIDTH - 2 * inset, FACE_HEIGHT - 2 * inset);
    context.fill('evenodd');
    if (face.blackBorderLift && (face.borderColor ?? 'black') === 'black') {
      const ink = Math.round(face.blackBorderLift * 255);
      context.globalCompositeOperation = 'lighten';
      context.fillStyle = `rgb(${ink},${ink},${ink})`;
      context.fill('evenodd');
    }
  } finally {
    context.restore();
  }
}
