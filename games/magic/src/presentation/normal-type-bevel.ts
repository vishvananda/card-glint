import type { BoxAssetKey } from './profile.js';

/** Extend the existing upper ink inward. Its first pass retains the outer
 * silhouette; the repeated cap follows the sprite's rounded ends 1px lower. */
export function paintNormalTypeCap(
  context: CanvasRenderingContext2D,
  image: ImageBitmap,
  [x, y, width, height]: readonly [number, number, number, number],
): void {
  const scaledHeight = (image.height * width) / image.width;
  context.save();
  context.beginPath();
  context.rect(x, y, width, height / 2);
  context.clip();
  context.drawImage(image, x, y + height - scaledHeight + 1, width, scaledHeight);
  context.restore();
}

/** The retained normal-frame sprites have a dark lower inset. Lighten only its
 * narrow interior band during static preparation, retaining the outer contour.
 * Gold, land and colorless materials have not shown the same tone mismatch. */
export function paintNormalTypeBevel(
  context: CanvasRenderingContext2D,
  [x, y, width, height]: readonly [number, number, number, number],
  material: BoxAssetKey,
): void {
  if (!['W', 'U', 'B', 'R', 'G', 'Artifact'].includes(material)) return;
  context.save();
  context.shadowColor = 'transparent';
  const bevel = context.createLinearGradient(x, 0, x + width, 0);
  bevel.addColorStop(0, 'rgba(255,255,255,0)');
  bevel.addColorStop(0.025, 'rgba(255,255,255,0.2)');
  bevel.addColorStop(0.975, 'rgba(255,255,255,0.2)');
  bevel.addColorStop(1, 'rgba(255,255,255,0)');
  context.fillStyle = bevel;
  context.fillRect(x, y + height - 4, width, 2.3);
  context.restore();
}
