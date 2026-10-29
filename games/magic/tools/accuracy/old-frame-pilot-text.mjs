// Development import notation only. Preserve the shared historical audit parser.
import { printingTextIndex } from './printing-text.mjs';
export function oldFramePilotText(snapshot, source) {
  const index = printingTextIndex(snapshot, source);
  // SCG Ark of Blight and Temple of the False God scans verify this legacy token.
  // rawOriginalText remains the exact imported source for provenance.
  for (const card of Object.values(index.cards))
    card.originalText = card.originalText.replace(/\{cT\}/g, '{T}');
  return index;
}
