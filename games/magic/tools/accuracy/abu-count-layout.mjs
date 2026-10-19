import { earlyTextTierLayout } from '../../src/presentation/early-text-tiers.ts';

/** Candidate options are recorded by the study; production owns the policy. */
export function countLayout(context, face, options = {}, base) {
  if (!base) throw Error('Count study requires the native base layout');
  const candidate = earlyTextTierLayout(context, face, base, options);
  const sizeClass = (size) => (size < 19 ? 'small' : size < 30 ? 'medium' : 'large');
  // Preserve correctly selected regular/dense geometry during the shared
  // transfer probe. No printing names, IDs or scan poses select this rule.
  return options.preserveClassGeometry &&
    base.size < 30 &&
    sizeClass(base.size) === sizeClass(candidate.size)
    ? base
    : candidate;
}
