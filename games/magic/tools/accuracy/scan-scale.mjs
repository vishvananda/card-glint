import { median } from './metrics.mjs';

export const SCAN_SCALE_VERSION = 'normal-set-scale-v1';

/** Opposing frame rails estimate scale; vertical landmarks only test that hypothesis. */
export function frameDimensions(landmarks) {
  const groups = {};
  for (const group of ['outerLeft', 'outerRight', 'artTop', 'artBottom']) {
    const valid = landmarks.filter((p) => p.group === group && p.status === 'measured'),
      position = valid.length >= 2 ? median(valid.map((p) => p.position)) : null,
      spread =
        position === null ? null : Math.max(...valid.map((p) => Math.abs(p.position - position)));
    groups[group] = {
      count: valid.length,
      position,
      spread,
      reliable: position !== null && spread <= 0.8,
    };
  }
  const distance = (a, b) =>
    groups[a].reliable && groups[b].reliable ? groups[b].position - groups[a].position : null;
  return {
    groups,
    outerWidth: distance('outerLeft', 'outerRight'),
    verticalSpan: distance('artTop', 'artBottom'),
  };
}

/** One uniform factor per set/frame group. Never fit a card or a component. */
export function estimateScanScale(samples, template) {
  const target = frameDimensions(
      template.map((p) => ({ ...p, status: p.position === null ? 'missing' : 'measured' })),
    ),
    usable = samples.filter((s) => s.dimensions.outerWidth !== null),
    calibration = usable.filter((s) => s.cohort === 'calibration'),
    validation = usable.filter((s) => s.cohort === 'validation'),
    width = median(calibration.map((s) => s.dimensions.outerWidth)),
    proposed = width === null || !target.outerWidth ? null : target.outerWidth / width,
    scale = proposed ?? 1,
    widthMad =
      width === null
        ? null
        : median(calibration.map((s) => Math.abs(s.dimensions.outerWidth - width))),
    validationWidthError = median(
      validation.map((s) => Math.abs(s.dimensions.outerWidth * scale - target.outerWidth)),
    ),
    vertical = samples.filter((s) => s.dimensions.verticalSpan !== null),
    verticalError =
      target.verticalSpan === null
        ? null
        : median(
            vertical.map((s) => Math.abs(s.dimensions.verticalSpan * scale - target.verticalSpan)),
          ),
    colors = new Set(calibration.map((s) => s.bucket));
  const status =
    !target.outerWidth || target.verticalSpan === null
      ? 'invalid-template'
      : calibration.length < 6 || colors.size < 3 || validation.length < 2 || vertical.length < 6
        ? 'insufficient-landmarks'
        : Math.abs(scale - 1) > 0.02
          ? 'scale-out-of-bounds'
          : widthMad > 0.75 || validationWidthError > 1.5
            ? 'inconsistent-scale'
            : verticalError > 1.5
              ? 'inconsistent-vertical-geometry'
              : 'accepted';
  return {
    version: SCAN_SCALE_VERSION,
    status,
    proposed,
    scale: status === 'accepted' ? scale : 1,
    target,
    calibration: calibration.map((s) => s.id),
    validation: validation.map((s) => s.id),
    widthMad,
    validationWidthError,
    verticalError,
    limits: {
      minimumCalibration: 6,
      minimumColors: 3,
      minimumValidation: 2,
      minimumVertical: 6,
      maximumScaleChange: 0.02,
      maximumWidthMad: 0.75,
      maximumValidationError: 1.5,
      maximumVerticalError: 1.5,
    },
  };
}
