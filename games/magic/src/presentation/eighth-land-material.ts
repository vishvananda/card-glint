import type { RenderedCardInput } from './face-layout.js';
import type { CanvasImages } from './canvas-assets.js';
import { rasterCanvas } from '../../../../packages/browser/src/canvas-raster.js';
import { eighthPrintingProfile } from './eighth-printing-profile.js';
import { framePlate } from './frame-plates.js';
import { basicLandColor, plateBasicSymbol } from './plate-basic-land.js';
import { materialBitmapIdentity } from './material-bitmap-cache.js';
import {
  colorEighthBasicFrame,
  colorEighthBasicGlyph,
  EIGHTH_BASIC_MASK,
} from './eighth-basic-pixels.js';
import { EIGHTH_BASIC_OUTER } from './eighth-basic-profile.js';

export function eighthLandPalettes(face: RenderedCardInput) {
  if (
    face.colorCalibration !== 'set-hsb-v1' ||
    face.calibration === 'source' ||
    !/\bLand\b/.test(face.canonicalTypeLine ?? face.typeLine ?? '')
  )
    return [];
  const p = eighthPrintingProfile(face),
    plate = p && framePlate(face);
  if (!p || !plate) return [];
  return [plate.frame, ...(plate.rightFrame ? [plate.rightFrame] : [])].flatMap((url) => {
    const name = url.startsWith(p.root + '/') ? url.slice(p.root.length + 1) : '';
    const match = /^(?:([wubrgm])l|([l]))[.]png$/.exec(name);
    const color = match && (match[1] ?? match[2]!).toUpperCase();
    // Two-color printings use the same assets with a different paper/header ink.
    const palette =
      color && ((plate.rightFrame && p.landPalettes['dual-' + color]) || p.landPalettes[color]);
    return palette ? [{ url, palette }] : [];
  });
}
/** Shared land components keep the printing's paired order and gradient compositor.
 * Frame, pinline, panels and glyph all join the same bounded preparation batch. */
export function eighthLandMaterialJobs(face: RenderedCardInput, images: CanvasImages) {
  if (face.colorCalibration !== 'set-hsb-v1' || face.calibration === 'source') return [];
  const palettes = eighthLandPalettes(face);
  const color = basicLandColor(face),
    glyph = color && plateBasicSymbol(face);
  const specs = palettes.map((p) => ({ ...p, kind: 'frame' }));
  const palette = eighthPrintingProfile(face)?.landPalettes[color ?? ''];
  if (glyph && palette) specs.push({ url: glyph, palette, kind: 'glyph' });
  return specs.map(({ url, palette, kind }) => {
    const source = images.get(url);
    if (!source) throw Error('Eighth land material unavailable: ' + url);
    return {
      url,
      key: JSON.stringify([
        'eighth-land-material-v1',
        url,
        materialBitmapIdentity(source),
        kind,
        palette,
        ...(kind === 'frame' ? [EIGHTH_BASIC_OUTER, EIGHTH_BASIC_MASK] : []),
      ]),
      bytes: source.width * source.height * 4,
      build: async () => {
        const canvas = rasterCanvas();
        canvas.width = source.width;
        canvas.height = source.height;
        try {
          const c = canvas.getContext('2d', { willReadFrequently: true });
          if (!c) throw Error('Eighth land preparation needs Canvas2D');
          c.drawImage(source, 0, 0);
          const image = c.getImageData(0, 0, canvas.width, canvas.height);
          if (kind === 'frame') colorEighthBasicFrame(image, palette);
          else colorEighthBasicGlyph(image, palette.glyph);
          c.putImageData(image, 0, 0);
          return await createImageBitmap(canvas);
        } finally {
          canvas.width = canvas.height = 0;
        }
      },
    };
  });
}
