import { CONJURER_ROOT } from './styled-set-symbols.js';
import { resolveFrameColors } from './profile.js';
import { FACE_RECTS, type RenderedCardInput } from './face-layout.js';

/** A split printing can carry Aftermath without a separate provider layout code. */
export function isAftermath(face: RenderedCardInput): boolean {
  return (
    ['split', 'aftermath'].includes(face.layout ?? '') &&
    face.faces?.length === 2 &&
    (face.layout === 'aftermath' || /^Aftermath\b/m.test(face.faces[1]!.rulesText ?? ''))
  );
}

export const AFTERMATH_JOIN = 373;
export const AFTERMATH_BOTTOM_WIDTH = 257;
export const AFTERMATH_STAMP = `${CONJURER_ROOT}/img/frames/saga/stamp.png`;
export function aftermathFrameAsset(face: RenderedCardInput): string {
  const colors = resolveFrameColors(face);
  const key = colors.length > 1 ? 'm' : colors[0]?.toLowerCase();
  if (!key) throw Error('No validated colorless Aftermath plate is available.');
  return `${CONJURER_ROOT}/img/frames/m15/aftermath/${key}.png`;
}
export function aftermathAssets(face: RenderedCardInput): string[] {
  if (!isAftermath(face)) return [];
  return [
    ...face.faces!.map(aftermathFrameAsset),
    ...(['rare', 'mythic'].includes(face.rarity ?? '') ? [AFTERMATH_STAMP] : []),
  ];
}

// Canonical pixels in each panel's reading orientation. The lower panel turns
// clockwise about (488,373); all art/etching/foil geometry uses this same map.
export const AFTERMATH_TOP = {
  title: [41.7, 35.5, 405, 37],
  art: [37.4, 76.5, 413.2, 151.8],
  type: [41.7, 235.8, 405, 37],
  rules: [41.7, 281.5, 405, 76],
} as const;
export const AFTERMATH_BOTTOM = {
  title: [12, 37.5, 227, 37],
  art: [11, 80.7, 240.9, 137.9],
  type: [12, 235.2, 227, 37],
  rules: [14, 276.5, 232, 169],
} as const;
export function aftermathRects(bottom: boolean) {
  const rects = bottom ? AFTERMATH_BOTTOM : AFTERMATH_TOP;
  const width = bottom ? AFTERMATH_BOTTOM_WIDTH : 488,
    height = bottom ? 488 : AFTERMATH_JOIN;
  const rect = (key: keyof typeof rects) => {
    const [x, y, w, h] = rects[key];
    return [x / width, y / height, w / width, h / height] as const;
  };
  return {
    ...FACE_RECTS,
    title: rect('title'),
    art: rect('art'),
    type: rect('type'),
    rules: rect('rules'),
    footer: [0, 1, 0, 0] as const,
  };
}
