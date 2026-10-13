import manifest from '../../assets.json' with { type: 'json' };
import { hasNoPrintedSetSymbol } from './historical-set-symbol.js';
import { retroBasicPrinting, simpleBasicMana } from './retro-basic.js';
import {
  cardStock,
  FACE_RECTS,
  FACE_WIDTH as W,
  FACE_HEIGHT as H,
  type RenderedCardInput,
  type FaceRect,
} from './face-layout.js';
import { resolveFrameColors } from './profile.js';
import { faceSetSymbol } from './assets.js';
import { faceManaAssets } from './mana-assets.js';
export const RETRO_SYMBOL_FONT = manifest.RETRO_SYMBOL_FONT;
export const RETRO_ROOT = manifest.RETRO_ROOT;
export const RETRO_FONT = `${RETRO_ROOT}/fonts/goudy-medieval.ttf`;
const oldSets = new Set(
  'lea leb 2ed 3ed 4ed 5ed 6ed 7ed arn atq leg drk fem ice hml all mir vis wth tmp sth exo usg ulg uds mmq nem pcy inv pls apc ody tor jud ons lgn scg chr tsb'.split(
    ' ',
  ),
);
const whiteSets = new Set('2ed 3ed 4ed 5ed 6ed 7ed chr'.split(' '));
export function isRetro(face: RenderedCardInput): boolean {
  if (
    (face.layout && !['normal', 'token'].includes(face.layout)) ||
    /\b(Saga|Class|Planeswalker|Battle)\b/.test(face.typeLine ?? '')
  )
    return false;
  return (
    face.frameStyle === 'retro' ||
    (face.frameStyle !== 'modern' && oldSets.has(face.setCode?.toLowerCase() ?? ''))
  );
}
export function retroEarly(face: RenderedCardInput) {
  return ['lea', 'leb', '2ed'].includes(face.setCode?.toLowerCase() ?? '');
}
export function retroFamily(face: RenderedCardInput) {
  const set = face.setCode?.toLowerCase() ?? '';
  if (retroEarly(face)) return 'abu';
  if (set === 'leg' && resolveFrameColors(face).length > 1) return 'legends';
  if (['3ed', '4ed', '5ed', 'atq'].includes(set) && !/\bLand\b/.test(face.typeLine ?? ''))
    return 'fourth';
  return 'seventh';
}
export function retroFrameRect(face: RenderedCardInput): FaceRect {
  return retroFamily(face) === 'fourth' ? [0.012, 0.01, 0.974, 0.982] : [0, 0, 1, 1];
}
export function retroRects(face: RenderedCardInput) {
  const early = retroEarly(face);
  return {
    ...FACE_RECTS,
    frame: retroFrameRect(face),
    title: [early ? 0.07 : 0.1134, 0.0481, early ? 0.8467 : 0.8, 0.043] as FaceRect,
    art: (retroFamily(face) === 'legends'
      ? [0.112, 0.094, 0.78, 0.45]
      : retroFamily(face) === 'fourth'
        ? [0.109, 0.093, 0.779, 0.453]
        : early
          ? [0.116, 0.1043, 0.7654, 0.441]
          : [0.12, 0.0991, 0.7667, 0.4429]) as FaceRect,
    type: [0.1074, 0.5486, 0.7852, 0.0543] as FaceRect,
    rules: [0.128, 0.6067, 0.744, 0.2724] as FaceRect,
    stats: [0.8074, 0.895, 0.1367, 0.043] as FaceRect,
    footer: [0.1, 0.9, 0.68, 0.04] as FaceRect,
    stamp: [0.34, 0.628, 0.32, 0.23] as FaceRect,
  };
}
export function retroFrameAsset(face: RenderedCardInput) {
  const colors = resolveFrameColors(face),
    type = face.typeLine ?? '';
  const landType = [
    ['Plains', 'w'],
    ['Island', 'u'],
    ['Swamp', 'b'],
    ['Mountain', 'r'],
    ['Forest', 'g'],
  ].filter(([name]) => type.includes(name!));
  const key = /\bLand\b/.test(type)
    ? landType.length === 1
      ? landType[0]![1] + 'l'
      : 'l'
    : /\bArtifact\b/.test(type)
      ? 'a'
      : colors.length > 1
        ? 'm'
        : (colors[0]?.toLowerCase() ?? 'c');
  const family = retroFamily(face);
  const folder =
    family === 'seventh' || key === 'c' || (family === 'abu' && key === 'm')
      ? 'seventh/regular'
      : `old/${family}`;
  return `${RETRO_ROOT}/img/frames/${folder}/${family === 'legends' ? 'legendsFrameM' : key}.png`;
}
export function retroBorder(face: RenderedCardInput) {
  return face.borderColor ?? (whiteSets.has(face.setCode?.toLowerCase() ?? '') ? 'white' : 'black');
}
export function retroStock(face: RenderedCardInput) {
  return retroBorder(face) === 'silver'
    ? cardStock(null, 'silver').border
    : retroBorder(face) === 'white'
      ? RETRO_WHITE
      : '#080808';
}
export function retroBorderMask(face: RenderedCardInput) {
  return retroFamily(face) === 'fourth'
    ? `${RETRO_ROOT}/img/frames/old/fourth/borderBlack.png`
    : `${RETRO_ROOT}/img/frames/${retroEarly(face) ? 'old/abu' : 'seventh/regular'}/border.svg`;
}
export function retroInk(face: RenderedCardInput) {
  return retroEarly(face) ? '#ababab' : '#f2eee3';
}
export function retroFrameFilter(face: RenderedCardInput) {
  return face.setCode?.toLowerCase() === '7ed' &&
    resolveFrameColors(face).some((c) => c === 'W' || c === 'G') &&
    !/Land/.test(face.typeLine ?? '')
    ? 'saturate(.7) brightness(.88)'
    : 'none';
}
export function retroBasicSymbol(face: RenderedCardInput) {
  if (retroBasicPrinting(face)) return null;
  const symbol = simpleBasicMana(face);
  return symbol ? `${RETRO_ROOT}/img/frames/m15/basics/${symbol.toLowerCase()}.png` : null;
}
export const RETRO_WHITE = '#eeedeb';
export function retroSetSymbol(face: RenderedCardInput) {
  const set = face.setCode?.toLowerCase() ?? '';
  if (!face.setSymbol && set === 'ice' && face.setSymbolSource === 'keyrune')
    return `${manifest.KEYRUNE_ROOT}/ice2.svg`;
  return !face.setSymbol && hasNoPrintedSetSymbol(set, face.name) ? null : faceSetSymbol(face);
}
export function retroRulesSize(face: RenderedCardInput) {
  const n = (face.rulesText ?? '').length;
  return n > 340 ? 16 : n > 210 ? 19 : 23;
}
export function retroAssets(face: RenderedCardInput) {
  return [
    retroBasicSymbol(face),
    retroFrameAsset(face),
    retroBorder(face) !== 'black' || retroFamily(face) === 'fourth' ? retroBorderMask(face) : null,
    face.illustration,
    retroSetSymbol(face),
    ...faceManaAssets(face),
  ];
}
export const retroPx = ([x, y, w, h]: FaceRect): [number, number, number, number] => [
  x * W,
  y * H,
  w * W,
  h * H,
];

/** Seventh regular and foil share a printing UUID but use different stock. */
export function printingBorder(
  setCode: string | null | undefined,
  finish: string | undefined,
): 'black' | undefined {
  return ['7ed', '8ed', '9ed'].includes(setCode?.toLowerCase() ?? '') &&
    ['foil', 'prismatic', 'etched', 'cold', 'opal'].includes(finish ?? '')
    ? 'black'
    : undefined;
}
