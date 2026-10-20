import { type CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import { FACE_HEIGHT, FACE_WIDTH, type FaceRect } from './face-layout.js';

/** The pinned gray plates have ~70% alpha. A partial second pass increases
 * coverage to ~85% while retaining their texture and transparent outer edges. */
export const COLORLESS_PLATE_REPAINT = 0.7;

/** Reuse the plate's texture without its baked down-right shadow. The left end
 * flares slightly below the upper curve instead of forming a symmetric pill. */
export function paintPlaneswalkerType(
  context: CanvasContext,
  image: ImageBitmap,
  rect: FaceRect,
  colorless = false,
  prepared?: { image: ImageBitmap; rect: FaceRect },
) {
  if (prepared) {
    const [x, y, w, h] = prepared.rect;
    context.drawImage(
      prepared.image,
      x * FACE_WIDTH,
      y * FACE_HEIGHT,
      w * FACE_WIDTH,
      h * FACE_HEIGHT,
    );
    return;
  }
  const [x, y, w, h] = [
    rect[0] * FACE_WIDTH,
    rect[1] * FACE_HEIGHT,
    rect[2] * FACE_WIDTH,
    rect[3] * FACE_HEIGHT - 1,
  ];
  // Raise the plate's bottom edge 1px; preserve text and the shadow's lower extent.
  const outline = new Path2D();
  outline.moveTo(x + 14, y);
  outline.lineTo(x + w - 14, y);
  outline.quadraticCurveTo(x + w, y, x + w, y + 14);
  outline.lineTo(x + w, y + h - 7);
  outline.quadraticCurveTo(x + w, y + h, x + w - 7, y + h);
  outline.lineTo(x + 9, y + h);
  outline.quadraticCurveTo(x - 2, y + h, x - 2, y + h - 9);
  outline.quadraticCurveTo(x - 2, y + 17, x + 2, y + 9);
  outline.quadraticCurveTo(x + 5, y, x + 14, y);
  outline.closePath();
  context.save();
  const scale = context.getTransform().a;
  context.shadowColor = '#0009';
  context.shadowBlur = 1.4 * scale;
  context.shadowOffsetX = -1.2 * scale;
  context.shadowOffsetY = 3.5 * scale;
  context.fillStyle = '#191816';
  context.fill(outline);
  context.shadowColor = 'transparent';
  context.save();
  context.clip(outline);
  // The paired title/type bitmap is aligned by its bottom edge. Crop within
  // the bottom strip, beyond its curved ends and baked border pixels.
  const sourceScale = image.width / w;
  const textureRect = [
    20 * sourceScale,
    image.height - (h - 4) * sourceScale,
    image.width - 40 * sourceScale,
    (h - 12) * sourceScale,
    x - 2,
    y,
    w + 2,
    h,
  ] as const;
  context.drawImage(image, ...textureRect);
  if (colorless) {
    context.globalAlpha *= COLORLESS_PLATE_REPAINT;
    context.drawImage(image, ...textureRect);
  }
  context.restore();
  context.strokeStyle = '#191816';
  context.lineWidth = 1.2;
  context.stroke(outline);
  context.restore();
}
