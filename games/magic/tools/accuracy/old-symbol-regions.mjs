/** Fixed calibration windows excluding the long art/rules frame lines.
 * Candidate visible bounds must fit fully inside; search-edge peaks stay
 * flagged rather than accepted for hiding unmatched ink. */
export const oldSymbolRegions = {
  arn: [368, 379, 77, 30],
  leg: [408, 379, 38, 29],
  all: [360, 379, 73, 29],
  wth: [389, 373, 54, 34],
  exo: [369, 375, 70, 31],
};
