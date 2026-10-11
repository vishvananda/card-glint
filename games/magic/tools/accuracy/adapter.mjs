export function presentation(entry, annotations = {}) {
  const card = entry.card;
  const annotation = annotations[card.id] ?? {};
  if (annotation.reviewed && annotation.referenceHash !== entry.reference?.sha256)
    throw Error(`Reviewed text is stale for ${card.name}; review it against the new reference.`);
  const rules = annotation.rulesText ?? card.printed_text ?? card.oracle_text ?? '';
  const flavor = annotation.flavorText ?? card.flavor_text ?? '';
  const rulesText = [rules, flavor].filter(Boolean).join('\n');
  const rulesParagraphs = annotation.paragraphs ?? [
    ...rules
      .split('\n')
      .filter(Boolean)
      .map((text) => ({ role: 'rules', runs: reminderRuns(text) })),
    ...flavor
      .split('\n')
      .filter(Boolean)
      .map((text) => ({
        role: 'flavor',
        runs: text
          .split('*')
          .map((text, i) => ({ text, italic: i % 2 === 0 }))
          .filter((run) => run.text),
      })),
  ];
  const face = {
    name: annotation.name ?? card.name,
    typeLine: annotation.typeLine ?? card.printed_type_line ?? card.type_line,
    colors: card.colors,
    manaSymbols: [...(card.mana_cost ?? '').matchAll(/\{([^}]+)\}/g)].map((m) => m[1]),
    rulesText,
    rulesParagraphs,
    illustration: entry.art ? `/__accuracy/object/${entry.art.sha256}` : null,
    artist: card.artist,
    power: card.power,
    toughness: card.toughness,
    loyalty: card.loyalty,
    setCode: card.set,
    rarity: card.rarity,
    frameStyle: 'modern',
    borderColor: 'black',
    ...(entry.category === 'planeswalker' ? { rulesText: rules } : {}),
  };
  return {
    face,
    contentStatus: annotation.reviewed ? 'scan-reviewed' : 'oracle-unverified',
    cohort: annotation.cohort ?? 'corpus',
    annotation,
  };
}

/** Fixture adapter convenience; explicit reviewed runs override this heuristic. */
function reminderRuns(text) {
  return text
    .split(/(\([^)]*\))/g)
    .filter(Boolean)
    .map((text) => ({ text, italic: text.startsWith('(') }));
}
