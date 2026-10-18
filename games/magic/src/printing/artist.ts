import { reviewDetails } from './review.js';
import { artistCredits, artistCreditRevision } from './artist-credits.js';

export interface ReviewedArtistCredit {
  artist: string;
  source: string;
  referenceSha256: string;
  reason: string;
}
export interface PrintingArtistProvenance {
  printingId: string;
  catalogRevision: string;
  status: 'unreviewed' | 'applied' | 'reference-mismatch';
  identity: 'printing-id' | 'printing-id-and-scan';
  corrections: (ReviewedArtistCredit & { before: string | null | undefined })[];
}
export interface ResolvedPrintingArtist {
  artist: string | null | undefined;
  provenance: PrintingArtistProvenance;
}

/** Printed credit is physical printing metadata, independent of wording mode.
 * Keep the provider's canonical artist in the host's original record. */
export function resolvePrintingArtist(
  printingId: string,
  artist: string | null | undefined,
  options: { referenceSha256?: string } = {},
): ResolvedPrintingArtist {
  return resolveArtistWithCorrections(artistCredits, printingId, artist, options);
}
export function resolveArtistWithCorrections(
  catalog: typeof artistCredits,
  printingId: string,
  artist: string | null | undefined,
  options: { referenceSha256?: string } = {},
): ResolvedPrintingArtist {
  if (!printingId.trim()) throw Error('Printing ID must not be empty');
  const provenance: PrintingArtistProvenance = {
    printingId,
    catalogRevision: artistCreditRevision,
    status: 'unreviewed',
    identity: options.referenceSha256 ? 'printing-id-and-scan' : 'printing-id',
    corrections: [],
  };
  const review = Object.hasOwn(catalog, printingId) ? catalog[printingId] : undefined;
  if (!review) return { artist, provenance };
  if (options.referenceSha256 && options.referenceSha256 !== review.referenceSha256) {
    provenance.status = 'reference-mismatch';
    return { artist, provenance };
  }
  provenance.status = 'applied';
  provenance.corrections.push({ artist: review.artist, ...reviewDetails(review), before: artist });
  return { artist: review.artist, provenance };
}
