import { rasterCanvas } from '../../../../packages/browser/src/canvas-raster.js';
import type { RenderedCardInput } from './face-layout.js';
import type { CanvasImages } from './canvas-assets.js';
import { retroDualBitmapCache } from './material-bitmap-cache.js';
import { calibratedFrameMaterials } from './printing-calibration-materials.js';
import { retroDualFrame, retroLandColors } from './retro-dual-frame.js';
import { colorAbuDualPinline, ABU_DUAL_BOX, ABU_DUAL_BAND_WIDTH } from './abu-dual-pinline.js';
import { isRevisedLand } from './revised-land-frame.js';
import { prepareRevisedLand } from './revised-land-material.js';

/** One cached static composite per source/palette. Mask RGB is visualization
 * only: destination-in uses alpha and preserves the original art aperture. */
export async function prepareRetroDualFrame(
  face: RenderedCardInput,
  images: CanvasImages,
  signal: AbortSignal,
): Promise<{ images: CanvasImages; dispose: () => void }> {
  if (isRevisedLand(face)) return prepareRevisedLand(face, images, signal);
  const plan = retroDualFrame(face);
  if (!plan) return { images, dispose() {} };
  const required = (url: string) => {
    const image = images.get(url);
    if (!image) throw Error(`Historical dual-land asset unavailable: ${url}`);
    return image;
  };
  const reflowPaper = ['lea', 'leb'].includes(face.setCode?.toLowerCase() ?? '');
  const base = required(plan.base),
    overlay = required(plan.overlay),
    mask = required(plan.mask);
  const [lease] = await retroDualBitmapCache.acquireMany(
    [
      {
        key: JSON.stringify([
          'abu-dual-frame-v4',
          ...(reflowPaper ? ['abu-dual-paper-up6-v1'] : []),
          ...(plan.pinline ? [plan.pinline] : []),
          plan,
          base.width,
          base.height,
          calibratedFrameMaterials(face),
        ]),
        bytes: base.width * base.height * 4,
        build: async () => {
          const canvas = rasterCanvas(),
            layer = rasterCanvas();
          canvas.width = layer.width = base.width;
          canvas.height = layer.height = base.height;
          try {
            const c = canvas.getContext('2d'),
              l = layer.getContext('2d');
            if (!c || !l) throw Error('Historical dual-land preparation needs Canvas2D.');
            l.drawImage(overlay, 0, 0, base.width, base.height);
            l.globalCompositeOperation = 'destination-in';
            l.drawImage(mask, 0, 0, base.width, base.height);
            c.drawImage(base, 0, 0);
            c.drawImage(layer, 0, 0);
            // The broad dual mask also covers the full-frame colored outline,
            // whose ink does not always match the outer paper stripe. Restore
            // only that source strip from the independently selected plate.
            // Keep the interior art/paper bands and calibrated stock unchanged.
            if (plan.outline !== plan.overlay) {
              const outline = required(plan.outline);
              c.save();
              c.beginPath();
              // Selection edges stay in stock beyond the colored line. Snap
              // them to source pixels so browser/worker clip coverage agrees.
              const x = (v: number) => Math.round((v / 1500) * base.width);
              const y = (v: number) => Math.round((v / 2100) * base.height);
              c.rect(x(78), y(90), x(1422) - x(78), y(2010) - y(90));
              c.rect(x(108), y(120), x(1392) - x(108), y(1980) - y(120));
              c.clip('evenodd');
              c.drawImage(outline, 0, 0, base.width, base.height);
              c.restore();
            }
            const pixels = c.getImageData(0, 0, base.width, base.height);
            colorAbuDualPinline(pixels, retroLandColors(face), plan.pinline);
            if (reflowPaper) reflowAbuDualPaper(pixels, 6);
            c.putImageData(pixels, 0, 0);
            return await createImageBitmap(canvas);
          } finally {
            canvas.width = canvas.height = layer.width = layer.height = 0;
          }
        },
      },
    ],
    signal,
  );
  const derived = Object.assign(new Map(images), images);
  derived.set(plan.base, lease!.value);
  return { images: derived, dispose: () => lease!.release() };
}

/** One static material reflow. Fixed caps preserve border thickness; only the
 * striped interior changes height. The vacated band continues adjacent stock.
 * No typography, artwork or scan pose is transformed. */
function reflowAbuDualPaper(image: ImageData, bottomUp: number, pad = 2): void {
  if (bottomUp === 0) return;
  if (
    !Number.isFinite(bottomUp) ||
    bottomUp < 0 ||
    bottomUp > 12 ||
    !Number.isFinite(pad) ||
    pad < 1 ||
    pad > 4
  )
    throw Error('Invalid historical paper reflow');
  const { width, height, data } = image;
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width < 1 ||
    height < 1 ||
    data.length !== width * height * 4
  )
    throw Error('Invalid historical paper raster');
  const scaleX = width / 488,
    scaleY = height / 680;
  const box = {
    left: ABU_DUAL_BOX.left * (488 / 1500) - pad,
    right: ABU_DUAL_BOX.right * (488 / 1500) + pad,
    top: ABU_DUAL_BOX.top * (680 / 2100) - pad,
    bottom: ABU_DUAL_BOX.bottom * (680 / 2100) + pad,
  };
  const cap = ABU_DUAL_BAND_WIDTH + pad + 0.5,
    newBottom = box.bottom - bottomUp;
  const oldMiddle = box.bottom - box.top - 2 * cap,
    newMiddle = oldMiddle - bottomUp;
  const original = data.slice();
  const ease = (v: number) => {
    const t = Math.max(0, Math.min(1, v));
    return t * t * (3 - 2 * t);
  };
  for (
    let y = Math.max(0, Math.floor(box.top * scaleY));
    y < Math.min(height, Math.ceil(box.bottom * scaleY));
    y++
  ) {
    const cy = (y + 0.5) / scaleY;
    let sy = cy;
    if (cy >= newBottom) sy = cy + bottomUp;
    else if (cy >= newBottom - cap) sy = cy + bottomUp;
    else if (cy > box.top + cap)
      sy = box.top + cap + ((cy - box.top - cap) * oldMiddle) / newMiddle;
    const source = Math.max(0, Math.min(height - 1, sy * scaleY - 0.5)),
      lo = Math.floor(source),
      hi = Math.min(height - 1, lo + 1),
      fy = source - lo;
    for (
      let x = Math.max(0, Math.floor(box.left * scaleX));
      x < Math.min(width, Math.ceil(box.right * scaleX));
      x++
    ) {
      const cx = (x + 0.5) / scaleX;
      const weight =
        ease((cx - box.left) / pad) * ease((box.right - cx) / pad) * ease((box.bottom - cy) / pad);
      if (!weight) continue;
      const i = (y * width + x) * 4,
        a = (lo * width + x) * 4,
        b = (hi * width + x) * 4;
      for (let k = 0; k < 3; k++) {
        const sample = original[a + k]! * (1 - fy) + original[b + k]! * fy;
        data[i + k] = original[i + k]! * (1 - weight) + sample * weight;
      }
      // Retain exact coverage; paper stock is not a silhouette operation.
    }
  }
}
