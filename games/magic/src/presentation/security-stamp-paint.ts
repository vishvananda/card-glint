import type { CanvasImages } from './canvas-assets.js';
import type { FaceRect, RenderedCardInput } from './face-layout.js';
import { resolveCardProfile } from './profile.js';
import { faceFrame } from './special-frames.js';
import { isRetro } from './retro-frame.js';
import { CONJURER_ROOT } from './styled-set-symbols.js';
import { hasOvalSecurityStamp } from './security-stamp-policy.js';

/** Native bounds from Card Conjurer's packM15HoloStamps.js and
 * packPlaneswalkerHoloStamps.js. These include the colored upper surround;
 * Split/Fuse uses its existing interior-only oval instead. */
export function mountedSecurityStamp(face: RenderedCardInput): {
  image: string;
  rect: FaceRect;
} | null {
  if (
    !hasOvalSecurityStamp(face) ||
    isRetro(face) ||
    face.frameAssetFamily === 'eighth' ||
    face.frameTemplate ||
    face.faces?.length ||
    (face.layout &&
      !['normal', 'planeswalker', 'transform', 'modal_dfc', 'meld'].includes(face.layout))
  )
    return null;
  const kind = faceFrame(face),
    planeswalker = kind.startsWith('planeswalker');
  if (kind !== 'normal' && !planeswalker) return null;
  const profile = resolveCardProfile(face),
    material =
      profile.boxes === 'Gold'
        ? 'M'
        : profile.boxes === 'Artifact'
          ? 'A'
          : profile.boxes === 'Land'
            ? 'L'
            : profile.boxes === 'Colourless'
              ? planeswalker
                ? 'A'
                : 'C'
              : profile.boxes;
  return {
    image: planeswalker
      ? `${CONJURER_ROOT}/img/frames/planeswalker/holo/${material.toLowerCase()}.png`
      : `${CONJURER_ROOT}/img/frames/m15/holoStamps/m15HoloStamp${material}.png`,
    rect: planeswalker
      ? [0.4394 * 488, 0.9015 * 680, 0.1214 * 488, 0.051 * 680]
      : [0.436 * 488, 0.9034 * 680, 0.128 * 488, 0.0458 * 680],
  };
}

export function paintMountedSecurityStamp(
  context: CanvasRenderingContext2D,
  face: RenderedCardInput,
  images: CanvasImages,
) {
  const stamp = mountedSecurityStamp(face);
  if (!stamp) return;
  const image = images.get(stamp.image);
  if (!image) throw Error('Authenticity stamp asset is unavailable.');
  context.save();
  context.shadowColor = 'transparent';
  context.drawImage(image, ...stamp.rect);
  context.restore();
}
