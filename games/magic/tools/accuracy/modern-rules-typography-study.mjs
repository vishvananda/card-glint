// Printing typography proposal. Semantic source strings stay unchanged.
export function printingQuotes(text) {
  return text
    .replace(/(^|[\s([{\u2014])"/g, '$1\u201c')
    .replaceAll('"', '\u201d')
    .replaceAll("'", '\u2019');
}
