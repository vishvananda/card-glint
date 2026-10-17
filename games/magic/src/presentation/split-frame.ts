import {
  MODERN_SPLIT_GEOMETRY,
  MODERN_SPLIT_WIDTH,
  modernSplitPlate,
} from './split-modern-frame.js';
import { FACE_RECTS, type FaceRect, type RenderedCardInput } from './face-layout.js';
import { isAftermath } from './aftermath-frame.js';
import { isRetro } from './retro-frame.js';
import { resolveFrameColors } from './profile.js';

export const MSE_SPLIT_ROOT =
  'https://cdn.jsdelivr.net/gh/MagicSetEditorPacks/Full-Magic-Pack@16f1d13bb7f5924613fc1ddc25da582beccfefb6/data';
export type SplitEra = 'old' | 'eighth' | 'm15';
const eighthSets = new Set('dis plc cmd pc2 dgm mma c13'.split(' '));
/** Only spell splits use these plates. Rooms and Aftermath retain separate adapters. */
export function nativeSplitEra(face: RenderedCardInput): SplitEra | null {
  if (face.layout !== 'split' || face.faces?.length !== 2 || isAftermath(face)) return null;
  if (
    face.faces.some(
      (half) => !/^(Instant|Sorcery)\b/.test(half.canonicalTypeLine ?? half.typeLine ?? ''),
    )
  )
    return null;
  if (
    isRetro({ ...face, layout: 'normal', frameStyle: face.frameStyle ?? face.faces[0]?.frameStyle })
  )
    return 'old';
  return face.frameAssetFamily === 'eighth' || eighthSets.has(face.setCode?.toLowerCase() ?? '')
    ? 'eighth'
    : 'm15';
}
export function hasFuse(face: RenderedCardInput): boolean {
  const texts = (f: RenderedCardInput) => [
    f.rulesText ?? '',
    ...(f.rulesParagraphs ?? []).map((p) => p.runs.map((r) => r.text).join('')),
  ];
  return [face, ...(face.faces ?? [])].some((f) => texts(f).some((t) => /^Fuse\b/m.test(t)));
}
export const SPLIT_PANEL_WIDTH = (251 * 680) / 523;
const sx = 680 / 523,
  sy = 488 / 375;
const pixels = (x: number, y: number, w: number, h: number): FaceRect => [
  x * sx,
  y * sy,
  w * sx,
  h * sy,
];
/** Bounds in the reading orientation of one panel; source plates are 236/244 × 338. */
export function splitGeometry(era: SplitEra, fuse: boolean) {
  if (era === 'm15')
    return fuse
      ? { ...MODERN_SPLIT_GEOMETRY, rules: [74, 301, 255, 128] as FaceRect }
      : MODERN_SPLIT_GEOMETRY;
  const old = era === 'old';
  return {
    frame: pixels(18, 18, fuse ? 244 : 236, 338),
    title: pixels(old ? 35 : 30, old ? 23 : 28, old ? 207 : 214, 21),
    art: old ? pixels(37, 47, 197, 130) : pixels(27, 56, 217, 152),
    type: pixels(old ? 35 : 30, old ? 182 : 211, 210, old ? 21 : 17),
    rules: old ? pixels(43, 207, 187, 109) : pixels(30, 233, 213, fuse ? 74 : 95),
    artistY: (old ? 332 : fuse ? 344 : 339) * sy,
    legalY: (old ? 347 : 354) * sy,
  };
}
export function splitHalfRects(face: RenderedCardInput) {
  const era: SplitEra = face.layout?.startsWith('split-old')
    ? 'old'
    : face.layout?.startsWith('split-m15')
      ? 'm15'
      : 'eighth';
  const panelWidth = era === 'm15' ? MODERN_SPLIT_WIDTH : SPLIT_PANEL_WIDTH;
  const geometry = splitGeometry(era, face.layout?.endsWith('-fuse') ?? false);
  const normalized = (rect: FaceRect): FaceRect => [
    rect[0] / panelWidth,
    rect[1] / 488,
    rect[2] / panelWidth,
    rect[3] / 488,
  ];
  return {
    ...FACE_RECTS,
    frame: normalized(geometry.frame),
    title: normalized(geometry.title),
    art: normalized(geometry.art),
    type: normalized(geometry.type),
    rules: normalized(geometry.rules),
    footer: [0, 1, 0, 0] as FaceRect,
  };
}
export function splitPlateAsset(
  face: RenderedCardInput,
  era: SplitEra,
  fuse: boolean,
  index: number,
) {
  if (era === 'm15') return modernSplitPlate(face);
  const colors = resolveFrameColors(face),
    key = colors.length > 1 ? 'm' : (colors[0]?.toLowerCase() ?? 'c');
  const folder =
    era === 'old' ? 'magic-old-split' : fuse ? 'magic-new-split-fuse' : 'magic-new-split';
  return `${MSE_SPLIT_ROOT}/${folder}.mse-style/${key}card${fuse ? index + 1 : ''}.${fuse ? 'png' : 'jpg'}`;
}

/** The reminder is shared, but its exact wording and run styles remain host-owned. */
export function splitFuseParagraphs(face: RenderedCardInput) {
  for (const half of [face, ...(face.faces ?? [])]) {
    const paragraph = half.rulesParagraphs?.find((p) =>
      /^Fuse\b/.test(p.runs.map((r) => r.text).join('')),
    );
    if (paragraph) return [paragraph];
    const text = half.rulesText?.split('\n').find((t) => /^Fuse\b/.test(t));
    if (text) return [{ role: 'rules' as const, runs: [{ text }] }];
  }
  return [];
}
