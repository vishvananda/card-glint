/** Treatment selection is explicit. Ordinary basic lands and planeswalkers stay in the denominator. */
export function corpusPolicy(cards) {
  // Keep existing modern snapshot identities when the expanded policy changes
  // neither eligibility nor supported layout. Old/white borders use the new policy.
  return cards.some(
    (card) => ['1993', '1997'].includes(card.frame) || card.border_color === 'white',
  )
    ? 'ordinary-paper-v2'
    : 'ordinary-paper-v1';
}

export function exclusion(card) {
  if (card.lang !== 'en' || !card.games?.includes('paper')) return 'not-English-paper';
  if (card.digital || card.oversized) return 'digital-or-oversized';
  if (
    !['black', 'white'].includes(card.border_color) ||
    card.full_art ||
    card.textless ||
    card.promo
  )
    return 'special-treatment';
  const effects = (card.frame_effects ?? []).filter((effect) => effect !== 'legendary');
  if (effects.length) return `treatment:${effects.join(',')}`;
  return null;
}

export function qualityIssue(card) {
  if (card.image_status !== 'highres_scan' || !card.highres_image)
    return 'reference-not-high-resolution';
  if (!card.image_uris?.png || !card.image_uris?.art_crop) return 'missing-reference-images';
  if (!['1993', '1997', '2015'].includes(card.frame) || card.layout !== 'normal')
    return 'unsupported-layout';
  return null;
}

export function category(card) {
  return /Planeswalker/.test(card.type_line)
    ? 'planeswalker'
    : /Basic Land/.test(card.type_line)
      ? 'basic-land'
      : 'ordinary';
}
