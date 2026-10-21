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
export function adjustCalibrationRules(
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
