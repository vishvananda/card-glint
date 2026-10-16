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
  if (!printingId.trim()) throw Error('Printing ID must not be empty');
  const provenance: PrintingArtistProvenance = {
    printingId,
    catalogRevision: artistCreditRevision,
    status: 'unreviewed',
    identity: options.referenceSha256 ? 'printing-id-and-scan' : 'printing-id',
    corrections: [],
  };
  const review = Object.hasOwn(artistCredits, printingId) ? artistCredits[printingId] : undefined;
  if (!review) return { artist, provenance };
  if (options.referenceSha256 && options.referenceSha256 !== review.referenceSha256) {
    provenance.status = 'reference-mismatch';
    return { artist, provenance };
  }
  provenance.status = 'applied';
  provenance.corrections.push({ ...review, before: artist });
  return { artist: review.artist, provenance };
}
