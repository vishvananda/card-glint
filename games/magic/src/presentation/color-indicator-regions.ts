import {
  FACE_HEIGHT,
  FACE_WIDTH,
  FACE_TEXT,
  type FaceRect,
  type RenderedCardInput,
} from './face-layout.js';
import {
  colorIndicatorLayout,
  resolveColorIndicator,
  type ResolvedColorIndicator,
} from './color-indicator.js';
import { faceFrame, faceRects } from './special-frames.js';
import { splitPanels, splitTextScale } from './split-layout.js';
import { nativeSplitEra, hasFuse, splitGeometry } from './split-frame.js';
import { isAftermath, AFTERMATH_TOP, AFTERMATH_BOTTOM } from './aftermath-frame.js';
import { isAdventure } from './adventure-frame.js';
import { isPrepared, preparedSpell } from './prepare-frame.js';
import { STANDARD_TEMPLATE_DEFAULTS } from './standard-frame-templates.js';
import { FLIP_PANEL_RECTS } from './flip-template-paint.js';
import { futureGeometry } from './future-frame.js';
import { isRetro, retroPx, retroRects } from './retro-frame.js';
import { retroPrintDetails } from './retro-details.js';
import { retroTypePlacement } from './retro-type.js';
import { framePlate } from './frame-plates.js';
import { modernPrintingProfile } from './modern-printing-profile.js';
import { eighthPrintingProfile } from './eighth-printing-profile.js';
import { planarLettering } from './planar-lettering.js';

export interface ColorIndicatorRegion extends ResolvedColorIndicator {
  id: string;
  /** Physical card UVs, top-left origin, including rotated panels. */
  rect: FaceRect;
}
type Transform = readonly [number, number, number, number, number, number];
const IDENTITY: Transform = [1, 0, 0, 1, 0, 0];
const pixels = (r: FaceRect): FaceRect => [r[0] * 488, r[1] * 680, r[2] * 488, r[3] * 680];

