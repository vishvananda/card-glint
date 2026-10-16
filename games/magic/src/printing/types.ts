import type { CardWording } from '../presentation/wording.js';

/** Provider text with rules and flavor kept separate, before display assembly. */
export interface PrintingText extends CardWording {
  /** Rules only: do not append flavor here. */
  rulesText: string;
  flavorText?: string;
}
export type ReviewedWordingField =
  | 'name'
  | 'typeLine'
  | 'rulesText'
  | 'flavorText'
  | 'rulesParagraphs'
  | 'manaSymbols'
  | 'power'
  | 'toughness';
export interface ReviewedCorrection {
  faceName?: string;
  source: string;
  referenceSha256: string;
  reason: string;
  fields: Partial<PrintingText>;
}
export interface PrintingWordingProvenance {
  printingId: string;
  catalogRevision: string;
  status:
    | 'unreviewed'
    | 'applied'
    | 'missing-original'
    | 'reference-mismatch'
    | 'face-required'
    | 'face-not-found';
  identity: 'printing-id' | 'printing-id-and-scan';
  /** Only these original fields were reviewed; Oracle data is never corrected. */
  corrections: (Omit<ReviewedCorrection, 'fields'> & {
    fields: ReviewedWordingField[];
    before: Partial<PrintingText>;
    after: Partial<PrintingText>;
  })[];
}
export interface ResolvedPrintingWording {
  wordings: { oracle: CardWording; original?: CardWording };
  provenance: PrintingWordingProvenance;
}
