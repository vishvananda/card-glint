import { WALKER_GEOMETRY } from './planeswalker-geometry.js';
import { standardTemplateRects } from './standard-frame-templates.js';
import { splitHalfRects } from './split-frame.js';
import { ADVENTURE_RECTS } from './adventure-frame.js';
import { PREPARE_RECTS } from './prepare-frame.js';
import { SAGA_RECTS } from './saga-frame.js';
import { aftermathRects } from './aftermath-frame.js';
import { planeswalkerArtBounds } from './planeswalker-art.js';
import { isRetro, retroRects } from './retro-frame.js';
import { normalArtRect } from './normal-frame-geometry.js';
import { framePlate } from './frame-plates.js';
import {
  FACE_RECTS,
  FACE_WIDTH,
  FACE_HEIGHT,
  type FaceRect,
  type RenderedCardInput,
} from './face-layout.js';
export type SingleFrame =
  | 'normal'
  | 'saga'
  | 'planeswalker'
  | 'planeswalker-large'
  | 'adventure'
  | 'prepare'
  | 'class'
  | 'leveler';
export interface RuleRow {
  text: string;
  badges: string[];
  reminder: boolean;
}
export type FaceRects = { [K in keyof typeof FACE_RECTS]: FaceRect };
/** Presentation formatting only. Unknown lines stay visible; no rules are executed. */
export function specialRules(face: RenderedCardInput): RuleRow[] {
  const saga =
    face.layout === 'saga' || /\bSaga\b/i.test(face.canonicalTypeLine ?? face.typeLine ?? '');
  // Some printing sources delimit adjacent chapter clauses with a literal bar.
  // Only a bar followed by an explicit chapter label is a separator.
  const text = saga
    ? (face.rulesText ?? '').replace(/\|(?=\s*[IVXLCDM]+(?:\s*,\s*[IVXLCDM]+)*\s*[—–-]\s)/g, '\n')
    : (face.rulesText ?? '');
  return text
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => {
      const chapter = saga
        ? line.match(/^\s*([IVXLCDM]+(?:\s*,\s*[IVXLCDM]+)*)\s*[—–-]\s*(.+)$/)
        : null;
      if (chapter)
        return { text: chapter[2]!, badges: chapter[1]!.split(/\s*,\s*/), reminder: false };
      const loyalty = !saga ? line.match(/^\s*\[?([+−-]?(?:\d+|X))\]?\s*:\s*(.*)$/i) : null;
      return loyalty
        ? {
            text: loyalty[2]!,
            badges: [loyalty[1]!.replace('-', '−').toUpperCase()],
            reminder: false,
          }
        : { text: line, badges: [], reminder: saga && /^\s*\(/.test(line) };
    });
}
export function faceFrame(face: RenderedCardInput): SingleFrame {
  if (face.layout === 'ability') return 'normal';
  if (face.layout === 'prepare') return 'prepare';
  if (face.layout === 'adventure' && face.faces?.length === 2) return 'adventure';
  if (face.layout === 'class' || /\bClass\b/i.test(face.canonicalTypeLine ?? face.typeLine ?? ''))
    return 'class';
  if (face.layout === 'leveler' || /^Level up\b/m.test(face.rulesText ?? '')) return 'leveler';
  if (face.layout === 'saga' || /\bSaga\b/i.test(face.canonicalTypeLine ?? face.typeLine ?? ''))
    return 'saga';
  if (
    face.layout === 'planeswalker' ||
    /\bPlaneswalker\b/i.test(face.canonicalTypeLine ?? face.typeLine ?? '')
  )
    return specialRules(face).length > 3 ? 'planeswalker-large' : 'planeswalker';
  return 'normal';
}
export function faceRects(face: RenderedCardInput): FaceRects {
  const template = standardTemplateRects(face);
  if (template) return template;
  if (face.layout === 'aftermath-top' || face.layout === 'aftermath-bottom')
    return aftermathRects(face.layout === 'aftermath-bottom');
  if (/^split-(old|eighth|m15)(-fuse)?$/.test(face.layout ?? '')) return splitHalfRects(face);
  const plate = framePlate(face);
  if (plate) return plate.rects;
  if (isRetro(face)) return retroRects(face);
  const kind = faceFrame(face);
  if (kind === 'adventure') return ADVENTURE_RECTS;
  if (kind === 'prepare') return PREPARE_RECTS;
  if (kind === 'class')
    return {
      ...FACE_RECTS,
      background: [0.03937, 2.5 / 88.9, 0.92126, 0.93926],
      art: [4.3 / 63.5, 10 / 88.9, 27.3 / 63.5, 64.3 / 88.9],
      type: [0.05669, 74.4 / 88.9, 0.88662, 0.05737],
      rules: [31.8 / 63.5, 10.1 / 88.9, 26.4 / 63.5, 63.65 / 88.9],
      stamp: [0.57, 0.55, 0.25, 0.1794],
    };
  if (kind === 'saga') return SAGA_RECTS;
  if (kind.startsWith('planeswalker')) {
    const large = kind === 'planeswalker-large';
    const rules: FaceRect = [
      0.04409,
      (large ? 0.55118 : 0.62655) - WALKER_GEOMETRY.middleLift / FACE_HEIGHT,
      0.88827,
      (large ? 0.37534 : 0.29997) + WALKER_GEOMETRY.middleLift / FACE_HEIGHT,
    ];
    const stampWidth = FACE_RECTS.stamp[2],
      stampHeight = FACE_RECTS.stamp[3];
    return {
      ...FACE_RECTS,
      // Preserve the complete lower curve in the pinned 2778x3793 background
      // and 2736x3810 frame. Ordinary-face heights cut both off near the paper.
      background: [0.03937, 0.02531, 0.92126, (0.92126 * FACE_WIDTH * 3793) / 2778 / FACE_HEIGHT],
      frame: [0.04724, 0.02655, 0.91339, (0.91339 * FACE_WIDTH * 3810) / 2736 / FACE_HEIGHT],
      art: planeswalkerArtBounds(large),
      title: [0.05669, 0.03375, 0.88662, 0.05737],
      type: [
        0.05669 + 1.5 / FACE_WIDTH,
        (large ? 0.49044 : 0.55793) + (5 - WALKER_GEOMETRY.middleLift) / FACE_HEIGHT,
        0.88662,
        0.05737,
      ],
      rules,
      stats: [0.792 + 1 / FACE_WIDTH, 0.881 - 3 / FACE_HEIGHT, 0.16, 0.069],
      stamp: [
        rules[0] + (rules[2] - stampWidth) / 2,
        rules[1] + (rules[3] - stampHeight) / 2,
        stampWidth,
        stampHeight,
      ],
    };
  }
  if (face.layout === 'split-half')
    return {
      ...FACE_RECTS,
      background: [0.03937, 0.02531, 0.92126, 0.94],
      frame: [0.04858, 0.03937, 0.90284, 0.93],
      title: [0.05669, 0.045, 0.88662, 0.09],
      art: [0.06929, 0.14, 0.86142, 0.38],
      type: [0.05669, 0.525, 0.88662, 0.07],
      rules: [0.07638, 0.605, 0.84724, 0.32],
    };
  return { ...FACE_RECTS, art: normalArtRect(face) };
}
/** Approximate geometry for hosts without a measurement context. Canvas painters
 * use measured sagaRuleLayout / planeswalkerRuleRows instead. */
