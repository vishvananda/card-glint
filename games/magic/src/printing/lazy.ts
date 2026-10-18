import { setTable } from '../data/registry.js';
import type { printingCorrections } from './corrections.js';
import type { artistCredits } from './artist-credits.js';
import { loadPrintingSet } from '../data/load.js';
import { resolvePrintingWording, resolveWithCorrections } from './resolve.js';
import { resolvePrintingArtist, resolveArtistWithCorrections } from './artist.js';
/** Wording import does not load fonts, Canvas2D painters or frame algorithms. */
export async function resolveSetPrintingWording(
  setCode: string,
  ...args: Parameters<typeof resolvePrintingWording>
) {
  await loadPrintingSet(setCode);
  return resolveWithCorrections(
    setTable<typeof printingCorrections>(setCode.trim().toLowerCase(), 'printingCorrections'),
    ...args,
  );
}
export async function resolveSetPrintingArtist(
  setCode: string,
  ...args: Parameters<typeof resolvePrintingArtist>
) {
  await loadPrintingSet(setCode);
  return resolveArtistWithCorrections(
    setTable<typeof artistCredits>(setCode.trim().toLowerCase(), 'artistCredits'),
    ...args,
  );
}
export type { PrintingText, ResolvedPrintingWording, PrintingWordingProvenance } from './types.js';
export type { ResolvedPrintingArtist, PrintingArtistProvenance } from './artist.js';
