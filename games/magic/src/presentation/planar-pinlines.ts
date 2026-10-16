import type { CanvasImages } from './canvas-assets.js';
import type { FramePlate } from './frame-plates.js';
import { paintPlanarFrame } from './planar-frame-geometry.js';

/** Native colored rails from the pinned 8th pack. The source alpha mask keeps
 * the gold panels, illustration and text paper intact. All compositing happens
 * once during face preparation; decoded/material sources use existing caches. */
export function paintPlanarPinlines(
  c: CanvasRenderingContext2D,
  plate: FramePlate,
  images: CanvasImages,
): void {
  if (!plate.pinlines) return;
  const required = (url: string) => {
    const image = images.get(url);
    if (!image) throw Error(`Planar pinline asset unavailable: ${url}`);
    return image;
  };
  const create = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 732;
    canvas.height = 1020;
    const context = canvas.getContext('2d');
    if (!context) throw Error('Missing Planar pinline composition context');
    return { canvas, context };
  };
  const left = create(),
    right = create();
  try {
    left.context.drawImage(required(plate.pinlines.left), 0, 0, 732, 1020);
    right.context.drawImage(required(plate.pinlines.right), 0, 0, 732, 1020);
    right.context.globalCompositeOperation = 'destination-in';
    const blend = right.context.createLinearGradient(732 * 0.47, 0, 732 * 0.53, 0);
    blend.addColorStop(0, '#0000');
    blend.addColorStop(1, '#000');
    right.context.fillStyle = blend;
    right.context.fillRect(0, 0, 732, 1020);
    left.context.drawImage(right.canvas, 0, 0);
    left.context.globalCompositeOperation = 'destination-in';
    left.context.drawImage(required(plate.pinlines.mask), 0, 0, 732, 1020);
    paintPlanarFrame(c, left.canvas);
  } finally {
    left.canvas.width = left.canvas.height = 0;
    right.canvas.width = right.canvas.height = 0;
  }
}