export function specialRuleRows(face: RenderedCardInput) {
  const saga = faceFrame(face) === 'saga',
    rect = faceRects(face).rules,
    rows = specialRules(face);
  const width = rect[2] * 488 - (saga ? 32 : 70),
    height = rect[3] * 680;
  let font = saga ? 21 : 19;
  const lines = (text: string, size: number) =>
    Math.max(1, Math.ceil((text.length * size * 0.49) / width));
  const minimum = (row: RuleRow, size: number) =>
    Math.max(saga ? row.badges.length * 36 : 34, lines(row.text, size) * size + 16);
  const demand = (size: number) => rows.reduce((n, row) => n + minimum(row, size), 0);
  while (font > 8 && demand(font) > height) font -= 0.5;
  const heights = rows.map((row) => minimum(row, font));
  const extra = Math.max(0, height - demand(font)) / Math.max(1, rows.length);
  // Share spare space equally, reserving additional height for a long ultimate.
  let share = height / Math.max(1, rows.length),
    remaining = height,
    count = rows.length;
  if (!saga)
    for (const needed of [...heights].sort((a, b) => b - a)) {
      if (needed <= share) break;
      remaining -= needed;
      share = remaining / Math.max(1, --count);
    }
  let top = 0;
  return rows.map((row, i) => {
    const h = saga ? heights[i]! + extra : Math.max(share, heights[i]!);
    const result = { ...row, top, height: h, font, left: saga ? 27 : 62, width };
    top += h;
    return result;
  });
}
