import { eighthArtistBrush } from './eighth-footer.js';
import type { FaceRects } from './special-frames.js';
import { FACE_RECTS, cardStock, type FaceRect, type RenderedCardInput } from './face-layout.js';
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
  mana: { right: number; center: number; size: number; gap: number };
  symbol: { right: number; center: number; width: number; height: number };
}

/** Source-native frame apertures from pack8th.js and packM15RegularNew.js,
 * with separately measured cost/symbol placement. No scan offsets or HSB
 * fitted to other assets are reused. */
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
  // Pair keys are WUBRG-sorted, but visible halves follow the short arc around
  // the color wheel: RW, GW and GU wrap across its end. Match printed lands
  // without changing the semantic colors or source asset naming convention.
  const landColors =
    colors.length === 2 && 'WUBRG'.indexOf(colors[1]!) - 'WUBRG'.indexOf(colors[0]!) > 2
      ? [...colors].reverse()
      : colors;
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
    profile.land && landColors.length
      ? land(landColors.length > 2 ? 'm' : landColors[0]!)
      : material;
  const right = profile.land && landColors.length === 2 ? land(landColors[1]!) : undefined;
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
    // Shared family adjustments measured after frame-only scan normalization.
    // Cost discs have their own baseline; they do not follow font centering.
    mana: {
      right: (eighth ? 0.9147 : 1864 / 2010) - (eighth ? 2 : 1) / 488,
      center: title[1] + title[3] / 2 + (eighth ? 1 : -4) / 680,
      size: eighth ? 22 : 23.4,
      gap: 1.5,
    },
    symbol: eighth
      ? { right: 0.9079 - 2 / 488, center: 0.5886, width: 0.114, height: 0.0391 * 0.95 }
      : { right: 1862 / 2010 - 2 / 488, center: 0.591, width: 0.114, height: 0.041 * 0.95 },
  };
}

export function framePlateUrls(face: RenderedCardInput): string[] | null {
  const plate = framePlate(face);
  if (!plate) return null;
  const brush = eighthArtistBrush(face);
  return [
    ...(brush ? [brush] : []),
    plate.frame,
    ...(plate.rightFrame ? [plate.rightFrame] : []),
    ...(face.power != null && face.toughness != null ? [plate.pt] : []),
    ...(cardStock(face.setCode, face.borderColor).border !== '#090806' ? [plate.border] : []),
  ];
}
