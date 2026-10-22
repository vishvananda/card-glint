import {
  rasterCanvas,
  type CanvasContext,
} from '../../../../packages/browser/src/canvas-raster.js';
import { modernLandPlates } from './modern-printing-profile.js';
import { calibrationFace } from './calibration-input.js';
import type { RenderedCardInput } from './face-layout.js';
import type { CanvasImages } from './canvas-assets.js';
import { colorFrame, type FrameHsb } from './frame-hsb.js';

interface LandLayer {
  key: string;
  source: string;
  masks: readonly string[];
  correction?: FrameHsb;
  kind: 'texture' | 'headers';
}
export function modernLandLayers(input: RenderedCardInput): readonly LandLayer[] {
  const face = calibrationFace(input),
    selection = modernLandPlates(face);
  if (!selection) return [];
  const { profile, dual } = selection;
  const calibrated = face.colorCalibration === 'set-hsb-v1';
  return [
    ...(calibrated
      ? [
          {
            key: 'card-glint:magic/land-texture',
            source: profile.root + '/l.png',
            masks: [profile.root + '/frame.png'],
            correction: profile.commonTexture,
            kind: 'texture' as const,
          },
        ]
      : []),
    ...(dual
      ? [
          {
            key: 'card-glint:magic/land-headers',
            source: profile.root + '/l.png',
            masks: [profile.root + '/title.png', profile.root + '/type.png'],
            correction: calibrated ? profile.neutralHeaders : undefined,
            kind: 'headers' as const,
          },
        ]
      : []),
  ];
}
export function modernLandLayerAssets(face: RenderedCardInput): string[] {
  return [...new Set(modernLandLayers(face).flatMap((l) => [l.source, ...l.masks]))];
}

/** Shared layers enter the existing bounded bitmap cache, not a per-card cache.
 * Immutable pinned source URLs and all corrections bind the cache key. */
export function modernLandMaterialJobs(face: RenderedCardInput, images: CanvasImages) {
  return modernLandLayers(face).map((layer) => {
    const required = (url: string) => {
      const image = images.get(url);
      if (!image) throw Error('Modern land layer asset unavailable: ' + url);
      return image;
    };
    const source = required(layer.source);
    const masks = layer.masks.map(required);
    return {
      url: layer.key,
      key: JSON.stringify(['modern-land-layer-v1', layer, source.width, source.height]),
      bytes: 732 * 1020 * 4,
      build: async () => {
        const overlay = rasterCanvas(),
          colored = rasterCanvas();
        overlay.width = 732;
        overlay.height = 1020;
        try {
          const m = overlay.getContext('2d', { willReadFrequently: true });
          if (!m) throw Error('Modern land layer needs Canvas2D');
          let pigment: CanvasImageSource = source;
          if (layer.kind === 'headers' && layer.correction) {
            colored.width = source.width;
            colored.height = source.height;
            const c = colored.getContext('2d', { willReadFrequently: true });
            if (!c) throw Error('Modern land header preparation needs Canvas2D');
            c.drawImage(source, 0, 0);
            const pixels = c.getImageData(0, 0, colored.width, colored.height);
            // The authored header selection excludes outer stock entirely.
            const { outerStock: _stock, outerStockMaskSource: _mask, ...tone } = layer.correction;
            colorFrame(pixels, tone);
            c.putImageData(pixels, 0, 0);
            pigment = colored;
          }
          for (const mask of masks) m.drawImage(mask, 0, 0, 732, 1020);
          m.globalCompositeOperation = 'source-in';
          m.drawImage(pigment, 0, 0, 732, 1020);
          if (layer.kind === 'texture' && layer.correction) {
            const pixels = m.getImageData(0, 0, 732, 1020);
            colorFrame(pixels, layer.correction);
            m.putImageData(pixels, 0, 0);
          }
          return await createImageBitmap(overlay);
        } finally {
          overlay.width = overlay.height = 0;
          colored.width = colored.height = 0;
        }
      },
    };
  });
}
/** Static face composition only. Warm faces do not read masks or rebuild layers. */
export function paintModernLandLayers(
  c: CanvasContext,
  face: RenderedCardInput,
  images: CanvasImages,
) {
  for (const layer of modernLandLayers(face)) {
    const image = images.get(layer.key);
    if (!image) throw Error('Modern land layer was not prepared: ' + layer.key);
    c.drawImage(image, 0, 0, 488, 680);
  }
}
