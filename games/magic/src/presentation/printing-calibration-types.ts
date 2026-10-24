/** Optional appearance policy; omission retains the legacy colorCalibration behavior. */
export type PrintingCalibrationChoice = 'auto' | 'printing' | 'source' | { profile: string };
export interface PrintingCalibrationComponent {
  status: 'measured' | 'fallback' | 'mixed' | 'source';
  profile?: string;
  revision?: number;
  /** Actual source assets receiving this correction, not interchangeable frame names. */
  assets: readonly string[];
  color?: string;
  symbols?: readonly string[];
}
export interface PrintingCalibrationReport {
  mode: PrintingCalibrationChoice | 'legacy';
  components: {
    frame: PrintingCalibrationComponent;
    textBox: PrintingCalibrationComponent;
    border: PrintingCalibrationComponent;
    interiorInk: PrintingCalibrationComponent;
    manaSymbols: PrintingCalibrationComponent;
  };
  /** Shared modern style; inherited values do not certify this printing. */
  defaults?: { status: 'inherited'; profile: 'm21-modern' | '8ed-eighth'; revision: number };
  notices: readonly string[];
}
export const printingCalibrationApiVersion = 1 as const;
/** Only reviewed donor policies are selectable. Revision changes invalidate saved material keys. */
export const printingCalibrationProfiles = Object.freeze([
  Object.freeze({
    id: 'm21-modern',
    revision: 16,
    label: 'Modern · M21 defaults',
    setCode: 'M21',
    note: 'Source-bound M21 frame, color, mana, heading, body and footer defaults. Printing content stays local; inherited values are not target-set measurements.',
  }),
  Object.freeze({
    id: '8ed-eighth',
    revision: 1,
    label: 'Eighth · 8ED defaults',
    setCode: '8ED',
    note: 'Source-bound Eighth-family geometry, typography, land, mana and material defaults. Black and white surrounds remain separate. Printing content and set icons are never donated; inherited values are not target-set certification.',
  }),
]);
export function validatePrintingCalibration(
  value: unknown,
): asserts value is PrintingCalibrationChoice {
  if (value === 'auto' || value === 'printing' || value === 'source') return;
  if (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value).length === 1 &&
    Object.hasOwn(value, 'profile') &&
    printingCalibrationProfiles.some((p) => p.id === (value as { profile: unknown }).profile)
  )
    return;
  throw Error('Invalid printing calibration choice');
}
