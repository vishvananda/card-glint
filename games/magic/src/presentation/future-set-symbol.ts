import manifest from '../../assets.json' with { type: 'json' };
import type { FaceRect, RenderedCardInput } from './face-layout.js';
import { faceSetSymbol } from './assets.js';
import { futureParts, futureTreatment } from './future-frame.js';

/** Measured after independent frame normalization. Each physical source family
 * shares one placement; width and height are fitted independently. Custom and
 * unreviewed symbols keep the template's ordinary aspect-preserving bounds. */
export function futureSetSymbolRect(face: RenderedCardInput): FaceRect | undefined {
  const treatment = futureTreatment(face);
  if (face.setCode?.toLowerCase() !== 'fut' || treatment === 'clear') return undefined;
  const url = faceSetSymbol(face),
    root = manifest.CONJURER_ROOT + '/img/setSymbols/official/fut-';
  if (!['c', 'u', 'r'].some((rarity) => url === root + rarity + '.svg')) return undefined;
  const [x, y, w, h] =
    treatment === 'full-art'
      ? [443.5625, 581.8125, 28.1875, 20.976866533333336]
      : futureParts(face).base.includes('/future/regular/futureFrame')
        ? [443.5, 405.125, 29, 21.851866533333336]
        : [443.5, 405.5, 27.875, 22.226866533333336];
  return [x! - w! / 2, y! - h! / 2, w!, h!];
}
