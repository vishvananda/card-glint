import manifest from '../../assets.json' with { type: 'json' };
import type { CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import type { CanvasImages } from './canvas-assets.js';
import type { FaceRect, RenderedCardInput } from './face-layout.js';
import {
  colorIndicatorComposite,
  colorIndicatorLayout,
  resolveColorIndicator,
} from './color-indicator.js';

/** External full badges, including their printed dark ring and pale lower rim. */
export const COLOR_INDICATOR_ROOT = `${manifest.MSE_TEMPLATE_ROOT}/magic-modules.mse-include/indicators`;
export function colorIndicatorAssets(face: RenderedCardInput): string[] {
  const resolved = resolveColorIndicator(face);
  return resolved
    ? (resolved.colors.length ? resolved.colors : ['A']).map(
        (color) => `${COLOR_INDICATOR_ROOT}/${color.toLowerCase()}identity.png`,
      )
    : [];
}
/** Prepare-time painting only. Source discs share geometry, so sector clips retain the rim. */
export function paintTypeColorIndicator(
  c: CanvasContext,
  face: RenderedCardInput,
  images: CanvasImages,
  type: FaceRect,
  referenceWidth = 488,
): FaceRect {
  const layout = colorIndicatorLayout(face, type, referenceWidth);
  if (!layout) return type;
  const urls = colorIndicatorAssets(face),
    [x, y, size] = layout.indicator;
  c.save();
  try {
    c.shadowColor = 'transparent';
    c.shadowOffsetX = c.shadowOffsetY = c.shadowBlur = 0;
    const url = urls.length > 1 ? colorIndicatorComposite(layout.resolved.colors) : urls[0]!;
    const image = images.get(url);
    if (!image)
      throw Error(
        urls.length > 1
          ? 'Multicolor indicator was not prepared; call prepareColorIndicators first'
          : `Color indicator asset unavailable: ${url}`,
      );
    c.drawImage(image, x, y, size, size);
  } finally {
    c.restore();
  }
  return layout.text;
}

/** Internal fixed-size composition during cached preparation, never during animation. */
export function paintIndicatorSectors(
  c: CanvasContext,
  parts: readonly ImageBitmap[],
  rect: FaceRect,
): void {
  const [x, y, size] = rect;
  parts.forEach((image, index) => {
    c.save();
    try {
      if (index > 0) {
        const start =
          (parts.length === 2 ? Math.PI / 2 : -Math.PI / 2) + (index * 2 * Math.PI) / parts.length;
        c.beginPath();
        c.moveTo(x + size / 2, y + size / 2);
        c.arc(x + size / 2, y + size / 2, size, start, start + (2 * Math.PI) / parts.length);
        c.closePath();
        c.clip();
      }
      c.drawImage(image, x, y, size, size);
    } finally {
      c.restore();
    }
  });
}
