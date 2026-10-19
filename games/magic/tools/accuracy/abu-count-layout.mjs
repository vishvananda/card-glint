import { earlyTextTierLayout } from '../../src/presentation/early-text-tiers.ts';

/** Candidate options are recorded by the study; production owns the policy. */
export function countLayout(context, face, options = {}, base) {
  if (!base) throw Error('Count study requires the native base layout');
  return earlyTextTierLayout(context, face, base, options);
}
