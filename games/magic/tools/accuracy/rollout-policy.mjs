/** New rollout policy; earlier frozen corpus policies and reports stay unchanged. */
export const ROLLOUT_POLICY = 'major-ordinary-paper-v1';
export const MAJOR_SET_MINIMUM = 50;
const ordinaryEffects = new Set([
  'legendary',
  'enchantment',
  'nyxtouched',
  'devoid',
  'miracle',
  'draft',
  'tombstone',
  'colorshifted',
  'sunmoondfc',
  'compasslanddfc',
  'mooneldrazidfc',
  'originpwdfc',
]);
const alternateEffects = new Set([
  'showcase',
  'extendedart',
  'borderless',
  'fullart',
  'etched',
  'inverted',
  'shatteredglass',
  'textless',
]);
const nonCardLayouts = new Set(['token', 'double_faced_token', 'emblem', 'art_series']);

export function printingScope(card) {
  if (card.lang !== 'en' || !card.games?.includes('paper'))
    return { status: 'excluded', reason: 'not-English-paper' };
  if (card.digital || card.oversized) return { status: 'excluded', reason: 'digital-or-oversized' };
  if (nonCardLayouts.has(card.layout)) return { status: 'excluded', reason: 'non-card-layout' };
  if (
    !['black', 'white'].includes(card.border_color) ||
    card.full_art ||
    card.textless ||
    card.promo
  )
    return { status: 'excluded', reason: 'special-treatment' };
  const effects = card.frame_effects ?? [],
    alternate = effects.filter((e) => alternateEffects.has(e));
  if (alternate.length)
    return { status: 'excluded', reason: `alternate-effect:${alternate.join(',')}` };
  // Bonus-sheet products include both bespoke frames and ordinary retro
  // reprints. Missing showcase flags alone cannot certify them as ordinary.
  if (card.set_type === 'masterpiece')
    return { status: 'review', reason: 'special-product-frame-review' };
  const unknown = effects.filter((e) => !ordinaryEffects.has(e));
  return unknown.length
    ? { status: 'review', reason: `unclassified-effect:${unknown.join(',')}` }
    : { status: 'ordinary', reason: null };
}

export function cardIdentity(card) {
  // Missing Oracle identity must not turn each art variant into a distinct card.
  if (card.oracle_id) return card.oracle_id;
  if (!card.name) throw Error('Printing lacks a card identity');
  return `name:${card.name}`;
}

export function frameWave(card) {
  return ['1993', '1997'].includes(card.frame)
    ? 'old'
    : ['2003', '2015', 'future'].includes(card.frame)
      ? 'new'
      : 'unclassified';
}

export function referenceIssue(card) {
  if (card.image_status !== 'highres_scan' || !card.highres_image) return 'not-high-resolution';
  if (!card.image_uris?.png || !card.image_uris?.art_crop)
    return card.card_faces ? 'per-face-reference-adapter-needed' : 'missing-images';
  return null;
}

export function evaluatorIssue(card) {
  if (!['1993', '1997', '2015'].includes(card.frame))
    return `frame-adapter-unvalidated:${card.frame ?? 'missing'}`;
  if (card.layout !== 'normal') return `layout-adapter-unvalidated:${card.layout ?? 'missing'}`;
  if (/\b(Saga|Class|Battle)\b/.test(card.type_line ?? ''))
    return 'dedicated-component-regions-needed';
  return null;
}

export function summarizeSet(cards) {
  const scopes = cards.map((card) => ({ card, ...printingScope(card) })),
    ordinary = scopes.filter((r) => r.status === 'ordinary'),
    review = scopes.filter((r) => r.status === 'review');
  const distinct = (rows) => new Set(rows.map((r) => cardIdentity(r.card))).size;
  const countReasons = (rows) =>
    Object.fromEntries(
      [...new Set(rows.map((r) => r.reason))]
        .sort()
        .map((reason) => [reason, rows.filter((r) => r.reason === reason).length]),
    );
  const admission =
    distinct(ordinary) >= MAJOR_SET_MINIMUM
      ? 'major'
      : distinct([...ordinary, ...review]) >= MAJOR_SET_MINIMUM
        ? 'classification-review'
        : 'smaller';
  const groups = new Map();
  for (const { card, status, reason } of [...ordinary, ...review]) {
    const wave = frameWave(card),
      key = [wave, card.frame, card.border_color, card.layout].join('/');
    if (!groups.has(key))
      groups.set(key, {
        key,
        wave,
        frame: card.frame,
        border: card.border_color,
        layout: card.layout,
        printings: 0,
        classificationReview: 0,
        referenceMetadataReady: 0,
        evaluatorEligible: 0,
        referenceIssues: {},
        evaluatorIssues: {},
        rarities: {},
        passStatus: { symbols: 'not-started', geometry: 'not-started', hsb: 'not-started' },
      });
    const group = groups.get(key),
      ref = referenceIssue(card),
      adapter = evaluatorIssue(card);
    group.printings++;
    if (status === 'review') group.classificationReview++;
    if (ref) group.referenceIssues[ref] = (group.referenceIssues[ref] ?? 0) + 1;
    else group.referenceMetadataReady++;
    if (adapter) group.evaluatorIssues[adapter] = (group.evaluatorIssues[adapter] ?? 0) + 1;
    else group.evaluatorEligible++;
    group.rarities[card.rarity] = (group.rarities[card.rarity] ?? 0) + 1;
  }
  return {
    admission,
    totalPrintings: cards.length,
    ordinaryPrintings: ordinary.length,
    distinctOrdinary: distinct(ordinary),
    classificationReview: review.length,
    excluded: countReasons(scopes.filter((r) => r.status === 'excluded')),
    review: countReasons(review),
    groups: [...groups.values()].sort((a, b) => a.key.localeCompare(b.key)),
  };
}
