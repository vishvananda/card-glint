import manifest from '../../assets.json' with { type: 'json' };
import type { RenderedCardInput, FaceRect } from './face-layout.js';
import { FACE_RECTS } from './face-layout.js';
import { resolveFrameColors } from './profile.js';

export const MSE_TEMPLATE_ROOT = manifest.MSE_TEMPLATE_ROOT;
export type StandardTemplate = NonNullable<RenderedCardInput['frameTemplate']>;
/** Native coordinates from the pinned MSE styles; these are rendering defaults,
 * not scan-normalization targets or measured printing calibrations. */
export const STANDARD_TEMPLATE_DEFAULTS = {
  future: {
    size: [375, 523],
    style: 'magic-future.mse-style',
    title: [73, 30, 269, 26],
    art: [32, 44, 327, 310],
    type: [49, 300, 279, 20],
    rules: [42, 332, 291, 134],
    stats: [287, 469, 60, 28],
    footer: [30, 475, 245, 27],
    symbol: [331, 302, 22, 22],
    titleSize: 18,
    typeSize: 14,
    rulesSize: 13,
    minimumSize: 6,
  },
  flip: {
    size: [375, 523],
    style: 'magic-new-flip.mse-style',
    title: [32, 30, 311, 23],
    art: [32, 162, 311, 182],
    type: [33, 134, 310, 18],
    rules: [37, 59, 302, 67],
    stats: [290, 130, 60, 28],
    footer: [58, 479, 217, 26],
    symbol: [309, 482, 44, 22],
    titleSize: 17,
    typeSize: 14,
    rulesSize: 14,
    minimumSize: 8,
  },
  battle: {
    size: [523, 375],
    style: 'magic-m15-mainframe-battles.mse-style',
    title: [67, 21, 410, 22],
    art: [41, 15, 467, 345],
    type: [67, 219, 366, 22],
    rules: [69, 254, 400, 96],
    stats: [480, 336, 22, 24],
    footer: [20, 350, 420, 20],
    symbol: [441, 220, 44, 22],
    titleSize: 16,
    typeSize: 13,
    rulesSize: 14,
    minimumSize: 6,
  },
} as const;

export function templateMaterial(face: RenderedCardInput): string {
  const colors = resolveFrameColors(face);
  if (/\bLand\b/.test(face.typeLine ?? '') || face.land)
    return (colors.length > 1 ? 'm' : (colors[0]?.toLowerCase() ?? 'c')) + 'l';
  if (/\bArtifact\b/.test(face.typeLine ?? '') || face.artifact) return 'a';
  return colors.length > 1 ? 'm' : (colors[0]?.toLowerCase() ?? 'c');
}
export function standardTemplateParts(face: RenderedCardInput) {
  if (!face.frameTemplate) return null;
  const kind = face.frameTemplate,
    spec = STANDARD_TEMPLATE_DEFAULTS[kind];
  if (!spec) throw Error('Unknown standard frame template');
  if (face.frameAssetFamily) throw Error('Choose one frame template or plate family');
  const root = `${MSE_TEMPLATE_ROOT}/${spec.style}`;
  const material = templateMaterial(kind === 'flip' ? (face.faces?.[0] ?? face) : face);
  if (kind === 'battle')
    return {
      kind,
      base: `${root}/cards/${material.replace(/l$/, '')}card.png`,
      defense: `${MSE_TEMPLATE_ROOT}/magic-modules.mse-include/loyalty/defense.png`,
      texture: `${root}/cards/texture/${material.replace(/l$/, '')}card.png`,
      border: `${root}/border.png`,
    } as const;
  const base = `${root}/${material}card.jpg`;
  if (kind === 'flip') {
    const back = face.faces?.[1] ?? face,
      front = face.faces?.[0] ?? face;
    const reverseMaterial = templateMaterial(back);
    return {
      kind,
      base,
      reverse: `${root}/${reverseMaterial}card.jpg`,
      ...(front.power != null && front.toughness != null
        ? { stats: `${root}/${material}pt.jpg`, statsMask: `${root}/mask_pt.png` }
        : {}),
      ...(back.power != null && back.toughness != null
        ? {
            reverseStats: `${root}/${reverseMaterial}pt2.jpg`,
            reverseStatsMask: `${root}/mask_pt2.png`,
          }
        : {}),
    } as const;
  }
  const types = [
    'Artifact',
    'Creature',
    'Enchantment',
    'Instant',
    'Land',
    'Planeswalker',
    'Sorcery',
  ].filter((type) => new RegExp(`\\b${type}\\b`).test(face.typeLine ?? ''));
  const type = types.length > 1 ? 'multitype' : types[0]?.toLowerCase();
  const ink = ['u', 'b', 'r', 'g'].includes(material[0]!) ? 'white' : 'black';
  return {
    kind,
    base,
    mask: `${root}/mask_image.png`,
    paper: `${root}/${material}textbox.png`,
    type: `${root}/${material}typeline.png`,
    ...(type
      ? { typeSymbol: `${MSE_TEMPLATE_ROOT}/magic-future-common.mse-include/${type}_${ink}.png` }
      : {}),
    ...(face.power != null && face.toughness != null ? { stats: `${root}/${material}pt.png` } : {}),
  } as const;
}
export function standardTemplateAssets(face: RenderedCardInput): string[] {
  const parts = standardTemplateParts(face);
  if (!parts) return [];
  const { kind: _kind, ...urls } = parts;
  return Object.values(urls).filter((value): value is string => typeof value === 'string');
}
export function standardTemplateRects(face: RenderedCardInput) {
  if (!face.frameTemplate) return null;
  const spec = STANDARD_TEMPLATE_DEFAULTS[face.frameTemplate];
  if (!spec) throw Error('Unknown standard frame template');
  const normalized = (rect: FaceRect): FaceRect => {
    const [x, y, w, h] = rect,
      [width, height] = spec.size;
    return face.frameTemplate === 'battle'
      ? [y / height, 1 - (x + w) / width, h / height, w / width]
      : [x / width, y / height, w / width, h / height];
  };
  return {
    ...FACE_RECTS,
    frame: [0, 0, 1, 1] as FaceRect,
    title: normalized(spec.title),
    art: normalized(spec.art),
    type: normalized(spec.type),
    rules: normalized(spec.rules),
    stats: normalized(spec.stats),
    footer: normalized(spec.footer),
  };
}
