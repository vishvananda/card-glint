import { type CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import type { CanvasImages } from './canvas-assets.js';
import type { FaceRect, RenderedCardInput } from './face-layout.js';
import { resolveCardProfile, resolveFrameColors } from './profile.js';
import { faceFrame } from './special-frames.js';
import { isRetro } from './retro-frame.js';
import { CONJURER_ROOT } from './styled-set-symbols.js';
import { hasOvalSecurityStamp } from './security-stamp-policy.js';
import { SECURITY_STAMP_RECTS } from './security-stamp-geometry.js';

/** Native bounds from Card Conjurer's packM15HoloStamps.js and
 * packPlaneswalkerHoloStamps.js. These include the colored upper surround;
 * Split/Fuse uses its existing interior-only oval instead. */
export function mountedSecurityStamp(face: RenderedCardInput): {
  image: string;
  /** Prepared into the left source using the frame palette; never a second oval. */
  rightImage?: string;
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
  const colors = resolveFrameColors(face);
  // Match the visible pinlines, including RW, GW and GU across the wheel wrap.
  if (colors.length === 2 && 'WUBRG'.indexOf(colors[1]!) - 'WUBRG'.indexOf(colors[0]!) > 2)
    colors.reverse();
  const palette = colors.length > 2 ? ['M'] : colors.length ? colors : [material];
  const source = (color: string) =>
    planeswalker
      ? `${CONJURER_ROOT}/img/frames/planeswalker/holo/${color.toLowerCase()}.png`
      : `${CONJURER_ROOT}/img/frames/m15/holoStamps/m15HoloStamp${color}.png`;
  return {
    image: source(palette[0]!),
    ...(palette.length === 2 ? { rightImage: source(palette[1]!) } : {}),
    rect: planeswalker ? SECURITY_STAMP_RECTS.planeswalker : SECURITY_STAMP_RECTS.ordinary,
  };
}

export function paintMountedSecurityStamp(
  context: CanvasContext,
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
