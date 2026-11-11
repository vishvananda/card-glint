import type { FaceRect, RenderedCardInput } from './face-layout.js';
import type { FrameColor } from './profile.js';

export interface ColorIndicatorInput {
  /** Physical printed dot; [] explicitly means no printed indicator. */
  colorIndicator?: readonly FrameColor[];
  /** Oracle indicator retained by importers, including on older printings without a dot. */
  oracleColorIndicator?: readonly FrameColor[];
  /** Unknown provider printing visibility must be reviewed before scan scoring. */
  colorIndicatorPrinting?: 'known' | 'unknown';
  /** Host-resolved current colors. [] means currently colorless, not a sixth color. */
  currentColors?: readonly FrameColor[];
  /** Current-if-changed is the default; without current colors it shows the printed dot. */
  colorIndicatorDisplay?: 'printed' | 'oracle' | 'current-if-changed' | 'hidden';
}
export interface ResolvedColorIndicator {
  colors: readonly FrameColor[];
  source: 'printed' | 'oracle' | 'current';
  label: string;
}
const ORDER = ['W', 'U', 'B', 'R', 'G'] as const;
const NAMES = { W: 'white', U: 'blue', B: 'black', R: 'red', G: 'green' } as const;
export const colorIndicatorComposite = (colors: readonly string[]) =>
  'card-glint:color-indicator:' + colors.join('');

/** Strict set normalization. Never interpret Commander identity or colorless mana as colors. */
export function indicatorColors(value: unknown): FrameColor[] {
  if (
    !Array.isArray(value) ||
    value.length > 5 ||
    !value.every((color) => typeof color === 'string' && /^[WUBRG]$/.test(color))
  )
    throw Error('Color indicators require an array of W, U, B, R, G colors');
  return ORDER.filter((color) => value.includes(color));
}
export function validateColorIndicator(face: ColorIndicatorInput): void {
  for (const key of ['colorIndicator', 'oracleColorIndicator', 'currentColors'] as const)
    if (face[key] !== undefined) indicatorColors(face[key]);
  if (
    face.colorIndicatorPrinting !== undefined &&
    !['known', 'unknown'].includes(face.colorIndicatorPrinting)
  )
    throw Error('Invalid color indicator printing status');
  if (
    face.colorIndicatorDisplay !== undefined &&
    !['printed', 'oracle', 'current-if-changed', 'hidden'].includes(face.colorIndicatorDisplay)
  )
    throw Error('Invalid color indicator display');
}
export function resolveColorIndicator(face: RenderedCardInput): ResolvedColorIndicator | null {
  validateColorIndicator(face);
  const mode = face.colorIndicatorDisplay ?? 'current-if-changed';
  if (mode === 'hidden') return null;
  let source: ResolvedColorIndicator['source'] = mode === 'oracle' ? 'oracle' : 'printed';
  let colors = indicatorColors(
    mode === 'oracle'
      ? (face.oracleColorIndicator ?? face.colorIndicator ?? [])
      : (face.colorIndicator ?? []),
  );
  if (mode === 'current-if-changed' && face.currentColors !== undefined) {
    if (face.colors === undefined)
      throw Error('Current-color comparison requires explicit base card colors');
    const base = indicatorColors(face.colors),
      current = indicatorColors(face.currentColors);
    if (base.join('') !== current.join('')) {
      colors = current;
      source = 'current';
    }
  }
  if (!colors.length && source !== 'current') return null;
  const name = colors.length ? colors.map((color) => NAMES[color]).join(' and ') : 'colorless';
  return {
    colors,
    source,
    label: source === 'current' ? `Currently ${name}` : `${name} color indicator`,
  };
}

export interface ColorIndicatorLayout {
  indicator: FaceRect;
  text: FaceRect;
  resolved: ResolvedColorIndicator;
}
/** Local painter coordinates. The caller owns panel rotation and type-line insets. */
export function colorIndicatorLayout(
  face: RenderedCardInput,
  type: FaceRect,
  referenceWidth = 488,
): ColorIndicatorLayout | null {
  const resolved = resolveColorIndicator(face);
  if (!resolved) return null;
  const diameter = Math.min((17 / 375) * referenceWidth, type[3]),
    advance = diameter + (3 / 375) * referenceWidth;
  if (
    !Number.isFinite(referenceWidth) ||
    referenceWidth <= 0 ||
    !type.every(Number.isFinite) ||
    diameter <= 0 ||
    type[2] <= advance
  )
    throw Error('Type line has no room for a color indicator');
  return {
    resolved,
    indicator: [type[0], type[1] + (type[3] - diameter) / 2, diameter, diameter],
    text: [type[0] + advance, type[1], type[2] - advance, type[3]],
  };
}

/** Omitted for invisible indicators: existing faces keep their exact cache identity. */
export function colorIndicatorKey(face: RenderedCardInput): unknown[] {
  const resolved = resolveColorIndicator(face);
  return resolved ? [['color-indicator-v1', resolved.colors]] : [];
}

/** A scan may be reused only while its printed indicator remains the visible one. */
export function colorIndicatorChangesPrinting(face: RenderedCardInput): boolean {
  const visible = resolveColorIndicator(face),
    printed = resolveColorIndicator({ ...face, colorIndicatorDisplay: 'printed' });
  return JSON.stringify(visible?.colors ?? null) !== JSON.stringify(printed?.colors ?? null);
}
