import { reviewSources } from '../data/review-metadata.js';
/** Runtime keeps a compact evidence locator and the scan hash needed for identity
 * checks. Detailed review prose lives in the source repository's fixtures. */
export interface ReviewIdentity {
  referenceSha256: string;
  evidence: number;
}
export function reviewDetails(review: ReviewIdentity) {
  const source = reviewSources[review.evidence];
  if (!source) throw Error('Invalid reviewed printing evidence');
  return {
    source,
    referenceSha256: review.referenceSha256,
    reason: 'Reviewed original printing; detailed notes are retained in the linked source fixture.',
  };
}
