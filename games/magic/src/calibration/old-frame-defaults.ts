import type { RenderedCardInput } from '../presentation/face-layout.js';
import { profileSets } from '../data/scopes.js';
import type { HsbAdjustment } from '../presentation/hsb.js';
import { oldFrameDefaults } from './old-frame-default-values.js';

export type OldFrameComponent = 'title' | 'type' | 'mana' | 'rules';
export interface OldFrameDefault {
  readonly donor: '4ed' | 'mir' | 'ons';
  readonly border: 'black' | 'white';
  readonly stock: string;
  readonly retain: readonly OldFrameComponent[];
  /** Geometry and pigments can use different measured starting points. */
  readonly palette?: 'ons' | 'source';
  readonly materialPalettes?: Readonly<Record<string, 'ons' | 'source'>>;
  readonly pigment?: Readonly<
    Record<
      string,
      {
        readonly source: string;
        readonly frame: HsbAdjustment;
        readonly paper: HsbAdjustment;
      }
    >
  >;
}

/** Known old-frame set identity is stable when an independent profile is added. */
export function isOldFrameDefaultSet(code: string | null | undefined) {
  return Object.hasOwn(oldFrameDefaults, code?.toLowerCase() ?? '');
}

/** A set-only dependency query; independent profiles always take precedence. */
export function oldFrameDefaultDonor(code: string | null | undefined) {
  const set = code?.toLowerCase() ?? '';
  return !profileSets.includes(set) && Object.hasOwn(oldFrameDefaults, set)
    ? oldFrameDefaults[set]!.donor
    : undefined;
}

/** Only request the second color donor when it is used; neutral source needs no table. */
export function oldFrameDefaultColorDonor(code: string | null | undefined) {
  const set = code?.toLowerCase() ?? '';
  const choice = oldFrameDefaultDonor(set) ? oldFrameDefaults[set] : undefined;
  return choice &&
    (choice.palette === 'ons' || Object.values(choice.materialPalettes ?? {}).includes('ons'))
    ? 'ons'
    : undefined;
}

/** Existing ICE keeps its reviewed Fourth path. Custom and special layouts do
 * not inherit these development starting points. This query performs no IO. */
export function inheritedOldFrameDefault(face: RenderedCardInput) {
  const set = face.setCode?.toLowerCase() ?? '';
  if (
    set === 'ice' ||
    !oldFrameDefaultDonor(set) ||
    face.setCalibrationCandidate ||
    face.calibration === 'printing' ||
    face.frameTemplate ||
    face.frameAssetFamily ||
    face.frameStyle === 'modern' ||
    !!face.faces?.length ||
    (face.layout && face.layout !== 'normal') ||
    (face.borderColor && !['black', 'white'].includes(face.borderColor)) ||
    /\b(Saga|Class|Planeswalker|Battle)\b/.test(face.typeLine ?? '')
  )
    return undefined;
  return oldFrameDefaults[set];
}
export function retainsOldFrameComponent(face: RenderedCardInput, role: OldFrameComponent) {
  return inheritedOldFrameDefault(face)?.retain.includes(role) ?? false;
}

/** Cost geometry is relative to these measured legacy bases. Keep actual set
 * details in charge of its footer, symbol and retained headings. */
export function inheritedOldFrameManaBase(face: RenderedCardInput) {
  const choice = inheritedOldFrameDefault(face);
  if (!choice || choice.retain.includes('mana')) return undefined;
  return choice.donor === '4ed'
    ? { manaRight: 446.5, manaTop: 27.5, manaSize: 23.4, manaGap: 3.6 }
    : choice.donor === 'mir'
      ? { manaRight: 448, manaTop: 33.5, manaSize: 23.4, manaGap: 1.7 }
      : undefined;
}
