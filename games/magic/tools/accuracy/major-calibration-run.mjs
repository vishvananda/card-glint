import { cacheRoot } from './common.mjs';
// New passes retain the immutable captures and normalization evidence of older
// releases. An explicit slug is also the candidate baseline identity.
export const calibrationRevision = process.env.MAGIC_CALIBRATION_REVISION ?? '';
if (calibrationRevision && !/^[a-z0-9][a-z0-9-]{0,40}$/.test(calibrationRevision))
  throw Error('Invalid calibration revision');
export const calibrationDirectory = `${cacheRoot}/rollout/major-calibration${calibrationRevision ? '-' + calibrationRevision : ''}`;

// Explicit study plans retain their own cohort and source identities.
const planName = process.env.MAGIC_CALIBRATION_PLAN ?? 'major-calibration';
if (!/^[a-z0-9][a-z0-9-]{0,60}$/.test(planName)) throw Error('Invalid calibration plan name');
export const calibrationPlanFile = `${cacheRoot}/rollout/${planName}-plan.json`;
