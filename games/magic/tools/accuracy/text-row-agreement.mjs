/** Compare reviewed printed row breaks independently of pixel overlap.
 * This diagnostic requires matching wording. It never guesses missing words,
 * changes the whole-card metric, or supplies runtime per-card layout values. */
export function textRowAgreement(referenceRows, renderedRows) {
  const rows = (values) => {
    if (!Array.isArray(values) || values.some((v) => typeof v !== 'string'))
      throw TypeError('Text rows must be an array of strings');
    return values
      .map((value) =>
        value
          .normalize('NFKC')
          .toLowerCase()
          .replaceAll('\u00ad', '')
          .replace(/[’‘]/g, "'")
          .replace(/[^\p{L}\p{N}']+/gu, ' ')
          .trim()
          .split(/\s+/)
          .filter(Boolean),
      )
      .filter((row) => row.length);
  };
  const reference = rows(referenceRows),
    rendered = rows(renderedRows);
  const a = reference.flat(),
    b = rendered.flat();
  const counts = { referenceRows: reference.length, renderedRows: rendered.length };
  if (!a.length && !b.length) return { status: 'not-applicable', ...counts };
  if (a.length !== b.length || a.some((word, i) => word !== b[i]))
    return {
      status: 'content-mismatch',
      ...counts,
      referenceWords: a.length,
      renderedWords: b.length,
      score: null,
    };
  const ends = (values) => {
    let total = 0;
    return values.slice(0, -1).map((row) => (total += row.length));
  };
  const referenceEnds = ends(reference),
    renderedEnds = ends(rendered);
  const same = referenceEnds.filter((end) => renderedEnds.includes(end));
  const denominator = referenceEnds.length + renderedEnds.length;
  return {
    status: 'measured',
    ...counts,
    referenceEnds,
    renderedEnds,
    matchedEnds: same,
    score: denominator ? (2 * same.length) / denominator : 1,
    exact: referenceEnds.length === renderedEnds.length && same.length === referenceEnds.length,
  };
}
