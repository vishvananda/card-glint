import type { CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import type { RenderedCardInput } from '../presentation/face-layout.js';
import { layoutRules, rulesLayoutRequest, type RulesLayout } from '../presentation/rules-layout.js';
import { calibrationForFace } from './selection.js';
import { earlyReprintFrame } from '../presentation/early-reprint-frame.js';

/** Deltas from the selected printing policy, in canonical card pixels/ratios. */
export interface CalibrationRulesAdjustment {
  readonly alignment?: 'printing' | 'left' | 'center';
  readonly leftMargin?: number;
  readonly rightMargin?: number;
  readonly vertical?: number;
  readonly fontSize?: number;
  readonly textWidth?: number;
  readonly leading?: number;
  readonly paragraphGap?: number;
  readonly flavorGap?: number;
}
function reflowCalibrationRules(
  context: CanvasContext,
  face: RenderedCardInput,
  layout: RulesLayout | null,
) {
  const profile = calibrationForFace(face);
  const material = earlyReprintFrame(face)?.material;
  const delta = material &&
    profile?.rulesAdjustments && {
      ...profile.rulesAdjustments.default,
      ...profile.rulesAdjustments[material],
    };
  if (!layout || !delta || !Object.values(delta).some(Boolean)) return layout;
  const request = rulesLayoutRequest(layout);
  if (!request) throw Error('Selected rules policy does not expose calibration inputs');
  const { bounds, typography } = request;
  const scale = layout.horizontalScale ?? 1;
  const left = (delta.leftMargin ?? 0) / scale,
    right = (delta.rightMargin ?? 0) / scale;
  const y = delta.vertical ?? 0;
  const paragraphs =
    delta.alignment && delta.alignment !== 'printing'
      ? request.paragraphs.map((p) => ({ ...p, align: delta.alignment as 'left' | 'center' }))
      : request.paragraphs;
  const adjusted = layoutRules(
    context,
    paragraphs,
    {
      ...bounds,
      x: bounds.x + left,
      y: bounds.y + y,
      width: bounds.width - left - right,
      verticalLimits: bounds.verticalLimits
        ? [bounds.verticalLimits[0] + y, bounds.verticalLimits[1] + y]
        : undefined,
    },
    request.maximumSize + (delta.fontSize ?? 0),
    request.minimumSize + (delta.fontSize ?? 0),
    {
      ...typography,
      textWidth: (typography.textWidth ?? 1) + (delta.textWidth ?? 0),
      leading: typography.leading + (delta.leading ?? 0),
      paragraphGap: typography.paragraphGap + (delta.paragraphGap ?? 0),
      flavorGap: typography.flavorGap + (delta.flavorGap ?? 0),
    },
  );
  return layout.horizontalScale === undefined ? adjusted : { ...adjusted, horizontalScale: scale };
}

/** A small measured baseline refit. Dense/overflowing passages keep their
 * original policy; this does not widen a panel or change line breaks. */
export interface CalibrationRulesPlacement {
  readonly baselineScale: number;
  readonly offset: readonly [number, number];
  readonly verticalLimits: readonly [number, number];
  readonly maximumHeight?: number;
}
export function placeCalibrationRules(
  layout: RulesLayout | null,
  placement?: CalibrationRulesPlacement,
): RulesLayout | null {
  if (!layout || !placement) return layout;
  const {
    baselineScale: factor,
    offset: [dx, dy],
    verticalLimits: [top, bottom],
    maximumHeight,
  } = placement;
  if (
    ![factor, dx, dy, top, bottom, ...(maximumHeight === undefined ? [] : [maximumHeight])].every(
      Number.isFinite,
    ) ||
    factor < 0.9 ||
    factor > 1.1 ||
    Math.abs(dx) > 8 ||
    Math.abs(dy) > 8 ||
    top >= bottom ||
    (maximumHeight !== undefined && (maximumHeight <= 0 || maximumHeight > 240))
  )
    throw Error('Invalid retained rules placement');
  if (
    layout.overflow ||
    !layout.lines.length ||
    (maximumHeight !== undefined && layout.height > maximumHeight) ||
    (factor === 1 && !dx && !dy)
  )
    return layout;
  const first = layout.lines[0]!.baseline,
    last = layout.lines.at(-1)!.baseline;
  const added = (last - first) * (factor - 1),
    y = (b: number) => (b - first) * (factor - 1) - added / 2 + dy;
  const newTop = layout.top - added / 2 + dy,
    height = layout.height + added;
  if (newTop < top || newTop + height > bottom) return layout;
  const x = dx / (layout.horizontalScale ?? 1);
  return {
    ...layout,
    x: layout.x + x,
    top: newTop,
    height,
    lines: layout.lines.map((line) => ({
      ...line,
      ...(line.x === undefined ? {} : { x: line.x + x }),
      baseline: line.baseline + y(line.baseline),
      inkBounds: [
        line.inkBounds[0] + x,
        line.inkBounds[1] + y(line.baseline),
        line.inkBounds[2],
        line.inkBounds[3],
      ],
    })),
    separators: layout.separators.map((v) => v + y(v)),
  };
}
export function adjustCalibrationRules(
  context: CanvasContext,
  face: RenderedCardInput,
  layout: RulesLayout | null,
) {
  const material = earlyReprintFrame(face)?.material;
  const placements = material && calibrationForFace(face)?.rulesPlacement;
  const placement = placements && (placements[material!] ?? placements.default);
  return placeCalibrationRules(
    reflowCalibrationRules(context, face, layout),
    placement || undefined,
  );
}
