import type { FaceRects } from './special-frames.js';
import { FACE_RECTS, type FaceRect, type RenderedCardInput } from './face-layout.js';
import { resolveCardProfile, resolveFrameColors } from './profile.js';
import { CONJURER_ROOT } from './styled-set-symbols.js';
import { isRetro } from './retro-frame.js';

export interface FramePlate {
  frame: string;
  rightFrame?: string;
  border: string;
  pt: string;
  rects: FaceRects;
  titleSize: number;
  typeSize: number;
  symbol: { right: number; center: number; width: number; height: number };
}

/** Source-native geometry from pack8th.js and packM15RegularNew.js at the
 * pinned revision. No scan offsets or HSB fitted to other assets are reused. */
export function framePlate(face: RenderedCardInput): FramePlate | null {
  if (!face.frameAssetFamily) return null;
  if (
    isRetro(face) ||
    (face.layout && !['normal', 'token'].includes(face.layout)) ||
    /\b(Saga|Class|Planeswalker|Battle)\b/.test(face.typeLine ?? '') ||
    /^Level up\b/m.test(face.rulesText ?? '')
  )
    throw Error('Replacement frame plates currently support ordinary modern faces only.');
  const eighth = face.frameAssetFamily === 'eighth';
  const profile = resolveCardProfile(face),
    colors = resolveFrameColors(face);
  const folder = eighth ? '8th' : 'm15/new';
  const root = `${CONJURER_ROOT}/img/frames/${folder}`;
  const material = profile.land
    ? 'l'
    : profile.artifact
      ? 'a'
      : /\bVehicle\b/.test(face.typeLine ?? '')
        ? 'v'
        : colors.length > 1
          ? 'm'
          : (colors[0]?.toLowerCase() ?? 'c');
  const land = (color: string) => (eighth ? `${color.toLowerCase()}l` : `l${color.toLowerCase()}`);
  const left =
    profile.land && colors.length ? land(colors.length > 2 ? 'm' : colors[0]!) : material;
  const right = profile.land && colors.length === 2 ? land(colors[1]!) : undefined;
  // Base multicolor plates retain gold material. Color-pair pinlines and modern
  // legend crowns need their own masks; these options are base plate candidates.
  const ptKey = material === 'l' ? (eighth ? 'l' : 'c') : material;
  const title: FaceRect = eighth
    ? [0.09, 0.0629, 0.824, 0.0429]
    : [168 / 2010, 145 / 2814, 0.8292, 0.0543];
  const type: FaceRect = eighth
    ? [205 / 2010, 1611 / 2814, 1601 / 2010, 0.0358]
    : [168 / 2010, 1588 / 2814, 0.8292, 0.0543];
  return {
    frame: `${root}/${left}.png`,
    rightFrame: right ? `${root}/${right}.png` : undefined,
    border: `${root}/border.png`,
    pt: eighth
      ? `${CONJURER_ROOT}/img/frames/8th/pt/${ptKey === 'c' ? 'l' : ptKey}.png`
      : `${CONJURER_ROOT}/img/frames/m15/regular/m15PT${ptKey.toUpperCase()}.png`,
    rects: {
      ...FACE_RECTS,
      frame: [0, 0, 1, 1],
      background: [0, 0, 1, 1],
      title,
      type,
      art: eighth
        ? [180 / 2010, 341 / 2814, 1656 / 2010, 1216 / 2814]
        : [0.0767, 0.1129, 0.8476, 0.4429],
      rules: eighth
        ? [205 / 2010, 1779 / 2814, 1596 / 2010, 729 / 2814]
        : [0.086, 1780 / 2814, 0.828, 0.2875],
      stats: eighth
        ? [1461 / 2010, 2481 / 2814, 414 / 2010, 218 / 2814]
        : [0.7573, 0.8848, 0.188, 0.0733],
      footer: eighth ? [150 / 2010, 1938 / 2100, 0.81, 0.04] : FACE_RECTS.footer,
    },
    titleSize: eighth ? 29.2 : 26,
    typeSize: eighth ? 24.3 : 22,
    symbol: eighth
      ? { right: 0.9079, center: 0.5886, width: 0.12, height: 0.0391 }
      : { right: 1862 / 2010, center: 0.591, width: 0.12, height: 0.041 },
  };
}

export function framePlateUrls(face: RenderedCardInput): string[] | null {
  const plate = framePlate(face);
  if (!plate) return null;
  return [
    plate.frame,
    ...(plate.rightFrame ? [plate.rightFrame] : []),
    ...(face.power != null && face.toughness != null ? [plate.pt] : []),
    ...(face.borderColor === 'white' ||
    face.borderColor === 'silver' ||
    (!face.borderColor && ['8ed', '9ed'].includes(face.setCode?.toLowerCase() ?? ''))
      ? [plate.border]
      : []),
  ];
}
