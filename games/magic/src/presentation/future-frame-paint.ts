import type { CanvasImages } from './canvas-assets.js';
import type { RenderedCardInput } from './face-layout.js';
import { futureGeometry, futureParts, futureTreatment } from './future-frame.js';
import { templateImageMask } from './template-image-mask.js';
import { calibrateFutureFrame } from './future-frame-geometry.js';

function canvas(width: number, height: number) {
  const result = document.createElement('canvas');
  result.width = width;
  result.height = height;
  return result;
}

/** Premultiplied cross-fade also preserves the source paper's 80% opacity.
 * These canvases are built during static face preparation, never animation. */
function blend(left: ImageBitmap, right: ImageBitmap): HTMLCanvasElement {
  const result = canvas(left.width, left.height),
    c = result.getContext('2d')!;
  const part = canvas(left.width, left.height),
    p = part.getContext('2d')!;
  for (const [index, image] of [left, right].entries()) {
    p.clearRect(0, 0, part.width, part.height);
    p.globalCompositeOperation = 'source-over';
    p.drawImage(image, 0, 0, part.width, part.height);
    const fade = p.createLinearGradient(part.width * 0.4, 0, part.width * 0.6, 0);
    fade.addColorStop(0, index ? '#0000' : '#000');
    fade.addColorStop(1, index ? '#000' : '#0000');
    p.globalCompositeOperation = 'destination-in';
    p.fillStyle = fade;
    p.fillRect(0, 0, part.width, part.height);
    c.globalCompositeOperation = 'lighter';
    c.drawImage(part, 0, 0);
  }
  part.width = part.height = 0;
  return result;
}

export function prepareFutureFrame(face: RenderedCardInput, images: CanvasImages) {
  const parts = futureParts(face),
    frame = canvas(976, 1360),
    c = frame.getContext('2d')!;
  const required = (url: string) => {
    const image = images.get(url);
    if (!image) throw Error(`Futureshifted frame asset unavailable: ${url}`);
    return image;
  };
  const composed = (left: string, right?: string, neutral?: string, mask?: string) => {
    if (!right) return required(left);
    const image = blend(required(left), required(right));
    if (neutral && mask) {
      const i = image.getContext('2d')!;
      i.globalCompositeOperation = 'destination-in';
      i.drawImage(templateImageMask(required(mask)), 0, 0, image.width, image.height);
      i.globalCompositeOperation = 'destination-over';
      i.drawImage(required(neutral), 0, 0, image.width, image.height);
    }
    return image;
  };
  const draw = (
    image: ImageBitmap | HTMLCanvasElement,
    x: number,
    y: number,
    w: number,
    h: number,
  ) => {
    c.drawImage(image, x, y, w, h);
    if (image instanceof HTMLCanvasElement) image.width = image.height = 0;
  };
  try {
    c.scale(976 / 375, 1360 / 523);
    draw(
      composed(parts.base, parts.reverseBase, parts.neutralBase, parts.baseBlend),
      0,
      0,
      375,
      523,
    );
    if (parts.mask) {
      c.save();
      c.globalCompositeOperation = 'destination-out';
      const full = futureTreatment(face) === 'full-art';
      // MSE's oversized image mask reaches behind its translucent paper. Only
      // remove backing inside the visible illustration rectangle; otherwise
      // that paper is composited over black stock instead of its source plate.
      if (!full && futureTreatment(face) !== 'clear') {
        const [, y, , h] = futureGeometry(face).art;
        c.beginPath();
        // Clip only the vertical extent here. This is source-plate space,
        // before registration; clipping to the final artwork's right edge
        // leaves a strip of MSE's white placeholder after the plate moves left.
        c.rect(0, (y * 523) / 680, 375, (h * 523) / 680);
        c.clip();
      }
      const [x, y, w, h] = full ? [37, 46, 322, 418] : [32, 44, 327, 310];
      c.drawImage(templateImageMask(required(parts.mask)), x!, y!, w!, h!);
      c.restore();
    }
    if (parts.paper) draw(composed(parts.paper, parts.reversePaper), 23, 320, 335, 152);
    if (parts.type)
      draw(
        composed(parts.type, parts.reverseType, parts.neutralType, parts.typeBlend),
        18,
        17,
        339,
        464,
      );
    if (parts.stats) {
      if (parts.statsMask) {
        const plate = canvas(156, 102),
          p = plate.getContext('2d')!;
        p.drawImage(required(parts.stats), 0, 0, 156, 102);
        p.globalCompositeOperation = 'destination-in';
        p.drawImage(templateImageMask(required(parts.statsMask)), 0, 0, 156, 102);
        draw(plate, 279, 454, 78, 51);
      } else if (parts.paper) c.drawImage(required(parts.stats), 285, 452, 70, 52);
      else
        c.drawImage(required(parts.stats), 375 * 0.7621, 523 * 0.8834, 375 * 0.1734, 523 * 0.0781);
    }
    return calibrateFutureFrame(frame, face);
  } finally {
    frame.width = frame.height = 0;
  }
}

/** CC's transparent window and the assembled MSE window are the exact aperture.
 * Only the illustration rectangle contributes: transparent corners are not art. */
export function futureArtMask(frame: HTMLCanvasElement, face: RenderedCardInput) {
  const mask = canvas(frame.width, frame.height),
    c = mask.getContext('2d')!;
  c.fillStyle = 'white';
  if (futureTreatment(face) === 'clear') {
    c.fillRect(23 * 2, 22 * 2, 442 * 2, 637 * 2);
  } else {
    c.fillRect(24 * 2, 80 * 2, 444 * 2, (futureTreatment(face) === 'full-art' ? 482 : 303) * 2);
    c.globalCompositeOperation = 'destination-out';
    c.drawImage(frame, 0, 0);
  }
  return mask;
}