/** Badge hit regions follow each painter's local type slot, not an unrotated parent box. */
export function colorIndicatorRegions(face: RenderedCardInput): ColorIndicatorRegion[] {
  const regions: ColorIndicatorRegion[] = [];
  const add = (
    f: RenderedCardInput,
    type: FaceRect,
    id = 'color-indicator',
    matrix: Transform = IDENTITY,
    width = 488,
  ) => {
    const layout = colorIndicatorLayout(f, type, width);
    if (!layout) return;
    const [x, y, w, h] = layout.indicator;
    const corners = [
      [x, y],
      [x + w, y],
      [x, y + h],
      [x + w, y + h],
    ].map(([x, y]) => [
      matrix[0] * x! + matrix[2] * y! + matrix[4],
      matrix[1] * x! + matrix[3] * y! + matrix[5],
    ]);
    const xs = corners.map((p) => p[0]!),
      ys = corners.map((p) => p[1]!);
    regions.push({
      ...layout.resolved,
      id,
      rect: [
        Math.min(...xs) / FACE_WIDTH,
        Math.min(...ys) / FACE_HEIGHT,
        (Math.max(...xs) - Math.min(...xs)) / FACE_WIDTH,
        (Math.max(...ys) - Math.min(...ys)) / FACE_HEIGHT,
      ],
    });
  };
  const panels = splitPanels(face);
  if (panels.length) {
    const era = nativeSplitEra(face);
    panels.forEach((panel, index) => {
      if (!resolveColorIndicator(panel.face)) return;
      let type: FaceRect;
      let scale = 1;
      if (isAftermath(face)) {
        const r = (index ? AFTERMATH_BOTTOM : AFTERMATH_TOP).type;
        type = [r[0], r[1] + 16.5 - 23 / 2, r[2], 23];
      } else if (era) {
        const r = splitGeometry(era, hasFuse(face)).type;
        const size = era === 'old' ? 22 : era === 'm15' ? 18.5 : 21.5;
        type =
          era === 'm15'
            ? [70, 277 - size / 2, 261, size]
            : [r[0], r[1] + r[3] / 2 - size / 2, r[2], size];
      } else {
        type = componentSlot(panel.face);
        const localHeight = (panel.height * 488) / panel.width;
        const r = faceRects(panel.face).type;
        // Generic split children use their narrower local portrait height.
        type = [type[0], type[1] + (r[1] + r[3] / 2) * (localHeight - 680), type[2], type[3]];
        scale = panel.width / 488;
      }
      const angle = (panel.rotation * Math.PI) / 180;
      add(panel.face, type, `face-${index}-color-indicator`, [
        Math.cos(angle) * scale,
        Math.sin(angle) * scale,
        -Math.sin(angle) * scale,
        Math.cos(angle) * scale,
        panel.x,
        panel.y,
      ]);
    });
    return regions;
  }
  if (face.frameTemplate === 'flip') {
    face.faces?.forEach((f, i) =>
      add(
        f,
        FLIP_PANEL_RECTS[i]!.type,
        `face-${i}-color-indicator`,
        i ? [-488 / 375, 0, 0, -680 / 523, 488, 680] : [488 / 375, 0, 0, 680 / 523, 0, 0],
        375,
      ),
    );
    return regions;
  }
  if (face.frameTemplate === 'battle') {
    add(
      face,
      STANDARD_TEMPLATE_DEFAULTS.battle.type,
      'color-indicator',
      [0, -680 / 523, 488 / 375, 0, 0, 680],
      375,
    );
    return regions;
  }
  if (isAdventure(face) || isPrepared(face)) {
    add(face, [41.7, 390.5, 407.3, 22]);
    const spell = isPrepared(face) ? preparedSpell(face) : face.faces![1]!;
    add(
      spell,
      isPrepared(face) ? [(1042 / 2010) * 488, 467, 195.2, 20] : [40, 473.5 - 20.1 / 2, 193, 20.1],
      'spell-color-indicator',
    );
    return regions;
  }
  if (resolveColorIndicator(face)) add(face, componentSlot(face));
  return regions;
}
function componentSlot(face: RenderedCardInput): FaceRect {
  if (face.frameTemplate === 'future') {
    const r = futureGeometry(face).type;
    return [r[0] + 1.25, r[1] - 1.5, r[2], r[3]];
  }
  const kind = faceFrame(face);
  if (kind === 'saga') return [41.7, 583.5, 407.3, 22];
  if (isRetro(face)) {
    const r = retroPx(retroRects(face).type),
      p = retroTypePlacement(face);
    return [(retroPrintDetails(face)?.typeX ?? r[0]) + p.dx, r[1] + p.dy, r[2], r[3]];
  }
  const plate = framePlate(face);
  if (plate) {
    const [x, y, w, h] = pixels(plate.rects.type);
    const p = planarLettering(face, plate.frame, 'type'),
      e = eighthPrintingProfile(face)?.headings.type;
    const m = modernPrintingProfile(face)?.typeText?.plate;
    const size = plate.typeSize * p.size * (m?.size ?? 1);
    return [
      x + (m?.dx ?? 0) + p.dx + (e?.dx ?? 0),
      y + h / 2 + (m?.dy ?? 0) + p.dy + (e?.dy ?? 0) - size / 2,
      w,
      size,
    ];
  }
  const r = faceRects(face),
    title = pixels(r.title),
    type = pixels(r.type);
  const walker = kind.startsWith('planeswalker'),
    m = modernPrintingProfile(face)?.typeText?.[walker ? 'walker' : 'components'];
  const size = FACE_TEXT.typeFont * splitTextScale(face);
  return [
    title[0] +
      FACE_TEXT.plateLeft +
      (kind === 'normal' ? 1 : 0) +
      (walker ? 1.5 : 0) +
      (m?.dx ?? 0),
    type[1] +
      type[3] / 2 +
      FACE_TEXT.typeLift / 2 +
      (kind === 'normal' || walker ? 2 : 0) +
      (m?.dy ?? 0) -
      size / 2,
    type[2] - FACE_TEXT.plateLeft - FACE_TEXT.plateRight,
    size,
  ];
}
